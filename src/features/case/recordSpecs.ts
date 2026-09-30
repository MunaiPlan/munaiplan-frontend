import type { RecordSpec } from './RecordForm';

/** Field specs for the simple case inputs. Bodies match the API request structs. */
export const recordSpecs = {
  fluid: {
    resource: 'fluids', title: 'Раствор', idInBody: true, fields: [
      { name: 'name', label: 'Название', type: 'text', required: true },
      { name: 'density', label: 'Плотность', unit: 'кг/м³', type: 'number', required: true },
      { name: 'fluid_base_type_id', label: 'Тип основы', type: 'select', optionsFrom: '/api/v1/fluids/types', required: true },
      { name: 'base_fluid_id', label: 'Базовая жидкость', type: 'select', optionsFrom: '/api/v1/fluids/types', required: true },
      { name: 'description', label: 'Описание', type: 'text' },
    ],
  },
  porePressure: {
    resource: 'pore-pressures', title: 'Поровое давление', fields: [
      { name: 'tvd', label: 'TVD', unit: 'м', type: 'number', required: true },
      { name: 'pressure', label: 'Давление', type: 'number', required: true },
      { name: 'emw', label: 'ЭПБР (EMW)', type: 'number', required: true },
    ],
  },
  geothermal: {
    resource: 'fracture-gradients', title: 'Геотермический профиль', fields: [
      { name: 'temperature_at_surface', label: 'Температура на поверхности', unit: '°C', type: 'number', required: true },
      { name: 'temperature_at_well_tvd', label: 'Температура на глубине', unit: '°C', type: 'number', required: true },
      { name: 'well_tvd', label: 'Глубина (TVD)', unit: 'м', type: 'number', required: true },
      { name: 'temperature_gradient', label: 'Градиент', unit: '°C/100 м', type: 'number', required: true },
    ],
  },
  rig: {
    resource: 'rigs', title: 'Буровая', fields: [
      { name: 'block_rating', label: 'Грузоподъёмность', type: 'number' },
      { name: 'torque_rating', label: 'Номинальный момент', type: 'number' },
      { name: 'rated_working_pressure', label: 'Рабочее давление', type: 'number', required: true },
      { name: 'bop_pressure_rating', label: 'Давление ПВО', type: 'number', required: true },
      { name: 'surface_pressure_loss', label: 'Потери в наземной обвязке', type: 'number', required: true },
      { name: 'standpipe_length', label: 'Длина стояка', type: 'number' },
      { name: 'standpipe_internal_diameter', label: 'ВД стояка', type: 'number' },
      { name: 'hose_length', label: 'Длина шланга', type: 'number' },
      { name: 'hose_internal_diameter', label: 'ВД шланга', type: 'number' },
      { name: 'swivel_length', label: 'Длина вертлюга', type: 'number' },
      { name: 'swivel_internal_diameter', label: 'ВД вертлюга', type: 'number' },
      { name: 'kelly_length', label: 'Длина ведущей трубы', type: 'number' },
      { name: 'kelly_internal_diameter', label: 'ВД ведущей трубы', type: 'number' },
      { name: 'pump_discharge_line_length', label: 'Длина нагнетательной линии', type: 'number' },
      { name: 'pump_discharge_line_internal_diameter', label: 'ВД нагнетательной линии', type: 'number' },
      { name: 'top_drive_stackup_length', label: 'Длина обвязки СВП', type: 'number' },
      { name: 'top_drive_stackup_internal_diameter', label: 'ВД обвязки СВП', type: 'number' },
    ],
  },
} satisfies Record<string, RecordSpec>;
