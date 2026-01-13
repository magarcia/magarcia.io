import fs from "fs";
import matter from "gray-matter";
import path from "path";
import readingTime from "reading-time";
import { slugifyTag } from "./urls";

const root = process.cwd();

const VALID_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i;
const VALID_LANG_CODES = ["en", "es", "ca"] as const;

export function isValidSlug(slug: string): boolean {
  return VALID_SLUG_PATTERN.test(slug) && slug.length <= 200;
}

export function isValidLang(lang: string): lang is typeof VALID_LANG_CODES[number] {
  return VALID_LANG_CODES.includes(lang as typeof VALID_LANG_CODES[number]);
}

export function validateSlug(slug: string): void {
  if (!isValidSlug(slug)) {
    throw new Error("Invalid slug format");
  }
}

export function validateLang(lang: string): void {
  if (!isValidLang(lang)) {
    throw new Error("Invalid language code");
  }
}

function isFutureDate(dateString: string): boolean {
  const postDate = new Date(dateString);
  const now = new Date();
  postDate.setUTCHours(0, 0, 0, 0);
  now.setUTCHours(0, 0, 0, 0);
  return postDate > now;
}

export interface FrontMatter {
  title: string;
  date: string;
  spoiler: string;
  tags: string[];
  slug: string;
  draft?: boolean;
  indexed?: boolean;
  wordCount: number;
  readingTime: ReturnType<typeof readingTime>;
}

export interface BlogPost {
  content: string;
  frontMatter: FrontMatter;
}

export interface BlogPostWithNavigation extends BlogPost {
  prev: FrontMatter | null;
  next: FrontMatter | null;
}

function getFrontMatter(source: string, slug: string): BlogPost {
  const { data, content } = matter(source);

  return {
    content,
    frontMatter: {
      wordCount: content.split(/\s+/gu).length,
      readingTime: readingTime(content),
      ...data,
      slug: slug ?? data.slug,
      spoiler: data.spoiler,
    } as FrontMatter,
  };
}

export function getFileBySlug(
  type: string,
  slug: string,
  lang: string = "en"
): BlogPostWithNavigation {
  validateSlug(slug);
  validateLang(lang);

  let source: string;
  const mdxPath = path.join(root, "data", type, `${slug}.${lang}.mdx`);
  const mdPath = path.join(root, "data", type, `${slug}.${lang}.md`);
  const defaultMdxPath = path.join(root, "data", type, `${slug}.mdx`);
  const defaultMdPath = path.join(root, "data", type, `${slug}.md`);

  if (fs.existsSync(mdxPath)) {
    source = fs.readFileSync(mdxPath, "utf8");
  } else if (fs.existsSync(mdPath)) {
    source = fs.readFileSync(mdPath, "utf8");
  } else if (fs.existsSync(defaultMdxPath)) {
    source = fs.readFileSync(defaultMdxPath, "utf8");
  } else if (fs.existsSync(defaultMdPath)) {
    source = fs.readFileSync(defaultMdPath, "utf8");
  } else {
    throw new Error("Post not found");
  }

  const allFiles = getAllFilesFrontMatter(type, lang);
  const index = allFiles.findIndex((post) => post.slug === slug);

  const { frontMatter, content } = getFrontMatter(source, slug);

  return {
    content,
    frontMatter,
    prev: allFiles[index + 1] ?? null,
    next: allFiles[index - 1] ?? null,
  };
}

