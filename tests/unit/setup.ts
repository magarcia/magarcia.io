import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock react-router Link component
vi.mock("react-router", () => ({
  Link: React.forwardRef(
    (
      {
        to,
        children,
        ...props
      }: {
        to: string;
        children: React.ReactNode;
        [key: string]: unknown;
      },
      ref: React.Ref<HTMLAnchorElement>
    ) => React.createElement("a", { href: to, ref, ...props }, children)
  ),
}));

// Mock react-feather icons
vi.mock("react-feather", () => ({
  Moon: () => React.createElement("svg", { "data-testid": "moon-icon" }),
  Sun: () => React.createElement("svg", { "data-testid": "sun-icon" }),
  Globe: () => React.createElement("svg", { "data-testid": "globe-icon" }),
  Hash: () => React.createElement("svg", { "data-testid": "hash-icon" }),
}));

// Mock useTheme hook - can be overridden in individual tests
vi.mock("~/hooks/useTheme", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: vi.fn(),
    toggleTheme: vi.fn(),
  }),
}));
