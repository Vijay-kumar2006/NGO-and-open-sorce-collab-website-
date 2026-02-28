/**
 * Styled text input with label support and focus ring.
 */
export default function Input({ label, className = '', ...props }) {
  return (
    <label className="block space-y-1.5 text-sm font-medium text-ink-light">
      {label && <span>{label}</span>}
      <input
        {...props}
        className={`w-full rounded-xl border border-soft-200 bg-white px-4 py-2.5 text-ink placeholder:text-slate-400 shadow-sm transition-all duration-200 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${className}`}
      />
    </label>
  );
}
