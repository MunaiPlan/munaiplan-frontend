import { FC, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiUploadCloud } from 'react-icons/fi';
import type { TreeNode } from '../features/hierarchy/api';
import { kinds, type Kind } from '../features/hierarchy/hierarchy';
import { KindIcon } from '../features/hierarchy/icons';
import { useTree } from '../features/hierarchy/treeState';
import { Button, DataTable, EmptyState, Loading, PageHeader, Panel, type Column } from '../ui';

const count = (nodes: TreeNode[], kind: Kind): number =>
  nodes.reduce((sum, n) => sum + (n.kind === kind ? 1 : 0) + count(n.children, kind), 0);

/** Workspace overview: totals, companies and entry points. */
const Home: FC = () => {
  const { tree, loading } = useTree();
  const navigate = useNavigate();
  const totals = useMemo(() => (['company', 'field', 'well', 'case'] as Kind[]).map((k) => ({ kind: k, value: count(tree, k) })), [tree]);

  const columns: Column<TreeNode>[] = [
    { key: 'name', header: 'Компания', render: (c) => (
      <Link to={kinds.company.route(c.id)} className="flex items-center gap-2 font-medium hover:underline">
        <KindIcon kind="company" className="h-4 w-4 text-ink-500" />{c.name}
      </Link>) },
    { key: 'fields', header: 'Месторождения', numeric: true, render: (c) => count(c.children, 'field') },
    { key: 'wells', header: 'Скважины', numeric: true, render: (c) => count(c.children, 'well') },
    { key: 'cases', header: 'Кейсы', numeric: true, render: (c) => count(c.children, 'case') },
  ];

  if (loading) return <Loading />;
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <PageHeader eyebrow="Рабочая область" title="Обзор"
        actions={<>
          <Button size="sm" icon={<FiUploadCloud />} onClick={() => navigate('/import')}>Импорт из WellPlan</Button>
          <Button size="sm" variant="primary" icon={<FiPlus />} onClick={() => navigate('/new/company')}>Новая компания</Button>
        </>} />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {totals.map(({ kind, value }) => (
          <div key={kind} className="rounded-lg border border-ink-200 px-4 py-3">
            <p className="flex items-center gap-1.5 text-2xs uppercase tracking-wider text-ink-500"><KindIcon kind={kind} />{kinds[kind].plural}</p>
            <p className="num mt-1 font-mono text-2xl">{value}</p>
          </div>
        ))}
      </div>
      {tree.length === 0 ? (
        <EmptyState title="Рабочая область пуста" description="Создайте компанию вручную или импортируйте кейс из отчёта WellPlan — иерархия будет создана автоматически."
          action={<div className="flex gap-2"><Button icon={<FiUploadCloud />} onClick={() => navigate('/import')}>Импорт</Button>
            <Button variant="primary" icon={<FiPlus />} onClick={() => navigate('/new/company')}>Новая компания</Button></div>} />
      ) : (
        <Panel title="Компании" bodyClassName="p-0">
          <DataTable columns={columns} rows={tree} rowKey={(c) => c.id} caption="Компании" />
        </Panel>
      )}
      <p className="text-xs text-ink-500">Совет: правый клик по элементу в проводнике открывает меню; стрелки ↑↓←→ и Enter — навигация с клавиатуры.</p>
    </div>
  );
};

export default Home;
