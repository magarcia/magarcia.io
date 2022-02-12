import { siteMetadata } from '../blog.config';

const GITHUB_USERNAME = 'magarcia';
const GITHUB_REPO_NAME = 'magarcia.io';

export function buildPostUrl(slug) {
  return `${siteMetadata.siteUrl}/${slug}`;
}

export function buildEditUrl(slug) {
  return `https://github.com/${GITHUB_USERNAME}/${GITHUB_REPO_NAME}/edit/master/src/data/blog/${slug}.md`;
}

export function buildDiscussUrl(slug) {
  const url = buildPostUrl(slug);
  return `https://mobile.twitter.com/search?q=${encodeURIComponent(url)}`;
}
