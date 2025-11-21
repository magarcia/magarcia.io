import type { Locator, Page } from "@playwright/test";
import { Header } from "./Header";
import type { Language } from "../helpers/test-helpers";
import { getBlogPostPath } from "../helpers/test-helpers";

export class BlogPostPage {
  public readonly page: Page;
  public readonly header: Header;
  private readonly title: Locator;
  private readonly date: Locator;
  private readonly readingTime: Locator;
  private readonly content: Locator;
  private readonly tags: Locator;
  private readonly prevLink: Locator;
  private readonly nextLink: Locator;
  private readonly discussOnTwitter: Locator;
  private readonly editOnGitHub: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = new Header(page);
    this.title = page.getByTestId("post-title");
    this.date = page.locator("article time");
    this.readingTime = page.getByTestId("reading-time");
    this.content = page.locator("article .prose");
    this.tags = page.getByTestId("post-tags");
    this.prevLink = page.getByRole("link", { name: /←/ });
    this.nextLink = page.getByRole("link", { name: /→/ });
    this.discussOnTwitter = page.getByRole("link", {
      name: "Discuss on Twitter",
    });
    this.editOnGitHub = page.getByRole("link", { name: "Edit on GitHub" });
  }

  async goto(slug: string, lang: Language = "en"): Promise<void> {
    const path = getBlogPostPath(slug, lang);
    await this.page.goto(path);
  }

  async getTitle(): Promise<string> {
    return this.title.textContent() as Promise<string>;
  }

  async getDate(): Promise<string> {
    return this.date.textContent() as Promise<string>;
  }

  async getReadingTimeText(): Promise<string> {
    return this.readingTime.textContent() as Promise<string>;
  }

  getContent(): Locator {
    return this.content;
  }

  getTags(): Locator {
    return this.tags;
  }

  async getTagList(): Promise<string[]> {
    const tagLinks = this.tags.locator("a");
    return tagLinks.allTextContents();
  }

  async clickTag(tagName: string): Promise<void> {
    await this.tags.getByRole("link", { name: `#${tagName}` }).click();
  }

  async clickPrevPost(): Promise<void> {
    await this.prevLink.click();
  }

  async clickNextPost(): Promise<void> {
    await this.nextLink.click();
  }

  async hasPrevPost(): Promise<boolean> {
    return this.prevLink.isVisible();
  }

  async hasNextPost(): Promise<boolean> {
    return this.nextLink.isVisible();
  }

  getDiscussOnTwitterLink(): Locator {
    return this.discussOnTwitter;
  }

  getEditOnGitHubLink(): Locator {
    return this.editOnGitHub;
  }

  async getCodeBlocks(): Promise<Locator> {
    return this.content.locator("pre code");
  }
}
