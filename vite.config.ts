import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import employeeAccess from "./server/employee-access.mjs";

const employeeApi = {
  name: "employee-api",
  configureServer(server: import("vite").ViteDevServer) {
    server.middlewares.use((req, res, next) => {
      if (req.url?.split("?")[0] === "/api/acesso-funcionario") {
        void employeeAccess(req, res);
      } else next();
    });
  },
  configurePreviewServer(server: import("vite").PreviewServer) {
    server.middlewares.use((req, res, next) => {
      if (req.url?.split("?")[0] === "/api/acesso-funcionario") {
        void employeeAccess(req, res);
      } else next();
    });
  },
};

export default defineConfig({
  plugins: [employeeApi, react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "https://challeng-sprin4-java.onrender.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
