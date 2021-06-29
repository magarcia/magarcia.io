const fs = require("fs");
const RSS = require("rss");
const markdown = new require("markdown-it")();

const getAllFiles = require("../lib/blog").getAllFiles;
const siteMetadata = require("../blog.config").siteMetadata;

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
    id: baseUrl,
    site_url: baseUrl,
    language: "en",
    image: `${baseUrl}/logo.svg`,
    favicon: `${baseUrl}/favicon.ico`,
    copyright: `All rights reserved ${date.getFullYear()}, ${author.name}`,
    updated: date,
    generator: "Next.js using RSS for Node.js",
    feed_url: `${baseUrl}/rss.xml`,
    author: author.name,
    managingEditor: author.name,
  });

  const posts = await getAllFiles("blog");

  posts.forEach((post) => {
    const url = `${baseUrl}/${post.slug}`;
    feed.item({
      title: post.title,
      id: url,
      link: url,
      description: post.spoiler,
      custom_elements: [{ "content:encoded": markdown.render(post.content) }],
      author: post.author?.name ?? author.name,
      date: new Date(post.date),
      categories: post.tags,
    });
  });

  fs.writeFileSync("./public/rss.xml", feed.xml({ indent: true }));
})();
