import { useRef } from "react";
import { Link } from "react-router";
import { LanguagesIcon, type LanguagesIconHandle } from "./ui/languages";

interface LanguageSelectorProps {
  lang: string;
  slug?: string;
}

const languages = [
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
  { code: "ca", label: "CA" },
] as const;

const VALID_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i;

function sanitizeSlug(slug: string): string | null {
  if (!slug || !VALID_SLUG_PATTERN.test(slug) || slug.length > 200) {
    return null;
  }
  return slug;
}

export default function LanguageSelector({
  lang,
  slug,
}: LanguageSelectorProps) {
  const iconRef = useRef<LanguagesIconHandle>(null);
  const safeSlug = slug ? sanitizeSlug(slug) : null;

  const getLanguageLink = (targetLang: string) => {
    if (safeSlug) {
      return targetLang === "en"
        ? `/${safeSlug}`
        : `/${targetLang}/${safeSlug}`;
    }
    return targetLang === "en" ? "/" : `/${targetLang}`;
  };

  const handleMouseEnter = () => {
    iconRef.current?.startAnimation();
  };

  const handleMouseLeave = () => {
    iconRef.current?.stopAnimation();
  };

  return (
    <div
      className="group"
      data-testid="language-selector"
      aria-label="Select language"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      <div className="flex items-center">
        <nav className="flex items-center gap-1 font-mono text-xs max-w-0 group-hover:max-w-24 group-focus-within:max-w-24 overflow-hidden opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-300 ease-out">
          {languages.map((l) => (
            <Link
              key={l.code}
              to={getLanguageLink(l.code)}
              className={`px-1 whitespace-nowrap text-muted-foreground hover:text-foreground transition-colors ${
                lang === l.code ? "font-bold" : ""
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <span className="p-2 pointer-events-none group-hover:text-blue-500 group-focus-within:text-blue-500 transition-colors duration-300 ease-out text-muted-foreground/50">
          <LanguagesIcon ref={iconRef} size={18} />
        </span>
      </div>
    </div>
  );
}
