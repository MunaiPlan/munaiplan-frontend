import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { toast } from 'react-toastify';
import { apiErrorMessage } from '../../services/admin.service';
import { Alert, Button, ConfirmDialog, DataTable, EmptyState, KeyValue, Loading, PageHeader, Panel, type Column } from '../../ui';
import { hierarchyApi } from '../hierarchy/api';
import { kinds } from '../hierarchy/hierarchy';
import { KindIcon } from '../hierarchy/icons';
import { useTree } from '../hierarchy/treeState';
import { TrajectoryForm, type TrajectoryData } from './TrajectoryForm';
import { surveyColumns, type SurveyUnit } from './survey';

type Unit = SurveyUnit;
type Trajectory = Omit<TrajectoryData, 'units'> & { id: string; units: Unit[] };

const fmt = (v: number | undefined, d = 2) => (v === undefined || v === null ? '—' : v.toLocaleString('ru-RU', { maximumFractionDigits: d }));
const axis = { stroke: '#71717A', fontSize: 11, tickLine: false };

const ProfileChart = ({ data, x, y, xLabel, yLabel, reversedY }: {
  data: Unit[]; x: keyof Unit; y: keyof Unit; xLabel: string; yLabel: string; reversedY?: boolean;
}) => (
  <ResponsiveContainer width="100%" height={260}>
    <LineChart data={data} margin={{ top: 8, right: 16, bottom: 20, left: 8 }}>
      <CartesianGrid stroke="#E4E4E7" strokeDasharray="2 4" />
      <XAxis type="number" dataKey={x} {...axis} domain={['auto', 'auto']} label={{ value: xLabel, position: 'insideBottom', offset: -10, fontSize: 11, fill: '#71717A' }} />
      <YAxis type="number" dataKey={y} {...axis} reversed={reversedY} domain={reversedY ? [0, 'dataMax'] : ['auto', 'auto']} width={56}
        label={{ value: yLabel, angle: -90, position: 'insideLeft', fontSize: 11, fill: '#71717A' }} />
      <Tooltip formatter={(v: number) => fmt(v)} contentStyle={{ border: '1px solid #0A0A0A', borderRadius: 6, fontSize: 12 }} />
      <Line type="monotone" dataKey={y} stroke="#0A0A0A" strokeWidth={1.75} dot={false} isAnimationActive={false} />
    </LineChart>
  </ResponsiveContainer>
);

