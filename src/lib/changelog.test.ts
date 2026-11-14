import { describe, expect, it } from 'vitest';
import packageJson from '../../package.json';
import { REPOSITORY_URL } from '@/lib/build-info';
import { getChangelog, parseChangelog } from '@/lib/changelog';

const sample = `# Changelog

## [0.11.1](https://github.com/FelpsSousa/felpsxp-hub/compare/v0.11.0...v0.11.1) (2026-11-14)


### Bug Fixes

* answer unknown locales with a 404 ([#50](https://github.com/FelpsSousa/felpsxp-hub/issues/50)) ([d9b61ff35f6ab7047bcaf4cd055f4afb00b99689](https://github.com/FelpsSousa/felpsxp-hub/commit/d9b61ff35f6ab7047bcaf4cd055f4afb00b99689))

### Security

* **deps:** override \`minimatch\` ([#51](https://example.com/elsewhere)) ([93fe46e](https://example.com/elsewhere))

## 0.1.0 (2026-11-10)


### Features

* first release
`;

describe('parseChangelog', () => {
  const releases = parseChangelog(sample);

  it('reads every release, newest first, with its date and anchor', () => {
    expect(releases.map(({ version, date, id }) => ({ version, date, id }))).toEqual([
      { version: '0.11.1', date: '2026-11-14', id: 'v0.11.1' },
      { version: '0.1.0', date: '2026-11-10', id: 'v0.1.0' },
    ]);
    expect(releases[0].releaseUrl).toBe(`${REPOSITORY_URL}/releases/tag/v0.11.1`);
  });

  it('groups entries by section', () => {
    expect(releases[0].sections.map((section) => section.title)).toEqual(['Bug Fixes', 'Security']);
    expect(releases[1].sections[0].entries).toEqual([
      { scope: null, text: 'first release', pullRequest: null, commit: null },
    ]);
  });

  it('splits the scope, pull request and commit off the text', () => {
    expect(releases[0].sections[0].entries[0]).toEqual({
      scope: null,
      text: 'answer unknown locales with a 404',
      pullRequest: { number: 50, url: `${REPOSITORY_URL}/pull/50` },
      commit: {
        short: 'd9b61ff',
        url: `${REPOSITORY_URL}/commit/d9b61ff35f6ab7047bcaf4cd055f4afb00b99689`,
      },
    });
    expect(releases[0].sections[1].entries[0].scope).toBe('deps');
    expect(releases[0].sections[1].entries[0].text).toBe('override `minimatch`');
  });

  it('links only to this repository, whatever the Markdown points to', () => {
    const entry = releases[0].sections[1].entries[0];
    expect(entry.pullRequest?.url).toBe(`${REPOSITORY_URL}/pull/51`);
    expect(entry.commit?.url).toBe(`${REPOSITORY_URL}/commit/93fe46e`);
  });

  it('returns nothing for a file without releases', () => {
    expect(parseChangelog('# Changelog\n')).toEqual([]);
  });
});

describe('getChangelog', () => {
  it('starts with the version in package.json, which release-please bumps alongside it', () => {
    const [latest] = getChangelog();
    expect(latest.version).toBe(packageJson.version);
    expect(latest.sections.length).toBeGreaterThan(0);
  });

  it('gives every release a unique anchor', () => {
    const ids = getChangelog().map((release) => release.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
