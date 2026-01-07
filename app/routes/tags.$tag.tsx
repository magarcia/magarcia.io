import { Link as LinkIcon } from "react-feather";
import { Link } from "react-router";
import type { Route } from "./+types/tags.$tag";
import { getPostsByTagSlug, getTagBySlug, isValidSlug, isValidLang, type FrontMatter } from "~/lib/blog";
import Header from "~/components/Header";
import { formatDate, formatReadingTime } from "~/lib/i18n";

export function meta({ data }: Route.MetaArgs) {
  if (!data) {
    return [{ title: "Tag Not Found" }];
  }

  const { tag, totalCount } = data;
  const title = `${totalCount} post${totalCount === 1 ? "" : "s"
    } tagged with "${tag}"`;

  return [
    { title: `${title} — magarcia` },
    { name: "description", content: `Posts tagged with "${tag}" on magarcia.io` },
    { property: "og:title", content: title },
    { property: "og:description", content: `Posts tagged with "${tag}" on magarcia.io` },
  ];
}

export async function loader({ params, request }: Route.LoaderArgs) {
  const tagSlug = params.tag;
  if (!tagSlug || !isValidSlug(tagSlug)) {
    throw new Response("Tag Not Found", { status: 404 });
  }

  const pathname = new URL(request.url).pathname;
  const lang = pathname.startsWith("/es/") ? "es" : pathname.startsWith("/ca/") ? "ca" : "en";

  if (!isValidLang(lang)) {
    throw new Response("Tag Not Found", { status: 404 });
  }

  const tag = getTagBySlug("blog", tagSlug);
  if (!tag) {
    throw new Response("Tag Not Found", { status: 404 });
  }

  const posts = getPostsByTagSlug("blog", tagSlug, lang);

  return {
    posts,
    tag,
    totalCount: posts.length,
    lang,
  };
}

export default function TagPage({ loaderData }: Route.ComponentProps) {
  const { posts, tag, totalCount, lang } = loaderData;
  const title = `${totalCount} post${totalCount === 1 ? "" : "s"
    } tagged with "${tag}"`;
  const anchorSize = 18;

  return (
    <>
      <Header lang={lang} />
      <main className="max-w-[75ch] mx-auto px-8 md:px-16 mb-24">
        <h2 className="text-2xl font-normal text-[#1A1A1A] dark:text-gray-100 mb-12" data-testid="tag-heading">
          {title}
        </h2>

        <div
          style={{
            paddingLeft: 1.5 * anchorSize,
          }}
          data-testid="article-list"
        >
          {posts.map(({ title, slug, readingTime, date }: FrontMatter) => (
            <div key={slug} className="my-8" data-testid="article-item">
              <h3 className="font-medium text-lg text-[#1A1A1A] dark:text-gray-100">
                <Link to={`/${slug}`} title={title} className="hover:text-yellow-600 dark:hover:text-purple-400 transition-colors">
                  <LinkIcon
                    size={anchorSize}
                    className="inline-block text-[#999] dark:text-gray-500"
                    style={{
                      marginLeft: -1.5 * anchorSize,
                      marginRight: anchorSize / 2,
                    }}
                  />
                  {title}
                </Link>
              </h3>
              <small className="text-sm text-[#666] dark:text-gray-400">
                <time dateTime={date}>
                  {formatDate(date, lang)}
                </time>{" "}
                — {formatReadingTime(readingTime.minutes, lang)}
              </small>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
