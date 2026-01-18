import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { mdxComponents } from "~/components/mdxComponents";

describe("mdxComponents", () => {
  describe("component mappings", () => {
    it("exports all required MDX component mappings", () => {
      const expectedComponents = [
        "h1",
        "h2",
        "h3",
        "h4",
        "p",
        "a",
        "strong",
        "blockquote",
        "pre",
        "code",
        "ul",
        "ol",
        "table",
        "thead",
        "tbody",
        "tr",
        "td",
        "th",
        "caption",
      ];

      expectedComponents.forEach((component) => {
        expect(mdxComponents).toHaveProperty(component);
        expect(typeof mdxComponents[component as keyof typeof mdxComponents]).toBe("function");
      });
    });
  });

  describe("Pre component - code block rendering", () => {
    const Pre = mdxComponents.pre;

    it("renders code block without crashing", () => {
      const children = {
        props: {
          className: "language-typescript",
          children: "const x: string = 'test';",
        },
      } as React.ReactNode;

      expect(() => render(<Pre>{children}</Pre>)).not.toThrow();
    });

    it("identifies language from className", () => {
      const children = {
        props: {
          className: "language-typescript",
          children: "const x = 1;",
        },
      } as React.ReactNode;

      const { container } = render(<Pre>{children}</Pre>);
      expect(container.querySelector("[data-language='typescript']")).toBeInTheDocument();
    });

    it("defaults to text language when no className", () => {
      const children = {
        props: {
          children: "plain text",
        },
      } as React.ReactNode;

      const { container } = render(<Pre>{children}</Pre>);
      expect(container.querySelector("[data-language='text']")).toBeInTheDocument();
    });

    it("handles children without props object", () => {
      const children = "plain text code";
      const { container } = render(<Pre>{children}</Pre>);
      expect(container.querySelector("[data-language='text']")).toBeInTheDocument();
    });

    it("renders pre element for code structure", () => {
      const children = {
        props: {
          className: "language-javascript",
          children: "line1\nline2\nline3",
        },
      } as React.ReactNode;

      const { container } = render(<Pre>{children}</Pre>);
      expect(container.querySelector("pre")).toBeInTheDocument();
    });
  });

  describe("Pre component - language parsing", () => {
    const Pre = mdxComponents.pre;

    it("parses language with highlight syntax", () => {
      const children = {
        props: {
          className: "language-typescript:1,3,5",
          children: "code",
        },
      } as React.ReactNode;

      const { container } = render(<Pre>{children}</Pre>);
      expect(container.querySelector("[data-language='typescript']")).toBeInTheDocument();
    });

    it("handles range syntax in highlight specification", () => {
      const children = {
        props: {
          className: "language-javascript:3-5",
          children: "line1\nline2\nline3\nline4\nline5",
        },
      } as React.ReactNode;

      const { container } = render(<Pre>{children}</Pre>);
      expect(container.querySelector("[data-language='javascript']")).toBeInTheDocument();
    });

    it("handles mixed single lines and ranges", () => {
      const children = {
        props: {
          className: "language-python:1,3-5,7",
          children: "line1\nline2\nline3\nline4\nline5\nline6\nline7",
        },
      } as React.ReactNode;

      const { container } = render(<Pre>{children}</Pre>);
      expect(container.querySelector("[data-language='python']")).toBeInTheDocument();
    });
  });

  describe("Pre component - robustness", () => {
    const Pre = mdxComponents.pre;

    it("handles non-numeric highlight values gracefully", () => {
      const children = {
        props: {
          className: "language-javascript:abc",
          children: "console.log('test');",
        },
      } as React.ReactNode;

      expect(() => render(<Pre>{children}</Pre>)).not.toThrow();
    });

    it("handles reversed range gracefully", () => {
      const children = {
        props: {
          className: "language-javascript:5-3",
          children: "line1\nline2\nline3\nline4\nline5",
        },
      } as React.ReactNode;

      expect(() => render(<Pre>{children}</Pre>)).not.toThrow();
    });

    it("handles empty highlight after colon", () => {
      const children = {
        props: {
          className: "language-javascript:",
          children: "console.log('test');",
        },
      } as React.ReactNode;

      expect(() => render(<Pre>{children}</Pre>)).not.toThrow();
    });

    it("handles out-of-bounds line numbers", () => {
      const children = {
        props: {
          className: "language-javascript:999",
          children: "console.log('test');",
        },
      } as React.ReactNode;

      expect(() => render(<Pre>{children}</Pre>)).not.toThrow();
    });

    it("handles null className", () => {
      const children = {
        props: {
          className: null,
          children: "console.log('test');",
        },
      } as React.ReactNode;

      expect(() => render(<Pre>{children}</Pre>)).not.toThrow();
    });

    it("handles undefined className", () => {
      const children = {
        props: {
          className: undefined,
          children: "console.log('test');",
        },
      } as React.ReactNode;

      expect(() => render(<Pre>{children}</Pre>)).not.toThrow();
    });
  });

  describe("heading components", () => {
    it("h1 renders correct semantic element", () => {
      const H1 = mdxComponents.h1;
      render(<H1>Test H1</H1>);
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Test H1");
    });

    it("h2 renders correct semantic element", () => {
      const H2 = mdxComponents.h2;
      render(<H2>Test H2</H2>);
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Test H2");
    });

    it("h3 renders correct semantic element", () => {
      const H3 = mdxComponents.h3;
      render(<H3>Test H3</H3>);
      expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("Test H3");
    });

    it("h4 renders correct semantic element", () => {
      const H4 = mdxComponents.h4;
      render(<H4>Test H4</H4>);
      expect(screen.getByRole("heading", { level: 4 })).toHaveTextContent("Test H4");
    });
  });

  describe("text formatting components", () => {
    it("strong renders semantic strong element", () => {
      const Strong = mdxComponents.strong;
      const { container } = render(<Strong>Bold Text</Strong>);
      const strong = container.querySelector("strong");
      expect(strong).toBeInTheDocument();
      expect(strong).toHaveTextContent("Bold Text");
    });

    it("code renders inline code content", () => {
      const Code = mdxComponents.code;
      const { container } = render(<Code>inline code</Code>);
      expect(container.textContent).toBe("inline code");
    });

    it("blockquote renders quote content", () => {
      const Blockquote = mdxComponents.blockquote;
      const { container } = render(<Blockquote>Quote text</Blockquote>);
      const blockquote = container.querySelector("blockquote");
      expect(blockquote).toBeInTheDocument();
      expect(blockquote).toHaveTextContent("Quote text");
    });

    it("paragraph renders text content", () => {
      const Paragraph = mdxComponents.p;
      const { container } = render(<Paragraph>Paragraph text</Paragraph>);
      const p = container.querySelector("p");
      expect(p).toBeInTheDocument();
      expect(p).toHaveTextContent("Paragraph text");
    });
  });

  describe("link component", () => {
    it("renders anchor with href", () => {
      const Link = mdxComponents.a;
      const { container } = render(<Link href="/test">Link Text</Link>);
      const link = container.querySelector("a");
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/test");
      expect(link).toHaveTextContent("Link Text");
    });

    it("renders external links", () => {
      const Link = mdxComponents.a;
      const { container } = render(<Link href="https://example.com">External</Link>);
      const link = container.querySelector("a");
      expect(link).toHaveAttribute("href", "https://example.com");
    });
  });

  describe("list components", () => {
    it("ol renders ordered list", () => {
      const OrderedList = mdxComponents.ol;
      const { container } = render(
        <OrderedList>
          <li>Item 1</li>
          <li>Item 2</li>
        </OrderedList>
      );

      const ol = container.querySelector("ol");
      expect(ol).toBeInTheDocument();
      expect(ol?.querySelectorAll("li")).toHaveLength(2);
    });

    it("ul renders unordered list", () => {
      const UnorderedList = mdxComponents.ul;
      const { container } = render(
        <UnorderedList>
          <li>Item 1</li>
          <li>Item 2</li>
        </UnorderedList>
      );

      const ul = container.querySelector("ul");
      expect(ul).toBeInTheDocument();
      expect(ul?.querySelectorAll("li")).toHaveLength(2);
    });
  });

  describe("table components", () => {
    it("table renders with proper structure", () => {
      const Table = mdxComponents.table;
      const Thead = mdxComponents.thead;
      const Tbody = mdxComponents.tbody;
      const Tr = mdxComponents.tr;
      const Th = mdxComponents.th;
      const Td = mdxComponents.td;

      const { container } = render(
        <Table>
          <Thead>
            <Tr>
              <Th>Header</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Cell</Td>
            </Tr>
          </Tbody>
        </Table>
      );

      expect(container.querySelector("table")).toBeInTheDocument();
      expect(container.querySelector("thead")).toBeInTheDocument();
      expect(container.querySelector("tbody")).toBeInTheDocument();
      expect(screen.getByText("Header")).toBeInTheDocument();
      expect(screen.getByText("Cell")).toBeInTheDocument();
    });

    it("caption renders table caption", () => {
      const Table = mdxComponents.table;
      const Caption = mdxComponents.caption;

      const { container } = render(
        <Table>
          <Caption>Table description</Caption>
        </Table>
      );

      const caption = container.querySelector("caption");
      expect(caption).toBeInTheDocument();
      expect(caption).toHaveTextContent("Table description");
    });
  });
});
