import { FC } from 'react';
import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom';

/** Router error boundary: unknown routes and unexpected rendering errors. */
const ErrorPage: FC = () => {
  const error = useRouteError();
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper p-6 text-center text-ink">
      <p className="font-mono text-6xl font-semibold tracking-tight">{notFound ? '404' : 'Ошибка'}</p>
      <p className="max-w-sm text-sm text-ink-500">
        {notFound ? 'Такой страницы нет. Возможно, запись была удалена.' : 'Что-то пошло не так при отображении страницы. Обновите страницу или вернитесь на главную.'}
      </p>
      <Link to="/" className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-ink-700">На главную</Link>
    </main>
  );
};

export default ErrorPage;
