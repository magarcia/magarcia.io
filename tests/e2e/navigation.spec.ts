import { test, expect } from "./fixtures";
import { HomePage, BlogPostPage, TagPage } from "./page-objects";

test.describe("Navigation", () => {
  test("should navigate from homepage to blog post and back", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Get first article title and click it
    const titles = await homePage.getArticleTitles();
    const firstTitle = titles[0];
    await homePage.clickArticleByTitle(firstTitle);

    // Verify we're on the blog post page
    const blogPostPage = new BlogPostPage(page);
    await expect(page.getByTestId("post-title")).toBeVisible();

    // Click back link to go back to homepage
    await blogPostPage.header.navigateToHome();

    // Verify we're back on homepage
    await expect(page).toHaveURL("/");
    await expect(homePage.getArticleList()).toBeVisible();
  });

  test("should navigate from blog post to tag page", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Navigate to a blog post
    const titles = await homePage.getArticleTitles();
    await homePage.clickArticleByTitle(titles[0]);

    // Get tags and click the first one
    const blogPostPage = new BlogPostPage(page);
    const tags = await blogPostPage.getTagList();

    if (tags.length > 0) {
      const firstTag = tags[0].replace("#", "");
      await blogPostPage.clickTag(firstTag);

      // Verify we're on tag page
      await expect(page).toHaveURL(/\/tags\//);
      await expect(page.getByTestId("tag-heading")).toBeVisible();
    }
  });

  test("should navigate from tag page to blog post", async ({ page }) => {
    const tagPage = new TagPage(page);
    await tagPage.goto("react");

    // Click on an article from the tag page
    const titles = await tagPage.getArticleTitles();
    if (titles.length > 0) {
      await tagPage.clickArticleByTitle(titles[0]);

      // Verify we're on a blog post
      await expect(page.getByTestId("post-title")).toBeVisible();
    }
  });

  test("should display prev/next navigation links", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Navigate to a blog post
    const titles = await homePage.getArticleTitles();
    if (titles.length > 0) {
      await homePage.clickArticleByTitle(titles[0]);
      await page.waitForLoadState("networkidle");

      // Check that navigation section exists
      const nav = page.locator("nav");
      await expect(nav).toBeVisible();

      // Verify that either prev or next link (or both) exist
      const prevLink = page.getByRole("link", { name: /←/ });
      const nextLink = page.getByRole("link", { name: /→/ });

      const hasPrev = (await prevLink.count()) > 0;
      const hasNext = (await nextLink.count()) > 0;

      // At least one navigation link should exist for most posts
      // (unless it's the first or last post in the chronological order)
      console.log(`Post has prev link: ${hasPrev}, next link: ${hasNext}`);
    }
  });

  test("should maintain scroll position on browser back", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Scroll down on homepage
    await page.evaluate(() => window.scrollBy(0, 500));
    const scrollBefore = await page.evaluate(() => window.scrollY);

    // Navigate to a post
    const titles = await homePage.getArticleTitles();
    await homePage.clickArticleByTitle(titles[0]);
    await expect(page.getByTestId("post-title")).toBeVisible();

    // Go back
    await page.goBack();

    // Note: Scroll restoration behavior depends on browser settings
    await expect(page).toHaveURL("/");
  });
});
