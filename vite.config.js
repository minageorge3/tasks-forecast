import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/tasks-forecast/", // الاسم الصحيح بتاعك هنا
});