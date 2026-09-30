import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { FiMenu, FiSearch, FiX } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { cn } from '../../ui';
import { CONTACT_EMAIL } from '../landing/contact';
import { ArticleView } from './ArticleView';
import { articleBySlug } from './content/registry';
import { DocsHome } from './DocsHome';
import { DocsNav } from './DocsNav';
import { SearchDialog } from './SearchDialog';
import { docSlugs, type DocSlug } from './slugs';
import { useDocumentMeta } from './useDocumentMeta';

const DOCKED = '(min-width: 768px)';
const HOME_TITLE = 'Справка MunaiPlan — руководство пользователя';
const HOME_DESCRIPTION = 'Руководство пользователя MunaiPlan: иерархия данных, импорт отчётов, траектория, данные кейса, прогнозы Torque & Drag, сравнение с отчётом, глоссарий и ответы на вопросы.';

/**
 * The public user manual at /docs and /docs/:slug. It is loaded lazily as its own chunk and works
 * signed in or out. Layout: header with search, sidebar (a drawer on phones), the article with its
 * table of contents.
 */
export const DocsApp = () => {
  const { slug } = useParams<{ slug?: string }>();
  const { pathname, hash } = useLocation();
  const isAuth = useAuth();
  const docked = useMediaQuery(DOCKED);
  const article = slug && (docSlugs as readonly string[]).includes(slug) ? articleBySlug[slug as DocSlug] : undefined;
  const notFound = Boolean(slug) && !article;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const drawer = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement | null>(null);
  const firstRender = useRef(true);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const setHeading = useCallback((el: HTMLHeadingElement | null) => { heading.current = el; }, []);

  useDocumentMeta(
    article ? `${article.title} — Справка MunaiPlan` : notFound ? 'Статья не найдена — Справка MunaiPlan' : HOME_TITLE,
    article?.description ?? HOME_DESCRIPTION,
    pathname,
  );

  // New article: move focus to its title for screen readers (not on the first load).
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    heading.current?.focus({ preventScroll: true });
  }, [pathname]);

  // Scroll to the anchor in the address, or to the top of a new page. A new page (or a deep link)
  // jumps straight there; an anchor on the same page scrolls smoothly unless reduced motion is set.
  const scrolledPath = useRef<string | null>(null);
  useEffect(() => {
    const samePage = scrolledPath.current === pathname;
    scrolledPath.current = pathname;
    const frame = window.requestAnimationFrame(() => {
      const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
      if (target) target.scrollIntoView({ block: 'start', behavior: samePage ? 'auto' : 'instant' });
      else window.scrollTo({ top: 0, behavior: 'instant' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash]);

  useEffect(closeDrawer, [pathname, hash, docked, closeDrawer]);
  useFocusTrap(drawer, drawerOpen && !docked, closeDrawer);

  // "/" or Ctrl/⌘+K opens search; "/" is ignored while typing in a field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement | null)?.closest('input, textarea, select, [contenteditable="true"]');
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearchOpen(true); }
      else if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) { e.preventDefault(); setSearchOpen(true); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // The page behind an open drawer or search does not scroll.
  useEffect(() => {
    if (!(searchOpen || (drawerOpen && !docked))) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [searchOpen, drawerOpen, docked]);

  const iconButton = 'flex h-10 w-10 shrink-0 items-center justify-center rounded text-ink-700 hover:bg-ink-100 hover:text-ink touch:h-11 touch:w-11';

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <a href="#docs-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">
        Перейти к содержанию
      </a>

      <header className="sticky top-0 z-30 border-b border-ink-200 bg-paper/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[90rem] items-center gap-1 px-2 sm:gap-2 sm:px-4">
          {!docked && (
            <button type="button" onClick={() => setDrawerOpen(true)} aria-label="Разделы справки" aria-expanded={drawerOpen} aria-controls="docs-drawer" className={iconButton}>
              <FiMenu className="h-5 w-5" />
            </button>
          )}
          <Link to="/docs" className="flex min-w-0 items-center gap-2 px-1" aria-label="Справка MunaiPlan — главная">
            <span aria-hidden="true" className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-ink font-mono text-2xs font-bold text-paper">M</span>
            <span className="hidden font-semibold tracking-tight sm:inline">MunaiPlan</span>
            <span aria-hidden="true" className="hidden text-ink-300 sm:inline">/</span>
            <span className="truncate font-medium">Справка</span>
          </Link>
          <div className="flex-1" />
          <button type="button" onClick={() => setSearchOpen(true)} aria-label="Поиск по справке" aria-keyshortcuts="/ Control+K Meta+K"
            className="hidden h-9 w-64 items-center gap-2 rounded-md border border-ink-200 bg-ink-50 px-3 text-sm text-ink-500 hover:border-ink-300 hover:text-ink md:flex">
            <FiSearch aria-hidden="true" />
            <span className="flex-1 text-left">Поиск по справке</span>
            <kbd className="rounded border border-ink-300 bg-paper px-1.5 font-mono text-2xs">/</kbd>
          </button>
          <button type="button" onClick={() => setSearchOpen(true)} aria-label="Поиск по справке" className={cn(iconButton, 'md:hidden')}>
            <FiSearch className="h-5 w-5" />
          </button>
          <Link to={isAuth ? '/' : '/auth'}
            className="inline-flex h-9 shrink-0 items-center rounded-md bg-ink px-3 text-sm font-medium text-paper hover:bg-ink-700 touch:h-11 sm:px-4">
            {isAuth ? <><span className="sm:hidden">В приложение</span><span className="hidden sm:inline">Открыть приложение</span></> : 'Войти'}
          </Link>
        </div>
      </header>

      <div className="mx-auto flex max-w-[90rem]">
        {docked ? (
          <aside data-docs-scroll className="thin-scrollbar sticky top-14 h-[calc(100dvh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r border-ink-200 px-3 py-6 lg:w-72">
            <DocsNav current={article?.slug} />
          </aside>
        ) : (
          <>
            {drawerOpen && <div aria-hidden="true" onClick={closeDrawer} className="fixed inset-0 z-40 bg-ink/40" />}
            <div ref={drawer} id="docs-drawer" data-docs-scroll role="dialog" aria-modal={drawerOpen || undefined} aria-label="Разделы справки"
              className={cn('thin-scrollbar fixed inset-y-0 left-0 z-50 w-[min(20rem,85vw)] overflow-y-auto bg-paper shadow-pop transition-[transform,visibility] duration-200 ease-out',
                drawerOpen ? 'visible translate-x-0' : 'invisible -translate-x-full')}>
              <div className="sticky top-0 flex h-14 items-center justify-between border-b border-ink-200 bg-paper pl-4 pr-1">
                <span className="font-semibold">Разделы</span>
                <button type="button" onClick={closeDrawer} aria-label="Закрыть разделы" className={iconButton}><FiX className="h-5 w-5" /></button>
              </div>
              <div className="px-2 py-4"><DocsNav current={article?.slug} /></div>
            </div>
          </>
        )}

        <main id="docs-content" className="min-w-0 flex-1 px-4 pb-16 pt-8 sm:px-6 md:px-10 lg:px-12">
          {article ? (
            <ArticleView key={article.slug} article={article} headingRef={setHeading} />
          ) : notFound ? (
            <div className="max-w-xl">
              <p className="font-mono text-5xl font-semibold tracking-tight">404</p>
              <h1 ref={setHeading} tabIndex={-1} className="mt-4 text-2xl font-semibold tracking-tight focus:outline-none">Статья не найдена</h1>
              <p className="mt-3 leading-7 text-ink-500">Возможно, ссылка устарела. Откройте главную справки или воспользуйтесь поиском.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/docs" className="inline-flex h-10 items-center rounded-md bg-ink px-4 text-sm font-medium text-paper hover:bg-ink-700 touch:h-11">Главная справки</Link>
                <button type="button" onClick={() => setSearchOpen(true)} className="inline-flex h-10 items-center rounded-md border border-ink-300 px-4 text-sm font-medium hover:border-ink touch:h-11">Поиск</button>
              </div>
            </div>
          ) : (
            <DocsHome headingRef={setHeading} onSearch={() => setSearchOpen(true)} />
          )}

          <footer className="mt-16 flex max-w-3xl flex-col gap-2 border-t border-ink-200 pt-6 text-xs text-ink-500 sm:flex-row sm:justify-between">
            <span>© {new Date().getFullYear()} MunaiPlan · Прогнозы ML-моделей не валидированы</span>
            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-ink">{CONTACT_EMAIL}</a>
          </footer>
        </main>
      </div>

      <SearchDialog open={searchOpen} onClose={closeSearch} />
    </div>
  );
};
