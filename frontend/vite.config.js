import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // ...existing config
  server: {
    port: 5173,
    strictPort: true, // agar 5173 busy hai to error dega, auto-switch nahi karega
  },
});
