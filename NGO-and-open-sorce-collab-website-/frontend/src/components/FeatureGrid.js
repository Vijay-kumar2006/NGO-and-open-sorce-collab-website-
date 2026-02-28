const features = [
  {
    title: 'Project transparency',
    description: 'See every project status and the people contributing right now.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    gradient: 'from-primary-500 to-primary-600',
    bg: 'bg-primary-50',
    textColor: 'text-primary-600',
  },
  {
    title: 'Duplicate prevention',
    description: 'Match similar tasks before you spend time on repeated work.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    gradient: 'from-emerald-500 to-emerald-600',
    bg: 'bg-emerald-50',
    textColor: 'text-emerald-600',
  },
  {
    title: 'Reusable pipelines',
    description: 'Clone task templates across regions with a single click.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
      </svg>
    ),
    gradient: 'from-accent-500 to-accent-600',
    bg: 'bg-accent-50',
    textColor: 'text-accent-600',
  },
];

export default function FeatureGrid() {
  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((f) => (
        <div
          key={f.title}
          className="group card card-hover relative overflow-hidden"
        >
          {/* Gradient accent top bar */}
          <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${f.gradient}`} />

          <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${f.bg} ${f.textColor} transition-transform duration-300 group-hover:scale-110`}>
            {f.icon}
          </div>
          <h3 className="text-lg font-bold text-ink">{f.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">{f.description}</p>
        </div>
      ))}
    </div>
  );
}
