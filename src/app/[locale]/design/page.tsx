import {
  ArchiveIcon,
  BeakerIcon,
  BookIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  ChecklistIcon,
  CodeIcon,
  DeviceDesktopIcon,
  FileCodeIcon,
  GoalIcon,
  type Icon,
  LawIcon,
  LightBulbIcon,
  LinkExternalIcon,
  LockIcon,
  MailIcon,
  MoonIcon,
  MortarBoardIcon,
  PaintbrushIcon,
  PulseIcon,
  RocketIcon,
  SearchIcon,
  ShieldCheckIcon,
  StackIcon,
  StarIcon,
  SunIcon,
  ToolsIcon,
} from '@primer/octicons-react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Badge, Box, BoxRow, BoxRows, Eyebrow, ScoreCard, type Tone } from '@/components/ui/primitives';
import type { Project, ProjectStatus } from '@/content/types';
import { requireLocale } from '@/i18n/locale';
import { getProfile, getPublicProjects, getSiteSettings } from '@/lib/content';
import { designChoices, type DesignItem } from '@/lib/design-choices';
import { pageMetadata } from '@/lib/seo';
import { domainLabel, projectDomains, projectXp } from '@/lib/skill-taxonomy';

type DesignPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: DesignPageProps): Promise<Metadata> {
  const locale = requireLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: 'design' });
  return pageMetadata({ locale, path: '/design', title: t('title'), description: t('description') });
}

/** The tokens shown as swatches; class names are literal so Tailwind keeps them. */
const swatches = [
  ['canvas', 'bg-canvas'],
  ['surface', 'bg-surface'],
  ['inset', 'bg-inset'],
  ['border', 'bg-border'],
  ['fg', 'bg-fg'],
  ['fgMuted', 'bg-fg-muted'],
  ['link', 'bg-link'],
  ['accent', 'bg-accent'],
  ['success', 'bg-success'],
  ['attention', 'bg-attention'],
  ['danger', 'bg-danger'],
  ['tabActive', 'bg-tab-active'],
] as const;

/** The Octicons the site uses or is about to use, with their names. */
const iconSet: [string, Icon][] = [
  ['rocket', RocketIcon],
  ['shield-check', ShieldCheckIcon],
  ['lock', LockIcon],
  ['code', CodeIcon],
  ['file-code', FileCodeIcon],
  ['stack', StackIcon],
  ['beaker', BeakerIcon],
  ['light-bulb', LightBulbIcon],
  ['goal', GoalIcon],
  ['checklist', ChecklistIcon],
  ['briefcase', BriefcaseIcon],
  ['mortar-board', MortarBoardIcon],
  ['book', BookIcon],
  ['law', LawIcon],
  ['mail', MailIcon],
  ['search', SearchIcon],
  ['sun', SunIcon],
  ['moon', MoonIcon],
  ['device-desktop', DeviceDesktopIcon],
  ['link-external', LinkExternalIcon],
];

const statusTone: Record<ProjectStatus, Tone> = {
  planned: 'info',
  active: 'success',
  evolving: 'attention',
  paused: 'neutral',
  archived: 'neutral',
};

const statusIcon: Record<ProjectStatus, Icon> = {
  planned: GoalIcon,
  active: PulseIcon,
  evolving: ToolsIcon,
  paused: ChecklistIcon,
  archived: ArchiveIcon,
};

/** The FelpsXP Hub under ADR-0013's proposed rubric: Applied 25 + production, public code, ADRs. */
const PROPOSED_HUB_XP = 50;

const sectionHeading = 'text-2xl font-semibold text-fg';

