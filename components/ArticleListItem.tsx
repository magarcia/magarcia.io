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
    Promise.all([import("react-markdown"), import("./mdxComponents")]).then(
      ([rm, mc]) => {
        setComponents({
          ReactMarkdown: rm.default,
          mdxComponents: mc.mdxComponents,
        });
      }
    );
  }, []);

  const postPath = lang === "en" ? `/${slug}` : `/${lang}/${slug}`;
  const year = format(parseISO(date), "yyyy");

  return (
    <article className="mb-12" data-testid="article-item">
      <Link to={postPath} className="group block">
        <div className="flex items-start justify-between gap-4 mb-1">
          <h2 className="font-heading text-[27px] font-medium text-[#1A1A1A] leading-[33.75px] dark:text-gray-100 group-hover:text-yellow-600 dark:group-hover:text-purple-400 transition-colors">
            {title}
          </h2>
          <time
            dateTime={date}
            className="text-xs font-mono text-[#999] dark:text-gray-500 flex-shrink-0 leading-[33.75px] "
          >
            {year}
          </time>
        </div>
        <div className="text-[#666] dark:text-gray-400 text-base leading-relaxed [&_p]:my-0">
          {components ? (
            <components.ReactMarkdown components={components.mdxComponents}>
              {spoiler}
            </components.ReactMarkdown>
          ) : (
            <p className="my-0">{spoiler}</p>
          )}
        </div>
      </Link>
    </article>
  );
}
