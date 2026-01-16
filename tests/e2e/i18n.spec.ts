import { test, expect } from "./fixtures";
import { HomePage } from "./page-objects";

test.describe("Internationalization (i18n)", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
  });

  test("should load English homepage by default", async ({ page }) => {
    await homePage.goto("en");
    await expect(page).toHaveURL("/");
    await expect(homePage.header.getSiteLogo()).toBeVisible();
  });

  test("should navigate to Spanish homepage", async ({ page }) => {
    await homePage.goto("en");
    await homePage.header.selectLanguage("es");

    await expect(page).toHaveURL("/es");
  });

  test("should navigate to Catalan homepage", async ({ page }) => {
    await homePage.goto("en");
    await homePage.header.selectLanguage("ca");

    await expect(page).toHaveURL("/ca");
  });

  test("should switch from Spanish to English", async ({ page }) => {
    await homePage.goto("es");
    await expect(page).toHaveURL("/es");

    await homePage.header.selectLanguage("en");

    await expect(page).toHaveURL("/");
  });

  test("should switch from Spanish to Catalan", async ({ page }) => {
    await homePage.goto("es");
    await expect(page).toHaveURL("/es");

    await homePage.header.selectLanguage("ca");

    await expect(page).toHaveURL("/ca");
  });

  test("should display posts in selected language", async ({ page }) => {
    // Load English
    await homePage.goto("en");
    const englishArticleCount = await homePage.getArticleCount();

    // Switch to Spanish
    await homePage.header.selectLanguage("es");
    const spanishArticleCount = await homePage.getArticleCount();

    // Both should have articles (may differ if translations vary)
    expect(englishArticleCount).toBeGreaterThan(0);
    expect(spanishArticleCount).toBeGreaterThan(0);
  });

  test("should maintain language when navigating to a post", async ({
    page,
  }) => {
    await homePage.goto("es");

    const titles = await homePage.getArticleTitles();
    if (titles.length > 0) {
      await homePage.clickArticleByTitle(titles[0]);

      // URL should contain /es/ prefix
      await expect(page).toHaveURL(/\/es\//);
    }
  });

  test("should display language selector on hover", async ({ page }) => {
    await homePage.goto();

    await homePage.header.openLanguageMenu();

    // Check all language options are visible within the selector
    const selector = page.getByTestId("language-selector");
    await expect(selector.getByRole("link", { name: "EN" })).toBeVisible();
    await expect(selector.getByRole("link", { name: "ES" })).toBeVisible();
    await expect(selector.getByRole("link", { name: "CA" })).toBeVisible();
  });
});
