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

  it("renders children content", () => {
    render(
      <Blockquote>
        <p>Paragraph in quote</p>
        <span>Span in quote</span>
      </Blockquote>,
    );
    expect(screen.getByText("Paragraph in quote")).toBeInTheDocument();
    expect(screen.getByText("Span in quote")).toBeInTheDocument();
  });

  it("forwards props to element", () => {
    render(
      <Blockquote data-testid="custom-blockquote" id="test-id">
        Test quote
      </Blockquote>,
    );
    const element = screen.getByTestId("custom-blockquote");
    expect(element).toHaveAttribute("id", "test-id");
  });
});

describe("Caption", () => {
  it("renders caption element within table", () => {
    render(
      <table>
        <Caption>Table caption</Caption>
      </table>,
    );
    const element = screen.getByText("Table caption");
    expect(element.tagName).toBe("CAPTION");
  });

  it("renders children content", () => {
    render(
      <table>
        <Caption>
          Caption with <strong>bold</strong> text
        </Caption>
      </table>,
    );
    expect(screen.getByText("bold")).toBeInTheDocument();
  });

  it("forwards props to element", () => {
    render(
      <table>
        <Caption data-testid="custom-caption" id="test-id">
          Table caption
        </Caption>
      </table>,
    );
    const element = screen.getByTestId("custom-caption");
    expect(element).toHaveAttribute("id", "test-id");
  });
});

describe("CodeInline", () => {
  it("renders code element", () => {
    render(<CodeInline>const x = 1;</CodeInline>);
    const element = screen.getByText("const x = 1;");
    expect(element.tagName).toBe("CODE");
  });

  it("preserves code content exactly", () => {
    render(<CodeInline>console.log("hello")</CodeInline>);
    expect(screen.getByText('console.log("hello")')).toBeInTheDocument();
  });

  it("forwards props to element", () => {
    render(
      <CodeInline data-testid="custom-code" data-language="javascript">
        code
      </CodeInline>,
    );
    const element = screen.getByTestId("custom-code");
    expect(element).toHaveAttribute("data-language", "javascript");
  });

  it("renders empty code element gracefully", () => {
    const { container } = render(<CodeInline />);
    const element = container.querySelector("code");
    expect(element).toBeInTheDocument();
  });
});

describe("Link", () => {
  it("renders anchor element", () => {
    render(<Link href="/test">Test Link</Link>);
    const element = screen.getByRole("link", { name: "Test Link" });
    expect(element.tagName).toBe("A");
  });

  it("sets href attribute", () => {
    render(<Link href="/test-path">Test Link</Link>);
    const element = screen.getByRole("link");
    expect(element).toHaveAttribute("href", "/test-path");
  });

  it("supports external link attributes", () => {
    render(
      <Link
        href="https://example.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        External Link
      </Link>,
    );
    const element = screen.getByRole("link");
    expect(element).toHaveAttribute("target", "_blank");
    expect(element).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders children content", () => {
    render(
      <Link href="/test">
        Link with <strong>bold</strong> text
      </Link>,
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

  it("renders children content", () => {
    render(
      <Paragraph>
        Text with <strong>bold</strong> and <em>italic</em>
      </Paragraph>,
    );
    expect(screen.getByText("bold")).toBeInTheDocument();
    expect(screen.getByText("italic")).toBeInTheDocument();
  });

  it("forwards props to element", () => {
    render(
      <Paragraph data-testid="custom-paragraph" id="test-id">
        Test paragraph
      </Paragraph>,
    );
    const element = screen.getByTestId("custom-paragraph");
    expect(element).toHaveAttribute("id", "test-id");
  });
});

describe("Strong", () => {
  it("renders strong element", () => {
    render(<Strong>Bold text</Strong>);
    const element = screen.getByText("Bold text");
    expect(element.tagName).toBe("STRONG");
  });

  it("renders children content", () => {
    render(
      <Strong>
        Bold with <span>nested span</span>
      </Strong>,
    );
    expect(screen.getByText("nested span")).toBeInTheDocument();
  });

  it("forwards props to element", () => {
    render(
      <Strong data-testid="custom-strong" id="test-id">
        Bold text
      </Strong>,
    );
    const element = screen.getByTestId("custom-strong");
    expect(element).toHaveAttribute("id", "test-id");
  });
});

describe("List", () => {
  describe("unordered list", () => {
    it("renders ul element by default", () => {
      render(
        <List>
          <li>Item 1</li>
        </List>,
      );
      const item = screen.getByText("Item 1");
      expect(item.parentElement?.tagName).toBe("UL");
    });

    it("renders multiple items", () => {
      render(
        <List>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </List>,
      );
      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("Item 2")).toBeInTheDocument();
      expect(screen.getByText("Item 3")).toBeInTheDocument();
    });
  });

  describe("ordered list", () => {
    it("renders ol element when ordered is true", () => {
      render(
        <List ordered>
          <li>Item 1</li>
        </List>,
      );
      const item = screen.getByText("Item 1");
      expect(item.parentElement?.tagName).toBe("OL");
    });
  });

  it("renders nested content in items", () => {
    render(
      <List>
        <li>
          Item with <strong>bold</strong>
        </li>
      </List>,
    );
    expect(screen.getByText("bold")).toBeInTheDocument();
  });

  it("forwards props to element", () => {
    render(
      <List data-testid="custom-list" id="test-id">
        <li>Item 1</li>
      </List>,
    );
    const element = screen.getByTestId("custom-list");
    expect(element).toHaveAttribute("id", "test-id");
  });
});
