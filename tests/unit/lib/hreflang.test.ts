import { describe, it, expect } from "vitest";
import {
  buildPostHreflangLinks,
  buildHomepageHreflangLinks,
  buildProjectsHreflangLinks,
  buildTagHreflangLinks,
  buildCanonicalLink,
} from "~/lib/hreflang";

const BASE_URL = "https://magarcia.io";

describe("buildPostHreflangLinks", () => {
  it("returns hreflang links only for available locales", () => {
    const links = buildPostHreflangLinks("my-post", ["en", "es"]);
    const hrefLangs = links.map((l) => l.hrefLang);
    expect(hrefLangs).toContain("en");
    expect(hrefLangs).toContain("es");
    expect(hrefLangs).not.toContain("ca");
  });

  it("includes x-default pointing to English URL when English is available", () => {
    const links = buildPostHreflangLinks("my-post", ["en", "es"]);
    const xDefault = links.find((l) => l.hrefLang === "x-default");
    expect(xDefault).toBeDefined();
    expect(xDefault?.href).toBe(`${BASE_URL}/my-post/`);
  });

  it("omits x-default when English is not available", () => {
    const links = buildPostHreflangLinks("my-post", ["es", "ca"]);
    const xDefault = links.find((l) => l.hrefLang === "x-default");
    expect(xDefault).toBeUndefined();
  });

  it("builds correct URLs for each locale", () => {
    const links = buildPostHreflangLinks("my-post", ["en", "es", "ca"]);
    expect(links.find((l) => l.hrefLang === "en")?.href).toBe(
      `${BASE_URL}/my-post/`,
    );
    expect(links.find((l) => l.hrefLang === "es")?.href).toBe(
      `${BASE_URL}/es/my-post/`,
    );
    expect(links.find((l) => l.hrefLang === "ca")?.href).toBe(
      `${BASE_URL}/ca/my-post/`,
    );
  });

  it("returns links with correct rel and tagName", () => {
    const links = buildPostHreflangLinks("my-post", ["en"]);
    for (const link of links) {
      expect(link.tagName).toBe("link");
      expect(link.rel).toBe("alternate");
    }
  });
});

describe("buildHomepageHreflangLinks", () => {
  it("returns links for all supported locales plus x-default", () => {
    const links = buildHomepageHreflangLinks();
    const hrefLangs = links.map((l) => l.hrefLang);
    expect(hrefLangs).toContain("en");
    expect(hrefLangs).toContain("es");
    expect(hrefLangs).toContain("ca");
    expect(hrefLangs).toContain("x-default");
  });

  it("x-default points to the root URL", () => {
    const links = buildHomepageHreflangLinks();
    const xDefault = links.find((l) => l.hrefLang === "x-default");
    expect(xDefault?.href).toBe(`${BASE_URL}/`);
  });
});

describe("buildProjectsHreflangLinks", () => {
  it("returns links for all supported locales", () => {
    const links = buildProjectsHreflangLinks();
    const hrefLangs = links.map((l) => l.hrefLang);
    expect(hrefLangs).toContain("en");
    expect(hrefLangs).toContain("es");
    expect(hrefLangs).toContain("ca");
  });

  it("includes x-default pointing to English projects URL", () => {
    const links = buildProjectsHreflangLinks();
    const xDefault = links.find((l) => l.hrefLang === "x-default");
    expect(xDefault).toBeDefined();
    expect(xDefault?.href).toBe(`${BASE_URL}/projects/`);
  });

  it("builds correct URLs for each locale", () => {
    const links = buildProjectsHreflangLinks();
    expect(links.find((l) => l.hrefLang === "en")?.href).toBe(
      `${BASE_URL}/projects/`,
    );
    expect(links.find((l) => l.hrefLang === "es")?.href).toBe(
      `${BASE_URL}/es/projects/`,
    );
    expect(links.find((l) => l.hrefLang === "ca")?.href).toBe(
      `${BASE_URL}/ca/projects/`,
    );
  });
});

describe("buildTagHreflangLinks", () => {
  it("returns links for all supported locales plus x-default", () => {
    const links = buildTagHreflangLinks("javascript");
    const hrefLangs = links.map((l) => l.hrefLang);
    expect(hrefLangs).toContain("en");
    expect(hrefLangs).toContain("es");
    expect(hrefLangs).toContain("ca");
    expect(hrefLangs).toContain("x-default");
  });

  it("x-default points to the English tag URL", () => {
    const links = buildTagHreflangLinks("javascript");
    const xDefault = links.find((l) => l.hrefLang === "x-default");
    expect(xDefault?.href).toBe(`${BASE_URL}/tags/javascript/`);
  });

  it("slugifies the tag", () => {
    const links = buildTagHreflangLinks("Node.js");
    expect(links.find((l) => l.hrefLang === "en")?.href).toBe(
      `${BASE_URL}/tags/node-js/`,
    );
  });
});

describe("buildCanonicalLink", () => {
  it("returns a canonical link with full URL", () => {
    const link = buildCanonicalLink("/my-post/");
    expect(link.tagName).toBe("link");
    expect(link.rel).toBe("canonical");
    expect(link.href).toBe(`${BASE_URL}/my-post/`);
  });

  it("handles root path", () => {
    const link = buildCanonicalLink("/");
    expect(link.href).toBe(`${BASE_URL}/`);
  });
});
