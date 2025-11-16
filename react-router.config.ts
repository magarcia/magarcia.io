import type { Config } from "@react-router/dev/config";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export default {
  ssr: false,

  async prerender() {
    const posts = await getAllPostSlugs();
    const tags = await getAllTags();

    const blogPaths = posts.map((slug) => `/${slug}`);
    const tagPaths = tags.map((tag) => `/tags/${tag}`);

    return [
      "/",
      ...blogPaths,
      ...tagPaths,
    ];
  },
} satisfies Config;

async function getAllPostSlugs(): Promise<string[]> {
  const blogDir = path.join(process.cwd(), "data", "blog");
  const files = fs.readdirSync(blogDir);

  const slugs = files
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
    .map((file) => file.replace(/\.(md|mdx)$/, ""))
    .filter((slug) => {
      const filePath = path.join(blogDir, `${slug}.md`);
      const mdxPath = path.join(blogDir, `${slug}.mdx`);
      const source = fs.readFileSync(
        fs.existsSync(mdxPath) ? mdxPath : filePath,
        "utf8"
      );
      const { data } = matter(source);

      // Filter out drafts in production
      if (data.draft && process.env.NODE_ENV === "production") {
        return false;
      }

      return true;
    });

  return slugs;
}

async function getAllTags(): Promise<string[]> {
  const blogDir = path.join(process.cwd(), "data", "blog");
  const files = fs.readdirSync(blogDir);

  const tagsSet = new Set<string>();

  files
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
    .forEach((file) => {
      const filePath = path.join(blogDir, file);
      const source = fs.readFileSync(filePath, "utf8");
      const { data } = matter(source);

      // Skip drafts in production
      if (data.draft && process.env.NODE_ENV === "production") {
        return;
      }

      if (data.tags && Array.isArray(data.tags)) {
        data.tags.forEach((tag: string) => tagsSet.add(tag));
      }
    });

  return Array.from(tagsSet);
}
