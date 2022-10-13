import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react";
import path from "path";
import pkg from "./package.json";
// https://vitejs.dev/config/
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
      key: "/Users/aqeja/localhost-key.pem",
      cert: "/Users/aqeja/localhost.pem",
    },
  },
});
