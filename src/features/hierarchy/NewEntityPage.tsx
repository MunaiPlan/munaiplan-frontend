import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { HelpLink } from '../../components/HelpLink';
import { PageHeader, Panel } from '../../ui';
import { TrajectoryForm } from '../trajectory/TrajectoryForm';
import { EntityForm } from './EntityForm';
import { kinds, kindOrder, parentKind, type Kind } from './hierarchy';
import { useTree } from './treeState';

/** /new/:kind?parent=<id> — the parent comes from the URL, never from hidden state. */
export const NewEntityPage = () => {
  const { kind } = useParams<{ kind: string }>();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { find } = useTree();
  if (!kind || !kindOrder.includes(kind as Kind)) return <Navigate to="/" replace />;
  const k = kind as Kind;
  const parentId = params.get('parent') ?? undefined;
  const parent = find(parentId);
  const expectedParent = parentKind(k);
  if (expectedParent && (!parentId || (parent && parent.kind !== expectedParent))) return <Navigate to="/" replace />;

  const back = () => navigate(parent ? kinds[parent.kind].route(parent.id) : '/');
  const saved = () => { toast.success(`${kinds[k].label}: создано`); back(); };
  const meta = parent ? `в ${kinds[parent.kind].label.toLowerCase()} «${parent.name}»` : undefined;

  return (
    <div className="mx-auto max-w-6xl space-y-5 p-4 md:p-6">
      <PageHeader eyebrow="Создание" title={`Новая запись: ${kinds[k].label.toLowerCase()}`} meta={meta}
        actions={k === 'trajectory'
          ? <HelpLink to="trajectory" anchor="edit" topic="ввод и вставка инклинометрии" />
          : <HelpLink to="hierarchy" anchor={k} topic={`уровень «${kinds[k].label}»`} />} />
      {k === 'trajectory'
        ? <TrajectoryForm designId={parentId} onSaved={saved} onCancel={back} />
        : <Panel><EntityForm kind={k} parentId={parentId} onSaved={saved} onCancel={back} /></Panel>}
    </div>
  );
};
