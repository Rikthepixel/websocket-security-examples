import { defineConfig } from 'vite';
import react from "@vitejs/plugin-react";

export default defineConfig({
    build: {
        outDir: "../dist/client",
        emptyOutDir: true,
        assetsDir: "public/assets"
    },

    plugins: [react()]
});