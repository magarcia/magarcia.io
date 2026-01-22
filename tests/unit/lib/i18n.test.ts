import { describe, it, expect } from "vitest";
import {
  formatDate,
  formatReadingTime,
  formatTagPageTitle,
  getSectionTitle,
} from "../../../lib/i18n";

describe("i18n utilities", () => {
  describe("formatDate", () => {
    it("formats date in English by default", () => {
      const result = formatDate("2024-01-15");
      expect(result).toBe("15 January 2024");
    });

    it("formats date in English when lang=en", () => {
      const result = formatDate("2024-01-15", "en");
      expect(result).toBe("15 January 2024");
    });

    it("formats date in Spanish when lang=es", () => {
      const result = formatDate("2024-01-15", "es");
      expect(result).toBe("15 enero 2024");
    });

    it("formats date in Catalan when lang=ca", () => {
      const result = formatDate("2024-01-15", "ca");
      expect(result).toBe("15 gener 2024");
    });

    it("falls back to English for invalid lang", () => {
      const result = formatDate("2024-01-15", "invalid");
      expect(result).toBe("15 January 2024");
    });

    it("handles different months correctly", () => {
      expect(formatDate("2024-12-25", "en")).toBe("25 December 2024");
      expect(formatDate("2024-06-01", "es")).toBe("1 junio 2024");
    });
  });

  describe("formatReadingTime", () => {
    it("formats reading time in English by default", () => {
      const result = formatReadingTime(5);
      expect(result).toBe("5 min read");
    });

    it("formats reading time in English when lang=en", () => {
      const result = formatReadingTime(3, "en");
      expect(result).toBe("3 min read");
    });

    it("formats reading time in Spanish when lang=es", () => {
      const result = formatReadingTime(7, "es");
      expect(result).toBe("7 min de lectura");
    });

    it("formats reading time in Catalan when lang=ca", () => {
      const result = formatReadingTime(10, "ca");
      expect(result).toBe("10 min de lectura");
    });

    it("rounds up fractional minutes", () => {
      expect(formatReadingTime(3.2, "en")).toBe("4 min read");
      expect(formatReadingTime(5.8, "en")).toBe("6 min read");
      expect(formatReadingTime(1.1, "es")).toBe("2 min de lectura");
    });

    it("handles 1 minute correctly", () => {
      expect(formatReadingTime(1, "en")).toBe("1 min read");
      expect(formatReadingTime(0.5, "en")).toBe("1 min read");
    });

    it("falls back to English for invalid lang", () => {
      const result = formatReadingTime(5, "invalid");
      expect(result).toBe("5 min read");
    });
  });

  describe("formatTagPageTitle", () => {
    it("formats single post in English by default", () => {
      const result = formatTagPageTitle(1, "typescript");
      expect(result).toBe('1 post tagged with "typescript"');
    });

    it("formats multiple posts in English", () => {
      const result = formatTagPageTitle(5, "react", "en");
      expect(result).toBe('5 posts tagged with "react"');
    });

    it("formats single post in Spanish", () => {
      const result = formatTagPageTitle(1, "typescript", "es");
      expect(result).toBe('1 post etiquetado con "typescript"');
    });

    it("formats multiple posts in Spanish", () => {
      const result = formatTagPageTitle(3, "react", "es");
      expect(result).toBe('3 posts etiquetados con "react"');
    });

    it("formats single post in Catalan", () => {
      const result = formatTagPageTitle(1, "typescript", "ca");
      expect(result).toBe('1 post etiquetat amb "typescript"');
    });

    it("formats multiple posts in Catalan", () => {
      const result = formatTagPageTitle(7, "react", "ca");
      expect(result).toBe('7 posts etiquetats amb "react"');
    });

    it("handles zero posts", () => {
      expect(formatTagPageTitle(0, "react", "en")).toBe(
        '0 posts tagged with "react"',
      );
      expect(formatTagPageTitle(0, "react", "es")).toBe(
        '0 posts etiquetados con "react"',
      );
    });

    it("falls back to English for invalid lang", () => {
      const result = formatTagPageTitle(2, "vue", "invalid");
      expect(result).toBe('2 posts tagged with "vue"');
    });
  });

  describe("getSectionTitle", () => {
    it("returns about section title in English by default", () => {
      const result = getSectionTitle("about");
      expect(result).toBe("About");
    });

    it("returns about section title in Spanish", () => {
      const result = getSectionTitle("about", "es");
      expect(result).toBe("Sobre mí");
    });

    it("returns about section title in Catalan", () => {
      const result = getSectionTitle("about", "ca");
      expect(result).toBe("Sobre mi");
    });

    it("returns projects section title in English", () => {
      const result = getSectionTitle("projects", "en");
      expect(result).toBe("Projects");
    });

    it("returns projects section title in Spanish", () => {
      const result = getSectionTitle("projects", "es");
      expect(result).toBe("Proyectos");
    });

    it("returns projects section title in Catalan", () => {
      const result = getSectionTitle("projects", "ca");
      expect(result).toBe("Projectes");
    });

    it("returns writing section title in English", () => {
      const result = getSectionTitle("writing", "en");
      expect(result).toBe("Writing");
    });

    it("returns writing section title in Spanish", () => {
      const result = getSectionTitle("writing", "es");
      expect(result).toBe("Escritura");
    });

    it("returns writing section title in Catalan", () => {
      const result = getSectionTitle("writing", "ca");
      expect(result).toBe("Escriptura");
    });

    it("falls back to English for invalid lang", () => {
      const result = getSectionTitle("about", "invalid");
      expect(result).toBe("About");
    });
  });
});
