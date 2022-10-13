import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react";
import path from "path";
import pkg from "./package.json";

export default defineConfig({
  plugins: [reactRefresh()],
  resolve: {
    alias: [
      {
        find: /@\/(.+)/,
        replacement: path.resolve(__dirname, "./src/$1"),
      },
    ],
  },
  define: {
    __APP_VERSION__: `"${pkg.version}"`,
  },
  server: {
    https: {
      key: "./dev/localhost-key.pem",
      cert: "./dev/localhost.pem",
    },
  },
});