export function getAllFilesFrontMatter(type: string, lang: string = "en"): FrontMatter[] {
  const dirPath = path.join(root, "data", type);
  const files = fs
    .readdirSync(dirPath)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((f) => {
      // Remove extension and language suffix if present
      return f.replace(/\.(es|ca)?\.(md|mdx)$/, "").replace(/\.(md|mdx)$/, "");
    });

  const uniqueSlugs = Array.from(new Set(files));

  return uniqueSlugs
    .reduce((allFiles: FrontMatter[], slug: string) => {
      const mdxPath = path.join(dirPath, `${slug}.${lang}.mdx`);
      const mdPath = path.join(dirPath, `${slug}.${lang}.md`);
      const defaultMdxPath = path.join(dirPath, `${slug}.mdx`);
      const defaultMdPath = path.join(dirPath, `${slug}.md`);

      let source: string;
      if (fs.existsSync(mdxPath)) {
        source = fs.readFileSync(mdxPath, "utf8");
      } else if (fs.existsSync(mdPath)) {
        source = fs.readFileSync(mdPath, "utf8");
      } else if (fs.existsSync(defaultMdxPath)) {
        source = fs.readFileSync(defaultMdxPath, "utf8");
      } else if (fs.existsSync(defaultMdPath)) {
        source = fs.readFileSync(defaultMdPath, "utf8");
      } else {
        return allFiles;
      }

      const { frontMatter } = getFrontMatter(source, slug);

      if (frontMatter.draft && process.env.NODE_ENV === "production") {
        return allFiles;
      }

      if (isFutureDate(frontMatter.date) && process.env.NODE_ENV === "production") {
        return allFiles;
      }

      return [
        {
          ...frontMatter,
          slug: slug,
        },
        ...allFiles,
      ];
    }, [])
    .sort((a, b) => -a.date.localeCompare(b.date));
}

export function getAllFiles(type: string, lang: string = "en"): BlogPost[] {
  const dirPath = path.join(root, "data", type);
  const files = fs
    .readdirSync(dirPath)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((f) => f.replace(/\.(es|ca)?\.(md|mdx)$/, "").replace(/\.(md|mdx)$/, ""));

  const uniqueSlugs = Array.from(new Set(files));

  return uniqueSlugs
    .reduce((allFiles: BlogPost[], slug: string) => {
      const { frontMatter, content } = getFileBySlug(type, slug, lang);

      if (frontMatter.draft && process.env.NODE_ENV === "production") {
        return allFiles;
      }

      if (isFutureDate(frontMatter.date) && process.env.NODE_ENV === "production") {
        return allFiles;
      }

      return [
        {
          content,
          frontMatter: {
            ...frontMatter,
            slug: slug,
          },
        },
        ...allFiles,
      ];
    }, [])
    .sort((a, b) => -a.frontMatter.date.localeCompare(b.frontMatter.date));
}

export function getAllTags(type: string, lang: string = "en"): string[] {
  const posts = getAllFilesFrontMatter(type, lang);
  const tagsSet = new Set<string>();

  posts.forEach((post) => {
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach((tag) => tagsSet.add(tag));
    }
  });

  return Array.from(tagsSet).sort();
}

export function getTagBySlug(type: string, tagSlug: string): string | null {
  if (!isValidSlug(tagSlug)) {
    return null;
  }
  const tags = getAllTags(type, "en");
  return tags.find((tag) => slugifyTag(tag) === tagSlug) ?? null;
}

export function getPostsByTagSlug(type: string, tagSlug: string, lang: string = "en"): FrontMatter[] {
  const originalTag = getTagBySlug(type, tagSlug);
  if (!originalTag) return [];

  const posts = getAllFilesFrontMatter(type, lang);
  return posts.filter(
    (post) => post.tags && post.tags.includes(originalTag)
  );
}

export function getPostsByTag(type: string, tag: string, lang: string = "en"): FrontMatter[] {
  const posts = getAllFilesFrontMatter(type, lang);
  return posts.filter(
    (post) => post.tags && post.tags.includes(tag)
  );
}

export function getAllSlugs(type: string): string[] {
  const dirPath = path.join(root, "data", type);
  const files = fs
    .readdirSync(dirPath)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((f) => f.replace(/\.(es|ca)?\.(md|mdx)$/, "").replace(/\.(md|mdx)$/, ""));

  return Array.from(new Set(files));
}
