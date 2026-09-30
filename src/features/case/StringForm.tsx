import { useMemo, useState, type ClipboardEvent } from 'react';
import { FiArrowDown, FiArrowUp, FiPlus, FiTrash2 } from 'react-icons/fi';
import { instance } from '../../api/axios.api';
import { apiErrorMessage } from '../../services/admin.service';
import type { ISection, IString } from '../../types/types';
import { Alert, Button, Panel, TextField } from '../../ui';

// Column order matches WellPlan's string table so rows can be pasted from it.
const columns = [
  { key: 'type', label: 'Элемент', text: true },
  { key: 'body_length', label: 'Длина', unit: 'м', required: true },
  { key: 'body_od', label: 'НД', unit: 'мм', required: true },
  { key: 'body_id', label: 'ВД', unit: 'мм' },
  { key: 'avg_joint_length', label: 'Ср. длина трубы', unit: 'м' },
  { key: 'stabilizer_length', label: 'Замок: длина', unit: 'м' },
  { key: 'stabilizer_od', label: 'Замок: НД', unit: 'мм' },
  { key: 'stabilizer_id', label: 'Замок: ВД', unit: 'мм' },
  { key: 'weight', label: 'Вес', unit: 'кг/м' },
  { key: 'grade', label: 'Марка', text: true },
  { key: 'min_yield_strength', label: 'Предел текучести', unit: 'psi' },
  { key: 'friction_coefficient', label: 'Коэф. трения' },
] as const;

type Key = (typeof columns)[number]['key'];
type Row = { id?: string } & Record<Key, string>;

const blank = (): Row => Object.fromEntries(columns.map((c) => [c.key, ''])) as Row;
const num = (s: string) => Number(s.trim().replace(/\s/g, '').replace(',', '.'));
const toRow = (s: ISection): Row => ({ id: s.id, ...Object.fromEntries(columns.map((c) => {
  const v = (s as unknown as Record<string, unknown>)[c.key];
  return [c.key, v === null || v === undefined ? '' : String(v)];
})) } as Row);

