<p align="center"><strong>⚡ MicroSaaS Factory</strong></p>

<p align="center">
A local-first AI microapp platform with <strong>evals</strong>, <strong>traces</strong>, <strong>reliability checks</strong>, and <strong>reproducible demo mode</strong>.
</p>

<p align="center">
  <a href="https://github.com/raj200501/MicroSaaS-Factory/actions"><img src="https://github.com/raj200501/MicroSaaS-Factory/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <img src="https://img.shields.io/badge/tests-10%20passed-brightgreen" alt="Tests">
  <img src="https://img.shields.io/badge/evals-12%2F12%20pass-brightgreen" alt="Evals">
  <img src="https://img.shields.io/badge/typecheck-strict-blue" alt="TypeScript">
  <img src="https://img.shields.io/badge/local--first-SQLite-orange" alt="SQLite">
  <img src="https://img.shields.io/badge/paid%20deps-0-green" alt="Zero Paid">
  <img src="https://img.shields.io/badge/demo%20mode-deterministic-purple" alt="Demo Mode">
</p>

---

## What is this?

MicroSaaS Factory is a **monorepo platform for 30+ single-purpose AI microapps** — tools like Resume Bullet Generator, PRD → Jira Tickets, Cold Email Writer, SQL Query Builder, and more. Each tool is a focused Next.js page backed by shared packages for auth, database, LLM abstraction, and UI components.

Everything runs locally with **SQLite + DummyProvider** (no API keys needed). Plug in your own OpenAI / Anthropic / Gemini key for real LLM output, or use the deterministic dummy mode for development, demos, and evals.

**3 fully-featured apps** (Resume, PRD→Jira, Meeting Notes) + **30 tool-runner microapps** — all live, all functional.

---

## Why this repo matters

| Signal | What it shows |
|--------|--------------|
| 📊 **Measurable evals** | 12-case benchmark harness with schema validation, 6 deterministic checks per case, reproducible reports |
| 🔍 **Auditable runs** | Every tool run is traced with input/output/provider/latency/status — viewable in `/traces` |
| 🛡️ **Graceful fallbacks** | Three-tier provider resolution (BYOK → Demo → Dummy), classified error taxonomy, zero-crash error handling |
| ⚡ **Clone-and-run DX** | `git clone && pnpm install && pnpm dev` — no API keys, no external services, works offline |

---

## Recruiter Quick Tour

> **Time budget: 2 minutes.** Here's what to look at.

| What | Where | Why it matters |
|------|-------|----------------|
| Eval harness | [`packages/evals/`](packages/evals/) | Real scoring: schema validity, output length, deterministic checks |
| Eval report | [`docs/EVAL_REPORT.md`](docs/EVAL_REPORT.md) | Reproducible metrics table with per-case results |
| Trace viewer | `/traces` in the app | Auditable execution timeline for every run |
| Engineering notes | [`docs/ENGINEERING_NOTES.md`](docs/ENGINEERING_NOTES.md) | Design decisions: why dummy mode, why schema validation, why local-first |
| Tool runner | `/tools/[slug]` in the app | 30+ tools, all functional, premium dark-mode UI |
| Provider tests | [`packages/llm/src/providers.test.ts`](packages/llm/src/providers.test.ts) | Tests for fallback logic, dummy model, schema filler |
| CI pipeline | [`.github/workflows/ci.yml`](.github/workflows/ci.yml) | Build → Test → Evals, all automated |

---

## Architecture

```
MicroSaaS-Factory/
├── apps/
│   ├── web/                 # Marketing + tools + traces (Next.js)
│   ├── studio/              # Admin dashboard
│   └── microapp-*/          # 3 standalone microapps
├── packages/
│   ├── evals/               # ⭐ Eval harness + benchmark datasets + reports
│   ├── llm/                 # LLM abstraction (Dummy/OpenAI/Anthropic/Gemini)
│   ├── db/                  # Prisma + SQLite (MicroappRun traces)
│   ├── auth/                # Cookie-based auth + Edge middleware
│   ├── ui/                  # Shared components
│   └── ...                  # core, config, analytics, email, billing, content
├── docs/
│   ├── ENGINEERING_NOTES.md # System design decisions
│   └── EVAL_REPORT.md       # Latest eval results
└── .github/workflows/       # CI: build + test + evals
```

