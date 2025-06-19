import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import { name } from "./package.json";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: `/${name}/`,
});
