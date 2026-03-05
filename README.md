# MicroSaaS Factory

A production-grade monorepo to launch multiple microproducts fast, with shared auth, database, billing, and LLM providers.

## Prerequisites
- Node.js 20+
- pnpm 9+

## Setup Steps
1. Clone the repository.
2. Run `pnpm install` in the root.
3. Setup the database:
   ```bash
   cd packages/db
   pnpm db:push
   pnpm db:seed
   ```
4. Copy `.env.example` to `.env` in `packages/core` (or root depending on setup) and configure keys.
5. Run the dev server:
   ```bash
   pnpm dev
   ```

## Apps
- **Web** (`http://localhost:3000`): Corporate landing page and Auth.
- **Studio** (`http://localhost:3001`): Admin internal app for events, emails, and workspace management.
- **Microapp 1 - Resume** (`http://localhost:3002`): Resume bullet generator.
- **Microapp 2 - PRD2Jira** (`http://localhost:3003`): PRD to tickets generator.
- **Microapp 3 - Meeting** (`http://localhost:3004`): Notes to action items.