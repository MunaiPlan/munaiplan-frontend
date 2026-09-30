import { FC, useCallback, useEffect, useState } from 'react';
import { instance } from '../../api/axios.api';
import { PredictionStatus } from '../../components/PredictionStatus';
import type { PredictionError } from '../../hooks/usePrediction';
import { operationLabels } from '../../services/import.service';
import { Alert, cn, DataTable, EmptyState, Loading, Panel, type Column } from '../../ui';

interface ComparisonRow {
  operation: string;
  metric: 'hook_load' | 'surface_torque';
  wellplan: number | null;
  model: number | null;
  relative_difference?: number;
}

interface Comparison {
  bit_depth: number;
  rows: ComparisonRow[];
  notes: string[];
  source_warnings: string[];
}

const metricLabels = { hook_load: 'Вес на крюке', surface_torque: 'Момент на роторе' };
const metricUnits = { hook_load: 'т', surface_torque: 'кН·м' };
const fmt = (v: number | null | undefined, digits = 2) => (v === null || v === undefined ? '—' : v.toLocaleString('ru-RU', { maximumFractionDigits: digits }));

/** Deviation bar: model vs WellPlan, clipped at ±50 %. */
const Deviation = ({ rel }: { rel?: number }) => {
  if (rel === undefined) return <span className="text-ink-300">—</span>;
  const pct = Math.max(-50, Math.min(50, rel * 100));
  return (
    <span className="flex items-center justify-end gap-2">
      <span className="relative h-1.5 w-24 rounded-full bg-ink-100" aria-hidden="true">
        <span className="absolute top-0 h-1.5 w-px bg-ink-500" style={{ left: '50%' }} />
        <span className={cn('absolute top-0 h-1.5 rounded-full', Math.abs(rel) <= 0.1 ? 'bg-ink-500' : 'bg-ink')}
          style={pct >= 0 ? { left: '50%', width: `${pct}%` } : { right: '50%', width: `${-pct}%` }} />
      </span>
      <span className="num w-14 text-right font-mono">{rel > 0 ? '+' : ''}{fmt(rel * 100, 1)} %</span>
    </span>
  );
};

/** WellPlan's own results for an imported case beside the model's matching values. */
const WellPlanComparison: FC<{ caseId: string }> = ({ caseId }) => {
  const [state, setState] = useState<{ loading: boolean; data: Comparison | null; error: PredictionError | null; missing: boolean }>(
    { loading: true, data: null, error: null, missing: false });

  const load = useCallback(async () => {
    setState({ loading: true, data: null, error: null, missing: false });
    try {
      const { data } = await instance.get<Comparison>(`/api/v1/torque-and-drag/comparison?caseId=${encodeURIComponent(caseId)}`);
      setState({ loading: false, data, error: null, missing: false });
    } catch (error) {
      const response = (error as { response?: { status?: number; data?: { message?: string; problems?: string[] } } }).response;
      if (response?.status === 404) { setState({ loading: false, data: null, error: null, missing: true }); return; }
      setState({ loading: false, data: null, missing: false, error: {
        status: response?.status, problems: response?.data?.problems ?? [],
        message: response?.status === 422 ? 'Кейс не готов к расчёту Torque & Drag:' : (response?.data?.message ?? 'Не удалось выполнить сравнение.'),
      } });
    }
  }, [caseId]);
  useEffect(() => { load(); }, [load]);

  if (state.loading) return <Loading label="Расчёт и сравнение… (до минуты)" />;
  if (state.missing) return <EmptyState title="Нет эталонных данных" description="Сравнение доступно для импортированных кейсов: эталоном служат результаты из исходного отчёта." />;
  if (!state.data) return <PredictionStatus error={state.error} onRetry={load} />;

  const rows = state.data.rows.filter((r) => r.wellplan !== null && !(r.metric === 'surface_torque' && r.wellplan === 0));
  const columns: Column<ComparisonRow>[] = [
    { key: 'op', header: 'Операция', render: (r) => operationLabels[r.operation] ?? r.operation },
    { key: 'metric', header: 'Показатель', render: (r) => <>{metricLabels[r.metric]} <span className="text-ink-500">{metricUnits[r.metric]}</span></> },
    { key: 'wp', header: 'Отчёт', numeric: true, render: (r) => fmt(r.wellplan) },
    { key: 'model', header: 'Модель', numeric: true, render: (r) => fmt(r.model) },
    { key: 'dev', header: 'Отклонение', numeric: true, render: (r) => <Deviation rel={r.relative_difference} /> },
  ];
  return (
    <div className="space-y-4">
      <Panel title="Модель и эталон из отчёта" description={`Глубина долота ${fmt(state.data.bit_depth)} м`} bodyClassName="p-0">
        <DataTable columns={columns} rows={rows} rowKey={(r) => `${r.operation}-${r.metric}`} caption="Сравнение с отчётом" />
      </Panel>
      <Alert tone="info" title="Как читать">
        <ul className="list-disc space-y-1 pl-4">
          <li>Модель обучена в основном на колоннах 3½–4″; для других типоразмеров расхождение больше (см. отчёт о валидации).</li>
          {state.data.notes.map((n) => <li key={n}>{n}</li>)}
          {state.data.source_warnings.map((w) => <li key={w}>Импорт: {w}</li>)}
        </ul>
      </Alert>
    </div>
  );
};

export default WellPlanComparison;
