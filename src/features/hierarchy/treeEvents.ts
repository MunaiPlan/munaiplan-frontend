/** Notifies the explorer that the hierarchy changed (create, rename, delete, import). */
const listeners = new Set<() => void>();

export const onTreeChanged = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
};

export const treeChanged = (): void => listeners.forEach((listener) => listener());
