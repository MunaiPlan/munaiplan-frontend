import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { apiErrorMessage } from '../../services/admin.service';
import { Alert, Button, ConfirmDialog, EmptyState, KeyValue, Loading, PageHeader, Panel } from '../../ui';
import { hierarchyApi } from './api';
import { EntityForm } from './EntityForm';
import { displayName, kinds, parentKind, type Kind } from './hierarchy';
import { KindIcon } from './icons';
import { useTree } from './treeState';

type Record_ = Record<string, unknown>;

const formatValue = (value: unknown, type?: string) => {
  if (value === null || value === undefined || value === '') return null;
  if (type === 'date' && typeof value === 'string') {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) || d.getFullYear() < 1900 ? null : d.toLocaleDateString('ru-RU');
  }
  if (typeof value === 'number') return value.toLocaleString('ru-RU', { maximumFractionDigits: 3 });
  return String(value);
};

/** Detail page for a hierarchy level: properties, children, edit and delete. */
export const EntityPage = ({ kind }: { kind: Kind }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { find, pathTo } = useTree();
  const spec = kinds[kind];
  const [record, setRecord] = useState<Record_ | null>(null);
  const [loadError, setLoadError] = useState('');
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(() => {
    if (!id) return;
    setLoadError('');
    hierarchyApi.get<Record_>(kind, id)
      .then(setRecord)
      .catch((e) => setLoadError(apiErrorMessage(e, `Не удалось загрузить: ${spec.label.toLowerCase()}`)));
  }, [id, kind, spec.label]);

  useEffect(() => { setRecord(null); setEditing(false); load(); }, [load]);

  if (loadError) return <div className="p-4 md:p-6"><Alert tone="error" title="Ошибка загрузки" action={<Button size="sm" onClick={load}>Повторить</Button>}>{loadError}</Alert></div>;
  if (!record || !id) return <Loading />;

  const node = find(id);
  const childKind = spec.child;
  const children = node?.children ?? [];
  const parent = pathTo(id).at(-2);

  const remove = async () => {
    setDeleting(true);
    try {
      await hierarchyApi.remove(kind, id);
      toast.success(`${spec.label} удалена(о)`);
      navigate(parent ? kinds[parent.kind].route(parent.id) : '/');
    } catch (e) {
      toast.error(apiErrorMessage(e, 'Не удалось удалить'));
    } finally {
      setDeleting(false);
      setConfirming(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-5 p-4 md:p-6">
      <PageHeader eyebrow={spec.label} title={displayName(kind, record)}
        meta={parent && <>в {kinds[parent.kind].label.toLowerCase()} <Link className="underline decoration-ink-300 hover:decoration-ink" to={kinds[parent.kind].route(parent.id)}>{parent.name}</Link></>}
        actions={!editing && <>
          <Button size="sm" icon={<FiEdit2 />} onClick={() => setEditing(true)}>Изменить</Button>
          <Button size="sm" variant="danger" icon={<FiTrash2 />} onClick={() => setConfirming(true)}>Удалить</Button>
        </>} />

      {editing ? (
        <Panel title={`Изменить: ${spec.label.toLowerCase()}`}>
          <EntityForm kind={kind} id={id} initial={record} onCancel={() => setEditing(false)}
            onSaved={() => { toast.success('Изменения сохранены'); setEditing(false); load(); }} />
        </Panel>
      ) : (
        <Panel title="Свойства">
          <KeyValue items={spec.fields.map((f) => ({ label: f.label, value: formatValue(record[f.name], f.type), unit: f.unit }))} />
        </Panel>
      )}

      {childKind && (
        <Panel title={kinds[childKind].plural} description={`${children.length} шт.`}
          actions={<Button size="sm" variant="primary" icon={<FiPlus />} onClick={() => navigate(`/new/${childKind}?parent=${id}`)}>
            Создать
          </Button>}
          bodyClassName="p-0">
          {children.length === 0 ? (
            <div className="p-4"><EmptyState title={`Пока нет: ${kinds[childKind].plural.toLowerCase()}`}
              description={parentKind(childKind) === kind ? 'Создайте первый элемент или импортируйте кейс из WellPlan.' : undefined} /></div>
          ) : (
            <ul className="divide-y divide-ink-100">
              {children.map((c) => (
                <li key={c.id}>
                  <Link to={kinds[c.kind].route(c.id)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-ink-50">
                    <KindIcon kind={c.kind} className="h-4 w-4 text-ink-500" />
                    <span className="flex-1 truncate">{c.name || 'Без названия'}</span>
                    {c.children.length > 0 && <span className="text-xs text-ink-500">{c.children.length}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      )}

      <ConfirmDialog open={confirming} busy={deleting} title={`Удалить: ${displayName(kind, record)}?`}
        message={childKind && children.length > 0
          ? `Будут удалены все вложенные элементы (${children.length} ${kinds[childKind].plural.toLowerCase()} и ниже). Это действие нельзя отменить.`
          : 'Это действие нельзя отменить.'}
        onConfirm={remove} onCancel={() => setConfirming(false)} />
    </div>
  );
};
