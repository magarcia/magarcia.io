import { test, expect } from "./fixtures";
import { HomePage, BlogPostPage } from "./page-objects";
import { clearLocalStorage } from "./helpers/test-helpers";

test.describe("Theme Switching", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
    await clearLocalStorage(page);
    await page.reload();
  });

  test("should toggle between light and dark mode", async ({ page }) => {
    await homePage.goto();

    const initialDarkMode = await homePage.header.isDarkMode();
    await homePage.header.toggleTheme();

    const newDarkMode = await homePage.header.isDarkMode();
    expect(newDarkMode).not.toBe(initialDarkMode);
  });

  test("should persist theme preference after page reload", async ({
    page,
  }) => {
    await homePage.goto();

    // Get initial state and toggle
    const initialDarkMode = await homePage.header.isDarkMode();
    await homePage.header.toggleTheme();

    // Verify toggle worked
    expect(await homePage.header.isDarkMode()).not.toBe(initialDarkMode);

    // Reload and verify persistence
    await page.reload();

    expect(await homePage.header.isDarkMode()).not.toBe(initialDarkMode);
  });

  test("should persist theme preference across navigation", async ({
    page,
  }) => {
    await homePage.goto();

    // Set to dark mode if not already
    if (!(await homePage.header.isDarkMode())) {
      await homePage.header.toggleTheme();
    }
    expect(await homePage.header.isDarkMode()).toBe(true);

    // Navigate to a blog post
    const titles = await homePage.getArticleTitles();
    await homePage.clickArticleByTitle(titles[0]);

    // Verify theme persists on blog post page
    const blogPostPage = new BlogPostPage(page);
    expect(await blogPostPage.header.isDarkMode()).toBe(true);
  });

  test("should apply correct styles in dark mode", async ({ page }) => {
    await homePage.goto();

    // Ensure we're in dark mode
    if (!(await homePage.header.isDarkMode())) {
      await homePage.header.toggleTheme();
    }

    // Check that html has dark class
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("should apply correct styles in light mode", async ({ page }) => {
    await homePage.goto();

    // Ensure we're in light mode
    if (await homePage.header.isDarkMode()) {
      await homePage.header.toggleTheme();
    }

    // Check that html doesn't have dark class
    await expect(page.locator("html")).not.toHaveClass(/dark/);
  });
});
