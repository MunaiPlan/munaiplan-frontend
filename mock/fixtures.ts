/**
 * Synthetic data for the UI preview (`npm run dev:mock`). Everything here is invented:
 * no client names, wells or reports. Shapes follow the real API.
 */
const id = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;

export const ids = {
  company: id(1), company2: id(2), field: id(10), site: id(20), well: id(30), wellbore: id(40),
  design: id(50), trajectory: id(60), caseImported: id(70), caseManual: id(71), caseFull: id(72),
};

/** A J-shaped well: vertical to 800 m, build at 3°/30 m to 60°, then tangent to 2600 m MD. */
export const survey = (() => {
  const rows = [];
  let tvd = 0, vs = 0, inc = 0;
  for (let md = 0; md <= 2610; md += 30) {
    const prevInc = inc;
    inc = md <= 800 ? 0 : Math.min(60, ((md - 800) / 30) * 3);
    const mid = ((prevInc + inc) / 2) * (Math.PI / 180);
    if (md > 0) { tvd += 30 * Math.cos(mid); vs += 30 * Math.sin(mid); }
    rows.push({
      id: id(1000 + md), md, incl: +inc.toFixed(2), azim: 45, sub_sea: +(tvd + 19).toFixed(2), tvd: +tvd.toFixed(2),
      local_n_coord: +(vs * Math.SQRT1_2).toFixed(2), local_e_coord: +(vs * Math.SQRT1_2).toFixed(2),
      global_n_coord: 5178000 + vs * Math.SQRT1_2, global_e_coord: 9706000 + vs * Math.SQRT1_2,
      dogleg: md > 800 && inc < 60 ? 3 : 0, vertical_section: +vs.toFixed(2),
    });
  }
  return rows;
})();

export const tree = [
  { id: ids.company, kind: 'company', name: 'Демо Бурение', children: [
    { id: ids.field, kind: 'field', name: 'Северное', children: [
      { id: ids.site, kind: 'site', name: 'Куст 12', children: [
        { id: ids.well, kind: 'well', name: 'Скв. 12-1', children: [
          { id: ids.wellbore, kind: 'wellbore', name: 'Основной ствол', children: [
            { id: ids.design, kind: 'design', name: 'План #1', children: [
              { id: ids.trajectory, kind: 'trajectory', name: 'Проект 2600 м', children: [
                { id: ids.caseImported, kind: 'case', name: 'Секция 215,9 мм', children: [] },
                { id: ids.caseManual, kind: 'case', name: 'Секция 152,4 мм (черновик)', children: [] },
                { id: ids.caseFull, kind: 'case', name: 'Секция 215,9 мм — КНБК с ВЗД', children: [] },
              ] },
            ] },
          ] },
        ] },
        { id: id(31), kind: 'well', name: 'Скв. 12-2', children: [] },
      ] },
    ] },
    { id: id(11), kind: 'field', name: 'Южное', children: [] },
  ] },
  { id: ids.company2, kind: 'company', name: 'Тестовая компания', children: [] },
];

