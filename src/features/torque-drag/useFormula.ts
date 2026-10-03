import { useCallback, useEffect, useState } from 'react';
import { instance } from '../../api/axios.api';
import type { PredictionError } from '../../hooks/usePrediction';

export type Curves = Record<string, (number | null)[]>;

export interface FormulaOperation {
  operation: string;
  hook_load: number;
  surface_torque: number;
  neutral_point_from_bit?: number;
  max_side_force: number;
  buckling: '' | 'sinusoidal' | 'helical';
  buckling_top?: number;
  buckling_bottom?: number;
}

export interface FormulaParameters {
  mud_density: number;
  buoyancy_factor: number;
  block_weight: number;
  wob_rotating: number;
  wob_sliding: number;
  tob: number;
  overpull_back_reaming: number;
  trip_speed: number;
  step: number;
  yield_fraction: number;
  steel_density: number;
  young_modulus: number;
  friction_cased?: number;
  friction_open?: number;
  hole_sections: { top: number; bottom: number; diameter: number; cased: boolean; friction: number }[];
  sources: Record<string, 'report' | 'default' | 'user'>;
}

export interface FormulaResult {
  case_id: string;
  bit_depth: number;
  families: Record<string, Curves>;
  summary: FormulaOperation[];
  limits: {
    overpull_margin?: number;
    min_wob_sinusoidal?: number; min_wob_sinusoidal_depth?: number;
    min_wob_helical?: number; min_wob_helical_depth?: number;
  };
  parameters: FormulaParameters;
  assumptions: string[];
  warnings: string[];
}

/** User overrides sent as query parameters (units as shown: т, кН·м, м). */
export interface FormulaOverrides {
  ff_cased?: number;
  ff_open?: number;
  wob?: number;
  wob_slide?: number;
  tob?: number;
  block_weight?: number;
}

const toError = (error: unknown): PredictionError => {
  const response = (error as { response?: { status?: number; data?: { message?: string; problems?: string[] } } })?.response;
  const status = response?.status;
  return {
    status,
    problems: Array.isArray(response?.data?.problems) ? response!.data!.problems! : [],
    message: status === 422 ? 'Кейс не готов к расчёту Torque & Drag:' : (response?.data?.message || 'Не удалось выполнить расчёт по формулам.'),
  };
};

/** Runs the formula engine for a case once for all charts; re-runs when the overrides change. */
export function useFormula(caseId: string, overrides: FormulaOverrides, enabled: boolean) {
  const [state, setState] = useState<{ loading: boolean; data: FormulaResult | null; error: PredictionError | null }>(
    { loading: enabled, data: null, error: null });
  const query = Object.entries(overrides).filter(([, v]) => v !== undefined && Number.isFinite(v))
    .map(([k, v]) => `&${k}=${encodeURIComponent(String(v))}`).join('');

  const load = useCallback(async (signal?: AbortSignal) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const { data } = await instance.get<FormulaResult>(`/api/v1/torque-and-drag/formula?caseId=${encodeURIComponent(caseId)}${query}`, { signal });
      setState({ loading: false, data, error: null });
    } catch (error) {
      if (signal?.aborted) return;
      setState({ loading: false, data: null, error: toError(error) });
    }
  }, [caseId, query]);

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load, enabled]);

  return { ...state, reload: () => load() };
}
