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
    // Handle both regular quotes and HTML-encoded quotes
    const absoluteContent = renderedContent
      .replace(/(src|href)="\/([^"]+)"/g, `$1="${baseUrl}/$2"`)
      .replace(/(src|href)=&quot;\/([^&]+)&quot;/g, `$1=&quot;${baseUrl}/$2&quot;`);
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
