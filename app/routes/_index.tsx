import type { Route } from "./+types/_index";
import { getAllFilesFrontMatter } from "~/lib/blog";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import AboutSection from "~/components/AboutSection";
import ProjectsSection from "~/components/ProjectsSection";
import WritingSection from "~/components/WritingSection";
import { buildCanonicalLink, buildHomepageHreflangLinks } from "~/lib/hreflang";
import { getLangFromPathname } from "~/lib/i18n";

export function meta({ location }: Route.MetaArgs) {
  const pathname = location.pathname || "/";

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
    buildCanonicalLink(pathname),
    ...buildHomepageHreflangLinks(),
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const pathname = new URL(request.url).pathname;
  const lang = getLangFromPathname(pathname);
  const posts = getAllFilesFrontMatter("blog", lang).filter(
    ({ indexed }) => indexed !== false,
  );

  return { posts, lang };
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const { posts, lang } = loaderData;

  return (
    <>
      <Header main lang={lang} />
      <main
        className="max-w-[75ch] mx-auto px-8 md:px-16"
        data-testid="homepage"
      >
        <AboutSection lang={lang} />
        <ProjectsSection lang={lang} />
        <WritingSection posts={posts} lang={lang} />
      </main>
      <Footer />
    </>
  );
}
