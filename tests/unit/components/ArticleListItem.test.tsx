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

    const time = screen.getByText("December 15, 2023");
    expect(time).toBeInTheDocument();
    expect(time.tagName.toLowerCase()).toBe("time");
    expect(time).toHaveAttribute("datetime", "2023-12-15");
  });

  it("shows reading time text", () => {
    render(<ArticleListItem {...mockArticle} />);

    expect(screen.getByText(/5 min read/)).toBeInTheDocument();
  });

  it("renders spoiler text before markdown loads", () => {
    render(<ArticleListItem {...mockArticle} />);

    // Initially, should render plain spoiler text
    expect(screen.getByText(/This is a \*\*test\*\* spoiler/)).toBeInTheDocument();
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
      { timeout: 3000 }
    );
  });

  it("links to correct path for English articles (default)", () => {
    render(<ArticleListItem {...mockArticle} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/test-article");
  });

  it("links to correct path for English articles when lang is explicitly en", () => {
    render(<ArticleListItem {...mockArticle} lang="en" />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/test-article");
  });

  it("links to correct path for non-English articles", () => {
    render(<ArticleListItem {...mockArticle} lang="es" />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/es/test-article");
  });

  it("links to correct path for French articles", () => {
    render(<ArticleListItem {...mockArticle} lang="fr" />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/fr/test-article");
  });

  it("renders article with all metadata visible", () => {
    const { container } = render(<ArticleListItem {...mockArticle} />);

    // Check that article element exists
    const article = screen.getByTestId("article-item");
    expect(article.tagName.toLowerCase()).toBe("article");

    // Check header exists
    const header = container.querySelector("header");
    expect(header).toBeInTheDocument();

    // Check date and reading time are in the same line
    const dateTimeContainer = container.querySelector(".opacity-75");
    expect(dateTimeContainer).toBeInTheDocument();
    expect(dateTimeContainer?.textContent).toContain("December 15, 2023");
    expect(dateTimeContainer?.textContent).toContain("5 min read");
  });

  it("handles different date formats correctly", () => {
    const article = {
      ...mockArticle,
      date: "2024-01-01",
    };

    render(<ArticleListItem {...article} />);

    expect(screen.getByText("January 1, 2024")).toBeInTheDocument();
  });

  it("handles different reading times", () => {
    const article = {
      ...mockArticle,
      readingTime: { text: "1 min read", minutes: 1, words: 200, time: 60000 },
    };

    render(<ArticleListItem {...article} />);

    expect(screen.getByText(/1 min read/)).toBeInTheDocument();
  });

  it("renders spoiler without markdown components initially", () => {
    const article = {
      ...mockArticle,
      spoiler: "Plain text spoiler without formatting.",
    };

    render(<ArticleListItem {...article} />);

    expect(screen.getByText("Plain text spoiler without formatting.")).toBeInTheDocument();
  });
});
