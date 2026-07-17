import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(root, "src"),
      "next/link": path.resolve(root, "src/shims/next-link.tsx"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