export const records: Record<string, Record<string, unknown>> = {
  [ids.company]: { id: ids.company, name: 'Демо Бурение', division: 'Бурение', group: 'Запад', representative: 'И. Иванов', address: 'г. Атырау', phone: '+7 700 000 00 00' },
  [ids.company2]: { id: ids.company2, name: 'Тестовая компания', division: '', group: '', representative: '', address: '', phone: '' },
  [ids.field]: { id: ids.field, name: 'Северное', description: 'Синтетическое месторождение для предпросмотра интерфейса.', reduction_level: 'MSL', active_field_unit: 'Метрическая' },
  [id(11)]: { id: id(11), name: 'Южное', description: '', reduction_level: '', active_field_unit: '' },
  [ids.site]: { id: ids.site, name: 'Куст 12', area: 4.5, block: 'B', azimuth: 45, country: 'Казахстан', state: 'Атырауская', region: 'Запад' },
  [ids.well]: { id: ids.well, name: 'Скв. 12-1', description: 'Наклонно-направленная', location: 'Куст 12', universal_well_identifier: 'KZ-000-12-1', type: 'Эксплуатационная', well_number: '12-1', working_group: 'ПБ-1', active_well_unit: 'Метрическая' },
  [id(31)]: { id: id(31), name: 'Скв. 12-2', description: '', location: '', universal_well_identifier: '', type: '', well_number: '12-2', working_group: '', active_well_unit: '' },
  [ids.wellbore]: { id: ids.wellbore, name: 'Основной ствол', bottom_hole_location: 'Куст 12', wellbore_depth: 2400, depth_interval: 30, average_hook_load: 0, riser_pressure: 0, average_inlet_flow: 0, average_column_rotation_frequency: 0, maximum_column_rotation_frequency: 0, average_weight_on_bit: 0, maximum_weight_on_bit: 0, average_torque: 0, maximum_torque: 0, down_static_friction: 0 },
  [ids.design]: { id: ids.design, plan_name: 'План #1', stage: 'Проект', version: '1', actual_date: '2026-09-30T00:00:00Z' },
  [ids.trajectory]: { id: ids.trajectory, name: 'Проект 2600 м', description: 'J-образный профиль, набор 3°/30 м', headers: [
    { id: id(90), customer: 'Демо Бурение', project: 'Северное', profile_type: 'J', field: 'Северное', your_ref: '', structure: 'Куст 12', job_number: '', wellhead: 'Скв. 12-1', kelly_bushing_elev: -19, profile: 'Проект' }], units: survey },
  [ids.caseImported]: { id: ids.caseImported, case_name: 'Секция 215,9 мм', case_description: 'Импортировано из отчёта', drill_depth: 2400, pipe_size: 127, is_complete: true },
  [ids.caseFull]: { id: ids.caseFull, case_name: 'Секция 215,9 мм — КНБК с ВЗД', case_description: 'Синтетический кейс: две обсадные колонны и полная КНБК', drill_depth: 2600, pipe_size: 127, is_complete: true },
  [ids.caseManual]: { id: ids.caseManual, case_name: 'Секция 152,4 мм (черновик)', case_description: 'Заполняется вручную', drill_depth: 0, pipe_size: 0, is_complete: false },
};

export const reference = {
  sources: [{ name: 'report_demo.docx', kind: 'report', bytes: 1_650_000 }],
  language: 'ru',
  case: { company: 'Демо Бурение', field: 'Северное', site: 'Куст 12', well: 'Скв. 12-1', wellbore: 'Основной ствол', design: 'План #1', case: 'Секция 215,9 мм', md: 2400, tvd: 1928 },
  survey, hole_sections: [{ type: 'Casing', depth: 1000, inner_diameter: 226.7, friction_factor: 0.25 }, { type: 'Open Hole', depth: 2400, inner_diameter: 215.9, friction_factor: 0.3 }],
  string: [
    { type: 'Drill Pipe', length: 2190, depth: 2190, body_od: 127, weight: 32.62, grade: 'X' },
    { type: 'Heavy Weight', length: 180, depth: 2370, body_od: 127, weight: 73.13, grade: '1340 MOD' },
    { type: 'Mud Motor', length: 30, depth: 2400, body_od: 171.45, weight: 103.53, grade: '4145H MOD' },
  ],
  fluid: { name: 'Полимер', density: 1230, plastic_viscosity: 20, yield_point: 22 },
  torque_drag: { bit_depth: 2400, load_summary: [] },
  hydraulics: { 'Подача насосов': '30.000 L/sec', 'Давление на стояке': '196.2835 atm', 'Потери давления на долоте': '36.4071 atm', 'Гидравлическая мощность на долоте': '148.41 hp' },
  warnings: ['sub-sea depth derived as TVD − datum elevation (-19.00 m)'],
};

const depth = survey.map((s) => s.md);
const curve = (base: number, slope: number, wobble = 0) => depth.map((d, i) => +(base + slope * d / 1000 + wobble * Math.sin(i / 6)).toFixed(3));

