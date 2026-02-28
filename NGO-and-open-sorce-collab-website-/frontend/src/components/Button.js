/**
 * Primary CTA button with variants.
 * @param {{ variant?: 'primary' | 'secondary' | 'danger' | 'ghost', size?: 'sm' | 'md' | 'lg' }} props
 */
const VARIANTS = {
  primary:
    'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-glow hover:from-primary-600 hover:to-primary-700 focus-visible:ring-primary-500/40',
  secondary:
    'bg-white text-ink border border-soft-200 shadow-card hover:border-primary-300 hover:bg-primary-50 focus-visible:ring-primary-500/30',
  danger:
    'bg-danger text-white hover:bg-red-600 focus-visible:ring-red-500/40',
  ghost:
    'text-ink-muted hover:text-ink hover:bg-soft-100 focus-visible:ring-primary-500/30',
};

const SIZES = {
  sm: 'px-3.5 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3 text-base',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
    >
      {children}
    </button>
  );
}
