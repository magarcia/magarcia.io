import { describe, it, expect, beforeAll } from "vitest";
import { XMLParser, XMLValidator } from "fast-xml-parser";
import fs from "fs";
import path from "path";
import {
  isValidUrl,
  isValidPriority,
  isValidChangefreq,
  isValidLastmod,
} from "../helpers/sitemap-validators";
import {
  getAllFilesFrontMatter,
  getAllTags,
  FrontMatter,
} from "../../../lib/blog";
import { slugifyTag } from "../../../lib/urls";
import { siteMetadata } from "../../../blog.config";

function isPublished(post: FrontMatter): boolean {
  if (post.draft) return false;
  const postDate = new Date(post.date);
  const now = new Date();
  postDate.setUTCHours(0, 0, 0, 0);
  now.setUTCHours(0, 0, 0, 0);
  return postDate <= now;
}

const SITEMAP_PATH = path.join(process.cwd(), "build/client/sitemap.xml");

interface SitemapUrl {
  loc?: string;
  changefreq?: string;
  priority?: number;
  lastmod?: string;
}

interface ParsedSitemap {
  "?xml"?: { "@_version"?: string; "@_encoding"?: string };
  urlset?: {
    "@_xmlns"?: string;
    url?: SitemapUrl | SitemapUrl[];
  };
}

