import { test, expect } from "./fixtures";
import { HomePage } from "./page-objects";

test.describe("Homepage", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
  });

  test("should display the site logo", async () => {
    await homePage.goto();
    await expect(homePage.header.getSiteLogo()).toBeVisible();
    await expect(homePage.header.getSiteLogo()).toHaveText("magarcia");
  });

  test("should display a list of blog posts", async () => {
    await homePage.goto();
    const articleCount = await homePage.getArticleCount();
    expect(articleCount).toBeGreaterThan(0);
  });

  test("should display article metadata", async ({ page }) => {
    await homePage.goto();
    const firstArticle = await homePage.getArticleByIndex(0);

    // Article should have a title
    const title = firstArticle.locator("h2");
    await expect(title).toBeVisible();

    // Article should have a year (new design shows year instead of full date)
    const date = firstArticle.locator("time");
    await expect(date).toBeVisible();
    await expect(date).toHaveText(/\d{4}/);
  });

  test("should navigate to blog post when clicking article", async ({
    page,
  }) => {
    await homePage.goto();
    const titles = await homePage.getArticleTitles();
    const firstTitle = titles[0];

    await homePage.clickArticleByTitle(firstTitle);

    await expect(page).not.toHaveURL("/");
    await expect(page.getByTestId("post-title")).toBeVisible();
  });

  test("should display the header with theme toggle", async () => {
    await homePage.goto();
    await expect(homePage.header.getThemeToggle()).toBeVisible();
  });

  test("should display the header with language selector", async () => {
    await homePage.goto();
    await expect(homePage.header.getLanguageSelector()).toBeVisible();
  });
});
