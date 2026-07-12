import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AboutSection from "~/components/AboutSection";

describe("AboutSection", () => {
  describe("Language support", () => {
    it("renders section title and English content", () => {
      render(<AboutSection lang="en" />);
      expect(
        screen.getByRole("heading", { name: "About" }),
      ).toBeInTheDocument();
      expect(screen.getByText(/I live in Barcelona/)).toBeInTheDocument();
    });

    it("renders section title and Spanish content", () => {
      render(<AboutSection lang="es" />);
      expect(
        screen.getByRole("heading", { name: "Sobre mí" }),
      ).toBeInTheDocument();
      expect(screen.getByText(/Vivo en Barcelona/)).toBeInTheDocument();
    });

    it("renders section title and Catalan content", () => {
      render(<AboutSection lang="ca" />);
      expect(
        screen.getByRole("heading", { name: "Sobre mi" }),
      ).toBeInTheDocument();
      expect(screen.getByText(/Visc a Barcelona/)).toBeInTheDocument();
    });

    it("falls back to English content for an unsupported language", () => {
      render(<AboutSection lang="fr" />);
      expect(screen.getByText(/I live in Barcelona/)).toBeInTheDocument();
    });
  });

  describe("External links", () => {
    it("links to Buffer with security attributes", () => {
      render(<AboutSection lang="en" />);
      const link = screen.getByRole("link", { name: "Buffer" });
      expect(link).toHaveAttribute("href", "https://buffer.com");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("links to Palabreja with security attributes", () => {
      render(<AboutSection lang="en" />);
      const link = screen.getByRole("link", { name: "Palabreja" });
      expect(link).toHaveAttribute("href", "https://palabreja.com");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });
});
