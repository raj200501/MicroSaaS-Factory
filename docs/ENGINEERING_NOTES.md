# Engineering Notes

> Design decisions and tradeoffs in MicroSaaS Factory.  
> Written for engineers who want to understand _why_, not just _what_.

## Why Deterministic Dummy Mode Exists

Every tool works without API keys. The `DummyProvider` generates realistic, seed-deterministic output using handcrafted templates. This matters because:

1. **Reproducibility** — Evals produce identical results on every run, making regressions detectable.
2. **Zero-friction onboarding** — `clone → install → run` with no signup or billing.
3. **CI/CD compatibility** — Tests and evals run in CI without secrets.
4. **Demo credibility** — Output looks realistic, not like "lorem ipsum".

The `SchemaFiller` in `packages/llm` uses MD5-seeded deterministic selection from word banks, so the same prompt always produces the same output.

## Why Schema-Validated Outputs Matter

LLM output is inherently unreliable. We treat it as untrusted input:

- **Structured generation** via `generateObject()` + Zod schemas enforces shape at the SDK level.
- **Dummy mode** uses `fillSchema()` which walks the Zod AST to produce valid instances.
- **Eval harness** checks 6 output properties on every run (see `packages/evals/src/harness.ts`).

This means regressions in output shape are caught by automated evals, not user reports.

## How Evals Protect Against Regressions

The eval system (`packages/evals/`) is intentionally simple:

- **12 benchmark cases** across 10 tools, stored as JSONL.
- **6 deterministic checks** per case: schema validity, non-empty output, min lines, max length, input reference, no error.
- **CI integration** — `pnpm evals` exits with code 1 on any failure.
- **Reproducible reports** — JSON + Markdown artifacts in `packages/evals/reports/`.

No LLM-based grading. No flaky tests. Every check is a boolean with a clear pass/fail boundary.

## How Traces Improve Debuggability

Every tool run creates a `MicroappRun` record with:

| Field | Purpose |
|-------|---------|
| `inputJson` | What the user submitted |
| `outputJson` | What the model returned |
| `provider` | Which LLM was used (dummy/gemini/openai/anthropic) |
| `latencyMs` | Wall-clock generation time |
| `status` | success or error |
| `errorMessage` | Classified error if failed |

The `/traces` page reconstructs a timeline from this data, showing each step as a discrete event. This is the minimum viable observability for an agentic system.

## Why Local-First Matters for Reproducibility

- **SQLite** — Single file, no server process, `cp dev.db backup.db` is a full backup.
- **No external services** — No Redis, no Postgres, no S3. The system's behavior is fully determined by its code + database file.
- **Environment parity** — Dev, CI, and production all use the same database engine.

The tradeoff is concurrency (SQLite locks at the file level), which is acceptable for a microapp platform where each run is independent.

## Provider Resolution Strategy

```
1. Check for BYOK key (user's own API key) → use it
2. Check for server-side GEMINI_API_KEY → use as shared demo key
3. Fall back to DummyProvider → always works, deterministic output
```

This three-tier strategy means:
- **Zero-config works** (tier 3)
- **Demo deployments work** with one env var (tier 2)
- **Power users get real LLM output** with their own key (tier 1)

## Rate Limiting Architecture

Rate limiting uses SQLite (table `ApiUsage`), not Redis:

- **Per-IP** (hashed with salt): 20 requests/day
- **Global**: 200 requests/day
- **Response caching**: 7-day TTL by input hash

IP hashing uses SHA-256 with a configurable salt (`DEMO_IP_SALT`), so raw IPs are never stored. The cache key is a SHA-256 of `provider|model|system|prompt|schemaFingerprint`.

## Error Taxonomy

Errors are classified into 6 categories, visible in the trace viewer:

| Category | Cause | User-Facing |
|----------|-------|-------------|
| `input_validation_error` | Missing required field | "Please fill in: [field]" |
| `workspace_resolution_error` | No workspace found | Falls back to default workspace |
| `provider_unavailable` | API key invalid/missing | Falls back to DummyProvider |
| `provider_timeout` | LLM didn't respond | "Generation timed out" |
| `output_schema_mismatch` | LLM returned bad shape | Caught by Zod validation |
| `rate_limit_exceeded` | Too many requests | "Rate limit exceeded" |

Errors never crash the UI. They render as red-bordered cards with the classification visible.

## What This Repo Is Not

- **Not a production SaaS** — It's a portfolio piece demonstrating engineering depth.
- **Not using real user data** — All data is local SQLite, seeded or user-generated.
- **Not "AI-native" in the agent sense** — Each tool is a single LLM call, not a multi-step agent. The trace/eval infrastructure is what would scale to agentic workflows.
