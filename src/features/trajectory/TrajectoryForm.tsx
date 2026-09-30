import { useState, type ClipboardEvent } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { instance } from '../../api/axios.api';
import { apiErrorMessage } from '../../services/admin.service';
import { treeChanged } from '../hierarchy/treeEvents';
import { Alert, Button, Panel, TextAreaField, TextField } from '../../ui';
import { surveyColumns, type ColumnKey } from './survey';



type Row = { id?: string } & Record<ColumnKey, string>;

const headerFields = [
  ['customer', 'Заказчик'], ['project', 'Проект'], ['profile_type', 'Тип профиля'], ['field', 'Месторождение'],
  ['your_ref', 'Ссылка'], ['structure', 'Структура'], ['job_number', 'Номер работы'], ['wellhead', 'Устье'],
  ['profile', 'Профиль'],
] as const;

export interface TrajectoryData {
  id?: string;
  name: string;
  description: string;
  headers?: ({ id?: string; kelly_bushing_elev?: number } & Record<string, unknown>)[];
  units?: ({ id?: string } & Record<string, unknown>)[];
}

const emptyRow = (): Row => Object.fromEntries(surveyColumns.map((c) => [c.key, ''])) as Row;
const num = (s: string) => Number(s.trim().replace(',', '.'));

/** Parses rows copied from WellPlan or a spreadsheet (tab/semicolon/space separated), in column order. */
const parsePasted = (text: string): Row[] => text.split(/\r?\n/)
  .map((line) => line.trim().split(/\t|;|\s{2,}|\s(?=-?\d)/).map((c) => c.trim()).filter(Boolean))
  .filter((cells) => cells.length >= 4 && cells.every((c) => Number.isFinite(num(c))))
  .map((cells) => Object.fromEntries(surveyColumns.map((c, i) => [c.key, cells[i] ?? ''])) as Row);

const validate = (rows: Row[]): string[] => {
  const problems: string[] = [];
  if (rows.length < 2) problems.push('Нужно минимум две точки инклинометрии.');
  rows.forEach((r, i) => {
    surveyColumns.forEach((c) => {
      const v = r[c.key].trim();
      if (v === '' && 'required' in c) problems.push(`Строка ${i + 1}: заполните «${c.label}».`);
      else if (v !== '' && !Number.isFinite(num(v))) problems.push(`Строка ${i + 1}: «${c.label}» — не число.`);
    });
    const inc = num(r.incl), azi = num(r.azim);
    if (inc < 0 || inc > 180) problems.push(`Строка ${i + 1}: зенитный угол вне 0–180°.`);
    if (azi < 0 || azi >= 360) problems.push(`Строка ${i + 1}: азимут вне 0–360°.`);
    if (i > 0 && num(r.md) <= num(rows[i - 1].md)) problems.push(`Строка ${i + 1}: MD должна возрастать.`);
  });
  return problems.slice(0, 8);
};

