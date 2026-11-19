import Image from 'next/image';
import type { ProjectImage } from '@/lib/media';

/** Phone screens are captured at 390x844 CSS pixels; keeping the ratio avoids layout shift. */
const SCREEN_WIDTH = 390;
const SCREEN_HEIGHT = 844;

function Screen({ src, alt, className }: { src: string; alt: string; className?: string }) {
  // The thumbnail links to the full-size capture, which is small to read in a grid.
  return (
    <a href={src} className={`block focus-visible:outline-2 focus-visible:outline-accent ${className ?? ''}`}>
      <Image
        src={src}
        alt={alt}
        width={SCREEN_WIDTH}
        height={SCREEN_HEIGHT}
        sizes="(max-width: 640px) 50vw, 200px"
        className="h-auto w-full"
      />
    </a>
  );
}

/**
 * App screens in a grid, uncropped, each with its caption. When a screen
 * has a dark capture, both are rendered and CSS shows the one that matches
 * the site's theme (`.theme-light-only` / `.theme-dark-only` in
 * globals.css), so no client script is needed.
 */
export function ProjectScreens({ screens }: { screens: ProjectImage[] }) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {screens.map((screen) => (
        <li key={screen.url}>
          <figure className="flex flex-col gap-2">
            <div className="overflow-hidden rounded-lg border border-border">
              <Screen src={screen.url} alt={screen.alt} className={screen.darkUrl ? 'theme-light-only' : undefined} />
              {screen.darkUrl && <Screen src={screen.darkUrl} alt={screen.alt} className="theme-dark-only" />}
            </div>
            {screen.caption && <figcaption className="text-sm text-fg-muted">{screen.caption}</figcaption>}
          </figure>
        </li>
      ))}
    </ul>
  );
}
