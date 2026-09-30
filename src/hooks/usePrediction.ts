import { useCallback, useEffect, useState } from 'react';
import { instance } from '../api/axios.api';

export type PredictionEndpoint = 'effective-tension' | 'weight-on-bit' | 'surface-torque' | 'min-weight';

export interface PredictionError {
  status?: number;
  message: string;
  problems: string[];
}

const toPredictionError = (error: unknown): PredictionError => {
  const response = (error as { response?: { status?: number; data?: { message?: string; problems?: string[] } } })?.response;
  const status = response?.status;
  const problems = Array.isArray(response?.data?.problems) ? response!.data!.problems! : [];
  const fallback = status === 503 ? 'Сервис прогнозирования недоступен. Повторите позже.'
    : status === 502 ? 'Сервис прогнозирования вернул некорректный ответ.'
    : 'Не удалось выполнить расчёт.';
  return { status, message: status === 422 ? 'Кейс не готов к расчёту Torque & Drag:' : (response?.data?.message || fallback), problems };
};

/** Runs one Torque & Drag model for a case and exposes loading, data, a typed error and reload. */
export function usePrediction<T>(endpoint: PredictionEndpoint, caseId: string | undefined) {
  const [state, setState] = useState<{ loading: boolean; data: T | null; error: PredictionError | null }>(
    { loading: Boolean(caseId), data: null, error: null });

  const load = useCallback(async (signal?: AbortSignal) => {
    if (!caseId) return;
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const { data } = await instance.post<T>(`/api/v1/torque-and-drag/${endpoint}?caseId=${encodeURIComponent(caseId)}`, null, { signal });
      setState({ loading: false, data, error: null });
    } catch (error) {
      if (signal?.aborted) return;
      setState({ loading: false, data: null, error: toPredictionError(error) });
    }
  }, [endpoint, caseId]);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  return { ...state, reload: () => load() };
}
