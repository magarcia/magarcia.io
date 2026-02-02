/**
 * Tag metadata with localized descriptions for SEO.
 * Each tag has contextual descriptions in English, Spanish, and Catalan.
 */

export interface TagMetadata {
  slug: string;
  description: Record<string, string>; // en, es, ca
}

export const TAG_METADATA: Record<string, TagMetadata> = {
  ai: {
    slug: "ai",
    description: {
      en: "Posts about AI, LLMs, and machine learning tools for developers",
      es: "Publicaciones sobre IA, LLMs y herramientas de aprendizaje automático para desarrolladores",
      ca: "Publicacions sobre IA, LLMs i eines d'aprenentatge automàtic per a desenvolupadors",
    },
  },
  angular: {
    slug: "angular",
    description: {
      en: "Posts about Angular framework, components, and best practices",
      es: "Publicaciones sobre el framework Angular, componentes y mejores prácticas",
      ca: "Publicacions sobre el framework Angular, components i millors pràctiques",
    },
  },
  baking: {
    slug: "baking",
    description: {
      en: "Posts about baking techniques, recipes, and tips",
      es: "Publicaciones sobre técnicas de hornear, recetas y consejos",
      ca: "Publicacions sobre tècniques de forner, receptes i consells",
    },
  },
  bun: {
    slug: "bun",
    description: {
      en: "Posts about Bun runtime, its features, and how to use it",
      es: "Publicaciones sobre el runtime Bun, sus características y cómo usarlo",
      ca: "Publicacions sobre el runtime Bun, les seves característiques i com utilitzar-lo",
    },
  },
  chocolate: {
    slug: "chocolate",
    description: {
      en: "Posts about chocolate in recipes and baking",
      es: "Publicaciones sobre el chocolate en recetas y horneados",
      ca: "Publicacions sobre el xocolata en receptes i forners",
    },
  },
  cli: {
    slug: "cli",
    description: {
      en: "Posts about command-line tools, CLI development, and terminal workflows",
      es: "Publicaciones sobre herramientas de línea de comandos, desarrollo de CLI y flujos de trabajo de terminal",
      ca: "Publicacions sobre eines de línia d'ordres, desenvolupament de CLI i fluxos de treball de terminal",
    },
  },
  cookies: {
    slug: "cookies",
    description: {
      en: "Posts about cookie recipes and baking tips",
      es: "Publicaciones sobre recetas de galletas y consejos de horneado",
      ca: "Publicacions sobre receptes de galetes i consells de forner",
    },
  },
  deno: {
    slug: "deno",
    description: {
      en: "Posts about Deno runtime, its features, and how to use it",
      es: "Publicaciones sobre el runtime Deno, sus características y cómo usarlo",
      ca: "Publicacions sobre el runtime Deno, les seves característiques i com utilitzar-lo",
    },
  },
  dessert: {
    slug: "dessert",
    description: {
      en: "Posts about dessert recipes and sweet treats",
      es: "Publicaciones sobre recetas de postres y dulces",
      ca: "Publicacions sobre receptes de postres i dolços",
    },
  },
  "developer-tools": {
    slug: "developer-tools",
    description: {
      en: "Posts about developer tools, productivity, and workflows",
      es: "Publicaciones sobre herramientas para desarrolladores, productividad y flujos de trabajo",
      ca: "Publicacions sobre eines per a desenvolupadors, productivitat i fluxos de treball",
    },
  },
  gsoc: {
    slug: "gsoc",
    description: {
      en: "Posts about Google Summer of Code experience and projects",
      es: "Publicaciones sobre la experiencia en Google Summer of Code y proyectos",
      ca: "Publicacions sobre l'experiència a Google Summer of Code i projectes",
    },
  },
  javascript: {
    slug: "javascript",
    description: {
      en: "Posts about JavaScript language features, patterns, and best practices",
      es: "Publicaciones sobre características del lenguaje JavaScript, patrones y mejores prácticas",
      ca: "Publicacions sobre característiques del llenguatge JavaScript, patrons i millors pràctiques",
    },
  },
  mvp: {
    slug: "mvp",
    description: {
      en: "Posts about Minimum Viable Product strategy and development",
      es: "Publicaciones sobre estrategia y desarrollo de Producto Mínimo Viable",
      ca: "Publicacions sobre estratègia i desenvolupament de Producte Mínim Viable",
    },
  },
  "node-js": {
    slug: "node-js",
    description: {
      en: "Posts about Node.js runtime, APIs, and server-side JavaScript",
      es: "Publicaciones sobre el runtime Node.js, APIs y JavaScript del lado del servidor",
      ca: "Publicacions sobre el runtime Node.js, APIs i JavaScript del costat del servidor",
    },
  },
  "open-source": {
    slug: "open-source",
    description: {
      en: "Posts about open source software, contributions, and community",
      es: "Publicaciones sobre software de código abierto, contribuciones y comunidad",
      ca: "Publicacions sobre programari de codi obert, contribucions i comunitat",
    },
  },
  patterns: {
    slug: "patterns",
    description: {
      en: "Posts about software design patterns and architectural patterns",
      es: "Publicaciones sobre patrones de diseño de software y patrones arquitectónicos",
      ca: "Publicacions sobre patrons de disseny de programari i patrons arquitectònics",
    },
  },
  performance: {
    slug: "performance",
    description: {
      en: "Posts about web performance, optimization techniques, and benchmarks",
      es: "Publicaciones sobre rendimiento web, técnicas de optimización y comparativas",
      ca: "Publicacions sobre rendiment web, tècniques d'optimització i comparatives",
    },
  },
  pie: {
    slug: "pie",
    description: {
      en: "Posts about pie recipes and baking tips",
      es: "Publicaciones sobre recetas de pasteles y consejos de horneado",
      ca: "Publicacions sobre receptes de pastissos i consells de forner",
    },
  },
  react: {
    slug: "react",
    description: {
      en: "Posts about React framework, hooks, and component development",
      es: "Publicaciones sobre el framework React, hooks y desarrollo de componentes",
      ca: "Publicacions sobre el framework React, hooks i desenvolupament de components",
    },
  },
  redux: {
    slug: "redux",
    description: {
      en: "Posts about Redux state management and patterns",
      es: "Publicaciones sobre gestión de estado Redux y patrones",
      ca: "Publicacions sobre gestió d'estat Redux i patrons",
    },
  },
  security: {
    slug: "security",
    description: {
      en: "Posts about web security, best practices, and vulnerability prevention",
      es: "Publicaciones sobre seguridad web, mejores prácticas y prevención de vulnerabilidades",
      ca: "Publicacions sobre seguretat web, millors pràctiques i prevenció de vulnerabilitats",
    },
  },
  "service-workers": {
    slug: "service-workers",
    description: {
      en: "Posts about Service Workers, PWA, and offline functionality",
      es: "Publicaciones sobre Service Workers, PWA y funcionalidad sin conexión",
      ca: "Publicacions sobre Service Workers, PWA i funcionalitat fora de línia",
    },
  },
  "software-engineering": {
    slug: "software-engineering",
    description: {
      en: "Posts about software engineering practices, principles, and methodologies",
      es: "Publicaciones sobre prácticas de ingeniería de software, principios y metodologías",
      ca: "Publicacions sobre pràctiques d'enginyeria de programari, principis i metodologies",
    },
  },
  typescript: {
    slug: "typescript",
    description: {
      en: "Posts about TypeScript language, types, and tooling",
      es: "Publicaciones sobre el lenguaje TypeScript, tipos y herramientas",
      ca: "Publicacions sobre el llenguatge TypeScript, tipus i eines",
    },
  },
  webrtc: {
    slug: "webrtc",
    description: {
      en: "Posts about WebRTC, real-time communication, and peer-to-peer connections",
      es: "Publicaciones sobre WebRTC, comunicación en tiempo real y conexiones peer-to-peer",
      ca: "Publicacions sobre WebRTC, comunicació en temps real i connexions peer-to-peer",
    },
  },
};

/**
 * Gets the localized description for a tag.
 *
 * @param tagSlug - The URL-friendly slug of the tag (e.g., "node-js")
 * @param lang - Language code ("en", "es", "ca"). Defaults to "en"
 * @returns The localized description for the tag, or null if not found
 *
 * @example
 * getTagDescription("react", "en") // "Posts about React framework, hooks, and component development"
 * getTagDescription("react", "es") // "Publicaciones sobre el framework React, hooks y desarrollo de componentes"
 */
export function getTagDescription(
  tagSlug: string,
  lang: string = "en",
): string | null {
  const metadata = TAG_METADATA[tagSlug];
  if (!metadata) {
    return null;
  }
  return metadata.description[lang] || metadata.description.en || null;
}
