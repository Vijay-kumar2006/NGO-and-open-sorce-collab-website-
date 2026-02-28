Render deployment guide — Backend

This file explains how to deploy the backend on Render (https://render.com). It assumes your project is pushed to GitHub and that you will use Docker (recommended) or Node service as an alternative.

1) Prepare your repo
- Ensure the repo on GitHub contains the backend at `backend/` and the Dockerfile at `docker/backend.Dockerfile`.
- Confirm `database/prisma/schema.prisma` is present and migrations applied locally.

2) Create managed services on Render
- PostgreSQL: Create a new Render Managed PostgreSQL instance (choose plan). After creation copy the `DATABASE_URL`.
- Redis: Create a Redis instance on Render (or use an external Redis). After creation copy the `REDIS_URL`.

3) Create a Web Service (Docker - recommended)
- In Render dashboard → New → Web Service → Connect GitHub → select repo and branch (e.g., `main`).
- Set Environment to `Docker`.
- Dockerfile Path: `docker/backend.Dockerfile` (relative to repo root).
- (Optional) Build Command: leave empty — Dockerfile should handle build.
- Start Command: leave empty if Dockerfile defines `CMD`. If not, use:
  ```bash
  # example Start Command (if not using Docker CMD)
  npx prisma migrate deploy --schema=database/prisma/schema.prisma && cd backend && npm run start
  ```
- Instance type/size: choose according to traffic.

4) Environment variables (Render → Service → Environment)
Add these (minimum):
- `DATABASE_URL` = (from managed Postgres)
- `REDIS_URL` = (from managed Redis)
- `JWT_SECRET` = (strong random string)
- `NODE_ENV` = production
- `PORT` = 4000 (optional; Render provides `PORT` env automatically)
- Any `NEXT_PUBLIC_*` variables required by the frontend

5) Migrations and Prisma
- Ensure Prisma client is generated during build:
  - If using Dockerfile, ensure it runs `npx prisma generate` as part of build.
  - Ensure the runtime runs `npx prisma migrate deploy --schema=database/prisma/schema.prisma` before the server starts (either in Docker CMD or Start Command).

6) Health check & verification
- After the service deploys, verify:
  ```bash
  curl -f https://<your-backend>.onrender.com/api/health
  curl -f https://<your-backend>.onrender.com/api/projects
  ```
- Check Render logs for `migrate deploy` success and server listening on the correct port.

7) Alternate: Node Environment (no Docker)
- Create a Render Web Service with Environment = `Node`.
- Build Command (example):
  ```bash
  cd backend
  npm ci
  npx prisma generate --schema=database/prisma/schema.prisma
  npm run build
  ```
- Start Command (example):
  ```bash
  npx prisma migrate deploy --schema=database/prisma/schema.prisma
  cd backend
  npm run start
  ```

8) Tips & troubleshooting
- If migrations fail, run them locally against a copy of production DB or enable `prisma migrate resolve` only when needed.
- Set `JWT_SECRET` to the same value used when running the frontend (or set frontend to use Render backend for auth).
- Ensure CORS and allowed origins are configured if you restrict origins.
- Enable automated backups on the managed Postgres instance.
- Monitor logs for Redis connection errors and increase `CACHE_TTL` if needed.

9) Optional: `render.yaml`
- If you want infrastructure-as-code for Render, create a `render.yaml` in repo root describing the Web Service, databases, and env vars. (I can generate this for you if you want.)

---
If you want, I can now:
- (A) Generate a `render.yaml` for the backend + managed Postgres + Redis,
- (B) Convert your raw SQL index migration into a proper Prisma migration folder,
- (C) Add a Render deploy job to the CI workflow.

Pick one and I will implement it next.