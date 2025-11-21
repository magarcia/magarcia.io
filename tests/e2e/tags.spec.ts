import { test, expect } from "./fixtures";
import { HomePage, BlogPostPage, TagPage } from "./page-objects";

test.describe("Tag Page", () => {
  test("should display tag heading with post count", async ({ page }) => {
    // First, get a valid tag from a blog post
    const homePage = new HomePage(page);
    await homePage.goto();

    const titles = await homePage.getArticleTitles();
    await homePage.clickArticleByTitle(titles[0]);

    const blogPostPage = new BlogPostPage(page);
    const tags = await blogPostPage.getTagList();

    if (tags.length > 0) {
      const firstTag = tags[0].replace("#", "");
      await blogPostPage.clickTag(firstTag);

      const tagPage = new TagPage(page);
      await expect(tagPage.getTagHeading()).toBeVisible();

      const headingText = await tagPage.getTagName();
      expect(headingText).toMatch(/\d+\s+posts?\s+tagged\s+with/i);
    }
  });

  test("should list articles with the selected tag", async ({ page }) => {
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

      const tagPage = new TagPage(page);
      const articleCount = await tagPage.getArticleCount();
      expect(articleCount).toBeGreaterThan(0);
    }
  });

  test("should display article metadata on tag page", async ({ page }) => {
    // Navigate to a tag page
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

      // Each article should have title, date, and reading time
      const articles = page.getByTestId("article-item");
      const firstArticle = articles.first();

      // Should have a title (h3)
      await expect(firstArticle.locator("h3")).toBeVisible();

      // Should have metadata in small element (date + reading time)
      const metadata = firstArticle.locator("small");
      await expect(metadata).toBeVisible();
      await expect(metadata).toContainText("min read");
    }
  });

  test("should navigate to article from tag page", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    const titles = await homePage.getArticleTitles();
    await homePage.clickArticleByTitle(titles[0]);

    const blogPostPage = new BlogPostPage(page);
    const tags = await blogPostPage.getTagList();

    if (tags.length > 0) {
      const firstTag = tags[0].replace("#", "");
      await blogPostPage.clickTag(firstTag);

      const tagPage = new TagPage(page);
      const articleTitles = await tagPage.getArticleTitles();

      if (articleTitles.length > 0) {
        await tagPage.clickArticleByTitle(articleTitles[0]);
        await expect(page.getByTestId("post-title")).toBeVisible();
      }
    }
  });

  test("should return 404 for non-existent tag", async ({ page }) => {
    const response = await page.goto("/tags/non-existent-tag-12345");
    expect(response?.status()).toBe(404);
  });
});
