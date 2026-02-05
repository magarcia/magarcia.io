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
vi.mock("react-router", () => {
  const MockLink = React.forwardRef<
    HTMLAnchorElement,
    React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }
  >(({ to, children, ...props }, ref) =>
    React.createElement("a", { href: to, ref, ...props }, children),
  );
  MockLink.displayName = "MockLink";
  return { Link: MockLink };
});

// Mock useTheme hook - can be overridden in individual tests
vi.mock("~/hooks/useTheme", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: vi.fn(),
    toggleTheme: vi.fn(),
  }),
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Archive: () => React.createElement("svg", { "data-testid": "archive-icon" }),
  Check: () => React.createElement("svg", { "data-testid": "check-icon" }),
  ChevronRight: () =>
    React.createElement("svg", { "data-testid": "chevron-right-icon" }),
  Circle: () => React.createElement("svg", { "data-testid": "circle-icon" }),
  Copy: () => React.createElement("svg", { "data-testid": "copy-icon" }),
  ExternalLink: () =>
    React.createElement("svg", { "data-testid": "external-link-icon" }),
  Hash: () => React.createElement("svg", { "data-testid": "hash-icon" }),
  Link2: () => React.createElement("svg", { "data-testid": "link2-icon" }),
}));
