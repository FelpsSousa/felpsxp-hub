// Renders the CV PDFs from the /cv page itself (ADR-0010), so the download
// can never say something the page does not:
//   pnpm cv:pdf
// It builds the site, serves it locally, prints /cv and /en/cv with
// Chromium (the end-to-end suite's own browser) and writes:
//   public/cv/felipe-sousa-cv-pt.pdf, public/cv/felipe-sousa-cv-en.pdf
//   src/content/cv/pdf-fingerprints.json (what each PDF was rendered from)
// Commit all three. The unit test in src/content/cv/pdf.test.ts fails when
// the CV content changes and this script was not run again.
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { chromium } from '@playwright/test';
import { cvByLocale } from '../src/content/cv/cv.ts';
import { cvFingerprint } from '../src/content/cv/hash.ts';

const PORT = 3123;
const LOCALES = [
  { code: 'pt', path: '/cv' },
  { code: 'en', path: '/en/cv' },
];

// Next.js runs straight under Node, without a shell in between, so killing
// the child really stops the server (on Windows a shell layer would orphan it).
const nextBin = createRequire(import.meta.url).resolve('next/dist/bin/next');

const build = spawnSync(process.execPath, [nextBin, 'build'], { stdio: 'inherit' });
if (build.status !== 0) process.exit(build.status ?? 1);

const server = spawn(process.execPath, [nextBin, 'start', '--port', String(PORT)], { stdio: 'ignore' });

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      // robots.txt skips the locale proxy, so it answers 200 as soon as the server is up.
      if ((await fetch(`http://127.0.0.1:${PORT}/robots.txt`)).ok) return;
    } catch {
      // not listening yet
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error('The production server did not start.');
}

const fingerprints = {};
let browser;
try {
  await waitForServer();
  browser = await chromium.launch();
  mkdirSync('public/cv', { recursive: true });

  for (const { code, path } of LOCALES) {
    const page = await browser.newPage({ colorScheme: 'light' });
    await page.goto(`http://127.0.0.1:${PORT}${path}`, { waitUntil: 'networkidle' });
    await page.emulateMedia({ media: 'print' });
    const file = `public/cv/felipe-sousa-cv-${code}.pdf`;
    await page.pdf({ path: file, format: 'A4', preferCSSPageSize: true, printBackground: true });
    await page.close();

    const pages = (readFileSync(file, 'latin1').match(/\/Type\s*\/Page[^s]/g) ?? []).length;
    if (pages > 2) throw new Error(`${file} has ${pages} pages; the CV must fit on two (ADR-0010).`);

    const messages = JSON.parse(readFileSync(`messages/${code}.json`, 'utf8'));
    fingerprints[code] = cvFingerprint(cvByLocale[code], messages.cv);
    console.log(`${file}: ${pages} page(s)`);
  }

  writeFileSync('src/content/cv/pdf-fingerprints.json', `${JSON.stringify(fingerprints, null, 2)}\n`);
} finally {
  await browser?.close();
  server.kill();
}
