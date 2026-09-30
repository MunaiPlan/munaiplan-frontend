/**
 * Survey station columns in WellPlan order, with display labels and units. `signed` columns can be
 * negative, so their inputs open a keyboard with a minus sign (the phone decimal pad has none).
 */
export const surveyColumns = [
  { key: 'md', label: 'MD', unit: 'м', required: true },
  { key: 'incl', label: 'Зенит', unit: '°', required: true },
  { key: 'azim', label: 'Азимут', unit: '°', required: true },
  { key: 'sub_sea', label: 'Абс. отметка', unit: 'м', signed: true },
  { key: 'tvd', label: 'TVD', unit: 'м', required: true },
  { key: 'local_n_coord', label: 'N', unit: 'м', signed: true },
  { key: 'local_e_coord', label: 'E', unit: 'м', signed: true },
  { key: 'global_n_coord', label: 'Global N', unit: 'м' },
  { key: 'global_e_coord', label: 'Global E', unit: 'м' },
  { key: 'dogleg', label: 'DLS', unit: '°/30м' },
  { key: 'vertical_section', label: 'VS', unit: 'м', signed: true },
] as const;

export type ColumnKey = (typeof surveyColumns)[number]['key'];

/** A stored survey station. */
export type SurveyUnit = { id: string } & { [K in ColumnKey]: number };