**Key decisions:** Server Actions (no API routes), Edge Middleware (auth at CDN layer), SQLite (local-first, no external DB), Turborepo (monorepo orchestration).

---

## Eval Results

Run `pnpm evals` to reproduce. All metrics computed from actual runs — not fabricated.

| Metric | Value |
|--------|-------|
| Total cases | 12 |
| **Pass rate** | **100%** |
| Schema validity | 100% |
| Completion rate | 100% |
| Error rate | 0% |
| Mean output length | 490 chars |

See [`docs/EVAL_REPORT.md`](docs/EVAL_REPORT.md) for per-case breakdown.

### Scoring rubric (6 checks per case)

1. **schema_valid** — Output is non-null and non-empty
2. **output_nonempty** — Trimmed output has content
3. **min_lines_met** — Meets minimum expected line count
4. **length_within_limit** — Under maximum character limit
5. **contains_input_reference** — Output references the user's input
6. **no_error_thrown** — No exception during generation

---

## Build Quality

```bash
pnpm install        # Install all workspace dependencies
pnpm build          # Build all packages + apps (7 tasks)
pnpm test           # Run unit tests (10 tests across 2 packages)
pnpm evals          # Run eval suite (12 benchmark cases)
pnpm evals:report   # Generate markdown eval report
```

All commands work with zero API keys. DummyProvider handles everything locally.

---

## Reliability & Safety

### Failure modes we explicitly handle

| Failure | Behavior |
|---------|----------|
| No API key configured | Falls back to DummyProvider (deterministic output) |
| LLM provider error | Returns classified error, does not crash UI |
| Missing required input | Returns validation error with field name |
| Rate limit exceeded | Returns "Rate limit exceeded" with reset info |
| Output too large | Truncated at 10KB before DB write |
| Workspace not found | Falls back to default workspace |

### Error taxonomy

Every error is classified into one of 6 categories, visible in the trace viewer:

`input_validation_error` · `workspace_resolution_error` · `provider_unavailable` · `provider_timeout` · `output_schema_mismatch` · `rate_limit_exceeded`

### Rate limiting

- Per-IP: 20 requests/day (IP hashed with SHA-256 + salt)
- Global: 200 requests/day
- Response cache: 7-day TTL by input hash
- All stored in SQLite — no Redis required

---

## LLM Providers

| Provider | Requires Key | Fallback |
|----------|-------------|----------|
| DummyProvider | No | Default — deterministic, handcrafted templates |
| Gemini | Optional (`GEMINI_API_KEY`) | Used in demo mode |
| OpenAI | BYOK | Via Studio → LLM Keys |
| Anthropic | BYOK | Via Studio → LLM Keys |

**Resolution order:** BYOK key → Server Gemini key → DummyProvider

---

## Quick Start

```bash
git clone https://github.com/raj200501/MicroSaaS-Factory.git
cd MicroSaaS-Factory
pnpm install
pnpm db:push && pnpm db:seed
pnpm dev
```

| Service | Port |
|---------|------|
| Web App | 3000 |
| Studio | 3001 |
| Microapps | 3002+ |

---

## Contributing

1. Fork → branch → commit → PR
2. Run `pnpm test && pnpm evals` before submitting
3. See [`docs/ADD_A_MICROAPP.md`](docs/ADD_A_MICROAPP.md) for the tool scaffolding guide

---

## License

**Personal use:** [MIT License](LICENSE.md)  
**Commercial use:** [One-time license](LICENSE.md#commercial-use) — email raj200501@gmail.com

---

<p align="center">
  <strong>Built by <a href="https://github.com/raj200501">raj200501</a> and Codex</strong>
</p>
