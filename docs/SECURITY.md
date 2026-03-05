# Security Baselines

1. **Environment Variables**: Use the `@microsaas/core/env` Zod validation to ensure secrets exist at runtime. Never commit `.env` files.
2. **Bring Your Own Key (BYOK)**: User LLM keys are passed through the Next.js API routes without being exposed to the client. In a production scenario, ensure these keys are encrypted at rest using a library like `server-only` and `crypto`.
3. **Session Management**: Magic links provide stateless secure sessions. JWTs are signed using `jose` with `HS256`. Use a strong `JWT_SECRET`.
4. **Prisma Output**: Make sure not to expose Prisma DB responses directly to the frontend; filter out sensitive fields (like API keys or session tokens) on the server side.
