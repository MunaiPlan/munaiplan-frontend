import { FC } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/** Renders children only for a signed-in user; otherwise a sign-in prompt. */
const ProtectedRoute: FC<{ children: JSX.Element }> = ({ children }) => {
  const isAuth = useAuth();
  if (isAuth) return children;
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper p-6 text-center text-ink">
      <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-sm bg-ink font-mono text-sm font-bold text-paper">M</span>
      <h1 className="text-xl font-semibold tracking-tight">Требуется вход</h1>
      <p className="max-w-xs text-sm text-ink-500">Чтобы открыть эту страницу, войдите в MunaiPlan.</p>
      <Link to="/auth" className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-ink-700">Войти</Link>
      <Link to="/docs" className="text-xs text-ink-500 underline decoration-ink-300 underline-offset-2 hover:text-ink">Справка</Link>
    </main>
  );
};

export default ProtectedRoute;
