import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import SectionHeader from "@/components/SectionHeader";

describe("SectionHeader", () => {
  it("renders an h2 element", () => {
    render(<SectionHeader>Writing</SectionHeader>);

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toBeInTheDocument();
  });

  it("renders children content", () => {
    render(<SectionHeader>Projects</SectionHeader>);

    expect(screen.getByText("Projects")).toBeInTheDocument();
  });

  it("applies section-header class", () => {
    const { container } = render(<SectionHeader>About</SectionHeader>);

    const h2 = container.querySelector("h2");
    expect(h2).toHaveClass("section-header");
  });

  it("renders complex children", () => {
    render(
      <SectionHeader>
        <span>Nested</span> content
      </SectionHeader>,
    );

    expect(screen.getByText("Nested")).toBeInTheDocument();
  });
});
