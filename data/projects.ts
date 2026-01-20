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
    name: "QWBP",
    url: "https://github.com/magarcia/qwbp",
    description: {
      en: "QR-WebRTC Bootstrap Protocol - Serverless WebRTC signaling via QR codes",
      es: "Protocolo de arranque QR-WebRTC - Señalización WebRTC sin servidor mediante códigos QR",
      ca: "Protocol d'arrencada QR-WebRTC - Senyalització WebRTC sense servidor mitjançant codis QR",
    },
  },
];
