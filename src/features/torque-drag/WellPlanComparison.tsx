import { FC } from 'react';
import { instance } from '../../api/axios.api';
import { useCachedResult } from '../../hooks/useCachedResult';
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
  formula: number | null;
  formula_relative_difference?: number;
}

interface EngineError {
  status: number;
  message: string;
  problems?: string[];
}

interface Comparison {
  bit_depth: number;
  rows: ComparisonRow[];
  notes: string[];
  source_warnings: string[];
  model_error?: EngineError;
  formula_error?: EngineError;
}

const metricLabels = { hook_load: 'Вес на крюке', surface_torque: 'Момент на роторе' };
const metricUnits = { hook_load: 'т', surface_torque: 'кН·м' };
const fmt = (v: number | null | undefined, digits = 2) => (v === null || v === undefined ? '—' : v.toLocaleString('ru-RU', { maximumFractionDigits: digits }));

/** Deviation bar against the report, clipped at ±50 %. */
const Deviation = ({ rel }: { rel?: number }) => {
  if (rel === undefined) return <span className="text-ink-300">—</span>;
  const pct = Math.max(-50, Math.min(50, rel * 100));
  return (
    <span className="flex items-center justify-end gap-2">
      <span className="relative hidden h-1.5 w-16 rounded-full bg-ink-100 sm:block" aria-hidden="true">
        <span className="absolute top-0 h-1.5 w-px bg-ink-500" style={{ left: '50%' }} />
        <span className={cn('absolute top-0 h-1.5 rounded-full', Math.abs(rel) <= 0.1 ? 'bg-ink-500' : 'bg-ink')}
          style={pct >= 0 ? { left: '50%', width: `${pct}%` } : { right: '50%', width: `${-pct}%` }} />
      </span>
      <span className="num w-14 text-right font-mono">{rel > 0 ? '+' : ''}{fmt(rel * 100, 1)} %</span>
    </span>
  );
};

const EngineAlert = ({ title, error }: { title: string; error: EngineError }) => (
  <Alert tone={error.status === 422 ? 'warning' : 'error'} title={`${title}: ${error.message}`}>
    {error.problems && error.problems.length > 0 && <ul className="list-disc space-y-0.5 pl-4">{error.problems.map((p) => <li key={p}>{p}</li>)}</ul>}
  </Alert>
);

const toComparisonError = (error: unknown): PredictionError & { missing?: boolean } => {
  const response = (error as { response?: { status?: number; data?: { message?: string; problems?: string[] } } }).response;
  if (response?.status === 404) return { status: 404, message: '', problems: [], missing: true };
  return {
    status: response?.status, problems: response?.data?.problems ?? [],
    message: response?.status === 422 ? 'Кейс не готов к расчёту Torque & Drag:' : (response?.data?.message ?? 'Не удалось выполнить сравнение.'),
  };
};

/** The report's own results for an imported case beside the formula engine and the model. */
const WellPlanComparison: FC<{ caseId: string }> = ({ caseId }) => {
  const state = useCachedResult<Comparison, PredictionError & { missing?: boolean }>(
    `comparison:${caseId}`,
    async () => (await instance.get<Comparison>(`/api/v1/torque-and-drag/comparison?caseId=${encodeURIComponent(caseId)}`)).data,
    toComparisonError,
  );
  const load = state.reload;

  if (state.loading) return <Loading label="Расчёт и сравнение…" />;
  if (state.error?.missing) return <EmptyState title="Нет эталонных данных" description="Сравнение доступно для импортированных кейсов: эталоном служат результаты из исходного отчёта." />;
  if (!state.data) return <PredictionStatus error={state.error} onRetry={load} />;

  const d = state.data;
  const rows = d.rows.filter((r) => r.wellplan !== null && !(r.metric === 'surface_torque' && r.wellplan === 0));
  const columns: Column<ComparisonRow>[] = [
    { key: 'op', header: 'Операция', render: (r) => operationLabels[r.operation] ?? r.operation },
    { key: 'metric', header: 'Показатель', render: (r) => <span className="whitespace-nowrap">{metricLabels[r.metric]} <span className="text-ink-500">{metricUnits[r.metric]}</span></span> },
    { key: 'wp', header: 'Отчёт', numeric: true, render: (r) => fmt(r.wellplan) },
    { key: 'f', header: 'Формулы', numeric: true, render: (r) => fmt(r.formula) },
    { key: 'fdev', header: 'Откл. формул', numeric: true, render: (r) => <Deviation rel={r.formula_relative_difference} /> },
    { key: 'model', header: 'Модель', numeric: true, render: (r) => fmt(r.model) },
    { key: 'dev', header: 'Откл. модели', numeric: true, render: (r) => <Deviation rel={r.relative_difference} /> },
  ];
  return (
    <div className="space-y-4">
      {d.formula_error && <EngineAlert title="Расчёт по формулам не выполнен" error={d.formula_error} />}
      {d.model_error && <EngineAlert title="Прогноз модели не выполнен" error={d.model_error} />}
      <Panel title="Отчёт, расчёт по формулам и модель" description={`Глубина долота ${fmt(d.bit_depth)} м. Отклонение — относительно эталона из отчёта.`} bodyClassName="p-0">
        <DataTable columns={columns} rows={rows} rowKey={(r) => `${r.operation}-${r.metric}`} caption="Сравнение с отчётом" />
      </Panel>
      <Alert tone="info" title="Как читать">
        <ul className="list-disc space-y-1 pl-4">
          <li>Отчёт — расчёт исходной инженерной программы для той же глубины долота. «Формулы» — стандартный расчёт MunaiPlan по тем же данным. «Модель» — прогноз ML-модели, не валидирован.</li>
          <li>Модель обучена в основном на колоннах 3½–4″; для других типоразмеров расхождение больше.</li>
          {d.notes.map((n) => <li key={n}>{n}</li>)}
          {d.source_warnings.map((w) => <li key={w}>Импорт: {w}</li>)}
        </ul>
      </Alert>
    </div>
  );
};

export default WellPlanComparison;
