import fs from "fs";
import path from "path";
import satori from "satori";
import sharp from "sharp";
import { getAllSlugs, getFileBySlug } from "../lib/blog";
import { siteMetadata } from "../blog.config";

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const OUTPUT_DIR = "./build/client/og";
const PUBLIC_OG_DIR = "./public/og";

async function loadGoogleFont(
  family: string,
  weight: number,
): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}&display=swap`;

  // Use older user-agent to get TTF instead of WOFF2 (Satori only supports TTF/OTF)
  const css = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0",
    },
  }).then((res) => res.text());

  // Match TTF or WOFF URL
  const fontUrl = css.match(
    /src: url\(([^)]+)\) format\(['"](?:truetype|woff)['"]\)/,
  )?.[1];

  if (!fontUrl) {
    throw new Error(`Could not find font URL for ${family}`);
  }

  return fetch(fontUrl).then((res) => res.arrayBuffer());
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

interface OgTemplateProps {
  title: string;
  date: string;
  author: string;
}

function OgTemplate({ title, date, author }: OgTemplateProps) {
  return {
    type: "div",
    props: {
      style: {
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FAFAFA",
        padding: "60px 80px",
      },
      children: [
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              gap: "24px",
            },
            children: [
              {
                type: "h1",
                props: {
                  style: {
                    fontSize: title.length > 60 ? "48px" : "56px",
                    fontFamily: "Newsreader",
                    fontWeight: 400,
                    color: "#1A1A1A",
                    textAlign: "center",
                    lineHeight: 1.2,
                    margin: 0,
                    maxWidth: "1000px",
                  },
                  children: title,
                },
              },
              {
                type: "p",
                props: {
                  style: {
                    fontSize: "24px",
                    fontFamily: "Inter",
                    fontWeight: 400,
                    color: "#666666",
                    margin: 0,
                  },
                  children: formatDate(date),
                },
              },
            ],
          },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              gap: "12px",
              borderTop: "1px solid #E5E5E5",
              paddingTop: "32px",
              width: "100%",
              justifyContent: "center",
            },
            children: [
              {
                type: "span",
                props: {
                  style: {
                    fontSize: "20px",
                    fontFamily: "Inter",
                    fontWeight: 500,
                    color: "#1A1A1A",
                  },
                  children: author,
                },
              },
              {
                type: "span",
                props: {
                  style: {
                    fontSize: "20px",
                    fontFamily: "Inter",
                    color: "#999999",
                  },
                  children: "·",
                },
              },
              {
                type: "span",
                props: {
                  style: {
                    fontSize: "20px",
                    fontFamily: "Inter",
                    fontWeight: 400,
                    color: "#666666",
                  },
                  children: "magarcia.io",
                },
              },
            ],
          },
        },
      ],
    },
  };
}

function DefaultOgTemplate() {
  return {
    type: "div",
    props: {
      style: {
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FAFAFA",
        padding: "60px 80px",
      },
      children: [
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
            },
            children: [
              {
                type: "h1",
                props: {
                  style: {
                    fontSize: "96px",
                    fontFamily: "Newsreader",
                    fontWeight: 400,
                    color: "#1A1A1A",
                    textAlign: "center",
                    lineHeight: 1.2,
                    margin: 0,
                  },
                  children: "magarcia",
                },
              },
            ],
          },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              borderTop: "1px solid #E5E5E5",
              paddingTop: "32px",
              width: "100%",
              justifyContent: "center",
            },
            children: [
              {
                type: "span",
                props: {
                  style: {
                    fontSize: "20px",
                    fontFamily: "Inter",
                    fontWeight: 400,
                    color: "#666666",
                  },
                  children: "magarcia.io",
                },
              },
            ],
          },
        },
      ],
    },
  };
}

async function generateOgImage(
  slug: string,
  fonts: { name: string; data: ArrayBuffer; weight: number }[],
): Promise<void> {
  const post = getFileBySlug("blog", slug, "en");
  const { frontMatter } = post;

  if (frontMatter.ogImage) {
    console.log(`⏭️  Skipping ${slug} (has custom ogImage)`);
    return;
  }

  const template = OgTemplate({
    title: frontMatter.title,
    date: frontMatter.date,
    author: siteMetadata.author.name,
  });

  const svg = await satori(template as React.ReactNode, {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts: fonts.map((font) => ({
      name: font.name,
      data: font.data,
      weight: font.weight as 400 | 500,
      style: "normal" as const,
    })),
  });

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  const outputPath = path.join(OUTPUT_DIR, `${slug}.png`);
  fs.writeFileSync(outputPath, png);
  console.log(`✅ Generated ${slug}.png`);
}

async function generateDefaultOgImage(
  fonts: { name: string; data: ArrayBuffer; weight: number }[],
): Promise<void> {
  const template = DefaultOgTemplate();

  const svg = await satori(template as React.ReactNode, {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts: fonts.map((font) => ({
      name: font.name,
      data: font.data,
      weight: font.weight as 400 | 500,
      style: "normal" as const,
    })),
  });

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  if (!fs.existsSync(PUBLIC_OG_DIR)) {
    fs.mkdirSync(PUBLIC_OG_DIR, { recursive: true });
  }

  const outputPath = path.join(PUBLIC_OG_DIR, "default.png");
  fs.writeFileSync(outputPath, png);
  console.log(`✅ Generated default.png`);
}

(async () => {
  console.log("🖼️  Generating OG images...\n");

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const [newsreaderRegular, interRegular, interMedium] = await Promise.all([
    loadGoogleFont("Newsreader", 400),
    loadGoogleFont("Inter", 400),
    loadGoogleFont("Inter", 500),
  ]);

  const fonts = [
    { name: "Newsreader", data: newsreaderRegular, weight: 400 },
    { name: "Inter", data: interRegular, weight: 400 },
    { name: "Inter", data: interMedium, weight: 500 },
  ];

  const slugs = getAllSlugs("blog");

  for (const slug of slugs) {
    try {
      await generateOgImage(slug, fonts);
    } catch (error) {
      console.error(`❌ Failed to generate OG image for ${slug}:`, error);
    }
  }

  console.log(`\n✅ OG image generation complete!`);

  console.log("\n🖼️  Generating default OG image...\n");
  await generateDefaultOgImage(fonts);
  console.log(`\n✅ Default OG image generated!`);
})();
