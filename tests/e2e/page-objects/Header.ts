import type { Locator, Page } from "@playwright/test";
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
    this.backLink = page.getByRole("link", {
      name: /^← (back|volver|tornar)$/i,
    });
  }

  async toggleTheme(): Promise<void> {
    await this.themeToggle.click();
  }

  async openLanguageMenu(): Promise<void> {
    // Hover over the language selector to expand it
    await this.languageSelector.hover();
    // Wait for the nav to expand (it animates from max-w-0 to max-w-24)
    await this.page.waitForTimeout(350);
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
