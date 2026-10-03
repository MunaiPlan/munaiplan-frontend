import { useEffect, useState, type FormEvent } from 'react';
import { operationLabels } from '../../services/import.service';
import { Alert, Button, DataTable, KeyValue, Panel, TextField, type Column } from '../../ui';
import type { FormulaOperation, FormulaOverrides, FormulaResult } from './useFormula';

const fmt = (v: number | null | undefined, digits = 2) => (v === null || v === undefined ? '—' : v.toLocaleString('ru-RU', { maximumFractionDigits: digits }));
const sourceLabels = { report: 'из отчёта', default: 'по умолчанию', user: 'задано' } as const;
const bucklingLabels = { '': '—', sinusoidal: 'синусоидальный', helical: 'спиральный' } as const;

/** Formula results at the analysed bit depth, as in a load summary. */
export const FormulaSummary = ({ result }: { result: FormulaResult }) => {
  const columns: Column<FormulaOperation>[] = [
    { key: 'op', header: 'Операция', render: (r) => operationLabels[r.operation] ?? r.operation },
    { key: 'hl', header: 'Вес на крюке', unit: 'т', numeric: true, render: (r) => fmt(r.hook_load) },
    { key: 'tq', header: 'Момент', unit: 'кН·м', numeric: true, render: (r) => fmt(r.surface_torque) },
    { key: 'np', header: 'Нейтр. точка от долота', unit: 'м', numeric: true, render: (r) => fmt(r.neutral_point_from_bit, 0) },
    { key: 'sf', header: 'Макс. боковая сила', unit: 'кН/м', numeric: true, render: (r) => fmt(r.max_side_force) },
    { key: 'b', header: 'Изгиб', render: (r) => bucklingLabels[r.buckling] + (r.buckling ? ` (${fmt(r.buckling_top, 0)}–${fmt(r.buckling_bottom, 0)} м)` : '') },
  ];
  const l = result.limits;
  return (
    <Panel title="Сводка" description={`Расчёт по формулам, долото на ${fmt(result.bit_depth)} м`} bodyClassName="space-y-3 p-0 pb-3">
      <DataTable columns={columns} rows={result.summary} rowKey={(r) => r.operation} caption="Сводка расчёта по формулам" />
      <div className="px-4">
        <KeyValue columns={1} items={[
          { label: 'Запас по затяжке при подъёме', value: l.overpull_margin !== undefined ? `${fmt(l.overpull_margin)} т` : '— (нет предела текучести)' },
          { label: 'Мин. нагрузка до синусоидального изгиба (ротор)', value: l.min_wob_sinusoidal !== undefined ? `${fmt(l.min_wob_sinusoidal)} т на ${fmt(l.min_wob_sinusoidal_depth, 0)} м` : 'не достигается' },
          { label: 'Мин. нагрузка до спирального изгиба (ротор)', value: l.min_wob_helical !== undefined ? `${fmt(l.min_wob_helical)} т на ${fmt(l.min_wob_helical_depth, 0)} м` : 'не достигается' },
        ]} />
      </div>
    </Panel>
  );
};

type Field = { key: keyof FormulaOverrides; label: string; unit?: string; value: number | undefined; source?: string; max: number };

