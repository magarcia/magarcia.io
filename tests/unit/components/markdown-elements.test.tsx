import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Blockquote from "~/components/Blockquote";
import Caption from "~/components/Caption";
import CodeInline from "~/components/CodeInline";
import Link from "~/components/Link";
import Paragraph from "~/components/Paragraph";
import Strong from "~/components/Strong";
import List from "~/components/List";

describe("Blockquote", () => {
  it("renders blockquote element", () => {
    render(<Blockquote>Test quote</Blockquote>);
    const element = screen.getByText("Test quote");
    expect(element.tagName).toBe("BLOCKQUOTE");
  });

  it("applies correct styling classes", () => {
    render(<Blockquote>Test quote</Blockquote>);
    const element = screen.getByText("Test quote");
    expect(element).toHaveClass("border-l-2");
    expect(element).toHaveClass("italic");
    expect(element).toHaveClass("border-gray-800");
    expect(element).toHaveClass("dark:border-gray-200");
    expect(element).toHaveClass("bg-gray-100");
    expect(element).toHaveClass("dark:bg-gray-600");
    expect(element).toHaveClass("py-0.5");
    expect(element).toHaveClass("px-4");
  });

  it("passes props correctly", () => {
    render(
      <Blockquote data-testid="custom-blockquote" id="test-id">
        Test quote
      </Blockquote>
    );
    const element = screen.getByTestId("custom-blockquote");
    expect(element).toHaveAttribute("id", "test-id");
  });

  it("renders children properly", () => {
    render(
      <Blockquote>
        <p>Paragraph in quote</p>
        <span>Span in quote</span>
      </Blockquote>
    );
    expect(screen.getByText("Paragraph in quote")).toBeInTheDocument();
    expect(screen.getByText("Span in quote")).toBeInTheDocument();
  });
});

describe("Caption", () => {
  it("renders caption element", () => {
    render(
      <table>
        <Caption>Table caption</Caption>
      </table>
    );
    const element = screen.getByText("Table caption");
    expect(element.tagName).toBe("CAPTION");
  });

  it("applies italic styling", () => {
    render(
      <table>
        <Caption>Table caption</Caption>
      </table>
    );
    const element = screen.getByText("Table caption");
    expect(element).toHaveClass("italic");
  });

  it("passes props correctly", () => {
    render(
      <table>
        <Caption data-testid="custom-caption" id="test-id">
          Table caption
        </Caption>
      </table>
    );
    const element = screen.getByTestId("custom-caption");
    expect(element).toHaveAttribute("id", "test-id");
    expect(element).toHaveClass("italic");
  });

  it("renders children properly", () => {
    render(
      <table>
        <Caption>
          Caption with <strong>bold</strong> text
        </Caption>
      </table>
    );
    expect(screen.getByText("bold")).toBeInTheDocument();
  });
});

describe("CodeInline", () => {
  it("renders code element", () => {
    render(<CodeInline>const x = 1;</CodeInline>);
    const element = screen.getByText("const x = 1;");
    expect(element.tagName).toBe("CODE");
  });

  it("applies monospace styling classes", () => {
    render(<CodeInline>code</CodeInline>);
    const element = screen.getByText("code");
    expect(element).toHaveClass("font-mono");
    expect(element).toHaveClass("bg-gray-100");
    expect(element).toHaveClass("dark:bg-gray-700");
    expect(element).toHaveClass("p-1");
    expect(element).toHaveClass("rounded");
    expect(element).toHaveClass("border-gray-200");
    expect(element).toHaveClass("dark:border-gray-800");
    expect(element).toHaveClass("border");
    expect(element).toHaveClass("text-sm");
  });

  it("handles children correctly", () => {
    render(<CodeInline>console.log("hello")</CodeInline>);
    expect(screen.getByText('console.log("hello")')).toBeInTheDocument();
  });

  it("passes additional props", () => {
    render(
      <CodeInline data-testid="custom-code" data-language="javascript">
        code
      </CodeInline>
    );
    const element = screen.getByTestId("custom-code");
    expect(element).toHaveAttribute("data-language", "javascript");
  });

  it("renders without children", () => {
    const { container } = render(<CodeInline />);
    const element = container.querySelector("code");
    expect(element).toBeInTheDocument();
    expect(element).toHaveClass("font-mono");
  });
});

