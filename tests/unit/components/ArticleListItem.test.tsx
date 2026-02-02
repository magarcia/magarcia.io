import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ArticleListItem from "~/components/ArticleListItem";

describe("ArticleListItem", () => {
  const mockArticle = {
    slug: "test-article",
    title: "Test Article Title",
    date: "2023-12-15",
    readingTime: { text: "5 min read", minutes: 5, words: 1000, time: 300000 },
    spoiler: "This is a **test** spoiler with *emphasis*.",
    tags: ["javascript", "testing"],
    wordCount: 1000,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders article title as link", () => {
    render(<ArticleListItem {...mockArticle} />);

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("Test Article Title");

    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
  });

  it("formats date correctly using date-fns", () => {
    render(<ArticleListItem {...mockArticle} />);

    const time = screen.getByText("2023");
    expect(time).toBeInTheDocument();
    expect(time.tagName.toLowerCase()).toBe("time");
    expect(time).toHaveAttribute("datetime", "2023-12-15");
  });

  it("renders spoiler text before markdown loads", () => {
    render(<ArticleListItem {...mockArticle} />);

    // Initially, should render plain spoiler text
    expect(
      screen.getByText(/This is a \*\*test\*\* spoiler/),
    ).toBeInTheDocument();
  });

  it("renders spoiler text with markdown after dynamic import", async () => {
    render(<ArticleListItem {...mockArticle} />);

    // Wait for the dynamic import to complete and markdown to render
    await waitFor(
      () => {
        const article = screen.getByTestId("article-item");
        const strongElements = article.querySelectorAll("strong");
        expect(strongElements.length).toBeGreaterThan(0);
      },
      { timeout: 3000 },
    );
  });

  it("links to correct path for English articles (default)", () => {
    render(<ArticleListItem {...mockArticle} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/test-article/");
  });

  it("links to correct path for English articles when lang is explicitly en", () => {
    render(<ArticleListItem {...mockArticle} lang="en" />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/test-article/");
  });

  it("links to correct path for non-English articles", () => {
    render(<ArticleListItem {...mockArticle} lang="es" />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/es/test-article/");
  });

  it("links to correct path for French articles", () => {
    render(<ArticleListItem {...mockArticle} lang="fr" />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/fr/test-article/");
  });

  it("renders article with all metadata visible", () => {
    const { container } = render(<ArticleListItem {...mockArticle} />);

    // Check that article element exists
    const article = screen.getByTestId("article-item");
    expect(article.tagName.toLowerCase()).toBe("article");

    // Check year is displayed
    const time = screen.getByText("2023");
    expect(time).toBeInTheDocument();
  });

  it("handles different date formats correctly", () => {
    const article = {
      ...mockArticle,
      date: "2024-01-01",
    };

    render(<ArticleListItem {...article} />);

    expect(screen.getByText("2024")).toBeInTheDocument();
  });

  it("renders spoiler without markdown components initially", () => {
    const article = {
      ...mockArticle,
      spoiler: "Plain text spoiler without formatting.",
    };

    render(<ArticleListItem {...article} />);

    expect(
      screen.getByText("Plain text spoiler without formatting."),
    ).toBeInTheDocument();
  });
});
