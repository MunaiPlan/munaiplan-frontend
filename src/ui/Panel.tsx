import type { ReactNode } from 'react';
import { cn } from './cn';

/** A titled section. Panels are the main unit of layout inside a page. */
export const Panel = ({ title, description, actions, children, className, bodyClassName }: {
  title?: ReactNode; description?: ReactNode; actions?: ReactNode; children: ReactNode; className?: string; bodyClassName?: string;
}) => (
  <section className={cn('rounded-lg border border-ink-200 bg-paper', className)}>
    {(title || actions) && (
      <header className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 border-b border-ink-200 px-4 py-3">
        <div className="min-w-0">
          {title && <h2 className="text-sm font-semibold text-ink">{title}</h2>}
          {description && <p className="mt-0.5 text-xs text-ink-500">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </header>
    )}
    <div className={cn('p-4', bodyClassName)}>{children}</div>
  </section>
);

/** Page heading with an eyebrow (entity type), title and actions. */
export const PageHeader = ({ eyebrow, title, meta, actions }: { eyebrow?: ReactNode; title: ReactNode; meta?: ReactNode; actions?: ReactNode }) => (
  <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3 pb-4">
    <div className="min-w-0 max-w-full">
      {eyebrow && <p className="text-2xs font-medium uppercase tracking-wider text-ink-500">{eyebrow}</p>}
      <h1 className="break-words text-xl font-semibold tracking-tight text-ink md:truncate">{title}</h1>
      {meta && <div className="mt-1 text-xs text-ink-500">{meta}</div>}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
  </div>
);