/** Inputs and assumptions of the formula engine; the key parameters can be overridden. */
export const FormulaParameters = ({ result, overrides, onApply, busy }: {
  result: FormulaResult; overrides: FormulaOverrides; onApply: (o: FormulaOverrides) => void; busy: boolean;
}) => {
  const p = result.parameters;
  const cased = p.hole_sections.find((h) => h.cased)?.friction;
  const open = p.hole_sections.find((h) => !h.cased)?.friction;
  const fields: Field[] = [
    { key: 'ff_cased', label: 'Трение в обсадной колонне', value: p.friction_cased ?? cased, source: p.friction_cased !== undefined ? 'user' : 'case', max: 1 },
    { key: 'ff_open', label: 'Трение в открытом стволе', value: p.friction_open ?? open, source: p.friction_open !== undefined ? 'user' : 'case', max: 1 },
    { key: 'wob', label: 'Нагрузка на долото, ротор', unit: 'т', value: p.wob_rotating, source: p.sources.wob_rotating, max: 200 },
    { key: 'wob_slide', label: 'Нагрузка на долото, ГЗД', unit: 'т', value: p.wob_sliding, source: p.sources.wob_sliding, max: 200 },
    { key: 'tob', label: 'Момент на долоте', unit: 'кН·м', value: p.tob, source: p.sources.tob, max: 200 },
    { key: 'block_weight', label: 'Вес талевого блока', unit: 'т', value: p.block_weight, source: p.sources.block_weight, max: 500 },
  ];
  const [draft, setDraft] = useState<Record<string, string>>({});
  useEffect(() => { setDraft(Object.fromEntries(fields.map((f) => [f.key, f.value === undefined ? '' : String(f.value)]))); },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [result]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: FormulaOverrides = { ...overrides };
    for (const f of fields) {
      const raw = (draft[f.key] ?? '').replace(',', '.').trim();
      const v = Number(raw);
      if (raw === '' || !Number.isFinite(v)) delete next[f.key];
      else if (v !== f.value || overrides[f.key] !== undefined) next[f.key] = v;
    }
    onApply(next);
  };
  const hint = (f: Field) => f.source === 'case' ? 'из данных кейса' : f.source ? sourceLabels[f.source as keyof typeof sourceLabels] : undefined;
  const userSet = Object.keys(overrides).length > 0;

  return (
    <Panel title="Параметры расчёта" description="Что использовано в расчёте по формулам. Ключевые параметры можно изменить.">
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {fields.map((f) => (
            <TextField key={f.key} label={f.label} unit={f.unit} type="number" inputMode="decimal" step="any" min={0} max={f.max}
              value={draft[f.key] ?? ''} hint={hint(f)} onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))} />
          ))}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="submit" variant="primary" size="sm" disabled={busy}>{busy ? 'Расчёт…' : 'Пересчитать'}</Button>
          {userSet && <Button type="button" size="sm" disabled={busy} onClick={() => onApply({})}>Сбросить к данным кейса</Button>}
        </div>
      </form>
      <div className="mt-4 space-y-4 border-t border-ink-200 pt-4">
        <KeyValue items={[
          { label: 'Плотность раствора', value: `${fmt(p.mud_density, 0)} кг/м³` },
          { label: 'Коэффициент плавучести', value: fmt(p.buoyancy_factor, 4) },
          { label: 'Шаг расчёта', value: `${fmt(p.step, 1)} м` },
          { label: 'Скорость СПО', value: `${fmt(p.trip_speed, 1)} м/мин` },
          { label: 'Предел натяжения', value: `${fmt(p.yield_fraction * 100, 0)} % предела текучести` },
          { label: 'Сталь', value: `${fmt(p.steel_density, 0)} кг/м³, E = ${fmt(p.young_modulus, 1)} ГПа` },
        ]} />
        <DataTable caption="Секции ствола в расчёте" rows={p.hole_sections} rowKey={(h) => `${h.top}-${h.bottom}`} columns={[
          { key: 'i', header: 'Интервал', unit: 'м', render: (h) => `${fmt(h.top, 0)}–${fmt(h.bottom, 0)}` },
          { key: 't', header: 'Тип', render: (h) => (h.cased ? 'обсадная колонна' : 'открытый ствол') },
          { key: 'd', header: 'Диаметр', unit: 'мм', numeric: true, render: (h) => fmt(h.diameter, 1) },
          { key: 'f', header: 'Трение', numeric: true, render: (h) => fmt(h.friction) },
        ]} />
        {result.warnings.length > 0 && (
          <Alert tone="warning" title="Обратите внимание">
            <ul className="list-disc space-y-0.5 pl-4">{result.warnings.map((w) => <li key={w}>{w}</li>)}</ul>
          </Alert>
        )}
        <details className="group text-sm">
          <summary className="cursor-pointer select-none text-xs font-medium text-ink-700 hover:text-ink touch:min-h-[2.75rem] touch:py-3">Допущения расчёта</summary>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-[13px] leading-relaxed text-ink-700">{result.assumptions.map((a) => <li key={a}>{a}</li>)}</ul>
        </details>
      </div>
    </Panel>
  );
};

/** Shown with formula results: a standard engineering calculation, with its inputs one click away. */
export const FormulaNotice = () => (
  <p className="text-xs text-ink-500">
    Инженерный расчёт по формулам (модель мягкой нити). Результат определяется данными кейса и параметрами ниже.
  </p>
);
