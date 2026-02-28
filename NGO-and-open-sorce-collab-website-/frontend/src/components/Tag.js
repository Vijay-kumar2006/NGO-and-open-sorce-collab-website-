/**
 * Small coloured tag / chip. Supports optional colour variants.
 */
const COLORS = [
  'bg-primary-50 text-primary-700 ring-primary-600/10',
  'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
  'bg-amber-50 text-amber-700 ring-amber-600/10',
  'bg-rose-50 text-rose-700 ring-rose-600/10',
  'bg-cyan-50 text-cyan-700 ring-cyan-600/10',
  'bg-violet-50 text-violet-700 ring-violet-600/10',
];

function hashIndex(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash) % COLORS.length;
}

export default function Tag({ children, className = '' }) {
  const text = typeof children === 'string' ? children : '';
  const color = COLORS[hashIndex(text)];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${color} ${className}`}>
      {children}
    </span>
  );
}
