import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: {
      index: "src/index.ts",
      config: "src/config/index.ts",
    },
    format: ["esm"],
    dts: true,
    sourcemap: true,
    clean: true,
    external: ["react", "react-dom", "next"],
    esbuildPlugins: [
      {
        name: "externalize-client-boundary",
        setup(build) {
          build.onResolve({ filter: /^\.\.\/client\/index\.js$/ }, () => ({
            path: "./client.js",
            external: true,
          }));
        },
      },
    ],
  },
  {
    entry: {
      client: "src/client/index.ts",
    },
    format: ["esm"],
    dts: true,
    sourcemap: true,
    clean: false,
    banner: {
      js: '"use client";',
    },
    external: ["react", "react-dom", "next"],
  },
]);
