import { Link } from "react-router";
import { parseISO, format } from "date-fns";
import { useState, useEffect } from "react";
import type { FrontMatter } from "~/lib/blog";

interface ArticleListItemProps extends FrontMatter {
  lang?: string;
}

export default function ArticleListItem({
  slug,
  title,
  date,
  readingTime,
  spoiler,
  lang = "en",
}: ArticleListItemProps) {
  const [components, setComponents] = useState<{
    ReactMarkdown: any;
    mdxComponents: any;
  } | null>(null);

  useEffect(() => {
    // Dynamically import react-markdown and mdxComponents only on client-side
    Promise.all([
      import("react-markdown"),
      import("./mdxComponents")
    ]).then(([rm, mc]) => {
      setComponents({
        ReactMarkdown: rm.default,
        mdxComponents: mc.mdxComponents
      });
    });
  }, []);

  const postPath = lang === "en" ? `/${slug}` : `/${lang}/${slug}`;

  return (
    <article className="mx-auto max-w-prose px-8 md:px-0 mb-16">
      <Link to={postPath}>
        <header>
          <h2 className="font-semibold text-2xl mt-8 mb-2">{title}</h2>
          <div className="opacity-75 text-sm md:text-base">
            <time dateTime={date}>
              {format(parseISO(date), "MMMM d, yyyy")}
            </time>{" "}
            &#8208; {readingTime.text}
          </div>
        </header>
        <div className="text-lg">
          {components ? (
            <components.ReactMarkdown components={components.mdxComponents}>
              {spoiler}
            </components.ReactMarkdown>
          ) : (
            <p>{spoiler}</p>
          )}
        </div>
      </Link>
    </article>
  );
}
