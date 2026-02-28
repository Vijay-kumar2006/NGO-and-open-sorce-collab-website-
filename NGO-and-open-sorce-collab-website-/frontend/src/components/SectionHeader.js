/**
 * Section header with optional subtitle and right-side action slot.
 */
export default function SectionHeader({ title, subtitle, children }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
      {children && <div className="mt-3 sm:mt-0">{children}</div>}
    </div>
  );
}
