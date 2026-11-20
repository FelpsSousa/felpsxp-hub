import { describe, expect, it } from 'vitest';
import { cvByLocale } from '@/content/cv/cv';
import { locales } from '@/i18n/routing';
import { getCv, getPublicProjects } from '@/lib/content';
import { skillTree, timeline } from '@/lib/experience';

describe('experience timeline', () => {
  it('lists the newest first, with work that is still running at the top', () => {
    const entries = timeline(getCv('en'));
    const keys = entries.map((entry) => `${entry.period.end ?? '9999-12'}|${entry.period.start}`);
    expect([...keys].sort().reverse()).toEqual(keys);
    expect(entries[0].period.end).toBeNull();
  });

  it('keeps items without an exact period off the timeline', () => {
    const cv = getCv('pt');
    const titles = timeline(cv).map((entry) => entry.title);
    for (const item of cv.earlierExperience.filter((entry) => !entry.period)) {
      expect(titles).not.toContain(item.title);
    }
  });

  it('places each product inside its role, with its own period', () => {
    const algoricca = timeline(getCv('pt')).find((entry) => entry.organization === 'Algoricca Software Company');
    expect(algoricca?.parts.map((part) => part.name)).toEqual(['Candidattus', 'Connexicco']);
    expect(algoricca?.parts.every((part) => part.period)).toBe(true);
  });

  it('only links to project pages that exist, in every locale', () => {
    for (const locale of locales) {
      const slugs = new Set(getPublicProjects(locale).map((project) => project.slug));
      for (const entry of timeline(getCv(locale))) {
        for (const slug of [entry.slug, ...entry.parts.map((part) => part.slug)].filter(Boolean)) {
          expect(slugs.has(slug as string), `${locale}: ${slug}`).toBe(true);
        }
      }
    }
  });

  it('has the same timeline shape in both locales', () => {
    const shape = (locale: 'pt' | 'en') =>
      timeline(cvByLocale[locale]).map((entry) => `${entry.kind}|${entry.period.start}|${entry.period.end}`);
    expect(shape('en')).toEqual(shape('pt'));
  });
});

describe('skill tree', () => {
  it('links a skill to the public projects whose stack lists it', () => {
    const tree = skillTree(getCv('en'), getPublicProjects('en'));
    const react = tree.flatMap((area) => area.skills).find((skill) => skill.name === 'React');
    expect(react?.projects.map((project) => project.slug)).toContain('felpsxp-hub');
  });
});
