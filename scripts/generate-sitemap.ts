import fs from "fs";
import prettier from "prettier";
import { siteMetadata } from "../blog.config";
import { getAllFilesFrontMatter, getAllTags } from "../lib/blog";
import { slugifyTag } from "../lib/urls";

function buildEntry(
  url: string,
  { changefreq = "daily", priority = 0.5 }: { changefreq?: string; priority?: number } = {}
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

  const posts = getAllFilesFrontMatter("blog");
  const tags = getAllTags("blog");

  const sitemap = `
        <?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${buildEntry(baseUrl, { priority: 1.0 })}
            ${posts
              .map(({ slug }) =>
                buildEntry(`${baseUrl}/${slug}`, {
                  changefreq: "monthly",
                  priority: 0.7,
                })
              )
              .join("")}
            ${tags
              .map((tag) =>
                buildEntry(`${baseUrl}/tags/${slugifyTag(tag)}`, { priority: 0.3 })
              )
              .join("")}
        </urlset>
    `;

  const formatted = await prettier.format(sitemap, {
    ...prettierConfig,
    parser: "html",
  });

  fs.writeFileSync("build/client/sitemap.xml", formatted);
  console.log("✅ Sitemap generated successfully");
})();
