/**
 * The well hierarchy in one place: labels, routes, API paths, editable fields and how a child
 * is created. The explorer, breadcrumbs, detail pages and forms all read from this.
 */
export type Kind = 'company' | 'field' | 'site' | 'well' | 'wellbore' | 'design' | 'trajectory' | 'case';

export interface FieldSpec {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'textarea';
  unit?: string;
  required?: boolean;
  /** Shown in the detail panel but not in the form. */
  readOnly?: boolean;
}

export interface KindSpec {
  label: string;
  plural: string;
  /** Frontend route of a record. */
  route: (id: string) => string;
  /** API collection, e.g. "fields" for /api/v1/fields. */
  api: string;
  /** Query parameter naming the parent on create (none for companies). */
  parentParam?: string;
  child?: Kind;
  /** Property holding the display name. */
  titleField: string;
  fields: FieldSpec[];
}

export const kinds: Record<Kind, KindSpec> = {
  company: {
    label: 'Компания', plural: 'Компании', route: (id) => `/${id}`, api: 'companies', child: 'field', titleField: 'name',
    fields: [
      { name: 'name', label: 'Название', required: true },
      { name: 'division', label: 'Дивизион' },
      { name: 'group', label: 'Группа' },
      { name: 'representative', label: 'Представитель' },
      { name: 'address', label: 'Адрес' },
      { name: 'phone', label: 'Телефон' },
    ],
  },
  field: {
    label: 'Месторождение', plural: 'Месторождения', route: (id) => `/fields/${id}`, api: 'fields', parentParam: 'companyId', child: 'site', titleField: 'name',
    fields: [
      { name: 'name', label: 'Название', required: true },
      { name: 'description', label: 'Описание', type: 'textarea' },
      { name: 'reduction_level', label: 'Уровень приведения' },
      { name: 'active_field_unit', label: 'Активная единица' },
    ],
  },
  site: {
    label: 'Куст', plural: 'Кусты', route: (id) => `/sites/${id}`, api: 'sites', parentParam: 'fieldId', child: 'well', titleField: 'name',
    fields: [
      { name: 'name', label: 'Название', required: true },
      { name: 'area', label: 'Площадь', type: 'number' },
      { name: 'block', label: 'Блок' },
      { name: 'azimuth', label: 'Азимут', type: 'number', unit: '°' },
      { name: 'country', label: 'Страна' },
      { name: 'state', label: 'Область' },
      { name: 'region', label: 'Регион' },
    ],
  },
  well: {
    label: 'Скважина', plural: 'Скважины', route: (id) => `/wells/${id}`, api: 'wells', parentParam: 'siteId', child: 'wellbore', titleField: 'name',
    fields: [
      { name: 'name', label: 'Название', required: true },
      { name: 'description', label: 'Описание', type: 'textarea' },
      { name: 'location', label: 'Местоположение' },
      { name: 'universal_well_identifier', label: 'UWI' },
      { name: 'type', label: 'Тип' },
      { name: 'well_number', label: 'Номер скважины' },
      { name: 'working_group', label: 'Рабочая группа' },
      { name: 'active_well_unit', label: 'Активная единица' },
    ],
  },
  wellbore: {
    label: 'Ствол', plural: 'Стволы', route: (id) => `/wellbores/${id}`, api: 'wellbores', parentParam: 'wellId', child: 'design', titleField: 'name',
    fields: [
      { name: 'name', label: 'Название', required: true },
      { name: 'bottom_hole_location', label: 'Положение забоя' },
      { name: 'wellbore_depth', label: 'Глубина ствола', type: 'number', unit: 'м' },
      { name: 'depth_interval', label: 'Интервал глубин', type: 'number', unit: 'м' },
      { name: 'average_hook_load', label: 'Средний вес на крюке', type: 'number' },
      { name: 'riser_pressure', label: 'Давление в стояке', type: 'number' },
      { name: 'average_inlet_flow', label: 'Средний расход на входе', type: 'number' },
      { name: 'average_column_rotation_frequency', label: 'Средняя частота вращения', type: 'number' },
      { name: 'maximum_column_rotation_frequency', label: 'Макс. частота вращения', type: 'number' },
      { name: 'average_weight_on_bit', label: 'Средняя нагрузка на долото', type: 'number' },
      { name: 'maximum_weight_on_bit', label: 'Макс. нагрузка на долото', type: 'number' },
      { name: 'average_torque', label: 'Средний момент', type: 'number' },
      { name: 'maximum_torque', label: 'Макс. момент', type: 'number' },
      { name: 'down_static_friction', label: 'Статическое трение', type: 'number' },
    ],
  },
  design: {
    label: 'Дизайн', plural: 'Дизайны', route: (id) => `/designs/${id}`, api: 'designs', parentParam: 'wellboreId', child: 'trajectory', titleField: 'plan_name',
    fields: [
      { name: 'plan_name', label: 'Название плана', required: true },
      { name: 'stage', label: 'Стадия' },
      { name: 'version', label: 'Версия' },
      { name: 'actual_date', label: 'Дата', type: 'date' },
    ],
  },
  trajectory: {
    label: 'Траектория', plural: 'Траектории', route: (id) => `/trajectories/${id}`, api: 'trajectories', parentParam: 'designId', child: 'case', titleField: 'name',
    fields: [
      { name: 'name', label: 'Название', required: true },
      { name: 'description', label: 'Описание', type: 'textarea' },
    ],
  },
  case: {
    label: 'Кейс', plural: 'Кейсы', route: (id) => `/cases/${id}`, api: 'cases', parentParam: 'trajectoryId', titleField: 'case_name',
    fields: [
      { name: 'case_name', label: 'Название', required: true },
      { name: 'case_description', label: 'Описание', type: 'textarea' },
      { name: 'drill_depth', label: 'Глубина бурения', type: 'number', unit: 'м' },
      { name: 'pipe_size', label: 'Типоразмер трубы', type: 'number', unit: 'мм' },
    ],
  },
};

export const kindOrder: Kind[] = ['company', 'field', 'site', 'well', 'wellbore', 'design', 'trajectory', 'case'];

/** Kind of the parent, or undefined for companies. */
export const parentKind = (kind: Kind): Kind | undefined => kindOrder[kindOrder.indexOf(kind) - 1];

export const displayName = (kind: Kind, record: Record<string, unknown> | null | undefined): string => {
  const value = record?.[kinds[kind].titleField];
  return typeof value === 'string' && value.trim() ? value : 'Без названия';
};
