import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from './cn';

const control = 'block w-full rounded-md border bg-paper px-2.5 text-sm text-ink transition-colors placeholder:text-ink-500 ' +
  'focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink disabled:bg-ink-50 disabled:text-ink-500';

interface FieldFrameProps {
  label: ReactNode;
  unit?: string;
  hint?: ReactNode;
  error?: string;
  id: string;
  children: ReactNode;
  className?: string;
}

/** Label, optional unit, control, and a hint or error bound with aria-describedby. */
const FieldFrame = ({ label, unit, hint, error, id, children, className }: FieldFrameProps) => (
  <div className={cn('flex flex-col gap-1', className)}>
    <label htmlFor={id} className="flex items-baseline justify-between text-xs font-medium text-ink-700">
      <span>{label}</span>
      {unit && <span className="font-mono text-2xs font-normal text-ink-500">{unit}</span>}
    </label>
    {children}
    {error ? <p id={`${id}-msg`} className="text-xs text-ink"><span aria-hidden="true">⚠ </span>{error}</p>
      : hint ? <p id={`${id}-msg`} className="text-xs text-ink-500">{hint}</p> : null}
  </div>
);

type Common = { label: ReactNode; unit?: string; hint?: ReactNode; error?: string; containerClassName?: string };

export const TextField = forwardRef<HTMLInputElement, Common & InputHTMLAttributes<HTMLInputElement>>(
  ({ label, unit, hint, error, containerClassName, className, id, ...rest }, ref) => {
    const auto = useId();
    const fieldId = id ?? auto;
    return (
      <FieldFrame label={label} unit={unit} hint={hint} error={error} id={fieldId} className={containerClassName}>
        <input ref={ref} id={fieldId} aria-invalid={Boolean(error) || undefined} aria-describedby={error || hint ? `${fieldId}-msg` : undefined}
          className={cn(control, 'h-9 touch:h-11', rest.type === 'number' && 'num text-right font-mono', error ? 'border-ink' : 'border-ink-300', className)} {...rest} />
      </FieldFrame>
    );
  });
TextField.displayName = 'TextField';

export const SelectField = forwardRef<HTMLSelectElement, Common & SelectHTMLAttributes<HTMLSelectElement>>(
  ({ label, unit, hint, error, containerClassName, className, id, children, ...rest }, ref) => {
    const auto = useId();
    const fieldId = id ?? auto;
    return (
      <FieldFrame label={label} unit={unit} hint={hint} error={error} id={fieldId} className={containerClassName}>
        <select ref={ref} id={fieldId} aria-invalid={Boolean(error) || undefined}
          className={cn(control, 'h-9 pr-8 touch:h-11', error ? 'border-ink' : 'border-ink-300', className)} {...rest}>{children}</select>
      </FieldFrame>
    );
  });
SelectField.displayName = 'SelectField';

export const TextAreaField = forwardRef<HTMLTextAreaElement, Common & TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ label, unit, hint, error, containerClassName, className, id, ...rest }, ref) => {
    const auto = useId();
    const fieldId = id ?? auto;
    return (
      <FieldFrame label={label} unit={unit} hint={hint} error={error} id={fieldId} className={containerClassName}>
        <textarea ref={ref} id={fieldId} aria-invalid={Boolean(error) || undefined}
          className={cn(control, 'min-h-[5rem] py-2', error ? 'border-ink' : 'border-ink-300', className)} {...rest} />
      </FieldFrame>
    );
  });
TextAreaField.displayName = 'TextAreaField';
