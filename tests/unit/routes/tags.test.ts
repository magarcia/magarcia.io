import { describe, it, expect, vi, beforeEach } from "vitest";
import { loader } from "~/app/routes/tags.$tag";
import type { FrontMatter } from "~/lib/blog";

vi.mock("~/lib/blog", () => ({
  getPostsByTagSlug: vi.fn(),
  getTagBySlug: vi.fn(),
  isValidSlug: vi.fn((slug: string) =>
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(slug),
  ),
  isValidLang: vi.fn((lang: string) => ["en", "es", "ca"].includes(lang)),
}));

const { getPostsByTagSlug, getTagBySlug } = await import("~/lib/blog");

const mockPosts: FrontMatter[] = [
  {
    title: "TypeScript Post 1",
    date: "2024-01-01",
    spoiler: "TypeScript spoiler 1",
    tags: ["TypeScript", "JavaScript"],
    slug: "typescript-post-1",
    wordCount: 100,
    readingTime: { text: "1 min read", minutes: 1, time: 60000, words: 100 },
  },
  {
    title: "TypeScript Post 2",
    date: "2024-01-02",
    spoiler: "TypeScript spoiler 2",
    tags: ["TypeScript", "React"],
    slug: "typescript-post-2",
    wordCount: 200,
    readingTime: { text: "2 min read", minutes: 2, time: 120000, words: 200 },
  },
];

describe("tags.$tag route loader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("successful tag loading", () => {
    it("returns posts filtered by tag slug", async () => {
      vi.mocked(getTagBySlug).mockReturnValue("TypeScript");
      vi.mocked(getPostsByTagSlug).mockReturnValue(mockPosts);
      const request = new Request("http://localhost/tags/typescript");
      const params = { tag: "typescript" };

      const result = await loader({ request, params, context: {} } as any);

      expect(getTagBySlug).toHaveBeenCalledWith("blog", "typescript");
      expect(getPostsByTagSlug).toHaveBeenCalledWith(
        "blog",
        "typescript",
        "en",
      );
      expect(result.posts).toEqual(mockPosts);
      expect(result.tag).toBe("TypeScript");
      expect(result.totalCount).toBe(2);
    });

    it("returns original tag name (not slug) in response", async () => {
      vi.mocked(getTagBySlug).mockReturnValue("Developer Tools");
      vi.mocked(getPostsByTagSlug).mockReturnValue([mockPosts[0]]);
      const request = new Request("http://localhost/tags/developer-tools");
      const params = { tag: "developer-tools" };

      const result = await loader({ request, params, context: {} } as any);

      expect(result.tag).toBe("Developer Tools");
    });

    it("returns single post when tag matches only one", async () => {
      const singlePost = [mockPosts[0]];
      vi.mocked(getTagBySlug).mockReturnValue("JavaScript");
      vi.mocked(getPostsByTagSlug).mockReturnValue(singlePost);
      const request = new Request("http://localhost/tags/javascript");
      const params = { tag: "javascript" };

      const result = await loader({ request, params, context: {} } as any);

      expect(result.posts).toHaveLength(1);
      expect(result.totalCount).toBe(1);
    });
  });

  describe("language detection", () => {
    it("detects Spanish language from URL for post filtering", async () => {
      vi.mocked(getTagBySlug).mockReturnValue("TypeScript");
      vi.mocked(getPostsByTagSlug).mockReturnValue(mockPosts);
      const request = new Request("http://localhost/es/tags/typescript");
      const params = { tag: "typescript" };

      await loader({ request, params, context: {} } as any);

      expect(getTagBySlug).toHaveBeenCalledWith("blog", "typescript");
      expect(getPostsByTagSlug).toHaveBeenCalledWith(
        "blog",
        "typescript",
        "es",
      );
    });

    it("detects Catalan language from URL for post filtering", async () => {
      vi.mocked(getTagBySlug).mockReturnValue("TypeScript");
      vi.mocked(getPostsByTagSlug).mockReturnValue(mockPosts);
      const request = new Request("http://localhost/ca/tags/typescript");
      const params = { tag: "typescript" };

      await loader({ request, params, context: {} } as any);

      expect(getTagBySlug).toHaveBeenCalledWith("blog", "typescript");
      expect(getPostsByTagSlug).toHaveBeenCalledWith(
        "blog",
        "typescript",
        "ca",
      );
    });

    it("defaults to English for non-prefixed URLs", async () => {
      vi.mocked(getTagBySlug).mockReturnValue("TypeScript");
      vi.mocked(getPostsByTagSlug).mockReturnValue(mockPosts);
      const request = new Request("http://localhost/tags/typescript");
      const params = { tag: "typescript" };

      await loader({ request, params, context: {} } as any);

      expect(getTagBySlug).toHaveBeenCalledWith("blog", "typescript");
      expect(getPostsByTagSlug).toHaveBeenCalledWith(
        "blog",
        "typescript",
        "en",
      );
    });
  });

  describe("error handling", () => {
    it("throws 404 response when tag slug not found", async () => {
      vi.mocked(getTagBySlug).mockReturnValue(null);
      const request = new Request("http://localhost/tags/nonexistent");
      const params = { tag: "nonexistent" };

      await expect(
        loader({ request, params, context: {} } as any),
      ).rejects.toMatchObject({
        status: 404,
      });
    });

    it("throws 404 when tag exists in other language but not requested language", async () => {
      vi.mocked(getTagBySlug).mockReturnValue(null);
      const request = new Request("http://localhost/es/tags/typescript");
      const params = { tag: "typescript" };

      await expect(
        loader({ request, params, context: {} } as any),
      ).rejects.toMatchObject({
        status: 404,
      });
    });
  });

  describe("tag slug handling", () => {
    it("handles multi-word tag slugs", async () => {
      vi.mocked(getTagBySlug).mockReturnValue("Object Oriented");
      vi.mocked(getPostsByTagSlug).mockReturnValue(mockPosts);
      const request = new Request("http://localhost/tags/object-oriented");
      const params = { tag: "object-oriented" };

      const result = await loader({ request, params, context: {} } as any);

      expect(result.tag).toBe("Object Oriented");
      expect(getTagBySlug).toHaveBeenCalledWith("blog", "object-oriented");
    });

    it("uses English tag name regardless of URL language", async () => {
      vi.mocked(getTagBySlug).mockReturnValue("Object Oriented");
      vi.mocked(getPostsByTagSlug).mockReturnValue(mockPosts);
      const request = new Request("http://localhost/ca/tags/object-oriented");
      const params = { tag: "object-oriented" };

      const result = await loader({ request, params, context: {} } as any);

      expect(result.tag).toBe("Object Oriented");
      expect(getTagBySlug).toHaveBeenCalledWith("blog", "object-oriented");
      expect(getPostsByTagSlug).toHaveBeenCalledWith(
        "blog",
        "object-oriented",
        "ca",
      );
    });
  });
});
