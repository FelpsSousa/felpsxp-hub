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
      provider: 'v8',
      include: ['src/lib/**', 'src/content/schemas.ts'],
      reporter: ['text', 'html'],
    },
  },
});
