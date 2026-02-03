import { describe, it, expect, beforeAll } from "vitest";
import { XMLParser, XMLValidator } from "fast-xml-parser";
import fs from "fs";
import path from "path";
import {
  isValidUrl,
  isValidRfc822Date,
  isValidEmail,
  extractEmailFromEditor,
  isValidLanguageCode,
} from "./helpers/rss-validators";
import { getAllFilesFrontMatter, FrontMatter } from "../../lib/blog";
import { siteMetadata } from "../../blog.config";

function isPublished(post: FrontMatter): boolean {
  if (post.draft) return false;
  const postDate = new Date(post.date);
  const now = new Date();
  postDate.setUTCHours(0, 0, 0, 0);
  now.setUTCHours(0, 0, 0, 0);
  return postDate <= now;
}

const RSS_PATH = path.join(process.cwd(), "build/client/rss.xml");

interface RssItem {
  title?: string;
  description?: string;
  link?: string;
  guid?: string | { "#text": string; "@_isPermaLink"?: string };
  pubDate?: string;
  author?: string;
  "dc:creator"?: string;
  category?: string | string[];
  "content:encoded"?: string;
}

interface RssChannel {
  title?: string;
  link?: string;
  description?: string;
  language?: string;
  copyright?: string;
  generator?: string;
  managingEditor?: string;
  lastBuildDate?: string;
  item?: RssItem | RssItem[];
  "atom:link"?: { "@_href"?: string; "@_rel"?: string; "@_type"?: string };
}

interface ParsedRss {
  "?xml"?: { "@_version"?: string; "@_encoding"?: string };
  rss?: {
    "@_version"?: string;
    "@_xmlns:content"?: string;
    "@_xmlns:atom"?: string;
    "@_xmlns:dc"?: string;
    channel?: RssChannel;
  };
}

