import type { Config } from "@react-router/dev/config";
import { getAllTags, getAllSlugs } from "./lib/blog";
import { slugifyTag } from "./lib/urls";

export default {
  ssr: false,

  async prerender() {
    const slugs = getAllSlugs("blog");

    const tagsEn = getAllTags("blog", "en");

    const blogPathsEn = slugs.map((slug) => `/${slug}`);
    const blogPathsEs = slugs.map((slug) => `/es/${slug}`);
    const blogPathsCa = slugs.map((slug) => `/ca/${slug}`);

    const tagPathsEn = tagsEn.map((tag) => `/tags/${slugifyTag(tag)}`);
    const tagPathsEs = tagsEn.map((tag) => `/es/tags/${slugifyTag(tag)}`);
    const tagPathsCa = tagsEn.map((tag) => `/ca/tags/${slugifyTag(tag)}`);

    return [
      "/",
      "/es",
      "/ca",
      "/projects",
      "/es/projects",
      "/ca/projects",
      ...blogPathsEn,
      ...blogPathsEs,
      ...blogPathsCa,
      ...tagPathsEn,
      ...tagPathsEs,
      ...tagPathsCa,
    ];
  },
} satisfies Config;
