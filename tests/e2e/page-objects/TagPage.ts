import type { Locator, Page } from "@playwright/test";
import { Header } from "./Header";
import type { Language } from "../helpers/test-helpers";
import { getTagPath } from "../helpers/test-helpers";

export class TagPage {
  public readonly page: Page;
  public readonly header: Header;
  private readonly tagHeading: Locator;
  private readonly articleList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = new Header(page);
    this.tagHeading = page.getByTestId("tag-heading");
    this.articleList = page.getByTestId("article-list");
  }

  async goto(tag: string, lang: Language = "en"): Promise<void> {
    const path = getTagPath(tag, lang);
    await this.page.goto(path);
  }

  async getTagName(): Promise<string> {
    return this.tagHeading.textContent() as Promise<string>;
  }

  getTagHeading(): Locator {
    return this.tagHeading;
  }

  getArticleList(): Locator {
    return this.articleList;
  }

  async getArticles(): Promise<Locator> {
    return this.page.getByTestId("article-item");
  }

  async getArticleCount(): Promise<number> {
    const articles = await this.getArticles();
    return articles.count();
  }

  async clickArticleByTitle(title: string): Promise<void> {
    await this.page.getByRole("heading", { name: title, level: 2 }).click();
  }

  async getArticleTitles(): Promise<string[]> {
    const headings = this.page.locator("article h2");
    return headings.allTextContents();
  }
}
