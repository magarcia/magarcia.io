import { parseISO, format } from "date-fns";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import Link from "next/link";
import { getAllFiles, getFileBySlug } from "../lib/blog";
import markdownComponents from "../components/markdownComponents";
import Header from "../components/Header";
import ViewCounter from "../components/ViewCounter";
import SeoHead from "../components/SeoHead";
import { buildDiscussUrl, buildEditUrl } from "../lib/urls";

export default function Post({ frontMatter, content, prev, next }) {
  const { title, date, readingTime, spoiler, tags, slug } = frontMatter;

  const editUrl = buildEditUrl(slug);
  const discussUrl = buildDiscussUrl(slug);
  const meta = {
    title,
    date,
    description: spoiler,
  };

  return <>
    <SeoHead {...meta} />
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
            &#8208; {readingTime.text} &#8208; <ViewCounter slug={slug} />
          </div>
        </header>
        <div className="mx-auto max-w-prose">
          <ReactMarkdown
            className="my-16 text-2xl font-light leading-relaxed"
            components={markdownComponents}
          >
            {spoiler}
          </ReactMarkdown>
          <ReactMarkdown
            className="prose md:prose-lg dark:prose-dark"
            rehypePlugins={[rehypeRaw]}
            components={markdownComponents}
          >
            {content}
          </ReactMarkdown>
        </div>
      </article>
      <footer className="px-8 mx-auto mt-16 text-sm max-w-prose md:px-0 md:text-base">
        <div className="flex flex-wrap">
          {tags.map((tag) => (
            <a
              key={tag}
              className="px-2 py-1 mb-3 mr-3 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 last:mr-0 dark:border-gray-800 whitespace-nowrap"
              href={`/tags/${tag.toLowerCase().replace(/\s+/g, "-")}`}
            >
              #{tag}
            </a>
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
                (<Link href={`/${post.slug}`} rel={rel} title={post.title} className="underline">

                  {rel === "prev" && `← `}
                  {post.title}
                  {rel === "next" && ` →`}

                </Link>)
              )}
            </li>
          ))}
        </ul>
      </nav>
    </main>
  </>;
}

export async function getStaticPaths() {
  const posts = await getAllFiles("blog");

  return {
    paths: posts.map(({ slug }) => ({ params: { slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = await getFileBySlug("blog", params.slug);

  return { props: { ...post } };
}
