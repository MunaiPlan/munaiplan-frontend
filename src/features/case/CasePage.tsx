import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { apiErrorMessage } from '../../services/admin.service';
import { Alert, Badge, Button, ConfirmDialog, KeyValue, Loading, PageHeader, Panel, Tabs } from '../../ui';
import { hierarchyApi } from '../hierarchy/api';
import { EntityForm } from '../hierarchy/EntityForm';
import { kinds } from '../hierarchy/hierarchy';
import { useTree } from '../hierarchy/treeState';
import { CaseSource } from './CaseSource';
import { HydraulicsPanel } from './HydraulicsPanel';
import { useCaseReference } from './useCaseReference';
import type { ICase } from '../../types/types';
import TorqueDragPanel from '../torque-drag/TorqueDragPanel';
import { FluidView, HoleView, PressureView, RigView, StringView } from './CaseData';

const tabs = [
  { key: 'overview', label: 'Обзор' },
  { key: 'hole', label: 'Ствол' },
  { key: 'string', label: 'Колонна' },
  { key: 'fluid', label: 'Раствор' },
  { key: 'pressure', label: 'Давления и температура' },
  { key: 'rig', label: 'Буровая' },
  { key: 'td', label: 'Torque & Drag' },
  { key: 'hydraulics', label: 'Гидравлика' },
] as const;
type TabKey = (typeof tabs)[number]['key'];

/** A case: its inputs (hole, string, fluid, pressures, rig) and analyses, one tab each. */
const CasePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { pathTo } = useTree();
  const [record, setRecord] = useState<ICase | null>(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const { report } = useCaseReference(id);
  const tab = (tabs.find((t) => t.key === params.get('tab'))?.key ?? 'overview') as TabKey;
  const setTab = (key: TabKey) => setParams(key === 'overview' ? {} : { tab: key }, { replace: true });

  const load = useCallback(() => {
    if (!id) return;
    setError('');
    hierarchyApi.get<ICase>('case', id).then(setRecord).catch((e) => setError(apiErrorMessage(e, 'Не удалось загрузить кейс')));
  }, [id]);
  useEffect(() => { setRecord(null); setEditing(false); load(); }, [load]);

  if (error) return <div className="p-6"><Alert tone="error" title="Ошибка загрузки">{error}</Alert></div>;
  if (!record || !id) return <Loading />;
  const parent = pathTo(id).at(-2);

  const remove = async () => {
    try {
      await hierarchyApi.remove('case', id);
      toast.success('Кейс удалён');
      navigate(parent ? kinds[parent.kind].route(parent.id) : '/');
    } catch (e) {
      toast.error(apiErrorMessage(e, 'Не удалось удалить кейс'));
    }
  };

  return (
    <div className="flex min-h-full flex-col">
      <div className="border-b border-ink-200 px-6 pt-5">
        <PageHeader eyebrow="Кейс" title={record.case_name || 'Без названия'}
          meta={<span className="flex items-center gap-2">
            {record.drill_depth ? <span className="num font-mono">{record.drill_depth.toLocaleString('ru-RU')} м</span> : null}
            {report && <Badge tone="outline">WellPlan</Badge>}
          </span>}
          actions={<>
            <Button size="sm" icon={<FiEdit2 />} onClick={() => { setTab('overview'); setEditing(true); }}>Изменить</Button>
            <Button size="sm" variant="danger" icon={<FiTrash2 />} onClick={() => setConfirming(true)}>Удалить</Button>
          </>} />
        <Tabs items={tabs} value={tab} onChange={setTab} label="Разделы кейса" className="border-b-0" />
      </div>

      <div className="flex-1 p-6">
        {tab === 'overview' && (
          <div className="mx-auto max-w-5xl space-y-5">
            {editing ? (
              <Panel title="Изменить кейс">
                <EntityForm kind="case" id={id} initial={record as unknown as Record<string, unknown>} onCancel={() => setEditing(false)}
                  onSaved={() => { toast.success('Кейс сохранён'); setEditing(false); load(); }} />
              </Panel>
            ) : (
              <Panel title="Свойства">
                <KeyValue items={[
                  { label: 'Описание', value: record.case_description },
                  { label: 'Глубина бурения', value: record.drill_depth || null, unit: 'м' },
                  { label: 'Типоразмер трубы', value: record.pipe_size || null, unit: 'мм' },
                  { label: 'Данные заполнены', value: record.is_complete ? 'Да' : 'Нет' },
                ]} />
              </Panel>
            )}
            {report && <CaseSource report={report} />}
          </div>
        )}
        {tab === 'hole' && <div className="mx-auto max-w-6xl"><HoleView caseId={id} /></div>}
        {tab === 'string' && <div className="mx-auto max-w-6xl"><StringView caseId={id} /></div>}
        {tab === 'fluid' && <div className="mx-auto max-w-5xl"><FluidView caseId={id} /></div>}
        {tab === 'pressure' && <div className="mx-auto max-w-6xl"><PressureView caseId={id} /></div>}
        {tab === 'rig' && <div className="mx-auto max-w-5xl"><RigView caseId={id} /></div>}
        {tab === 'td' && <TorqueDragPanel caseId={id} />}
        {tab === 'hydraulics' && <div className="mx-auto max-w-5xl"><HydraulicsPanel caseId={id} /></div>}
      </div>

      <ConfirmDialog open={confirming} title={`Удалить кейс «${record.case_name}»?`}
        message="Будут удалены колонна, ствол, раствор и другие данные кейса. Это действие нельзя отменить."
        onConfirm={remove} onCancel={() => setConfirming(false)} />
    </div>
  );
};

export default CasePage;
