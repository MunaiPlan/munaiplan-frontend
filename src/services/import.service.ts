import { instance } from '../api/axios.api';

export interface LoadCondition {
  operation: string;
  label: string;
  failures?: string[];
  surface_torque: number | null;
  hook_load: number | null;
  neutral_point_from_bit?: number;
}

export interface WellPlanReport {
  sources: { name: string; kind: 'report' | 'survey'; bytes: number }[];
  language?: string;
  case: {
    company: string; field: string; site: string; well: string; wellbore: string; design: string; case: string;
    md?: number; tvd?: number;
  };
  survey: { md: number; inc: number; azi: number; tvd: number }[];
  hole_sections: { type: string; depth: number; inner_diameter: number; friction_factor?: number }[];
  string: { type: string; length: number; depth: number; body_od: number; weight?: number; grade?: string }[];
  fluid?: { name: string; density?: number; plastic_viscosity?: number; yield_point?: number };
  torque_drag?: { bit_depth?: number; load_summary: LoadCondition[] };
  hydraulics?: Record<string, string>;
  warnings: string[];
}

export interface ImportPreview {
  report: WellPlanReport;
  fingerprint: string;
  duplicate?: { case_id: string; created_at: string };
  units: Record<string, string>;
}

export interface ImportResult {
  case_id: string;
  trajectory_id: string;
  company_id: string;
  created: Record<string, boolean>;
}

export interface WellPlanFiles {
  report?: File | null;
  survey?: File | null;
}

const toForm = ({ report, survey }: WellPlanFiles): FormData => {
  const form = new FormData();
  if (report) form.append('report', report);
  if (survey) form.append('survey', survey);
  return form;
};

export const importService = {
  async preview(files: WellPlanFiles): Promise<ImportPreview> {
    const { data } = await instance.post<ImportPreview>('/api/v1/imports/wellplan/preview', toForm(files));
    return data;
  },
  async commit(files: WellPlanFiles): Promise<ImportResult> {
    const { data } = await instance.post<ImportResult>('/api/v1/imports/wellplan', toForm(files));
    return data;
  },
  async reference(caseId: string): Promise<WellPlanReport | null> {
    try {
      const { data } = await instance.get<WellPlanReport>(`/api/v1/imports/cases/${caseId}/reference`);
      return data;
    } catch (error) {
      if ((error as { response?: { status?: number } })?.response?.status === 404) return null;
      throw error;
    }
  },
};

export const operationLabels: Record<string, string> = {
  tripping_in: 'Спуск',
  tripping_out: 'Подъём',
  rotating_on_bottom: 'Вращение на забое',
  slide_drilling: 'Бурение ГЗД (слайд)',
  rotating_off_bottom: 'Вращение над забоем',
  back_reaming: 'Обратная проработка',
};
