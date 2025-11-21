import { test, expect } from "./fixtures";
import { HomePage, BlogPostPage } from "./page-objects";

test.describe("Blog Post Page", () => {
  let blogPostPage: BlogPostPage;

  test.beforeEach(async ({ page }) => {
    blogPostPage = new BlogPostPage(page);

    // Navigate to a blog post from homepage
    const homePage = new HomePage(page);
    await homePage.goto();
    const titles = await homePage.getArticleTitles();
    await homePage.clickArticleByTitle(titles[0]);
  });

  test("should display post title", async () => {
    const title = await blogPostPage.getTitle();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });

  test("should display post date", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    // The date is inside the time element within the article header
    const timeElement = page.locator("article header time");
    await expect(timeElement).toBeVisible({ timeout: 10000 });

    const dateText = await timeElement.textContent();
    expect(dateText).toBeTruthy();
    // Date should match format like "January 1, 2024"
    expect(dateText).toMatch(/\w+\s+\d{1,2},\s+\d{4}/);
  });

  test("should display reading time", async () => {
    const readingTime = await blogPostPage.getReadingTimeText();
    expect(readingTime).toBeTruthy();
    expect(readingTime).toMatch(/\d+\s*min\s*read/);
  });

  test("should display post content", async () => {
    const content = blogPostPage.getContent();
    await expect(content).toBeVisible();
  });

  test("should display post tags", async () => {
    const tags = blogPostPage.getTags();
    await expect(tags).toBeVisible();

    const tagList = await blogPostPage.getTagList();
    expect(tagList.length).toBeGreaterThan(0);

    // Tags should start with #
    tagList.forEach((tag) => {
      expect(tag).toMatch(/^#/);
    });
  });

  test("should have Discuss on Twitter link", async () => {
    const discussLink = blogPostPage.getDiscussOnTwitterLink();
    await expect(discussLink).toBeVisible();
    await expect(discussLink).toHaveAttribute("href", /twitter\.com|x\.com/);
    await expect(discussLink).toHaveAttribute("target", "_blank");
  });

  test("should have Edit on GitHub link", async ({ page }) => {
    const editLink = blogPostPage.getEditOnGitHubLink();
    await expect(editLink).toBeVisible({ timeout: 10000 });
    const href = await editLink.getAttribute("href");
    expect(href).toContain("github.com");
    await expect(editLink).toHaveAttribute("target", "_blank");
  });

  test("should render code blocks when present", async ({ page }) => {
    // This test checks if a blog with code blocks displays them correctly
    // Navigate to a post that has code (first post from homepage, which is technical)
    const content = blogPostPage.getContent();
    await expect(content).toBeVisible();

    // Check if code blocks exist - this is optional for blog posts
    const codeBlocks = page.locator("article pre code");
    const count = await codeBlocks.count();

    if (count > 0) {
      // If there are code blocks, verify the first one is visible
      await expect(codeBlocks.first()).toBeVisible();
    }
    // If no code blocks, the test passes (not all posts have code)
  });
});

test.describe("Blog Post - Direct Navigation", () => {
  test("should load a specific blog post by slug", async ({ page }) => {
    // Navigate directly to a known slug pattern
    const blogPostPage = new BlogPostPage(page);

    // We'll need to navigate to homepage first to get a valid slug
    const homePage = new HomePage(page);
    await homePage.goto();

    // Get the URL of the first article link
    const firstArticle = page.getByTestId("article-item").first();
    const link = firstArticle.locator("a").first();
    const href = await link.getAttribute("href");

    if (href) {
      await page.goto(href);
      await expect(page.getByTestId("post-title")).toBeVisible();
    }
  });
});
