import { format, parseISO } from "date-fns";
import { es, ca, enUS, type Locale } from "date-fns/locale";

export type Lang = "en" | "es" | "ca";

/**
 * Detects the language from a URL pathname.
 * Handles both exact paths (/es, /ca) and prefixed paths (/es/*, /ca/*).
 *
 * @param pathname - URL pathname (e.g., "/es/blog-post" or "/es" or "/es/")
 * @returns Language code ("en", "es", "ca")
 *
 * @example
 * getLangFromPathname("/es/my-post")  // "es"
 * getLangFromPathname("/es")          // "es"
 * getLangFromPathname("/es/")         // "es"
 * getLangFromPathname("/my-post")     // "en"
 */
export function getLangFromPathname(pathname: string): Lang {
  if (pathname.startsWith("/es/") || pathname === "/es") {
    return "es";
  }
  if (pathname.startsWith("/ca/") || pathname === "/ca") {
    return "ca";
  }
  return "en";
}

const locales: Record<string, Locale> = {
  en: enUS,
  es: es,
  ca: ca,
};

const readingTimeTranslations: Record<string, (min: number) => string> = {
  en: (min) => `${min} min read`,
  es: (min) => `${min} min de lectura`,
  ca: (min) => `${min} min de lectura`,
};

const tagPageTitleTranslations: Record<
  string,
  (n: number, t: string) => string
> = {
  en: (n, t) => `${n} post${n === 1 ? "" : "s"} tagged with "${t}"`,
  es: (n, t) =>
    `${n} post${n === 1 ? "" : "s"} etiquetado${n === 1 ? "" : "s"} con "${t}"`,
  ca: (n, t) =>
    `${n} post${n === 1 ? "" : "s"} etiquetat${n === 1 ? "" : "s"} amb "${t}"`,
};

const sectionTitles: Record<string, Record<string, string>> = {
  about: { en: "About", es: "Sobre mí", ca: "Sobre mi" },
  projects: { en: "Projects", es: "Proyectos", ca: "Projectes" },
  writing: { en: "Writing", es: "Escritura", ca: "Escriptura" },
};

const moreProjectsLabels: Record<string, string> = {
  en: "More projects",
  es: "Más proyectos",
  ca: "Més projectes",
};

/**
 * Formats a date string according to the specified language locale.
 *
 * @param dateString - ISO 8601 date string (e.g., "2024-01-15")
 * @param lang - Language code ("en", "es", "ca"). Defaults to "en"
 * @returns Formatted date string (e.g., "15 January 2024" for English)
 *
 * @example
 * formatDate("2024-01-15", "en") // "15 January 2024"
 * formatDate("2024-01-15", "es") // "15 enero 2024"
 */
export function formatDate(dateString: string, lang: string = "en"): string {
  const locale = locales[lang] || locales.en;
  return format(parseISO(dateString), "d MMMM yyyy", { locale });
}

/**
 * Formats reading time in minutes with appropriate localized text.
 * Automatically rounds up fractional minutes.
 *
 * @param minutes - Reading time in minutes (can be fractional)
 * @param lang - Language code ("en", "es", "ca"). Defaults to "en"
 * @returns Formatted reading time string
 *
 * @example
 * formatReadingTime(5, "en")   // "5 min read"
 * formatReadingTime(3.7, "es") // "4 min de lectura"
 */
export function formatReadingTime(
  minutes: number,
  lang: string = "en",
): string {
  const roundedMinutes = Math.ceil(minutes);
  const formatter = readingTimeTranslations[lang] || readingTimeTranslations.en;
  return formatter(roundedMinutes);
}

/**
 * Formats a tag page title with post count and tag name, handling pluralization.
 *
 * @param count - Number of posts
 * @param tag - Tag name/slug
 * @param lang - Language code ("en", "es", "ca"). Defaults to "en"
 * @returns Formatted title with proper pluralization
 *
 * @example
 * formatTagPageTitle(1, "react", "en")  // '1 post tagged with "react"'
 * formatTagPageTitle(5, "react", "es")  // '5 posts etiquetados con "react"'
 */
export function formatTagPageTitle(
  count: number,
  tag: string,
  lang: string = "en",
): string {
  const formatter =
    tagPageTitleTranslations[lang] || tagPageTitleTranslations.en;
  return formatter(count, tag);
}

/**
 * Gets the localized title for a site section.
 *
 * @param section - Section identifier ("about", "projects", or "writing")
 * @param lang - Language code ("en", "es", "ca"). Defaults to "en"
 * @returns Localized section title
 *
 * @example
 * getSectionTitle("about", "en") // "About"
 * getSectionTitle("about", "es") // "Sobre mí"
 */
export function getSectionTitle(
  section: "about" | "projects" | "writing",
  lang: string = "en",
): string {
  return (
    sectionTitles[section]?.[lang] || sectionTitles[section]?.en || section
  );
}

/**
 * Gets the localized "More projects" label for the projects section link.
 *
 * @param lang - Language code ("en", "es", "ca"). Defaults to "en"
 * @returns Localized "More projects" label
 *
 * @example
 * getMoreProjectsLabel("en") // "More projects"
 * getMoreProjectsLabel("es") // "Más proyectos"
 */
export function getMoreProjectsLabel(lang: string = "en"): string {
  return moreProjectsLabels[lang] || moreProjectsLabels.en;
}
