import { describe, expect, it } from 'vitest';
import type { Project } from '@/content/types';
import { coverImage, screenImages } from '@/lib/media';

function withMedia(media: Project['media']): Project {
  return { media } as Project;
}

describe('project media', () => {
  it('treats an image without a presentation as the cover, as before screens existed', () => {
    const project = withMedia([{ kind: 'image', url: '/a.png', alt: 'A' }]);
    expect(coverImage(project)?.url).toBe('/a.png');
    expect(screenImages(project)).toEqual([]);
  });

  it('never uses a screen as the cover, and keeps screens in content order', () => {
    const project = withMedia([
      { kind: 'video', url: '/v.mp4' },
      { kind: 'image', url: '/s1.png', alt: 'One', presentation: 'screen' },
      { kind: 'image', url: '/c.png', alt: 'Cover', presentation: 'cover' },
      { kind: 'image', url: '/s2.png', alt: 'Two', presentation: 'screen', darkUrl: '/s2-dark.png' },
    ]);
    expect(coverImage(project)?.url).toBe('/c.png');
    expect(screenImages(project).map((image) => image.url)).toEqual(['/s1.png', '/s2.png']);
  });

  it('has no cover when every image is a screen', () => {
    const project = withMedia([{ kind: 'image', url: '/s.png', alt: 'S', presentation: 'screen' }]);
    expect(coverImage(project)).toBeUndefined();
  });
});
