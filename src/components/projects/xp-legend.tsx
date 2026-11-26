import { getTranslations } from 'next-intl/server';
import { DataTable } from '@/components/ui/table';
import {
  PROJECT_DIFFICULTIES,
  XP_EVIDENCE_BONUS,
  XP_EVIDENCE_KINDS,
  XP_LEVEL_BASE,
  XP_MAX_BONUS,
} from '@/lib/skill-taxonomy';

/**
 * The XP rubric of ADR-0013 as two tables, built from the same constants the
 * score uses, so the legend can never disagree with the numbers on the cards.
 */
export async function XpLegend() {
  const t = await getTranslations('projects');

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <DataTable
        caption={t('xp.level')}
        head={[t('xp.level'), t('xp.band'), t('xp.criterion')]}
        numericColumn={1}
        rows={PROJECT_DIFFICULTIES.map((level) => [
          t(`filters.levels.${level}`),
          t('xp.bandRange', { min: XP_LEVEL_BASE[level], max: XP_LEVEL_BASE[level] + XP_MAX_BONUS }),
          t(`xp.criteria.${level}`),
        ])}
      />
      <DataTable
        caption={t('xp.evidence')}
        head={[t('xp.evidence'), t('xp.bonus'), t('xp.proof')]}
        numericColumn={1}
        rows={XP_EVIDENCE_KINDS.map((kind) => [
          t(`xp.kinds.${kind}`),
          `+${XP_EVIDENCE_BONUS}`,
          t(`xp.proofs.${kind}`),
        ])}
      />
    </div>
  );
}
