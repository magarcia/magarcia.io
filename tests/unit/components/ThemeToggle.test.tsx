import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "~/hooks/useTheme";

vi.mock("~/hooks/useTheme");

describe("ThemeToggle", () => {
  const mockToggleTheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("when theme is dark", () => {
    beforeEach(() => {
      vi.mocked(useTheme).mockReturnValue({
        theme: "dark",
        setTheme: vi.fn(),
        toggleTheme: mockToggleTheme,
      });
    });

    it("renders Sun icon", () => {
      render(<ThemeToggle />);
      expect(screen.getByTestId("sun-icon")).toBeInTheDocument();
      expect(screen.queryByTestId("moon-icon")).not.toBeInTheDocument();
    });

    it("applies yellow hover color class", () => {
      render(<ThemeToggle />);
      const button = screen.getByTestId("theme-toggle");
      expect(button.className).toContain("hover:text-yellow-300");
    });
  });

  describe("when theme is light", () => {
    beforeEach(() => {
      vi.mocked(useTheme).mockReturnValue({
        theme: "light",
        setTheme: vi.fn(),
        toggleTheme: mockToggleTheme,
      });
    });

    it("renders Moon icon", () => {
      render(<ThemeToggle />);
      expect(screen.getByTestId("moon-icon")).toBeInTheDocument();
      expect(screen.queryByTestId("sun-icon")).not.toBeInTheDocument();
    });

    it("applies purple hover color class", () => {
      render(<ThemeToggle />);
      const button = screen.getByTestId("theme-toggle");
      expect(button.className).toContain("hover:text-purple-500");
    });
  });

  it("calls toggleTheme when clicked", () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: "light",
      setTheme: vi.fn(),
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggle />);
    const button = screen.getByTestId("theme-toggle");

    fireEvent.click(button);

    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it("has correct aria-label for accessibility", () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: "light",
      setTheme: vi.fn(),
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggle />);
    const button = screen.getByLabelText("Toggle theme");
    expect(button).toBeInTheDocument();
  });

  it("applies correct button styling", () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: "light",
      setTheme: vi.fn(),
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggle />);
    const button = screen.getByTestId("theme-toggle");

    expect(button.className).toContain("p-2");
    expect(button.className).toContain("cursor-pointer");
    expect(button.className).toContain("opacity-50");
    expect(button.className).toContain("hover:opacity-100");
    expect(button.className).toContain("transition-opacity");
  });
});
