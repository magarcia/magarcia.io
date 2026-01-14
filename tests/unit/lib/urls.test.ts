import { describe, it, expect } from "vitest";
import {
  buildPostUrl,
  buildEditUrl,
  buildDiscussUrl,
  getLocalizedPath,
  slugifyTag,
  buildTagUrl,
} from "~/lib/urls";

const SITE_URL = "https://magarcia.io";

describe("buildPostUrl", () => {
  it("should build URL for English post without language prefix", () => {
    const url = buildPostUrl("my-first-post");
    expect(url).toBe(`${SITE_URL}/my-first-post`);
  });

  it("should build URL for English post with explicit language", () => {
    const url = buildPostUrl("my-first-post", "en");
    expect(url).toBe(`${SITE_URL}/my-first-post`);
  });

  it("should build URL for Spanish post with language prefix", () => {
    const url = buildPostUrl("mi-primer-articulo", "es");
    expect(url).toBe(`${SITE_URL}/es/mi-primer-articulo`);
  });

  it("should build URL for Catalan post with language prefix", () => {
    const url = buildPostUrl("el-meu-primer-article", "ca");
    expect(url).toBe(`${SITE_URL}/ca/el-meu-primer-article`);
  });

  it("should handle slugs with special characters", () => {
    const url = buildPostUrl("my-post-2024", "en");
    expect(url).toBe(`${SITE_URL}/my-post-2024`);
  });
});

describe("buildEditUrl", () => {
  const GITHUB_BASE =
    "https://github.com/magarcia/magarcia.io/edit/main/data/blog";

  it("should build GitHub edit URL for English post", () => {
    const url = buildEditUrl("my-first-post");
    expect(url).toBe(`${GITHUB_BASE}/my-first-post.mdx`);
  });

  it("should build GitHub edit URL for English post with explicit language", () => {
    const url = buildEditUrl("my-first-post", "en");
    expect(url).toBe(`${GITHUB_BASE}/my-first-post.mdx`);
  });

  it("should build GitHub edit URL for Spanish post", () => {
    const url = buildEditUrl("mi-primer-articulo", "es");
    expect(url).toBe(`${GITHUB_BASE}/mi-primer-articulo.es.mdx`);
  });

  it("should build GitHub edit URL for Catalan post", () => {
    const url = buildEditUrl("el-meu-primer-article", "ca");
    expect(url).toBe(`${GITHUB_BASE}/el-meu-primer-article.ca.mdx`);
  });

  it("should use correct file extension format for localized posts", () => {
    const url = buildEditUrl("typescript-tips", "es");
    expect(url).toContain(".es.mdx");
    expect(url).not.toContain("/es/");
  });
});

describe("buildDiscussUrl", () => {
  it("should build X (Twitter) discussion URL for English post", () => {
    const url = buildDiscussUrl("my-first-post");
    const expectedUrl = encodeURIComponent(`${SITE_URL}/my-first-post`);
    expect(url).toBe(`https://x.com/search?q=${expectedUrl}`);
  });

  it("should build X (Twitter) discussion URL for English post with explicit language", () => {
    const url = buildDiscussUrl("my-first-post", "en");
    const expectedUrl = encodeURIComponent(`${SITE_URL}/my-first-post`);
    expect(url).toBe(`https://x.com/search?q=${expectedUrl}`);
  });

  it("should build X (Twitter) discussion URL for Spanish post", () => {
    const url = buildDiscussUrl("mi-primer-articulo", "es");
    const expectedUrl = encodeURIComponent(`${SITE_URL}/es/mi-primer-articulo`);
    expect(url).toBe(`https://x.com/search?q=${expectedUrl}`);
  });

  it("should properly encode URLs with special characters", () => {
    const url = buildDiscussUrl("my-post-2024", "en");
    expect(url).toContain("https://x.com/search?q=");
    expect(url).toContain(encodeURIComponent(`${SITE_URL}/my-post-2024`));
  });

  it("should use x.com domain", () => {
    const url = buildDiscussUrl("test-post");
    expect(url).toContain("x.com");
  });
});

describe("getLocalizedPath", () => {
  it("should return path unchanged for English", () => {
    const path = getLocalizedPath("/blog/my-post", "en");
    expect(path).toBe("/blog/my-post");
  });

  it("should return root path unchanged for English", () => {
    const path = getLocalizedPath("/", "en");
    expect(path).toBe("/");
  });

  it("should prepend language prefix for Spanish", () => {
    const path = getLocalizedPath("/blog/my-post", "es");
    expect(path).toBe("/es/blog/my-post");
  });

  it("should prepend language prefix for Catalan", () => {
    const path = getLocalizedPath("/blog/my-post", "ca");
    expect(path).toBe("/ca/blog/my-post");
  });

  it("should handle root path for non-English languages", () => {
    const path = getLocalizedPath("/", "es");
    expect(path).toBe("/es");
  });

  it("should handle paths without leading slash", () => {
    const path = getLocalizedPath("/blog/my-post", "es");
    expect(path).toBe("/es/blog/my-post");
  });
});

describe("slugifyTag", () => {
  it("converts to lowercase", () => {
    expect(slugifyTag("JavaScript")).toBe("javascript");
  });

  it("replaces spaces with hyphens", () => {
    expect(slugifyTag("Developer Tools")).toBe("developer-tools");
  });

  it("collapses multiple spaces to single hyphen", () => {
    expect(slugifyTag("Object  Oriented")).toBe("object-oriented");
  });

  it("handles single word tags", () => {
    expect(slugifyTag("React")).toBe("react");
  });

  it("handles tags with numbers", () => {
    expect(slugifyTag("ES2024")).toBe("es2024");
  });

  it("handles already lowercase tags", () => {
    expect(slugifyTag("typescript")).toBe("typescript");
  });

  it("replaces dots with hyphens", () => {
    expect(slugifyTag("Node.js")).toBe("node-js");
  });

  it("handles tags with multiple special characters", () => {
    expect(slugifyTag("C++")).toBe("c");
    expect(slugifyTag("C#")).toBe("c");
  });

  it("collapses multiple consecutive hyphens", () => {
    expect(slugifyTag("Node.js & More")).toBe("node-js-more");
  });

  it("removes leading and trailing hyphens", () => {
    expect(slugifyTag(".NET")).toBe("net");
  });
});

describe("buildTagUrl", () => {
  it("builds English tag URL without language prefix", () => {
    const url = buildTagUrl("JavaScript");
    expect(url).toBe("/tags/javascript");
  });

  it("builds English tag URL with explicit language", () => {
    const url = buildTagUrl("JavaScript", "en");
    expect(url).toBe("/tags/javascript");
  });

  it("builds Spanish tag URL with language prefix", () => {
    const url = buildTagUrl("JavaScript", "es");
    expect(url).toBe("/es/tags/javascript");
  });

  it("builds Catalan tag URL with language prefix", () => {
    const url = buildTagUrl("JavaScript", "ca");
    expect(url).toBe("/ca/tags/javascript");
  });

  it("slugifies multi-word tags", () => {
    const url = buildTagUrl("Developer Tools", "en");
    expect(url).toBe("/tags/developer-tools");
  });

  it("slugifies multi-word tags with language prefix", () => {
    const url = buildTagUrl("Developer Tools", "es");
    expect(url).toBe("/es/tags/developer-tools");
  });
});
