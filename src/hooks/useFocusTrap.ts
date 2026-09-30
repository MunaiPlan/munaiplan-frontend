import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]';

/**
 * While `active`, keeps Tab and Shift+Tab inside `ref`, focuses its first control and calls
 * `onEscape` on Escape. When it ends, focus returns to where it was before.
 */
export const useFocusTrap = (ref: RefObject<HTMLElement>, active: boolean, onEscape: () => void) => {
  // The latest callback, without restarting the trap when the parent re-renders.
  const escape = useRef(onEscape);
  escape.current = onEscape;

  useEffect(() => {
    const root = ref.current;
    if (!active || !root) return;
    const previous = document.activeElement as HTMLElement | null;
    const focusables = () => [...root.querySelectorAll<HTMLElement>(FOCUSABLE)]
      .filter((el) => el.tabIndex >= 0 && el.getClientRects().length > 0);

    // Wait a frame: a drawer that was `visibility: hidden` cannot take focus until styles update.
    const frame = window.requestAnimationFrame(() => focusables()[0]?.focus());

    const onKey = (e: KeyboardEvent) => {
      // A menu inside the trap (the explorer's context menu) handles its own Escape.
      if (e.key === 'Escape' && !(e.target as HTMLElement).closest('[role="menu"]')) {
        e.preventDefault();
        escape.current();
        return;
      }
      if (e.key !== 'Tab') return;
      const list = focusables();
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];
      const inside = root.contains(document.activeElement);
      if (e.shiftKey && (document.activeElement === first || !inside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !inside)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener('keydown', onKey);
      if (previous?.isConnected) previous.focus();
    };
  }, [ref, active]);
};
