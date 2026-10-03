import { useState, type ReactNode } from 'react';
import { FiEdit2, FiLayers, FiPlus, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { instance } from '../../api/axios.api';
import { apiErrorMessage } from '../../services/admin.service';
import { Alert, Button, ConfirmDialog, DataTable, EmptyState, KeyValue, Loading, Panel, type Column } from '../../ui';
import { HoleForm, type CasingData, type HoleData } from './HoleForm';
import { RecordForm } from './RecordForm';
import { recordSpecs } from './recordSpecs';
import { StringForm } from './StringForm';
import { useCaseChildren } from './useCaseChildren';
import type { IFluid, IRig, ISection, IString } from '../../types/types';

const n = (v: number | null | undefined, d = 2) => (v === null || v === undefined ? null : v.toLocaleString('ru-RU', { maximumFractionDigits: d }));

type Mode = 'view' | 'edit' | 'create';

/**
 * Shared frame for a case input: loading/error/empty states, edit and create modes rendering
 * the existing forms, and a confirmed delete against the resource's own endpoint.
 */
function CaseRecord<T extends { id?: string }>({ resource, caseId, title, emptyText, render, form, onSchematic }: {
  resource: string; caseId: string; title: string; emptyText: string; onSchematic?: () => void;
  render: (item: T) => ReactNode;
  form: (mode: 'edit' | 'create', item: T | undefined, done: () => void, cancel: () => void) => ReactNode;
}) {
  const { loading, items, error, reload } = useCaseChildren<T>(resource, caseId);
  const [mode, setMode] = useState<Mode>('view');
  const [deleting, setDeleting] = useState<T | null>(null);
  const item = items[0];
  const done = () => { setMode('view'); reload(); };

  if (loading) return <Loading />;
  if (error) return <Alert tone="error" title={error} action={<Button size="sm" onClick={reload}>Повторить</Button>} />;
  if (mode !== 'view') {
    return (
      <div className="space-y-3">
        {form(mode, mode === 'edit' ? item : undefined, done, () => setMode('view'))}
      </div>
    );
  }
  if (!item) {
    return <EmptyState title={emptyText} action={<Button variant="primary" icon={<FiPlus />} onClick={() => setMode('create')}>Добавить</Button>} />;
  }

  const remove = async () => {
    if (!deleting?.id) return;
    try {
      await instance.delete(`/api/v1/${resource}/${deleting.id}`);
      toast.success(`${title}: удалено`);
      setDeleting(null);
      reload();
    } catch (e) {
      toast.error(apiErrorMessage(e, 'Не удалось удалить'));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-2xs font-medium uppercase tracking-wider text-ink-500">
          {title}{items.length > 1 ? ` · записей: ${items.length}, показана первая` : ''}
        </p>
        <div className="flex flex-wrap gap-2">
          {onSchematic && <Button size="sm" variant="ghost" icon={<FiLayers />} onClick={onSchematic}>Схема</Button>}
          <Button size="sm" icon={<FiEdit2 />} onClick={() => setMode('edit')}>Изменить</Button>
          <Button size="sm" variant="danger" icon={<FiTrash2 />} onClick={() => setDeleting(item)}>Удалить</Button>
        </div>
      </div>
      {render(item)}
      <ConfirmDialog open={Boolean(deleting)} title={`Удалить: ${title.toLowerCase()}?`} message="Это действие нельзя отменить."
        onConfirm={remove} onCancel={() => setDeleting(null)} />
    </div>
  );
}

const sectionColumns: Column<ISection>[] = [
  { key: 'type', header: 'Элемент', render: (s) => s.type },
  { key: 'md', header: 'Низ', unit: 'м', numeric: true, render: (s) => n(s.body_md) },
  { key: 'len', header: 'Длина', unit: 'м', numeric: true, render: (s) => n(s.body_length) },
  { key: 'od', header: 'НД', unit: 'мм', numeric: true, render: (s) => n(s.body_od) },
  { key: 'id', header: 'ВД', unit: 'мм', numeric: true, render: (s) => n(s.body_id) || '—' },
  { key: 'joint', header: 'Ср. длина трубы', unit: 'м', numeric: true, render: (s) => n(s.avg_joint_length) ?? '—' },
  { key: 'tjl', header: 'Замок: длина', unit: 'м', numeric: true, render: (s) => n(s.stabilizer_length) ?? '—' },
  { key: 'tjod', header: 'Замок: НД', unit: 'мм', numeric: true, render: (s) => n(s.stabilizer_od) ?? '—' },
  { key: 'tjid', header: 'Замок: ВД', unit: 'мм', numeric: true, render: (s) => n(s.stabilizer_id) ?? '—' },
  { key: 'w', header: 'Вес', unit: 'кг/м', numeric: true, render: (s) => n(s.weight) ?? '—' },
  { key: 'grade', header: 'Марка', render: (s) => s.grade || '—' },
  { key: 'yield', header: 'Предел текучести', unit: 'psi', numeric: true, render: (s) => n(s.min_yield_strength, 0) ?? '—' },
];

export const StringView = ({ caseId, onSchematic }: { caseId: string; onSchematic?: () => void }) => (
  <CaseRecord<IString> resource="strings" caseId={caseId} title="Колонна" emptyText="Рабочая колонна не задана" onSchematic={onSchematic}
    render={(s) => (
      <Panel title={s.name || 'Рабочая колонна'} description={`Глубина: ${n(s.depth)} м · ${s.sections?.length ?? 0} элементов (сверху вниз)`} bodyClassName="p-0">
        <DataTable columns={sectionColumns} rows={[...(s.sections ?? [])].sort((a, b) => a.body_md - b.body_md)} rowKey={(x, i) => x.id ?? String(i)} caption="Секции колонны" />
      </Panel>
    )}
    form={(mode, s, done, cancel) => <StringForm caseId={caseId} initial={mode === 'edit' ? s : undefined} onSaved={done} onCancel={cancel} />} />
);

type Casing = CasingData;
type Hole = HoleData;

const casingColumns: Column<Casing>[] = [
  { key: 'd', header: 'Секция', render: (c) => c.description_caising || 'Обсадная колонна' },
  { key: 'top', header: 'Верх', unit: 'м', numeric: true, render: (c) => n(c.md_top) },
  { key: 'base', header: 'Низ', unit: 'м', numeric: true, render: (c) => n(c.md_base) },
  { key: 'shoe', header: 'Башмак', unit: 'м', numeric: true, render: (c) => n(c.shoe_md) ?? '—' },
  { key: 'id', header: 'ВД', unit: 'мм', numeric: true, render: (c) => n(c.inner_diameter) ?? '—' },
  { key: 'drift', header: 'Drift', unit: 'мм', numeric: true, render: (c) => n(c.drift_id) || '—' },
  { key: 'f', header: 'Коэф. трения', numeric: true, render: (c) => n(c.friction_factor_caising, 3) },
  { key: 'cap', header: 'Вместимость', unit: 'л/м', numeric: true, render: (c) => n(c.linear_capacity_caising) || '—' },
];

export const HoleView = ({ caseId, onSchematic }: { caseId: string; onSchematic?: () => void }) => (
  <CaseRecord<Hole> resource="holes" caseId={caseId} title="Ствол" emptyText="Секции ствола не заданы" onSchematic={onSchematic}
    render={(h) => (
      <div className="space-y-4">
        <Panel title="Обсадные колонны" bodyClassName="p-0">
          <DataTable columns={casingColumns} rows={h.caisings ?? []} rowKey={(c, i) => c.id ?? String(i)} empty="Обсадных колонн нет" caption="Обсадные колонны" />
        </Panel>
        <Panel title="Открытый ствол">
          <KeyValue columns={3} items={[
            { label: 'Верх', value: n(h.open_hole_md_top), unit: 'м' }, { label: 'Низ', value: n(h.open_hole_md_base), unit: 'м' },
            { label: 'Длина', value: n(h.open_hole_length), unit: 'м' }, { label: 'TVD низа', value: n(h.open_hole_vd), unit: 'м' },
            { label: 'Эффективный диаметр', value: n(h.effective_diameter), unit: 'мм' }, { label: 'Коэф. трения', value: n(h.friction_factor_open_hole, 3) },
            { label: 'Вместимость', value: n(h.linear_capacity_open_hole), unit: 'л/м' }, { label: 'Кавернозность', value: n(h.volume_excess), unit: '%' },
          ]} />
        </Panel>
      </div>
    )}
    form={(mode, h, done, cancel) => <HoleForm caseId={caseId} initial={mode === 'edit' ? (h as HoleData) : undefined} onSaved={done} onCancel={cancel} />} />
);

export const FluidView = ({ caseId }: { caseId: string }) => (
  <CaseRecord<IFluid> resource="fluids" caseId={caseId} title="Раствор" emptyText="Буровой раствор не задан"
    render={(f) => (
      <Panel title={f.name}>
        <KeyValue items={[
          { label: 'Плотность', value: n(f.density, 1), unit: 'кг/м³' }, { label: 'Тип основы', value: f.fluid_base_type?.name },
          { label: 'Базовая жидкость', value: f.base_fluid?.name }, { label: 'Описание', value: f.description },
        ]} />
      </Panel>
    )}
    form={(mode, f, done, cancel) => <RecordForm spec={recordSpecs.fluid} caseId={caseId} onSaved={done} onCancel={cancel}
      initial={mode === 'edit' && f ? { ...f, fluid_base_type_id: f.fluid_base_type?.id, base_fluid_id: f.base_fluid?.id } : undefined} />} />
);

interface PorePressure { id: string; tvd: number; pressure: number; emw: number }
interface Geothermal { id: string; temperature_at_surface: number; temperature_at_well_tvd: number; temperature_gradient: number; well_tvd: number }

export const PressureView = ({ caseId }: { caseId: string }) => (
  <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
    <section className="space-y-3">
      <h2 className="text-sm font-semibold">Поровое давление</h2>
      <CaseRecord<PorePressure> resource="pore-pressures" caseId={caseId} title="Поровое давление" emptyText="Нет данных порового давления"
        render={(p) => <Panel><KeyValue columns={1} items={[{ label: 'TVD', value: n(p.tvd), unit: 'м' }, { label: 'Давление', value: n(p.pressure) }, { label: 'ЭПБР (EMW)', value: n(p.emw) }]} /></Panel>}
        form={(mode, p, done, cancel) => <RecordForm spec={recordSpecs.porePressure} caseId={caseId} initial={mode === 'edit' ? { ...p } : undefined} onSaved={done} onCancel={cancel} />} />
    </section>
    <section className="space-y-3">
      <h2 className="text-sm font-semibold">Геотермический профиль</h2>
      <CaseRecord<Geothermal> resource="fracture-gradients" caseId={caseId} title="Геотермический профиль" emptyText="Нет геотермических данных"
        render={(g) => (
          <Panel><KeyValue columns={1} items={[
            { label: 'Температура на поверхности', value: n(g.temperature_at_surface), unit: '°C' },
            { label: 'Температура на глубине', value: n(g.temperature_at_well_tvd), unit: '°C' },
            { label: 'Глубина (TVD)', value: n(g.well_tvd), unit: 'м' },
            { label: 'Градиент', value: n(g.temperature_gradient), unit: '°C/100 м' },
          ]} /></Panel>
        )}
        form={(mode, g, done, cancel) => <RecordForm spec={recordSpecs.geothermal} caseId={caseId} initial={mode === 'edit' ? { ...g } : undefined} onSaved={done} onCancel={cancel} />} />
    </section>
  </div>
);

export const RigView = ({ caseId }: { caseId: string }) => (
  <CaseRecord<IRig> resource="rigs" caseId={caseId} title="Буровая" emptyText="Параметры буровой не заданы"
    render={(r) => (
      <Panel title="Буровая установка">
        <KeyValue columns={3} items={[
          { label: 'Грузоподъёмность', value: n(r.block_rating) }, { label: 'Номинальный момент', value: n(r.torque_rating) },
          { label: 'Рабочее давление', value: n(r.rated_working_pressure) }, { label: 'Давление ПВО', value: n(r.bop_pressure_rating) },
          { label: 'Потери в наземной обвязке', value: n(r.surface_pressure_loss) }, { label: 'Длина стояка', value: n(r.standpipe_length) },
          { label: 'ВД стояка', value: n(r.standpipe_internal_diameter) }, { label: 'Длина шланга', value: n(r.hose_length) },
          { label: 'ВД шланга', value: n(r.hose_internal_diameter) }, { label: 'Длина вертлюга', value: n(r.swivel_length) },
          { label: 'Длина ведущей трубы', value: n(r.kelly_length) }, { label: 'Длина нагнетательной линии', value: n(r.pump_discharge_line_length) },
        ]} />
      </Panel>
    )}
    form={(mode, r, done, cancel) => <RecordForm spec={recordSpecs.rig} caseId={caseId} initial={mode === 'edit' && r ? { ...r } : undefined} onSaved={done} onCancel={cancel} />} />
);
