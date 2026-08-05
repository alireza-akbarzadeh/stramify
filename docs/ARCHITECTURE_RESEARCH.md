# Architecture Research (Phase 0)

> Research date: 2026-08-05. Sources cited inline. Re-verify version numbers
> before major upgrades — this is a snapshot, not a living doc.

## 1. Repository inspection

The working directory (`C:\Users\akbarzadeh.ali\Desktop\vue-app`) was empty
except for a `.idea` folder — no framework, no package.json, no existing
Claude config, not a git repo. Git has now been initialized. This is a
greenfield build.

## 2. Frontend framework

**Nuxt 4** became stable July 2025 and is the current major version; Nuxt 3
reaches end-of-life 2026-07-31. Nuxt 4.4 is current, running on **Vue 3.5+**
(stable). Vue 3.6 (Vapor mode, no virtual DOM for opted-in components) is
mid-rollout — real perf win, but new enough that ecosystem compatibility
(component libraries, devtools) is still catching up. Decision: build on
**Nuxt 4 + Vue 3.5**, revisit Vapor mode per-component later once the
ecosystem (UI kit, VueUse) confirms stability, not as a day-one default.

Nuxt gives us file-based routing, SSR/hybrid rendering, auto-imports, Nitro
server engine (unifies frontend + API in one deployable), and a module
ecosystem that directly covers several items in the "research" list (auth,
image optimization, content). This avoids standing up a separate backend
service for a v1 — see §4.

## 3. UI component system: Nuxt UI v4 vs shadcn-vue

Both sit on Tailwind CSS v4 + Reka UI (Radix-for-Vue) under the hood, so the
primitive quality is comparable. The difference is ownership model:

- **Nuxt UI v4**: installed dependency, 120+ components, built by the Nuxt
  core team, first-party Nuxt integration, free Figma kit and dashboard/
  template starters as of the v4 unification.
- **shadcn-vue**: code is copied into your repo, you own and edit every
  component file directly, zero bundle bloat, but you build your own
  templates/kit.

For a platform with a *lot* of custom, non-generic UI (live chat panel,
theater-mode player chrome, stream dashboards, moderation tools) that a
stock component library won't have out of the box, **owning the component
code (shadcn-vue) is the better fit** — we're not going to find a pre-built
"live chat with slow-mode + subscriber-only" component in any kit regardless
of vendor, so the "batteries included" advantage of Nuxt UI matters less
here, while shadcn-vue's full edit access matters more once we're deep into
custom player/chat/dashboard UI. Decision in [DECISIONS.md](./DECISIONS.md).

## 4. Backend: Nitro server routes vs dedicated API service

Nitro (Nuxt's server engine) supports API routes, middleware, scheduled
tasks, WebSocket handlers (via crossws), and deploys as one artifact. A
separate API service would only be justified by a different scaling profile,
a different language requirement, or a team boundary — none apply to a v1
built by one engineer/agent. **Decision: Nitro server routes as a modular
monolith**, organized by domain folder (`server/api/streams/`,
`server/api/videos/`, `server/api/chat/`, etc.) so a domain could be
extracted into its own service later without a rewrite, per the
"do not over-engineer, design for evolution" instruction.

## 5. Database & ORM: Drizzle vs Prisma

Prisma: schema-first, best-in-class DX for prototyping, mature migration
tooling, heavier query engine (adds cold-start latency, matters on
edge/serverless). Drizzle: code-first TypeScript, generates closer-to-raw
SQL, materially faster cold starts (~40ms vs ~200ms in reported benchmarks),
recently overtook Prisma in npm downloads, is Hono's and Astro DB's default.
Both are TypeScript-first and support Postgres well.

Since Nitro can deploy to edge/serverless targets and cold-start latency
matters for an API that also has to stay responsive under live-chat and
live-viewer load, and since we want SQL we can read and reason about for a
schema this complex (30+ tables), **decision: Drizzle ORM + drizzle-kit
migrations over Postgres**.

## 6. Streaming infrastructure: Cloudflare Stream vs Mux

| | Cloudflare Stream | Mux |
|---|---|---|
| Pricing | $5/1k min stored + $1/1k min delivered, no separate encoding/bandwidth fee | Delivery-metered, resolution-based, free tier to 100k min/mo, materially pricier at scale |
| Live ingest | RTMPS + **WHIP** (WebRTC, sub-second latency, beta) | RTMP(S), SRT |
| Playback | HLS, **WHEP** (sub-second), signed URLs | HLS, signed URLs, DRM |
| Analytics | Basic | Mux Data — much deeper (rebuffer ratio, QoE scoring) |
| Simulcast | No | Yes |
| DRM | Limited | Full |

Cloudflare Stream is materially cheaper, has a simpler pricing model (one
rate, no encoding/bandwidth surprises), and — notably — is the only one of
the two offering *both* WHIP ingest and WHEP playback out of the box, which
lines up directly with the prompt's WebRTC/WHIP/WHEP research requirement
and gives a real path to sub-second latency later. Mux wins on analytics
depth and DRM, which matter more for a monetization-heavy, premium-content
platform than for a v1 building the core product loop.

**Decision: Cloudflare Stream** for both VOD (upload → encode → HLS) and
live (RTMPS ingest for v1, WHIP as a fast-follow), on cost and WHIP/WHEP
fit. Revisit Mux if/when DRM or advanced analytics become a hard
requirement — the player/ingest abstraction should be written so swapping
providers later doesn't touch application code (see
[docs/video-streaming.md](./video-streaming.md) once written).

