import { Badge, KeyValue, Panel } from '../../ui';
import type { WellPlanReport } from '../../services/import.service';

const kb = (bytes: number) => `${Math.max(1, Math.round(bytes / 1024))} КБ`;

/** Provenance of an imported case: source files and what the importer had to derive or assume. */
export const CaseSource = ({ report }: { report: WellPlanReport }) => (
  <Panel title="Источник: WellPlan" description="Кейс создан импортом; эталонные результаты WellPlan сохранены для сравнения.">
    <ul className="mb-4 space-y-1 text-sm">
      {report.sources.map((s) => (
        <li key={s.name} className="flex items-center gap-2">
          <Badge tone="outline">{s.kind === 'report' ? 'Отчёт' : 'Инклинометрия'}</Badge>
          <span className="truncate">{s.name}</span><span className="text-xs text-ink-500">{kb(s.bytes)}</span>
        </li>
      ))}
    </ul>
    <KeyValue columns={3} items={[
      { label: 'Точек инклинометрии', value: report.survey.length },
      { label: 'Элементов колонны', value: report.string.length },
      { label: 'Секций ствола', value: report.hole_sections.length },
    ]} />
    {report.warnings.length > 0 && (
      <details className="mt-4 text-xs text-ink-700">
        <summary className="cursor-pointer font-medium">Замечания импорта ({report.warnings.length})</summary>
        <ul className="mt-2 list-disc space-y-1 pl-5">{report.warnings.map((w) => <li key={w}>{w}</li>)}</ul>
      </details>
    )}
  </Panel>
);
