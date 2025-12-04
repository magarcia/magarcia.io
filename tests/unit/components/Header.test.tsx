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
  describe("Heading Tag", () => {
    it("renders h1 when main is true", () => {
      const { container } = render(<Header main={true} />);

      const h1 = container.querySelector("h1");
      expect(h1).toBeInTheDocument();
      expect(h1).toHaveTextContent("magarcia");

      const h3 = container.querySelector("h3");
      expect(h3).not.toBeInTheDocument();
    });

    it("renders h3 when main is false", () => {
      const { container } = render(<Header main={false} />);

      const h3 = container.querySelector("h3");
      expect(h3).toBeInTheDocument();
      expect(h3).toHaveTextContent("magarcia");

      const h1 = container.querySelector("h1");
      expect(h1).not.toBeInTheDocument();
    });

    it("renders h3 by default when main is not specified", () => {
      const { container } = render(<Header />);

      const h3 = container.querySelector("h3");
      expect(h3).toBeInTheDocument();

      const h1 = container.querySelector("h1");
      expect(h1).not.toBeInTheDocument();
    });
  });

  describe("Site Title", () => {
    it("renders site title magarcia", () => {
      render(<Header />);
      expect(screen.getByText("magarcia")).toBeInTheDocument();
    });
  });

  describe("Links and Language Support", () => {
    it("links to / for English (default)", () => {
      render(<Header />);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/");
    });

    it("links to / for English when explicitly set", () => {
      render(<Header lang="en" />);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/");
    });

    it("links to /es for Spanish", () => {
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

  describe("Color Classes", () => {
    it("applies main color classes when main is true", () => {
      const { container } = render(<Header main={true} />);

      const heading = container.querySelector("h1");
      expect(heading).toHaveClass("bg-yellow-300", "dark:bg-purple-500");
      expect(heading).not.toHaveClass(
        "hover:bg-yellow-300",
        "dark:hover:bg-purple-500"
      );
    });

    it("applies hover color classes when main is false", () => {
      const { container } = render(<Header main={false} />);

      const heading = container.querySelector("h3");
      expect(heading).toHaveClass(
        "hover:bg-yellow-300",
        "dark:hover:bg-purple-500"
      );
      expect(heading).not.toHaveClass("bg-yellow-300", "dark:bg-purple-500");
    });
  });

  describe("Size Classes", () => {
    it("applies text-4xl when main is true", () => {
      const { container } = render(<Header main={true} />);

      const heading = container.querySelector("h1");
      expect(heading).toHaveClass("text-4xl");
    });

    it("applies text-2xl when main is false", () => {
      const { container } = render(<Header main={false} />);

      const heading = container.querySelector("h3");
      expect(heading).toHaveClass("text-2xl");
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

  describe("Layout Classes", () => {
    it("applies main padding classes when main is true", () => {
      const { container } = render(<Header main={true} />);

      const header = container.querySelector("header");
      expect(header).toHaveClass("p-8", "pt-16");
    });

    it("applies secondary padding classes when main is false", () => {
      const { container } = render(<Header main={false} />);

      const header = container.querySelector("header");
      expect(header).toHaveClass("p-6");
      expect(header).not.toHaveClass("p-8", "pt-16");
    });

    it("applies consistent flex and layout classes", () => {
      const { container } = render(<Header />);

      const header = container.querySelector("header");
      expect(header).toHaveClass(
        "flex",
        "place-content-between",
        "items-center",
        "max-w-5xl",
        "mx-auto",
        "relative",
        "z-50"
      );
    });
  });
});
