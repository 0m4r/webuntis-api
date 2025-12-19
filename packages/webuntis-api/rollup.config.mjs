import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "rollup";
import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = __dirname;
const distDir = path.join(rootDir, "dist");
const name = "webuntis-api";

// Add any packages you explicitly want to inline (e.g. optional dependencies) here.
const inlineDeps = new Set([]);

const bundle = (config) => ({
  ...config,
  input: config.input ?? path.join(rootDir, "src/index.ts"),
  treeshake: true,
  external: (id) => {
    if (inlineDeps.has(id)) return false;
    return !/^[./]/.test(id);
  },
});

export default defineConfig([
  bundle({
    plugins: [esbuild()],
    output: [
      {
        file: path.join(distDir, `${name}.js`),
        format: "cjs",
        sourcemap: true,
        exports: "named",
      },
      {
        file: path.join(distDir, `${name}.mjs`),
        format: "es",
        sourcemap: true,
      },
    ],
  }),
  bundle({
    plugins: [dts()],
    output: {
      file: path.join(distDir, `${name}.d.ts`),
      format: "es",
    },
  }),
]);
