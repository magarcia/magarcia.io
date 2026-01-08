import { getSectionTitle } from "~/lib/i18n";
import SectionHeader from "./SectionHeader";

interface AboutSectionProps {
  lang: string;
}

const linkClass = "underline transition-colors";

export default function AboutSection({ lang }: AboutSectionProps) {
  const content: Record<string, React.ReactNode> = {
    en: (
      <>
        I live in Barcelona and love to surf, surfskate, hike, and cook. I'm a
        Software Engineer at{" "}
        <a
          href="https://buffer.com"
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          Buffer
        </a>
        . On the side, I'm building{" "}
        <a
          href="https://palabreja.com"
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          Palabreja
        </a>
        . Here I write about React, TypeScript, and developer experiences.
      </>
    ),
    es: (
      <>
        Vivo en Barcelona y me encanta surfear, hacer surfskate, senderismo y
        cocinar. Soy Ingeniero de Software en{" "}
        <a
          href="https://buffer.com"
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          Buffer
        </a>
        . En paralelo, estoy construyendo{" "}
        <a
          href="https://palabreja.com"
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          Palabreja
        </a>
        . Aquí escribo sobre React, TypeScript y experiencias de desarrollo.
      </>
    ),
    ca: (
      <>
        Visc a Barcelona i m'encanta fer surf, surfskate, senderisme i cuinar.
        Sóc Enginyer de Software a{" "}
        <a
          href="https://buffer.com"
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          Buffer
        </a>
        . En paral·lel, estic construint{" "}
        <a
          href="https://palabreja.com"
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          Palabreja
        </a>
        . Aquí escric sobre React, TypeScript i experiències de desenvolupament.
      </>
    ),
  };

  return (
    <section className="mb-16">
      <SectionHeader>{getSectionTitle("about", lang)}</SectionHeader>
      <p className="text-foreground leading-relaxed text-center">
        {content[lang] || content.en}
      </p>
    </section>
  );
}
