-- Add indexes to speed up common queries
CREATE INDEX IF NOT EXISTS idx_project_status ON "Project" (status);
CREATE INDEX IF NOT EXISTS idx_project_createdAt ON "Project" ("createdAt");
CREATE INDEX IF NOT EXISTS idx_task_status ON "Task" (status);
CREATE INDEX IF NOT EXISTS idx_template_createdAt ON "Template" ("createdAt");
