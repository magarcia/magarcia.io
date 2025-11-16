import type { Route } from "./+types/_index";
import { getAllFilesFrontMatter, type FrontMatter } from "~/lib/blog";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import ArticleListItem from "~/components/ArticleListItem";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "magarcia — A personal blog" },
    {
      name: "description",
      content:
        "A personal blog by Martin Garcia. Thoughts, words, and experiments about code.",
    },
    { property: "og:title", content: "magarcia — A personal blog" },
    {
      property: "og:description",
      content:
        "A personal blog by Martin Garcia. Thoughts, words, and experiments about code.",
    },
    { property: "og:type", content: "blog" },
    { property: "og:url", content: "https://magarcia.io" },
    { property: "og:site_name", content: "magarcia" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:site", content: "@martinprins" },
    { name: "twitter:creator", content: "@martinprins" },
  ];
}

export async function loader() {
  const posts = getAllFilesFrontMatter("blog").filter(
    ({ indexed }) => indexed !== false
  );

  return { posts };
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const { posts } = loaderData;

  return (
    <>
      <Header main={true} />
      <main className="min-w-full">
        {posts.map((post: FrontMatter) => (
          <ArticleListItem {...post} key={post.slug} />
        ))}
      </main>
      <Footer />
    </>
  );
}