## 7. Realtime: chat & viewer counts

Nitro ships **crossws**, a first-party WebSocket layer that works across
Node/Bun/Cloudflare Workers/Deno runtimes without an extra service. For chat
fan-out across multiple server instances, a WebSocket server alone isn't
enough once we're not single-process — **Redis pub/sub** is the standard
fan-out layer paired with it. Decision: **Nitro WebSocket routes + Redis
pub/sub**, single-instance-safe now, horizontally-scalable-later without an
architecture change (only "publish to Redis instead of local broadcast" is
new work).

## 8. Auth: nuxt-auth-utils vs better-auth

`nuxt-auth-utils`: first-party Nuxt team module, sealed/encrypted cookie
sessions, 40+ OAuth providers, no database or JWT required for the session
itself. `better-auth`: framework-agnostic, database-backed sessions, richer
built-in feature set (2FA, organizations, rate limiting) but more moving
parts.

This platform needs role-based permissions (viewer/creator/moderator/admin)
that must be revocable server-side (e.g. an admin bans a user — that has to
take effect immediately, not wait for a signed cookie to expire), and needs
a `User` row anyway for profiles/channels. A pure signed-cookie session
can't be revoked without a blocklist, which is itself a database. **Decision:
better-auth**, database-backed sessions against the same Postgres instance,
username/password + OAuth providers, since revocable sessions and RBAC are
core requirements, not edge cases.

## 9. State management

- **Pinia**: only for genuinely global client state — auth/session, active
  theater-mode/PiP player state, unread notification counts. Not a cache for
  server data.
- **TanStack Query (Vue)**: server-state — video lists, channel data,
  comments, analytics — for caching, pagination/infinite-query, background
  refetch, and optimistic updates (likes, follows). This split avoids the
  classic Vuex-era anti-pattern of hand-rolling cache invalidation in a
  global store.

## 10. Validation, testing, tooling

- **Zod** for all input validation (form schemas + Nitro API request
  bodies), shared between client and server since both are TypeScript.
- **Vitest** for unit/composable/integration tests (fast, Vite-native, same
  config surface as Nuxt's build).
- **Playwright** for E2E — the prompt's flows (signup → browse → watch →
  chat → dashboard) are exactly what Playwright is for, with fixtures per
  flow rather than brittle CSS selectors (prefer `data-testid` / role
  queries).
- **ESLint (`@nuxt/eslint`) + Prettier** for lint/format, run in CI.

## 11. Storage, CDN, search, observability

- **Object storage**: Cloudflare R2 for anything Stream doesn't own
  (avatars, channel banners, thumbnails not auto-generated) — zero
  egress fee, S3-compatible API, so it's swappable later.
