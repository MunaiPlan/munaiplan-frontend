import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { hierarchyApi, type TreeNode } from './api';
import { onTreeChanged } from './treeEvents';
import { TreeCtx, type TreeState } from './treeState';



export const TreeProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<{ tree: TreeNode[]; loading: boolean; error: boolean }>({ tree: [], loading: true, error: false });

  const refresh = useCallback(() => {
    hierarchyApi.tree()
      .then((tree) => setState({ tree, loading: false, error: false }))
      .catch(() => setState((s) => ({ ...s, loading: false, error: true })));
  }, []);

  useEffect(() => { refresh(); return onTreeChanged(refresh); }, [refresh]);

  const paths = useMemo(() => {
    const map = new Map<string, TreeNode[]>();
    const walk = (nodes: TreeNode[], trail: TreeNode[]) => nodes.forEach((n) => {
      const path = [...trail, n];
      map.set(n.id, path);
      walk(n.children, path);
    });
    walk(state.tree, []);
    return map;
  }, [state.tree]);

  const value = useMemo<TreeState>(() => ({
    ...state,
    refresh,
    pathTo: (id) => (id ? paths.get(id) ?? [] : []),
    find: (id) => (id ? paths.get(id)?.at(-1) : undefined),
  }), [state, refresh, paths]);

  return <TreeCtx.Provider value={value}>{children}</TreeCtx.Provider>;
};
