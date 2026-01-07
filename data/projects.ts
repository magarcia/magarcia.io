export interface Project {
  name: string;
  url: string;
  description: Record<string, string>;
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
  },
  {
    name: "mcp-server-giphy",
    url: "https://github.com/magarcia/mcp-server-giphy",
    description: {
      en: "Giphy integration for Model Context Protocol (MCP)",
      es: "Integración de Giphy para Model Context Protocol (MCP)",
      ca: "Integració de Giphy per a Model Context Protocol (MCP)",
    },
  },
  {
    name: "python-x256",
    url: "https://github.com/magarcia/python-x256",
    description: {
      en: "Find the nearest xterm 256 color index for an RGB value",
      es: "Encuentra el índice de color xterm 256 más cercano para un valor RGB",
      ca: "Troba l'índex de color xterm 256 més proper per a un valor RGB",
    },
  },
];
