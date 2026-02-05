import { Link } from "react-router";
import { parseISO, format } from "date-fns";
import ReactMarkdown from "react-markdown";
import type { FrontMatter } from "~/lib/blog";
import { mdxComponents } from "./mdxComponents";

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
  const postPath = lang === "en" ? `/${slug}/` : `/${lang}/${slug}/`;
  const year = format(parseISO(date), "yyyy");

  return (
    <article className="mb-10 md:mb-16" data-testid="article-item">
      <Link to={postPath} className="group block">
        <div className="flex items-start justify-between gap-4 mb-1">
          <h2 className="font-heading text-[1.35rem] font-medium text-foreground leading-snug group-hover:text-yellow-600 dark:group-hover:text-purple-400 transition-colors">
            {title}
          </h2>
          <time
            dateTime={date}
            className="text-xs font-mono text-muted-foreground flex-shrink-0 leading-snug"
          >
            {year}
          </time>
        </div>
        <div className="text-muted-foreground text-base leading-relaxed [&_p]:my-0">
          <ReactMarkdown components={mdxComponents}>{spoiler}</ReactMarkdown>
        </div>
      </Link>
    </article>
  );
}
