import { FC } from 'react';
import type { PredictionError } from '../hooks/usePrediction';
import { docsHref } from '../features/docs/slugs';
import { Alert, Button } from '../ui';

/** Explains why a prediction is unavailable, including the case fields that must be completed. */
export const PredictionStatus: FC<{ error: PredictionError | null; onRetry: () => void }> = ({ error, onRetry }) => (
  <Alert tone={error?.status === 422 ? 'warning' : 'error'} title={error?.message ?? 'Нет данных для отображения.'}
    action={error?.status !== 422 ? <Button size="sm" onClick={onRetry}>Повторить</Button> : undefined}>
    {error && error.problems.length > 0 && <ul className="list-disc space-y-0.5 pl-4">{error.problems.map((p) => <li key={p}>{p}</li>)}</ul>}
    {error?.status === 422 && (
      <p className="mt-2 text-ink-500">
        Заполните данные кейса на вкладках «Ствол» и «Колонна» или импортируйте кейс из отчёта.{' '}
        <a href={docsHref('case', 'readiness')} target="_blank" rel="noopener" className="text-ink underline decoration-ink-300 underline-offset-2 hover:decoration-ink">
          Как подготовить кейс к расчёту
        </a>
      </p>
    )}
  </Alert>
);

/** Shown with every model result: predictions are not a validated engineering calculation. */
export const UnvalidatedNotice: FC = () => (
  <p className="text-xs text-ink-500">
    Прогноз ML-модели. Точность не подтверждена сравнением с эталонными расчётами — не используйте для инженерных решений.
  </p>
);
