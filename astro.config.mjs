import { defineConfig } from "astro/config";

// https://astro.build/config
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
import partytown from "@astrojs/partytown";

import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  site: "https://cucoders.dev/",
  integrations: [
    tailwind(),
    svelte(),
    sitemap({
      serialize(item) {
        if (/.*cucoders\.dev\/dev\/[\w-]+\/[\w-]/.test(item.url)) {
          return undefined;
        }

        if (/.*empleos\/(\d{4}-\d{2}-\d{2})\/.*/.test(item.url)) {
          const date = item.url.split("/")[4];
          item.lastmod = new Date(date);
        }
        return item;
      },
    }),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
  ],
});
