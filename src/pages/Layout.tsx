import { FC, useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { Explorer } from '../features/explorer/Explorer';
import { TreeProvider } from '../features/hierarchy/TreeContext';
import { StatusBar } from '../layout/StatusBar';
import { TopBar } from '../layout/TopBar';

/**
 * IDE-style shell: explorer on the left, breadcrumbs and actions on top, the page in the
 * main panel and a status bar. Signed-out views (sign-in, protected-route notice) render bare.
 */
const Layout: FC = () => {
  const isAuth = useAuth();
  const { pathname } = useLocation();
  const { user } = useCurrentUser();
  const [explorerOpen, setExplorerOpen] = useState(() => {
    try { return localStorage.getItem('munaiplan.explorer.open') !== 'false'; } catch { return true; }
  });

  useEffect(() => {
    try { localStorage.setItem('munaiplan.explorer.open', String(explorerOpen)); } catch { /* storage unavailable */ }
  }, [explorerOpen]);

  // Ctrl/Cmd+B toggles the explorer, as in code editors.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') { e.preventDefault(); setExplorerOpen((v) => !v); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!isAuth || pathname === '/auth') {
    return <Outlet />;
  }

  return (
    <TreeProvider>
      <div className="flex h-screen flex-col overflow-hidden bg-paper text-ink">
        <div className="flex min-h-0 flex-1">
          <aside className={`${explorerOpen ? "flex" : "hidden"} w-72 shrink-0 flex-col border-r border-ink-200 bg-ink-50`}>
            <Link to="/" className="flex h-11 shrink-0 items-center gap-2 border-b border-ink-200 px-4">
              <span aria-hidden="true" className="flex h-5 w-5 items-center justify-center rounded-sm bg-ink font-mono text-2xs font-bold text-paper">M</span>
              <span className="text-sm font-semibold tracking-tight">MunaiPlan</span>
            </Link>
            <div className="min-h-0 flex-1"><Explorer /></div>
          </aside>
          <div className="flex min-w-0 flex-1 flex-col">
            <TopBar user={user} explorerOpen={explorerOpen} onToggleExplorer={() => setExplorerOpen((v) => !v)} />
            <main id="main" className="thin-scrollbar min-h-0 flex-1 overflow-y-auto">
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
