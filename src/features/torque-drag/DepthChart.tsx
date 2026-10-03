import { useMemo, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { cn, DataTable, type Column } from '../../ui';
import { engineLabels, modelStroke, strokes, type Engine, type FamilySpec, type SeriesSpec } from './families';
import type { Curves } from './useFormula';

const DEPTH = 'Глубина';
const fmt = (v: number | null | undefined) => (v === null || v === undefined || !Number.isFinite(v) ? '—' : v.toLocaleString('ru-RU', { maximumFractionDigits: 2 }));
const shortEngine: Record<Engine, string> = { formula: 'формулы', model: 'модель' };

export interface ChartSource {
  engine: Engine;
  data: Curves | null;
}

interface Plotted extends SeriesSpec {
  id: string; // `${engine}:${key}`
  engine: Engine;
  stroke: { stroke: string; width: number; dash?: string };
}

type Row = Record<string, number | null>;

/**
 * One family plotted against depth (depth downward). With two sources the formula curves are
 * black and the model's grey, each operation keeping its dash pattern. The legend toggles
 * series; the table view lists the same values.
 */
export const DepthChart = ({ family, sources }: { family: FamilySpec; sources: ChartSource[] }) => {
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [view, setView] = useState<'chart' | 'table'>('chart');
  const overlay = sources.filter((s) => s.data).length > 1;

  const plotted = useMemo<Plotted[]>(() => sources.flatMap(({ engine, data }) => family.series
    .filter((s) => data?.[s.key]?.some((v) => v !== null && Number.isFinite(v)))
    .map((s) => ({ ...s, id: `${engine}:${s.key}`, engine, label: overlay ? `${s.label} · ${shortEngine[engine]}` : s.label,
      stroke: engine === 'model' && overlay ? modelStroke(s.style) : strokes[s.style] }))), [family, sources, overlay]);

  // Rows on the union of both engines' depth grids; a series is null where its source has no point.
  const rows = useMemo<Row[]>(() => {
    const byDepth = new Map<number, Row>();
    for (const { engine, data } of sources) {
      const depth = data?.[DEPTH] ?? [];
      depth.forEach((d, i) => {
        if (d === null) return;
        const row = byDepth.get(d) ?? { depth: d };
        for (const p of plotted) if (p.engine === engine) row[p.id] = data?.[p.key]?.[i] ?? null;
        byDepth.set(d, row);
      });
    }
    return [...byDepth.values()].sort((a, b) => (a.depth as number) - (b.depth as number));
  }, [sources, plotted]);

  const toggle = (id: string) => setHidden((h) => { const n = new Set(h); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const columns: Column<Row>[] = [
    { key: 'depth', header: family.depthLabel.replace(/, м$/, ''), unit: 'м', numeric: true, render: (r) => fmt(r.depth) },
    ...plotted.filter((p) => !hidden.has(p.id)).map((p) => ({ key: p.id, header: p.label, unit: family.unit, numeric: true, render: (r: Row) => fmt(r[p.id]) })),
  ];

  if (plotted.length === 0) return <p className="rounded-lg border border-dashed border-ink-300 px-4 py-10 text-center text-sm text-ink-500">Нет данных для этого графика.</p>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <ul className="flex flex-wrap gap-x-4 gap-y-1.5 touch:gap-y-0" aria-label="Серии">
          {plotted.map((p) => {
            const off = hidden.has(p.id);
            return (
              <li key={p.id}>
                <button type="button" aria-pressed={!off} onClick={() => toggle(p.id)}
                  className={cn('flex items-center gap-1.5 text-left text-xs touch:min-h-[2.75rem] touch:text-sm', off ? 'text-ink-300 line-through' : 'text-ink-700 hover:text-ink')}>
                  <svg width="22" height="6" aria-hidden="true"><line x1="0" y1="3" x2="22" y2="3" stroke={off ? '#D4D4D8' : p.stroke.stroke} strokeWidth={p.stroke.width} strokeDasharray={p.stroke.dash} /></svg>
                  {p.label}
                </button>
              </li>
            );
          })}
        </ul>
        <div className="flex gap-1 rounded-md bg-ink-100 p-0.5 text-xs">
          {(['chart', 'table'] as const).map((v) => (
            <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)}
              className={cn('rounded px-2.5 py-1 touch:px-4 touch:py-2.5 touch:text-sm', view === v ? 'bg-paper font-medium shadow-panel' : 'text-ink-500 hover:text-ink')}>
              {v === 'chart' ? 'График' : 'Таблица'}
            </button>
          ))}
        </div>
      </div>
      {overlay && (
        <p className="text-xs text-ink-500">Чёрные линии — {engineLabels.formula.toLowerCase()}, серые — {engineLabels.model.toLowerCase()}; тип штриха обозначает операцию.</p>
      )}

      {view === 'chart' ? (
        <div className="h-[26rem] rounded-lg border border-ink-200 p-2 sm:h-[30rem] md:h-[34rem] md:p-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart layout="vertical" data={rows} margin={{ top: 8, right: 16, bottom: 24, left: 0 }}>
              <CartesianGrid stroke="#E4E4E7" strokeDasharray="2 4" />
              <XAxis type="number" domain={['auto', 'auto']} stroke="#71717A" fontSize={11} tickLine={false}
                label={{ value: `${family.xLabel}, ${family.unit}`, position: 'insideBottom', offset: -14, fontSize: 11, fill: '#71717A' }} />
              <YAxis type="number" dataKey="depth" domain={[0, 'dataMax']} stroke="#71717A" fontSize={11} tickLine={false} width={60}
                label={{ value: family.depthLabel, angle: -90, position: 'insideLeft', fontSize: 11, fill: '#71717A' }} />
              <Tooltip labelFormatter={(d: number) => `${family.depthLabel.replace(/, м$/, '')} ${fmt(d)} м`}
                formatter={(v: number, name: string) => [`${fmt(v)} ${family.unit}`, name]}
                contentStyle={{ border: '1px solid #0A0A0A', borderRadius: 6, fontSize: 12 }} />
              {plotted.filter((p) => !hidden.has(p.id)).map((p) => (
                <Line key={p.id} dataKey={p.id} name={p.label} type="linear" stroke={p.stroke.stroke} strokeWidth={p.stroke.width}
                  strokeDasharray={p.stroke.dash} dot={false} connectNulls isAnimationActive={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <DataTable columns={columns} rows={rows} rowKey={(r) => String(r.depth)} maxHeight="34rem" caption={family.title} />
      )}
      {family.note && <p className="text-xs text-ink-500">{family.note}</p>}
    </div>
  );
};
