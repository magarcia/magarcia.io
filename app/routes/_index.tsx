import type { Route } from "./+types/_index";
import { getAllFilesFrontMatter, type FrontMatter } from "~/lib/blog";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import ArticleListItem from "~/components/ArticleListItem";

export function meta(_args: Route.MetaArgs) {
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

export async function loader({ request }: Route.LoaderArgs) {
  const pathname = new URL(request.url).pathname;
  let lang: string;
  if (pathname === "/es" || pathname === "/es/") lang = "es";
  else if (pathname === "/ca" || pathname === "/ca/") lang = "ca";
  else lang = "en";
  const posts = getAllFilesFrontMatter("blog", lang).filter(
    ({ indexed }) => indexed !== false
  );

  return { posts, lang };
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const { posts, lang } = loaderData;

  return (
    <>
      <Header main={true} lang={lang} />
      <main className="min-w-full">
        {posts.map((post: FrontMatter) => (
          <ArticleListItem {...post} key={post.slug} lang={lang} />
        ))}
      </main>
      <Footer />
    </>
  );
}
