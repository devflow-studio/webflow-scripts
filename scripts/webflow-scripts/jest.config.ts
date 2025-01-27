import jestConfig from '@repo/jest-presets/browser/jest-preset'
export default {
  ...jestConfig,
  testEnvironment: 'jsdom',
}
