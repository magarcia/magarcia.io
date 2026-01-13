import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: [
      "tests/unit/rss-validation.test.ts",
      "tests/unit/scripts/sitemap.test.ts",
    ],
    setupFiles: ["./tests/unit/setup-build.ts"],
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./"),
      "@": path.resolve(__dirname, "./"),
    },
  },
});
