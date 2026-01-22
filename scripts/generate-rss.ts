import fs from "fs";
import RSS from "rss";
import MarkdownIt from "markdown-it";
import { getAllFiles } from "../lib/blog";
import { siteMetadata } from "../blog.config";

const markdown = new MarkdownIt();

(async () => {
  const baseUrl = siteMetadata.siteUrl;
  const date = new Date();
  const author = {
    ...siteMetadata.author,
    link: "https://twitter.com/martinprins",
  };

  const feed = new RSS({
    title: siteMetadata.title,
    description: siteMetadata.description,
    site_url: baseUrl,
    language: "en",
    copyright: `All rights reserved ${date.getFullYear()}, ${author.name}`,
    generator: "React Router using RSS for Node.js",
    feed_url: `${baseUrl}/rss.xml`,
    managingEditor: `${author.email} (${author.name})`,
  });

  const posts = getAllFiles("blog");

  posts.forEach((post) => {
    const url = `${baseUrl}/${post.frontMatter.slug}`;
    const renderedContent = markdown.render(post.content);
    // Convert relative URLs to absolute URLs
    // Handle: /path, ./path, and their HTML-encoded quote variants
    const absoluteContent = renderedContent
      // Handle /path with regular quotes
      .replace(/(src|href)="\/([^"]+)"/g, `$1="${baseUrl}/$2"`)
      // Handle /path with HTML-encoded quotes
      .replace(
        /(src|href)=&quot;\/([^&]+)&quot;/g,
        `$1=&quot;${baseUrl}/$2&quot;`,
      )
      // Handle ./path with regular quotes (resolve to current post URL)
      .replace(/(src|href)="\.\/([^"]+)"/g, `$1="${url}/$2"`)
      // Handle ./path with HTML-encoded quotes
      .replace(
        /(src|href)=&quot;\.\/([^&]+)&quot;/g,
        `$1=&quot;${url}/$2&quot;`,
      );
    feed.item({
      title: post.frontMatter.title,
      guid: url,
      url: url,
      description: post.frontMatter.spoiler,
      custom_elements: [{ "content:encoded": absoluteContent }],
      author: author.email,
      date: new Date(post.frontMatter.date),
      categories: post.frontMatter.tags,
    });
  });

  fs.writeFileSync("./build/client/rss.xml", feed.xml({ indent: true }));
  console.log("✅ RSS feed generated successfully");
})();
