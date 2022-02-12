const fs = require("fs");
const matter = require("gray-matter");
const path = require("path");
const readingTime = require("reading-time");

const root = process.cwd();

function getFrontMatter(source, slug) {
  const { data, content } = matter(source);

  return {
    content,
    frontMatter: {
      wordCount: content.split(/\s+/gu).length,
      readingTime: readingTime(content),
      ...data,
      slug: slug ?? data.slug,
      spoiler: data.spoiler,
    },
  };
}

function getFileBySlug(type, slug) {
  const source = fs.readFileSync(
    path.join(root, "data", type, `${slug}.md`),
    "utf8"
  );

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

function getAllFilesFrontMatter(type) {
  const files = fs
    .readdirSync(path.join(root, "data", type))
    .map((f) => f.replace(".md", ""));

  return files
    .reduce((allFiles, slug) => {
      const source = fs.readFileSync(
        path.join(root, "data", type, `${slug}.md`),
        "utf8"
      );
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

function getAllFiles(type) {
  const files = fs
    .readdirSync(path.join(root, "data", type))
    .map((f) => f.replace(".md", ""));

  return files
    .reduce((allFiles, slug) => {
      const { frontMatter, content } = getFileBySlug(type, slug);

      if (frontMatter.draft && process.env.NODE_ENV === "production") {
        return allFiles;
      }

      return [
        {
          ...frontMatter,
          slug: slug,
          content,
        },
        ...allFiles,
      ];
    }, [])
    .sort((a, b) => -a.date.localeCompare(b.date));
}

module.exports = {
  getFileBySlug,
  getAllFilesFrontMatter,
  getAllFiles,
};
