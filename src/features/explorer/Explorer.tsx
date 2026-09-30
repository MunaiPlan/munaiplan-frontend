import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiChevronRight, FiPlus, FiRefreshCw, FiUploadCloud, FiMinusSquare } from 'react-icons/fi';
import { cn } from '../../ui';
import { kinds, type Kind } from '../hierarchy/hierarchy';
import { KindIcon } from '../hierarchy/icons';
import { useTree } from '../hierarchy/treeState';
import type { TreeNode } from '../hierarchy/api';

const STORAGE_KEY = 'munaiplan.explorer.expanded.v1';
const UUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

const loadExpanded = (): Set<string> => {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as string[]);
  } catch {
    return new Set();
  }
};

interface Row {
  node: TreeNode;
  depth: number;
  parent?: TreeNode;
}

/** Visible rows in display order; a filter keeps matches and their ancestors, fully expanded. */
const flatten = (nodes: TreeNode[], expanded: Set<string>, filter: string): Row[] => {
  const rows: Row[] = [];
  const q = filter.trim().toLowerCase();
  const matches = (n: TreeNode): boolean => n.name.toLowerCase().includes(q) || n.children.some(matches);
  const walk = (list: TreeNode[], depth: number, parent?: TreeNode) => list.forEach((node) => {
    if (q && !matches(node)) return;
    rows.push({ node, depth, parent });
    if (q || expanded.has(node.id)) walk(node.children, depth + 1, node);
  });
  walk(nodes, 0);
  return rows;
};

interface MenuState { x: number; y: number; node: TreeNode }

