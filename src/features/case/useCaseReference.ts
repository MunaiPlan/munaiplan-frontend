import { useEffect, useState } from 'react';
import { importService, type WellPlanReport } from '../../services/import.service';

/** WellPlan data stored when the case was imported; null for cases entered manually. */
export const useCaseReference = (caseId: string | undefined) => {
  const [state, setState] = useState<{ loading: boolean; report: WellPlanReport | null }>({ loading: true, report: null });
  useEffect(() => {
    if (!caseId) return;
    let cancelled = false;
    importService.reference(caseId)
      .then((report) => { if (!cancelled) setState({ loading: false, report }); })
      .catch(() => { if (!cancelled) setState({ loading: false, report: null }); });
    return () => { cancelled = true; };
  }, [caseId]);
  return state;
};
