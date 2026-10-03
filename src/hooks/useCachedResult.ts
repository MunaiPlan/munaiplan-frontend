import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchResult, peekResult } from '../api/resultCache';

/**
 * Loads a cached calculation result by key (null = disabled). A cached result renders at once;
 * otherwise it is fetched once and shared. `reload` forces a fresh calculation.
 */
export function useCachedResult<T, E>(key: string | null, fetcher: () => Promise<T>, toError: (error: unknown) => E) {
  const [state, setState] = useState<{ loading: boolean; data: T | null; error: E | null }>(() => {
    const cached = key === null ? undefined : peekResult<T>(key);
    return { loading: key !== null && cached === undefined, data: cached ?? null, error: null };
  });
  const fetcherRef = useRef(fetcher);
  const toErrorRef = useRef(toError);
  fetcherRef.current = fetcher;
  toErrorRef.current = toError;

  const run = useCallback((force: boolean) => {
    let alive = true;
    if (key === null) return () => { alive = false; };
    const cached = force ? undefined : peekResult<T>(key);
    if (cached !== undefined) {
      setState({ loading: false, data: cached, error: null });
      return () => { alive = false; };
    }
    // Keep the previous result on screen while a new one is calculated.
    setState((s) => ({ ...s, loading: true, error: null }));
    fetchResult(key, () => fetcherRef.current(), force).then(
      (data) => { if (alive) setState({ loading: false, data, error: null }); },
      (error: unknown) => { if (alive) setState({ loading: false, data: null, error: toErrorRef.current(error) }); },
    );
    return () => { alive = false; };
  }, [key]);

  useEffect(() => run(false), [run]);

  return { ...state, reload: () => { run(true); } };
}
