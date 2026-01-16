import type { Locator, Page } from "@playwright/test";
import { expect } from "@playwright/test";
import type { Language } from "../helpers/test-helpers";

export class Header {
  public readonly page: Page;
  private readonly themeToggle: Locator;
  private readonly languageSelector: Locator;
  private readonly siteLogo: Locator;
  private readonly backLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.themeToggle = page.getByTestId("theme-toggle");
    this.languageSelector = page.getByTestId("language-selector");
    this.siteLogo = page.getByRole("link", { name: "magarcia" });
    this.backLink = page.getByRole("link", { name: /back|volver|tornar/i });
  }

  async toggleTheme(): Promise<void> {
    await this.themeToggle.click();
  }

  async openLanguageMenu(): Promise<void> {
    // Use focus to reveal language options (triggers :focus-within CSS)
    // This is more reliable than hover for automated testing
    const enLink = this.languageSelector.getByRole("link", { name: "EN" });
    await expect(async () => {
      // Focus the link to trigger focus-within (works even if not visible yet)
      await enLink.focus({ timeout: 500 });
      await expect(enLink).toBeVisible({ timeout: 1000 });
    }).toPass({ timeout: 5000 });
  }

  async selectLanguage(lang: Language): Promise<void> {
    await this.openLanguageMenu();
    const langLabels: Record<Language, string> = {
      en: "EN",
      es: "ES",
      ca: "CA",
    };
    await this.languageSelector
      .getByRole("link", { name: langLabels[lang] })
      .click();
  }

  async clickLogo(): Promise<void> {
    await this.siteLogo.click();
  }

  async navigateToHome(): Promise<void> {
    // On homepage, click the logo; on blog posts, click the back link
    const logoVisible = await this.siteLogo.isVisible();
    if (logoVisible) {
      await this.siteLogo.click();
    } else {
      await this.backLink.click();
    }
  }

  getBackLink(): Locator {
    return this.backLink;
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
