import { describe, expect, it } from 'vitest';
import packageJson from '../../package.json';
import { buildInfo, REPOSITORY_URL } from '@/lib/build-info';

describe('buildInfo', () => {
  it('uses a semantic version from package.json by default', () => {
    expect(buildInfo().version).toBe(packageJson.version);
    expect(packageJson.version).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('links to the releases page', () => {
    expect(buildInfo('1.2.3').releasesUrl).toBe(`${REPOSITORY_URL}/releases`);
  });

  it('shortens the deployment commit and links to it', () => {
    const sha = '85ff1736a1b2c3d4e5f60718293a4b5c6d7e8f90';
    expect(buildInfo('1.2.3', sha).commit).toEqual({
      short: '85ff173',
      url: `${REPOSITORY_URL}/commit/${sha}`,
    });
  });

  it('shows no commit outside a deployment, or for anything that is not a hash', () => {
    expect(buildInfo('1.2.3', undefined).commit).toBeNull();
    expect(buildInfo('1.2.3', '').commit).toBeNull();
    expect(buildInfo('1.2.3', '"><script>').commit).toBeNull();
    expect(buildInfo('1.2.3', 'main').commit).toBeNull();
  });
});
