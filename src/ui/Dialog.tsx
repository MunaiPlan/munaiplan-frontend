import { useEffect, useRef, type ReactNode } from 'react';
import { Button } from './Button';

/** Native <dialog> modal: focus trap, Escape and backdrop close come from the platform. */
export const Dialog = ({ open, title, onClose, children, footer }: {
  open: boolean; title: ReactNode; onClose: () => void; children: ReactNode; footer?: ReactNode;
}) => {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);
  return (
    <dialog ref={ref} onClose={onClose} onClick={(e) => { if (e.target === ref.current) onClose(); }}
      className="w-full max-w-md rounded-lg bg-paper p-0 text-ink shadow-pop backdrop:bg-ink/40">
      <div className="border-b border-ink-200 px-5 py-3.5"><h2 className="text-sm font-semibold">{title}</h2></div>
      <div className="px-5 py-4 text-sm text-ink-700">{children}</div>
      {footer && <div className="flex justify-end gap-2 border-t border-ink-200 px-5 py-3">{footer}</div>}
    </dialog>
  );
};

export const ConfirmDialog = ({ open, title, message, confirmLabel = 'Удалить', busy, onConfirm, onCancel }: {
  open: boolean; title: ReactNode; message: ReactNode; confirmLabel?: string; busy?: boolean; onConfirm: () => void; onCancel: () => void;
}) => (
  <Dialog open={open} title={title} onClose={onCancel}
    footer={<><Button onClick={onCancel}>Отмена</Button><Button variant="danger" loading={busy} onClick={onConfirm}>{confirmLabel}</Button></>}>
    {message}
  </Dialog>
);
