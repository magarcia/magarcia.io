import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Blockquote from "~/components/Blockquote";

describe("Blockquote", () => {
  it("renders a blockquote element with children", () => {
    render(<Blockquote>Quote text</Blockquote>);

    const quote = screen.getByText("Quote text");
    expect(quote).toBeInTheDocument();
    expect(quote.tagName).toBe("BLOCKQUOTE");
  });

  it("applies semantic border, background, and text color classes", () => {
    const { container } = render(<Blockquote>test</Blockquote>);

    const quote = container.querySelector("blockquote");
    expect(quote).toHaveClass("border-border");
    expect(quote).toHaveClass("bg-secondary");
    expect(quote).toHaveClass("text-muted-foreground");
  });

  it("applies italic and border styling classes", () => {
    const { container } = render(<Blockquote>test</Blockquote>);

    const quote = container.querySelector("blockquote");
    expect(quote).toHaveClass("italic");
    expect(quote).toHaveClass("border-l-2");
  });

  it("passes through valid HTML blockquote attributes", () => {
    const { container } = render(
      <Blockquote cite="https://example.com" data-testid="custom-quote">
        Attributed quote
      </Blockquote>,
    );

    const quote = container.querySelector("blockquote");
    expect(quote).toHaveAttribute("cite", "https://example.com");
    expect(quote).toHaveAttribute("data-testid", "custom-quote");
  });

  it("renders complex children", () => {
    render(
      <Blockquote>
        <span>Nested</span> content
      </Blockquote>,
    );

    expect(screen.getByText("Nested")).toBeInTheDocument();
    expect(screen.getByText("content", { exact: false })).toBeInTheDocument();
  });

  it("accepts and applies custom className", () => {
    const { container } = render(
      <Blockquote className="custom-class">test</Blockquote>,
    );

    const quote = container.querySelector("blockquote");
    expect(quote).toHaveClass("custom-class");
  });
});
