import { useId, useRef, useState, type DragEvent, type ReactNode } from 'react';
import { FiFile, FiUpload, FiX } from 'react-icons/fi';
import { cn } from './cn';

/** Drag-and-drop or click-to-choose file input for one file of a given extension. */
export const FileDrop = ({ label, hint, accept, file, onChange }: {
  label: ReactNode; hint?: ReactNode; accept: string; file: File | null | undefined; onChange: (file: File | null) => void;
}) => {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [error, setError] = useState('');

  const pick = (f: File | undefined) => {
    if (!f) return;
    const ok = accept.split(',').some((ext) => f.name.toLowerCase().endsWith(ext.trim().toLowerCase()));
    setError(ok ? '' : `Нужен файл ${accept}`);
    if (ok) onChange(f);
  };
  const onDrop = (e: DragEvent) => { e.preventDefault(); setOver(false); pick(e.dataTransfer.files[0]); };

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-ink-700">{label}</label>
      {file ? (
        <div className="flex h-24 items-center gap-3 rounded-lg border border-ink bg-paper px-4">
          <FiFile className="h-5 w-5 shrink-0" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{file.name}</p>
            <p className="text-xs text-ink-500">{Math.max(1, Math.round(file.size / 1024))} КБ</p>
          </div>
          <button type="button" aria-label="Убрать файл" onClick={() => { onChange(null); if (input.current) input.current.value = ''; }}
            className="rounded p-1.5 text-ink-500 hover:bg-ink-100 hover:text-ink touch:p-3"><FiX /></button>
        </div>
      ) : (
        <div onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={onDrop}
          onClick={() => input.current?.click()}
          className={cn('flex h-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-center transition-colors',
            over ? 'border-ink bg-ink-50' : 'border-ink-300 hover:border-ink hover:bg-ink-50')}>
          <FiUpload className="h-4 w-4 text-ink-500" aria-hidden="true" />
          <p className="text-xs"><span className="font-medium underline">Выберите файл</span> или перетащите сюда</p>
          <p className="text-2xs text-ink-500">{accept}</p>
        </div>
      )}
      <input ref={input} id={id} type="file" accept={accept} className="sr-only" onChange={(e) => pick(e.target.files?.[0])} />
      {error ? <p className="text-xs">⚠ {error}</p> : hint && <p className="text-xs text-ink-500">{hint}</p>}
    </div>
  );
};
