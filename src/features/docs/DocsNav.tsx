import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../ui';
import { groups } from './content/registry';
import { docsHref } from './slugs';

/** Sidebar: every group and its articles. Used docked on wide screens and in the drawer on phones. */
export const DocsNav = ({ current }: { current?: string }) => {
  const nav = useRef<HTMLElement>(null);
  // Keep the open article visible in a long sidebar.
  useEffect(() => {
    // Scroll only the sidebar's own container: scrollIntoView would also move (and interrupt) the page scroll.
    const link = nav.current?.querySelector<HTMLElement>('[aria-current="page"]');
    const box = nav.current?.closest<HTMLElement>('[data-docs-scroll]');
    if (!link || !box) return;
    const top = link.getBoundingClientRect().top - box.getBoundingClientRect().top;
    if (top < 0 || top > box.clientHeight - link.offsetHeight) box.scrollTop += top - box.clientHeight / 3;
  }, [current]);
  return (
    <nav ref={nav} aria-label="Разделы справки" className="space-y-5 text-sm">
      <Link to="/docs" aria-current={current ? undefined : 'page'}
        className={cn('block rounded px-3 py-1.5 touch:py-2.5', current ? 'text-ink-700 hover:bg-ink-100' : 'bg-ink font-medium text-paper')}>
        Главная справки
      </Link>
      {groups.map((g) => (
        <div key={g.key}>
          <p className="px-3 pb-1 text-2xs font-semibold uppercase tracking-wider text-ink-500">{g.title}</p>
          <ul>
            {g.articles.map((a) => {
              const active = a.slug === current;
            return (
                <li key={a.slug}>
                  <Link to={docsHref(a.slug)} aria-current={active ? 'page' : undefined}
                    className={cn('block rounded px-3 py-1.5 leading-5 touch:py-2.5', active ? 'bg-ink font-medium text-paper' : 'text-ink-700 hover:bg-ink-100 hover:text-ink')}>
                    {a.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
};
