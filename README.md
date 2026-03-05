# MicroSaaS Factory

The **MicroSaaS Factory** is a local-first, production-ready monorepo designed to help you generate, build, and ship dozens of AI-powered microapps rapidly.

## Features

- **Zero Paid SaaS Required**: Fully functional local environment with SQLite and stubbed providers.
- **BYOK (Bring Your Own Key)**: Add OpenAI or Anthropic API keys per workspace in the Studio app.
- **Local SQLite DB**: No external database connections needed for development.
- **Cookie-Based Auth**: Secure HTTP-only cookies and Next.js Edge Middleware for authentication.
- **Shared UI & Logic**: Monorepo structure using Turborepo and pnpm workspaces.
- **Showcase & Stubs**: Automatically generate 30+ microapp stubs and view them in a beautiful showcase.
- **Launch Kit Generator**: Instantly generate Product Hunt, X (Twitter), and Indie Hackers templates for your launches.

## Apps & Packages

- \`apps/web\`: Marketing site, Showcase, Documentation, and central Login.
- \`apps/studio\`: Admin dashboard for managing workspaces, API keys, microapp installs, and viewing execution logs/emails.
- \`apps/microapp-*\`: Individual AI microapps (e.g., Resume Builder, PRD to Jira, Meeting Notes).
- \`packages/db\`: Prisma schema, local database, and generated client.
- \`packages/auth\`: Shared session and middleware logic.
- \`packages/llm\`: Abstracted AI generation handling Dummy, OpenAI, and Anthropic providers.

## Getting Started

### Prerequisites
- Node.js (v18+)
- pnpm (v8+)

### Installation & Setup

1. **Install dependencies:**
   \`\`\`bash
   pnpm install
   \`\`\`

2. **Initialize the database:**
   \`\`\`bash
   pnpm db:push
   pnpm db:seed
   \`\`\`

3. **Generate Microapp Stubs (Optional):**
   \`\`\`bash
   pnpm --filter web generate:stubs
   \`\`\`

4. **Run the development servers:**
   \`\`\`bash
   pnpm dev
   \`\`\`

This will start:
- Web App (Port 3000)
- Studio App (Port 3001)
- Microapps (Ports 3002+)

### Testing

For local testing without an API key, the LLM package automatically falls back to a **Dummy Provider**. It validates schemas and simulates latency without making external requests.

### Launch Kit
To generate your launch assets:
\`\`\`bash
pnpm --filter web generate:launch-kit
\`\`\`
Check the \`/launch-kit\` directory for your templates.

## Architecture

This factory relies heavily on **Server Actions** to encapsulate specific AI behaviors into individual apps while reusing the core platform services (Auth, DB, Logging) via imported workspace packages. All executions, errors, and latencies are recorded locally in SQLite for easy auditing via the Studio app.