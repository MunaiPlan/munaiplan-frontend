import type { ReactNode } from 'react';
import { cn } from './cn';

/** Monochrome notice: "info" is quiet, "warning" is outlined, "error" is solid ink. */
export const Alert = ({ tone = 'info', title, children, action, className }: {
  tone?: 'info' | 'warning' | 'error'; title?: ReactNode; children?: ReactNode; action?: ReactNode; className?: string;
}) => (
  <div role={tone === 'error' ? 'alert' : 'status'} className={cn('flex gap-3 rounded-md px-3.5 py-3 text-sm',
    tone === 'info' && 'bg-ink-100 text-ink-700',
    tone === 'warning' && 'border border-ink text-ink',
    tone === 'error' && 'bg-ink text-paper', className)}>
    <span aria-hidden="true" className="mt-px font-mono text-xs">{tone === 'info' ? 'i' : '!'}</span>
    <div className="min-w-0 flex-1">
      {title && <p className="font-medium">{title}</p>}
      {children && <div className={cn(title ? 'mt-1' : undefined, 'text-[13px] leading-relaxed')}>{children}</div>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  </div>
);

export const EmptyState = ({ title, description, action, icon }: { title: ReactNode; description?: ReactNode; action?: ReactNode; icon?: ReactNode }) => (
  <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-ink-300 px-6 py-12 text-center">
    {icon && <div className="mb-1 text-ink-300">{icon}</div>}
    <p className="text-sm font-medium text-ink">{title}</p>
    {description && <p className="max-w-sm text-xs text-ink-500">{description}</p>}
    {action && <div className="mt-3">{action}</div>}
  </div>
);

export const Badge = ({ children, tone = 'default' }: { children: ReactNode; tone?: 'default' | 'solid' | 'outline' }) => (
  <span className={cn('inline-flex items-center rounded px-1.5 py-0.5 text-2xs font-medium',
    tone === 'default' && 'bg-ink-100 text-ink-700', tone === 'solid' && 'bg-ink text-paper', tone === 'outline' && 'border border-ink-300 text-ink-700')}>
    {children}
  </span>
);