export const predictions: Record<string, Record<string, number[]>> = {
  'effective-tension': { 'Глубина': depth, 'Грузоподъёмность вышки': depth.map(() => 225), 'Бурение ротором': curve(60, -22), 'Спиральный изгиб(без вращения)': curve(-10, -15),
    'Подъём': curve(80, -30), 'Синусоидальный изгиб(все операции)': curve(-4, -6), 'Спуск': curve(55, -24), 'Бурение ГЗД': curve(50, -22), 'Спиральный изгиб(с вращением)': curve(-5, -8), 'Предел натяжения': curve(120, 3) },
  'weight-on-bit': { 'Глубина': depth, 'Грузоподъёмность вышки': depth.map(() => 225), 'Бурение ротором': curve(20, 20), 'Подъём': curve(22, 26), 'Спуск': curve(20, 18),
    'Бурение ГЗД': curve(19, 17), 'Мин. вес до спирального изгиба (спуск)': curve(23, 0, 0.4), 'Макс. вес до предела текучести (подъём)': curve(102, 0, 1) },
  'surface-torque': { 'Глубина': depth, 'Бурение ротором': curve(9, -2), 'Подъём': curve(0.1, 0), 'Make-up Torque': curve(16, 0.3), 'Спуск': curve(0.1, 0), 'Момент свинчивания': curve(16, 0.3) },
  'min-weight': { 'Глубина': depth, 'Мин. вес на долоте до спирального изгиба (бурение ротором)': curve(9.5, -0.1), 'Мин. вес на долоте до синусоидального изгиба (бурение ГЗД)': curve(4.7, -0.3),
    'Мин. вес на долоте до синусоидального изгиба (бурение ротором)': curve(8.6, 0), 'Мин. вес на долоте до спирального изгиба (бурение ГЗД)': curve(7.2, -0.7) },
};

const rel = (ref: number, v: number | null) => (v === null ? undefined : +((v - ref) / ref).toFixed(4));
const cmpRow = (operation: string, metric: string, wellplan: number, model: number | null, formula: number | null) =>
  ({ operation, metric, unit: metric === 'hook_load' ? 't' : 'kN-m', wellplan, model, relative_difference: rel(wellplan, model), formula, formula_relative_difference: rel(wellplan, formula) });

export const comparison = {
  case_id: ids.caseImported, bit_depth: 2400,
  rows: [
    cmpRow('tripping_in', 'hook_load', 67.3, 63.1, 72.4),
    cmpRow('tripping_out', 'hook_load', 79.85, 84.2, 82.1),
    cmpRow('rotating_on_bottom', 'hook_load', 67.81, 66.9, 70.2),
    cmpRow('rotating_on_bottom', 'surface_torque', 10.1, 7.6, 9.6),
    cmpRow('slide_drilling', 'hook_load', 63.13, 65.0, 68.9),
    cmpRow('rotating_off_bottom', 'hook_load', 73.81, null, 76.2),
    cmpRow('rotating_off_bottom', 'surface_torque', 4.68, null, 4.35),
  ],
  notes: ['Синтетические данные предпросмотра.'], source_warnings: [],
};

