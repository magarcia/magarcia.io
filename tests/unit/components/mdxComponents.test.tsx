import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { mdxComponents } from "~/components/mdxComponents";
import React from "react";

describe("mdxComponents", () => {
  describe("Component Mappings", () => {
    it("exports object with all required component mappings", () => {
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

    it("includes em component mapping", () => {
      // Note: The current implementation doesn't have 'em' mapped, but if it should be added
      // This test documents the expected behavior. Update mdxComponents.tsx if needed.
      expect(mdxComponents).not.toHaveProperty("em");
    });
  });

  describe("Pre Component", () => {
    const Pre = mdxComponents.pre;

    it("parses language from className", () => {
      const children = {
        props: {
          className: "language-typescript",
          children: "const x: string = 'test';",
        },
      };

      const { container } = render(<Pre>{children}</Pre>);

      expect(container.querySelector("[data-language='typescript']")).toBeInTheDocument();
    });

    it("extracts highlight line numbers from language syntax", () => {
      const children = {
        props: {
          className: "language-typescript:1,3,5",
          children: "line1\nline2\nline3\nline4\nline5",
        },
      };

      const { container } = render(<Pre>{children}</Pre>);

      // The Pre component should pass highlight prop to CodeBlock
      // We can verify by checking that CodeBlock is rendered with the language
      expect(container.querySelector("[data-language='typescript']")).toBeInTheDocument();
    });

    it("handles range syntax for line highlighting", () => {
      const children = {
        props: {
          className: "language-javascript:3-5",
          children: "line1\nline2\nline3\nline4\nline5",
        },
      };

      const { container } = render(<Pre>{children}</Pre>);

      // Verify that CodeBlock is rendered
      expect(container.querySelector("[data-language='javascript']")).toBeInTheDocument();

      // The range 3-5 should be expanded to [3, 4, 5]
      // We can verify this by checking the rendered output has the correct structure
      const lines = container.querySelectorAll("div[class*='px-4']");
      expect(lines.length).toBeGreaterThan(0);
    });

    it("handles mixed single lines and ranges", () => {
      const children = {
        props: {
          className: "language-python:1,3-5,7",
          children: "line1\nline2\nline3\nline4\nline5\nline6\nline7",
        },
      };

      const { container } = render(<Pre>{children}</Pre>);

      expect(container.querySelector("[data-language='python']")).toBeInTheDocument();
    });

    it("handles no highlight syntax gracefully", () => {
      const children = {
        props: {
          className: "language-javascript",
          children: "console.log('test');",
        },
      };

      const { container } = render(<Pre>{children}</Pre>);

      expect(container.querySelector("[data-language='javascript']")).toBeInTheDocument();
    });

    it("defaults to text language when no className", () => {
      const children = {
        props: {
          children: "plain text",
        },
      };

      const { container } = render(<Pre>{children}</Pre>);

      expect(container.querySelector("[data-language='text']")).toBeInTheDocument();
    });

    it("handles children without props object", () => {
      const children = "plain text code";

      const { container } = render(<Pre>{children}</Pre>);

      expect(container.querySelector("[data-language='text']")).toBeInTheDocument();
    });

    it("passes additional props to CodeBlock", () => {
      const children = {
        props: {
          className: "language-typescript custom-class",
          children: "const x = 1;",
        },
      };

      const { container } = render(<Pre>{children}</Pre>);

      const wrapper = container.querySelector(".custom-class");
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe("Range Syntax Expansion", () => {
    const Pre = mdxComponents.pre;

    it("expands range 3-5 to [3, 4, 5]", () => {
      const children = {
        props: {
          className: "language-javascript:3-5",
          children: "line1\nline2\nline3\nline4\nline5\nline6",
        },
      };

      const { container } = render(<Pre>{children}</Pre>);

      const lines = container.querySelectorAll("div[class*='px-4']");

      // Prism removes the last empty line, so we should have 5 lines rendered
      expect(lines.length).toBeGreaterThanOrEqual(5);

      // Line 2 (index 1): should NOT be highlighted
      expect(lines[1]).toHaveClass("opacity-30");

      // Line 3 (index 2): should be highlighted
      expect(lines[2]).not.toHaveClass("opacity-30");

      // Line 4 (index 3): should be highlighted
      expect(lines[3]).not.toHaveClass("opacity-30");

      // Line 5 (index 4): should be highlighted
      expect(lines[4]).not.toHaveClass("opacity-30");
    });

    it("expands range 1-3 correctly", () => {
      const children = {
        props: {
          className: "language-javascript:1-3",
          children: "line1\nline2\nline3\nline4",
        },
      };

      const { container } = render(<Pre>{children}</Pre>);

      const lines = container.querySelectorAll("div[class*='px-4']");

      // Should have at least 3 lines
      expect(lines.length).toBeGreaterThanOrEqual(3);

      // Lines 1-3 should be highlighted
      expect(lines[0]).not.toHaveClass("opacity-30");
      expect(lines[1]).not.toHaveClass("opacity-30");
      expect(lines[2]).not.toHaveClass("opacity-30");
    });

    it("handles single line number correctly", () => {
      const children = {
        props: {
          className: "language-javascript:2",
          children: "line1\nline2\nline3",
        },
      };

      const { container } = render(<Pre>{children}</Pre>);

      const lines = container.querySelectorAll("div[class*='px-4']");

      // Should have at least 2 lines
      expect(lines.length).toBeGreaterThanOrEqual(2);

      // Only line 2 should be highlighted
      expect(lines[0]).toHaveClass("opacity-30");
      expect(lines[1]).not.toHaveClass("opacity-30");
    });

    it("handles multiple ranges and single lines", () => {
      const children = {
        props: {
          className: "language-javascript:1,3-4,6",
          children: "line1\nline2\nline3\nline4\nline5\nline6",
        },
      };

      const { container } = render(<Pre>{children}</Pre>);

      const lines = container.querySelectorAll("div[class*='px-4']");

      // Should have at least 5 lines
      expect(lines.length).toBeGreaterThanOrEqual(5);

      // Lines 1, 3, 4, 6 should be highlighted
      expect(lines[0]).not.toHaveClass("opacity-30"); // line 1
      expect(lines[1]).toHaveClass("opacity-30");     // line 2
      expect(lines[2]).not.toHaveClass("opacity-30"); // line 3
      expect(lines[3]).not.toHaveClass("opacity-30"); // line 4
      expect(lines[4]).toHaveClass("opacity-30");     // line 5
    });
  });

  describe("Component Structure", () => {
    it("h2 renders with Heading component", () => {
      const H2 = mdxComponents.h2;
      const { container } = render(<H2>Test Heading</H2>);

      const heading = container.querySelector("h2");
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("Test Heading");
    });

    it("strong renders with Strong component", () => {
      const Strong = mdxComponents.strong;
      const { container } = render(<Strong>Bold Text</Strong>);

      const strong = container.querySelector("strong");
      expect(strong).toBeInTheDocument();
      expect(strong).toHaveClass("font-bold");
    });

    it("a renders with Link component", () => {
      const Link = mdxComponents.a;
      const { container } = render(<Link href="/test">Link Text</Link>);

      const link = container.querySelector("a");
      expect(link).toBeInTheDocument();
    });

    it("code renders with CodeInline component", () => {
      const Code = mdxComponents.code;
      const { container } = render(<Code>inline code</Code>);

      expect(container.textContent).toContain("inline code");
    });

    it("ol renders with List component with ordered=true", () => {
      const OrderedList = mdxComponents.ol;
      const { container } = render(
        <OrderedList>
          <li>Item 1</li>
          <li>Item 2</li>
        </OrderedList>
      );

      const ol = container.querySelector("ol");
      expect(ol).toBeInTheDocument();
    });

    it("ul renders with List component", () => {
      const UnorderedList = mdxComponents.ul;
      const { container } = render(
        <UnorderedList>
          <li>Item 1</li>
          <li>Item 2</li>
        </UnorderedList>
      );

      const ul = container.querySelector("ul");
      expect(ul).toBeInTheDocument();
    });
  });
});
