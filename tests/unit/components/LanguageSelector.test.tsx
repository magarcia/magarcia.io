import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import LanguageSelector from "@/components/LanguageSelector";

describe("LanguageSelector", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("has correct aria-label for accessibility", () => {
    render(<LanguageSelector lang="en" />);
    const selector = screen.getByLabelText("Select language");
    expect(selector).toBeInTheDocument();
  });

  describe("language options", () => {
    it("shows all three language options", () => {
      render(<LanguageSelector lang="en" />);

      expect(screen.getByText("EN")).toBeInTheDocument();
      expect(screen.getByText("ES")).toBeInTheDocument();
      expect(screen.getByText("CA")).toBeInTheDocument();
    });

    it("applies bold styling to current language", () => {
      render(<LanguageSelector lang="es" />);

      const spanishLink = screen.getByText("ES");
      expect(spanishLink.className).toContain("font-bold");

      const englishLink = screen.getByText("EN");
      expect(englishLink.className).not.toContain("font-bold");
    });
  });

  describe("language links without slug", () => {
    it("generates correct link for English", () => {
      render(<LanguageSelector lang="en" />);

      const englishLink = screen.getByText("EN");
      expect(englishLink).toHaveAttribute("href", "/");
    });

    it("generates correct link for Español", () => {
      render(<LanguageSelector lang="en" />);

      const spanishLink = screen.getByText("ES");
      expect(spanishLink).toHaveAttribute("href", "/es");
    });

    it("generates correct link for Català", () => {
      render(<LanguageSelector lang="en" />);

      const catalanLink = screen.getByText("CA");
      expect(catalanLink).toHaveAttribute("href", "/ca");
    });
  });

  describe("language links with slug", () => {
    const slug = "my-blog-post";

    it("generates correct link for English with slug", () => {
      render(<LanguageSelector lang="en" slug={slug} />);

      const englishLink = screen.getByText("EN");
      expect(englishLink).toHaveAttribute("href", `/${slug}`);
    });

    it("generates correct link for Español with slug", () => {
      render(<LanguageSelector lang="en" slug={slug} />);

      const spanishLink = screen.getByText("ES");
      expect(spanishLink).toHaveAttribute("href", `/es/${slug}`);
    });

    it("generates correct link for Català with slug", () => {
      render(<LanguageSelector lang="en" slug={slug} />);

      const catalanLink = screen.getByText("CA");
      expect(catalanLink).toHaveAttribute("href", `/ca/${slug}`);
    });
  });

  it("renders language selector container with testid", () => {
    render(<LanguageSelector lang="en" />);
    expect(screen.getByTestId("language-selector")).toBeInTheDocument();
  });
});
