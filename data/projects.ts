export interface Project {
  name: string;
  url: string;
  description: Record<string, string>;
  featured?: boolean;
  language?: string;
  archived?: boolean;
}

export const projects: Project[] = [
  {
    name: "Palabreja",
    url: "https://palabreja.com",
    description: {
      en: "Spanish word game where you form words using letters with a center letter",
      es: "Juego de palabras en español donde formas palabras usando letras con una letra central",
      ca: "Joc de paraules en espanyol on formes paraules usant lletres amb una lletra central",
    },
    featured: true,
  },
  {
    name: "mcp-server-giphy",
    url: "https://github.com/magarcia/mcp-server-giphy",
    description: {
      en: "Giphy integration for Model Context Protocol (MCP)",
      es: "Integración de Giphy para Model Context Protocol (MCP)",
      ca: "Integració de Giphy per a Model Context Protocol (MCP)",
    },
    featured: true,
    language: "TypeScript",
  },
  {
    name: "QWBP",
    url: "https://github.com/magarcia/qwbp",
    description: {
      en: "QR-WebRTC Bootstrap Protocol - Serverless WebRTC signaling via QR codes",
      es: "Protocolo de arranque QR-WebRTC - Señalización WebRTC sin servidor mediante códigos QR",
      ca: "Protocol d'arrencada QR-WebRTC - Senyalització WebRTC sense servidor mitjançant codis QR",
    },
    featured: true,
    language: "TypeScript",
  },
  {
    name: "cross-keychain",
    url: "https://github.com/magarcia/cross-keychain",
    description: {
      en: "Cross-platform secret storage for Node.js applications and CLI usage",
      es: "Almacenamiento seguro multiplataforma para aplicaciones Node.js y uso en CLI",
      ca: "Emmagatzematge segur multiplataforma per a aplicacions Node.js i ús en CLI",
    },
    language: "TypeScript",
  },
  {
    name: "granola-cli",
    url: "https://github.com/magarcia/granola-cli",
    description: {
      en: "Command-line interface for Granola.ai meeting notes",
      es: "Interfaz de línea de comandos para notas de reuniones de Granola.ai",
      ca: "Interfície de línia de comandes per a notes de reunions de Granola.ai",
    },
    language: "TypeScript",
  },
  {
    name: "python-x256",
    url: "https://github.com/magarcia/python-x256",
    description: {
      en: "Find the nearest xterm 256 color index for an RGB value",
      es: "Encuentra el índice de color xterm 256 más cercano para un valor RGB",
      ca: "Troba l'índex de color xterm 256 més proper per a un valor RGB",
    },
    language: "Python",
  },
  {
    name: "pycture-tube",
    url: "https://github.com/magarcia/pycture-tube",
    description: {
      en: "Render images on the terminal with xterm 256 colors",
      es: "Renderiza imágenes en la terminal con colores xterm 256",
      ca: "Renderitza imatges a la terminal amb colors xterm 256",
    },
    language: "Python",
    archived: true,
  },
  {
    name: "cuentica-sdk",
    url: "https://github.com/magarcia/cuentica-sdk",
    description: {
      en: "TypeScript SDK for Cuéntica's API - accounting and tax management",
      es: "SDK en TypeScript para la API de Cuéntica - contabilidad y gestión fiscal",
      ca: "SDK en TypeScript per a l'API de Cuéntica - comptabilitat i gestió fiscal",
    },
    language: "TypeScript",
  },
];
