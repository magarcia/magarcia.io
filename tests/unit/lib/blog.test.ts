import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getFileBySlug,
  getAllFilesFrontMatter,
  getAllFiles,
  getAllTags,
  getPostsByTag,
  isValidSlug,
  isValidLang,
  validateSlug,
  validateLang,
  type FrontMatter,
  type BlogPost,
  type BlogPostWithNavigation,
} from "~/lib/blog";

vi.mock("fs", () => ({
  default: {
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
    readdirSync: vi.fn(),
  },
}));

import fs from "fs";

const mockFs = {
  existsSync: vi.mocked(fs.existsSync),
  readFileSync: vi.mocked(fs.readFileSync),
  readdirSync: vi.mocked(fs.readdirSync),
};

const createMarkdown = (frontmatter: Record<string, unknown>, content = "This is test content.") => {
  const frontmatterString = Object.entries(frontmatter)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}: [${value.map(v => `"${v}"`).join(", ")}]`;
      }
      if (typeof value === "string") {
        return `${key}: "${value}"`;
      }
      return `${key}: ${value}`;
    })
    .join("\n");

  return `---
${frontmatterString}
---

${content}`;
};

describe("blog.ts", () => {
  const originalEnv = process.env.NODE_ENV;
  const originalCwd = process.cwd();

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NODE_ENV = "development";
    vi.spyOn(process, "cwd").mockReturnValue("/test");
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    vi.restoreAllMocks();
  });

  describe("isValidSlug", () => {
    it("accepts valid slugs", () => {
      expect(isValidSlug("hello-world")).toBe(true);
      expect(isValidSlug("test")).toBe(true);
      expect(isValidSlug("my-post-123")).toBe(true);
      expect(isValidSlug("POST")).toBe(true);
    });

    it("rejects invalid slugs", () => {
      expect(isValidSlug("")).toBe(false);
      expect(isValidSlug("../etc/passwd")).toBe(false);
      expect(isValidSlug("hello world")).toBe(false);
      expect(isValidSlug("hello_world")).toBe(false);
      expect(isValidSlug("hello/world")).toBe(false);
      expect(isValidSlug("-invalid")).toBe(false);
      expect(isValidSlug("invalid-")).toBe(false);
    });

    it("rejects slugs that are too long", () => {
      const longSlug = "a".repeat(201);
      expect(isValidSlug(longSlug)).toBe(false);
    });
  });

  describe("isValidLang", () => {
    it("accepts valid language codes", () => {
      expect(isValidLang("en")).toBe(true);
      expect(isValidLang("es")).toBe(true);
      expect(isValidLang("ca")).toBe(true);
    });

    it("rejects invalid language codes", () => {
      expect(isValidLang("fr")).toBe(false);
      expect(isValidLang("")).toBe(false);
      expect(isValidLang("english")).toBe(false);
    });
  });

  describe("validateSlug", () => {
    it("does not throw for valid slugs", () => {
      expect(() => validateSlug("valid-slug")).not.toThrow();
    });

    it("throws for invalid slugs", () => {
      expect(() => validateSlug("../invalid")).toThrow("Invalid slug format");
    });
  });

  describe("validateLang", () => {
    it("does not throw for valid languages", () => {
      expect(() => validateLang("en")).not.toThrow();
    });

    it("throws for invalid languages", () => {
      expect(() => validateLang("fr")).toThrow("Invalid language code");
    });
  });

  describe("getFileBySlug", () => {
    it("should load a post with .mdx extension for the specified language", () => {
      const markdown = createMarkdown({
        title: "Test Post",
        date: "2024-01-01",
        spoiler: "Test spoiler",
        tags: ["javascript", "testing"],
      });

      mockFs.existsSync.mockImplementation((path: fs.PathLike) => {
        return path.toString().includes("test-slug.es.mdx");
      });

      mockFs.readFileSync.mockReturnValue(markdown);
      mockFs.readdirSync.mockReturnValue(["test-slug.es.mdx"] as unknown as fs.Dirent[]);

      const result = getFileBySlug("blog", "test-slug", "es");

      expect(result.frontMatter.title).toBe("Test Post");
      expect(result.frontMatter.slug).toBe("test-slug");
      expect(result.content).toContain("This is test content.");
      expect(mockFs.existsSync).toHaveBeenCalledWith(expect.stringContaining("test-slug.es.mdx"));
    });

    it("should load a post with .md extension for the specified language", () => {
      const markdown = createMarkdown({
        title: "Test Post MD",
        date: "2024-01-01",
        spoiler: "Test spoiler",
        tags: ["markdown"],
      });

      mockFs.existsSync.mockImplementation((path: fs.PathLike) => {
        const pathStr = path.toString();
        return pathStr.includes("test-slug.ca.md") && !pathStr.includes(".mdx");
      });

      mockFs.readFileSync.mockReturnValue(markdown);
      mockFs.readdirSync.mockReturnValue(["test-slug.ca.md"] as unknown as fs.Dirent[]);

      const result = getFileBySlug("blog", "test-slug", "ca");

      expect(result.frontMatter.title).toBe("Test Post MD");
      expect(mockFs.existsSync).toHaveBeenCalledWith(expect.stringContaining("test-slug.ca.md"));
    });

    it("should fallback to default language when language-specific file not found", () => {
      const markdown = createMarkdown({
        title: "English Fallback",
        date: "2024-01-01",
        spoiler: "Test spoiler",
        tags: ["english"],
      });

      mockFs.existsSync.mockImplementation((path: fs.PathLike) => {
        const pathStr = path.toString();
        return pathStr.includes("test-slug.mdx") && !pathStr.includes(".es.") && !pathStr.includes(".ca.");
      });

      mockFs.readFileSync.mockReturnValue(markdown);
      mockFs.readdirSync.mockReturnValue(["test-slug.mdx"] as unknown as fs.Dirent[]);

      const result = getFileBySlug("blog", "test-slug", "es");

      expect(result.frontMatter.title).toBe("English Fallback");
      expect(mockFs.existsSync).toHaveBeenCalledWith(expect.stringContaining("test-slug.mdx"));
    });

    it("should throw error when no file found for slug", () => {
      mockFs.existsSync.mockReturnValue(false);

      expect(() => getFileBySlug("blog", "non-existent", "en")).toThrow(
        "Post not found"
      );
    });

    it("should include prev and next navigation links", () => {
      const post1 = createMarkdown({
        title: "Post 1",
        date: "2024-01-03",
        spoiler: "First post",
        tags: ["test"],
      });

      const post2 = createMarkdown({
        title: "Post 2",
        date: "2024-01-02",
        spoiler: "Second post",
        tags: ["test"],
      });

      const post3 = createMarkdown({
        title: "Post 3",
        date: "2024-01-01",
        spoiler: "Third post",
        tags: ["test"],
      });

      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([
        "post-1.mdx",
        "post-2.mdx",
        "post-3.mdx",
      ] as unknown as fs.Dirent[]);

      mockFs.readFileSync.mockImplementation((path: fs.PathLike) => {
        const pathStr = path.toString();
        if (pathStr.includes("post-1")) return post1;
        if (pathStr.includes("post-2")) return post2;
        if (pathStr.includes("post-3")) return post3;
        return "";
      });

      const result = getFileBySlug("blog", "post-2", "en");

      expect(result.prev).not.toBeNull();
      expect(result.next).not.toBeNull();
      expect(result.prev?.slug).toBe("post-3");
      expect(result.next?.slug).toBe("post-1");
    });

    it("should have null prev when at oldest post", () => {
      const post1 = createMarkdown({
        title: "Post 1",
        date: "2024-01-02",
        spoiler: "Newer post",
        tags: ["test"],
      });

      const post2 = createMarkdown({
        title: "Post 2",
        date: "2024-01-01",
        spoiler: "Oldest post",
        tags: ["test"],
      });

      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(["post-1.mdx", "post-2.mdx"] as unknown as fs.Dirent[]);

      mockFs.readFileSync.mockImplementation((path: fs.PathLike) => {
        const pathStr = path.toString();
        if (pathStr.includes("post-1")) return post1;
        if (pathStr.includes("post-2")) return post2;
        return "";
      });

      const result = getFileBySlug("blog", "post-2", "en");

      expect(result.prev).toBeNull();
      expect(result.next?.slug).toBe("post-1");
    });

    it("should have null next when at newest post", () => {
      const post1 = createMarkdown({
        title: "Post 1",
        date: "2024-01-02",
        spoiler: "Newest post",
        tags: ["test"],
      });

      const post2 = createMarkdown({
        title: "Post 2",
        date: "2024-01-01",
        spoiler: "Older post",
        tags: ["test"],
      });

      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(["post-1.mdx", "post-2.mdx"] as unknown as fs.Dirent[]);

      mockFs.readFileSync.mockImplementation((path: fs.PathLike) => {
        const pathStr = path.toString();
        if (pathStr.includes("post-1")) return post1;
        if (pathStr.includes("post-2")) return post2;
        return "";
      });

      const result = getFileBySlug("blog", "post-1", "en");

      expect(result.prev?.slug).toBe("post-2");
      expect(result.next).toBeNull();
    });

    it("should calculate word count and reading time", () => {
      const longContent = "word ".repeat(500);
      const markdown = createMarkdown(
        {
          title: "Long Post",
          date: "2024-01-01",
          spoiler: "Long content",
          tags: ["test"],
        },
        longContent
      );

      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(markdown);
      mockFs.readdirSync.mockReturnValue(["test-slug.mdx"] as unknown as fs.Dirent[]);

      const result = getFileBySlug("blog", "test-slug", "en");

      expect(result.frontMatter.wordCount).toBeGreaterThan(0);
      expect(result.frontMatter.readingTime).toBeDefined();
      expect(result.frontMatter.readingTime.minutes).toBeGreaterThan(0);
    });
  });

  describe("getAllFilesFrontMatter", () => {
    it("should return all posts with frontmatter sorted by date descending", () => {
      const post1 = createMarkdown({
        title: "Post 1",
        date: "2024-01-03",
        spoiler: "Third post",
        tags: ["test"],
      });

      const post2 = createMarkdown({
        title: "Post 2",
        date: "2024-01-02",
        spoiler: "Second post",
        tags: ["test"],
      });

      const post3 = createMarkdown({
        title: "Post 3",
        date: "2024-01-01",
        spoiler: "First post",
        tags: ["test"],
      });

      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([
        "post-3.mdx",
        "post-1.mdx",
        "post-2.mdx",
      ] as unknown as fs.Dirent[]);

      mockFs.readFileSync.mockImplementation((path: fs.PathLike) => {
        const pathStr = path.toString();
        if (pathStr.includes("post-1")) return post1;
        if (pathStr.includes("post-2")) return post2;
        if (pathStr.includes("post-3")) return post3;
        return "";
      });

      const results = getAllFilesFrontMatter("blog", "en");

      expect(results).toHaveLength(3);
      expect(results[0].title).toBe("Post 1");
      expect(results[1].title).toBe("Post 2");
      expect(results[2].title).toBe("Post 3");
    });

    it("should filter out draft posts in production", () => {
      process.env.NODE_ENV = "production";

      const publishedPost = createMarkdown({
        title: "Published Post",
        date: "2024-01-02",
        spoiler: "Published",
        tags: ["test"],
        draft: false,
      });

      const draftPost = createMarkdown({
        title: "Draft Post",
        date: "2024-01-01",
        spoiler: "Draft",
        tags: ["test"],
        draft: true,
      });

      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([
        "published.mdx",
        "draft.mdx",
      ] as unknown as fs.Dirent[]);

      mockFs.readFileSync.mockImplementation((path: fs.PathLike) => {
        const pathStr = path.toString();
        if (pathStr.includes("published")) return publishedPost;
        if (pathStr.includes("draft")) return draftPost;
        return "";
      });

      const results = getAllFilesFrontMatter("blog", "en");

      expect(results).toHaveLength(1);
      expect(results[0].title).toBe("Published Post");
    });

    it("should include draft posts in development", () => {
      process.env.NODE_ENV = "development";

      const publishedPost = createMarkdown({
        title: "Published Post",
        date: "2024-01-02",
        spoiler: "Published",
        tags: ["test"],
        draft: false,
      });

      const draftPost = createMarkdown({
        title: "Draft Post",
        date: "2024-01-01",
        spoiler: "Draft",
        tags: ["test"],
        draft: true,
      });

      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([
        "published.mdx",
        "draft.mdx",
      ] as unknown as fs.Dirent[]);

      mockFs.readFileSync.mockImplementation((path: fs.PathLike) => {
        const pathStr = path.toString();
        if (pathStr.includes("published")) return publishedPost;
        if (pathStr.includes("draft")) return draftPost;
        return "";
      });

      const results = getAllFilesFrontMatter("blog", "en");

      expect(results).toHaveLength(2);
      expect(results.map(r => r.title)).toContain("Draft Post");
    });

    it("should handle multiple language files and return unique slugs", () => {
      const enPost = createMarkdown({
        title: "English Post",
        date: "2024-01-01",
        spoiler: "English",
        tags: ["test"],
      });

      const esPost = createMarkdown({
        title: "Spanish Post",
        date: "2024-01-01",
        spoiler: "Spanish",
        tags: ["test"],
      });

      mockFs.readdirSync.mockReturnValue([
        "post-1.mdx",
        "post-1.es.mdx",
      ] as unknown as fs.Dirent[]);

      mockFs.existsSync.mockImplementation((path: fs.PathLike) => {
        const pathStr = path.toString();
        return pathStr.includes("post-1.es.mdx") || pathStr.includes("post-1.mdx");
      });

      mockFs.readFileSync.mockImplementation((path: fs.PathLike) => {
        const pathStr = path.toString();
        if (pathStr.includes(".es.")) return esPost;
        return enPost;
      });

      const results = getAllFilesFrontMatter("blog", "es");

      expect(results).toHaveLength(1);
      expect(results[0].title).toBe("Spanish Post");
    });

    it("should fallback to default language when language-specific file not available", () => {
      const enPost = createMarkdown({
        title: "English Post",
        date: "2024-01-01",
        spoiler: "English",
        tags: ["test"],
      });

      mockFs.readdirSync.mockReturnValue(["post-1.mdx"] as unknown as fs.Dirent[]);

      mockFs.existsSync.mockImplementation((path: fs.PathLike) => {
        const pathStr = path.toString();
        return pathStr.includes("post-1.mdx") && !pathStr.includes(".es.");
      });

      mockFs.readFileSync.mockReturnValue(enPost);

      const results = getAllFilesFrontMatter("blog", "es");

      expect(results).toHaveLength(1);
      expect(results[0].title).toBe("English Post");
    });

    it("should skip files that don't exist", () => {
      mockFs.readdirSync.mockReturnValue([
        "existing.mdx",
        "non-existent.mdx",
      ] as unknown as fs.Dirent[]);

      mockFs.existsSync.mockImplementation((path: fs.PathLike) => {
        return path.toString().includes("existing");
      });

      mockFs.readFileSync.mockReturnValue(createMarkdown({
        title: "Existing Post",
        date: "2024-01-01",
        spoiler: "Exists",
        tags: ["test"],
      }));

      const results = getAllFilesFrontMatter("blog", "en");

      expect(results).toHaveLength(1);
      expect(results[0].title).toBe("Existing Post");
    });
  });

  describe("getAllFiles", () => {
    it("should return all posts with full content", () => {
      const post1 = createMarkdown(
        {
          title: "Post 1",
          date: "2024-01-02",
          spoiler: "First post",
          tags: ["test"],
        },
        "Content of post 1"
      );

      const post2 = createMarkdown(
        {
          title: "Post 2",
          date: "2024-01-01",
          spoiler: "Second post",
          tags: ["test"],
        },
        "Content of post 2"
      );

      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(["post-1.mdx", "post-2.mdx"] as unknown as fs.Dirent[]);

      mockFs.readFileSync.mockImplementation((path: fs.PathLike) => {
        const pathStr = path.toString();
        if (pathStr.includes("post-1")) return post1;
        if (pathStr.includes("post-2")) return post2;
        return "";
      });

      const results = getAllFiles("blog", "en");

      expect(results).toHaveLength(2);
      expect(results[0].content).toContain("Content of post 1");
      expect(results[1].content).toContain("Content of post 2");
      expect(results[0].frontMatter.title).toBe("Post 1");
      expect(results[1].frontMatter.title).toBe("Post 2");
    });

    it("should filter out draft posts in production", () => {
      process.env.NODE_ENV = "production";

      const publishedPost = createMarkdown(
        {
          title: "Published Post",
          date: "2024-01-02",
          spoiler: "Published",
          tags: ["test"],
          draft: false,
        },
        "Published content"
      );

      const draftPost = createMarkdown(
        {
          title: "Draft Post",
          date: "2024-01-01",
          spoiler: "Draft",
          tags: ["test"],
          draft: true,
        },
        "Draft content"
      );

      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([
        "published.mdx",
        "draft.mdx",
      ] as unknown as fs.Dirent[]);

      mockFs.readFileSync.mockImplementation((path: fs.PathLike) => {
        const pathStr = path.toString();
        if (pathStr.includes("published")) return publishedPost;
        if (pathStr.includes("draft")) return draftPost;
        return "";
      });

      const results = getAllFiles("blog", "en");

      expect(results).toHaveLength(1);
      expect(results[0].frontMatter.title).toBe("Published Post");
      expect(results[0].content).toContain("Published content");
    });

    it("should sort posts by date descending", () => {
      const post1 = createMarkdown({
        title: "Newest Post",
        date: "2024-01-03",
        spoiler: "Newest",
        tags: ["test"],
      });

      const post2 = createMarkdown({
        title: "Middle Post",
        date: "2024-01-02",
        spoiler: "Middle",
        tags: ["test"],
      });

      const post3 = createMarkdown({
        title: "Oldest Post",
        date: "2024-01-01",
        spoiler: "Oldest",
        tags: ["test"],
      });

      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([
        "post-3.mdx",
        "post-1.mdx",
        "post-2.mdx",
      ] as unknown as fs.Dirent[]);

      mockFs.readFileSync.mockImplementation((path: fs.PathLike) => {
        const pathStr = path.toString();
        if (pathStr.includes("post-1")) return post1;
        if (pathStr.includes("post-2")) return post2;
        if (pathStr.includes("post-3")) return post3;
        return "";
      });

      const results = getAllFiles("blog", "en");

      expect(results[0].frontMatter.title).toBe("Newest Post");
      expect(results[1].frontMatter.title).toBe("Middle Post");
      expect(results[2].frontMatter.title).toBe("Oldest Post");
    });
  });

  describe("getAllTags", () => {
    it("should return all unique tags sorted alphabetically", () => {
      const post1 = createMarkdown({
        title: "Post 1",
        date: "2024-01-01",
        spoiler: "First",
        tags: ["javascript", "testing", "react"],
      });

      const post2 = createMarkdown({
        title: "Post 2",
        date: "2024-01-02",
        spoiler: "Second",
        tags: ["typescript", "testing"],
      });

      const post3 = createMarkdown({
        title: "Post 3",
        date: "2024-01-03",
        spoiler: "Third",
        tags: ["react", "performance"],
      });

      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([
        "post-1.mdx",
        "post-2.mdx",
        "post-3.mdx",
      ] as unknown as fs.Dirent[]);

      mockFs.readFileSync.mockImplementation((path: fs.PathLike) => {
        const pathStr = path.toString();
        if (pathStr.includes("post-1")) return post1;
        if (pathStr.includes("post-2")) return post2;
        if (pathStr.includes("post-3")) return post3;
        return "";
      });

      const tags = getAllTags("blog", "en");

      expect(tags).toEqual([
        "javascript",
        "performance",
        "react",
        "testing",
        "typescript",
      ]);
    });

    it("should handle posts without tags", () => {
      const post1 = createMarkdown({
        title: "Post 1",
        date: "2024-01-01",
        spoiler: "First",
        tags: ["javascript"],
      });

      const post2 = createMarkdown({
        title: "Post 2",
        date: "2024-01-02",
        spoiler: "Second",
        tags: [],
      });

      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(["post-1.mdx", "post-2.mdx"] as unknown as fs.Dirent[]);

      mockFs.readFileSync.mockImplementation((path: fs.PathLike) => {
        const pathStr = path.toString();
        if (pathStr.includes("post-1")) return post1;
        if (pathStr.includes("post-2")) return post2;
        return "";
      });

      const tags = getAllTags("blog", "en");

      expect(tags).toEqual(["javascript"]);
    });

    it("should return empty array when no posts have tags", () => {
      const post = createMarkdown({
        title: "Post",
        date: "2024-01-01",
        spoiler: "No tags",
        tags: [],
      });

      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(["post.mdx"] as unknown as fs.Dirent[]);
      mockFs.readFileSync.mockReturnValue(post);

      const tags = getAllTags("blog", "en");

      expect(tags).toEqual([]);
    });

    it("should deduplicate tags across posts", () => {
      const post1 = createMarkdown({
        title: "Post 1",
        date: "2024-01-01",
        spoiler: "First",
        tags: ["javascript", "react"],
      });

      const post2 = createMarkdown({
        title: "Post 2",
        date: "2024-01-02",
        spoiler: "Second",
        tags: ["javascript", "react"],
      });

      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(["post-1.mdx", "post-2.mdx"] as unknown as fs.Dirent[]);

      mockFs.readFileSync.mockImplementation((path: fs.PathLike) => {
        const pathStr = path.toString();
        if (pathStr.includes("post-1")) return post1;
        if (pathStr.includes("post-2")) return post2;
        return "";
      });

      const tags = getAllTags("blog", "en");

      expect(tags).toEqual(["javascript", "react"]);
    });
  });

  describe("getPostsByTag", () => {
    it("should return posts filtered by tag", () => {
      const post1 = createMarkdown({
        title: "React Post",
        date: "2024-01-01",
        spoiler: "About React",
        tags: ["react", "javascript"],
      });

      const post2 = createMarkdown({
        title: "TypeScript Post",
        date: "2024-01-02",
        spoiler: "About TypeScript",
        tags: ["typescript", "javascript"],
      });

      const post3 = createMarkdown({
        title: "Another React Post",
        date: "2024-01-03",
        spoiler: "More React",
        tags: ["react", "hooks"],
      });

      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([
        "post-1.mdx",
        "post-2.mdx",
        "post-3.mdx",
      ] as unknown as fs.Dirent[]);

      mockFs.readFileSync.mockImplementation((path: fs.PathLike) => {
        const pathStr = path.toString();
        if (pathStr.includes("post-1")) return post1;
        if (pathStr.includes("post-2")) return post2;
        if (pathStr.includes("post-3")) return post3;
        return "";
      });

      const reactPosts = getPostsByTag("blog", "react", "en");

      expect(reactPosts).toHaveLength(2);
      expect(reactPosts[0].title).toBe("Another React Post");
      expect(reactPosts[1].title).toBe("React Post");
    });

    it("should return empty array when tag not found", () => {
      const post = createMarkdown({
        title: "Post",
        date: "2024-01-01",
        spoiler: "Test",
        tags: ["javascript"],
      });

      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(["post.mdx"] as unknown as fs.Dirent[]);
      mockFs.readFileSync.mockReturnValue(post);

      const result = getPostsByTag("blog", "nonexistent", "en");

      expect(result).toEqual([]);
    });

    it("should return posts sorted by date descending", () => {
      const post1 = createMarkdown({
        title: "Old Post",
        date: "2024-01-01",
        spoiler: "Old",
        tags: ["javascript"],
      });

      const post2 = createMarkdown({
        title: "New Post",
        date: "2024-01-03",
        spoiler: "New",
        tags: ["javascript"],
      });

      const post3 = createMarkdown({
        title: "Middle Post",
        date: "2024-01-02",
        spoiler: "Middle",
        tags: ["javascript"],
      });

      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([
        "post-1.mdx",
        "post-2.mdx",
        "post-3.mdx",
      ] as unknown as fs.Dirent[]);

      mockFs.readFileSync.mockImplementation((path: fs.PathLike) => {
        const pathStr = path.toString();
        if (pathStr.includes("post-1")) return post1;
        if (pathStr.includes("post-2")) return post2;
        if (pathStr.includes("post-3")) return post3;
        return "";
      });

      const posts = getPostsByTag("blog", "javascript", "en");

      expect(posts[0].title).toBe("New Post");
      expect(posts[1].title).toBe("Middle Post");
      expect(posts[2].title).toBe("Old Post");
    });
  });
});
