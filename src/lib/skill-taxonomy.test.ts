import { describe, expect, it } from 'vitest';
import type { Project } from '@/content/types';
import { getPublicProjects } from '@/lib/content';
import { PROJECT_DIFFICULTIES, projectXp, projectXpBreakdown, XP_LEVEL_BASE, XP_MAX_BONUS } from '@/lib/skill-taxonomy';

type XpInput = Pick<Project, 'difficulty' | 'xpEvidence' | 'media'>;

const screen = { kind: 'image', url: '/s.png', alt: 'A screen', presentation: 'screen' } as const;

describe('project XP (ADR-0013)', () => {
  it('keeps the level bands apart: evidence never lifts a project past the next level', () => {
    for (let index = 0; index < PROJECT_DIFFICULTIES.length - 1; index++) {
      const level = PROJECT_DIFFICULTIES[index];
      const nextLevel = PROJECT_DIFFICULTIES[index + 1];
      expect(XP_LEVEL_BASE[level] + XP_MAX_BONUS, `${level} with every bonus`).toBeLessThan(
        XP_LEVEL_BASE[nextLevel],
      );
    }
  });

  it('adds five per piece of evidence, with screens derived from the gallery', () => {
    const project: XpInput = {
      difficulty: 'applied',
      xpEvidence: [{ kind: 'public-code', href: 'https://github.com/FelpsSousa/x' }],
      media: [screen],
    };
    expect(projectXpBreakdown(project)).toEqual([
      { kind: 'level', level: 'applied', points: 35 },
      { kind: 'public-code', points: 5, href: 'https://github.com/FelpsSousa/x' },
      { kind: 'screens', points: 5, href: '#screens' },
    ]);
    expect(projectXp(project)).toBe(45);
  });

  it('ignores the number of domains, which used to multiply the value', () => {
    const base: XpInput = { difficulty: 'advanced', xpEvidence: [], media: [] };
    expect(projectXp(base)).toBe(60);
  });

  it('scores the published projects as the rubric says', () => {
    const xp = Object.fromEntries(getPublicProjects('en').map((project) => [project.slug, projectXp(project)]));
    expect(xp).toMatchObject({
      'felpsxp-platform': 100,
      'felpsxp-finance': 70,
      candidattus: 65,
      'felpsxp-hub': 50,
      connexicco: 40,
      'beecrowd-problem-solving': 15,
    });
  });
});
