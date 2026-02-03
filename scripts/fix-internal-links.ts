import fs from "fs";
import path from "path";

const root = process.cwd();
const blogDir = path.join(root, "data", "blog");

/**
 * Patterns to EXCLUDE from trailing slash fixes:
 * - /images/* - asset links
 * - /og/* - Open Graph image links
 * - Links that already end with /
 * - External links (https://, http://)
 * - Email links (mailto:)
 * - Anchor links (#)
 */
const EXCLUDED_PATTERNS = [
  /^\/images\//,
  /^\/og\//,
  /\/\)$/, // Already ends with /
  /^https?:\/\//,
  /^mailto:/,
  /^#/,
];

function shouldExcludeLink(link: string): boolean {
  return EXCLUDED_PATTERNS.some((pattern) => pattern.test(link));
}

function fixInternalLinksWithCount(content: string): {
  fixed: string;
  count: number;
} {
  const pattern = /\]\((\/[a-z0-9/-]+)\)/gi;
  let fixCount = 0;

  const fixed = content.replace(pattern, (match, linkPath) => {
    if (shouldExcludeLink(linkPath)) {
      return match;
    }
    fixCount++;
    return `](${linkPath}/)`;
  });

  return { fixed, count: fixCount };
}

function main() {
  const files = fs
    .readdirSync(blogDir)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));

  let totalFixes = 0;
  const fixedFiles: string[] = [];

  for (const file of files) {
    const filePath = path.join(blogDir, file);
    const content = fs.readFileSync(filePath, "utf8");
    const { fixed: fixedContent, count } = fixInternalLinksWithCount(content);

    if (content !== fixedContent) {
      fs.writeFileSync(filePath, fixedContent, "utf8");
      fixedFiles.push(file);
      totalFixes += count;
    }
  }

  console.log(
    `✅ Fixed ${totalFixes} internal links in ${fixedFiles.length} files`,
  );
  if (fixedFiles.length > 0) {
    console.log("Fixed files:");
    fixedFiles.forEach((f) => console.log(`  - ${f}`));
  }
}

main();
