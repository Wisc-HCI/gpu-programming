import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import string from 'vite-plugin-string';
import svgr from "vite-plugin-svgr";
import { comlink } from "vite-plugin-comlink";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    comlink(),
    svgr(),
    string({
      // Add file extensions as needed
      include: ["**/*.urdf","**/*.xacro",]
    }),
  ],
  worker: {
    format: 'es',
    plugins: [
      react(),
      comlink()
    ]
  },
  base: "/",
  assetsInclude: ["**/*.gltf", "**/*.glb", "**/*.urdf","**/*.xacro"],
})
