import { docsHref, type DocSlug } from '../features/docs/slugs';
import { cn } from '../ui';

/**
 * Contextual «?» link from an app screen to the matching manual article. It opens a new tab,
 * so unsaved form input on the screen is never lost.
 */
export const HelpLink = ({ to, anchor, topic, className }: {
  to: DocSlug; anchor?: string; topic: string; className?: string;
}) => (
  <a href={docsHref(to, anchor)} target="_blank" rel="noopener"
    title={`Справка: ${topic} (откроется в новой вкладке)`} aria-label={`Справка: ${topic}. Откроется в новой вкладке`}
    className={cn('inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-ink-300 bg-paper text-xs font-semibold text-ink-500 transition-colors hover:border-ink hover:text-ink touch:h-11 touch:w-11 touch:text-sm', className)}>
    ?
  </a>
);
