"use client";

import { useEffect, useState, useCallback } from 'react';
import SectionHeader from '@/components/SectionHeader';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Tag from '@/components/Tag';
import StatusBadge from '@/components/StatusBadge';
import Alert from '@/components/Alert';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';
import PageTransition from '@/components/PageTransition';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

export default function ProjectsPage() {
  const { user, loading: authLoading, isNGO } = useAuth({ requireAuth: true, redirectTo: '/' });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', description: '', status: 'active', tags: '' });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState('');

  const loadProjects = useCallback(() => {
    setLoading(true);
    apiFetch('/api/projects')
      .then((data) => setProjects(data.projects || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!authLoading && user) loadProjects();
  }, [authLoading, user, loadProjects]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSaving(true);

    try {
      await apiFetch('/api/projects', {
        method: 'POST',
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          status: form.status,
          tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        }),
      });
      setForm({ title: '', description: '', status: 'active', tags: '' });
      loadProjects();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (projectId) => {
    const confirmed = window.confirm('Delete this project? This cannot be undone.');
    if (!confirmed) return;

    setDeletingId(projectId);
    setError('');

    try {
      await apiFetch(`/api/projects/${projectId}`, { method: 'DELETE' });
      loadProjects();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId('');
    }
  };

  return (
    <PageTransition>
      <div className="container space-y-10 py-10">
        <SectionHeader
          title="Projects"
          subtitle="Track ongoing initiatives and keep contribution pipelines visible."
        >
          {isNGO && (
            <span className="badge bg-primary-50 text-primary-700 ring-1 ring-primary-600/10">NGO Manager</span>
          )}
        </SectionHeader>

        {error && <Alert type="error" message={error} onDismiss={() => setError('')} />}

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Project list */}
          <div className="space-y-6">
            {loading ? (
              <LoadingSkeleton rows={3} />
            ) : projects.length === 0 ? (
              <EmptyState
                title="No projects yet"
                message={isNGO ? 'Create your first project using the form.' : 'Check back soon — NGOs are setting up projects.'}
                icon="📂"
              />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {projects.map((project) => (
                  <div key={project.id} className="card card-hover group relative overflow-hidden">
                    {/* Accent bar */}
                    <div className={`absolute inset-x-0 top-0 h-1 ${project.status === 'active' ? 'bg-emerald-500' : project.status === 'idea' ? 'bg-amber-400' : 'bg-blue-500'}`} />

                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-base font-bold text-ink line-clamp-2 group-hover:text-primary-600 transition-colors">
                        {project.title}
                      </h3>
                      <StatusBadge status={project.status} />
                    </div>

                    <p className="mt-2 text-sm text-ink-muted line-clamp-3">{project.description}</p>

                    {/* Tags */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.tags?.length ? (
                        project.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)
                      ) : (
                        <span className="text-xs text-ink-muted">No tags</span>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="mt-4 flex items-center justify-between border-t border-soft-200 pt-3">
                      <div className="flex items-center gap-2 text-xs text-ink-muted">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-soft-100 text-[10px] font-bold text-ink-muted">
                          {project.owner?.name?.[0]?.toUpperCase() || '?'}
                        </span>
                        {project.owner?.name || 'Unknown'}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-ink-muted">{project.taskCount} tasks</span>
                        {isNGO && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(project.id)}
                            disabled={deletingId === project.id}
                            className="!px-2 !py-1 text-danger hover:!bg-danger-light"
                          >
                            {deletingId === project.id ? '...' : (
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                              </svg>
                            )}
                          </Button>
                        )}
                        {!isNGO && project.owner?.email && (
                          <a
                            className="inline-flex items-center gap-1 rounded-lg border border-soft-200 px-2.5 py-1 text-xs font-medium text-ink-muted transition-colors hover:border-primary-300 hover:text-primary-600"
                            href={`mailto:${project.owner.email}?subject=Contribution%20Request%20-%20${encodeURIComponent(project.title)}`}
                          >
                            Contact
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Side panel */}
          {isNGO ? (
            <form onSubmit={handleSubmit} className="card sticky top-24 space-y-5 self-start">
              <h3 className="text-lg font-bold text-ink">Create new project</h3>
              <Input
                label="Project title"
                placeholder="e.g. Community Data Cleanup"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
              <label className="block space-y-1.5 text-sm font-medium text-ink-light">
                <span>Description</span>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="What is this project about?"
                  className="min-h-[100px] w-full rounded-xl border border-soft-200 bg-white px-4 py-2.5 text-ink placeholder:text-slate-400 shadow-sm transition-all duration-200 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  required
                />
              </label>
              <label className="block space-y-1.5 text-sm font-medium text-ink-light">
                <span>Status</span>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full rounded-xl border border-soft-200 bg-white px-4 py-2.5 text-ink shadow-sm transition-all duration-200 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="idea">Idea</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </label>
              <Input
                label="Tags (comma separated)"
                placeholder="education, health, data"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
              />
              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? 'Creating...' : 'Create project'}
              </Button>
              <p className="text-xs text-ink-muted">Only NGO accounts can create projects.</p>
            </form>
          ) : (
            <div className="card sticky top-24 space-y-4 self-start">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                </span>
                <h3 className="text-lg font-bold text-ink">Contribute to projects</h3>
              </div>
              <p className="text-sm text-ink-muted">As a contributor, you can:</p>
              <ul className="space-y-2 text-sm text-ink-muted">
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  Browse available projects in the list
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  Contact the NGO owner to get assigned
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  Track your tasks on the dashboard
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
