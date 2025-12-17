import { defineConfig } from 'rollup';
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';

const name = 'webuntis';

// Add any packages you explicitly want to inline (e.g. optional dependencies) here.
const inlineDeps = new Set([]);

const bundle = (config) => ({
    ...config,
    input: config.input ?? 'src/index.ts',
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
                file: `./dist/${name}.js`,
                format: 'cjs',
                sourcemap: true,
                exports: 'named',
            },
            {
                file: `./dist/${name}.mjs`,
                format: 'es',
                sourcemap: true,
            },
        ],
    }),
    bundle({
        plugins: [dts()],
        output: {
            file: `./dist/${name}.d.ts`,
            format: 'es',
        },
    }),
    bundle({
        input: {
            'examples/01-basic-example': 'examples/01-basic-example.ts',
            'examples/02-intermediate-example': 'examples/02-intermediate-example.ts',
            'examples/03-comprehensive-example': 'examples/03-comprehensive-example.ts',
            'examples/config': 'examples/config.ts',
            'examples/runtime-type-check': 'examples/runtime-type-check.ts',
        },
        plugins: [esbuild()],
        output: [
            {
                dir: './dist',
                entryFileNames: '[name].mjs',
                format: 'es',
                sourcemap: true,
            },
            {
                dir: './dist',
                entryFileNames: '[name].js',
                format: 'cjs',
                sourcemap: true,
            },
        ],
    }),
]);
