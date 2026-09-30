import { createContext, useContext } from 'react';
import type { TreeNode } from './api';

export interface TreeState {
  tree: TreeNode[];
  loading: boolean;
  error: boolean;
  refresh: () => void;
  /** Nodes from the root down to the node with this id (empty when not found). */
  pathTo: (id: string | undefined) => TreeNode[];
  find: (id: string | undefined) => TreeNode | undefined;
}

export const TreeCtx = createContext<TreeState | null>(null);

export const useTree = (): TreeState => {
  const ctx = useContext(TreeCtx);
  if (!ctx) throw new Error('useTree must be used inside TreeProvider');
  return ctx;
};
