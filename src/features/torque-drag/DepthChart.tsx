import { useMemo, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { usePrediction } from '../../hooks/usePrediction';
import { PredictionStatus, UnvalidatedNotice } from '../../components/PredictionStatus';
import { Button, cn, DataTable, Loading, type Column } from '../../ui';
import { strokes, type FamilySpec } from './families';

type Series = Record<string, number[]>;
const DEPTH = 'Глубина';
const fmt = (v: number) => v.toLocaleString('ru-RU', { maximumFractionDigits: 2 });

/** One model family plotted against depth (depth downward), with a legend that toggles series and a table view. */
export const DepthChart = ({ family, caseId }: { family: FamilySpec; caseId: string }) => {
  const { data, loading, error, reload } = usePrediction<Series>(family.endpoint, caseId);
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [view, setView] = useState<'chart' | 'table'>('chart');
  const series = useMemo(() => family.series.filter((s) => data?.[s.key]), [family, data]);
  const rows = useMemo(() => (data?.[DEPTH] ?? []).map((depth, i) =>
    Object.fromEntries([['depth', depth], ...series.map((s) => [s.key, data?.[s.key]?.[i]])]) as Record<string, number>), [data, series]);

  if (loading) return <Loading label="Расчёт прогноза…" />;
  if (!data) return <PredictionStatus error={error} onRetry={reload} />;

  const toggle = (key: string) => setHidden((h) => { const n = new Set(h); if (n.has(key)) n.delete(key); else n.add(key); return n; });
  const columns: Column<Record<string, number>>[] = [
    { key: 'depth', header: 'MD', unit: 'м', numeric: true, render: (r) => fmt(r.depth) },
    ...series.map((s) => ({ key: s.key, header: s.label, unit: family.unit, numeric: true, render: (r: Record<string, number>) => fmt(r[s.key]) })),
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <ul className="flex flex-wrap gap-x-4 gap-y-1.5 touch:gap-y-0" aria-label="Серии">
          {series.map((s) => {
            const st = strokes[s.style];
            const off = hidden.has(s.key);
            return (
              <li key={s.key}>
                <button type="button" aria-pressed={!off} onClick={() => toggle(s.key)}
                  className={cn('flex items-center gap-1.5 text-left text-xs touch:min-h-[2.75rem] touch:text-sm', off ? 'text-ink-300 line-through' : 'text-ink-700 hover:text-ink')}>
                  <svg width="22" height="6" aria-hidden="true"><line x1="0" y1="3" x2="22" y2="3" stroke={off ? '#D4D4D8' : st.stroke} strokeWidth={st.width} strokeDasharray={st.dash} /></svg>
                  {s.label}
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

      {view === 'chart' ? (
        <div className="h-[26rem] rounded-lg border border-ink-200 p-2 sm:h-[30rem] md:h-[34rem] md:p-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart layout="vertical" data={rows} margin={{ top: 8, right: 16, bottom: 24, left: 0 }}>
              <CartesianGrid stroke="#E4E4E7" strokeDasharray="2 4" />
              <XAxis type="number" domain={['auto', 'auto']} stroke="#71717A" fontSize={11} tickLine={false}
                label={{ value: `${family.xLabel}, ${family.unit}`, position: 'insideBottom', offset: -14, fontSize: 11, fill: '#71717A' }} />
              <YAxis type="number" dataKey="depth" domain={[0, "dataMax"]} stroke="#71717A" fontSize={11} tickLine={false} width={60}
                label={{ value: 'MD, м', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#71717A' }} />
              <Tooltip labelFormatter={(d: number) => `MD ${fmt(d)} м`} formatter={(v: number, name: string) => [`${fmt(v)} ${family.unit}`, name]}
                contentStyle={{ border: '1px solid #0A0A0A', borderRadius: 6, fontSize: 12 }} />
              {series.filter((s) => !hidden.has(s.key)).map((s) => {
                const st = strokes[s.style];
                return <Line key={s.key} dataKey={s.key} name={s.label} type="linear" stroke={st.stroke} strokeWidth={st.width}
                  strokeDasharray={st.dash} dot={false} isAnimationActive={false} />;
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <DataTable columns={columns} rows={rows} rowKey={(r) => String(r.depth)} maxHeight="34rem" caption={family.title} />
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 flex-1"><UnvalidatedNotice /></div>
        <Button size="sm" onClick={reload}>Пересчитать</Button>
      </div>
      {family.note && <p className="text-xs text-ink-500">{family.note}</p>}
    </div>
  );
};
