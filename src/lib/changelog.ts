import { readFileSync } from 'node:fs';
import path from 'node:path';
import { REPOSITORY_URL } from '@/lib/build-info';

/**
 * The release history from CHANGELOG.md, which release-please writes from the
 * Conventional Commits (ADR-0008). The file is read when the page is
 * prerendered, so the page always matches the deployed version.
 *
 * Links are rebuilt from the pull request numbers and commit hashes instead
 * of being copied from the Markdown, so the page only ever links to this
 * repository.
 */

export type ChangelogEntry = {
  scope: string | null;
  text: string;
  pullRequest: { number: number; url: string } | null;
  commit: { short: string; url: string } | null;
};

export type ChangelogSection = {
  title: string;
  entries: ChangelogEntry[];
};

export type ChangelogRelease = {
  version: string;
  /** ISO date, `YYYY-MM-DD`. */
  date: string;
  /** Anchor id on the changelog page, for example `v0.11.1`. */
  id: string;
  releaseUrl: string;
  sections: ChangelogSection[];
};

const releaseHeading =
  /^## \[?(?<version>\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)\]?(?:\([^)]*\))? \((?<date>\d{4}-\d{2}-\d{2})\)\s*$/;
const sectionHeading = /^### (?<title>.+?)\s*$/;
const entryLine = /^[*-] (?<body>.+?)\s*$/;
const scopePrefix = /^\*\*(?<scope>[^*]+):\*\* /;
const commitSuffix = / \(\[(?<sha>[0-9a-f]{7,40})\]\([^)]*\)\)$/;
const pullRequestSuffix = / \(\[#(?<number>\d+)\]\([^)]*\)\)$/;

function parseEntry(body: string): ChangelogEntry {
  let text = body;

  const commitMatch = commitSuffix.exec(text);
  if (commitMatch?.groups) text = text.slice(0, commitMatch.index);

  const pullRequestMatch = pullRequestSuffix.exec(text);
  if (pullRequestMatch?.groups) text = text.slice(0, pullRequestMatch.index);

  const scopeMatch = scopePrefix.exec(text);
  if (scopeMatch?.groups) text = text.slice(scopeMatch[0].length);

  const sha = commitMatch?.groups?.sha;
  const number = pullRequestMatch?.groups ? Number(pullRequestMatch.groups.number) : null;

  return {
    scope: scopeMatch?.groups?.scope ?? null,
    text: text.trim(),
    pullRequest: number ? { number, url: `${REPOSITORY_URL}/pull/${number}` } : null,
    commit: sha ? { short: sha.slice(0, 7), url: `${REPOSITORY_URL}/commit/${sha}` } : null,
  };
}

/** Parses release-please's CHANGELOG.md format, newest release first. */
export function parseChangelog(markdown: string): ChangelogRelease[] {
  const releases: ChangelogRelease[] = [];
  let release: ChangelogRelease | null = null;
  let section: ChangelogSection | null = null;

  for (const line of markdown.split(/\r?\n/)) {
    const releaseMatch = releaseHeading.exec(line);
    if (releaseMatch?.groups) {
      const { version, date } = releaseMatch.groups;
      release = {
        version,
        date,
        id: `v${version}`,
        releaseUrl: `${REPOSITORY_URL}/releases/tag/v${version}`,
        sections: [],
      };
      releases.push(release);
      section = null;
      continue;
    }

    const sectionMatch = release ? sectionHeading.exec(line) : null;
    if (release && sectionMatch?.groups) {
      section = { title: sectionMatch.groups.title, entries: [] };
      release.sections.push(section);
      continue;
    }

    const entryMatch = section ? entryLine.exec(line) : null;
    if (section && entryMatch?.groups) {
      section.entries.push(parseEntry(entryMatch.groups.body));
    }
  }

  return releases;
}

let cached: ChangelogRelease[] | null = null;

/** The releases in this repository's CHANGELOG.md, read once per process. */
export function getChangelog(): ChangelogRelease[] {
  cached ??= parseChangelog(readFileSync(path.join(process.cwd(), 'CHANGELOG.md'), 'utf8'));
  return cached;
}
