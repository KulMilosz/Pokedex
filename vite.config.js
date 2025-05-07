import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      // Ignoruj zmiany w pliku db.json
      ignored: ["**/data/db.json"],
    },
  },
});
