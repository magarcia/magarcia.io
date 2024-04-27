const fs = require("fs");
const globby = require("globby");
const prettier = require("prettier");

const siteMetadata = require("../blog.config").siteMetadata;
const getAllFilesFrontMatter = require("../lib/blog").getAllFilesFrontMatter;

// https://www.sitemaps.org/protocol.html#changefreqdef
function buildEntry(url, { changefreq = "daily", priority = 0.5 } = {}) {
  return `
    <url>
        <loc>${`${url}`}</loc>
        <changefreq>${changefreq}</changefreq>
        <priority>${priority}</priority>
    </url>
`;
}

(async () => {
  const baseUrl = siteMetadata.siteUrl;
  const prettierConfig = await prettier.resolveConfig("./.prettierrc.js");
  const pages = await globby([
    "pages/*.js",
    "pages/**/*.js",
    "!pages/_*.js",
    "!pages/\\[*\\].js",
    "!pages/**/_*.js",
    "!pages/**/\\[*\\].js",
    "!pages/api",
    "!pages/404.js",
  ]);
  const posts = getAllFilesFrontMatter("blog");
  const tags = Array.from(new Set(posts.flatMap((p) => p.tags))).map((t) =>
    t.toLowerCase().replace(/\s+/g, "-")
  );

  const sitemap = `
        <?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${pages
              .map((page) => {
                const path = page
                  .replace("pages", "")
                  .replace("/index.js", "")
                  .replace(".js", "")
                  .replace(".md", "");
                const route = path === "/index" ? "" : path;

                return buildEntry(`${baseUrl}${route}`);
              })
              .join("")}
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
                    buildEntry(`${baseUrl}/tags/${tag}`, { priority: 0.3 })
                  )
                  .join("")}
        </urlset>
    `;

  const formatted = await prettier.format(sitemap, {
    ...prettierConfig,
    parser: "html",
  });

  // eslint-disable-next-line no-sync
  fs.writeFileSync("public/sitemap.xml", formatted);
})();