/** Work string editor: components top to bottom; bottom depths are running sums of lengths. */
export const StringForm = ({ caseId, initial, onSaved, onCancel }: {
  caseId: string; initial?: IString; onSaved: () => void; onCancel: () => void;
}) => {
  const [name, setName] = useState(initial?.name ?? 'Рабочая колонна');
  const [rows, setRows] = useState<Row[]>(() => initial?.sections?.length
    ? [...initial.sections].sort((a, b) => a.body_md - b.body_md).map(toRow) : [blank()]);
  const [problems, setProblems] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const bottoms = useMemo(() => rows.reduce<number[]>((acc, r) => [...acc, (acc.at(-1) ?? 0) + (Number.isFinite(num(r.body_length)) ? num(r.body_length) : 0)], []), [rows]);
  const set = (i: number, key: Key, value: string) => setRows((rs) => rs.map((r, j) => (j === i ? { ...r, [key]: value } : r)));
  const move = (i: number, d: -1 | 1) => setRows((rs) => {
    const next = [...rs];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    return next;
  });

  const onPaste = (e: ClipboardEvent, index: number) => {
    const lines = e.clipboardData.getData('text').split(/\r?\n/).map((l) => l.split('\t').map((c) => c.trim())).filter((c) => c.length >= 3 && c[0]);
    if (lines.length < 1 || lines[0].length < 3) return;
    e.preventDefault();
    // WellPlan rows: type, length, depth, OD, ID, avg joint, TJ length, TJ OD, TJ ID, weight, material, grade.
    const pasted = lines.map((c) => ({ ...blank(), type: c[0], body_length: c[1], body_od: c[3] ?? '', body_id: c[4] ?? '', avg_joint_length: c[5] ?? '',
      stabilizer_length: c[6] ?? '', stabilizer_od: c[7] ?? '', stabilizer_id: c[8] ?? '', weight: c[9] ?? '', grade: c[11] ?? '' }));
    setRows((rs) => [...rs.slice(0, index).filter((r) => r.type.trim()), ...pasted]);
  };

  const submit = async () => {
    const issues: string[] = [];
    if (!rows.length) issues.push('Добавьте хотя бы один элемент.');
    rows.forEach((r, i) => {
      if (!r.type.trim()) issues.push(`Строка ${i + 1}: укажите элемент.`);
      columns.forEach((c) => {
        if ('text' in c) return;
        const v = r[c.key].trim();
        if (v === '' && 'required' in c) issues.push(`Строка ${i + 1}: заполните «${c.label}».`);
        else if (v !== '' && !Number.isFinite(num(v))) issues.push(`Строка ${i + 1}: «${c.label}» — не число.`);
      });
      if (num(r.body_length) < 0) issues.push(`Строка ${i + 1}: длина не может быть отрицательной.`);
    });
    setProblems(issues.slice(0, 8));
    if (issues.length) return;
    setSaving(true);
    setError('');
    const opt = (v: string) => (v.trim() === '' ? null : num(v));
    const sections = rows.map((r, i) => ({
      ...(r.id ? { id: r.id } : {}), type: r.type.trim(), body_md: +bottoms[i].toFixed(3), body_length: num(r.body_length),
      body_od: num(r.body_od), body_id: r.body_id.trim() ? num(r.body_id) : 0, avg_joint_length: opt(r.avg_joint_length),
      stabilizer_length: opt(r.stabilizer_length), stabilizer_od: opt(r.stabilizer_od), stabilizer_id: opt(r.stabilizer_id),
      weight: opt(r.weight), grade: r.grade.trim() || null, min_yield_strength: opt(r.min_yield_strength), friction_coefficient: opt(r.friction_coefficient),
    }));
    const body = { name: name.trim() || 'Рабочая колонна', depth: +(bottoms.at(-1) ?? 0).toFixed(3), sections };
    try {
      if (initial?.id) await instance.put(`/api/v1/strings/${initial.id}`, body);
      else await instance.post(`/api/v1/strings/?caseId=${encodeURIComponent(caseId)}`, body);
      onSaved();
    } catch (e) {
      setError(apiErrorMessage(e, 'Не удалось сохранить колонну.'));
    } finally {
      setSaving(false);
    }
  };

  const cell = 'h-7 touch:h-11 w-full min-w-[4.5rem] border-0 bg-transparent px-2 text-xs focus:bg-paper focus:outline-none focus:ring-1 focus:ring-inset focus:ring-ink';
  return (
    <div className="space-y-4">
      <Panel title={initial?.id ? 'Изменить колонну' : 'Новая колонна'}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <TextField label="Название" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField label="Глубина (по сумме длин)" unit="м" value={(bottoms.at(-1) ?? 0).toLocaleString('ru-RU')} readOnly className="num text-right font-mono" />
        </div>
      </Panel>
      <Panel title="Элементы (сверху вниз)" description="Можно вставить строки таблицы колонны из отчёта (Ctrl+V в ячейку «Элемент»). Низ элемента вычисляется автоматически."
        actions={<Button size="sm" icon={<FiPlus />} onClick={() => setRows((rs) => [...rs, blank()])}>Элемент</Button>} bodyClassName="p-0">
        <div className="thin-scrollbar overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead className="bg-ink-50">
              <tr>
                <th className="w-8 border-b border-ink-200 px-2 py-1.5 text-left font-medium text-ink-500">#</th>
                {columns.map((c) => (
                  <th key={c.key} scope="col" className={`border-b border-ink-200 px-2 py-1.5 font-medium text-ink-500 ${'text' in c ? 'text-left' : 'text-right'}`}>
                    {c.label}{'unit' in c && <span className="ml-1 font-normal">{c.unit}</span>}
                  </th>
                ))}
                <th className="border-b border-ink-200 px-2 py-1.5 text-right font-medium text-ink-500">Низ <span className="font-normal">м</span></th>
                <th className="w-20 border-b border-ink-200" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id ?? `new-${i}`} className="border-b border-ink-100 hover:bg-ink-50">
                  <td className="px-2 text-ink-500">{i + 1}</td>
                  {columns.map((c) => (
                    <td key={c.key} className="border-l border-ink-100 p-0">
                      <input aria-label={`${c.label}, строка ${i + 1}`} value={r[c.key]} onChange={(e) => set(i, c.key, e.target.value)}
                        onPaste={c.key === 'type' ? (e) => onPaste(e, i) : undefined} inputMode={'text' in c ? undefined : 'decimal'}
                        className={`${cell} ${'text' in c ? 'min-w-[7rem]' : 'num text-right font-mono'}`} />
                    </td>
                  ))}
                  <td className="num border-l border-ink-100 px-2 text-right font-mono text-ink-500">{bottoms[i].toLocaleString('ru-RU', { maximumFractionDigits: 2 })}</td>
                  <td className="whitespace-nowrap border-l border-ink-100 px-1 text-right">
                    <button type="button" aria-label="Выше" disabled={i === 0} onClick={() => move(i, -1)} className="rounded p-1 text-ink-500 hover:bg-ink-100 disabled:opacity-30 touch:p-[15px]"><FiArrowUp className="h-3.5 w-3.5" /></button>
                    <button type="button" aria-label="Ниже" disabled={i === rows.length - 1} onClick={() => move(i, 1)} className="rounded p-1 text-ink-500 hover:bg-ink-100 disabled:opacity-30 touch:p-[15px]"><FiArrowDown className="h-3.5 w-3.5" /></button>
                    <button type="button" aria-label={`Удалить строку ${i + 1}`} onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))} className="rounded p-1 text-ink-500 hover:bg-ink-100 touch:p-[15px]"><FiTrash2 className="h-3.5 w-3.5" /></button>
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
        <Button variant="primary" loading={saving} onClick={submit}>Сохранить колонну</Button>
      </div>
    </div>
  );
};
