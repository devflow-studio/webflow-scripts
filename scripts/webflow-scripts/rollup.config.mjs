import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'

export default [
  {
    input: {
      'hello-world': 'src/hello-world/index.ts',
    },
    output: {
      dir: 'dist',
      entryFileNames: '[name]/index.js',
      name: 'HelloWorld',
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
  },
  {
    input: {
      'hubspot-submit': 'src/hubspot-submit/index.ts',
    },
    output: {
      dir: 'dist',
      entryFileNames: '[name]/index.js',
      name: 'HubspotSubmit',
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
  },
]
