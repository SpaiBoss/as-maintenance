// @ts-check
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import { site } from "./src/config/site.ts";

export default defineConfig({
  site: site.url,
  trailingSlash: "always",
  build: { format: "directory" },
  integrations: [
    sitemap({
      filter: (page) => {
        const url = page.toLowerCase();
        if (url.includes("/404")) return false;
        if (!site.features.gallery && url.includes("/gallery")) return false;
        return true;
      },
    }),
  ],
});