/** Trajectory: header, survey table, vertical-section and plan views, and its cases. */
export const TrajectoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { find, pathTo } = useTree();
  const [data, setData] = useState<Trajectory | null>(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const load = useCallback(() => {
    if (!id) return;
    setError('');
    hierarchyApi.get<Trajectory>('trajectory', id).then((t) => setData({ ...t, units: [...(t.units ?? [])].sort((a, b) => a.md - b.md) }))
      .catch((e) => setError(apiErrorMessage(e, 'Не удалось загрузить траекторию')));
  }, [id]);
  useEffect(() => { setData(null); setEditing(false); load(); }, [load]);

  const columns = useMemo<Column<Unit>[]>(() => surveyColumns.map((c) => ({
    key: c.key, header: c.label, unit: c.unit, numeric: true, render: (u: Unit) => fmt(u[c.key], c.key.startsWith('global') ? 1 : 2),
  })), []);

  if (error) return <div className="p-6"><Alert tone="error" title="Ошибка загрузки">{error}</Alert></div>;
  if (!data || !id) return <Loading />;

  const units = data.units;
  const header = data.headers?.[0];
  const cases = find(id)?.children ?? [];
  const parent = pathTo(id).at(-2);
  const last = units.at(-1);

  const remove = async () => {
    try {
      await hierarchyApi.remove('trajectory', id);
      toast.success('Траектория удалена');
      navigate(parent ? kinds[parent.kind].route(parent.id) : '/');
    } catch (e) {
      toast.error(apiErrorMessage(e, 'Не удалось удалить'));
    }
  };

  if (editing) {
    return (
      <div className="mx-auto max-w-6xl space-y-5 p-6">
        <PageHeader eyebrow="Траектория" title={`Изменить: ${data.name}`} />
        <TrajectoryForm initial={data} onCancel={() => setEditing(false)}
          onSaved={() => { toast.success('Траектория сохранена'); setEditing(false); load(); }} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5 p-6">
      <PageHeader eyebrow="Траектория" title={data.name || 'Без названия'} meta={data.description}
        actions={<>
          <Button size="sm" icon={<FiEdit2 />} onClick={() => setEditing(true)}>Изменить</Button>
          <Button size="sm" variant="danger" icon={<FiTrash2 />} onClick={() => setConfirming(true)}>Удалить</Button>
        </>} />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {([
          { label: 'Точек', value: units.length, unit: '' },
          { label: 'Забой по стволу', value: last?.md, unit: 'м' },
          { label: 'Забой по вертикали', value: last?.tvd, unit: 'м' },
          { label: 'Макс. зенит', value: units.length ? Math.max(...units.map((u) => u.incl)) : undefined, unit: '°' },
        ] as { label: string; value: number | undefined; unit: string }[]).map(({ label, value, unit }) => (
          <div key={label} className="rounded-lg border border-ink-200 px-4 py-3">
            <p className="text-2xs uppercase tracking-wider text-ink-500">{label}</p>
            <p className="num mt-1 font-mono text-lg">{fmt(value, 1)}<span className="ml-1 text-xs text-ink-500">{unit}</span></p>
          </div>
        ))}
      </div>

      {units.length > 1 && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Panel title="Вертикальный профиль"><ProfileChart data={units} x="vertical_section" y="tvd" xLabel="Смещение, м" yLabel="TVD, м" reversedY /></Panel>
          <Panel title="План"><ProfileChart data={units} x="local_e_coord" y="local_n_coord" xLabel="E, м" yLabel="N, м" /></Panel>
        </div>
      )}

      <Panel title="Инклинометрия" description={header ? [header.field, header.structure, header.wellhead].filter(Boolean).join(' · ') : undefined} bodyClassName="p-0">
        <DataTable columns={columns} rows={units} rowKey={(u) => u.id} maxHeight="26rem" caption="Точки инклинометрии" />
      </Panel>

      {header && (
        <Panel title="Заголовок WellPlan">
          <KeyValue columns={3} items={[
            { label: 'Заказчик', value: header.customer as string }, { label: 'Проект', value: header.project as string },
            { label: 'Месторождение', value: header.field as string }, { label: 'Структура', value: header.structure as string },
            { label: 'Устье', value: header.wellhead as string }, { label: 'Профиль', value: header.profile as string },
            { label: 'Альтитуда стола ротора', value: header.kelly_bushing_elev as number, unit: 'м' },
          ]} />
        </Panel>
      )}

      <Panel title="Кейсы" description={`${cases.length} шт.`} bodyClassName="p-0"
        actions={<Button size="sm" variant="primary" icon={<FiPlus />} onClick={() => navigate(`/new/case?parent=${id}`)}>Создать</Button>}>
        {cases.length === 0 ? <div className="p-4"><EmptyState title="Пока нет кейсов" /></div> : (
          <ul className="divide-y divide-ink-100">
            {cases.map((c) => (
              <li key={c.id}><Link to={kinds.case.route(c.id)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-ink-50">
                <KindIcon kind="case" className="h-4 w-4 text-ink-500" /><span className="truncate">{c.name}</span></Link></li>
            ))}
          </ul>
        )}
      </Panel>

      <ConfirmDialog open={confirming} title={`Удалить траекторию «${data.name}»?`}
        message={cases.length ? `Вместе с ней будут удалены кейсы (${cases.length}). Это действие нельзя отменить.` : 'Это действие нельзя отменить.'}
        onConfirm={remove} onCancel={() => setConfirming(false)} />
    </div>
  );
};
