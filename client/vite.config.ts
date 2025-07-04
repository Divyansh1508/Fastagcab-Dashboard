import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");

  // For development proxy, use localhost
  const devApiTarget = "http://localhost:5000";

  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ["lucide-react"],
    },
    define: {
      // Only set this if explicitly provided in environment
      ...(env.VITE_API_BASE_URL && {
        "import.meta.env.VITE_API_BASE_URL": JSON.stringify(
          env.VITE_API_BASE_URL
        ),
      }),
    },
    server: {
      proxy: {
        "/api": {
          target: devApiTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
