import { format, parseISO } from "date-fns";
import { es, ca, enUS, type Locale } from "date-fns/locale";

const locales: Record<string, Locale> = {
  en: enUS,
  es: es,
  ca: ca,
};

export function formatDate(dateString: string, lang: string = "en"): string {
  const locale = locales[lang] || locales.en;
  return format(parseISO(dateString), "d MMMM yyyy", { locale });
}

export function formatReadingTime(
  minutes: number,
  lang: string = "en"
): string {
  const roundedMinutes = Math.ceil(minutes);

  const translations: Record<string, (min: number) => string> = {
    en: (min) => `${min} min read`,
    es: (min) => `${min} min de lectura`,
    ca: (min) => `${min} min de lectura`,
  };

  const formatter = translations[lang] || translations.en;
  return formatter(roundedMinutes);
}

export function formatTagPageTitle(
  count: number,
  tag: string,
  lang: string = "en"
): string {
  const translations: Record<string, (n: number, t: string) => string> = {
    en: (n, t) => `${n} post${n === 1 ? "" : "s"} tagged with "${t}"`,
    es: (n, t) => `${n} post${n === 1 ? "" : "s"} etiquetado${n === 1 ? "" : "s"} con "${t}"`,
    ca: (n, t) => `${n} post${n === 1 ? "" : "s"} etiquetat${n === 1 ? "" : "s"} amb "${t}"`,
  };

  const formatter = translations[lang] || translations.en;
  return formatter(count, tag);
}

export function getSectionTitle(
  section: "about" | "projects" | "writing",
  lang: string = "en"
): string {
  const titles: Record<string, Record<string, string>> = {
    about: { en: "About", es: "Sobre mí", ca: "Sobre mi" },
    projects: { en: "Projects", es: "Proyectos", ca: "Projectes" },
    writing: { en: "Writing", es: "Escritura", ca: "Escriptura" },
  };
  return titles[section]?.[lang] || titles[section]?.en || section;
}
