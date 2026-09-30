import { FC, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { apiErrorMessage } from '../services/admin.service';
import { importService, operationLabels, type ImportPreview, type WellPlanFiles } from '../services/import.service';
import { treeChanged } from '../features/hierarchy/treeEvents';
import { Alert, Button, DataTable, FileDrop, KeyValue, PageHeader, Panel, type Column } from '../ui';

const fmt = (value: number | null | undefined, digits = 2) =>
  value === null || value === undefined ? null : value.toLocaleString('ru-RU', { maximumFractionDigits: digits });

type Component = ImportPreview['report']['string'][number];
type Load = NonNullable<ImportPreview['report']['torque_drag']>['load_summary'][number];

const stringColumns: Column<Component>[] = [
  { key: 'type', header: 'Элемент', render: (c) => c.type },
  { key: 'length', header: 'Длина', unit: 'м', numeric: true, render: (c) => fmt(c.length) },
  { key: 'depth', header: 'Низ', unit: 'м', numeric: true, render: (c) => fmt(c.depth) },
  { key: 'od', header: 'Нар. диаметр', unit: 'мм', numeric: true, render: (c) => fmt(c.body_od) },
  { key: 'weight', header: 'Вес', unit: 'кг/м', numeric: true, render: (c) => fmt(c.weight) ?? '—' },
  { key: 'grade', header: 'Марка', render: (c) => c.grade ?? '—' },
];

const loadColumns: Column<Load>[] = [
  { key: 'op', header: 'Операция', render: (l) => operationLabels[l.operation] ?? l.label },
  { key: 'hook', header: 'Вес на крюке', unit: 'т', numeric: true, render: (l) => fmt(l.hook_load) ?? '—' },
  { key: 'torque', header: 'Момент на роторе', unit: 'кН·м', numeric: true, render: (l) => fmt(l.surface_torque, 3) ?? '—' },
];

const PreviewSummary: FC<{ preview: ImportPreview }> = ({ preview }) => {
  const { report } = preview;
  const survey = report.survey;
  const loads = report.torque_drag?.load_summary ?? [];
  const c = report.case;
  return (
    <div className="space-y-5">
      {preview.duplicate && (
        <Alert tone="warning" title="Эти файлы уже импортированы"
          action={<Link className="text-sm underline" to={`/cases/${preview.duplicate.case_id}`}>Открыть кейс</Link>}>
          Повторный импорт тех же файлов не выполняется.
        </Alert>
      )}
      <Panel title="Будет создано" description="Существующие уровни с тем же названием будут использованы повторно; траектория и кейс создаются всегда.">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm">
          {[c.company, c.field, c.site, c.well, c.wellbore, c.design, c.case].map((name, i) => (
            <li key={i} className="flex min-w-0 items-center gap-1.5 break-words">
              {i > 0 && <span className="text-ink-300" aria-hidden="true">/</span>}
              <span className={i === 6 ? 'font-semibold' : ''}>{name || '—'}</span>
            </li>
          ))}
        </ol>
        <KeyValue className="mt-4" columns={3} items={[
          { label: 'Точек инклинометрии', value: survey.length },
          { label: 'Интервал MD', value: survey.length ? `${fmt(survey[0].md)} – ${fmt(survey[survey.length - 1].md)}` : null, unit: 'м' },
          { label: 'Элементов колонны', value: report.string.length },
          { label: 'Секций ствола', value: report.hole_sections.length },
          { label: 'Раствор', value: report.fluid?.name },
          { label: 'Плотность раствора', value: fmt(report.fluid?.density, 0), unit: 'кг/м³' },
        ]} />
      </Panel>
      {report.string.length > 0 && (
        <Panel title="Рабочая колонна" bodyClassName="p-0">
          <DataTable columns={stringColumns} rows={report.string} rowKey={(_, i) => String(i)} caption="Рабочая колонна" />
        </Panel>
      )}
      {loads.length > 0 && (
        <Panel title="Результаты WellPlan (эталон)" description="Сохраняются вместе с кейсом для сравнения с прогнозом MunaiPlan." bodyClassName="p-0">
          <DataTable columns={loadColumns} rows={loads} rowKey={(l) => l.operation} caption="Результаты WellPlan" />
        </Panel>
      )}
      {report.warnings.length > 0 && (
        <Alert tone="info" title={`Замечания (${report.warnings.length})`}>
          <ul className="list-disc space-y-0.5 pl-4">{report.warnings.map((w) => <li key={w}>{w}</li>)}</ul>
        </Alert>
      )}
    </div>
  );
};

const ImportPage: FC = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<WellPlanFiles>({});
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [busy, setBusy] = useState<'check' | 'commit' | null>(null);
  const [error, setError] = useState('');

  const choose = (key: keyof WellPlanFiles) => (file: File | null) => {
    setFiles((current) => ({ ...current, [key]: file }));
    setPreview(null);
    setError('');
  };

  const run = async (kind: 'check' | 'commit', action: () => Promise<void>) => {
    setBusy(kind);
    setError('');
    try {
      await action();
    } catch (e) {
      setError(apiErrorMessage(e, 'Не удалось обработать файлы'));
    } finally {
      setBusy(null);
    }
  };

  const check = () => run('check', async () => setPreview(await importService.preview(files)));
  const commit = () => run('commit', async () => {
    const result = await importService.commit(files);
    treeChanged();
    toast.success('Кейс импортирован');
    navigate(`/cases/${result.case_id}`);
  });

  const hasFiles = Boolean(files.report || files.survey);
  return (
    <div className="mx-auto max-w-5xl space-y-5 p-4 md:p-6">
      <PageHeader eyebrow="Данные" title="Импорт из WellPlan"
        meta="Отчёт WellPlan (.docx, рус./англ.) и/или экспорт инклинометрии (.txt). Значения сохраняются в единицах WellPlan: м, мм, кг/м, °, psi." />
      <Panel>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FileDrop label="Отчёт WellPlan" accept=".docx" file={files.report} onChange={choose('report')}
            hint="Колонна, ствол, раствор, траектория и результаты Torque & Drag." />
          <FileDrop label="Инклинометрия WellPlan" accept=".txt" file={files.survey} onChange={choose('survey')}
            hint="Нужна, если в отчёте нет траектории. Добавляет абс. отметки и координаты." />
        </div>
        {error && <Alert className="mt-4" tone="error">{error}</Alert>}
        <div className="mt-5 flex flex-col gap-3 border-t border-ink-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-xs text-ink-500">
            {preview ? <><FiCheck aria-hidden="true" /> Проверено — просмотрите данные ниже</> : '1. Проверьте файлы  →  2. Импортируйте'}
          </p>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <Button disabled={!hasFiles} loading={busy === 'check'} onClick={check}>Проверить</Button>
            <Button variant="primary" disabled={!preview || Boolean(preview.duplicate)} loading={busy === 'commit'} onClick={commit}>Импортировать</Button>
          </div>
        </div>
      </Panel>
      {preview && <PreviewSummary preview={preview} />}
    </div>
  );
};

export default ImportPage;
