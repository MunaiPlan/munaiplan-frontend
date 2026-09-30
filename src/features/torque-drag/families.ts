import type { PredictionEndpoint } from '../../hooks/usePrediction';

/** How a series is drawn. Monochrome: operations are solid/dashed ink, limits are thin grey. */
export type SeriesStyle = 'primary' | 'dashed' | 'dotted' | 'dashdot' | 'limit' | 'limit-dashed';

export interface SeriesSpec {
  key: string;
  label: string;
  style: SeriesStyle;
}

export interface FamilySpec {
  endpoint: PredictionEndpoint;
  title: string;
  xLabel: string;
  unit: string;
  series: SeriesSpec[];
  note?: string;
}

// Series keys are the model's response keys (legacy Russian labels). Force outputs agree with
// WellPlan tonnes on median (docs/recovery/model-validation.md); torque is labelled kN·m likewise.
export const families: FamilySpec[] = [
  {
    endpoint: 'weight-on-bit', title: 'Вес на крюке', xLabel: 'Вес на крюке', unit: 'т',
    series: [
      { key: 'Спуск', label: 'Спуск', style: 'primary' },
      { key: 'Подъём', label: 'Подъём', style: 'dashed' },
      { key: 'Бурение ротором', label: 'Бурение ротором', style: 'dotted' },
      { key: 'Бурение ГЗД', label: 'Бурение ГЗД', style: 'dashdot' },
      { key: 'Мин. вес до спирального изгиба (спуск)', label: 'Мин. вес до спирального изгиба (спуск)', style: 'limit-dashed' },
      { key: 'Макс. вес до предела текучести (подъём)', label: 'Макс. вес до предела текучести (подъём)', style: 'limit' },
      { key: 'Грузоподъёмность вышки', label: 'Грузоподъёмность вышки', style: 'limit' },
    ],
  },
  {
    endpoint: 'surface-torque', title: 'Момент', xLabel: 'Момент', unit: 'кН·м',
    series: [
      { key: 'Бурение ротором', label: 'Бурение ротором', style: 'primary' },
      { key: 'Спуск', label: 'Спуск', style: 'dashed' },
      { key: 'Подъём', label: 'Подъём', style: 'dotted' },
      { key: 'Момент свинчивания', label: 'Момент свинчивания', style: 'limit' },
    ],
    note: '«Make-up Torque» совпадает с «Момент свинчивания» и не показывается отдельно.',
  },
  {
    endpoint: 'min-weight', title: 'Мин. вес на долоте', xLabel: 'Мин. вес на долоте', unit: 'т',
    series: [
      { key: 'Мин. вес на долоте до синусоидального изгиба (бурение ротором)', label: 'Синусоидальный изгиб, ротор', style: 'primary' },
      { key: 'Мин. вес на долоте до спирального изгиба (бурение ротором)', label: 'Спиральный изгиб, ротор', style: 'dashed' },
      { key: 'Мин. вес на долоте до синусоидального изгиба (бурение ГЗД)', label: 'Синусоидальный изгиб, ГЗД', style: 'dotted' },
      { key: 'Мин. вес на долоте до спирального изгиба (бурение ГЗД)', label: 'Спиральный изгиб, ГЗД', style: 'dashdot' },
    ],
  },
  {
    endpoint: 'effective-tension', title: 'Эффективное натяжение', xLabel: 'Эффективное натяжение', unit: 'т',
    series: [
      { key: 'Спуск', label: 'Спуск', style: 'primary' },
      { key: 'Подъём', label: 'Подъём', style: 'dashed' },
      { key: 'Бурение ротором', label: 'Бурение ротором', style: 'dotted' },
      { key: 'Бурение ГЗД', label: 'Бурение ГЗД', style: 'dashdot' },
      { key: 'Синусоидальный изгиб(все операции)', label: 'Синусоидальный изгиб', style: 'limit-dashed' },
      { key: 'Спиральный изгиб(с вращением)', label: 'Спиральный изгиб (с вращением)', style: 'limit-dashed' },
      { key: 'Спиральный изгиб(без вращения)', label: 'Спиральный изгиб (без вращения)', style: 'limit' },
      { key: 'Предел натяжения', label: 'Предел натяжения', style: 'limit' },
    ],
  },
];

export const strokes: Record<SeriesStyle, { stroke: string; width: number; dash?: string }> = {
  primary: { stroke: '#0A0A0A', width: 2 },
  dashed: { stroke: '#0A0A0A', width: 2, dash: '8 4' },
  dotted: { stroke: '#0A0A0A', width: 2, dash: '2 3' },
  dashdot: { stroke: '#0A0A0A', width: 1.5, dash: '10 3 2 3' },
  limit: { stroke: '#A1A1AA', width: 1.25 },
  'limit-dashed': { stroke: '#A1A1AA', width: 1.25, dash: '4 4' },
};
