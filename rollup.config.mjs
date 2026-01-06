import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import nodeExternals from 'rollup-plugin-node-externals';
import typescript from 'rollup-plugin-typescript2';

const config = [
  {
    input: 'src/index.ts',
    preserveEntrySignatures: 'exports-only',
    output: [
      {
        dir: './dist/esm',
        format: 'es',
        preserveModules: true,
        preserveModulesRoot: 'src',
        sourcemap: true,
      },
      {
        dir: './dist/cjs',
        format: 'cjs',
        preserveModules: true,
        preserveModulesRoot: 'src',
        sourcemap: true,
      },
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.build.json',
        useTsconfigDeclarationDir: true,
      }),
      nodeExternals({
        exclude: [/^@webeach\//],
      }),
    ],
    external: ['react/jsx-runtime'],
  },
];

export default config;
