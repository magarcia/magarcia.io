import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import List from "~/components/List";

describe("List", () => {
  describe("list type", () => {
    it("renders an unordered list by default", () => {
      render(<List>{<li>Item</li>}</List>);
      expect(screen.getByRole("list").tagName).toBe("UL");
    });

    it("renders an unordered list when ordered is false", () => {
      render(<List ordered={false}>{<li>Item</li>}</List>);
      expect(screen.getByRole("list").tagName).toBe("UL");
    });

    it("renders an ordered list when ordered is true", () => {
      render(<List ordered>{<li>Item</li>}</List>);
      expect(screen.getByRole("list").tagName).toBe("OL");
    });
  });

  describe("styling", () => {
    it("applies disc marker and shared classes to unordered lists", () => {
      render(<List>{<li>Item</li>}</List>);
      const list = screen.getByRole("list");
      expect(list).toHaveClass(
        "list-disc",
        "my-6",
        "ml-6",
        "leading-relaxed",
        "text-foreground",
      );
    });

    it("applies decimal marker and shared classes to ordered lists", () => {
      render(<List ordered>{<li>Item</li>}</List>);
      const list = screen.getByRole("list");
      expect(list).toHaveClass(
        "list-decimal",
        "my-6",
        "ml-6",
        "leading-relaxed",
        "text-foreground",
      );
    });
  });

  describe("content and prop forwarding", () => {
    it("renders list item children", () => {
      render(
        <List>
          <li>First</li>
          <li>Second</li>
        </List>,
      );
      expect(screen.getByText("First")).toBeInTheDocument();
      expect(screen.getByText("Second")).toBeInTheDocument();
    });

    it("passes through data attributes", () => {
      render(<List data-testid="custom-list">{<li>Item</li>}</List>);
      expect(screen.getByTestId("custom-list")).toBeInTheDocument();
    });

    it("passes through aria attributes", () => {
      render(<List aria-label="Table of contents">{<li>Item</li>}</List>);
      expect(
        screen.getByRole("list", { name: "Table of contents" }),
      ).toBeInTheDocument();
    });
  });
});
