import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Durante `npm run dev`, las peticiones a /api/* se redirigen
// a `vercel dev` (puerto 3000) para que puedas probar la función
// serverless en local. En producción, Vercel las sirve directamente.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