/** Synthetic formula result in the shape of GET /torque-and-drag/formula; overrides shift it plausibly. */
export const formulaResult = (q: URLSearchParams) => {
  const num = (k: string, d: number) => (q.get(k) !== null && q.get(k) !== '' ? Number(q.get(k)) : d);
  const block = num('block_weight', 17), wob = num('wob', 6), wobSlide = num('wob_slide', 3), tob = num('tob', 4.167);
  const ffC = num('ff_cased', 0.25), ffO = num('ff_open', 0.3);
  const f = ffO / 0.3;
  const sweep = depth.filter((d) => d > 0);
  const hl = (k: number) => sweep.map((d) => +(block + 0.028 * d * (1 + k * f * d / 2400)).toFixed(3));
  const along = (top: number) => depth.map((d) => +(top * (1 - d / 2400)).toFixed(3));
  const tq = (top: number) => depth.map((d) => +(top * (1 - d / 2400)).toFixed(3));
  const surf = (b: number, k: number) => +(block + b + k * f).toFixed(2);
  const sources = (key: string, d: string) => (q.get(key) !== null ? 'user' : d);
  return {
    case_id: ids.caseImported, engine: 'formula', bit_depth: 2400,
    families: {
      'weight-on-bit': { 'Глубина': sweep, 'Спуск': hl(-0.12), 'Подъём': hl(0.1), 'Бурение ротором': sweep.map((d) => +(block + 0.028 * d - wob * Math.min(1, d / 300)).toFixed(3)),
        'Бурение ГЗД': hl(-0.15).map((v, i) => +(v - wobSlide * Math.min(1, sweep[i] / 300)).toFixed(3)), 'Вращение над забоем': hl(0),
        'Мин. вес до спирального изгиба (спуск)': sweep.map((d) => (d < 600 ? null : +(block + 0.012 * d).toFixed(3))),
        'Макс. вес до предела текучести (подъём)': sweep.map(() => 218) },
      'surface-torque': { 'Глубина': depth, 'Бурение ротором': depth.map((d) => +(tob + 4.3 * f * (1 - d / 2400)).toFixed(3)), 'Вращение над забоем': tq(4.3 * f), 'Спуск': depth.map(() => 0), 'Подъём': depth.map(() => 0) },
      'min-weight': { 'Глубина': sweep, 'Мин. вес на долоте до синусоидального изгиба (бурение ротором)': sweep.map((d) => +(6 + 6 * Math.min(1, d / 1800)).toFixed(3)),
        'Мин. вес на долоте до спирального изгиба (бурение ротором)': sweep.map((d) => +(7 + 7.2 * Math.min(1, d / 1800)).toFixed(3)),
        'Мин. вес на долоте до синусоидального изгиба (бурение ГЗД)': sweep.map((d) => +(5.5 + 5 * Math.min(1, d / 1800)).toFixed(3)),
        'Мин. вес на долоте до спирального изгиба (бурение ГЗД)': sweep.map((d) => +(7.5 + 7 * Math.min(1, d / 1800)).toFixed(3)) },
      'effective-tension': { 'Глубина': depth, 'Спуск': along(55), 'Подъём': along(65), 'Бурение ротором': depth.map((d) => +(61 * (1 - d / 2400) - wob * d / 2400).toFixed(3)),
        'Бурение ГЗД': depth.map((d) => +(53 * (1 - d / 2400) - wobSlide * d / 2400).toFixed(3)), 'Вращение над забоем': along(61),
        'Истинное натяжение (подъём)': depth.map((d) => +(65 * (1 - d / 2400) - 0.012 * d).toFixed(3)),
        'Синусоидальный изгиб(все операции)': depth.map((d) => (d < 1000 ? -9 : -17)), 'Спиральный изгиб(с вращением)': depth.map((d) => (d < 1000 ? -19.6 : -24)),
        'Спиральный изгиб(без вращения)': depth.map((d) => (d < 1000 ? -19.6 : -31)), 'Предел натяжения': depth.map((d) => (d < 2190 ? 201 : 108)) },
      'side-force': { 'Глубина': depth, 'Спуск': depth.map((d) => +(d < 1000 ? 0.02 : 0.9).toFixed(3)), 'Подъём': depth.map((d) => +(d < 1000 ? 0.02 : 1.1).toFixed(3)),
        'Бурение ротором': depth.map((d) => +(d < 1000 ? 0.02 : 1.0).toFixed(3)), 'Бурение ГЗД': depth.map((d) => +(d < 1000 ? 0.02 : 0.95).toFixed(3)), 'Вращение над забоем': depth.map((d) => +(d < 1000 ? 0.02 : 1.0).toFixed(3)) },
    },
    summary: [
      { operation: 'tripping_in', hook_load: surf(55.4, -6), surface_torque: 0, max_side_force: 1.3, buckling: '' },
      { operation: 'tripping_out', hook_load: surf(65.1, 4), surface_torque: 0, max_side_force: 1.28, buckling: '' },
      { operation: 'rotating_on_bottom', hook_load: +(block + 61 - wob).toFixed(2), surface_torque: +(tob + 4.3 * f).toFixed(2), neutral_point_from_bit: +(wob * 62).toFixed(0), max_side_force: 1.48, buckling: '' },
      { operation: 'slide_drilling', hook_load: surf(53 - wobSlide, -4), surface_torque: 0, neutral_point_from_bit: +(wobSlide * 120).toFixed(0), max_side_force: 1.39, buckling: wobSlide > 8 ? 'sinusoidal' : '' },
      { operation: 'rotating_off_bottom', hook_load: +(block + 61).toFixed(2), surface_torque: +(4.3 * f).toFixed(2), max_side_force: 1.29, buckling: '' },
    ],
    limits: { overpull_margin: 136.2, min_wob_sinusoidal: 13.4, min_wob_sinusoidal_depth: 1800, min_wob_helical: 14.8, min_wob_helical_depth: 1800 },
    parameters: { mud_density: 1230, buoyancy_factor: 0.8433, block_weight: block, wob_rotating: wob, wob_sliding: wobSlide, tob, overpull_back_reaming: 0,
      trip_speed: 10, step: 10, yield_fraction: 0.8, steel_density: 7850, young_modulus: 206.84,
      friction_cased: q.get('ff_cased') !== null ? ffC : undefined, friction_open: q.get('ff_open') !== null ? ffO : undefined,
      hole_sections: [{ top: 0, bottom: 1000, diameter: 226.7, cased: true, friction: ffC }, { top: 1000, bottom: 2400, diameter: 215.9, cased: false, friction: ffO }],
      sources: { block_weight: sources('block_weight', 'report'), wob_rotating: sources('wob', 'report'), wob_sliding: sources('wob_slide', 'report'), tob: sources('tob', 'report'), trip_speed: 'report', step: 'default' } },
    assumptions: [
      'Модель мягкой нити (soft-string): изгибная жёсткость колонны не учитывается; сила прижатия к стенке — от веса и от натяжения на искривлении (Johancsik и др., 1984).',
      'Траектория между точками инклинометрии интерполируется методом минимальной кривизны.',
      'Плавучесть: коэффициент 1 − ρ раствора / 7850 кг/м³; раствор одинаков в колонне и в затрубье, циркуляция не учитывается.',
      'Синтетические данные предпросмотра.',
    ],
    warnings: ['Синтетический кейс: значения иллюстративные.'],
    units: { force: 'т', torque: 'кН·м', depth: 'м', side_force: 'кН/м' },
  };
};

