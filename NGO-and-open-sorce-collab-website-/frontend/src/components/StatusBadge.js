/**
 * Maps a status string (project or task) to a coloured badge.
 */
const STATUS_MAP = {
  active:    'badge-active',
  idea:      'badge-idea',
  completed: 'badge-completed',
  open:      'badge-open',
  assigned:  'badge-assigned',
  review:    'badge-review',
};

export default function StatusBadge({ status }) {
  const cls = STATUS_MAP[status] || 'badge bg-slate-100 text-slate-600';
  return <span className={cls}>{status}</span>;
}
