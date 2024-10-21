import { defineConfig, envField } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind({ applyBaseStyles: false })],
  experimental: {
    env: {
      schema: {
        PRISMIC_REPO_NAME: envField.string({
          context: "server",
          access: "secret",
          optional: false,
        }),
      },
    },
  },
});
