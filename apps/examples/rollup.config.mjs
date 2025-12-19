import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "rollup";
import esbuild from "rollup-plugin-esbuild";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = __dirname;
const externalModules = ["webuntis-api", "webuntis-api/types.schema"];
const srcDir = path.join(rootDir, "src");
const distDir = path.join(rootDir, "dist");

export default defineConfig({
  input: {
    "01-basic-example": path.join(srcDir, "01-basic-example.ts"),
    "02-intermediate-example": path.join(srcDir, "02-intermediate-example.ts"),
    "03-comprehensive-example": path.join(srcDir, "03-comprehensive-example.ts"),
    config: path.join(srcDir, "config.ts"),
    "runtime-type-check": path.join(srcDir, "runtime-type-check.ts"),
  },
  plugins: [esbuild()],
  treeshake: true,
  external: (id) => {
    if (externalModules.includes(id)) return true;
    return !/^[./]/.test(id);
  },
  output: [
    {
      dir: distDir,
      entryFileNames: "[name].mjs",
      format: "es",
      sourcemap: true,
    },
    {
      dir: distDir,
      entryFileNames: "[name].js",
      format: "cjs",
      sourcemap: true,
    },
  ],
});
