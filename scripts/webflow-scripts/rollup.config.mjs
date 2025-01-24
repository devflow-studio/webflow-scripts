import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'

export default {
  input: {
    'hello-world': 'src/hello-world/index.ts',
  },
  output: {
    dir: 'dist',
    entryFileNames: '[name]/index.js',
    format: 'iife',
    sourcemap: true,
    preserveModules: false,
  },
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      exclude: ['**/*.test.ts'],
    }),
    terser(),
  ],
}
