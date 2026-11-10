import nextConfig from 'eslint-config-next';

const eslintConfig = [
  // Generated output: the Vitest coverage report is not source code.
  { ignores: ['coverage/**'] },
  ...nextConfig,
];

export default eslintConfig;
