// Builds and runs the end-to-end suite the way CI does (.github/workflows/ci.yml).
//
// The Turnstile site key is inlined at build time, and Next.js would otherwise
// take it from .env.local, which holds the real key. The real key only works
// on the hostnames allowed in Cloudflare, so the bot check would never pass
// on localhost. Variables already in the environment win over .env files, so
// Cloudflare's public test key (always passes) is set here for the build.
import { spawnSync } from 'node:child_process';

const TURNSTILE_TEST_SITE_KEY = '1x00000000000000000000AA';

function run(command, args, env = process.env) {
  const result = spawnSync(command, args, { stdio: 'inherit', shell: true, env });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run('pnpm', ['exec', 'next', 'build'], {
  ...process.env,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: TURNSTILE_TEST_SITE_KEY,
});
run('pnpm', ['exec', 'playwright', 'test', ...process.argv.slice(2)]);
