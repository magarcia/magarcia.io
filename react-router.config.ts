import type { Config } from "@react-router/dev/config";
import { getAllTags, getAllFilesFrontMatter } from "./lib/blog";

export default {
  ssr: false,

  async prerender() {
    const postsEn = getAllFilesFrontMatter("blog", "en");
    const postsEs = getAllFilesFrontMatter("blog", "es");
    const postsCa = getAllFilesFrontMatter("blog", "ca");

    const tagsEn = getAllTags("blog", "en");
    const tagsEs = getAllTags("blog", "es");
    const tagsCa = getAllTags("blog", "ca");

    const blogPathsEn = postsEn.map((p) => `/${p.slug}`);
    const blogPathsEs = postsEs.map((p) => `/es/${p.slug}`);
    const blogPathsCa = postsCa.map((p) => `/ca/${p.slug}`);

    const tagPathsEn = tagsEn.map((tag) => `/tags/${tag}`);
    const tagPathsEs = tagsEs.map((tag) => `/es/tags/${tag}`);
    const tagPathsCa = tagsCa.map((tag) => `/ca/tags/${tag}`);

    return [
      "/",
      "/es",
      "/ca",
      "/about",
      "/es/about",
      "/ca/about",
      ...blogPathsEn,
      ...blogPathsEs,
      ...blogPathsCa,
      ...tagPathsEn,
      ...tagPathsEs,
      ...tagPathsCa,
    ];
  },
} satisfies Config;
