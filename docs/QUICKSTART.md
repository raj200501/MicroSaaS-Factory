# Quickstart

Get running in less than 5 minutes.

1. Ensure `pnpm` is installed: `npm i -g pnpm`.
2. Install dependencies: `pnpm install`
3. Push the schema to the local SQLite database: `pnpm --filter @microsaas/db db:push`
4. Seed demo data (admin user, default workspace, microapp registry): `pnpm --filter @microsaas/db db:seed`
5. Start turborepo development server: `pnpm dev`
6. Access Apps:
   - Web: http://localhost:3000
   - Studio: http://localhost:3001
   - Resume Builder: http://localhost:3002
   - PRD to Jira: http://localhost:3003
   - Meeting Notes: http://localhost:3004