describe("Link", () => {
  it("renders anchor element", () => {
    render(<Link href="/test">Test Link</Link>);
    const element = screen.getByText("Test Link");
    expect(element.tagName).toBe("A");
  });

  it("applies underline class", () => {
    render(<Link href="/test">Test Link</Link>);
    const element = screen.getByText("Test Link");
    expect(element).toHaveClass("underline");
  });

  it("passes href prop", () => {
    render(<Link href="/test-path">Test Link</Link>);
    const element = screen.getByText("Test Link");
    expect(element).toHaveAttribute("href", "/test-path");
  });

  it("passes additional props correctly", () => {
    render(
      <Link href="/test" target="_blank" rel="noopener noreferrer" data-testid="custom-link">
        External Link
      </Link>
    );
    const element = screen.getByTestId("custom-link");
    expect(element).toHaveAttribute("target", "_blank");
    expect(element).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders children properly", () => {
    render(
      <Link href="/test">
        Link with <strong>bold</strong> text
      </Link>
    );
    expect(screen.getByText("bold")).toBeInTheDocument();
  });
});

describe("Paragraph", () => {
  it("renders p element", () => {
    render(<Paragraph>Test paragraph</Paragraph>);
    const element = screen.getByText("Test paragraph");
    expect(element.tagName).toBe("P");
  });

  it("applies margin classes", () => {
    render(<Paragraph>Test paragraph</Paragraph>);
    const element = screen.getByText("Test paragraph");
    expect(element).toHaveClass("my-6");
  });

  it("passes props correctly", () => {
    render(
      <Paragraph data-testid="custom-paragraph" id="test-id">
        Test paragraph
      </Paragraph>
    );
    const element = screen.getByTestId("custom-paragraph");
    expect(element).toHaveAttribute("id", "test-id");
    expect(element).toHaveClass("my-6");
  });

  it("renders children properly", () => {
    render(
      <Paragraph>
        Text with <strong>bold</strong> and <em>italic</em>
      </Paragraph>
    );
    expect(screen.getByText("bold")).toBeInTheDocument();
    expect(screen.getByText("italic")).toBeInTheDocument();
  });
});

describe("Strong", () => {
  it("renders strong element", () => {
    render(<Strong>Bold text</Strong>);
    const element = screen.getByText("Bold text");
    expect(element.tagName).toBe("STRONG");
  });

  it("applies font-bold class", () => {
    render(<Strong>Bold text</Strong>);
    const element = screen.getByText("Bold text");
    expect(element).toHaveClass("font-bold");
  });

  it("passes props correctly", () => {
    render(
      <Strong data-testid="custom-strong" id="test-id">
        Bold text
      </Strong>
    );
    const element = screen.getByTestId("custom-strong");
    expect(element).toHaveAttribute("id", "test-id");
    expect(element).toHaveClass("font-bold");
  });

  it("renders children properly", () => {
    render(
      <Strong>
        Bold with <span>nested span</span>
      </Strong>
    );
    expect(screen.getByText("nested span")).toBeInTheDocument();
  });
});

describe("List", () => {
  it("renders ul element by default", () => {
    render(
      <List>
        <li>Item 1</li>
      </List>
    );
    const item = screen.getByText("Item 1");
    expect(item.parentElement?.tagName).toBe("UL");
  });

  it("renders ol element when ordered is true", () => {
    render(
      <List ordered>
        <li>Item 1</li>
      </List>
    );
    const item = screen.getByText("Item 1");
    expect(item.parentElement?.tagName).toBe("OL");
  });

  it("applies list-disc and pl-4 classes for unordered list", () => {
    render(
      <List data-testid="unordered-list">
        <li>Item 1</li>
      </List>
    );
    const element = screen.getByTestId("unordered-list");
    expect(element).toHaveClass("list-disc");
    expect(element).toHaveClass("pl-4");
  });

  it("applies list-decimal and my-6 classes for ordered list", () => {
    render(
      <List ordered data-testid="ordered-list">
        <li>Item 1</li>
      </List>
    );
    const element = screen.getByTestId("ordered-list");
    expect(element).toHaveClass("list-decimal");
    expect(element).toHaveClass("my-6");
  });

  it("passes additional props correctly", () => {
    render(
      <List data-testid="custom-list" id="test-id">
        <li>Item 1</li>
      </List>
    );
    const element = screen.getByTestId("custom-list");
    expect(element).toHaveAttribute("id", "test-id");
    expect(element).toHaveClass("list-disc");
  });

  it("renders multiple list items", () => {
    render(
      <List>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
      </List>
    );
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.getByText("Item 3")).toBeInTheDocument();
  });

  it("renders children properly with nested content", () => {
    render(
      <List>
        <li>
          Item with <strong>bold</strong>
        </li>
      </List>
    );
    expect(screen.getByText("bold")).toBeInTheDocument();
  });
});
