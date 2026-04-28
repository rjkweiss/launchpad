import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Change '/launchpad/' to match your GitHub repo name
  base: "/launchpad/",
});
