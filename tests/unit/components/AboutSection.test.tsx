import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AboutSection from "~/components/AboutSection";

describe("AboutSection", () => {
  describe("Language support", () => {
    it("renders section title in English", () => {
      render(<AboutSection lang="en" />);
      expect(
        screen.getByRole("heading", { name: "About" }),
      ).toBeInTheDocument();
    });

    it("renders section title in Spanish", () => {
      render(<AboutSection lang="es" />);
      expect(
        screen.getByRole("heading", { name: "Sobre mí" }),
      ).toBeInTheDocument();
    });

    it("renders section title in Catalan", () => {
      render(<AboutSection lang="ca" />);
      expect(
        screen.getByRole("heading", { name: "Sobre mi" }),
      ).toBeInTheDocument();
    });

    it("falls back to English content for an unsupported language", () => {
      render(<AboutSection lang="fr" />);
      expect(screen.getByText(/Software Engineer at/)).toBeInTheDocument();
    });
  });

  describe("External links", () => {
    it("labels the Buffer link with an opens-in-new-tab hint for every language", () => {
      ["en", "es", "ca"].forEach((lang) => {
        const { unmount } = render(<AboutSection lang={lang} />);
        const link = screen.getByRole("link", {
          name: "Visit Buffer (opens in new tab)",
        });
        expect(link).toHaveAttribute("href", "https://buffer.com");
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
        unmount();
      });
    });

    it("labels the Palabreja link with an opens-in-new-tab hint for every language", () => {
      ["en", "es", "ca"].forEach((lang) => {
        const { unmount } = render(<AboutSection lang={lang} />);
        const link = screen.getByRole("link", {
          name: "Visit Palabreja (opens in new tab)",
        });
        expect(link).toHaveAttribute("href", "https://palabreja.com");
        unmount();
      });
    });
  });
});
