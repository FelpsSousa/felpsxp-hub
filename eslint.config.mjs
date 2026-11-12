import nextConfig from 'eslint-config-next';

const eslintConfig = [
  // Generated output: the Vitest coverage report is not source code.
  { ignores: ['coverage/**', 'playwright-report/**', 'test-results/**'] },
  ...nextConfig,
];

export default eslintConfig;
