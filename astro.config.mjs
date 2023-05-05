import { defineConfig } from "astro/config";

// https://astro.build/config
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
import partytown from "@astrojs/partytown";

// https://astro.build/config
import image from "@astrojs/image";

// https://astro.build/config
export default defineConfig({
  site: "https://cucoders.dev/",
  integrations: [
    tailwind(),
    sitemap({
      serialize(item) {
        if (/^https:\/\/cucoders\.dev\/dev\/[^\/]+\/[^\/]+$/.test(item.url)) {
          return undefined;
        }
        return item;
      },
    }),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
    image(),
  ],
});
