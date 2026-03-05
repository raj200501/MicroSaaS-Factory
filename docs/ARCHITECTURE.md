# Architecture

This project is a Turborepo monorepo consisting of:

## Packages
- `@microsaas/db`: Prisma client and schema using a local SQLite database (`dev.db`).
- `@microsaas/core`: Zod environment validation and shared React utilities.
- `@microsaas/auth`: Session management with `jose` for JSON Web Tokens and stubbed magic links.
- `@microsaas/llm`: An abstraction around Vercel's AI SDK supporting OpenAI, Anthropic, and a local DummyProvider.
- `@microsaas/billing`: Local stub for a billing state.
- `@microsaas/analytics`: Event logger writing to the SQLite DB.
- `@microsaas/email`: Email capture writing to the SQLite DB.
- `@microsaas/ui`: Shared Tailwind + Radix primitives (button, input, card).
- `@microsaas/content`: Standardized SEO and metadata configurations.
- `@microsaas/cli`: A Node.js CLI script to scaffold new Next.js microapps.

## Apps
- `web`: Next.js App Router for landing and public authentication flows.
- `studio`: Next.js App Router internal admin tool.
- `microapp-*`: Specific feature Next.js apps demonstrating the platform capabilities.

## Data Model
- **User**: Global users.
- **Workspace**: Tenants. Microapps are installed per workspace.
- **MicroappInstall**: Links workspaces to enabled microapps + custom JSON config.
- **Event**: Action logging spanning across apps.
- **EmailMessage**: Outbox capturing sent emails locally.
- **LlmKey**: BYOK storage for OpenAI/Anthropic APIs per workspace.
