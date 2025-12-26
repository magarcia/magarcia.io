import { Link } from "react-router";
import { Globe } from "react-feather";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LanguageSelectorProps {
    lang: string;
    slug?: string;
}

const languages = [
    { code: "en", label: "English" },
    { code: "es", label: "Español" },
    { code: "ca", label: "Català" },
] as const;

const VALID_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i;

function sanitizeSlug(slug: string): string | null {
    if (!slug || !VALID_SLUG_PATTERN.test(slug) || slug.length > 200) {
        return null;
    }
    return slug;
}

export default function LanguageSelector({ lang, slug }: LanguageSelectorProps) {
    const safeSlug = slug ? sanitizeSlug(slug) : null;

    const getLanguageLink = (targetLang: string) => {
        if (safeSlug) {
            return targetLang === "en" ? `/${safeSlug}` : `/${targetLang}/${safeSlug}`;
        }
        return targetLang === "en" ? "/" : `/${targetLang}`;
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="p-2 opacity-50 hover:opacity-100 transition-opacity"
                    aria-label="Select language"
                    data-testid="language-selector"
                >
                    <Globe size={20} />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {languages.map((l) => (
                    <DropdownMenuItem key={l.code} asChild>
                        <Link
                            to={getLanguageLink(l.code)}
                            className={`cursor-pointer ${lang === l.code ? "font-bold" : ""
                                }`}
                        >
                            {l.label}
                        </Link>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
