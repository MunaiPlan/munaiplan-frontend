import type { ReactNode } from 'react';
import { cn } from './cn';

export interface KeyValueItem {
  label: ReactNode;
  value: ReactNode;
  unit?: string;
}

const isBlank = (v: ReactNode) => v === null || v === undefined || v === '';

/** Read-only properties in a two-column grid; numbers use tabular figures. */
export const KeyValue = ({ items, columns = 2, className }: { items: KeyValueItem[]; columns?: 1 | 2 | 3; className?: string }) => (
  <dl className={cn('grid gap-x-8 gap-y-3', columns === 1 ? 'grid-cols-1' : columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', className)}>
    {items.map((item, i) => (
      <div key={i} className="flex items-baseline justify-between gap-4 border-b border-ink-100 pb-2">
        <dt className="text-xs text-ink-500">{item.label}</dt>
        <dd className={cn('break-words text-right text-sm text-ink', typeof item.value === 'number' && 'num font-mono')}>
          {isBlank(item.value) ? <span className="text-ink-300">—</span> : item.value}
          {item.unit && !isBlank(item.value) && <span className="ml-1 font-mono text-2xs text-ink-500">{item.unit}</span>}
        </dd>
      </div>
    ))}
  </dl>
);
