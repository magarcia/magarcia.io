import { Link } from "react-router";
import { useState, useEffect } from "react";
import type { Route } from "./+types/$slug";
import { getFileBySlug, isValidSlug, isValidLang, type BlogPostWithNavigation } from "~/lib/blog";
import Header from "~/components/Header";
import { buildTagUrl } from "~/lib/urls";
import { formatDate, formatReadingTime } from "~/lib/i18n";

export function meta({ data }: Route.MetaArgs) {
  if (!data || !data.frontMatter) {
    return [{ title: "Post Not Found" }];
  }

  const { title, date, spoiler } = data.frontMatter;

  return [
    { title: `${title} — magarcia` },
    { name: "description", content: spoiler },
    { property: "og:title", content: `${title} — magarcia` },
    { property: "og:description", content: spoiler },
    { property: "og:type", content: "article" },
    { property: "og:site_name", content: "magarcia" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:site", content: "@martinprins" },
    { name: "twitter:creator", content: "@martinprins" },
    { property: "article:published_time", content: date },
  ];
}

export async function loader({ params, request }: Route.LoaderArgs) {
  const slug = params.slug;
  if (!slug || !isValidSlug(slug)) {
    throw new Response("Not Found", { status: 404 });
  }

  const pathname = new URL(request.url).pathname;
  const lang = pathname.startsWith("/es/") ? "es" : pathname.startsWith("/ca/") ? "ca" : "en";

  if (!isValidLang(lang)) {
    throw new Response("Not Found", { status: 404 });
  }

  try {
    const post = getFileBySlug("blog", slug, lang);
    return { ...post, lang };
  } catch {
    throw new Response("Not Found", { status: 404 });
  }
}

export default function BlogPost({ loaderData }: Route.ComponentProps) {
  const { frontMatter, content, prev, next, lang } =
    loaderData as BlogPostWithNavigation & { lang: string };
  const { title, date, readingTime, tags, slug } = frontMatter;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [components, setComponents] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    // Dynamically import react-markdown and dependencies only on client-side
    Promise.all([
      import("react-markdown"),
      import("rehype-raw"),
      import("remark-gfm"),
      import("~/components/mdxComponents")
    ]).then(([rm, rr, rgfm, mc]) => {
      setComponents({
        ReactMarkdown: rm.default,
        rehypeRaw: rr.default,
        remarkGfm: rgfm.default,
        mdxComponents: mc.mdxComponents
      });
    });
  }, []);

  return (
    <>
      <Header slug={slug} lang={lang} />
      <main className="max-w-[75ch] mx-auto px-8 md:px-16">
        <article>
          <header className="mb-16 text-center">
            <h1
              className="font-heading text-3xl md:text-4xl uppercase tracking-wide font-normal text-[#1A1A1A] dark:text-gray-100 mb-4"
              data-testid="post-title"
            >
              {title}
            </h1>

            <div className="text-sm text-[#666] dark:text-gray-400">
              <time dateTime={date}>
                {formatDate(date, lang)}
              </time>{" "}
              — <span data-testid="reading-time">{formatReadingTime(readingTime.minutes, lang)}</span>
            </div>
          </header>
          {components ? (
            <div className="prose prose-lg dark:prose-dark max-w-none">
              <components.ReactMarkdown
                remarkPlugins={[components.remarkGfm]}
                rehypePlugins={[components.rehypeRaw]}
                components={components.mdxComponents}
              >
                {content}
              </components.ReactMarkdown>
            </div>
          ) : (
            <div className="prose prose-lg dark:prose-dark max-w-none">
              <p>{content.substring(0, 200)}...</p>
            </div>
          )}
        </article>
        <footer className="mt-24 text-sm text-[#666] dark:text-gray-400">
          <div className="flex flex-wrap gap-2 mb-16" data-testid="post-tags">
            {tags.map((tag) => (
              <Link
                key={tag}
                className="hover:text-[#1A1A1A] dark:hover:text-gray-200 transition-colors"
                to={buildTagUrl(tag, lang)}
              >
                #{tag}
              </Link>
            ))}
          </div>
        </footer>
        <nav className="mb-16 text-sm">
          <ul className="flex flex-wrap items-center justify-between gap-4">
            {[
              { post: prev, rel: "prev" },
              { post: next, rel: "next" },
            ].map(({ post, rel }) => (
              <li key={rel} className="min-w-0 max-w-[45%]">
                {post && (
                  <Link
                    to={lang === "en" ? `/${post.slug}` : `/${lang}/${post.slug}`}
                    rel={rel}
                    title={post.title}
                    className="flex items-center gap-1 text-[#666] dark:text-gray-400 hover:text-[#1A1A1A] dark:hover:text-gray-200 transition-colors"
                  >
                    {rel === "prev" && <span className="shrink-0">←</span>}
                    <span className="truncate">{post.title}</span>
                    {rel === "next" && <span className="shrink-0">→</span>}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </main>
    </>
  );
}
