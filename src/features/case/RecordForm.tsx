import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { instance } from '../../api/axios.api';
import { apiErrorMessage } from '../../services/admin.service';
import { Alert, Button, Panel, SelectField, TextField } from '../../ui';

export interface RecordField {
  name: string;
  label: string;
  unit?: string;
  type?: 'number' | 'text' | 'select';
  /** Required fields must be filled; optional numbers are sent as null when empty. */
  required?: boolean;
  /** For selects: endpoint returning [{id, name}]. */
  optionsFrom?: string;
}

export interface RecordSpec {
  resource: string;
  title: string;
  fields: RecordField[];
  /** Some update endpoints expect the record id inside the body as well. */
  idInBody?: boolean;
}

type Values = Record<string, string>;
const num = (s: string) => Number(s.trim().replace(',', '.'));

/** Create or edit one record of a case input resource, generated from a field spec. */
export const RecordForm = ({ spec, caseId, initial, onSaved, onCancel }: {
  spec: RecordSpec; caseId: string; initial?: Record<string, unknown> & { id?: string }; onSaved: () => void; onCancel: () => void;
}) => {
  const [options, setOptions] = useState<Record<string, { id: string; name: string }[]>>({});
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({
    defaultValues: Object.fromEntries(spec.fields.map((f) => {
      const v = initial?.[f.name];
      return [f.name, v === null || v === undefined ? '' : String(v)];
    })),
  });

  useEffect(() => {
    spec.fields.filter((f) => f.optionsFrom).forEach((f) => {
      instance.get<{ id: string; name: string }[]>(f.optionsFrom as string)
        .then(({ data }) => setOptions((o) => ({ ...o, [f.name]: Array.isArray(data) ? data : [] })))
        .catch(() => setOptions((o) => ({ ...o, [f.name]: [] })));
    });
  }, [spec]);

  const submit = async (values: Values) => {
    setError('');
    const body: Record<string, unknown> = Object.fromEntries(spec.fields.map((f) => {
      const raw = (values[f.name] ?? '').trim();
      if (f.type === 'number') return [f.name, raw === '' ? (f.required ? 0 : null) : num(raw)];
      return [f.name, raw];
    }));
    try {
      if (initial?.id) {
        await instance.put(`/api/v1/${spec.resource}/${initial.id}`, spec.idInBody ? { ...body, id: initial.id } : body);
      } else {
        await instance.post(`/api/v1/${spec.resource}/?caseId=${encodeURIComponent(caseId)}`, body);
      }
      onSaved();
    } catch (e) {
      setError(apiErrorMessage(e, 'Не удалось сохранить. Проверьте данные.'));
    }
  };

  return (
    <Panel title={`${initial?.id ? 'Изменить' : 'Добавить'}: ${spec.title.toLowerCase()}`}>
      <form onSubmit={handleSubmit(submit)} noValidate className="space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {spec.fields.map((f) => {
            const rules = {
              required: f.required ? 'Заполните это поле' : false,
              validate: f.type === 'number' ? (v: string) => v.trim() === '' || Number.isFinite(num(v)) || 'Введите число' : undefined,
            };
            if (f.type === 'select') {
              const list = options[f.name];
              return (
                <SelectField key={f.name} label={f.label} error={errors[f.name]?.message}
                  hint={list && list.length === 0 ? 'Справочник пуст: он заполняется при импорте из WellPlan.' : undefined} {...register(f.name, rules)}>
                  <option value="">— выберите —</option>
                  {(list ?? []).map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
                </SelectField>
              );
            }
            return (
              <TextField key={f.name} label={f.label} unit={f.unit} inputMode={f.type === 'number' ? 'decimal' : undefined}
                className={f.type === 'number' ? 'num text-right font-mono' : undefined} error={errors[f.name]?.message} {...register(f.name, rules)} />
            );
          })}
        </div>
        {error && <Alert tone="error">{error}</Alert>}
        <div className="flex justify-end gap-2 border-t border-ink-200 pt-4">
          <Button onClick={onCancel}>Отмена</Button>
          <Button type="submit" variant="primary" loading={isSubmitting}>Сохранить</Button>
        </div>
      </form>
    </Panel>
  );
};
