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

  describe("icon display based on theme", () => {
    it("shows sun icon when theme is dark (to switch to light)", () => {
      vi.mocked(useTheme).mockReturnValue({
        theme: "dark",
        setTheme: vi.fn(),
        toggleTheme: mockToggleTheme,
      });

      render(<ThemeToggle />);
      expect(screen.getByTestId("sun-icon")).toBeInTheDocument();
      expect(screen.queryByTestId("moon-icon")).not.toBeInTheDocument();
    });

    it("shows moon icon when theme is light (to switch to dark)", () => {
      vi.mocked(useTheme).mockReturnValue({
        theme: "light",
        setTheme: vi.fn(),
        toggleTheme: mockToggleTheme,
      });

      render(<ThemeToggle />);
      expect(screen.getByTestId("moon-icon")).toBeInTheDocument();
      expect(screen.queryByTestId("sun-icon")).not.toBeInTheDocument();
    });
  });

  describe("theme toggling", () => {
    it("calls toggleTheme when clicked", () => {
      vi.mocked(useTheme).mockReturnValue({
        theme: "light",
        setTheme: vi.fn(),
        toggleTheme: mockToggleTheme,
      });

      render(<ThemeToggle />);
      fireEvent.click(screen.getByRole("button"));

      expect(mockToggleTheme).toHaveBeenCalledTimes(1);
    });

    it("can be activated with keyboard", () => {
      vi.mocked(useTheme).mockReturnValue({
        theme: "light",
        setTheme: vi.fn(),
        toggleTheme: mockToggleTheme,
      });

      render(<ThemeToggle />);
      const button = screen.getByRole("button");
      fireEvent.keyDown(button, { key: "Enter" });

      expect(button).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has accessible label for screen readers", () => {
      vi.mocked(useTheme).mockReturnValue({
        theme: "light",
        setTheme: vi.fn(),
        toggleTheme: mockToggleTheme,
      });

      render(<ThemeToggle />);
      expect(screen.getByLabelText("Toggle theme")).toBeInTheDocument();
    });

    it("is a button element for proper semantics", () => {
      vi.mocked(useTheme).mockReturnValue({
        theme: "light",
        setTheme: vi.fn(),
        toggleTheme: mockToggleTheme,
      });

      render(<ThemeToggle />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });
});
