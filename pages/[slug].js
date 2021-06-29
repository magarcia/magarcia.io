import { parseISO, format } from "date-fns";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { getAllFiles, getFileBySlug } from "../lib/blog";
import markdownComponents from "../components/markdownComponents";
import Header from "../components/Header";
import SeoHead from "../components/SeoHead";
import { buildDiscussUrl, buildEditUrl } from "../lib/urls";
import Link from "next/link";

export default function Post({ frontMatter, content, prev, next }) {
  const { title, date, readingTime, spoiler, tags, slug } = frontMatter;

  const editUrl = buildEditUrl(slug);
  const discussUrl = buildDiscussUrl(slug);
  const meta = {
    title,
    date,
    description: spoiler,
  };

  return (
    <>
      <SeoHead {...meta} />
      <Header />
      <main className="min-w-full">
        <article className="mx-auto max-w-prose px-8 md:px-0">
          <header className="mb-10 md:mb-16 md:text-center">
            <h1 className="text-5xl md:text-5xl font-bold mt-10 mb-3 text-gray-800 dark:text-gray-50">
              {title}
            </h1>
            <div className="opacity-75 text-sm md:text-base">
              <time dateTime={date}>
                {format(parseISO(date), "MMMM d, yyyy")}
              </time>{" "}
              &#8208; {readingTime.text}
            </div>
          </header>
          <div className="max-w-prose mx-auto">
            <ReactMarkdown
              className="text-2xl font-light my-16 leading-relaxed"
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
        <footer className="mx-auto max-w-prose px-8 md:px-0 mt-16 text-sm md:text-base">
          <div className="flex flex-wrap">
            {tags.map((tag) => (
              <a
                key={tag}
                className="bg-gray-100 dark:bg-gray-700 mr-3 mb-3 last:mr-0 py-1 px-2 rounded border-gray-200 dark:border-gray-800 border whitespace-nowrap"
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
        <nav className="mx-auto max-w-prose px-8 md:px-0 mb-8 text-sm md:text-base">
          <ul className="flex flex-wrap place-content-between items-center gap-4">
            {[
              [prev, "prev"],
              [next, "next"],
            ].map(([post, rel]) => (
              <li key={rel} className="whitespace-nowrap">
                {post && (
                  <Link href={`/${post.slug}`} rel={rel} title={post.title}>
                    <a className="underline">
                      {rel === "prev" && `← `}
                      {post.title}
                      {rel === "next" && ` →`}
                    </a>
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