export const Explorer = () => {
  const { tree, loading, error, refresh, pathTo } = useTree();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const activeId = pathname.match(UUID)?.[0];
  const [expanded, setExpanded] = useState<Set<string>>(loadExpanded);
  const [filter, setFilter] = useState('');
  const [focusId, setFocusId] = useState<string | undefined>();
  const [menu, setMenu] = useState<MenuState | null>(null);
  const rowRefs = useRef(new Map<string, HTMLDivElement>());

  // Reveal the record being viewed.
  useEffect(() => {
    const path = pathTo(activeId);
    if (path.length > 1) {
      setExpanded((prev) => {
        const missing = path.slice(0, -1).filter((n) => !prev.has(n.id));
        return missing.length ? new Set([...prev, ...missing.map((n) => n.id)]) : prev;
      });
    }
  }, [activeId, pathTo]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...expanded])); } catch { /* storage unavailable */ }
  }, [expanded]);

  const rows = useMemo(() => flatten(tree, expanded, filter), [tree, expanded, filter]);

  const toggle = (id: string, open?: boolean) => setExpanded((prev) => {
    const next = new Set(prev);
    const shouldOpen = open ?? !next.has(id);
    if (shouldOpen) next.add(id); else next.delete(id);
    return next;
  });
  const open = (node: TreeNode) => navigate(kinds[node.kind].route(node.id));
  const createChild = (node: TreeNode) => {
    const child = kinds[node.kind].child;
    if (child) navigate(`/new/${child}?parent=${node.id}`);
  };
  const focusRow = (id: string) => { setFocusId(id); rowRefs.current.get(id)?.focus(); };

  const onKeyDown = (e: KeyboardEvent, index: number) => {
    const { node, parent } = rows[index];
    const isOpen = expanded.has(node.id);
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); if (rows[index + 1]) focusRow(rows[index + 1].node.id); break;
      case 'ArrowUp': e.preventDefault(); if (rows[index - 1]) focusRow(rows[index - 1].node.id); break;
      case 'ArrowRight': e.preventDefault();
        if (node.children.length && !isOpen) toggle(node.id, true);
        else if (isOpen && node.children[0]) focusRow(node.children[0].id);
        break;
      case 'ArrowLeft': e.preventDefault();
        if (isOpen) toggle(node.id, false); else if (parent) focusRow(parent.id);
        break;
      case 'Enter': e.preventDefault(); open(node); break;
      case 'ContextMenu': case 'F10': {
        if (e.key === 'F10' && !e.shiftKey) return;
        e.preventDefault();
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setMenu({ x: rect.left + 24, y: rect.bottom, node });
        break;
      }
    }
  };

  const onContextMenu = (e: MouseEvent, node: TreeNode) => {
    e.preventDefault();
    setMenu({ x: e.clientX, y: e.clientY, node });
  };

  return (
    <nav aria-label="Проводник" className="flex h-full min-h-0 flex-col">
      <div className="flex items-center justify-between px-3 pb-1 pt-3">
        <span className="text-2xs font-semibold uppercase tracking-wider text-ink-500">Проводник</span>
        <div className="flex items-center gap-0.5 text-ink-500">
          <IconButton label="Новая компания" onClick={() => navigate('/new/company')}><FiPlus /></IconButton>
          <IconButton label="Импорт из WellPlan" onClick={() => navigate('/import')}><FiUploadCloud /></IconButton>
          <IconButton label="Свернуть всё" onClick={() => setExpanded(new Set())}><FiMinusSquare /></IconButton>
          <IconButton label="Обновить" onClick={refresh}><FiRefreshCw /></IconButton>
        </div>
      </div>
      <div className="px-3 pb-2">
        <input type="search" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Поиск…" aria-label="Поиск в проводнике"
          className="h-7 w-full rounded border border-ink-200 bg-paper px-2 text-xs focus:border-ink focus:outline-none focus:ring-0 touch:h-10" />
      </div>
      <div role="tree" aria-label="Иерархия скважин" className="thin-scrollbar min-h-0 flex-1 overflow-y-auto pb-4">
        {loading && <p className="px-4 py-2 text-xs text-ink-500">Загрузка…</p>}
        {error && <button type="button" onClick={refresh} className="px-4 py-2 text-left text-xs underline">Не удалось загрузить. Повторить</button>}
        {!loading && !error && rows.length === 0 && (
          <p className="px-4 py-2 text-xs text-ink-500">{filter ? 'Ничего не найдено' : 'Пока нет компаний'}</p>
        )}
        {rows.map(({ node, depth }, index) => {
          const active = node.id === activeId;
          const isOpen = filter ? true : expanded.has(node.id);
          const hasChildren = node.children.length > 0;
          return (
            <div key={node.id} ref={(el) => { if (el) rowRefs.current.set(node.id, el); else rowRefs.current.delete(node.id); }}
              role="treeitem" aria-level={depth + 1} aria-selected={active} aria-expanded={hasChildren ? isOpen : undefined}
              tabIndex={(focusId ?? activeId ?? rows[0]?.node.id) === node.id ? 0 : -1}
              onKeyDown={(e) => onKeyDown(e, index)} onFocus={() => setFocusId(node.id)}
              onClick={() => open(node)} onContextMenu={(e) => onContextMenu(e, node)}
              className={cn('group flex h-7 cursor-pointer select-none items-center gap-1 pr-2 text-[13px] outline-none touch:h-11 touch:text-sm',
                active ? 'bg-ink text-paper' : 'text-ink-700 hover:bg-ink-100 focus-visible:bg-ink-100')}
              style={{ paddingLeft: 8 + depth * 14 }}>
              <button type="button" tabIndex={-1} aria-hidden="true"
                onClick={(e) => { e.stopPropagation(); if (hasChildren) toggle(node.id); }}
                className={cn('flex h-4 w-4 shrink-0 items-center justify-center touch:h-11 touch:w-8', !hasChildren && 'invisible')}>
                <FiChevronRight className={cn('h-3.5 w-3.5 transition-transform', isOpen && 'rotate-90')} />
              </button>
              <KindIcon kind={node.kind} className={cn('h-3.5 w-3.5 shrink-0', active ? 'text-paper' : 'text-ink-500')} />
              <span className="truncate" title={`${kinds[node.kind].label}: ${node.name}`}>{node.name || 'Без названия'}</span>
              {kinds[node.kind].child && (
                <button type="button" tabIndex={-1} aria-label={`Создать: ${kinds[kinds[node.kind].child as Kind].label}`}
                  onClick={(e) => { e.stopPropagation(); createChild(node); }}
                  className={cn('ml-auto hidden h-5 w-5 shrink-0 items-center justify-center rounded group-hover:flex touch:h-10 touch:w-10',
                    active ? 'hover:bg-ink-700 touch:flex' : 'hover:bg-ink-200')}>
                  <FiPlus className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
      {menu && <ContextMenu menu={menu} onClose={() => setMenu(null)} onOpen={open} onCreate={createChild} />}
    </nav>
  );
};

const IconButton = ({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) => (
  <button type="button" aria-label={label} title={label} onClick={onClick}
    className="flex h-6 w-6 items-center justify-center rounded hover:bg-ink-100 hover:text-ink touch:h-10 touch:w-10">
    {children}
  </button>
);

const ContextMenu = ({ menu, onClose, onOpen, onCreate }: {
  menu: MenuState; onClose: () => void; onOpen: (n: TreeNode) => void; onCreate: (n: TreeNode) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const child = kinds[menu.node.kind].child;
  useEffect(() => {
    ref.current?.querySelector('button')?.focus();
    const close = (e: Event) => { if (!ref.current?.contains(e.target as Node)) onClose(); };
    const onKey = (e: globalThis.KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', onKey); };
  }, [onClose]);
  const item = 'block w-full px-3 py-1.5 touch:py-3 text-left text-[13px] hover:bg-ink hover:text-paper focus:bg-ink focus:text-paper focus:outline-none';
  return (
    <div ref={ref} role="menu" className="fixed z-50 min-w-[12rem] overflow-hidden rounded-md border border-ink-200 bg-paper py-1 shadow-pop"
      style={{ left: Math.min(menu.x, window.innerWidth - 220), top: Math.min(menu.y, window.innerHeight - 100) }}>
      <p className="truncate px-3 pb-1 pt-0.5 text-2xs uppercase tracking-wider text-ink-500">{kinds[menu.node.kind].label}</p>
      <button type="button" role="menuitem" className={item} onClick={() => { onOpen(menu.node); onClose(); }}>Открыть</button>
      {child && (
        <button type="button" role="menuitem" className={item} onClick={() => { onCreate(menu.node); onClose(); }}>
          Создать: {kinds[child].label.toLowerCase()}
        </button>
      )}
    </div>
  );
};
