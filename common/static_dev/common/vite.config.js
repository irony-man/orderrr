import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from "path";
import { fileURLToPath, URL } from "url";

// https://vitejs.dev/config/
export default defineConfig({
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  plugins: [react()],
  base: "/static/common/",
  build: {
    manifest: true,
    ssrManifest: true,
    cssCodeSplit: true,
    sourcemap: process.env.NODE_ENV !== "production",
    rollupOptions: {
      input: {
        main: resolve("./src/main.jsx"),
      },
    },
    minify: false,
    outDir: resolve("../../static/common/"),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
