import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: 'https://curtismurray.tech',
  // résumé / papers / projects merged into one page ("the grind"); keep the old
  // URLs alive (emits meta-refresh redirect pages in static output).
  redirects: {
    "/resume": "/the-grind",
    "/publications": "/the-grind",
    "/projects": "/the-grind",
  },
  integrations: [tailwind(), react()],
  vite: {
    ssr: {
      noExternal: ["react-icons"],
    },
  },
});
