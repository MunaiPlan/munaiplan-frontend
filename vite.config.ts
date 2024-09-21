// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import tailwindcss from 'tailwindcss';
// import autoprefixer from 'autoprefixer';
// import dns from 'node:dns'

// dns.setDefaultResultOrder('verbatim')

// export default defineConfig({
//   server: {
//     proxy: {
//       '/api/v1': {
//         target: 'http://localhost:8000',
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//     port: 8080,
//     strictPort: true,
//     host: true,
//     origin: "http://0.0.0.0:8080",
//   },
//   plugins: [
//     react(),
//   ],
//   css: {
//     postcss: {
//       plugins: [tailwindcss, autoprefixer],
//     },
//   },
//   preview: {
//     port: 8080,
//     strictPort: true,
//    },
// });