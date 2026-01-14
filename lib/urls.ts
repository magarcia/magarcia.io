import { siteMetadata } from "../blog.config";

const GITHUB_USERNAME = "magarcia";
const GITHUB_REPO_NAME = "magarcia.io";

export function buildPostUrl(slug: string, lang: string = "en"): string {
  const path = lang === "en" ? slug : `${lang}/${slug}`;
  return `${siteMetadata.siteUrl}/${path}`;
}

export function buildEditUrl(slug: string, lang: string = "en"): string {
  const filename = lang === "en" ? `${slug}.mdx` : `${slug}.${lang}.mdx`;
  return `https://github.com/${GITHUB_USERNAME}/${GITHUB_REPO_NAME}/edit/main/data/blog/${filename}`;
}

export function buildDiscussUrl(slug: string, lang: string = "en"): string {
  const url = buildPostUrl(slug, lang);
  return `https://x.com/search?q=${encodeURIComponent(url)}`;
}

export function getLocalizedPath(path: string, lang: string): string {
  if (lang === "en") return path;
  return `/${lang}${path === "/" ? "" : path}`;
}

export function slugifyTag(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[^\w\s-]/g, "-") // Replace non-word characters (except hyphens) with hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Collapse multiple hyphens to single hyphen
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}

export function buildTagUrl(tag: string, lang: string = "en"): string {
  const slug = slugifyTag(tag);
  const path = `/tags/${slug}`;
  return lang === "en" ? path : `/${lang}${path}`;
}
