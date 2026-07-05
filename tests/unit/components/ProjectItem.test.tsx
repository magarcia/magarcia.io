import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ProjectItem from "~/components/ProjectItem";

describe("ProjectItem", () => {
  const defaultProps = {
    name: "cross-keychain",
    url: "https://example.com/cross-keychain",
    description: "A cross-platform keychain library",
  };

  it("renders the project name and description", () => {
    render(<ProjectItem {...defaultProps} />);

    expect(screen.getByText("cross-keychain")).toBeInTheDocument();
    expect(
      screen.getByText("A cross-platform keychain library"),
    ).toBeInTheDocument();
  });

  it("links to the project url", () => {
    render(<ProjectItem {...defaultProps} />);

    const link = screen.getByRole("link", { name: /cross-keychain/ });
    expect(link).toHaveAttribute("href", defaultProps.url);
  });

  it("opens the link in a new tab with secure rel attributes", () => {
    render(<ProjectItem {...defaultProps} />);

    const link = screen.getByRole("link", { name: /cross-keychain/ });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
