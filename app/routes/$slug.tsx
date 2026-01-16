import { Link } from "react-router";
import type { Route } from "./+types/$slug";
import { getFileBySlug, isValidSlug, isValidLang, type BlogPostWithNavigation } from "~/lib/blog";
import Header from "~/components/Header";
import { buildTagUrl } from "~/lib/urls";
import { formatDate, formatReadingTime } from "~/lib/i18n";
import ReactMarkdownImport from "react-markdown";
import rehypeRawImport from "rehype-raw";
import remarkGfmImport from "remark-gfm";
import { mdxComponents } from "~/components/mdxComponents";

// Handle ESM/CJS interop - some packages export { default } in Node.js SSR
const ReactMarkdown =
  (ReactMarkdownImport as unknown as { default?: typeof ReactMarkdownImport }).default ?? ReactMarkdownImport;
const rehypeRaw =
  (rehypeRawImport as unknown as { default?: typeof rehypeRawImport }).default ?? rehypeRawImport;
const remarkGfm =
  (remarkGfmImport as unknown as { default?: typeof remarkGfmImport }).default ?? remarkGfmImport;

export function meta({ data }: Route.MetaArgs) {
  if (!data || !data.frontMatter) {
    return [{ title: "Post Not Found" }];
  }

  const { title, date, spoiler, slug, ogImage } = data.frontMatter;
  const siteUrl = "https://magarcia.io";
  const imageUrl = ogImage || `${siteUrl}/og/${slug}.png`;

  return [
    { title: `${title} — magarcia` },
    { name: "description", content: spoiler },
    { property: "og:title", content: `${title} — magarcia` },
    { property: "og:description", content: spoiler },
    { property: "og:type", content: "article" },
    { property: "og:site_name", content: "magarcia" },
    { property: "og:url", content: `${siteUrl}/${slug}` },
    { property: "og:image", content: imageUrl },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: "@martinprins" },
    { name: "twitter:creator", content: "@martinprins" },
    { name: "twitter:image", content: imageUrl },
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

  return (
    <>
      <Header slug={slug} lang={lang} />
      <main className="max-w-[75ch] mx-auto px-8 md:px-16">
        <article>
          <header className="mb-10 md:mb-16 text-center">
            <h1
              className="font-heading text-3xl md:text-4xl uppercase tracking-wide font-normal text-foreground mb-4"
              data-testid="post-title"
            >
              {title}
            </h1>

            <div className="text-sm text-muted-foreground">
              <time dateTime={date}>
                {formatDate(date, lang)}
              </time>{" "}
              — <span data-testid="reading-time">{formatReadingTime(readingTime.minutes, lang)}</span>
            </div>
          </header>
          <div className="prose prose-lg dark:prose-dark max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={mdxComponents}
            >
              {content}
            </ReactMarkdown>
          </div>
        </article>
        <footer className="mt-12 md:mt-24 text-sm text-muted-foreground">
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10 md:mb-16" data-testid="post-tags">
              {tags.map((tag) => (
                <Link
                  key={tag}
                  className="hover:text-foreground transition-colors"
                  to={buildTagUrl(tag, lang)}
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </footer>
        <nav className="mb-10 md:mb-16 text-sm" aria-label="Post navigation">
          <ul className="flex flex-wrap items-center justify-between gap-4">
            {prev && (
              <li className="min-w-0 max-w-[45%]">
                <Link
                  to={lang === "en" ? `/${prev.slug}` : `/${lang}/${prev.slug}`}
                  rel="prev"
                  title={prev.title}
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span className="shrink-0">←</span>
                  <span className="truncate">{prev.title}</span>
                </Link>
              </li>
            )}
            {next && (
              <li className="min-w-0 max-w-[45%] ml-auto">
                <Link
                  to={lang === "en" ? `/${next.slug}` : `/${lang}/${next.slug}`}
                  rel="next"
                  title={next.title}
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span className="truncate">{next.title}</span>
                  <span className="shrink-0">→</span>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </main>
    </>
  );
}
