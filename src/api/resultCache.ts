/**
 * Session cache for calculation results (Torque & Drag formula, model and comparison).
 * A result depends only on the case's inputs, so it is reused until any data changes:
 * every successful write request clears the whole cache (see axios.api.ts), as does sign-out.
 * Requests in flight are shared, and they finish even if the view that started them unmounts,
 * so switching engines or charts never throws away a calculation.
 */
type Entry = { data?: unknown; promise?: Promise<unknown> };

const entries = new Map<string, Entry>();

export const clearResults = () => entries.clear();

export const peekResult = <T>(key: string): T | undefined => entries.get(key)?.data as T | undefined;

export function fetchResult<T>(key: string, fetcher: () => Promise<T>, force = false): Promise<T> {
  const hit = entries.get(key);
  if (!force && hit) {
    if (hit.data !== undefined) return Promise.resolve(hit.data as T);
    if (hit.promise) return hit.promise as Promise<T>;
  }
  const promise: Promise<T> = fetcher().then(
    (data) => {
      // Store only if the cache was not cleared (or the entry replaced) meanwhile.
      if (entries.get(key)?.promise === promise) entries.set(key, { data });
      return data;
    },
    (error: unknown) => {
      if (entries.get(key)?.promise === promise) entries.delete(key);
      throw error;
    },
  );
  entries.set(key, { promise });
  return promise;
}
