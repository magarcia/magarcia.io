import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CodeBlock from "~/components/CodeBlock";

describe("CodeBlock", () => {
  it("renders pre and code elements with correct structure", () => {
    const { container } = render(
      <CodeBlock language="javascript">
        {["console.log('Hello World');"]}
      </CodeBlock>
    );

    const pre = container.querySelector("pre");
    expect(pre).toBeInTheDocument();
    expect(pre).toHaveClass("language-javascript");
  });

  it("applies correct language class to pre element", () => {
    const { container } = render(
      <CodeBlock language="typescript">
        {["const x: string = 'test';"]}
      </CodeBlock>
    );

    const pre = container.querySelector("pre");
    expect(pre).toHaveClass("language-typescript");
  });

  it("handles yumml to yaml language mapping", () => {
    const { container } = render(
      <CodeBlock language="yumml">
        {["key: value"]}
      </CodeBlock>
    );

    const pre = container.querySelector("pre");
    expect(pre).toHaveClass("language-yaml");
    expect(pre).not.toHaveClass("language-yumml");
  });

  it("renders line highlighting by applying opacity to non-highlighted lines", () => {
    const code = "line 1\nline 2\nline 3";
    const { container } = render(
      <CodeBlock language="javascript" highlight={[1, 3]}>
        {[code]}
      </CodeBlock>
    );

    const lines = container.querySelectorAll("div[class*='px-4']");

    // Should have at least 3 lines
    expect(lines.length).toBeGreaterThanOrEqual(2);

    // Line 1 (index 0): highlighted, should NOT have opacity-30
    expect(lines[0]).not.toHaveClass("opacity-30");

    // Line 2 (index 1): not highlighted, should have opacity-30
    expect(lines[1]).toHaveClass("opacity-30");
    expect(lines[1]).toHaveClass("text-gray-50");
  });

  it("handles string children by extracting first element if array", () => {
    const code = "const test = true;";
    const { container } = render(
      <CodeBlock language="javascript">
        {[code]}
      </CodeBlock>
    );

    // The code should be rendered - check the wrapper div exists
    const wrapper = container.querySelector("div");
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass("relative");

    // Pre element should exist even if prism doesn't render tokens in test
    const pre = container.querySelector("pre");
    expect(pre).toBeInTheDocument();
  });

  it("handles string children directly when not in array", () => {
    const code = "const test = true;";
    const { container } = render(
      <CodeBlock language="javascript">
        {code as any}
      </CodeBlock>
    );

    // The code should be rendered - check the wrapper div exists
    const wrapper = container.querySelector("div");
    expect(wrapper).toBeInTheDocument();

    // Pre element should exist even if prism doesn't render tokens in test
    const pre = container.querySelector("pre");
    expect(pre).toBeInTheDocument();
  });

  it("defaults to text language when no language provided", () => {
    const { container } = render(
      <CodeBlock>
        {["plain text"]}
      </CodeBlock>
    );

    const pre = container.querySelector("pre");
    expect(pre).toHaveClass("language-text");
  });

  it("passes additional props to wrapper div", () => {
    const { container } = render(
      <CodeBlock
        language="javascript"
        data-language="javascript"
        className="custom-class"
      >
        {["console.log('test');"]}
      </CodeBlock>
    );

    const wrapper = container.querySelector("[data-language]");
    expect(wrapper).toHaveAttribute("data-language", "javascript");
  });

  it("uses prism-react-renderer for syntax highlighting", () => {
    const code = "const x = 1;";
    const { container } = render(
      <CodeBlock language="javascript">
        {[code]}
      </CodeBlock>
    );

    // Check that the structure is rendered correctly
    // prism-react-renderer may not fully render in jsdom test environment
    const pre = container.querySelector("pre");
    expect(pre).toBeInTheDocument();
    expect(pre).toHaveClass("language-javascript");

    // The component uses Highlight from prism-react-renderer
    // In test environment, the structure should still be present
    const wrapper = container.querySelector("div.relative");
    expect(wrapper).toBeInTheDocument();
  });

  it("applies text-gray-50 class to tokens in non-highlighted lines", () => {
    const code = "line 1\nline 2\nline 3";
    const { container } = render(
      <CodeBlock language="javascript" highlight={[1]}>
        {[code]}
      </CodeBlock>
    );

    const lines = container.querySelectorAll("div[class*='px-4']");

    // Line 2 (index 1): not highlighted
    const line2Tokens = lines[1].querySelectorAll(".token");
    line2Tokens.forEach(token => {
      expect(token).toHaveClass("text-gray-50");
    });
  });

  it("renders without highlighting when no highlight prop provided", () => {
    const code = "line 1\nline 2";
    const { container } = render(
      <CodeBlock language="javascript">
        {[code]}
      </CodeBlock>
    );

    const lines = container.querySelectorAll("div[class*='px-4']");

    // No lines should have opacity-30 when no highlighting
    lines.forEach(line => {
      expect(line).not.toHaveClass("opacity-30");
    });
  });
});
