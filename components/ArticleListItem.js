import React from "react";
import Link from "next/link";
import { parseISO, format } from "date-fns";
import ReactMarkdown from "react-markdown";
import markdownComponents from "../components/markdownComponents";

function ArticleListItem({ slug, title, date, readingTime, spoiler }) {
  return (
    <article className="mx-auto max-w-prose px-8 md:px-0 mb-16">
      <Link href={`/${slug}`}>

        <header>
          <h2 className="font-semibold text-2xl mt-8 mb-2">{title}</h2>
          <div className="opacity-75 text-sm md:text-base">
            <time dateTime={date}>
              {format(parseISO(date), "MMMM d, yyyy")}
            </time>{" "}
            &#8208; {readingTime.text}
          </div>
        </header>
        <ReactMarkdown components={markdownComponents} className="text-lg">
          {spoiler}
        </ReactMarkdown>{" "}

      </Link>
    </article>
  );
}

export default ArticleListItem;
