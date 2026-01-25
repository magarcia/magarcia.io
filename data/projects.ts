export interface Project {
  name: string;
  url: string;
  description: Record<string, string>;
  featured?: boolean;
  stars?: number;
  language?: string;
  archived?: boolean;
}

// Featured projects shown on the homepage
export const featuredProjects: Project[] = [
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
    stars: 26,
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
    stars: 3,
    language: "TypeScript",
  },
];

// All projects for the projects page
export const allProjects: Project[] = [
  ...featuredProjects,
  {
    name: "cross-keychain",
    url: "https://github.com/magarcia/cross-keychain",
    description: {
      en: "Cross-platform secret storage for Node.js applications and CLI usage",
      es: "Almacenamiento seguro multiplataforma para aplicaciones Node.js y uso en CLI",
      ca: "Emmagatzematge segur multiplataforma per a aplicacions Node.js i ús en CLI",
    },
    stars: 5,
    language: "TypeScript",
  },
  {
    name: "gitingest",
    url: "https://github.com/magarcia/gitingest",
    description: {
      en: "CLI tool to turn any Git repository into a text digest for LLMs",
      es: "Herramienta CLI para convertir cualquier repositorio Git en un resumen de texto para LLMs",
      ca: "Eina CLI per convertir qualsevol repositori Git en un resum de text per a LLMs",
    },
    stars: 5,
    language: "JavaScript",
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
    stars: 25,
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
    stars: 5,
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
    stars: 1,
    language: "TypeScript",
  },
  {
    name: "generator-angular2-webpack-starter",
    url: "https://github.com/magarcia/generator-angular2-webpack-starter",
    description: {
      en: "Yeoman generator for Angular 2 with Webpack",
      es: "Generador Yeoman para Angular 2 con Webpack",
      ca: "Generador Yeoman per a Angular 2 amb Webpack",
    },
    stars: 26,
    language: "JavaScript",
    archived: true,
  },
  {
    name: "todomvc-redux-starter-kit",
    url: "https://github.com/magarcia/todomvc-redux-starter-kit",
    description: {
      en: "TodoMVC implementation with Redux Starter Kit",
      es: "Implementación de TodoMVC con Redux Starter Kit",
      ca: "Implementació de TodoMVC amb Redux Starter Kit",
    },
    stars: 11,
    language: "JavaScript",
    archived: true,
  },
  {
    name: "react-pokedex",
    url: "https://github.com/magarcia/react-pokedex",
    description: {
      en: "Pokédex application built with React and PokéAPI",
      es: "Aplicación Pokédex construida con React y PokéAPI",
      ca: "Aplicació Pokédex construïda amb React i PokéAPI",
    },
    stars: 7,
    language: "JavaScript",
    archived: true,
  },
  {
    name: "vim-angular2-snippets",
    url: "https://github.com/magarcia/vim-angular2-snippets",
    description: {
      en: "Angular 2 TypeScript code snippets for Vim",
      es: "Fragmentos de código Angular 2 TypeScript para Vim",
      ca: "Fragments de codi Angular 2 TypeScript per a Vim",
    },
    stars: 12,
    language: "Vim Script",
    archived: true,
  },
  {
    name: "wordle",
    url: "https://github.com/magarcia/wordle",
    description: {
      en: "Personal implementation of the word-guessing game",
      es: "Implementación personal del juego de adivinar palabras",
      ca: "Implementació personal del joc d'endevinar paraules",
    },
    stars: 2,
    language: "JavaScript",
  },
];

// For backwards compatibility
export const projects = featuredProjects;
