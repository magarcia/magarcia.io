import { format, parseISO } from "date-fns";
import { es, ca, enUS } from "date-fns/locale";

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
