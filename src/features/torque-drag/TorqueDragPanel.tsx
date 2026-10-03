import { FC, useState } from 'react';
import { HelpLink } from '../../components/HelpLink';
import { PredictionStatus, UnvalidatedNotice } from '../../components/PredictionStatus';
import { usePrediction, type PredictionEndpoint } from '../../hooks/usePrediction';
import { Button, cn, Loading, Tabs } from '../../ui';
import { DepthChart, type ChartSource } from './DepthChart';
import { families, type FamilySpec } from './families';
import { FormulaNotice, FormulaParameters, FormulaSummary } from './FormulaPanels';
import { useFormula, type Curves, type FormulaOverrides } from './useFormula';
import WellPlanComparison from './WellPlanComparison';

type Mode = 'formula' | 'model' | 'both';
const modes: { key: Mode; label: string; short: string }[] = [
  { key: 'formula', label: 'Расчёт по формулам', short: 'Формулы' },
  { key: 'model', label: 'Прогноз модели', short: 'Модель' },
  { key: 'both', label: 'Наложить оба', short: 'Оба' },
];
const MODE_KEY = 'munaiplan.td.engine';
const readMode = (): Mode => {
  try {
    const v = localStorage.getItem(MODE_KEY);
    return v === 'model' || v === 'both' ? v : 'formula';
  } catch { return 'formula'; }
};

/** The «Расчёт по формулам / Прогноз модели» switch, as a radio group. */
const EngineSwitch = ({ value, onChange }: { value: Mode; onChange: (m: Mode) => void }) => (
  <div role="radiogroup" aria-label="Способ расчёта" className="grid min-w-0 flex-1 grid-cols-3 rounded-md border border-ink-300 p-0.5 sm:inline-flex sm:flex-none">
    {modes.map((m) => (
      <button key={m.key} type="button" role="radio" aria-checked={value === m.key} aria-label={m.label} onClick={() => onChange(m.key)}
        className={cn('whitespace-nowrap rounded px-3 py-1.5 text-xs font-medium transition-colors touch:px-2 touch:py-3 touch:text-sm',
          value === m.key ? 'bg-ink text-paper' : 'text-ink-700 hover:bg-ink-100')}>
        <span className="sm:hidden">{m.short}</span><span className="hidden sm:inline">{m.label}</span>
      </button>
    ))}
  </div>
);

/** One family: the formula curves (shared result), the model's curves, or both on one chart. */
const FamilyView = ({ family, caseId, mode, formula }: {
  family: FamilySpec; caseId: string; mode: Mode; formula: ReturnType<typeof useFormula>;
}) => {
  const wantsModel = mode !== 'formula' && family.engines.includes('model');
  const wantsFormula = mode !== 'model' && family.engines.includes('formula');
  const model = usePrediction<Curves>((wantsModel ? family.key : 'weight-on-bit') as PredictionEndpoint, wantsModel ? caseId : undefined);

  if (mode === 'model' && !family.engines.includes('model')) {
    return <p className="rounded-lg border border-dashed border-ink-300 px-4 py-10 text-center text-sm text-ink-500">Этот график есть только в расчёте по формулам.</p>;
  }
  const loading = (wantsFormula && formula.loading) || (wantsModel && model.loading);
  const sources: ChartSource[] = [];
  if (wantsFormula && formula.data) sources.push({ engine: 'formula', data: formula.data.families[family.key] ?? null });
  if (wantsModel && model.data) sources.push({ engine: 'model', data: model.data });

  if (loading && sources.length === 0) return <Loading label={wantsFormula ? 'Расчёт по формулам…' : 'Расчёт прогноза…'} />;
  return (
    <div className="space-y-3">
      {wantsFormula && formula.error && <PredictionStatus error={formula.error} onRetry={formula.reload} />}
      {wantsModel && model.error && <PredictionStatus error={model.error} onRetry={model.reload} />}
      {sources.length > 0 && <DepthChart family={family} sources={sources} />}
      {wantsFormula && wantsModel && formula.data && model.loading && (
        <p className="text-xs text-ink-500" role="status">Прогноз модели рассчитывается — серые линии появятся через несколько секунд.</p>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          {wantsFormula && formula.data && <FormulaNotice />}
          {wantsModel && model.data && <UnvalidatedNotice />}
        </div>
        <Button size="sm" loading={loading} onClick={() => { if (wantsFormula) formula.reload(); if (wantsModel) model.reload(); }}>Пересчитать</Button>
      </div>
    </div>
  );
};

/** Torque & Drag: an engine switch, one tab per result family, and the three-way comparison with the report. */
const TorqueDragPanel: FC<{ caseId: string }> = ({ caseId }) => {
  const [mode, setModeState] = useState<Mode>(readMode);
  const [overrides, setOverrides] = useState<FormulaOverrides>({});
  const [active, setActive] = useState<string>(families[0].key);
  const setMode = (m: Mode) => { setModeState(m); try { localStorage.setItem(MODE_KEY, m); } catch { /* private mode */ } };
  const formula = useFormula(caseId, overrides, mode !== 'model');

  const visible = families.filter((f) => mode !== 'model' || f.engines.includes('model'));
  const views = [...visible.map((f) => ({ key: f.key as string, label: f.title })), { key: 'comparison', label: 'Сравнение с отчётом' }];
  const family = visible.find((f) => f.key === active);
  const current = family ? active : views.some((v) => v.key === active) ? active : views[0].key;

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <div className="flex items-center justify-between gap-3">
        <EngineSwitch value={mode} onChange={setMode} />
        <HelpLink to="formula" topic="расчёт по формулам и прогноз модели" />
      </div>
      <div className="flex items-center justify-between gap-3">
        <Tabs items={views} value={current} onChange={setActive} variant="pills" label="Результаты Torque & Drag" className="min-w-0" />
        {current === 'comparison'
          ? <HelpLink to="comparison" topic="сравнение с отчётом" />
          : <HelpLink to="depth-charts" topic="как читать графики Torque & Drag" />}
      </div>
      {current === 'comparison'
        ? <WellPlanComparison caseId={caseId} />
        : <FamilyView key={`${current}-${mode}`} family={visible.find((f) => f.key === current) ?? visible[0]} caseId={caseId} mode={mode} formula={formula} />}
      {mode !== 'model' && current !== 'comparison' && formula.data && (
        <div className="grid gap-4 xl:grid-cols-2 [&>*]:min-w-0">
          <FormulaSummary result={formula.data} />
          <FormulaParameters result={formula.data} overrides={overrides} onApply={setOverrides} busy={formula.loading} />
        </div>
      )}
    </div>
  );
};

export default TorqueDragPanel;
