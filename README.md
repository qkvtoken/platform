# QKV Engineering Monorepo

The single home for everything we build at QKV: client demos, internal tools,
reference solutions, and shared examples. New work lives in this repo unless
there is a strong reason it shouldn't.

> **Status:** foundation only. No production deploy infra, no auth provider
> picked yet, no client-facing AI features built yet — those land per-project.

## Layout

```
.
├── apps/
│   └── starter/             # Next.js + Tailwind starter — clone for client demos
├── examples/
│   └── prompt-caching/      # Anthropic prompt caching demo (CLI script)
├── db/
│   └── init/                # SQL run on first Postgres container start (enables pgvector)
├── docker-compose.yml       # Postgres + pgvector for local dev
├── package.json             # Root scripts (dev, lint, typecheck, db:up, …)
├── pnpm-workspace.yaml      # pnpm workspace config
└── tsconfig.base.json       # TS settings every package extends
```

Workspaces are wired up via `pnpm-workspace.yaml`: anything under `apps/*` or
`examples/*` is a workspace package and is reachable via `pnpm --filter <name>`.

## Quick start

Requirements: **Node 20+**, **pnpm 9+**, and **Docker** (only needed if you
want the local Postgres).

```bash
# 1. Install deps
pnpm install

# 2. Copy env template and add your Anthropic key
cp .env.example apps/starter/.env.local
# edit apps/starter/.env.local → ANTHROPIC_API_KEY=sk-ant-...

# 3. (Optional) start Postgres + pgvector for local dev
pnpm db:up

# 4. Run the starter app
pnpm dev
# → http://localhost:3000
```

Type `"In one sentence, what is pgvector?"` into the box, hit **Ask Claude**,
and you should see a reply. That confirms the Anthropic SDK is wired up
end-to-end.

### Run the prompt-caching demo

```bash
ANTHROPIC_API_KEY=sk-ant-... pnpm example:caching
```

You'll see two calls printed back-to-back. The first reports
`cache_creation_input_tokens > 0` (cache miss, written) and the second reports
`cache_read_input_tokens > 0` (cache hit, ~10% the input cost). That's prompt
caching working.

See [`examples/prompt-caching/src/index.ts`](examples/prompt-caching/src/index.ts)
for the implementation. The same pattern (large stable system prompt with
`cache_control: { type: "ephemeral" }`) is used in the starter at
[`apps/starter/app/api/chat/route.ts`](apps/starter/app/api/chat/route.ts).

### Postgres + pgvector

`pnpm db:up` starts a `pgvector/pgvector:pg16` container with `pgvector`
preinstalled. The init script in `db/init/` runs `CREATE EXTENSION vector`
the first time the container starts.

Default connection string (also in `.env.example`):

```
postgresql://qkv:qkv@localhost:5432/qkv
```

Stop with `pnpm db:down`. Data lives in `./.postgres-data/` (gitignored).

## Scaffolding a new client demo

Each demo is a copy of `apps/starter` with a new name. Until we have a paying
client, this is intentionally a copy-paste — no scaffolder, no template engine.

```bash
# 1. Copy the starter
cp -r apps/starter apps/<client-shortname>

# 2. Update the package name so pnpm filters work
#    apps/<client-shortname>/package.json:
#      "name": "<client-shortname>"

# 3. Install (picks up the new workspace)
pnpm install

# 4. Run just that app
pnpm --filter <client-shortname> dev
```

Anything that should be reused across demos — a shared UI component, an agent
helper, a vector-store wrapper — gets promoted to a `packages/<name>` workspace
once it shows up in two demos. Don't extract on the first use.

## Stack defaults

These are the defaults for any new app in this repo. Document any deviation in
the project README and explain the trade-off.

| Concern         | Default                                              | When to deviate                                              |
| --------------- | ---------------------------------------------------- | ------------------------------------------------------------ |
| Language        | TypeScript                                           | Python only when the AI/ML library forces it.                |
| Frontend        | Next.js (App Router) + Tailwind                      | Client mandates an existing framework.                       |
| LLM             | Anthropic Claude (`claude-sonnet-4-6` default)       | Client requirement or measured cost case for another model.  |
| Vector / RAG    | Postgres + `pgvector`                                | Documented scale or feature need a dedicated vector DB.      |
| Auth            | Clerk or Auth.js (decide per project)                | This repo: placeholder only — picked at first paying client. |
| Hosting         | Vercel for prototypes                                | Client infra constraints.                                    |

## CI

`.github/workflows/ci.yml` runs **typecheck + lint** on every push and PR to
`main`. Tests are intentionally skipped until we have meaningful ones — adding
trivial passing tests just to fill a CI step adds drag without catching bugs.

Run the same checks locally before pushing:

```bash
pnpm typecheck
pnpm lint
```

## Conventions

- **One reason per commit.** Logical commits as you go; never bypass hooks or
  signing without an explicit, documented reason.
- **No secrets in the repo.** `.env.local` is gitignored; `.env.example`
  documents the keys we expect.
- **Comment the WHY, not the WHAT.** Names already say what; comments are for
  the constraint or invariant a reader couldn't infer.
- **Client work prioritizes legibility for handoff;** internal work prioritizes
  taste and reusability. The same monorepo holds both — keep them in different
  apps.

## Next steps (post-foundation)

- Wire a real auth provider when the first paying client lands.
- Pick deploy infra (Vercel preview deployments are likely default).
- Promote the first piece of duplicated demo code into `packages/`.
