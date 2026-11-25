import type { Icon } from '@primer/octicons-react';
import type { ReactNode } from 'react';

/**
 * Building blocks of the FelpsXP visual standard (ADR-0012), shared with
 * FelpsXP Logs. Server components with no client JavaScript; every colour
 * comes from the tokens in `globals.css`, so both themes follow.
 */

export type Tone = 'neutral' | 'accent' | 'success' | 'attention' | 'danger' | 'info';

/** Text, border and muted fill per tone; a tone is never a saturated background. */
const toneClass: Record<Tone, { text: string; border: string; fill: string }> = {
  neutral: { text: 'text-fg-muted', border: 'border-border', fill: 'bg-surface' },
  accent: { text: 'text-accent', border: 'border-accent/50', fill: 'bg-accent-muted' },
  success: { text: 'text-success', border: 'border-success/50', fill: 'bg-success-muted' },
  attention: { text: 'text-attention', border: 'border-attention/50', fill: 'bg-attention-muted' },
  danger: { text: 'text-danger', border: 'border-danger/50', fill: 'bg-danger-muted' },
  info: { text: 'text-link', border: 'border-link/50', fill: 'bg-info-muted' },
};

/** A rounded pill: outlined by default, or on its tone's muted fill. */
export function Badge({
  tone = 'neutral',
  filled = false,
  icon: IconComponent,
  className = '',
  children,
}: {
  tone?: Tone;
  filled?: boolean;
  icon?: Icon;
  className?: string;
  children: ReactNode;
}) {
  const t = toneClass[tone];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${t.text} ${
        filled ? `border-transparent ${t.fill}` : t.border
      } ${className}`}
    >
      {IconComponent && <IconComponent aria-hidden size={12} />}
      {children}
    </span>
  );
}

/** A small uppercase label above a group, in the typewriter face. */
export function Eyebrow({
  icon: IconComponent,
  as: Tag = 'p',
  id,
  children,
}: {
  icon?: Icon;
  as?: 'p' | 'h2' | 'h3';
  id?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      id={id}
      className="flex items-center gap-2 font-typewriter text-sm uppercase tracking-wide text-fg-muted"
    >
      {IconComponent && <IconComponent aria-hidden size={16} />}
      {children}
    </Tag>
  );
}

/** A bordered card with an optional header row on the surface fill. */
export function Box({
  title,
  icon: IconComponent,
  headingLevel: Heading = 'h3',
  actions,
  children,
  className = '',
}: {
  title?: ReactNode;
  icon?: Icon;
  headingLevel?: 'h2' | 'h3' | 'h4';
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden rounded-md border border-border bg-canvas ${className}`}>
      {title && (
        <div className="flex flex-wrap items-center gap-2 border-b border-border bg-surface px-4 py-2.5">
          {IconComponent && <IconComponent aria-hidden size={16} className="text-fg-muted" />}
          <Heading className="text-sm font-semibold text-fg">{title}</Heading>
          {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

/** Rows divided by the border colour, for lists inside a Box. */
export function BoxRows({ children }: { children: ReactNode }) {
  return <ul className="divide-y divide-border">{children}</ul>;
}

export function BoxRow({ children }: { children: ReactNode }) {
  return <li className="px-4 py-3 text-fg">{children}</li>;
}

/** A headline number: icon and label on top, the value large, a detail line. */
export function ScoreCard({
  icon: IconComponent,
  label,
  value,
  detail,
  tone = 'neutral',
}: {
  icon: Icon;
  label: string;
  value: string;
  detail: string;
  tone?: Tone;
}) {
  const t = toneClass[tone];
  return (
    <div
      className={`flex flex-col gap-1 rounded-md border p-4 ${
        tone === 'neutral' ? 'border-border bg-canvas' : `${t.border} ${t.fill}`
      }`}
    >
      <p className={`flex items-center gap-2 text-xs font-medium ${t.text}`}>
        <IconComponent aria-hidden size={16} />
        {label}
      </p>
      <p className="text-2xl font-semibold tabular-nums text-fg">{value}</p>
      <p className="text-sm text-fg-muted">{detail}</p>
    </div>
  );
}
