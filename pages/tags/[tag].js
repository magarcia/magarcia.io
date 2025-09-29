import { parseISO, format } from "date-fns";
import { Link as LinkIcon } from "react-feather";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { getAllFilesFrontMatter } from "../../lib/blog";
import Header from "../../components/Header";
import SeoHead from "../../components/SeoHead";
import markdownComponents from "../../components/markdownComponents";

export default function Blog({ posts, tag }) {
  const totalCount = posts.length;
  const title = `${totalCount} post${
    totalCount === 1 ? "" : "s"
  } tagged with "${tag}"`;
  const anchorSize = 18;
  return <>
    <SeoHead
      title={title}
      description={`Posts tagged with "${tag}" on magarcia.io`}
    />
    <Header />
    <main className="mx-auto max-w-prose px-8 md:px-0 mb-16">
      <h2 className="text-2xl font-semibold">{title}</h2>

      <div
        style={{
          paddingLeft: 1.5 * anchorSize,
        }}
      >
        {posts.map(({ title, slug, readingTime, date }) => (
          <div key={slug} className="my-8">
            <h3 className="font-medium text-lg">
              <Link href={`/${slug}`} title={title}>

                <LinkIcon
                  size={anchorSize}
                  className="inline-block"
                  style={{
                    marginLeft: -1.5 * anchorSize,
                    marginRight: anchorSize / 2,
                  }}
                />
                <ReactMarkdown components={markdownComponents} className="inline">
                  {title}
                </ReactMarkdown>

              </Link>
            </h3>
            <small className="text-sm opacity-75">
              <time dateTime={date}>
                {format(parseISO(date), "MMMM d, yyyy")}
              </time>{" "}
              &#8208; {readingTime.text}
            </small>
          </div>
        ))}
      </div>
    </main>
  </>;
}

export async function getStaticPaths() {
  const posts = await getAllFilesFrontMatter("blog");
  const tags = Array.from(
    new Set(
      posts.flatMap((p) =>
        p.tags.map((t) => t.toLowerCase().replace(/\s+/g, "-"))
      )
    )
  );

  return {
    paths: tags.map((tag) => ({
      params: { tag },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  let posts = await getAllFilesFrontMatter("blog");
  posts = posts.filter((post) =>
    post.tags
      .map((t) => t.toLowerCase().replace(/\s+/g, "-"))
      .includes(params.tag.toLowerCase())
  );

  return { props: { posts, tag: params.tag } };
}
