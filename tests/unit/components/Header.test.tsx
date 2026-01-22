import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Header from "@/components/Header";

vi.mock("@/components/ThemeToggle", () => ({
  default: () => <div data-testid="theme-toggle">ThemeToggle</div>,
}));

vi.mock("@/components/LanguageSelector", () => ({
  default: ({ lang, slug }: { lang: string; slug?: string }) => (
    <div data-testid="language-selector" data-lang={lang} data-slug={slug}>
      LanguageSelector
    </div>
  ),
}));

describe("Header", () => {
  describe("Site Title", () => {
    it("renders h1 with site title when main is true", () => {
      const { container } = render(<Header main />);

      const h1 = container.querySelector("h1");
      expect(h1).toBeInTheDocument();
      expect(h1).toHaveTextContent("magarcia");
    });

    it("renders back link when main is false", () => {
      render(<Header />);

      expect(screen.getByText("← BACK")).toBeInTheDocument();
      const h1 = document.querySelector("h1");
      expect(h1).not.toBeInTheDocument();
    });

    it("renders back link by default when main is not specified", () => {
      render(<Header />);

      expect(screen.getByText("← BACK")).toBeInTheDocument();
    });

    it("renders translated back link for Spanish", () => {
      render(<Header lang="es" />);

      expect(screen.getByText("← VOLVER")).toBeInTheDocument();
    });

    it("renders translated back link for Catalan", () => {
      render(<Header lang="ca" />);

      expect(screen.getByText("← TORNAR")).toBeInTheDocument();
    });
  });

  describe("Links and Language Support", () => {
    it("links to / for English (default) when main", () => {
      render(<Header main />);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/");
    });

    it("links to / for English when not main", () => {
      render(<Header />);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/");
    });

    it("links to /es for Spanish when main", () => {
      render(<Header main lang="es" />);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/es");
    });

    it("links to /es for Spanish when not main", () => {
      render(<Header lang="es" />);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/es");
    });

    it("links to /ca for Catalan", () => {
      render(<Header lang="ca" />);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/ca");
    });
  });

  describe("ThemeToggle", () => {
    it("renders ThemeToggle after component mount", () => {
      render(<Header />);
      expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
    });
  });

  describe("LanguageSelector", () => {
    it("renders LanguageSelector with correct lang prop", () => {
      render(<Header lang="es" />);

      const selector = screen.getByTestId("language-selector");
      expect(selector).toBeInTheDocument();
      expect(selector).toHaveAttribute("data-lang", "es");
    });

    it("renders LanguageSelector with default lang when not specified", () => {
      render(<Header />);

      const selector = screen.getByTestId("language-selector");
      expect(selector).toBeInTheDocument();
      expect(selector).toHaveAttribute("data-lang", "en");
    });

    it("passes slug prop to LanguageSelector", () => {
      render(<Header lang="en" slug="my-blog-post" />);

      const selector = screen.getByTestId("language-selector");
      expect(selector).toHaveAttribute("data-slug", "my-blog-post");
    });

    it("does not pass slug when not provided", () => {
      render(<Header lang="en" />);

      const selector = screen.getByTestId("language-selector");
      expect(selector).not.toHaveAttribute("data-slug");
    });
  });

  describe("Layout", () => {
    it("applies consistent layout classes", () => {
      const { container } = render(<Header />);

      const header = container.querySelector("header");
      expect(header).toHaveClass("max-w-[75ch]", "mx-auto", "relative", "z-50");
    });

    it("renders controls container with flex layout", () => {
      const { container } = render(<Header />);

      // The controls container (LanguageSelector + ThemeToggle wrapper) uses flex layout
      const controlsContainer = container.querySelector(
        "header .flex.items-center:not(.place-content-between)",
      );
      expect(controlsContainer).toBeInTheDocument();
    });

    it("has horizontal layout with content spread between left and right", () => {
      const { container } = render(<Header />);

      const flexContainer = container.querySelector(
        ".flex.place-content-between",
      );
      expect(flexContainer).toBeInTheDocument();
    });
  });
});
