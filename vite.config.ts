import { defineConfig } from "vite";

// Served from https://oostler.github.io/mariella/
export default defineConfig({
  base: "/mariella/",
  build: {
    target: "es2022"
  }
});
