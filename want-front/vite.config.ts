import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  console.log(env.VITE_BASE_URL);

  return {
    plugins: [
      react(),
      svgr({
        svgrOptions: {
          exportType: "default",
          ref: true,
          svgo: false,
          titleProp: true,
        },
        include: "**/*.svg",
      }),
    ],
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: "./src/setupTests.ts",
      coverage: {
        provider: "istanbul",
        reporter: ["text", "html"],
        reportsDirectory: "coverage", // npx vitest run Toggle --coverage
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    base: env.VITE_BASE_URL,
    // base: mode === "production" ? "/web-context/" : "/",
    // base: "/web-context/",
  };
});
