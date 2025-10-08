import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/",
  publicDir: "public",
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    open: true
  },
  build: {
    rollupOptions: {
      input: mode === 'development' ? 'index.dev.html' : 'index.html',
    }
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
