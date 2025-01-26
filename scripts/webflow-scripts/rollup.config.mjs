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
      banner:
        '/*!\n* Hubspot Submit v1.1.0\n* Copyright (c) 2025 Devflow Studio, LLC\n* Licensed under MIT\n*/',
      format: 'iife',
      sourcemap: true,
      preserveModules: false,
      compact: true,
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
