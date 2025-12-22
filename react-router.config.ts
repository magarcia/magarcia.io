import type { Config } from "@react-router/dev/config";
import { getAllTags, getAllFilesFrontMatter } from "./lib/blog";
import { slugifyTag } from "./lib/urls";

export default {
  ssr: false,

  async prerender() {
    const postsEn = getAllFilesFrontMatter("blog", "en");
    const postsEs = getAllFilesFrontMatter("blog", "es");
    const postsCa = getAllFilesFrontMatter("blog", "ca");

    const tagsEn = getAllTags("blog", "en");

    const blogPathsEn = postsEn.map((p) => `/${p.slug}`);
    const blogPathsEs = postsEs.map((p) => `/es/${p.slug}`);
    const blogPathsCa = postsCa.map((p) => `/ca/${p.slug}`);

    const tagPathsEn = tagsEn.map((tag) => `/tags/${slugifyTag(tag)}`);
    const tagPathsEs = tagsEn.map((tag) => `/es/tags/${slugifyTag(tag)}`);
    const tagPathsCa = tagsEn.map((tag) => `/ca/tags/${slugifyTag(tag)}`);

    return [
      "/",
      "/es",
      "/ca",
      ...blogPathsEn,
      ...blogPathsEs,
      ...blogPathsCa,
      ...tagPathsEn,
      ...tagPathsEs,
      ...tagPathsCa,
    ];
  },
} satisfies Config;
