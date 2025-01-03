import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  manifest: {
    permissions: ["storage", "tabs"],
    host_permissions: ["https://*/*", "http://*/*"],
    name: "NlPeek",
    description: "AI-powered hyperlink summarization tool"
  },
});
