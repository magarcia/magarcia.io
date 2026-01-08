import { describe, it, expect, vi, beforeEach } from "vitest";
import { loader } from "~/app/routes/_index";
import type { FrontMatter } from "~/lib/blog";

vi.mock("~/lib/blog", () => ({
  getAllFilesFrontMatter: vi.fn(),
}));

const { getAllFilesFrontMatter } = await import("~/lib/blog");

const mockPosts: FrontMatter[] = [
  {
    title: "Test Post 1",
    date: "2024-01-01",
    spoiler: "Test spoiler",
    tags: ["test"],
    slug: "test-post-1",
    indexed: true,
    wordCount: 100,
    readingTime: { text: "1 min read", minutes: 1, time: 60000, words: 100 },
  },
  {
    title: "Test Post 2",
    date: "2024-01-02",
    spoiler: "Test spoiler 2",
    tags: ["test"],
    slug: "test-post-2",
    indexed: true,
    wordCount: 200,
    readingTime: { text: "2 min read", minutes: 2, time: 120000, words: 200 },
  },
];

describe("_index route loader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("language detection", () => {
    it("detects English as default language", async () => {
      vi.mocked(getAllFilesFrontMatter).mockReturnValue(mockPosts);
      const request = new Request("http://localhost/");
      const result = await loader({ request, params: {}, context: {} } as any);

      expect(result.lang).toBe("en");
      expect(getAllFilesFrontMatter).toHaveBeenCalledWith("blog", "en");
    });

    it("detects Spanish language from URL", async () => {
      vi.mocked(getAllFilesFrontMatter).mockReturnValue(mockPosts);
      const request = new Request("http://localhost/es");
      const result = await loader({ request, params: {}, context: {} } as any);

      expect(result.lang).toBe("es");
      expect(getAllFilesFrontMatter).toHaveBeenCalledWith("blog", "es");
    });

    it("detects Spanish language from URL with trailing slash", async () => {
      vi.mocked(getAllFilesFrontMatter).mockReturnValue(mockPosts);
      const request = new Request("http://localhost/es/");
      const result = await loader({ request, params: {}, context: {} } as any);

      expect(result.lang).toBe("es");
      expect(getAllFilesFrontMatter).toHaveBeenCalledWith("blog", "es");
    });

    it("detects Catalan language from URL", async () => {
      vi.mocked(getAllFilesFrontMatter).mockReturnValue(mockPosts);
      const request = new Request("http://localhost/ca");
      const result = await loader({ request, params: {}, context: {} } as any);

      expect(result.lang).toBe("ca");
      expect(getAllFilesFrontMatter).toHaveBeenCalledWith("blog", "ca");
    });

    it("detects Catalan language from URL with trailing slash", async () => {
      vi.mocked(getAllFilesFrontMatter).mockReturnValue(mockPosts);
      const request = new Request("http://localhost/ca/");
      const result = await loader({ request, params: {}, context: {} } as any);

      expect(result.lang).toBe("ca");
      expect(getAllFilesFrontMatter).toHaveBeenCalledWith("blog", "ca");
    });
  });

  describe("post filtering", () => {
    it("returns all posts when indexed is true", async () => {
      vi.mocked(getAllFilesFrontMatter).mockReturnValue(mockPosts);
      const request = new Request("http://localhost/");
      const result = await loader({ request, params: {}, context: {} } as any);

      expect(result.posts).toHaveLength(2);
      expect(result.posts).toEqual(mockPosts);
    });

    it("filters out posts with indexed: false", async () => {
      const postsWithUnindexed = [
        ...mockPosts,
        {
          ...mockPosts[0],
          slug: "unindexed-post",
          indexed: false,
        },
      ];
      vi.mocked(getAllFilesFrontMatter).mockReturnValue(postsWithUnindexed);
      const request = new Request("http://localhost/");
      const result = await loader({ request, params: {}, context: {} } as any);

      expect(result.posts).toHaveLength(2);
      expect(result.posts.every((p) => p.indexed !== false)).toBe(true);
    });

    it("returns empty array when no posts exist", async () => {
      vi.mocked(getAllFilesFrontMatter).mockReturnValue([]);
      const request = new Request("http://localhost/");
      const result = await loader({ request, params: {}, context: {} } as any);

      expect(result.posts).toHaveLength(0);
      expect(result.posts).toEqual([]);
    });
  });
});