export const organizations = [
  { id: id(500), name: 'MunaiPlan Administration', email: 'admin@example.test', phone: '', address: '', created_at: '2026-09-30T00:00:00Z', user_count: 1 },
  { id: id(501), name: 'Демо Бурение', email: 'ops@example.test', phone: '+7 700 000 00 00', address: 'г. Атырау', created_at: '2026-09-30T00:00:00Z', user_count: 3 },
];

/** Case inputs per case, in the shapes of /strings, /holes and /fluids. */
const importedChildren: Record<string, unknown[]> = {
  strings: [{ id: id(800), name: 'Рабочая колонна (импорт)', depth: 2400, sections: [
    { id: id(801), type: 'Drill Pipe', body_md: 2190, body_length: 2190, body_od: 127, body_id: 108.61, avg_joint_length: 9.14, stabilizer_length: 0.433, stabilizer_od: 152.4, stabilizer_id: 82.55, weight: 32.62, grade: 'X', min_yield_strength: 105000 },
    { id: id(802), type: 'Heavy Weight', body_md: 2370, body_length: 180, body_od: 127, body_id: 76.2, avg_joint_length: 9.14, stabilizer_length: 1.219, stabilizer_od: 165.1, stabilizer_id: 76.2, weight: 73.13, grade: '1340 MOD', min_yield_strength: 55000 },
    { id: id(803), type: 'Mud Motor', body_md: 2400, body_length: 30, body_od: 171.45, body_id: 76.2, avg_joint_length: 9.71, weight: 103.53, grade: '4145H MOD', min_yield_strength: 110000 },
  ] }],
  holes: [{ id: id(810), caisings: [{ id: id(811), md_top: 0, md_base: 1000, length: 1000, shoe_md: 1000, od: 0, inner_diameter: 226.7, vd: 996, drift_id: 222.63, effective_hole_diameter: 0, friction_factor_caising: 0.25, linear_capacity_caising: 40.36, description_caising: 'Casing' }],
    open_hole_md_top: 1000, open_hole_md_base: 2400, open_hole_length: 1400, open_hole_vd: 1928, effective_diameter: 215.9, friction_factor_open_hole: 0.3, linear_capacity_open_hole: 36.61, volume_excess: 0 }],
  fluids: [{ id: id(820), name: 'Полимер', description: 'Mud Bingham Plastic; PV 20 cP; YP 22 lbf/100ft²', density: 1230, fluid_base_type: { id: id(821), name: 'Water' }, base_fluid: { id: id(821), name: 'Water' } }],
};

