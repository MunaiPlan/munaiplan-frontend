import { useRef, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from './cn';

export interface TabItem<K extends string> {
  key: K;
  label: ReactNode;
}

interface TabsProps<K extends string> {
  items: readonly TabItem<K>[];
  value: K;
  onChange: (key: K) => void;
  /** "editor" = IDE file tabs; "pills" = compact secondary switcher. */
  variant?: 'editor' | 'pills';
  label?: string;
  className?: string;
}

/** Accessible tablist with arrow-key navigation. */
export function Tabs<K extends string>({ items, value, onChange, variant = 'editor', label, className }: TabsProps<K>) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: KeyboardEvent, index: number) => {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (index + step + items.length) % items.length;
    onChange(items[next].key);
    refs.current[next]?.focus();
  };
  return (
    <div role="tablist" aria-label={label}
      className={cn(variant === 'editor' ? 'flex items-end gap-0 border-b border-ink-200' : 'inline-flex gap-1 rounded-md bg-ink-100 p-0.5', 'overflow-x-auto no-scrollbar', className)}>
      {items.map((item, i) => {
        const active = item.key === value;
        return (
          <button key={item.key} ref={(el) => { refs.current[i] = el; }} type="button" role="tab" aria-selected={active}
            tabIndex={active ? 0 : -1} onClick={() => onChange(item.key)} onKeyDown={(e) => onKey(e, i)}
            className={cn('whitespace-nowrap text-sm transition-colors',
              variant === 'editor'
                ? cn('-mb-px border-b-2 px-3.5 py-2', active ? 'border-ink font-medium text-ink' : 'border-transparent text-ink-500 hover:text-ink')
                : cn('rounded px-2.5 py-1 text-xs', active ? 'bg-paper font-medium text-ink shadow-panel' : 'text-ink-500 hover:text-ink'))}>
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
