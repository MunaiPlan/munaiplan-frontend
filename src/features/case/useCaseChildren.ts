import { useCallback, useEffect, useState } from 'react';
import { instance } from '../../api/axios.api';
import { apiErrorMessage } from '../../services/admin.service';

/** Loads the records of one case child resource (/api/v1/{resource}?caseId=). */
export function useCaseChildren<T>(resource: string, caseId: string) {
  const [state, setState] = useState<{ loading: boolean; items: T[]; error: string }>({ loading: true, items: [], error: '' });
  const load = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: '' }));
    instance.get<T[] | null>(`/api/v1/${resource}/?caseId=${encodeURIComponent(caseId)}`)
      .then(({ data }) => setState({ loading: false, items: Array.isArray(data) ? data : [], error: '' }))
      .catch((e) => setState({ loading: false, items: [], error: apiErrorMessage(e, 'Не удалось загрузить данные') }));
  }, [resource, caseId]);
  useEffect(load, [load]);
  return { ...state, reload: load };
}
