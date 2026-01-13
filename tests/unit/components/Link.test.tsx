import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Link from "~/components/Link";

describe("Link", () => {
  it("renders anchor element with children", () => {
    render(<Link>Click me</Link>);

    const link = screen.getByText("Click me");
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe("A");
  });

  it("applies semantic foreground text color class", () => {
    const { container } = render(<Link>test</Link>);

    const link = container.querySelector("a");
    expect(link).toHaveClass("text-foreground");
  });

  it("applies dark mode text color class", () => {
    const { container } = render(<Link>test</Link>);

    const link = container.querySelector("a");
    expect(link).toHaveClass("dark:text-gray-200");
  });

  it("applies hover color classes", () => {
    const { container } = render(<Link>test</Link>);

    const link = container.querySelector("a");
    expect(link).toHaveClass("hover:text-yellow-600");
    expect(link).toHaveClass("dark:hover:text-purple-400");
  });

  it("applies underline class", () => {
    const { container } = render(<Link>test</Link>);

    const link = container.querySelector("a");
    expect(link).toHaveClass("underline");
  });

  it("applies transition-colors class", () => {
    const { container } = render(<Link>test</Link>);

    const link = container.querySelector("a");
    expect(link).toHaveClass("transition-colors");
  });

  it("passes through valid HTML anchor attributes", () => {
    const { container } = render(
      <Link href="https://example.com" target="_blank" rel="noopener noreferrer" data-testid="custom-link">
        External link
      </Link>
    );

    const link = container.querySelector("a");
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveAttribute("data-testid", "custom-link");
  });

  it("renders empty content gracefully", () => {
    const { container } = render(<Link />);

    const link = container.querySelector("a");
    expect(link).toBeInTheDocument();
    expect(link).toBeEmptyDOMElement();
  });

  it("renders complex children", () => {
    render(
      <Link>
        <span>nested</span> content
      </Link>
    );

    expect(screen.getByText("nested")).toBeInTheDocument();
    expect(screen.getByText("content", { exact: false })).toBeInTheDocument();
  });

  it("accepts and applies custom className", () => {
    const { container } = render(<Link className="custom-class">test</Link>);

    const link = container.querySelector("a");
    expect(link).toHaveClass("custom-class");
  });
});
