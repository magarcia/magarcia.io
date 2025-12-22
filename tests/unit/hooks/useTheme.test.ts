import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

// Unmock the hook for these tests
vi.unmock("~/hooks/useTheme");

import { useTheme } from "~/hooks/useTheme";

describe("useTheme", () => {
  let matchMediaMock: ReturnType<typeof vi.fn>;
  let localStorageMock: {
    getItem: ReturnType<typeof vi.fn>;
    setItem: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    document.documentElement.className = "";

    localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
    };
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
    });

    matchMediaMock = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    Object.defineProperty(window, "matchMedia", {
      value: matchMediaMock,
      writable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("initial theme", () => {
    it("should use stored theme from localStorage when available", () => {
      localStorageMock.getItem.mockReturnValue("dark");

      const { result } = renderHook(() => useTheme());

      expect(result.current.theme).toBe("dark");
      expect(localStorageMock.getItem).toHaveBeenCalledWith("theme");
    });

    it("should use system preference when localStorage is empty", () => {
      localStorageMock.getItem.mockReturnValue(null);
      matchMediaMock.mockReturnValue({
        matches: true,
        media: "(prefers-color-scheme: dark)",
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      });

      const { result } = renderHook(() => useTheme());

      expect(result.current.theme).toBe("dark");
    });

    it("should default to light theme when no localStorage and system prefers light", () => {
      localStorageMock.getItem.mockReturnValue(null);
      matchMediaMock.mockReturnValue({
        matches: false,
        media: "(prefers-color-scheme: dark)",
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      });

      const { result } = renderHook(() => useTheme());

      expect(result.current.theme).toBe("light");
    });
  });

  describe("toggleTheme", () => {
    it("should toggle from light to dark", () => {
      localStorageMock.getItem.mockReturnValue("light");

      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe("dark");
      expect(localStorageMock.setItem).toHaveBeenCalledWith("theme", "dark");
    });

    it("should toggle from dark to light", () => {
      localStorageMock.getItem.mockReturnValue("dark");

      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe("light");
      expect(localStorageMock.setItem).toHaveBeenCalledWith("theme", "light");
    });
  });

  describe("setTheme", () => {
    it("should update theme to dark and persist to localStorage", () => {
      localStorageMock.getItem.mockReturnValue("light");

      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme("dark");
      });

      expect(result.current.theme).toBe("dark");
      expect(localStorageMock.setItem).toHaveBeenCalledWith("theme", "dark");
    });

    it("should update theme to light and persist to localStorage", () => {
      localStorageMock.getItem.mockReturnValue("dark");

      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme("light");
      });

      expect(result.current.theme).toBe("light");
      expect(localStorageMock.setItem).toHaveBeenCalledWith("theme", "light");
    });
  });

  describe("DOM class updates", () => {
    it("should add dark class to documentElement when theme is dark", () => {
      localStorageMock.getItem.mockReturnValue("light");

      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme("dark");
      });

      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });

    it("should remove dark class from documentElement when theme is light", () => {
      localStorageMock.getItem.mockReturnValue("dark");
      document.documentElement.classList.add("dark");

      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme("light");
      });

      expect(document.documentElement.classList.contains("dark")).toBe(false);
    });
  });
});
