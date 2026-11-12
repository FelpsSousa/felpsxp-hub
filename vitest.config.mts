import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Unit tests only (ADR-0006). Async Server Components are covered by the
// Playwright end-to-end suite instead, since Vitest cannot render them.
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    coverage: {
      // Always on in CI (GitHub Actions sets CI=true), so `pnpm test` fails
      // there when coverage drops; locally, run `pnpm test:coverage`.
      enabled: Boolean(process.env.CI),
      provider: 'v8',
      include: ['src/lib/**', 'src/content/schemas.ts'],
      exclude: ['src/**/*.test.ts'],
      reporter: ['text', 'html'],
      // ADR-0006: enforced on src/lib once the contact logic landed. Browser-only
      // helpers (theme.ts) are covered end to end by Playwright instead.
      thresholds: {
        lines: 80,
        statements: 80,
        functions: 80,
        branches: 75,
      },
    },
  },
});
