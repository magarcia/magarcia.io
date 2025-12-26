import { describe, it, expect, vi, beforeEach } from "vitest";
import { loader } from "~/app/routes/$slug";
import type { BlogPostWithNavigation } from "~/lib/blog";

vi.mock("~/lib/blog", () => ({
  getFileBySlug: vi.fn(),
  isValidSlug: vi.fn((slug: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(slug)),
  isValidLang: vi.fn((lang: string) => ["en", "es", "ca"].includes(lang)),
}));

const { getFileBySlug } = await import("~/lib/blog");

const mockPost: BlogPostWithNavigation = {
  content: "# Test Content\n\nThis is a test post.",
  frontMatter: {
    title: "Test Post",
    date: "2024-01-01",
    spoiler: "Test spoiler",
    tags: ["test", "typescript"],
    slug: "test-post",
    wordCount: 100,
    readingTime: { text: "1 min read", minutes: 1, time: 60000, words: 100 },
  },
  prev: {
    title: "Previous Post",
    date: "2023-12-31",
    spoiler: "Previous spoiler",
    tags: ["test"],
    slug: "previous-post",
    wordCount: 150,
    readingTime: { text: "1 min read", minutes: 1, time: 60000, words: 150 },
  },
  next: {
    title: "Next Post",
    date: "2024-01-02",
    spoiler: "Next spoiler",
    tags: ["test"],
    slug: "next-post",
    wordCount: 200,
    readingTime: { text: "2 min read", minutes: 2, time: 120000, words: 200 },
  },
};

describe("$slug route loader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("successful post loading", () => {
    it("loads post by slug with default English language", async () => {
      vi.mocked(getFileBySlug).mockReturnValue(mockPost);
      const request = new Request("http://localhost/test-post");
      const params = { slug: "test-post" };

      const result = await loader({ request, params, context: {} });

      expect(getFileBySlug).toHaveBeenCalledWith("blog", "test-post", "en");
      expect(result.frontMatter).toEqual(mockPost.frontMatter);
      expect(result.content).toBe(mockPost.content);
      expect(result.lang).toBe("en");
    });

    it("includes navigation data (prev and next)", async () => {
      vi.mocked(getFileBySlug).mockReturnValue(mockPost);
      const request = new Request("http://localhost/test-post");
      const params = { slug: "test-post" };

      const result = await loader({ request, params, context: {} });

      expect(result.prev).toEqual(mockPost.prev);
      expect(result.next).toEqual(mockPost.next);
    });
  });

  describe("language detection", () => {
    it("detects Spanish language from URL", async () => {
      vi.mocked(getFileBySlug).mockReturnValue(mockPost);
      const request = new Request("http://localhost/es/test-post");
      const params = { slug: "test-post" };

      const result = await loader({ request, params, context: {} });

      expect(getFileBySlug).toHaveBeenCalledWith("blog", "test-post", "es");
      expect(result.lang).toBe("es");
    });

    it("detects Catalan language from URL", async () => {
      vi.mocked(getFileBySlug).mockReturnValue(mockPost);
      const request = new Request("http://localhost/ca/test-post");
      const params = { slug: "test-post" };

      const result = await loader({ request, params, context: {} });

      expect(getFileBySlug).toHaveBeenCalledWith("blog", "test-post", "ca");
      expect(result.lang).toBe("ca");
    });

    it("defaults to English for non-prefixed URLs", async () => {
      vi.mocked(getFileBySlug).mockReturnValue(mockPost);
      const request = new Request("http://localhost/some-post");
      const params = { slug: "some-post" };

      const result = await loader({ request, params, context: {} });

      expect(getFileBySlug).toHaveBeenCalledWith("blog", "some-post", "en");
      expect(result.lang).toBe("en");
    });
  });

  describe("error handling", () => {
    it("throws 404 response when post not found", async () => {
      vi.mocked(getFileBySlug).mockImplementation(() => {
        throw new Error("Post not found");
      });
      const request = new Request("http://localhost/non-existent");
      const params = { slug: "non-existent" };

      await expect(
        loader({ request, params, context: {} })
      ).rejects.toMatchObject({
        status: 404,
      });
    });

    it("throws 404 response for any error from getFileBySlug", async () => {
      vi.mocked(getFileBySlug).mockImplementation(() => {
        throw new Error("File system error");
      });
      const request = new Request("http://localhost/broken-post");
      const params = { slug: "broken-post" };

      await expect(
        loader({ request, params, context: {} })
      ).rejects.toMatchObject({
        status: 404,
      });
    });
  });
});
