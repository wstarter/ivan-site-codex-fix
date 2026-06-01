/**
 * Dedicated WordPress build config.
 *
 * Bypasses the TanStack Start development config, which injects the SSR client
 * entry with document-level hydration. Builds a plain SPA
 * bundle that mounts into #root inside the WordPress theme shell.
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  // Relative base so asset URLs in the built JS/CSS resolve relative to the
  // bundle location inside the WordPress theme
  // (/wp-content/themes/ivan-sedative-theme/assets/app/assets/...), not the
  // site root. Without this, Vite emits absolute "/assets/..." which 404s
  // under WordPress.
  base: "./",
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "dist-wp",
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: {
        "wp-entry": resolve(__dirname, "src/wp-entry.tsx"),
      },
      output: {
        entryFileNames: "assets/index-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
});