/**
 * A full synthetic 215,9 mm section: 339,7 mm casing to 500 m, 244,5 mm to 1800 m, open hole to 2600 m,
 * and a motor BHA (PDC bit, motor, near-bit stabilizer, MWD, NM collar, stabilizer, collars, jar, HWDP, drill pipe).
 */
const bha = [
  // type, length, OD, ID, avg joint, TJ/blade length, TJ/blade OD, TJ ID, weight, grade, yield
  ['Heavy Weight', 137.16, 127, 76.2, 9.14, 1.22, 165.1, 76.2, 73.13, '1340 MOD', 55000],
  ['Jar', 9.75, 165.1, 69.85, null, null, null, null, 136.6, '4145H MOD', 110000],
  ['Heavy Weight', 45.72, 127, 76.2, 9.14, 1.22, 165.1, 76.2, 73.13, '1340 MOD', 55000],
  ['Cross Over', 0.91, 165.1, 71.44, null, null, null, null, 120.5, '4145H MOD', 110000],
  ['Drill Collar', 54.84, 165.1, 71.44, 9.14, null, null, null, 136.0, '4145H MOD', 110000],
  ['Stabilizer', 1.8, 165.1, 71.44, null, 0.6, 212.7, null, 140.2, '4145H MOD', 110000],
  ['Non-Mag Drill Collar', 9.4, 171.45, 71.44, null, null, null, null, 149.5, 'NMDC', 110000],
  ['MWD', 10.4, 172, 71.44, null, null, null, null, 149.77, 'NMDC', 110000],
  ['Near Bit Stabilizer', 1.6, 171.45, 71.44, null, 0.5, 212.7, null, 150.0, '4145H MOD', 110000],
  ['Mud Motor', 9.71, 171.45, null, null, null, null, null, 103.53, '4145H MOD', 110000],
  ['Polycrystalline Diamond Bit', 0.3, 215.9, null, null, null, null, null, 100, null, null],
] as const;
const bhaLength = bha.reduce((s, r) => s + r[1], 0);
const fullSections = [['Drill Pipe', +(2600 - bhaLength).toFixed(2), 127, 108.61, 9.14, 0.43, 168.28, 82.55, 32.62, 'G-105', 105000] as const, ...bha]
  .reduce<{ md: number; rows: Record<string, unknown>[] }>((acc, r, i) => {
    const md = +(acc.md + r[1]).toFixed(2);
    acc.rows.push({ id: id(900 + i), type: r[0], body_md: md, body_length: r[1], body_od: r[2], body_id: r[3], avg_joint_length: r[4],
      stabilizer_length: r[5], stabilizer_od: r[6], stabilizer_id: r[7], weight: r[8], grade: r[9], min_yield_strength: r[10] });
    return { md, rows: acc.rows };
  }, { md: 0, rows: [] }).rows;

const fullChildren: Record<string, unknown[]> = {
  strings: [{ id: id(890), name: 'КНБК с ВЗД и бурильные трубы 127 мм', depth: 2600, sections: fullSections }],
  holes: [{ id: id(950), caisings: [
    { id: id(951), md_top: 0, md_base: 500, length: 500, shoe_md: 500, od: 339.7, inner_diameter: 315.32, vd: 500, drift_id: 311.35, effective_hole_diameter: 444.5, friction_factor_caising: 0.25, linear_capacity_caising: 78.09, description_caising: 'Casing' },
    { id: id(952), md_top: 0, md_base: 1800, length: 1800, shoe_md: 1800, od: 244.5, inner_diameter: 220.5, vd: 1650, drift_id: 216.5, effective_hole_diameter: 311.1, friction_factor_caising: 0.25, linear_capacity_caising: 38.19, description_caising: 'Casing' },
  ], open_hole_md_top: 1800, open_hole_md_base: 2600, open_hole_length: 800, open_hole_vd: 2050, effective_diameter: 215.9, friction_factor_open_hole: 0.3, linear_capacity_open_hole: 36.61, volume_excess: 10 }],
  fluids: importedChildren.fluids,
};

export const caseChildren: Record<string, Record<string, unknown[]>> = { [ids.caseImported]: importedChildren, [ids.caseFull]: fullChildren };
