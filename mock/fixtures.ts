/**
 * Synthetic data for the UI preview (`npm run dev:mock`). Everything here is invented:
 * no client names, wells or reports. Shapes follow the real API.
 */
const id = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;

export const ids = {
  company: id(1), company2: id(2), field: id(10), site: id(20), well: id(30), wellbore: id(40),
  design: id(50), trajectory: id(60), caseImported: id(70), caseManual: id(71),
};

/** A J-shaped well: vertical to 800 m, build at 3°/30 m to 60°, then tangent to 2400 m MD. */
export const survey = (() => {
  const rows = [];
  let tvd = 0, vs = 0, inc = 0;
  for (let md = 0; md <= 2400; md += 30) {
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
              { id: ids.trajectory, kind: 'trajectory', name: 'Проект 2400 м', children: [
                { id: ids.caseImported, kind: 'case', name: 'Секция 215,9 мм', children: [] },
                { id: ids.caseManual, kind: 'case', name: 'Секция 152,4 мм (черновик)', children: [] },
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
  [ids.trajectory]: { id: ids.trajectory, name: 'Проект 2400 м', description: 'J-образный профиль, набор 3°/30 м', headers: [
    { id: id(90), customer: 'Демо Бурение', project: 'Северное', profile_type: 'J', field: 'Северное', your_ref: '', structure: 'Куст 12', job_number: '', wellhead: 'Скв. 12-1', kelly_bushing_elev: -19, profile: 'Проект' }], units: survey },
  [ids.caseImported]: { id: ids.caseImported, case_name: 'Секция 215,9 мм', case_description: 'Импортировано из отчёта', drill_depth: 2400, pipe_size: 127, is_complete: true },
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

export const comparison = {
  case_id: ids.caseImported, bit_depth: 2400,
  rows: [
    { operation: 'tripping_in', metric: 'hook_load', unit: 't', wellplan: 67.3, model: 63.1, difference: -4.2, relative_difference: -0.062 },
    { operation: 'tripping_out', metric: 'hook_load', unit: 't', wellplan: 79.85, model: 84.2, difference: 4.35, relative_difference: 0.054 },
    { operation: 'rotating_on_bottom', metric: 'hook_load', unit: 't', wellplan: 67.81, model: 66.9, difference: -0.91, relative_difference: -0.013 },
    { operation: 'rotating_on_bottom', metric: 'surface_torque', unit: 'kN-m', wellplan: 10.1, model: 7.6, difference: -2.5, relative_difference: -0.247 },
    { operation: 'slide_drilling', metric: 'hook_load', unit: 't', wellplan: 63.13, model: 65.0, difference: 1.87, relative_difference: 0.03 },
  ],
  notes: ['Synthetic preview data.'], source_warnings: [],
};

export const organizations = [
  { id: id(500), name: 'MunaiPlan Administration', email: 'admin@example.test', phone: '', address: '', created_at: '2026-09-30T00:00:00Z', user_count: 1 },
  { id: id(501), name: 'Демо Бурение', email: 'ops@example.test', phone: '+7 700 000 00 00', address: 'г. Атырау', created_at: '2026-09-30T00:00:00Z', user_count: 3 },
];

/** Case inputs of the imported demo case, in the shapes of /strings, /holes and /fluids. */
export const caseChildren: Record<string, unknown[]> = {
  strings: [{ id: id(800), name: 'Рабочая колонна (импорт)', depth: 2400, sections: [
    { id: id(801), type: 'Drill Pipe', body_md: 2190, body_length: 2190, body_od: 127, body_id: 108.61, avg_joint_length: 9.14, stabilizer_length: 0.433, stabilizer_od: 152.4, stabilizer_id: 82.55, weight: 32.62, grade: 'X', min_yield_strength: 105000 },
    { id: id(802), type: 'Heavy Weight', body_md: 2370, body_length: 180, body_od: 127, body_id: 76.2, avg_joint_length: 9.14, stabilizer_length: 1.219, stabilizer_od: 165.1, stabilizer_id: 76.2, weight: 73.13, grade: '1340 MOD', min_yield_strength: 55000 },
    { id: id(803), type: 'Mud Motor', body_md: 2400, body_length: 30, body_od: 171.45, body_id: 76.2, avg_joint_length: 9.71, weight: 103.53, grade: '4145H MOD', min_yield_strength: 110000 },
  ] }],
  holes: [{ id: id(810), caisings: [{ id: id(811), md_top: 0, md_base: 1000, length: 1000, shoe_md: 1000, od: 0, inner_diameter: 226.7, vd: 996, drift_id: 222.63, effective_hole_diameter: 0, friction_factor_caising: 0.25, linear_capacity_caising: 40.36, description_caising: 'Casing' }],
    open_hole_md_top: 1000, open_hole_md_base: 2400, open_hole_length: 1400, open_hole_vd: 1928, effective_diameter: 215.9, friction_factor_open_hole: 0.3, linear_capacity_open_hole: 36.61, volume_excess: 0 }],
  fluids: [{ id: id(820), name: 'Полимер', description: 'Mud Bingham Plastic; PV 20 cP; YP 22 lbf/100ft²', density: 1230, fluid_base_type: { id: id(821), name: 'Water' }, base_fluid: { id: id(821), name: 'Water' } }],
};
