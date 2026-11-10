import { describe, expect, it } from 'vitest';
import { profileSchema, projectSchema } from '@/content/schemas';
import type { Profile, Project } from '@/content/types';

const validProject: Project = {
  slug: 'sample-project',
  title: 'Sample project',
  summary: 'A project used only by these tests.',
  status: 'active',
  visibility: 'public',
  type: 'product',
  difficulty: 'applied',
  primaryDomain: 'frontend',
  secondaryDomains: ['appsec'],
  isExample: false,
  media: [{ kind: 'image', url: '/mock-projects/board.png', alt: 'The main board' }],
  role: 'Sole developer',
  problem: 'A problem worth solving.',
  solution: 'A solution worth describing.',
  architectureHighlights: ['Static rendering'],
  challenges: [],
  responsibilities: ['Everything'],
  outcomes: [],
  learnings: [],
  stack: ['Next.js'],
  tags: ['portfolio'],
  relatedSurfaceKeys: ['hub'],
  startedAt: '2026-01-15',
  updatedAt: '2026-11-10',
  featured: false,
  links: [{ href: 'https://github.com/FelpsSousa/felpsxp-hub', label: 'Repository', external: true }],
};

const validProfile: Profile = {
  displayName: 'Sample Person',
  title: 'Engineer',
  location: 'Brazil',
  languages: ['Portuguese', 'English'],
  shortBio: 'Builds things.',
  summaryParagraphs: ['One paragraph.'],
  currentFocus: [],
  principles: [],
  highlights: [],
  highlightStats: [{ value: '10', label: 'Things' }],
};

function withProject(overrides: Record<string, unknown>) {
  return projectSchema.safeParse({ ...validProject, ...overrides });
}

describe('projectSchema', () => {
  it('accepts a valid project', () => {
    expect(projectSchema.safeParse(validProject).success).toBe(true);
  });

  it.each(['Sample Project', 'sample_project', '-sample', 'sample-', 'sample--project'])(
    'rejects the non-kebab-case slug %j',
    (slug) => {
      expect(withProject({ slug }).success).toBe(false);
    },
  );

  it('rejects an empty or whitespace-only title', () => {
    expect(withProject({ title: '' }).success).toBe(false);
    expect(withProject({ title: '   ' }).success).toBe(false);
  });

  it('rejects a value outside an enum', () => {
    expect(withProject({ status: 'done' }).success).toBe(false);
    expect(withProject({ primaryDomain: 'marketing' }).success).toBe(false);
  });

  it.each(['2026-13-01', '2026-02-30', '10/11/2026', '2026-11'])(
    'rejects the invalid date %j',
    (startedAt) => {
      expect(withProject({ startedAt }).success).toBe(false);
    },
  );

  it.each([
    'http://example.com',
    'javascript:alert(1)',
    'data:text/html,hello',
    '//evil.example.com/path',
    'https://localhost',
  ])('rejects the unsafe link %j', (href) => {
    expect(withProject({ links: [{ href, label: 'Link' }] }).success).toBe(false);
  });

  it('accepts an HTTPS link and a same-origin path', () => {
    const links = [
      { href: 'https://example.com/page', label: 'External', external: true },
      { href: '/projects', label: 'Internal' },
    ];
    expect(withProject({ links }).success).toBe(true);
  });

  it('requires alt text on images, but not on video or audio', () => {
    expect(withProject({ media: [{ kind: 'image', url: '/a.png' }] }).success).toBe(false);
    expect(withProject({ media: [{ kind: 'video', url: '/a.mp4' }] }).success).toBe(true);
    expect(withProject({ media: [{ kind: 'audio', url: '/a.mp3' }] }).success).toBe(true);
  });

  it('rejects unknown fields, so a typo cannot pass silently', () => {
    expect(withProject({ sumary: 'typo' }).success).toBe(false);
  });
});

describe('profileSchema', () => {
  it('accepts a valid profile', () => {
    expect(profileSchema.safeParse(validProfile).success).toBe(true);
  });

  it('requires at least one language and one summary paragraph', () => {
    expect(profileSchema.safeParse({ ...validProfile, languages: [] }).success).toBe(false);
    expect(profileSchema.safeParse({ ...validProfile, summaryParagraphs: [] }).success).toBe(
      false,
    );
  });
});
