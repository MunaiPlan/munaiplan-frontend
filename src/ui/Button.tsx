import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from './cn';
import { Spinner } from './Spinner';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md';

const variants: Record<Variant, string> = {
  primary: 'bg-ink text-paper hover:bg-ink-700 disabled:bg-ink-300',
  secondary: 'border border-ink-300 bg-paper text-ink hover:border-ink hover:bg-ink-50 disabled:text-ink-500',
  ghost: 'text-ink-700 hover:bg-ink-100 hover:text-ink disabled:text-ink-300',
  // Destructive actions stay monochrome but read as serious: solid outline, underline on hover.
  danger: 'border border-ink bg-paper text-ink hover:bg-ink hover:text-paper disabled:border-ink-300 disabled:text-ink-300',
};
// On touch screens every size is at least 44px tall.
const sizes: Record<Size, string> = {
  sm: 'h-7 px-2.5 text-xs gap-1.5 touch:h-11 touch:px-3.5 touch:text-sm',
  md: 'h-9 px-3.5 text-sm gap-2 touch:h-11',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'secondary', size = 'md', loading = false, icon, className, children, disabled, type = 'button', ...rest }, ref) => (
    <button ref={ref} type={type} disabled={disabled || loading} aria-busy={loading || undefined}
      className={cn('inline-flex shrink-0 select-none items-center justify-center rounded-md font-medium transition-colors disabled:cursor-not-allowed',
        variants[variant], sizes[size], className)} {...rest}>
      {loading ? <Spinner size={size === 'sm' ? 12 : 14} /> : icon}
      {children}
    </button>
  ));
Button.displayName = 'Button';
