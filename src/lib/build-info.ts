import packageJson from '../../package.json';

/**
 * What is running (ADR-0008): the semantic version from package.json, kept by
 * release-please, and the commit of the deployment, which Vercel exposes at
 * build time. Pages are prerendered, so both are fixed per deployment.
 */

export const REPOSITORY_URL = 'https://github.com/FelpsSousa/felpsxp-hub';

export type BuildInfo = {
  version: string;
  releasesUrl: string;
  commit: { short: string; url: string } | null;
};

/** A full or abbreviated git hash; anything else is ignored. */
const commitHash = /^[0-9a-f]{7,40}$/;

export function buildInfo(
  version: string = packageJson.version,
  commitSha: string | undefined = process.env.VERCEL_GIT_COMMIT_SHA,
): BuildInfo {
  const sha = commitSha?.trim().toLowerCase();

  return {
    version,
    releasesUrl: `${REPOSITORY_URL}/releases`,
    commit:
      sha && commitHash.test(sha)
        ? { short: sha.slice(0, 7), url: `${REPOSITORY_URL}/commit/${sha}` }
        : null,
  };
}
