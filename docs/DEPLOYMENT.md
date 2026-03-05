# Deployment Guide

The MicroSaaS Factory is designed to be easily deployable on modern Serverless platforms.

## Vercel

Since all apps are built with Next.js App Router, Vercel provides the easiest deployment path.

1. Install the Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the monorepo root.
3. Vercel will detect Turborepo and ask you which app to deploy (e.g., `web`, `studio`, `microapp-resume`).
4. Set your environment variables in the Vercel dashboard:
   - `DATABASE_URL` (You will need to host your SQLite on a service like Turso, or switch to Postgres via Neon/Supabase).
   - `NODE_ENV=production`

## Docker (Self-Hosted)

To host locally on a VPS for free, you can write a `Dockerfile` multi-stage build spanning the turborepo architecture. 
Since we use SQLite locally, a self-hosted Docker container with a mounted volume is a valid, 100% free hosting solution.

Ensure `dev.db` is stored on a persistent volume so tenant data is not lost on rebuilds.
