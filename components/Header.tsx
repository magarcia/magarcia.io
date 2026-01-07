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

export default function Header({ main = false, lang = "en", slug }: HeaderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const homeUrl = lang === "en" ? "/" : `/${lang}`;
  const backText = backTranslations[lang] || backTranslations.en;

  return (
    <header className="pt-16 pb-8 px-8 md:px-16 max-w-[75ch] mx-auto relative z-50">
      <div className="flex place-content-between items-center">
        {main ? (
          <Link to={homeUrl}>
            <h1 className="text-2xl tracking-wide text-[#1A1A1A] dark:text-gray-200 font-normal relative inline-block px-2 py-1">
              <span className="relative z-10 font-semibold">magarcia</span>
              <span
                className="absolute inset-0 pointer-events-none header-highlight"
                style={{
                  top: "0.35em",
                  left: "-0.1em",
                  right: "-0.1em",
                  bottom: "0.15em",
                  borderRadius: "0.8em 0.3em",
                  transform: "rotate(-0.5deg) skewX(-1deg)",
                }}
              ></span>
            </h1>
          </Link>
        ) : (
          <Link
            to={homeUrl}
            className="text-xs uppercase tracking-widest text-[#666] dark:text-gray-400 hover:text-[#1A1A1A] dark:hover:text-gray-200 transition-colors"
          >
            ← {backText}
          </Link>
        )}
        <div className="flex items-center gap-4">
          <LanguageSelector lang={lang} slug={slug} />
          {mounted && <ThemeToggle />}
        </div>
      </div>
    </header>
  );
}
