import type { Locator, Page } from "@playwright/test";
import { Header } from "./Header";
import type { Language } from "../helpers/test-helpers";
import { getLanguagePath } from "../helpers/test-helpers";

export class HomePage {
  public readonly page: Page;
  public readonly header: Header;
  private readonly articleList: Locator;
  private readonly mainHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = new Header(page);
    this.articleList = page.getByTestId("article-list");
    this.mainHeading = page.getByRole("heading", { level: 1 });
  }

  async goto(lang: Language = "en"): Promise<void> {
    const path = getLanguagePath(lang);
    await this.page.goto(path);
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

  getMainHeading(): Locator {
    return this.mainHeading;
  }

  getArticleList(): Locator {
    return this.articleList;
  }

  async getArticleByIndex(index: number): Promise<Locator> {
    const articles = await this.getArticles();
    return articles.nth(index);
  }
}