export default async function DesignPage({ params }: DesignPageProps) {
  const locale = requireLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getTranslations('design');
  const tp = await getTranslations('projects');
  const tn = await getTranslations('nav');
  const th = await getTranslations('home');
  const stats = getProfile(locale).highlightStats;
  const stat = stats[stats.length - 1];
  const navItems = [tn('about'), tn('projects'), tn('contact')] as const;
  const { repositoryUrl } = getSiteSettings();
  const projects = getPublicProjects(locale);
  const project = projects.find(({ slug }) => slug === 'felpsxp-hub') ?? projects[0];

  return (
    <article className="mx-auto flex max-w-5xl flex-col gap-16 px-6 py-20">
      <header className="flex max-w-3xl flex-col gap-4">
        <Eyebrow icon={PaintbrushIcon}>FelpsXP</Eyebrow>
        <h1 className="text-3xl font-semibold text-fg">{t('title')}</h1>
        <p className="text-lg leading-relaxed text-fg">{t('lead')}</p>
        <p className="text-sm text-fg-muted">
          <a
            href={`${repositoryUrl}/blob/main/docs/adr/0012-felpsxp-visual-standard.md`}
            className="text-link underline underline-offset-4 hover:decoration-2"
          >
            {t('decision')}
          </a>
        </p>
      </header>

      {/* Colour */}
      <section aria-labelledby="colors" className="flex flex-col gap-6">
        <h2 id="colors" className={sectionHeading}>
          {t('colors.title')}
        </h2>
        <p className="max-w-3xl text-fg-muted">{t('colors.lead')}</p>
        <div className="grid gap-4 md:grid-cols-2">
          {(['light', 'dark'] as const).map((theme) => (
            <div
              key={theme}
              data-theme={theme}
              className="flex flex-col gap-4 rounded-md border border-border bg-canvas p-4 text-fg"
            >
              <p className="text-sm font-semibold">{t(theme)}</p>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {swatches.map(([token, className]) => (
                  <li key={token} className="flex flex-col gap-1">
                    <span aria-hidden className={`h-10 rounded-md border border-border ${className}`} />
                    <span className="text-xs text-fg">{t(`colors.${token}`)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                <Badge tone="success" filled icon={CheckCircleIcon}>
                  {tp('status.active')}
                </Badge>
                <Badge tone="attention" filled icon={ToolsIcon}>
                  {tp('status.evolving')}
                </Badge>
                <Badge tone="danger" filled>
                  {t('colors.danger')}
                </Badge>
                <Badge tone="accent">{t('colors.accent')}</Badge>
              </div>
              <p className="text-sm">
                <span className="text-link underline underline-offset-4">{t('colors.link')}</span>
                <span className="text-fg-muted"> · {t('colors.fgMuted')}</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Type */}
      <section aria-labelledby="type" className="flex flex-col gap-6">
        <h2 id="type" className={sectionHeading}>
          {t('type.title')}
        </h2>
        <p className="max-w-3xl text-fg-muted">{t('type.lead')}</p>
        <Box>
          <BoxRows>
            <BoxRow>
              <p className="text-3xl font-semibold">{t('type.h1')}</p>
              <p className="text-sm text-fg-muted">{t('type.sans')} · 30 px</p>
            </BoxRow>
            <BoxRow>
              <p className="text-2xl font-semibold">{t('type.h2')}</p>
              <p className="text-sm text-fg-muted">24 px</p>
            </BoxRow>
            <BoxRow>
              <p className="text-xl font-semibold">{t('type.h3')}</p>
              <p className="text-sm text-fg-muted">20 px</p>
            </BoxRow>
            <BoxRow>
              <p className="leading-relaxed">{t('type.body')}</p>
              <p className="text-sm text-fg-muted">16 px</p>
            </BoxRow>
            <BoxRow>
              <p className="font-mono text-sm">{t('type.mono')}</p>
              <p className="text-sm text-fg-muted">{t('type.monoFace')}</p>
            </BoxRow>
            <BoxRow>
              <p className="font-typewriter text-sm uppercase tracking-wide">{t('type.typewriter')}</p>
              <p className="text-sm text-fg-muted">{t('type.typewriterFace')}</p>
            </BoxRow>
            <BoxRow>
              <p className="font-pixel text-xs text-accent">{t('type.pixel')}</p>
              <p className="text-sm text-fg-muted">{t('type.pixelFace')}</p>
            </BoxRow>
          </BoxRows>
        </Box>
      </section>

      {/* Icons */}
      <section aria-labelledby="icons" className="flex flex-col gap-6">
        <h2 id="icons" className={sectionHeading}>
          {t('icons.title')}
        </h2>
        <p className="max-w-3xl text-fg-muted">{t('icons.lead')}</p>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-5">
          {iconSet.map(([name, IconComponent]) => (
            <li
              key={name}
              className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-fg"
            >
              <IconComponent aria-hidden size={16} className="text-fg-muted" />
              <span className="font-mono text-xs">{name}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Components */}
      <section aria-labelledby="components" className="flex flex-col gap-6">
        <h2 id="components" className={sectionHeading}>
          {t('components.title')}
        </h2>
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-fg">{t('components.badges')}</h3>
          <div className="flex flex-wrap gap-2">
            {(['neutral', 'accent', 'success', 'attention', 'danger', 'info'] as const).map((tone) => (
              <Badge key={tone} tone={tone}>
                {tone}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {(['neutral', 'accent', 'success', 'attention', 'danger', 'info'] as const).map((tone) => (
              <Badge key={tone} tone={tone} filled>
                {tone}
              </Badge>
            ))}
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold text-fg">{t('components.box')}</h3>
            <Box title={t('components.boxTitle')} icon={StarIcon} headingLevel="h4">
              <BoxRows>
                <BoxRow>{t('components.boxRow1')}</BoxRow>
                <BoxRow>{t('components.boxRow2')}</BoxRow>
                <BoxRow>{t('components.boxRow3')}</BoxRow>
              </BoxRows>
            </Box>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold text-fg">{t('components.scoreCards')}</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <ScoreCard icon={BeakerIcon} label={t('components.scoreLabel')} value="231" detail={t('components.scoreDetail')} />
              <ScoreCard
                icon={ShieldCheckIcon}
                label={stats[0].label}
                value={stats[0].value}
                detail={th('statsLabel')}
                tone="success"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Variations being chosen */}
      <section aria-labelledby="choices" className="flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <h2 id="choices" className={sectionHeading}>
            {t('choices.title')}
          </h2>
          <p className="max-w-3xl text-fg-muted">{t('choices.lead')}</p>
        </div>

        <Choice item="navCurrent" t={t}>
          {{
            a: <NavSample items={navItems} current="underline-accent" />,
            b: <NavSample items={navItems} current="underline-coral" />,
            c: <NavSample items={navItems} current="pill" />,
          }}
        </Choice>

        <Choice item="statusBadge" t={t}>
          {{
            a: (
              <div className="flex flex-wrap gap-2 font-mono text-xs text-fg-muted">
                {(['active', 'evolving', 'archived'] as const).map((status) => (
                  <span key={status} className="rounded-full border border-border px-2 py-0.5">
                    {tp(`status.${status}`)}
                  </span>
                ))}
              </div>
            ),
            b: (
              <div className="flex flex-wrap gap-2">
                {(['active', 'evolving', 'archived'] as const).map((status) => (
                  <Badge key={status} tone={statusTone[status]}>
                    {tp(`status.${status}`)}
                  </Badge>
                ))}
              </div>
            ),
            c: (
              <div className="flex flex-wrap gap-2">
                {(['active', 'evolving', 'archived'] as const).map((status) => (
                  <Badge key={status} tone={statusTone[status]} filled icon={statusIcon[status]}>
                    {tp(`status.${status}`)}
                  </Badge>
                ))}
              </div>
            ),
          }}
        </Choice>

        <Choice item="projectCard" t={t} wide>
          {{
            a: <CardSample project={project} variant="a" tp={tp} />,
            b: <CardSample project={project} variant="b" tp={tp} />,
            c: <CardSample project={project} variant="c" tp={tp} />,
          }}
        </Choice>

        <Choice item="sectionLabel" t={t}>
          {{
            a: (
              <p className="text-sm font-semibold uppercase tracking-wide text-fg-muted">
                {t('choices.sectionLabel.sample')}
              </p>
            ),
            b: <Eyebrow>{t('choices.sectionLabel.sample')}</Eyebrow>,
            c: <Eyebrow icon={GoalIcon}>{t('choices.sectionLabel.sample')}</Eyebrow>,
          }}
        </Choice>

        <Choice item="numbers" t={t}>
          {{
            a: (
              <div className="w-full rounded-lg border border-border p-4">
                <p className="font-mono text-2xl font-semibold text-accent">{stat.value}</p>
                <p className="mt-1 text-sm text-fg-muted">{stat.label}</p>
              </div>
            ),
            b: (
              <div className="w-full">
                <ScoreCard icon={CodeIcon} label={th('statsLabel')} value={stat.value} detail={stat.label} />
              </div>
            ),
            c: (
              <div className="w-full">
                <ScoreCard
                  icon={CodeIcon}
                  label={th('statsLabel')}
                  value={stat.value}
                  detail={stat.label}
                  tone="accent"
                />
              </div>
            ),
          }}
        </Choice>

        <Choice item="xpBadge" t={t} note={t('choices.xpBadge.note')}>
          {{
            a: (
              <span className="rounded-full border border-accent/40 px-2 py-0.5 font-mono text-xs text-accent">
                ~{projectXp(project)} XP
              </span>
            ),
            b: (
              <span className="rounded-full bg-accent-muted px-2.5 py-1 font-pixel text-[0.625rem] text-accent">
                {PROPOSED_HUB_XP} XP
              </span>
            ),
            c: (
              <span className="inline-flex items-center gap-1.5 font-pixel text-[0.625rem] text-accent">
                <StarIcon aria-hidden size={12} />
                {PROPOSED_HUB_XP} XP
              </span>
            ),
          }}
        </Choice>

        <Choice item="projectSections" t={t} wide>
          {{
            a: (
              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold uppercase tracking-wide text-fg-muted">
                  {tp('problemLabel')}
                </p>
                <p className="text-fg">{project.problem}</p>
              </div>
            ),
            b: (
              <Box title={tp('problemLabel')} icon={LightBulbIcon} headingLevel="h4">
                <p className="px-4 py-3 text-fg">{project.problem}</p>
              </Box>
            ),
          }}
        </Choice>

        <Choice item="brandMark" t={t}>
          {{
            a: <span className="font-semibold text-fg">Felipe Sousa</span>,
            b: (
              <span className="inline-flex items-center gap-2 font-semibold text-fg">
                Felipe Sousa
                <span className="rounded-sm bg-accent-muted px-1.5 py-1 font-pixel text-[0.5rem] text-accent">
                  XP
                </span>
              </span>
            ),
          }}
        </Choice>
      </section>

      {/* XP legend (proposal) */}
      <section aria-labelledby="xp" className="flex flex-col gap-6">
        <h2 id="xp" className={sectionHeading}>
          {t('xp.title')}
        </h2>
        <p className="max-w-3xl text-fg-muted">{t('xp.lead')}</p>
        <div className="grid gap-6 lg:grid-cols-2">
          <Table
            caption={t('xp.title')}
            head={[t('xp.level'), t('xp.base'), t('xp.criterion')]}
            rows={(
              [
                ['foundational', 10],
                ['applied', 25],
                ['advanced', 50],
                ['frontier', 80],
              ] as const
            ).map(([level, base]) => [tp(`filters.levels.${level}`), `${base} XP`, t(`xp.${level}`)])}
          />
          <Table
            caption={t('xp.evidence')}
            head={[t('xp.evidence'), t('xp.bonus'), t('xp.proof')]}
            rows={(
              [
                ['production', 10],
                ['publicCode', 10],
                ['decisions', 5],
                ['screens', 5],
              ] as const
            ).map(([evidence, bonus]) => [t(`xp.${evidence}`), `+${bonus}`, t(`xp.${evidence}Proof`)])}
          />
        </div>
      </section>

      {/* Credits */}
      <section aria-labelledby="credits" className="flex flex-col gap-6">
        <h2 id="credits" className={sectionHeading}>
          {t('credits.title')}
        </h2>
        <p className="max-w-3xl text-fg-muted">{t('credits.lead')}</p>
        <Table
          caption={t('credits.title')}
          head={[t('credits.asset'), t('credits.author'), t('credits.license'), t('credits.use')]}
          rows={[
            [
              <a key="primer" href="https://github.com/primer/primitives" className="text-link underline underline-offset-4">
                Primer Primitives
              </a>,
              'GitHub Inc.',
              <a key="mit1" href="https://github.com/primer/primitives/blob/main/LICENSE" className="text-link underline underline-offset-4">
                MIT
              </a>,
              t('credits.primerUse'),
            ],
            [
              <a key="octicons" href="https://github.com/primer/octicons" className="text-link underline underline-offset-4">
                Octicons
              </a>,
              'GitHub Inc.',
              <a key="mit2" href="https://github.com/primer/octicons/blob/main/LICENSE" className="text-link underline underline-offset-4">
                MIT
              </a>,
              t('credits.octiconsUse'),
            ],
            [
              <a key="se" href="https://fontsource.org/fonts/special-elite" className="text-link underline underline-offset-4">
                Special Elite
              </a>,
              'Astigmatic',
              <a key="apache" href="https://www.apache.org/licenses/LICENSE-2.0" className="text-link underline underline-offset-4">
                Apache 2.0
              </a>,
              t('credits.specialEliteUse'),
            ],
            [
              <a key="ps" href="https://fontsource.org/fonts/press-start-2p" className="text-link underline underline-offset-4">
                Press Start 2P
              </a>,
              'CodeMan38',
              <a key="ofl" href="https://openfontlicense.org" className="text-link underline underline-offset-4">
                SIL OFL 1.1
              </a>,
              t('credits.pressStartUse'),
            ],
          ]}
        />
        <p className="text-sm text-fg-muted">
          <a
            href={`${repositoryUrl}/blob/main/THIRD_PARTY_NOTICES.md`}
            className="text-link underline underline-offset-4 hover:decoration-2"
          >
            {t('credits.notices')}
          </a>
        </p>
      </section>
    </article>
  );
}

type Translate = Awaited<ReturnType<typeof getTranslations<'design'>>>;
type ProjectsTranslate = Awaited<ReturnType<typeof getTranslations<'projects'>>>;

/** One item being chosen: its options side by side, the one in use marked. */
function Choice({
  item,
  t,
  note,
  wide = false,
  children,
}: {
  item: DesignItem;
  t: Translate;
  note?: string;
  wide?: boolean;
  children: Partial<Record<'a' | 'b' | 'c', React.ReactNode>>;
}) {
  const options = Object.entries(children) as ['a' | 'b' | 'c', React.ReactNode][];
  const inUse = designChoices[item];

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-semibold text-fg">{t(`choices.${item}.title`)}</h3>
      {note && <p className="text-sm text-fg-muted">{note}</p>}
      <ul className={`grid gap-4 ${wide ? 'lg:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
        {options.map(([letter, sample]) => (
          <li
            key={letter}
            className={`flex flex-col gap-3 rounded-md border p-4 ${
              letter === inUse ? 'border-accent/60' : 'border-border'
            }`}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-fg">
                {t('option', { letter: letter.toUpperCase() })}
              </span>
              {letter === inUse && (
                <Badge tone="accent" filled icon={CheckCircleIcon}>
                  {t('inUse')}
                </Badge>
              )}
            </div>
            <p className="text-sm text-fg-muted">{t(`choices.${item}.${letter}`)}</p>
            <div className="flex flex-1 items-center">{sample}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A three-item navigation bar with the middle item current. */
function NavSample({
  items,
  current,
}: {
  items: readonly [string, string, string];
  current: 'underline-accent' | 'underline-coral' | 'pill';
}) {
  const currentClass = {
    'underline-accent': 'text-fg underline decoration-accent decoration-2 underline-offset-8',
    'underline-coral': 'text-fg font-semibold underline decoration-tab-active decoration-2 underline-offset-8',
    pill: 'rounded-md bg-accent-muted px-2 py-1 text-fg',
  }[current];

  return (
    <ul className="flex items-center gap-4 text-sm text-fg-muted" aria-hidden>
      <li>{items[0]}</li>
      <li className={currentClass}>{items[1]}</li>
      <li>{items[2]}</li>
    </ul>
  );
}

/** The FelpsXP Hub card in each of the three variations. */
function CardSample({
  project,
  variant,
  tp,
}: {
  project: Project;
  variant: 'a' | 'b' | 'c';
  tp: ProjectsTranslate;
}) {
  const tone = statusTone[project.status];
  const domains = (
    <div className="flex flex-wrap gap-2">
      {projectDomains(project).map((domain) => (
        <span key={domain} className="rounded-full bg-surface px-2 py-0.5 text-xs text-fg-muted">
          {domainLabel(domain)}
        </span>
      ))}
    </div>
  );
  const summary = <p className="line-clamp-3 text-sm text-fg">{project.summary}</p>;
  const title = <p className="text-lg font-medium text-fg">{project.title}</p>;

  if (variant === 'a') {
    return (
      <div className="flex w-full flex-col gap-3 rounded-lg border border-border p-4">
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-fg-muted">
          <span className="rounded-full border border-border px-2 py-0.5">{tp(`status.${project.status}`)}</span>
          <span className="rounded-full border border-border px-2 py-0.5">
            {tp(`filters.levels.${project.difficulty}`)}
          </span>
          <span className="rounded-full border border-accent/40 px-2 py-0.5 text-accent">~{projectXp(project)} XP</span>
        </div>
        {title}
        {summary}
        {domains}
      </div>
    );
  }

  const badges = (
    <>
      <Badge tone={tone} filled icon={statusIcon[project.status]}>
        {tp(`status.${project.status}`)}
      </Badge>
      <Badge>{tp(`filters.levels.${project.difficulty}`)}</Badge>
      <span className="ml-auto rounded-full bg-accent-muted px-2 py-1 font-pixel text-[0.625rem] text-accent">
        {PROPOSED_HUB_XP} XP
      </span>
    </>
  );

  if (variant === 'b') {
    return (
      <div className="w-full overflow-hidden rounded-md border border-border">
        <div className="flex flex-wrap items-center gap-2 border-b border-border bg-surface px-4 py-2">{badges}</div>
        <div className="flex flex-col gap-3 p-4">
          {title}
          {summary}
          {domains}
        </div>
      </div>
    );
  }

  const stripe = { success: 'border-l-success', attention: 'border-l-attention' }[tone as string] ?? 'border-l-border';
  return (
    <div className={`flex w-full flex-col gap-3 rounded-md border border-l-4 border-border p-4 ${stripe}`}>
      <div className="flex flex-wrap items-center gap-2">{badges}</div>
      {title}
      {summary}
      {domains}
    </div>
  );
}

/** A plain table in the standard: head on the surface fill, rows divided. */
function Table({
  caption,
  head,
  rows,
}: {
  caption: string;
  head: string[];
  rows: React.ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-surface text-fg">
          <tr>
            {head.map((cell) => (
              <th key={cell} scope="col" className="px-3 py-2 font-semibold">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border text-fg">
          {rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className={`px-3 py-2 align-top ${cellIndex === 1 ? 'whitespace-nowrap tabular-nums' : ''}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
