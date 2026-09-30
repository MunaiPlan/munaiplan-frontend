import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FiX } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { Explorer } from '../features/explorer/Explorer';
import { TreeProvider } from '../features/hierarchy/TreeContext';
import { StatusBar } from '../layout/StatusBar';
import { TopBar } from '../layout/TopBar';
import { cn } from '../ui';

/** Tailwind's `md` breakpoint: from here up the explorer is a docked panel, below it a drawer. */
const DOCKED = '(min-width: 768px)';

/**
 * IDE-style shell: explorer on the left, breadcrumbs and actions on top, the page in the
 * main panel and a status bar. Signed-out views (landing, sign-in, protected-route notice) render bare.
 *
 * On phones the explorer is an off-canvas drawer: it opens from the top bar, closes on
 * navigation, on Escape and on the scrim, and keeps keyboard focus inside while open.
 */
const Layout: FC = () => {
  const isAuth = useAuth();
  const { pathname, search } = useLocation();
  const { user } = useCurrentUser();
  const docked = useMediaQuery(DOCKED);
  const drawer = useRef<HTMLElement>(null);
  const [explorerOpen, setExplorerOpen] = useState(() => {
    try { return localStorage.getItem('munaiplan.explorer.open') !== 'false'; } catch { return true; }
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const toggleExplorer = useCallback(() => {
    if (docked) setExplorerOpen((v) => !v);
    else setDrawerOpen((v) => !v);
  }, [docked]);

  useEffect(() => {
    try { localStorage.setItem('munaiplan.explorer.open', String(explorerOpen)); } catch { /* storage unavailable */ }
  }, [explorerOpen]);

  // Ctrl/Cmd+B toggles the explorer, as in code editors.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') { e.preventDefault(); toggleExplorer(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggleExplorer]);

  // The drawer closes after navigating and when the screen grows into the docked layout.
  useEffect(closeDrawer, [pathname, search, docked, closeDrawer]);

  useFocusTrap(drawer, drawerOpen && !docked, closeDrawer);

  if (!isAuth || pathname === '/auth') {
    return <Outlet />;
  }

  const drawerMode = !docked;
  return (
    <TreeProvider>
      <div className="flex h-dvh flex-col overflow-hidden bg-paper text-ink">
        <div className="flex min-h-0 flex-1">
          {drawerMode && drawerOpen && (
            <div aria-hidden="true" onClick={closeDrawer} className="fixed inset-0 z-30 bg-ink/40" />
          )}
          <aside id="explorer" ref={drawer}
            role={drawerMode ? 'dialog' : undefined} aria-modal={drawerMode && drawerOpen ? true : undefined}
            aria-label={drawerMode ? 'Проводник' : undefined}
            className={cn('w-72 shrink-0 flex-col border-r border-ink-200 bg-ink-50',
              drawerMode
                ? cn('fixed inset-y-0 left-0 z-40 flex w-[min(20rem,85vw)] shadow-pop transition-[transform,visibility] duration-200 ease-out',
                  drawerOpen ? 'visible translate-x-0' : 'invisible -translate-x-full')
                : cn('md:w-64 lg:w-72', explorerOpen ? 'flex' : 'hidden'))}>
            <div className="flex h-11 shrink-0 items-center justify-between border-b border-ink-200 pl-4 pr-1 touch:h-12">
              <Link to="/" className="flex items-center gap-2">
                <span aria-hidden="true" className="flex h-5 w-5 items-center justify-center rounded-sm bg-ink font-mono text-2xs font-bold text-paper">M</span>
                <span className="text-sm font-semibold tracking-tight">MunaiPlan</span>
              </Link>
              {drawerMode && (
                <button type="button" onClick={closeDrawer} aria-label="Закрыть проводник"
                  className="flex h-11 w-11 items-center justify-center rounded text-ink-500 hover:bg-ink-100 hover:text-ink">
                  <FiX className="h-5 w-5" />
                </button>
              )}
            </div>
            <div className="min-h-0 flex-1"><Explorer /></div>
          </aside>
          <div className="flex min-w-0 flex-1 flex-col">
            <TopBar user={user} explorerOpen={docked ? explorerOpen : drawerOpen} onToggleExplorer={toggleExplorer} />
            <main id="main" className="thin-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
              <Outlet />
            </main>
          </div>
        </div>
        <StatusBar user={user} />
      </div>
    </TreeProvider>
  );
};

export default Layout;
