import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  modules: ["@wxt-dev/module-react"],
  manifest: {
    name: "LinearVoice",
    description:
      "Privacy-first voice commands for Linear.app (Chrome 113+ / Edge 113+)",
    minimum_chrome_version: "113",
    permissions: [
      "activeTab",
      "storage",
      "scripting",
      "offscreen",
      "notifications",
    ],
    host_permissions: ["https://linear.app/*", "https://huggingface.co/*"],
    content_security_policy: {
      extension_pages:
        "script-src 'self' 'wasm-unsafe-eval'; object-src 'self';",
    },
    web_accessible_resources: [
      {
        resources: ["chunks/*.js", "wasm/*"],
        matches: ["<all_urls>"],
      },
    ],
  },
  vite: () => ({
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }),
});
