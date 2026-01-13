import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
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

  it("renders code content correctly", () => {
    const code = "line 1\nline 2\nline 3";
    const { container } = render(
      <CodeBlock language="javascript">
        {[code]}
      </CodeBlock>
    );

    const pre = container.querySelector("pre");
    expect(pre).toBeInTheDocument();

    // The code should be rendered inside a code element
    const codeElement = container.querySelector("code");
    expect(codeElement).toBeInTheDocument();
    expect(codeElement?.textContent).toBe(code);
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

  it("renders code with proper structure", () => {
    const code = "const x = 1;";
    const { container } = render(
      <CodeBlock language="javascript">
        {[code]}
      </CodeBlock>
    );

    // Check that the structure is rendered correctly
    const pre = container.querySelector("pre");
    expect(pre).toBeInTheDocument();
    expect(pre).toHaveClass("language-javascript");

    // The code element should have the language class
    const codeElement = container.querySelector("code");
    expect(codeElement).toBeInTheDocument();
    expect(codeElement).toHaveClass("language-javascript");

    // Wrapper should exist
    const wrapper = container.querySelector("div.relative");
    expect(wrapper).toBeInTheDocument();
  });

  it("renders code content inside code element", () => {
    const code = "line 1\nline 2\nline 3";
    const { container } = render(
      <CodeBlock language="javascript">
        {[code]}
      </CodeBlock>
    );

    const codeElement = container.querySelector("code");
    expect(codeElement).toBeInTheDocument();
    expect(codeElement?.textContent).toBe(code);
  });
});
