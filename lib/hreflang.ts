import { slugifyTag } from "./urls";

type HreflangLink = {
  tagName: "link";
  rel: "alternate";
  hrefLang: string;
  href: string;
};

type CanonicalLink = {
  tagName: "link";
  rel: "canonical";
  href: string;
};

export type { HreflangLink, CanonicalLink };

const SUPPORTED_LOCALES = ["en", "es", "ca"] as const;
const BASE_URL = "https://magarcia.io";

/**
 * Build hreflang links for a post given the set of available locales.
 * The availableLocales should be pre-computed in the loader using filesystem checks.
 */
export function buildPostHreflangLinks(
  slug: string,
  availableLocales: readonly string[],
): HreflangLink[] {
  const links: HreflangLink[] = [];

  for (const locale of SUPPORTED_LOCALES) {
    if (availableLocales.includes(locale)) {
      links.push({
        tagName: "link",
        rel: "alternate",
        hrefLang: locale,
        href: `${BASE_URL}${locale === "en" ? "" : `/${locale}`}/${slug}/`,
      });
    }
  }

  if (availableLocales.includes("en")) {
    links.push({
      tagName: "link",
      rel: "alternate",
      hrefLang: "x-default",
      href: `${BASE_URL}/${slug}/`,
    });
  }

  return links;
}

/**
 * Build hreflang links for homepage locale variants
 */
export function buildHomepageHreflangLinks(): HreflangLink[] {
  return [
    {
      tagName: "link",
      rel: "alternate",
      hrefLang: "en",
      href: `${BASE_URL}/`,
    },
    {
      tagName: "link",
      rel: "alternate",
      hrefLang: "es",
      href: `${BASE_URL}/es/`,
    },
    {
      tagName: "link",
      rel: "alternate",
      hrefLang: "ca",
      href: `${BASE_URL}/ca/`,
    },
    {
      tagName: "link",
      rel: "alternate",
      hrefLang: "x-default",
      href: `${BASE_URL}/`,
    },
  ];
}

/**
 * Build hreflang links for projects page locale variants
 */
export function buildProjectsHreflangLinks(): HreflangLink[] {
  return [
    {
      tagName: "link",
      rel: "alternate",
      hrefLang: "en",
      href: `${BASE_URL}/projects/`,
    },
    {
      tagName: "link",
      rel: "alternate",
      hrefLang: "es",
      href: `${BASE_URL}/es/projects/`,
    },
    {
      tagName: "link",
      rel: "alternate",
      hrefLang: "ca",
      href: `${BASE_URL}/ca/projects/`,
    },
    {
      tagName: "link",
      rel: "alternate",
      hrefLang: "x-default",
      href: `${BASE_URL}/projects/`,
    },
  ];
}

/**
 * Build canonical link for a given pathname
 */
export function buildCanonicalLink(pathname: string): CanonicalLink {
  const canonicalUrl = `${BASE_URL}${pathname}`;
  return {
    tagName: "link",
    rel: "canonical",
    href: canonicalUrl,
  };
}

/**
 * Build hreflang links for tag page locale variants
 */
export function buildTagHreflangLinks(tag: string): HreflangLink[] {
  const slug = slugifyTag(tag);

  return [
    {
      tagName: "link",
      rel: "alternate",
      hrefLang: "en",
      href: `${BASE_URL}/tags/${slug}/`,
    },
    {
      tagName: "link",
      rel: "alternate",
      hrefLang: "es",
      href: `${BASE_URL}/es/tags/${slug}/`,
    },
    {
      tagName: "link",
      rel: "alternate",
      hrefLang: "ca",
      href: `${BASE_URL}/ca/tags/${slug}/`,
    },
    {
      tagName: "link",
      rel: "alternate",
      hrefLang: "x-default",
      href: `${BASE_URL}/tags/${slug}/`,
    },
  ];
}
