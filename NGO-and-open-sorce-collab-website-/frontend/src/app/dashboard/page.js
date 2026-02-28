"use client";

import SectionHeader from '@/components/SectionHeader';
import Alert from '@/components/Alert';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import StatusBadge from '@/components/StatusBadge';
import EmptyState from '@/components/EmptyState';
import PageTransition from '@/components/PageTransition';
import { useAuth } from '@/hooks/useAuth';
import { useFetch } from '@/hooks/useFetch';

export default function DashboardPage() {
  const { loading: authLoading } = useAuth({ requireAuth: true, redirectTo: '/' });
  const { data, loading, error } = useFetch('/api/dashboard', { skip: authLoading });

  return (
    <PageTransition>
      <div className="container space-y-10 py-10">
        <SectionHeader
          title="Transparency dashboard"
          subtitle="Live snapshot of projects, assignments, and recent contributions."
        />

        {error && <Alert type="error" message={error} />}

        {loading || !data ? (
          <div className="grid gap-8 lg:grid-cols-3">
            <LoadingSkeleton rows={1} />
            <LoadingSkeleton rows={1} />
            <LoadingSkeleton rows={1} />
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Active Projects */}
            <div className="card space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                  </svg>
                </span>
                <h3 className="text-lg font-bold text-ink">Active projects</h3>
              </div>
              {data.activeProjects.length === 0 ? (
                <p className="text-sm text-ink-muted">No active projects.</p>
              ) : (
                <ul className="space-y-2">
                  {data.activeProjects.map((project) => (
                    <li key={project.id} className="flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-soft-100">
                      <div>
                        <p className="text-sm font-medium text-ink">{project.title}</p>
                        <p className="text-xs text-ink-muted">{project.owner}</p>
                      </div>
                      <span className="badge bg-primary-50 text-primary-700 ring-1 ring-primary-600/10">{project.taskCount} tasks</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Active Assignments */}
            <div className="card space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                  </svg>
                </span>
                <h3 className="text-lg font-bold text-ink">Active assignments</h3>
              </div>
              {data.activeAssignments.length === 0 ? (
                <p className="text-sm text-ink-muted">No active assignments.</p>
              ) : (
                <ul className="space-y-2">
                  {data.activeAssignments.map((task) => (
                    <li key={task.id} className="rounded-xl px-3 py-2.5 transition-colors hover:bg-soft-100">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-ink">{task.title}</p>
                        <StatusBadge status={task.status} />
                      </div>
                      <p className="mt-0.5 text-xs text-ink-muted">{task.assignee} &middot; {task.project}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Recent Contributions */}
            <div className="card space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                </span>
                <h3 className="text-lg font-bold text-ink">Recent contributions</h3>
              </div>
              {data.recentContributions.length === 0 ? (
                <p className="text-sm text-ink-muted">No recent contributions.</p>
              ) : (
                <ul className="space-y-2">
                  {data.recentContributions.map((task) => (
                    <li key={task.id} className="rounded-xl px-3 py-2.5 transition-colors hover:bg-soft-100">
                      <p className="text-sm font-medium text-ink">{task.title}</p>
                      <p className="mt-0.5 text-xs text-ink-muted">{task.assignee} &middot; {task.project}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
