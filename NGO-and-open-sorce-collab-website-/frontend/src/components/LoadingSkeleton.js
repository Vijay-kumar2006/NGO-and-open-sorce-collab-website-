/**
 * Reusable skeleton loader — renders a set of pulsing placeholder blocks.
 * @param {{ rows?: number, className?: string }} props
 */
export default function LoadingSkeleton({ rows = 3, className = '' }) {
  return (
    <div className={`space-y-4 ${className}`} aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="space-y-3 rounded-2xl border border-soft-200 bg-surface p-6">
          <div className="skeleton h-5 w-2/5 rounded" />
          <div className="skeleton h-4 w-4/5 rounded" />
          <div className="skeleton h-4 w-3/5 rounded" />
        </div>
      ))}
    </div>
  );
}
