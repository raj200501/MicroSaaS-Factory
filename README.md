<p align="center">
  <strong>⚡ MicroSaaS Factory</strong>
</p>

<p align="center">
  An open-source platform to build, ship & monetize 30+ AI-powered microapps.<br/>
  <strong>Zero paid SaaS · BYOK LLM · Local SQLite · Ship in minutes</strong>
</p>



---

## ✨ What is this?

MicroSaaS Factory is a **production-ready monorepo** for building single-purpose AI tools. Each microapp is a focused Next.js app that uses shared packages for auth, database, LLM, and UI — so you never write boilerplate again.

**3 fully functional apps** are included, with **30 more stubs** ready to be built.

| App | Description | Status |
|-----|-------------|--------|
| 📝 Resume Builder | Impact-driven bullet generation with PDF export | ✅ Live |
| 📋 PRD → Jira | Convert PRDs to epics and tickets (CSV/MD export) | ✅ Live |
| 🎙️ Meeting Notes | Action items + follow-up email from transcripts | ✅ Live |
| + 30 more | Email Subject Lines, Blog Outlines, Code Explainer, SQL Builder... |

---

## 🚀 One-Command Setup

```bash
git clone https://github.com/raj200501/MicroSaaS-Factory.git
cd MicroSaaS-Factory
pnpm install
pnpm db:push && pnpm db:seed
pnpm dev
```

**That's it.** No API keys needed. No external services. The DummyProvider handles everything locally.

| Service | Port | Description |
|---------|------|-------------|
| Web App | 3000 | Landing, Showcase, Docs, Pricing |
| Studio | 3001 | Admin dashboard |
| Microapps | 3002+ | Individual AI tools |

---

## 🏗️ Architecture

```
MicroSaaS-Factory/
├── apps/
│   ├── web/              # Marketing site + showcase + docs
│   ├── studio/           # Admin dashboard  
│   ├── microapp-resume/  # Resume Builder
│   ├── microapp-prd2jira/# PRD to Jira
│   └── microapp-meeting/ # Meeting Notes
├── packages/
│   ├── auth/             # Cookie-based auth + Edge middleware
│   ├── db/               # Prisma + SQLite
│   ├── llm/              # AI abstraction (Dummy/OpenAI/Anthropic)
│   ├── ui/               # Shared components (shadcn-style)
│   └── ...               # core, content, config, email, analytics
├── docs/                 # Markdown documentation
└── scripts/              # CLI tools & generators
```

**Key design decisions:**
- **Server Actions** — no API routes for AI generation
- **Edge Middleware** — auth checks at the CDN layer
- **Monorepo** — Turborepo + pnpm workspaces
- **Local-first** — SQLite for everything, zero external DBs

---

## 🧠 LLM Providers

| Provider | Requires Key | Mode | Use Case |
|----------|-------------|------|----------|
| DummyProvider | No | Local | Dev, testing (SchemaFiller generates realistic output) |
| **Gemini** | Optional | Demo/BYOK | Set `GEMINI_API_KEY` env — auto-used for hosted demo |
| OpenAI | Yes (BYOK) | BYOK | Production with GPT-4 |
| Anthropic | Yes (BYOK) | BYOK | Production with Claude |

**Provider resolution order:** BYOK key → Server Gemini key (demo mode) → DummyProvider

```bash
# Optional: enable real AI in demo mode (never commit this!)
export GEMINI_API_KEY="your-key-here"
```

**Built-in abuse protection:** Per-IP rate limiting (20/day), global cap (200/day), response caching (7-day TTL), and math challenge bot guard — all using local SQLite.

Add keys in Studio → LLM Keys. The system auto-falls back to DummyProvider when no key is configured.

---

## 📦 What's Included

### Web App (`localhost:3000`)
- 🎨 Premium dark-mode landing page with glassmorphism design
- 🔍 Showcase with 33 microapp cards (filters, Live/Stub badges)
- 📄 Individual microapp detail pages with OG images
- 💰 Pricing page (Free / Commercial / Enterprise — no Stripe needed)
- 📚 Documentation site rendering markdown docs
- 🗺️ Roadmap showing what's live and what's next
- 📜 License page explaining dual-license model
- 🚀 Launch Kit page with pre-generated marketing content

### Studio (`localhost:3001`)
- 👥 Workspace management
- 🔑 LLM key configuration (BYOK)
- 📊 Execution logs with latency tracking
- 📧 Local email capture

### SEO & Social
- Dynamic `sitemap.xml` with all 33+ routes
- `robots.txt` configuration
- OpenGraph image generation (Edge, no external services)
- JSON-LD structured data per microapp

---

## 🎯 How It Can Make Money

This isn't just a demo — it's designed with real monetization paths:

| Path | Effort | Implementation |
|------|--------|---------------|
| **Commercial License** | Low | One-time $99 license for businesses (see `/pricing`) |
| **GitHub Sponsors** | Low | Recurring support from developers who use it |
| **Custom Builds** | Medium | Build bespoke microapps for clients (see `/hire`) |
| **SaaS Deployment** | High | Deploy as a hosted platform with usage-based pricing |

All monetization works with **zero payment infrastructure** — just email and GitHub Sponsors links.

---

## 🛠 Available Scripts

```bash
pnpm dev              # Start all apps in development
pnpm build            # Build all packages and apps
pnpm db:push          # Push Prisma schema to SQLite
pnpm db:seed          # Seed database with sample data
pnpm generate:launch-kit  # Generate marketing content (no LLM needed)
```

---

## 🚢 Deployment

### Vercel (Free Tier)
Each app can be deployed as a separate Vercel project pointing to its `apps/` subdirectory.

### Cloudflare Pages (Free Tier)
Export as static where possible, use Workers for server-side routes.

### Self-Hosted
Any Node.js 18+ host. Just `pnpm build && pnpm start`.

**Zero external services required.** SQLite file is the only state.

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

See [docs/ADD_A_MICROAPP.md](docs/ADD_A_MICROAPP.md) for microapp scaffolding guide.

---

## 📜 License

**Personal use:** [MIT License](LICENSE.md)  
**Commercial use:** [One-time license](LICENSE.md#commercial-use) — email raj200501@gmail.com

---

<p align="center">
  <strong>Built with ❤️ and ⚡ by <a href="https://github.com/raj200501">raj200501</a></strong>
</p>
