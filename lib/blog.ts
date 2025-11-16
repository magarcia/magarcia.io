import fs from "fs";
import matter from "gray-matter";
import path from "path";
import readingTime from "reading-time";

const root = process.cwd();

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
  slug: string
): BlogPostWithNavigation {
  let source: string;
  const mdxPath = path.join(root, "data", type, `${slug}.mdx`);
  const mdPath = path.join(root, "data", type, `${slug}.md`);

  if (fs.existsSync(mdxPath)) {
    source = fs.readFileSync(mdxPath, "utf8");
  } else if (fs.existsSync(mdPath)) {
    source = fs.readFileSync(mdPath, "utf8");
  } else {
    throw new Error(`No file found for slug: ${slug}`);
  }

  const allFiles = getAllFilesFrontMatter(type);
  const index = allFiles.findIndex((post) => post.slug === slug);

  const { frontMatter, content } = getFrontMatter(source, slug);

  return {
    content,
    frontMatter,
    prev: allFiles[index + 1] ?? null,
    next: allFiles[index - 1] ?? null,
  };
}

export function getAllFilesFrontMatter(type: string): FrontMatter[] {
  const dirPath = path.join(root, "data", type);
  const files = fs
    .readdirSync(dirPath)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((f) => f.replace(/\.(md|mdx)$/, ""));

  return files
    .reduce((allFiles: FrontMatter[], slug: string) => {
      const mdxPath = path.join(dirPath, `${slug}.mdx`);
      const mdPath = path.join(dirPath, `${slug}.md`);

      let source: string;
      if (fs.existsSync(mdxPath)) {
        source = fs.readFileSync(mdxPath, "utf8");
      } else {
        source = fs.readFileSync(mdPath, "utf8");
      }

      const { frontMatter } = getFrontMatter(source, slug);

      if (frontMatter.draft && process.env.NODE_ENV === "production") {
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

export function getAllFiles(type: string): BlogPost[] {
  const dirPath = path.join(root, "data", type);
  const files = fs
    .readdirSync(dirPath)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((f) => f.replace(/\.(md|mdx)$/, ""));

  return files
    .reduce((allFiles: BlogPost[], slug: string) => {
      const { frontMatter, content } = getFileBySlug(type, slug);

      if (frontMatter.draft && process.env.NODE_ENV === "production") {
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

export function getAllTags(type: string): string[] {
  const posts = getAllFilesFrontMatter(type);
  const tagsSet = new Set<string>();

  posts.forEach((post) => {
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach((tag) => tagsSet.add(tag));
    }
  });

  return Array.from(tagsSet).sort();
}

export function getPostsByTag(type: string, tag: string): FrontMatter[] {
  const posts = getAllFilesFrontMatter(type);
  return posts.filter(
    (post) => post.tags && post.tags.includes(tag)
  );
}
