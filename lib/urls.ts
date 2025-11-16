import { siteMetadata } from "~/blog.config";

const GITHUB_USERNAME = "magarcia";
const GITHUB_REPO_NAME = "magarcia.io";

export function buildPostUrl(slug: string): string {
  return `${siteMetadata.siteUrl}/${slug}`;
}

export function buildEditUrl(slug: string): string {
  return `https://github.com/${GITHUB_USERNAME}/${GITHUB_REPO_NAME}/edit/main/data/blog/${slug}.mdx`;
}

export function buildDiscussUrl(slug: string): string {
  const url = buildPostUrl(slug);
  return `https://mobile.twitter.com/search?q=${encodeURIComponent(url)}`;
}