describe("Sitemap Generation", () => {
  let sitemapContent: string;
  let parsedSitemap: ParsedSitemap;

  beforeAll(() => {
    if (!fs.existsSync(SITEMAP_PATH)) {
      throw new Error(
        `Sitemap file not found at ${SITEMAP_PATH}. Run 'yarn build' first.`,
      );
    }
    sitemapContent = fs.readFileSync(SITEMAP_PATH, "utf-8");

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    });
    parsedSitemap = parser.parse(sitemapContent);
  });

  describe("XML Structure Validation", () => {
    it("should be valid XML", () => {
      const result = XMLValidator.validate(sitemapContent);
      expect(result).toBe(true);
    });

    it("should have XML declaration", () => {
      expect(sitemapContent).toMatch(/^<\?xml version="1\.0"/);
    });

    it("should use UTF-8 encoding", () => {
      expect(sitemapContent.toLowerCase()).toMatch(/encoding="utf-8"/);
    });

    it("should have urlset root element", () => {
      expect(parsedSitemap.urlset).toBeDefined();
    });

    it("should have correct namespace", () => {
      expect(parsedSitemap.urlset?.["@_xmlns"]).toBe(
        "http://www.sitemaps.org/schemas/sitemap/0.9",
      );
    });
  });

  describe("URL Structure Validation", () => {
    function getUrls(): SitemapUrl[] {
      const urls = parsedSitemap.urlset?.url;
      if (!urls) return [];
      return Array.isArray(urls) ? urls : [urls];
    }

    it("should have at least one URL entry", () => {
      const urls = getUrls();
      expect(urls.length).toBeGreaterThan(0);
    });

    it("all URLs should have a loc element", () => {
      const urls = getUrls();
      urls.forEach((url, index) => {
        expect(url.loc, `URL ${index} should have loc element`).toBeDefined();
        expect(typeof url.loc, `URL ${index} loc should be string`).toBe(
          "string",
        );
        expect(
          url.loc!.length,
          `URL ${index} loc should not be empty`,
        ).toBeGreaterThan(0);
      });
    });
  });

  describe("URL Format Validation", () => {
    function getUrls(): SitemapUrl[] {
      const urls = parsedSitemap.urlset?.url;
      if (!urls) return [];
      return Array.isArray(urls) ? urls : [urls];
    }

    it("all loc values should be valid absolute URLs", () => {
      const urls = getUrls();
      urls.forEach((url, index) => {
        if (url.loc) {
          expect(
            isValidUrl(url.loc),
            `URL ${index} loc should be valid URL: ${url.loc}`,
          ).toBe(true);
        }
      });
    });

    it("all URLs should use the correct base domain", () => {
      const urls = getUrls();
      urls.forEach((url, index) => {
        if (url.loc) {
          expect(
            url.loc.startsWith(siteMetadata.siteUrl),
            `URL ${index} should start with ${siteMetadata.siteUrl}: ${url.loc}`,
          ).toBe(true);
        }
      });
    });
  });

  describe("Priority Validation", () => {
    function getUrls(): SitemapUrl[] {
      const urls = parsedSitemap.urlset?.url;
      if (!urls) return [];
      return Array.isArray(urls) ? urls : [urls];
    }

    it("all priority values should be within valid range (0.0-1.0)", () => {
      const urls = getUrls();
      urls.forEach((url, index) => {
        if (url.priority !== undefined) {
          expect(
            isValidPriority(url.priority),
            `URL ${index} priority should be 0.0-1.0: ${url.priority}`,
          ).toBe(true);
        }
      });
    });

    it("homepage should have highest priority (1.0)", () => {
      const urls = getUrls();
      const homepage = urls.find((url) => url.loc === siteMetadata.siteUrl);

      expect(homepage, "Homepage should be present in sitemap").toBeDefined();
      expect(homepage?.priority, "Homepage priority should be 1.0").toBe(1);
    });

    it("blog posts should have priority 0.7", () => {
      const posts = getAllFilesFrontMatter("blog");
      const urls = getUrls();

      posts.forEach((post) => {
        const postUrl = urls.find(
          (url) => url.loc === `${siteMetadata.siteUrl}/${post.slug}/`,
        );

        if (postUrl) {
          expect(
            postUrl.priority,
            `Post ${post.slug} should have priority 0.7`,
          ).toBe(0.7);
        }
      });
    });

    it("tag pages should have priority 0.3", () => {
      const tags = getAllTags("blog");
      const urls = getUrls();

      tags.forEach((tag) => {
        const tagSlug = slugifyTag(tag);
        const tagUrl = urls.find(
          (url) => url.loc === `${siteMetadata.siteUrl}/tags/${tagSlug}/`,
        );

        if (tagUrl) {
          expect(tagUrl.priority, `Tag ${tag} should have priority 0.3`).toBe(
            0.3,
          );
        }
      });
    });
  });

  describe("Changefreq Validation", () => {
    function getUrls(): SitemapUrl[] {
      const urls = parsedSitemap.urlset?.url;
      if (!urls) return [];
      return Array.isArray(urls) ? urls : [urls];
    }

    it("all changefreq values should be valid", () => {
      const urls = getUrls();
      urls.forEach((url, index) => {
        if (url.changefreq) {
          expect(
            isValidChangefreq(url.changefreq),
            `URL ${index} changefreq should be valid: ${url.changefreq}`,
          ).toBe(true);
        }
      });
    });

    it("homepage should have 'daily' changefreq", () => {
      const urls = getUrls();
      const homepage = urls.find((url) => url.loc === siteMetadata.siteUrl);

      expect(
        homepage?.changefreq,
        "Homepage changefreq should be 'daily'",
      ).toBe("daily");
    });

    it("blog posts should have 'monthly' changefreq", () => {
      const posts = getAllFilesFrontMatter("blog");
      const urls = getUrls();

      posts.forEach((post) => {
        const postUrl = urls.find(
          (url) => url.loc === `${siteMetadata.siteUrl}/${post.slug}/`,
        );

        if (postUrl) {
          expect(
            postUrl.changefreq,
            `Post ${post.slug} should have 'monthly' changefreq`,
          ).toBe("monthly");
        }
      });
    });
  });

  describe("Lastmod Validation", () => {
    function getUrls(): SitemapUrl[] {
      const urls = parsedSitemap.urlset?.url;
      if (!urls) return [];
      return Array.isArray(urls) ? urls : [urls];
    }

    it("all lastmod values should be valid ISO 8601 dates if present", () => {
      const urls = getUrls();
      urls.forEach((url, index) => {
        if (url.lastmod) {
          expect(
            isValidLastmod(url.lastmod),
            `URL ${index} lastmod should be ISO 8601 format: ${url.lastmod}`,
          ).toBe(true);
        }
      });
    });
  });

  describe("Content Completeness", () => {
    function getUrls(): SitemapUrl[] {
      const urls = parsedSitemap.urlset?.url;
      if (!urls) return [];
      return Array.isArray(urls) ? urls : [urls];
    }

    it("should include all published blog posts", () => {
      const posts = getAllFilesFrontMatter("blog").filter(isPublished);
      const urls = getUrls();

      posts.forEach((post) => {
        const expectedUrl = `${siteMetadata.siteUrl}/${post.slug}/`;
        const found = urls.some((url) => url.loc === expectedUrl);

        expect(
          found,
          `Sitemap should include post: ${post.slug} (${expectedUrl})`,
        ).toBe(true);
      });
    });

    it("should exclude future-dated posts", () => {
      const futurePosts = getAllFilesFrontMatter("blog").filter(
        (post) => !isPublished(post),
      );
      const urls = getUrls();

      futurePosts.forEach((post) => {
        const expectedUrl = `${siteMetadata.siteUrl}/${post.slug}/`;
        const found = urls.some((url) => url.loc === expectedUrl);

        expect(
          found,
          `Sitemap should NOT include future post: ${post.slug} (${expectedUrl})`,
        ).toBe(false);
      });
    });

    it("should include all tag pages", () => {
      const tags = getAllTags("blog");
      const urls = getUrls();

      tags.forEach((tag) => {
        const expectedUrl = `${siteMetadata.siteUrl}/tags/${slugifyTag(tag)}/`;
        const found = urls.some((url) => url.loc === expectedUrl);

        expect(
          found,
          `Sitemap should include tag page: ${tag} (${expectedUrl})`,
        ).toBe(true);
      });
    });

    it("should include the homepage", () => {
      const urls = getUrls();
      const homepage = urls.find((url) => url.loc === siteMetadata.siteUrl);

      expect(homepage, "Sitemap should include homepage").toBeDefined();
    });
  });
});
