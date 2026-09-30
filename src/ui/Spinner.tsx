import { cn } from './cn';

export const Spinner = ({ size = 16, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={cn('animate-spin', className)}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

/** Full-area loading placeholder with a text label for screen readers. */
export const Loading = ({ label = 'Загрузка…' }: { label?: string }) => (
  <div role="status" className="flex items-center gap-2 p-6 text-sm text-ink-500">
    <Spinner /> {label}
  </div>
);
