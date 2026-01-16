import { Link } from "react-router";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import LanguageSelector from "./LanguageSelector";

interface HeaderProps {
  main?: boolean;
  lang?: string;
  slug?: string;
}

const backTranslations: Record<string, string> = {
  en: "BACK",
  es: "VOLVER",
  ca: "TORNAR",
};

export default function Header({
  main = false,
  lang = "en",
  slug,
}: HeaderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const homeUrl = lang === "en" ? "/" : `/${lang}`;
  const backText = backTranslations[lang] || backTranslations.en;

  return (
    <header className="pt-8 md:pt-16 pb-4 md:pb-8 px-8 md:px-16 max-w-[75ch] mx-auto relative z-50">
      <div className="flex place-content-between items-center">
        {main ? (
          <Link to={homeUrl} aria-label="magarcia - Go to homepage">
            <h1 className="text-2xl tracking-wide text-foreground font-normal relative inline-block px-2 py-1">
              <span className="relative z-10 font-semibold">magarcia</span>
              <span
                className="absolute inset-0 pointer-events-none header-highlight"
                aria-hidden="true"
              ></span>
            </h1>
          </Link>
        ) : (
          <Link
            to={homeUrl}
            className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            ← {backText}
          </Link>
        )}
        <div className="flex items-center">
          <LanguageSelector lang={lang} slug={slug} />
          {mounted && <ThemeToggle />}
        </div>
      </div>
    </header>
  );
}
