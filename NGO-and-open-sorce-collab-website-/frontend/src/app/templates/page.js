"use client";

import { useEffect, useState, useCallback } from 'react';
import SectionHeader from '@/components/SectionHeader';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Tag from '@/components/Tag';
import Alert from '@/components/Alert';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';
import PageTransition from '@/components/PageTransition';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

export default function TemplatesPage() {
  const { user, loading: authLoading, isNGO } = useAuth({ requireAuth: true, redirectTo: '/' });
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', description: '', tasks: '' });
  const [saving, setSaving] = useState(false);

  const loadTemplates = useCallback(() => {
    setLoading(true);
    apiFetch('/api/templates')
      .then((data) => setTemplates(data.templates || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!authLoading && user) loadTemplates();
  }, [authLoading, user, loadTemplates]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSaving(true);

    try {
      const tasks = form.tasks
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => ({ title: line, description: '' }));

      await apiFetch('/api/templates', {
        method: 'POST',
        body: JSON.stringify({ name: form.name, description: form.description, tasks }),
      });

      setForm({ name: '', description: '', tasks: '' });
      loadTemplates();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageTransition>
      <div className="container space-y-10 py-10">
        <SectionHeader
          title="Reusable templates"
          subtitle="Create pipelines that can be cloned for new projects."
        >
          {isNGO && (
            <span className="badge bg-primary-50 text-primary-700 ring-1 ring-primary-600/10">NGO Manager</span>
          )}
        </SectionHeader>

        {error && <Alert type="error" message={error} onDismiss={() => setError('')} />}

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Template list */}
          <div className="space-y-6">
            {loading ? (
              <LoadingSkeleton rows={3} />
            ) : templates.length === 0 ? (
              <EmptyState
                title="No templates yet"
                message={isNGO ? 'Create a reusable template using the form.' : 'Check back soon — NGOs are building templates.'}
                icon="📋"
              />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {templates.map((template) => (
                  <div key={template.id} className="card card-hover group relative overflow-hidden">
                    {/* Accent bar */}
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-500 to-accent-500" />

                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-base font-bold text-ink line-clamp-2 group-hover:text-primary-600 transition-colors">
                        {template.name}
                      </h3>
                      <Tag>{template.tasks?.length || 0} tasks</Tag>
                    </div>

                    <p className="mt-2 text-sm text-ink-muted line-clamp-3">
                      {template.description || 'No description provided'}
                    </p>

                    {/* Task preview */}
                    {template.tasks?.length ? (
                      <ul className="mt-3 space-y-1.5">
                        {template.tasks.slice(0, 4).map((task) => (
                          <li key={task.id} className="flex items-center gap-2 text-xs text-ink-muted truncate">
                            <svg className="h-3.5 w-3.5 shrink-0 text-primary-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="truncate">{task.title}</span>
                          </li>
                        ))}
                        {template.tasks.length > 4 && (
                          <li className="text-xs text-ink-muted pl-5">+{template.tasks.length - 4} more</li>
                        )}
                      </ul>
                    ) : (
                      <p className="mt-3 text-xs text-ink-muted">No tasks listed</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Side panel */}
          {isNGO ? (
            <form onSubmit={handleSubmit} className="card sticky top-24 space-y-5 self-start">
              <h3 className="text-lg font-bold text-ink">Create template</h3>
              <Input
                label="Template name"
                placeholder="e.g. Event Planning Pipeline"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <Input
                label="Description"
                placeholder="Brief overview of this template"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <label className="block space-y-1.5 text-sm font-medium text-ink-light">
                <span>Tasks (one per line)</span>
                <textarea
                  value={form.tasks}
                  onChange={(e) => setForm({ ...form, tasks: e.target.value })}
                  placeholder={"Set up venue\nSend invitations\nPrepare logistics"}
                  className="min-h-[140px] w-full rounded-xl border border-soft-200 bg-white px-4 py-2.5 text-ink placeholder:text-slate-400 shadow-sm transition-all duration-200 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </label>
              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? 'Saving...' : 'Create template'}
              </Button>
              <p className="text-xs text-ink-muted">Only NGO accounts can create templates.</p>
            </form>
          ) : (
            <div className="card sticky top-24 space-y-4 self-start">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </span>
                <h3 className="text-lg font-bold text-ink">Explore templates</h3>
              </div>
              <p className="text-sm text-ink-muted">
                Browse templates to understand common workflows NGOs use. When a project is created from one of these templates, you can volunteer for associated tasks.
              </p>
              <ul className="space-y-2 text-sm text-ink-muted">
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  Review standard task breakdowns
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  Identify areas you can contribute to
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
