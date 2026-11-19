import type { Project } from '@/content/types';

export type ProjectImage = Extract<Project['media'][number], { kind: 'image' }>;

function images(project: Project): ProjectImage[] {
  return project.media.filter((item): item is ProjectImage => item.kind === 'image');
}

/** The wide image for the card and the top of the page: the first image that is not a screen. */
export function coverImage(project: Project): ProjectImage | undefined {
  return images(project).find((image) => (image.presentation ?? 'cover') === 'cover');
}

/** App screens, in content order, shown uncropped in the gallery. */
export function screenImages(project: Project): ProjectImage[] {
  return images(project).filter((image) => image.presentation === 'screen');
}