describe("RSS Feed Validation", () => {
  let rssContent: string;
  let parsedRss: ParsedRss;

  beforeAll(() => {
    if (!fs.existsSync(RSS_PATH)) {
      throw new Error(
        `RSS file not found at ${RSS_PATH}. Run 'yarn build' first.`,
      );
    }
    rssContent = fs.readFileSync(RSS_PATH, "utf-8");

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    });
    parsedRss = parser.parse(rssContent);
  });

  describe("XML Syntax Validation", () => {
    it("should be valid XML", () => {
      const result = XMLValidator.validate(rssContent);
      expect(result).toBe(true);
    });

    it("should have XML declaration", () => {
      expect(rssContent).toMatch(/^<\?xml version="1\.0"/);
    });

    it("should use UTF-8 encoding", () => {
      expect(rssContent.toLowerCase()).toMatch(/encoding="utf-8"/);
    });
  });

  describe("RSS 2.0 Structure", () => {
    it("should have rss root element", () => {
      expect(parsedRss.rss).toBeDefined();
    });

    it("should have version 2.0 attribute", () => {
      expect(parsedRss.rss?.["@_version"]).toBe("2.0");
    });

    it("should have exactly one channel element", () => {
      expect(parsedRss.rss?.channel).toBeDefined();
      expect(Array.isArray(parsedRss.rss?.channel)).toBe(false);
    });
  });

  describe("Required Channel Elements", () => {
    it("should have title", () => {
      expect(parsedRss.rss?.channel?.title).toBeDefined();
      expect(typeof parsedRss.rss?.channel?.title).toBe("string");
      expect(parsedRss.rss?.channel?.title?.length).toBeGreaterThan(0);
    });

    it("should have link", () => {
      expect(parsedRss.rss?.channel?.link).toBeDefined();
    });

    it("should have description", () => {
      expect(parsedRss.rss?.channel?.description).toBeDefined();
    });
  });

  describe("Optional Channel Elements", () => {
    it("should have valid language code if present", () => {
      const language = parsedRss.rss?.channel?.language;
      if (language) {
        expect(isValidLanguageCode(language)).toBe(true);
      }
    });

    it("should have generator", () => {
      expect(parsedRss.rss?.channel?.generator).toBeDefined();
    });

    it("should have managingEditor with valid email format (RSS 2.0 spec)", () => {
      const editor = parsedRss.rss?.channel?.managingEditor;
      if (editor) {
        // RSS 2.0 spec: "Email address for person responsible for editorial content"
        // Expected format: "email@example.com (Name)" or just "email@example.com"
        const email = extractEmailFromEditor(editor);
        expect(
          email,
          `managingEditor should start with email, got: "${editor}"`,
        ).not.toBeNull();
        expect(
          isValidEmail(email!),
          `managingEditor should contain valid email, got: "${email}" from "${editor}"`,
        ).toBe(true);
      }
    });
  });

  describe("Item Elements", () => {
    function getItems(): RssItem[] {
      const items = parsedRss.rss?.channel?.item;
      if (!items) return [];
      return Array.isArray(items) ? items : [items];
    }

    it("should have at least one item", () => {
      const items = getItems();
      expect(items.length).toBeGreaterThan(0);
    });

    it("each item should have title or description (RSS 2.0 requirement)", () => {
      const items = getItems();
      items.forEach((item, index) => {
        const hasTitle = item.title !== undefined && item.title !== "";
        const hasDescription =
          item.description !== undefined && item.description !== "";
        expect(
          hasTitle || hasDescription,
          `Item ${index} must have title or description`,
        ).toBe(true);
      });
    });

    it("each item should have guid", () => {
      const items = getItems();
      items.forEach((item, index) => {
        expect(item.guid, `Item ${index} should have guid`).toBeDefined();
      });
    });

    it("each item should have pubDate", () => {
      const items = getItems();
      items.forEach((item, index) => {
        expect(item.pubDate, `Item ${index} should have pubDate`).toBeDefined();
      });
    });

    it("each item should have author or dc:creator", () => {
      const items = getItems();
      items.forEach((item, index) => {
        const hasAuthor = item.author !== undefined;
        const hasDcCreator = item["dc:creator"] !== undefined;
        expect(
          hasAuthor || hasDcCreator,
          `Item ${index} should have author or dc:creator`,
        ).toBe(true);
      });
    });
  });

  describe("URL Validation", () => {
    function getItems(): RssItem[] {
      const items = parsedRss.rss?.channel?.item;
      if (!items) return [];
      return Array.isArray(items) ? items : [items];
    }

    it("channel link should be valid URL", () => {
      const link = parsedRss.rss?.channel?.link;
      expect(link).toBeDefined();
      expect(isValidUrl(link!)).toBe(true);
    });

    it("all item links should be valid URLs", () => {
      const items = getItems();
      items.forEach((item, index) => {
        if (item.link) {
          expect(
            isValidUrl(item.link),
            `Item ${index} link should be valid URL: ${item.link}`,
          ).toBe(true);
        }
      });
    });

    it("all item guids should be valid URLs", () => {
      const items = getItems();
      items.forEach((item, index) => {
        const guid =
          typeof item.guid === "object" ? item.guid["#text"] : item.guid;
        if (guid) {
          expect(
            isValidUrl(guid),
            `Item ${index} guid should be valid URL: ${guid}`,
          ).toBe(true);
        }
      });
    });
  });

  describe("Date Validation", () => {
    function getItems(): RssItem[] {
      const items = parsedRss.rss?.channel?.item;
      if (!items) return [];
      return Array.isArray(items) ? items : [items];
    }

    it("all pubDate values should be valid RFC 822 dates", () => {
      const items = getItems();
      items.forEach((item, index) => {
        if (item.pubDate) {
          expect(
            isValidRfc822Date(item.pubDate),
            `Item ${index} pubDate should be RFC 822 format: ${item.pubDate}`,
          ).toBe(true);
        }
      });
    });
  });

  describe("Namespace Validation", () => {
    it("should declare content namespace", () => {
      expect(rssContent).toContain(
        'xmlns:content="http://purl.org/rss/1.0/modules/content/"',
      );
    });

    it("should declare atom namespace", () => {
      expect(rssContent).toContain('xmlns:atom="http://www.w3.org/2005/Atom"');
    });

    it("should have atom:link for feed self-reference", () => {
      expect(rssContent).toMatch(/atom:link[^>]*rel="self"/);
    });
  });

  describe("Content Validation", () => {
    function getItems(): RssItem[] {
      const items = parsedRss.rss?.channel?.item;
      if (!items) return [];
      return Array.isArray(items) ? items : [items];
    }

    it("content:encoded should contain HTML content", () => {
      const items = getItems();
      items.forEach((item, index) => {
        const content = item["content:encoded"];
        if (content) {
          expect(
            content.length,
            `Item ${index} content should not be empty`,
          ).toBeGreaterThan(0);
          expect(content, `Item ${index} content should contain HTML`).toMatch(
            /<\/?[a-z][\s\S]*>/i,
          );
        }
      });
    });

    it("content:encoded should have absolute URLs (no relative paths)", () => {
      const items = getItems();
      items.forEach((item, index) => {
        const content = item["content:encoded"];
        if (content) {
          // Check for relative URLs in src/href attributes (both regular and HTML-encoded quotes)
          // Matches: /path (but not //), ./path
          const relativeUrlRegex =
            /(?:src|href)=(?:"|&quot;)(\.?)\/((?!\/)[^"&]*)/g;
          const matches = [...content.matchAll(relativeUrlRegex)];
          expect(
            matches.length,
            `Item ${index} (${item.title}) has relative URLs: ${matches.map((m) => m[1] + "/" + m[2]).join(", ")}`,
          ).toBe(0);
        }
      });
    });
  });

  describe("Content Completeness", () => {
    function getItems(): RssItem[] {
      const items = parsedRss.rss?.channel?.item;
      if (!items) return [];
      return Array.isArray(items) ? items : [items];
    }

    function getItemGuid(item: RssItem): string | undefined {
      if (typeof item.guid === "object") {
        return item.guid["#text"];
      }
      return item.guid;
    }

    it("should include all published blog posts", () => {
      const posts = getAllFilesFrontMatter("blog").filter(isPublished);
      const items = getItems();

      posts.forEach((post) => {
        const expectedUrl = `${siteMetadata.siteUrl}/${post.slug}/`;
        const found = items.some((item) => getItemGuid(item) === expectedUrl);

        expect(
          found,
          `RSS should include post: ${post.slug} (${expectedUrl})`,
        ).toBe(true);
      });
    });

    it("should exclude future-dated posts", () => {
      const futurePosts = getAllFilesFrontMatter("blog").filter(
        (post) => !isPublished(post),
      );
      const items = getItems();

      futurePosts.forEach((post) => {
        const expectedUrl = `${siteMetadata.siteUrl}/${post.slug}/`;
        const found = items.some((item) => getItemGuid(item) === expectedUrl);

        expect(
          found,
          `RSS should NOT include future post: ${post.slug} (${expectedUrl})`,
        ).toBe(false);
      });
    });
  });
});
