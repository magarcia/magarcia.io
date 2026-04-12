import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProjectsSection from "~/components/ProjectsSection";

vi.mock("~/data/projects", () => ({
  projects: [
    {
      name: "Featured Project",
      url: "https://example.com/featured",
      description: {
        en: "Featured description in English",
        es: "Descripción en español",
        ca: "Descripció en català",
      },
      featured: true,
    },
    {
      name: "Non-Featured Project",
      url: "https://example.com/non-featured",
      description: {
        en: "Non-featured description",
      },
    },
    {
      name: "Another Featured",
      url: "https://example.com/another",
      description: {
        en: "Another description in English",
      },
      featured: true,
    },
  ],
}));

describe("ProjectsSection", () => {
  describe("Featured projects filtering", () => {
    it("renders only featured projects", () => {
      render(<ProjectsSection lang="en" />);

      expect(screen.getByText("Featured Project")).toBeInTheDocument();
      expect(screen.getByText("Another Featured")).toBeInTheDocument();
      expect(
        screen.queryByText("Non-Featured Project"),
      ).not.toBeInTheDocument();
    });
  });

  describe("Language support", () => {
    it("renders section title in English", () => {
      render(<ProjectsSection lang="en" />);
      expect(
        screen.getByRole("heading", { name: "Projects" }),
      ).toBeInTheDocument();
    });

    it("renders section title in Spanish", () => {
      render(<ProjectsSection lang="es" />);
      expect(
        screen.getByRole("heading", { name: "Proyectos" }),
      ).toBeInTheDocument();
    });

    it("renders section title in Catalan", () => {
      render(<ProjectsSection lang="ca" />);
      expect(
        screen.getByRole("heading", { name: "Projectes" }),
      ).toBeInTheDocument();
    });

    it("renders localized project description for Spanish", () => {
      render(<ProjectsSection lang="es" />);
      expect(screen.getByText("Descripción en español")).toBeInTheDocument();
    });

    it("falls back to English description when translation is missing", () => {
      render(<ProjectsSection lang="fr" />);
      expect(
        screen.getByText("Another description in English"),
      ).toBeInTheDocument();
    });
  });

  describe("More projects link", () => {
    it("links to /projects/ for English", () => {
      render(<ProjectsSection lang="en" />);
      // Accessible name should be "More projects" without the arrow character
      const link = screen.getByRole("link", { name: "More projects" });
      expect(link).toHaveAttribute("href", "/projects/");
    });

    it("links to /es/projects/ for Spanish", () => {
      render(<ProjectsSection lang="es" />);
      const link = screen.getByRole("link", { name: "Más proyectos" });
      expect(link).toHaveAttribute("href", "/es/projects/");
    });

    it("links to /ca/projects/ for Catalan", () => {
      render(<ProjectsSection lang="ca" />);
      const link = screen.getByRole("link", { name: "Més projectes" });
      expect(link).toHaveAttribute("href", "/ca/projects/");
    });

    it("arrow in more projects link is hidden from screen readers", () => {
      const { container } = render(<ProjectsSection lang="en" />);
      const arrow = container.querySelector('[aria-hidden="true"]');
      expect(arrow).toBeInTheDocument();
      expect(arrow?.textContent).toBe("→");
    });
  });
});
