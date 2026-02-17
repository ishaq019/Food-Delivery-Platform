import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/Food-Delivery-Platform/",  // custom domain (syedishaq.me) serves from root
});
