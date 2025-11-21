import type { Locator, Page } from "@playwright/test";
import type { Language } from "../helpers/test-helpers";

export class Header {
  public readonly page: Page;
  private readonly themeToggle: Locator;
  private readonly languageSelector: Locator;
  private readonly siteLogo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.themeToggle = page.getByTestId("theme-toggle");
    this.languageSelector = page.getByTestId("language-selector");
    this.siteLogo = page.getByRole("link", { name: "magarcia" });
  }

  async toggleTheme(): Promise<void> {
    await this.themeToggle.click();
  }

  async openLanguageMenu(): Promise<void> {
    await this.languageSelector.click();
  }

  async selectLanguage(lang: Language): Promise<void> {
    await this.openLanguageMenu();
    const langLabels: Record<Language, string> = {
      en: "English",
      es: "Español",
      ca: "Català",
    };
    await this.page.getByRole("menuitem", { name: langLabels[lang] }).click();
  }

  async clickLogo(): Promise<void> {
    await this.siteLogo.click();
  }

  getThemeToggle(): Locator {
    return this.themeToggle;
  }

  getLanguageSelector(): Locator {
    return this.languageSelector;
  }

  getSiteLogo(): Locator {
    return this.siteLogo;
  }

  async isDarkMode(): Promise<boolean> {
    const htmlClasses = await this.page.locator("html").getAttribute("class");
    return htmlClasses?.includes("dark") ?? false;
  }
}
