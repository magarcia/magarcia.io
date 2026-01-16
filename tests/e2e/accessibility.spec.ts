import { test, expect } from "./fixtures";
import { HomePage, BlogPostPage } from "./page-objects";

test.describe("Accessibility", () => {
  test("homepage should have no accessibility violations", async ({
    page,
    makeAxeBuilder,
  }) => {
    await page.goto("/");
    const results = await makeAxeBuilder().analyze();
    expect(results.violations).toEqual([]);
  });

  test("blog post page should have no critical accessibility violations", async ({
    page,
    makeAxeBuilder,
  }) => {
    // Navigate to a blog post
    const homePage = new HomePage(page);
    await homePage.goto();
    const titles = await homePage.getArticleTitles();
    await homePage.clickArticleByTitle(titles[0]);

    await page.waitForLoadState("networkidle");

    const results = await makeAxeBuilder().analyze();

    // Filter for critical violations only (serious ones are logged but won't fail)
    const criticalViolations = results.violations.filter(
      (v) => v.impact === "critical"
    );

    // Log any violations for awareness
    if (results.violations.length > 0) {
      console.log(
        "Accessibility violations found:",
        results.violations.map((v) => `${v.id} (${v.impact}): ${v.help}`)
      );
    }

    expect(criticalViolations).toEqual([]);
  });

  test("tag page should have no accessibility violations", async ({
    page,
    makeAxeBuilder,
  }) => {
    // Navigate to a tag page via blog post
    const homePage = new HomePage(page);
    await homePage.goto();
    const titles = await homePage.getArticleTitles();
    await homePage.clickArticleByTitle(titles[0]);

    const blogPostPage = new BlogPostPage(page);
    const tags = await blogPostPage.getTagList();

    if (tags.length > 0) {
      const firstTag = tags[0].replace("#", "");
      await blogPostPage.clickTag(firstTag);

      await page.waitForLoadState("networkidle");

      const results = await makeAxeBuilder().analyze();
      expect(results.violations).toEqual([]);
    }
  });

  test("Spanish homepage should have no accessibility violations", async ({
    page,
    makeAxeBuilder,
  }) => {
    await page.goto("/es");
    const results = await makeAxeBuilder().analyze();
    expect(results.violations).toEqual([]);
  });

  test("dark mode should have no accessibility violations", async ({
    page,
    makeAxeBuilder,
  }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Switch to dark mode
    if (!(await homePage.header.isDarkMode())) {
      await homePage.header.toggleTheme();
    }

    await page.waitForLoadState("networkidle");

    const results = await makeAxeBuilder().analyze();
    expect(results.violations).toEqual([]);
  });
});

test.describe("Keyboard Navigation", () => {
  test("should be able to navigate with keyboard", async ({ page }) => {
    await page.goto("/");

    // Tab through the page
    await page.keyboard.press("Tab");

    // First focusable element should be focused
    const focusedElement = page.locator(":focus");
    await expect(focusedElement).toBeVisible();
  });

  test("language selector should be keyboard accessible", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Get the language selector
    const languageSelector = homePage.header.getLanguageSelector();

    // Focus the selector - this should expand the language links via focus-within
    await languageSelector.focus();
    // Wait for the expansion animation
    await page.waitForTimeout(350);

    // Language links should be visible when focused
    await expect(languageSelector.getByRole("link", { name: "EN" })).toBeVisible();
    await expect(languageSelector.getByRole("link", { name: "ES" })).toBeVisible();
    await expect(languageSelector.getByRole("link", { name: "CA" })).toBeVisible();
  });

  test("theme toggle should be keyboard accessible", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    const themeToggle = homePage.header.getThemeToggle();
    const initialDarkMode = await homePage.header.isDarkMode();

    // Focus and activate with Enter
    await themeToggle.focus();
    await page.keyboard.press("Enter");

    // Theme should have toggled
    const newDarkMode = await homePage.header.isDarkMode();
    expect(newDarkMode).not.toBe(initialDarkMode);
  });

  test("blog post links should be focusable", async ({ page }) => {
    await page.goto("/");

    // Tab through to find article links
    let foundArticleLink = false;

    for (let i = 0; i < 20; i++) {
      await page.keyboard.press("Tab");
      const focusedElement = page.locator(":focus");
      const tagName = await focusedElement.evaluate((el) =>
        el.tagName.toLowerCase()
      );
      const href = await focusedElement.getAttribute("href");

      if (tagName === "a" && href && href.startsWith("/") && href !== "/") {
        foundArticleLink = true;
        break;
      }
    }

    expect(foundArticleLink).toBe(true);
  });
});
