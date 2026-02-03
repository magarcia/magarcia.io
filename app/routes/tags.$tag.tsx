import { Link as LinkIcon } from "react-feather";
import { Link } from "react-router";
import type { Route } from "./+types/tags.$tag";
import {
  getPostsByTagSlug,
  getTagBySlug,
  getTagDescription,
  isValidSlug,
  isValidLang,
  type FrontMatter,
} from "~/lib/blog";
import Header from "~/components/Header";
import { formatDate, formatReadingTime, formatTagPageTitle } from "~/lib/i18n";
import { buildCanonicalLink, buildTagHreflangLinks } from "~/lib/hreflang";
import { truncateDescription } from "~/lib/seo";

export function meta({ data, location }: Route.MetaArgs) {
  if (!data) {
    return [{ title: "Tag Not Found" }];
  }

  const { tag, totalCount, lang } = data;
  const title = formatTagPageTitle(totalCount, tag, lang);
  const siteUrl = "https://magarcia.io";

  // Get contextual description from TAG_METADATA or fallback to generic template
  const rawDescription =
    getTagDescription(tag, lang) ?? `Posts tagged with "${tag}" on magarcia.io`;
  const description = truncateDescription(rawDescription);

  return [
    { title: `${title} — magarcia` },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: `${siteUrl}${location.pathname}` },
    { property: "og:site_name", content: "magarcia" },
    { property: "og:image", content: `${siteUrl}/og/default.png` },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { name: "twitter:card", content: "summary" },
    buildCanonicalLink(location.pathname),
    ...buildTagHreflangLinks(tag),
  ];
}

export async function loader({ params, request }: Route.LoaderArgs) {
  const tagSlug = params.tag;
  if (!tagSlug || !isValidSlug(tagSlug)) {
    throw new Response("Tag Not Found", { status: 404 });
  }

  const pathname = new URL(request.url).pathname;
  const lang = pathname.startsWith("/es/")
    ? "es"
    : pathname.startsWith("/ca/")
      ? "ca"
      : "en";

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
  const title = formatTagPageTitle(totalCount, tag, lang);

  return (
    <>
      <Header lang={lang} />
      <main className="max-w-[75ch] mx-auto px-8 md:px-16 mb-12 md:mb-24">
        <h1
          className="text-2xl font-normal text-foreground mb-8 md:mb-12"
          data-testid="tag-heading"
        >
          {title}
        </h1>

        <div className="pl-7" data-testid="article-list">
          {posts.map(({ title, slug, readingTime, date }: FrontMatter) => (
            <div key={slug} className="my-6 md:my-8" data-testid="article-item">
              <h3 className="font-medium text-lg text-foreground">
                <Link
                  to={`/${slug}/`}
                  title={title}
                  className="hover:text-yellow-600 dark:hover:text-purple-400 transition-colors"
                >
                  <LinkIcon
                    size={18}
                    className="inline-block text-muted-foreground -ml-7 mr-2"
                  />
                  {title}
                </Link>
              </h3>
              <small className="text-sm text-muted-foreground">
                <time dateTime={date}>{formatDate(date, lang)}</time> —{" "}
                {formatReadingTime(readingTime.minutes, lang)}
              </small>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
