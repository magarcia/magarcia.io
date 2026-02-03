import fs from "fs";
import prettier from "prettier";
import { siteMetadata } from "../blog.config";
import { getAllFilesFrontMatter, getAllTags } from "../lib/blog";
import { slugifyTag } from "../lib/urls";

function buildEntry(
  url: string,
  {
    changefreq = "daily",
    priority = 0.5,
  }: { changefreq?: string; priority?: number } = {},
) {
  return `
    <url>
        <loc>${url}</loc>
        <changefreq>${changefreq}</changefreq>
        <priority>${priority}</priority>
    </url>
`;
}

(async () => {
  const baseUrl = siteMetadata.siteUrl;
  const prettierConfig = await prettier.resolveConfig("./.prettierrc.js");

  // Get posts for all locales
  const postsEn = getAllFilesFrontMatter("blog", "en");
  const postsEs = getAllFilesFrontMatter("blog", "es");
  const postsCa = getAllFilesFrontMatter("blog", "ca");

  // Get unique slugs across all locales
  const allSlugs = new Set([
    ...postsEn.map((p) => p.slug),
    ...postsEs.map((p) => p.slug),
    ...postsCa.map((p) => p.slug),
  ]);

  // Get tags for all locales and merge them
  const tagsEn = getAllTags("blog", "en");
  const tagsEs = getAllTags("blog", "es");
  const tagsCa = getAllTags("blog", "ca");
  const allTags = Array.from(new Set([...tagsEn, ...tagsEs, ...tagsCa]));

  // Build URL entries for posts across all locales
  const postEntries: string[] = [];
  for (const slug of allSlugs) {
    // English (default)
    postEntries.push(
      buildEntry(`${baseUrl}/${slug}/`, {
        changefreq: "monthly",
        priority: 0.7,
      }),
    );

    // Spanish variant
    const hasEs = postsEs.some((p) => p.slug === slug);
    if (hasEs) {
      postEntries.push(
        buildEntry(`${baseUrl}/es/${slug}/`, {
          changefreq: "monthly",
          priority: 0.7,
        }),
      );
    }

    // Catalan variant
    const hasCa = postsCa.some((p) => p.slug === slug);
    if (hasCa) {
      postEntries.push(
        buildEntry(`${baseUrl}/ca/${slug}/`, {
          changefreq: "monthly",
          priority: 0.7,
        }),
      );
    }
  }

  // Build locale variant entries for homepage and projects
  const localeEntries = [
    buildEntry(`${baseUrl}/es/`, { priority: 1.0 }),
    buildEntry(`${baseUrl}/ca/`, { priority: 1.0 }),
    buildEntry(`${baseUrl}/projects/`, { priority: 0.8 }),
    buildEntry(`${baseUrl}/es/projects/`, { priority: 0.8 }),
    buildEntry(`${baseUrl}/ca/projects/`, { priority: 0.8 }),
  ];

  // Build tag entries for all locales
  // Only generate tag URLs for locales where posts actually have that tag
  const tagEntries: string[] = [];
  for (const tag of allTags) {
    const slug = slugifyTag(tag);

    // English
    if (tagsEn.includes(tag)) {
      tagEntries.push(
        buildEntry(`${baseUrl}/tags/${slug}/`, {
          priority: 0.3,
        }),
      );
    }

    // Spanish
    if (tagsEs.includes(tag)) {
      tagEntries.push(
        buildEntry(`${baseUrl}/es/tags/${slug}/`, {
          priority: 0.3,
        }),
      );
    }

    // Catalan
    if (tagsCa.includes(tag)) {
      tagEntries.push(
        buildEntry(`${baseUrl}/ca/tags/${slug}/`, {
          priority: 0.3,
        }),
      );
    }
  }

  const sitemap = `
        <?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${buildEntry(baseUrl, { priority: 1.0 })}
            ${postEntries.join("")}
            ${localeEntries.join("")}
            ${tagEntries.join("")}
        </urlset>
    `;

  const formatted = await prettier.format(sitemap, {
    ...prettierConfig,
    parser: "html",
  });

  fs.writeFileSync("build/client/sitemap.xml", formatted);
  console.log("✅ Sitemap generated successfully");
})();
