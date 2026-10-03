import { useMemo } from 'react';
import { Alert, Button, EmptyState, Loading, Panel } from '../../../ui';
import type { IString } from '../../../types/types';
import type { HoleData } from '../HoleForm';
import { useCaseChildren } from '../useCaseChildren';
import { buildModel, type RawHole, type RawSection } from './schematic';
import { WellSchematic } from './WellSchematic';

/** The «Схема» tab: loads the case's string and hole and draws them together. */
export const SchematicView = ({ caseId, onEdit }: { caseId: string; onEdit: (tab: 'string' | 'hole') => void }) => {
  const strings = useCaseChildren<IString>('strings', caseId);
  const holes = useCaseChildren<HoleData>('holes', caseId);
  const string = strings.items[0];
  const hole = holes.items[0];
  const model = useMemo(() => buildModel((string?.sections ?? null) as RawSection[] | null, (hole ?? null) as RawHole | null), [string, hole]);

  if (strings.loading || holes.loading) return <Loading label="Загрузка колонны и ствола…" />;
  const error = strings.error || holes.error;
  if (error) {
    return <Alert tone="error" title={error} action={<Button size="sm" onClick={() => { strings.reload(); holes.reload(); }}>Повторить</Button>} />;
  }
  if (!model.string.length && !model.hole.length) {
    return (
      <EmptyState title="Схему пока не из чего построить"
        description="Заполните рабочую колонну и секции ствола — схема появится здесь автоматически."
        action={<div className="flex flex-wrap justify-center gap-2">
          <Button variant="primary" onClick={() => onEdit('string')}>Перейти к колонне</Button>
          <Button onClick={() => onEdit('hole')}>Перейти к стволу</Button>
        </div>} />
    );
  }

  const hints = [...model.hints];
  if (strings.items.length > 1) hints.push(`У кейса несколько колонн (${strings.items.length}); показана первая.`);
  return (
    <Panel title="Схема колонны и ствола" bodyClassName="p-3 sm:p-4"
      description={`${string?.name ?? 'Колонна не задана'} · глубина ${model.totalDepth.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} м`}>
      {hints.length > 0 && (
        <Alert tone="info" className="mb-4">
          <ul className="space-y-0.5">{hints.map((h) => <li key={h}>{h}</li>)}</ul>
        </Alert>
      )}
      <WellSchematic model={model} />
    </Panel>
  );
};
