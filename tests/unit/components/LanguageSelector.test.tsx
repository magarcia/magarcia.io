import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import LanguageSelector from "@/components/LanguageSelector";

describe("LanguageSelector", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders Globe icon trigger", () => {
    render(<LanguageSelector lang="en" />);
    expect(screen.getByTestId("globe-icon")).toBeInTheDocument();
  });

  it("has correct aria-label for accessibility", () => {
    render(<LanguageSelector lang="en" />);
    const button = screen.getByLabelText("Select language");
    expect(button).toBeInTheDocument();
  });

  describe("dropdown content", () => {
    it("shows all three language options", async () => {
      const user = userEvent.setup();
      render(<LanguageSelector lang="en" />);

      const trigger = screen.getByTestId("language-selector");
      await user.click(trigger);

      expect(await screen.findByText("English")).toBeInTheDocument();
      expect(await screen.findByText("Español")).toBeInTheDocument();
      expect(await screen.findByText("Català")).toBeInTheDocument();
    });

    it("applies bold styling to current language", async () => {
      const user = userEvent.setup();
      render(<LanguageSelector lang="es" />);

      const trigger = screen.getByTestId("language-selector");
      await user.click(trigger);

      const spanishLink = await screen.findByText("Español");
      expect(spanishLink.className).toContain("font-bold");

      const englishLink = await screen.findByText("English");
      expect(englishLink.className).not.toContain("font-bold");
    });
  });

  describe("language links without slug", () => {
    it("generates correct link for English", async () => {
      const user = userEvent.setup();
      render(<LanguageSelector lang="en" />);

      const trigger = screen.getByTestId("language-selector");
      await user.click(trigger);

      const englishLink = await screen.findByText("English");
      expect(englishLink).toHaveAttribute("href", "/");
    });

    it("generates correct link for Español", async () => {
      const user = userEvent.setup();
      render(<LanguageSelector lang="en" />);

      const trigger = screen.getByTestId("language-selector");
      await user.click(trigger);

      const spanishLink = await screen.findByText("Español");
      expect(spanishLink).toHaveAttribute("href", "/es");
    });

    it("generates correct link for Català", async () => {
      const user = userEvent.setup();
      render(<LanguageSelector lang="en" />);

      const trigger = screen.getByTestId("language-selector");
      await user.click(trigger);

      const catalanLink = await screen.findByText("Català");
      expect(catalanLink).toHaveAttribute("href", "/ca");
    });
  });

  describe("language links with slug", () => {
    const slug = "my-blog-post";

    it("generates correct link for English with slug", async () => {
      const user = userEvent.setup();
      render(<LanguageSelector lang="en" slug={slug} />);

      const trigger = screen.getByTestId("language-selector");
      await user.click(trigger);

      const englishLink = await screen.findByText("English");
      expect(englishLink).toHaveAttribute("href", `/${slug}`);
    });

    it("generates correct link for Español with slug", async () => {
      const user = userEvent.setup();
      render(<LanguageSelector lang="en" slug={slug} />);

      const trigger = screen.getByTestId("language-selector");
      await user.click(trigger);

      const spanishLink = await screen.findByText("Español");
      expect(spanishLink).toHaveAttribute("href", `/es/${slug}`);
    });

    it("generates correct link for Català with slug", async () => {
      const user = userEvent.setup();
      render(<LanguageSelector lang="en" slug={slug} />);

      const trigger = screen.getByTestId("language-selector");
      await user.click(trigger);

      const catalanLink = await screen.findByText("Català");
      expect(catalanLink).toHaveAttribute("href", `/ca/${slug}`);
    });
  });

  it("applies cursor-pointer class to links", async () => {
    const user = userEvent.setup();
    render(<LanguageSelector lang="en" />);

    const trigger = screen.getByTestId("language-selector");
    await user.click(trigger);

    const englishLink = await screen.findByText("English");
    expect(englishLink.className).toContain("cursor-pointer");
  });
});
