import { useState } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { instance } from '../../api/axios.api';
import { apiErrorMessage } from '../../services/admin.service';
import { Alert, Button, Panel, TextField } from '../../ui';

export interface CasingData {
  id?: string; md_top: number; md_base: number; length: number; shoe_md?: number | null; od: number; inner_diameter?: number | null; vd: number;
  drift_id: number; effective_hole_diameter: number; friction_factor_caising: number; linear_capacity_caising: number; description_caising?: string | null;
}
export interface HoleData {
  id?: string; caisings?: CasingData[]; open_hole_md_top: number; open_hole_md_base: number; open_hole_length: number; open_hole_vd: number;
  effective_diameter: number; friction_factor_open_hole: number; linear_capacity_open_hole: number; volume_excess?: number | null;
}

const casingCols = [
  { key: 'description_caising', label: 'Секция', text: true },
  { key: 'md_top', label: 'Верх', unit: 'м', required: true },
  { key: 'md_base', label: 'Низ', unit: 'м', required: true },
  { key: 'shoe_md', label: 'Башмак', unit: 'м' },
  { key: 'inner_diameter', label: 'ВД', unit: 'мм' },
  { key: 'od', label: 'НД', unit: 'мм' },
  { key: 'drift_id', label: 'Drift', unit: 'мм' },
  { key: 'friction_factor_caising', label: 'Коэф. трения', required: true },
  { key: 'linear_capacity_caising', label: 'Вместимость', unit: 'л/м' },
] as const;
type CasingKey = (typeof casingCols)[number]['key'];
type CasingRow = { id?: string } & Record<CasingKey, string>;

const openFields = [
  ['open_hole_md_top', 'Верх открытого ствола', 'м'], ['open_hole_md_base', 'Низ (забой)', 'м'], ['open_hole_vd', 'TVD забоя', 'м'],
  ['effective_diameter', 'Эффективный диаметр', 'мм'], ['friction_factor_open_hole', 'Коэф. трения', ''],
  ['linear_capacity_open_hole', 'Вместимость', 'л/м'], ['volume_excess', 'Кавернозность', '%'],
] as const;
type OpenKey = (typeof openFields)[number][0];

const str = (v: unknown) => (v === null || v === undefined ? '' : String(v));
const num = (s: string) => Number(s.trim().replace(',', '.'));
const ops = ['tripping_in', 'tripping_out', 'rotating_on_bottom', 'slide_drilling', 'back_reaming', 'rotating_off_bottom'];

