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
];

export default function LanguageSelector({ lang, slug }: LanguageSelectorProps) {
    const getLanguageLink = (targetLang: string) => {
        if (slug) {
            return targetLang === "en" ? `/${slug}` : `/${targetLang}/${slug}`;
        }
        return targetLang === "en" ? "/" : `/${targetLang}`;
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="p-2 opacity-50 hover:opacity-100 transition-opacity"
                    aria-label="Select language"
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