/** Create or edit a trajectory: header and survey stations. Row ids are kept so the API updates in place. */
export const TrajectoryForm = ({ designId, initial, onSaved, onCancel }: {
  designId?: string; initial?: TrajectoryData; onSaved: () => void; onCancel: () => void;
}) => {
  const header0 = initial?.headers?.[0];
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [header, setHeader] = useState<Record<string, string>>(
    Object.fromEntries([...headerFields.map(([k]) => [k, String(header0?.[k] ?? '')]), ['kelly_bushing_elev', String(header0?.kelly_bushing_elev ?? '')]]));
  const [rows, setRows] = useState<Row[]>(() => initial?.units?.length
    ? initial.units.map((u) => ({ id: u.id, ...Object.fromEntries(surveyColumns.map((c) => [c.key, String(u[c.key] ?? '')])) }) as Row)
    : [emptyRow(), emptyRow()]);
  const [problems, setProblems] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const setCell = (i: number, key: ColumnKey, value: string) => setRows((rs) => rs.map((r, j) => (j === i ? { ...r, [key]: value } : r)));

  const onPaste = (e: ClipboardEvent, index: number) => {
    const pasted = parsePasted(e.clipboardData.getData('text'));
    if (pasted.length < 2) return; // a single value: let the input handle it
    e.preventDefault();
    setRows((rs) => [...rs.slice(0, index).filter((r) => r.md.trim() !== ''), ...pasted]);
  };

  const submit = async () => {
    const issues = [...(name.trim() ? [] : ['Укажите название траектории.']), ...validate(rows)];
    setProblems(issues);
    if (issues.length) return;
    setSaving(true);
    setError('');
    const body = {
      name: name.trim(), description: description.trim(),
      headers: [{ ...(header0?.id ? { id: header0.id } : {}), ...Object.fromEntries(headerFields.map(([k]) => [k, header[k].trim()])),
        kelly_bushing_elev: header.kelly_bushing_elev.trim() ? num(header.kelly_bushing_elev) : 0 }],
      units: rows.map((r) => ({ ...(r.id ? { id: r.id } : {}),
        ...Object.fromEntries(surveyColumns.map((c) => [c.key, r[c.key].trim() === '' ? 0 : num(r[c.key])])) })),
    };
    try {
      if (initial?.id) await instance.put(`/api/v1/trajectories/${initial.id}`, body);
      else await instance.post(`/api/v1/trajectories/?designId=${encodeURIComponent(designId ?? '')}`, body);
      treeChanged();
      onSaved();
    } catch (e) {
      setError(apiErrorMessage(e, 'Не удалось сохранить траекторию.'));
    } finally {
      setSaving(false);
    }
  };

  const cell = 'h-7 touch:h-11 w-full min-w-[5.5rem] border-0 bg-transparent px-2 text-right font-mono text-xs num focus:bg-paper focus:outline-none focus:ring-1 focus:ring-inset focus:ring-ink';

  return (
    <div className="space-y-5">
      <Panel title="Общее">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextField label="Название" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField label="Альтитуда стола ротора" unit="м" value={header.kelly_bushing_elev} inputMode="decimal"
            onChange={(e) => setHeader({ ...header, kelly_bushing_elev: e.target.value })} className="num text-right font-mono" />
          <TextAreaField label="Описание" containerClassName="md:col-span-2" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <details className="mt-4">
          <summary className="cursor-pointer text-xs font-medium text-ink-700">Заголовок отчёта (необязательно)</summary>
          <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-3">
            {headerFields.map(([k, label]) => (
              <TextField key={k} label={label} value={header[k]} onChange={(e) => setHeader({ ...header, [k]: e.target.value })} />
            ))}
          </div>
        </details>
      </Panel>

      <Panel title="Инклинометрия" description="Вставьте строки из отчёта или Excel (Ctrl+V в любую ячейку MD) — столбцы в порядке таблицы. На узком экране таблица прокручивается вбок."
        actions={<Button size="sm" icon={<FiPlus />} onClick={() => setRows((rs) => [...rs, emptyRow()])}>Строка</Button>} bodyClassName="p-0">
        <div className="thin-scrollbar max-h-[28rem] overflow-auto">
          <table className="w-full border-collapse text-xs">
            <thead className="sticky top-0 z-10 bg-ink-50">
              <tr>
                <th className="w-10 border-b border-ink-200 px-2 py-1.5 text-left font-medium text-ink-500">#</th>
                {surveyColumns.map((c) => (
                  <th key={c.key} scope="col" className="border-b border-ink-200 px-2 py-1.5 text-right font-medium text-ink-500">
                    {c.label}<span className="ml-1 font-normal">{c.unit}</span>
                  </th>
                ))}
                <th className="w-8 border-b border-ink-200" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id ?? `new-${i}`} className="border-b border-ink-100 hover:bg-ink-50">
                  <td className="px-2 text-ink-500">{i + 1}</td>
                  {surveyColumns.map((c) => (
                    <td key={c.key} className="border-l border-ink-100 p-0">
                      <input aria-label={`${c.label}, строка ${i + 1}`} className={cell} inputMode={'signed' in c ? 'text' : 'decimal'} value={r[c.key]}
                        onChange={(e) => setCell(i, c.key, e.target.value)} onPaste={c.key === 'md' ? (e) => onPaste(e, i) : undefined} />
                    </td>
                  ))}
                  <td className="border-l border-ink-100 text-center">
                    <button type="button" aria-label={`Удалить строку ${i + 1}`} onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))}
                      className="rounded p-1 text-ink-500 hover:bg-ink-100 hover:text-ink touch:p-[15px]"><FiTrash2 className="h-3.5 w-3.5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {problems.length > 0 && <Alert tone="warning" title="Проверьте данные"><ul className="list-disc pl-4">{problems.map((p) => <li key={p}>{p}</li>)}</ul></Alert>}
      {error && <Alert tone="error">{error}</Alert>}
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button onClick={onCancel}>Отмена</Button>
        <Button variant="primary" loading={saving} onClick={submit}>{initial?.id ? 'Сохранить' : 'Создать траекторию'}</Button>
      </div>
    </div>
  );
};
