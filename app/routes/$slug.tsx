import { parseISO, format } from "date-fns";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import type { Route } from "./+types/$slug";
import { getFileBySlug, type BlogPostWithNavigation } from "~/lib/blog";
import Header from "~/components/Header";
import { buildDiscussUrl, buildEditUrl } from "~/lib/urls";

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

export async function loader({ params }: Route.LoaderArgs) {
  try {
    const post = getFileBySlug("blog", params.slug);
    return post;
  } catch (error) {
    throw new Response("Not Found", { status: 404 });
  }
}

export default function BlogPost({ loaderData }: Route.ComponentProps) {
  const { frontMatter, content, prev, next } =
    loaderData as BlogPostWithNavigation;
  const { title, date, readingTime, spoiler, tags, slug } = frontMatter;
  const [components, setComponents] = useState<{
    ReactMarkdown: any;
    rehypeRaw: any;
    mdxComponents: any;
  } | null>(null);

  const editUrl = buildEditUrl(slug);
  const discussUrl = buildDiscussUrl(slug);

  useEffect(() => {
    // Dynamically import react-markdown and dependencies only on client-side
    Promise.all([
      import("react-markdown"),
      import("rehype-raw"),
      import("~/components/mdxComponents")
    ]).then(([rm, rr, mc]) => {
      setComponents({
        ReactMarkdown: rm.default,
        rehypeRaw: rr.default,
        mdxComponents: mc.mdxComponents
      });
    });
  }, []);

  return (
    <>
      <Header />
      <main className="min-w-full">
        <article className="px-8 mx-auto max-w-prose md:px-0">
          <header className="mb-10 md:mb-16 md:text-center">
            <h1 className="mt-10 mb-3 text-5xl font-bold text-gray-800 md:text-5xl dark:text-gray-50">
              {title}
            </h1>

            <div className="text-sm opacity-75 md:text-base">
              <time dateTime={date}>
                {format(parseISO(date), "MMMM d, yyyy")}
              </time>{" "}
              &#8208; {readingTime.text}
            </div>
          </header>
          <div className="mx-auto max-w-prose">
            <div className="my-16 text-2xl font-light leading-relaxed">
              {components ? (
                <components.ReactMarkdown components={components.mdxComponents}>
                  {spoiler}
                </components.ReactMarkdown>
              ) : (
                <p>{spoiler}</p>
              )}
            </div>
            {components ? (
              <div className="prose md:prose-lg dark:prose-dark">
                <components.ReactMarkdown
                  rehypePlugins={[components.rehypeRaw]}
                  components={components.mdxComponents}
                >
                  {content}
                </components.ReactMarkdown>
              </div>
            ) : (
              <div className="prose md:prose-lg dark:prose-dark">
                <p>{content.substring(0, 200)}...</p>
              </div>
            )}
          </div>
        </article>
        <footer className="px-8 mx-auto mt-16 text-sm max-w-prose md:px-0 md:text-base">
          <div className="flex flex-wrap">
            {tags.map((tag) => (
              <Link
                key={tag}
                className="px-2 py-1 mb-3 mr-3 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 last:mr-0 dark:border-gray-800 whitespace-nowrap"
                to={`/tags/${tag.toLowerCase().replace(/\s+/g, "-")}`}
              >
                #{tag}
              </Link>
            ))}
          </div>
          <p className="mt-12 mb-16">
            <a
              href={discussUrl}
              target="_blank"
              className="underline"
              rel="noopener noreferrer"
            >
              Discuss on Twitter
            </a>{" "}
            ‐{" "}
            <a
              href={editUrl}
              target="_blank"
              className="underline"
              rel="noopener noreferrer"
            >
              Edit on GitHub
            </a>
          </p>
        </footer>
        <nav className="px-8 mx-auto mb-8 text-sm max-w-prose md:px-0 md:text-base">
          <ul className="flex flex-wrap items-center gap-4 place-content-between">
            {[
              [prev, "prev"],
              [next, "next"],
            ].map(([post, rel]) => (
              <li key={rel} className="whitespace-nowrap">
                {post && (
                  <Link
                    to={`/${post.slug}`}
                    rel={rel}
                    title={post.title}
                    className="underline"
                  >
                    {rel === "prev" && `← `}
                    {post.title}
                    {rel === "next" && ` →`}
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
