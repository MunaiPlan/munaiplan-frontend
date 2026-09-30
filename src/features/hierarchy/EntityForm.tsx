import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { apiErrorMessage } from '../../services/admin.service';
import { Alert, Button, TextAreaField, TextField } from '../../ui';
import { hierarchyApi } from './api';
import { kinds, type FieldSpec, type Kind } from './hierarchy';

type Values = Record<string, string>;

const toInput = (spec: FieldSpec, value: unknown): string => {
  if (value === null || value === undefined) return '';
  if (spec.type === 'date' && typeof value === 'string') return value.slice(0, 10);
  return String(value);
};

/** Converts form strings to the API's types: numbers as numbers (empty = 0), dates as RFC 3339. */
const toBody = (fields: FieldSpec[], values: Values): Record<string, unknown> => Object.fromEntries(fields.filter((f) => !f.readOnly).map((f) => {
  const raw = (values[f.name] ?? '').trim();
  if (f.type === 'number') return [f.name, raw === '' ? 0 : Number(raw.replace(',', '.'))];
  if (f.type === 'date') return [f.name, raw ? `${raw}T00:00:00Z` : new Date().toISOString()];
  return [f.name, raw];
}));

/** Create or edit form for the simple hierarchy levels, generated from their field specs. */
export const EntityForm = ({ kind, parentId, id, initial, onSaved, onCancel }: {
  kind: Kind; parentId?: string; id?: string; initial?: Record<string, unknown>; onSaved: () => void; onCancel: () => void;
}) => {
  const spec = kinds[kind];
  const fields = spec.fields.filter((f) => !f.readOnly);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({
    defaultValues: Object.fromEntries(fields.map((f) => [f.name, toInput(f, initial?.[f.name])])),
  });

  const submit = async (values: Values) => {
    setError('');
    try {
      const body = toBody(fields, values);
      if (id) await hierarchyApi.update(kind, id, body);
      else await hierarchyApi.create(kind, parentId, body);
      onSaved();
    } catch (e) {
      setError(apiErrorMessage(e, 'Не удалось сохранить. Проверьте данные и повторите.'));
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {fields.map((f) => {
          const rules = {
            required: f.required ? 'Заполните это поле' : false,
            validate: f.type === 'number'
              ? (v: string) => v.trim() === '' || Number.isFinite(Number(v.replace(',', '.'))) || 'Введите число'
              : f.required ? (v: string) => v.trim() !== '' || 'Заполните это поле' : undefined,
          };
          const common = { label: f.label, unit: f.unit, error: errors[f.name]?.message, ...register(f.name, rules) };
          return f.type === 'textarea'
            ? <TextAreaField key={f.name} containerClassName="md:col-span-2" {...common} />
            : <TextField key={f.name} type={f.type === 'number' ? 'text' : f.type ?? 'text'} inputMode={f.type === 'number' ? 'decimal' : f.type === 'tel' ? 'tel' : undefined}
                className={f.type === 'number' ? 'num text-right font-mono' : undefined} {...common} />;
        })}
      </div>
      {error && <Alert tone="error">{error}</Alert>}
      <div className="flex flex-col-reverse gap-2 border-t border-ink-200 pt-4 sm:flex-row sm:justify-end">
        <Button onClick={onCancel}>Отмена</Button>
        <Button type="submit" variant="primary" loading={isSubmitting}>{id ? 'Сохранить' : `Создать`}</Button>
      </div>
    </form>
  );
};