/** Hole sections: casing strings and the open hole. One friction factor per section applies to all operations. */
export const HoleForm = ({ caseId, initial, onSaved, onCancel }: {
  caseId: string; initial?: HoleData; onSaved: () => void; onCancel: () => void;
}) => {
  const [casings, setCasings] = useState<CasingRow[]>(() => (initial?.caisings ?? []).map((c) =>
    ({ id: c.id, ...Object.fromEntries(casingCols.map((col) => [col.key, str((c as unknown as Record<string, unknown>)[col.key])])) }) as CasingRow));
  const [open, setOpen] = useState<Record<OpenKey, string>>(() =>
    Object.fromEntries(openFields.map(([k]) => [k, str(initial?.[k])])) as Record<OpenKey, string>);
  const [problems, setProblems] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const setCell = (i: number, k: CasingKey, v: string) => setCasings((cs) => cs.map((c, j) => (j === i ? { ...c, [k]: v } : c)));
  const addCasing = () => setCasings((cs) => [...cs, { ...Object.fromEntries(casingCols.map((c) => [c.key, ''])), md_top: cs.at(-1)?.md_base ?? '0' } as CasingRow]);

  const submit = async () => {
    const issues: string[] = [];
    casings.forEach((c, i) => casingCols.forEach((col) => {
      if ('text' in col) return;
      const v = c[col.key].trim();
      if (v === '' && 'required' in col) issues.push(`Колонна ${i + 1}: заполните «${col.label}».`);
      else if (v !== '' && !Number.isFinite(num(v))) issues.push(`Колонна ${i + 1}: «${col.label}» — не число.`);
    }));
    openFields.forEach(([k, label]) => { if (open[k].trim() !== '' && !Number.isFinite(num(open[k]))) issues.push(`«${label}» — не число.`); });
    if (open.open_hole_md_base.trim() === '' || open.friction_factor_open_hole.trim() === '') issues.push('Укажите забой и коэффициент трения открытого ствола.');
    setProblems(issues.slice(0, 8));
    if (issues.length) return;
    const val = (s: string) => (s.trim() === '' ? 0 : num(s));
    const lastCasingBase = casings.reduce((m, c) => Math.max(m, val(c.md_base)), 0);
    const ohFriction = val(open.friction_factor_open_hole);
    const csFriction = casings.length ? val(casings[casings.length - 1].friction_factor_caising) : 0;
    const top = open.open_hole_md_top.trim() ? val(open.open_hole_md_top) : lastCasingBase;
    const body = {
      open_hole_md_top: top, open_hole_md_base: val(open.open_hole_md_base), open_hole_length: Math.max(0, val(open.open_hole_md_base) - top),
      open_hole_vd: val(open.open_hole_vd), effective_diameter: val(open.effective_diameter), friction_factor_open_hole: ohFriction,
      linear_capacity_open_hole: val(open.linear_capacity_open_hole), volume_excess: open.volume_excess.trim() ? val(open.volume_excess) : null,
      ...Object.fromEntries(ops.flatMap((op) => [[`${op}_casing`, csFriction], [`${op}_open_hole`, ohFriction]])),
      caisings: casings.map((c) => ({
        ...(c.id ? { id: c.id } : {}), description_caising: c.description_caising.trim() || null,
        md_top: val(c.md_top), md_base: val(c.md_base), length: Math.max(0, val(c.md_base) - val(c.md_top)),
        shoe_md: c.shoe_md.trim() ? val(c.shoe_md) : null, inner_diameter: c.inner_diameter.trim() ? val(c.inner_diameter) : null,
        od: val(c.od), vd: 0, drift_id: val(c.drift_id), effective_hole_diameter: 0, weight: 0, grade: '', min_yield_strength: 0,
        burst_rating: 0, collapse_rating: 0, friction_factor_caising: val(c.friction_factor_caising), linear_capacity_caising: val(c.linear_capacity_caising),
      })),
    };
    setSaving(true);
    setError('');
    try {
      if (initial?.id) await instance.put(`/api/v1/holes/${initial.id}`, body);
      else await instance.post(`/api/v1/holes/?caseId=${encodeURIComponent(caseId)}`, body);
      onSaved();
    } catch (e) {
      setError(apiErrorMessage(e, 'Не удалось сохранить ствол.'));
    } finally {
      setSaving(false);
    }
  };

  const cell = 'h-7 w-full min-w-[4.5rem] border-0 bg-transparent px-2 text-xs focus:bg-paper focus:outline-none focus:ring-1 focus:ring-inset focus:ring-ink';
  return (
    <div className="space-y-4">
      <Panel title="Обсадные колонны" actions={<Button size="sm" icon={<FiPlus />} onClick={addCasing}>Колонна</Button>} bodyClassName="p-0">
        {casings.length === 0 ? <p className="p-4 text-sm text-ink-500">Нет обсадных колонн — ствол полностью открытый.</p> : (
          <div className="thin-scrollbar overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead className="bg-ink-50"><tr>
                {casingCols.map((c) => <th key={c.key} className={`border-b border-ink-200 px-2 py-1.5 font-medium text-ink-500 ${'text' in c ? 'text-left' : 'text-right'}`}>
                  {c.label}{'unit' in c && <span className="ml-1 font-normal">{c.unit}</span>}</th>)}
                <th className="w-8 border-b border-ink-200" />
              </tr></thead>
              <tbody>
                {casings.map((c, i) => (
                  <tr key={c.id ?? `new-${i}`} className="border-b border-ink-100 hover:bg-ink-50">
                    {casingCols.map((col) => (
                      <td key={col.key} className="border-l border-ink-100 p-0 first:border-l-0">
                        <input aria-label={`${col.label}, колонна ${i + 1}`} value={c[col.key]} onChange={(e) => setCell(i, col.key, e.target.value)}
                          inputMode={'text' in col ? undefined : 'decimal'} className={`${cell} ${'text' in col ? 'min-w-[8rem]' : 'num text-right font-mono'}`} />
                      </td>
                    ))}
                    <td className="border-l border-ink-100 text-center">
                      <button type="button" aria-label={`Удалить колонну ${i + 1}`} onClick={() => setCasings((cs) => cs.filter((_, j) => j !== i))}
                        className="rounded p-1 text-ink-500 hover:bg-ink-100"><FiTrash2 className="h-3.5 w-3.5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
      <Panel title="Открытый ствол" description="Верх по умолчанию — низ последней обсадной колонны.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {openFields.map(([k, label, unit]) => (
            <TextField key={k} label={label} unit={unit || undefined} value={open[k]} inputMode="decimal" className="num text-right font-mono"
              onChange={(e) => setOpen({ ...open, [k]: e.target.value })} />
          ))}
        </div>
      </Panel>
      {problems.length > 0 && <Alert tone="warning" title="Проверьте данные"><ul className="list-disc pl-4">{problems.map((p) => <li key={p}>{p}</li>)}</ul></Alert>}
      {error && <Alert tone="error">{error}</Alert>}
      <div className="flex justify-end gap-2">
        <Button onClick={onCancel}>Отмена</Button>
        <Button variant="primary" loading={saving} onClick={submit}>Сохранить ствол</Button>
      </div>
    </div>
  );
};
