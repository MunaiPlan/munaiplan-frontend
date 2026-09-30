import type { ReactNode } from 'react';
import { cn } from './cn';

export interface Column<T> {
  key: string;
  header: ReactNode;
  unit?: string;
  numeric?: boolean;
  render: (row: T, index: number) => ReactNode;
}

/**
 * Dense, scrollable table. Numeric columns are right-aligned with tabular figures. Wide tables
 * scroll sideways inside their own frame, which is focusable so the keyboard can scroll it too.
 */
export function DataTable<T>({ columns, rows, rowKey, empty = 'Нет данных', maxHeight, caption }: {
  columns: Column<T>[]; rows: T[]; rowKey: (row: T, index: number) => string; empty?: ReactNode; maxHeight?: string; caption?: string;
}) {
  return (
    <div role="region" aria-label={caption} tabIndex={caption ? 0 : undefined}
      className="thin-scrollbar max-w-full overflow-auto overscroll-x-contain rounded-md border border-ink-200"
      style={maxHeight ? { maxHeight } : undefined}>
      <table className="w-full border-collapse text-left text-sm">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead className="sticky top-0 z-10 bg-ink-50">
          <tr>
            {columns.map((c) => (
              <th key={c.key} scope="col" className={cn('border-b border-ink-200 px-3 py-2 text-2xs font-medium uppercase tracking-wide text-ink-500', c.numeric && 'text-right')}>
                {c.header}{c.unit && <span className="ml-1 whitespace-nowrap normal-case tracking-normal text-ink-500">({c.unit})</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={columns.length} className="px-3 py-6 text-center text-ink-500">{empty}</td></tr>
          ) : rows.map((row, i) => (
            <tr key={rowKey(row, i)} className="border-b border-ink-100 last:border-0 hover:bg-ink-50">
              {columns.map((c) => (
                <td key={c.key} className={cn('px-3 py-1.5', c.numeric && 'num whitespace-nowrap text-right font-mono text-xs')}>{c.render(row, i)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
