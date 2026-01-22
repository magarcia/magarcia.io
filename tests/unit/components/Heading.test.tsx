import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Heading from "@/components/Heading";

describe("Heading", () => {
  describe("semantic heading levels", () => {
    it("renders h2 by default", () => {
      render(<Heading>Test Heading</Heading>);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("Test Heading");
    });

    it("renders h1 when level is 1", () => {
      render(<Heading level={1}>Test Heading</Heading>);
      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    });

    it("renders h2 when level is 2", () => {
      render(<Heading level={2}>Test Heading</Heading>);
      expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    });

    it("renders h3 when level is 3", () => {
      render(<Heading level={3}>Test Heading</Heading>);
      expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
    });

    it("renders h4 when level is 4", () => {
      render(<Heading level={4}>Test Heading</Heading>);
      expect(screen.getByRole("heading", { level: 4 })).toBeInTheDocument();
    });
  });

  describe("anchor link generation", () => {
    it("generates URL-friendly id from text content", () => {
      render(<Heading>Test Heading</Heading>);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveAttribute("id", "test-heading");
    });

    it("converts uppercase to lowercase in id", () => {
      render(<Heading>UPPERCASE HEADING</Heading>);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveAttribute("id", "uppercase-heading");
    });

    it("converts spaces to hyphens in id", () => {
      render(<Heading>Multiple Word Heading</Heading>);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveAttribute("id", "multiple-word-heading");
    });

    it("includes anchor link pointing to heading id", () => {
      render(<Heading>Test Heading</Heading>);
      const heading = screen.getByRole("heading", { level: 2 });
      const anchor = heading.querySelector("a");

      expect(anchor).toBeInTheDocument();
      expect(anchor).toHaveAttribute("href", "#test-heading");
    });

    it("anchor link and heading id are synchronized", () => {
      render(<Heading>Linked Section</Heading>);
      const heading = screen.getByRole("heading", { level: 2 });
      const anchor = heading.querySelector("a");
      const headingId = heading.getAttribute("id");

      expect(anchor).toHaveAttribute("href", `#${headingId}`);
    });
  });

  describe("visual anchor indicator", () => {
    it("renders hash icon for navigation hint", () => {
      render(<Heading>Test Heading</Heading>);
      expect(screen.getByTestId("hash-icon")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("anchor link has accessible label for screen readers", () => {
      render(<Heading>Test Heading</Heading>);
      const heading = screen.getByRole("heading", { level: 2 });
      const anchor = heading.querySelector("a");

      expect(anchor).toHaveAttribute("aria-label", "Link to this section");
    });
  });

  describe("prop forwarding", () => {
    it("passes through data attributes", () => {
      render(
        <Heading level={2} data-custom="test-value">
          Test Heading
        </Heading>,
      );
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveAttribute("data-custom", "test-value");
    });

    it("passes through aria attributes", () => {
      render(
        <Heading level={2} aria-label="Custom label">
          Test Heading
        </Heading>,
      );
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveAttribute("aria-label", "Custom label");
    });
  });

  describe("edge cases", () => {
    it("handles empty children", () => {
      render(<Heading level={2}>{""}</Heading>);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toBeInTheDocument();
    });

    it("handles numeric children", () => {
      render(<Heading level={2}>{123}</Heading>);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveAttribute("id", "123");
      expect(heading).toHaveTextContent("123");
    });

    it("handles special characters in text", () => {
      render(<Heading>Heading with special chars!</Heading>);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveAttribute("id");
      expect(heading).toHaveTextContent("Heading with special chars!");
    });
  });
});
