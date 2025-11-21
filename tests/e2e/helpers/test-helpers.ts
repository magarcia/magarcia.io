import type { Page } from "@playwright/test";

export async function clearLocalStorage(page: Page): Promise<void> {
  await page.evaluate(() => localStorage.clear());
}

export async function setLocalStorageItem(
  page: Page,
  key: string,
  value: string
): Promise<void> {
  await page.evaluate(
    ([k, v]) => localStorage.setItem(k, v),
    [key, value]
  );
}

export async function getLocalStorageItem(
  page: Page,
  key: string
): Promise<string | null> {
  return page.evaluate((k) => localStorage.getItem(k), key);
}

export async function waitForPageLoad(page: Page): Promise<void> {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle");
}

export type Language = "en" | "es" | "ca";

export function getLanguagePath(lang: Language): string {
  return lang === "en" ? "/" : `/${lang}`;
}

export function getTagPath(tag: string, lang: Language = "en"): string {
  const basePath = lang === "en" ? "" : `/${lang}`;
  return `${basePath}/tags/${tag}`;
}

export function getBlogPostPath(slug: string, lang: Language = "en"): string {
  const basePath = lang === "en" ? "" : `/${lang}`;
  return `${basePath}/${slug}`;
}
