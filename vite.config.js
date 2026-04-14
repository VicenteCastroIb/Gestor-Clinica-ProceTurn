import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// This component configure Vite, add "react" plugin for reading JSX correctly. Set default port in 3000 for development. For "Build" to production, make a directory "dist".
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: "dist",
  },
});