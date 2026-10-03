import type { PredictionEndpoint } from '../../hooks/usePrediction';

/** How a series is drawn. Monochrome: operations are solid/dashed ink, limits are thin grey. */
export type SeriesStyle = 'primary' | 'dashed' | 'dotted' | 'dashdot' | 'longdash' | 'secondary' | 'limit' | 'limit-dashed';

/** Which calculation produced a curve. */
export type Engine = 'formula' | 'model';

export interface SeriesSpec {
  key: string;
  label: string;
  style: SeriesStyle;
}

export type FamilyKey = PredictionEndpoint | 'side-force';

export interface FamilySpec {
  key: FamilyKey;
  title: string;
  xLabel: string;
  unit: string;
  /** What the vertical axis is: depth along the string with the bit at the analysed depth, or the bit depth. */
  depthLabel: string;
  series: SeriesSpec[];
  engines: Engine[];
  note?: string;
}

// Series keys are the model's response keys (legacy Russian labels); the formula engine returns
// the same keys plus «Вращение над забоем» and a few curves only it can compute. A series a
// source does not return is simply not drawn.
export const families: FamilySpec[] = [
  {
    key: 'weight-on-bit', title: 'Вес на крюке', xLabel: 'Вес на крюке', unit: 'т', depthLabel: 'Глубина долота, м', engines: ['formula', 'model'],
    series: [
      { key: 'Спуск', label: 'Спуск', style: 'primary' },
      { key: 'Подъём', label: 'Подъём', style: 'dashed' },
      { key: 'Бурение ротором', label: 'Бурение ротором', style: 'dotted' },
      { key: 'Бурение ГЗД', label: 'Бурение ГЗД', style: 'dashdot' },
      { key: 'Вращение над забоем', label: 'Вращение над забоем', style: 'longdash' },
      { key: 'Мин. вес до спирального изгиба (спуск)', label: 'Мин. вес до спирального изгиба (спуск)', style: 'limit-dashed' },
      { key: 'Макс. вес до предела текучести (подъём)', label: 'Макс. вес до предела текучести (подъём)', style: 'limit' },
      { key: 'Грузоподъёмность вышки', label: 'Грузоподъёмность вышки', style: 'limit' },
    ],
  },
  {
    key: 'surface-torque', title: 'Момент', xLabel: 'Момент', unit: 'кН·м', depthLabel: 'MD, м', engines: ['formula', 'model'],
    series: [
      { key: 'Бурение ротором', label: 'Бурение ротором', style: 'primary' },
      { key: 'Вращение над забоем', label: 'Вращение над забоем', style: 'longdash' },
      { key: 'Спуск', label: 'Спуск', style: 'dashed' },
      { key: 'Подъём', label: 'Подъём', style: 'dotted' },
      { key: 'Момент свинчивания', label: 'Момент свинчивания', style: 'limit' },
    ],
    note: 'Момент свинчивания показывает только модель: в данных кейса нет момента свинчивания замков.',
  },
  {
    key: 'min-weight', title: 'Мин. вес на долоте', xLabel: 'Мин. вес на долоте', unit: 'т', depthLabel: 'Глубина долота, м', engines: ['formula', 'model'],
    series: [
      { key: 'Мин. вес на долоте до синусоидального изгиба (бурение ротором)', label: 'Синусоидальный изгиб, ротор', style: 'primary' },
      { key: 'Мин. вес на долоте до спирального изгиба (бурение ротором)', label: 'Спиральный изгиб, ротор', style: 'dashed' },
      { key: 'Мин. вес на долоте до синусоидального изгиба (бурение ГЗД)', label: 'Синусоидальный изгиб, ГЗД', style: 'dotted' },
      { key: 'Мин. вес на долоте до спирального изгиба (бурение ГЗД)', label: 'Спиральный изгиб, ГЗД', style: 'dashdot' },
    ],
  },
  {
    key: 'effective-tension', title: 'Эффективное натяжение', xLabel: 'Эффективное натяжение', unit: 'т', depthLabel: 'MD, м', engines: ['formula', 'model'],
    series: [
      { key: 'Спуск', label: 'Спуск', style: 'primary' },
      { key: 'Подъём', label: 'Подъём', style: 'dashed' },
      { key: 'Бурение ротором', label: 'Бурение ротором', style: 'dotted' },
      { key: 'Бурение ГЗД', label: 'Бурение ГЗД', style: 'dashdot' },
      { key: 'Вращение над забоем', label: 'Вращение над забоем', style: 'longdash' },
      { key: 'Истинное натяжение (подъём)', label: 'Истинное натяжение (подъём)', style: 'secondary' },
      { key: 'Синусоидальный изгиб(все операции)', label: 'Синусоидальный изгиб', style: 'limit-dashed' },
      { key: 'Спиральный изгиб(с вращением)', label: 'Спиральный изгиб (с вращением)', style: 'limit-dashed' },
      { key: 'Спиральный изгиб(без вращения)', label: 'Спиральный изгиб (без вращения)', style: 'limit' },
      { key: 'Предел натяжения', label: 'Предел натяжения', style: 'limit' },
    ],
    note: 'Изгиб наступает, где кривая операции уходит левее линии изгиба (сжатие больше критического).',
  },
  {
    key: 'side-force', title: 'Боковая сила', xLabel: 'Боковая сила', unit: 'кН/м', depthLabel: 'MD, м', engines: ['formula'],
    series: [
      { key: 'Спуск', label: 'Спуск', style: 'primary' },
      { key: 'Подъём', label: 'Подъём', style: 'dashed' },
      { key: 'Бурение ротором', label: 'Бурение ротором', style: 'dotted' },
      { key: 'Бурение ГЗД', label: 'Бурение ГЗД', style: 'dashdot' },
      { key: 'Вращение над забоем', label: 'Вращение над забоем', style: 'longdash' },
    ],
    note: 'Сила прижатия колонны к стенке на метр длины; от неё зависят трение, износ обсадной колонны и замков.',
  },
];

export const strokes: Record<SeriesStyle, { stroke: string; width: number; dash?: string }> = {
  primary: { stroke: '#0A0A0A', width: 2 },
  dashed: { stroke: '#0A0A0A', width: 2, dash: '8 4' },
  dotted: { stroke: '#0A0A0A', width: 2, dash: '2 3' },
  dashdot: { stroke: '#0A0A0A', width: 1.5, dash: '10 3 2 3' },
  longdash: { stroke: '#0A0A0A', width: 1.5, dash: '16 4' },
  secondary: { stroke: '#52525B', width: 1.25 },
  limit: { stroke: '#A1A1AA', width: 1.25 },
  'limit-dashed': { stroke: '#A1A1AA', width: 1.25, dash: '4 4' },
};

/** In the overlay the model's curves are grey and thinner, so the engines stay apart in black and white. */
export const modelStroke = (style: SeriesStyle) => {
  const s = strokes[style];
  return style.startsWith('limit') ? s : { ...s, stroke: '#71717A', width: Math.max(1, s.width - 0.5) };
};

export const engineLabels: Record<Engine, string> = { formula: 'Расчёт по формулам', model: 'Прогноз модели' };
