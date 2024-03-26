import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import string from 'vite-plugin-string';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), 
    string({
      // Add file extensions as needed
      include: ["**/*.urdf","**/*.xacro",]
    }),
  ],
  assetsInclude: ["**/*.gltf", "**/*.glb", "**/*.urdf","**/*.xacro"],
})
