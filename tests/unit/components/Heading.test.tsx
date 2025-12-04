import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Heading from "@/components/Heading";

describe("Heading", () => {
  describe("heading levels", () => {
    it("renders h2 by default", () => {
      render(<Heading>Test Heading</Heading>);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading.textContent).toContain("Test Heading");
    });

    it("renders h1 when level is 1", () => {
      render(<Heading level={1}>Test Heading</Heading>);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it("renders h2 when level is 2", () => {
      render(<Heading level={2}>Test Heading</Heading>);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toBeInTheDocument();
    });

    it("renders h3 when level is 3", () => {
      render(<Heading level={3}>Test Heading</Heading>);
      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toBeInTheDocument();
    });

    it("renders h4 when level is 4", () => {
      render(<Heading level={4}>Test Heading</Heading>);
      const heading = screen.getByRole("heading", { level: 4 });
      expect(heading).toBeInTheDocument();
    });
  });

  describe("text size classes", () => {
    it("applies text-4xl class for h1", () => {
      render(<Heading level={1}>Test Heading</Heading>);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading.className).toContain("text-4xl");
    });

    it("applies text-3xl class for h2", () => {
      render(<Heading level={2}>Test Heading</Heading>);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading.className).toContain("text-3xl");
    });

    it("applies text-2xl class for h3", () => {
      render(<Heading level={3}>Test Heading</Heading>);
      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading.className).toContain("text-2xl");
    });

    it("applies text-xl class for h4", () => {
      render(<Heading level={4}>Test Heading</Heading>);
      const heading = screen.getByRole("heading", { level: 4 });
      expect(heading.className).toContain("text-xl");
    });
  });

  describe("slug ID generation", () => {
    it("generates slug ID from text content", () => {
      render(<Heading>Test Heading</Heading>);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveAttribute("id", "test-heading");
    });

    it("converts uppercase to lowercase in slug", () => {
      render(<Heading>UPPERCASE HEADING</Heading>);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveAttribute("id", "uppercase-heading");
    });

    it("converts spaces to hyphens in slug", () => {
      render(<Heading>Multiple Word Heading</Heading>);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveAttribute("id", "multiple-word-heading");
    });

    it("handles special characters in slug", () => {
      render(<Heading>Heading with special chars!</Heading>);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveAttribute("id", "heading-with-special-chars!");
    });
  });

  describe("anchor link", () => {
    it("renders anchor link with hash icon", () => {
      render(<Heading>Test Heading</Heading>);
      expect(screen.getByTestId("hash-icon")).toBeInTheDocument();
    });

    it("anchor href matches generated slug", () => {
      render(<Heading>Test Heading</Heading>);
      const heading = screen.getByRole("heading", { level: 2 });
      const anchor = heading.querySelector("a");

      expect(anchor).toBeInTheDocument();
      expect(anchor).toHaveAttribute("href", "#test-heading");
      expect(heading).toHaveAttribute("id", "test-heading");
    });

    it("applies correct anchor styling classes", () => {
      render(<Heading>Test Heading</Heading>);
      const heading = screen.getByRole("heading", { level: 2 });
      const anchor = heading.querySelector("a");

      expect(anchor?.className).toContain("anchor");
      expect(anchor?.className).toContain("opacity-0");
      expect(anchor?.className).toContain("inline-block");
      expect(anchor?.className).toContain("cursor-pointer");
      expect(anchor?.className).toContain("transition-opacity");
    });
  });

  describe("common styling", () => {
    it("applies common heading classes", () => {
      render(<Heading level={2}>Test Heading</Heading>);
      const heading = screen.getByRole("heading", { level: 2 });

      expect(heading.className).toContain("heading");
      expect(heading.className).toContain("font-semibold");
      expect(heading.className).toContain("text-gray-900");
      expect(heading.className).toContain("dark:text-gray-50");
      expect(heading.className).toContain("mt-12");
    });

    it("passes through additional props", () => {
      render(
        <Heading level={2} data-custom="test-value">
          Test Heading
        </Heading>
      );
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveAttribute("data-custom", "test-value");
    });
  });

  describe("edge cases", () => {
    it("handles empty children gracefully", () => {
      render(<Heading level={2}>{""}</Heading>);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toBeInTheDocument();
    });

    it("handles numeric children", () => {
      render(<Heading level={2}>{123}</Heading>);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveAttribute("id", "123");
    });
  });
});