- **CDN**: Cloudflare's edge network, already in play via Stream/R2 — no
  separate CDN vendor to integrate for v1.
- **Search**: **Postgres full-text search** (`tsvector`/`tsquery` + trigram
  indexes for fuzzy channel/title search) to start, per the prompt's own
  "don't over-engineer" instruction — a dedicated search service
  (Meilisearch/Typesense) is a clean drop-in later once catalog size or
  query complexity justifies it, without changing the API contract.
- **Observability**: structured JSON logging (`pino`) + an error tracker
  (Sentry — has a first-class Nuxt SDK) + Nitro's built-in request metrics.
  No dedicated metrics stack (Prometheus/Grafana) until there's real traffic
  to justify it.

## 12. CI/CD & deployment

**GitHub Actions** for CI (lint, typecheck, unit, E2E on PR). Deployment
target: a Node-compatible host that supports Nitro's `node-server` preset
and long-lived WebSocket connections (rules out edge-only platforms unless
we split the WS route to a separate always-on process later) — evaluate at
Phase 3 against actual hosting needs once the WebSocket chat design is
final; not a blocking decision for scaffolding.

## 13. Claude Code skills/tools evaluated

- Built-in skills already available in this environment cover a meaningful
  slice of the prompt's ask: `dataviz` (creator analytics charts),
  `artifact-design`/`artifact-diagramming` (useful for design mockups/
  architecture diagrams, not for the shipped app itself), `security-review`,
  `run` (launching the dev server for verification). These are already
  installed and will be used as the relevant phases are reached.
- **`ui-ux-pro-max-skill` (nextlevelbuilder)**: real, actively maintained
  project — verified directly via the GitHub API (not marketing copy):
  MIT license, ~113k stars, ~12k forks, small npm package
  (`ui-ux-pro-max-cli`, 4 lightweight deps, no hidden Python dependency).
  Installing it means running a global npm package from a publisher we have
  no prior trust relationship with — flagged to the user as a
  security-relevant call rather than decided unilaterally. **User chose to
  install it.** Installed via `npm install -g ui-ux-pro-max-cli` →
  `uipro init --ai claude`, which populated `.claude/skills/` with
  `ui-ux-pro-max` plus a related family: `design-system`, `brand`, `design`,
  `ui-styling` (shadcn/ui + Tailwind — lines up directly with the
  shadcn-vue decision in §3/[ADR-002](./DECISIONS.md)), `banner-design`,
  `slides`, `claude-automation-recommender`. Includes a searchable database
  (67 styles, 161 color palettes, 57 font pairings, 25 chart types, 21
  stack-specific reasoning files including `vue.csv` and `nuxt-ui.csv`).
  These will be used in Phase 2 (Design System) — see
  [ADR-009](./DECISIONS.md#adr-009-install-the-third-party-ui-ux-pro-max-skill-cli-supersedes-earlier-draft).

## 14. Summary of stack

| Layer | Choice |
|---|---|
| Framework | Nuxt 4 + Vue 3.5 + TypeScript |
| UI | Tailwind CSS v4 + shadcn-vue (Reka UI primitives) |
| Client state | Pinia (auth/session/player UI only) |
| Server state | TanStack Query (Vue) |
| Validation | Zod (shared client/server) |
| Backend | Nitro server routes, modular-monolith folder structure |
| Database | PostgreSQL |
| ORM | Drizzle ORM + drizzle-kit |
| Auth | better-auth (DB-backed sessions, RBAC) |
| Realtime | Nitro WebSocket routes (crossws) + Redis pub/sub |
| Video (VOD + live) | Cloudflare Stream (RTMPS now, WHIP fast-follow) |
| Object storage | Cloudflare R2 |
| Search | Postgres full-text (tsvector) + pg_trgm |
| Observability | pino structured logs + Sentry + Nitro metrics |
| Testing | Vitest + Playwright |
| CI | GitHub Actions |
| Deployment | Node-compatible host w/ WebSocket support (finalize at Phase 3) |

Full rationale and rejected alternatives: [DECISIONS.md](./DECISIONS.md).
