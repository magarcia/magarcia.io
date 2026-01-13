import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CodeInline from "~/components/CodeInline";

describe("CodeInline", () => {
  it("renders code element with children", () => {
    render(<CodeInline>const x = 1;</CodeInline>);

    const code = screen.getByText("const x = 1;");
    expect(code).toBeInTheDocument();
    expect(code.tagName).toBe("CODE");
  });

  it("applies monospace font class", () => {
    const { container } = render(<CodeInline>test</CodeInline>);

    const code = container.querySelector("code");
    expect(code).toHaveClass("font-mono");
  });

  it("applies semantic background color class", () => {
    const { container } = render(<CodeInline>test</CodeInline>);

    const code = container.querySelector("code");
    expect(code).toHaveClass("bg-muted");
  });

  it("applies foreground text color class", () => {
    const { container } = render(<CodeInline>test</CodeInline>);

    const code = container.querySelector("code");
    expect(code).toHaveClass("text-foreground");
  });

  it("passes through valid HTML attributes", () => {
    const { container } = render(
      <CodeInline data-testid="inline-code" id="test-id">
        code
      </CodeInline>
    );

    const code = container.querySelector("code");
    expect(code).toHaveAttribute("data-testid", "inline-code");
    expect(code).toHaveAttribute("id", "test-id");
  });

  it("renders empty content gracefully", () => {
    const { container } = render(<CodeInline />);

    const code = container.querySelector("code");
    expect(code).toBeInTheDocument();
    expect(code).toBeEmptyDOMElement();
  });

  it("renders complex children", () => {
    render(
      <CodeInline>
        <span>nested</span> content
      </CodeInline>
    );

    expect(screen.getByText("nested")).toBeInTheDocument();
    expect(screen.getByText("content", { exact: false })).toBeInTheDocument();
  });
});
