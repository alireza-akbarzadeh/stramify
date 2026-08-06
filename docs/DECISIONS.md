# Architecture Decision Record

Format: one entry per decision — context, decision, alternatives rejected
(and why), consequences. New decisions get appended, never rewritten in
place; if a decision is reversed, add a new entry that supersedes it.

---

## ADR-001: Nuxt 4 + Vue 3.5 as the application framework

**Context**: Greenfield project, needs SSR for SEO on discovery/channel
pages, file routing, and a unified frontend+API deployable for a modular
monolith.

**Decision**: Nuxt 4 (current stable), Vue 3.5 (stable). Vue 3.6 Vapor mode
considered and deferred.

**Rejected**: Plain Vite+Vue SPA (loses SSR, would need a separate router
and API layer built by hand). Next.js/React (prompt explicitly specifies
Vue ecosystem). Vue 3.6 Vapor as the default (too new — component library
and devtools compatibility not yet proven across the stack we're adopting).

**Consequences**: Get SSR, file routing, Nitro server engine, and
auto-imports for free; tied to Nuxt's upgrade cadence (Nuxt 3 EOL 2026-07-31
is not our concern since we start on 4).

---

## ADR-002: shadcn-vue over Nuxt UI for the component layer

**Context**: The product has a lot of bespoke UI (live chat panel, theater
mode, stream dashboards, moderation tools) that no off-the-shelf kit ships
pre-built, regardless of vendor.

**Decision**: shadcn-vue (Reka UI primitives + Tailwind, code copied into
the repo and owned directly).

**Rejected**: Nuxt UI v4 — excellent first-party integration and 120+
components, but the "batteries included" value matters less when most of
the UI is custom anyway, and owning the component source (shadcn-vue's
model) makes it easier for both us and an AI agent to modify component
internals precisely (animation timing, focus behavior, DOM structure) rather
than fighting a library's abstraction layer.

**Consequences**: More setup work per component (copy-in rather than
`npm install`), but full control; no external breaking-change risk from a
UI-kit major version bump.

---

## ADR-003: Nitro server routes as a modular monolith (no separate API service)

**Context**: Prompt requires investigating dedicated API service vs Nitro
routes vs hybrid, and explicitly warns against premature microservices.

**Decision**: Nitro server routes under `server/api/<domain>/`, one
deployable artifact.

**Rejected**: Separate API service — no justification exists yet (no
polyglot requirement, no independent scaling need, one-person/agent team).

**Consequences**: Simpler deployment and local dev; domain folders are
structured so a domain (e.g. chat, video processing) could be extracted into
its own service later if load profiles diverge, without an app rewrite.

---

## ADR-004: Drizzle ORM over Prisma

**Context**: ~30-table schema, need for cold-start-friendly queries if we
ever deploy edge/serverless, and a team that wants SQL it can read directly.

**Decision**: Drizzle ORM + drizzle-kit migrations, PostgreSQL.

**Rejected**: Prisma — faster to sketch a schema initially and has more
mature tooling for very early prototyping, but its query engine adds
meaningful cold-start latency and it abstracts SQL more heavily, which
matters more as the schema and query complexity grow. Drizzle's code-first,
close-to-SQL approach was judged better for a schema this size that will be
maintained largely by an AI agent working directly in SQL-shaped code.

**Consequences**: More explicit schema code (no single Prisma schema file),
migrations generated and reviewed via drizzle-kit.

---

## ADR-005: Cloudflare Stream over Mux for video infrastructure

**Context**: Need managed live + VOD infrastructure; must not build custom
transcoding.

**Decision**: Cloudflare Stream for both VOD and live (RTMPS ingest at
launch, WHIP/WHEP as a fast-follow for sub-second latency).

**Rejected**: Mux — deeper analytics (Mux Data) and full DRM support, both
genuinely better than Cloudflare's offering, but at materially higher cost
at scale and without Cloudflare's native WHIP+WHEP pairing. Self-hosted
transcoding (ffmpeg/OME) — explicitly ruled out by the prompt's
"do not build custom transcoding infrastructure" instruction; would also
consume the majority of the project's engineering effort on infra rather
than product.

**Consequences**: Video provider details (upload API, playback IDs, signed
URLs) get an abstraction layer in `server/services/video/` so the provider
can be swapped for Mux later if DRM/analytics needs grow, without touching
route handlers or components.

---

## ADR-006: Nitro WebSockets + Redis pub/sub for realtime (chat, viewer counts)

**Context**: Live chat and notifications need realtime delivery; must scale
beyond a single server process eventually.

**Decision**: Nitro's built-in WebSocket routes (crossws) for the transport,
Redis pub/sub for cross-instance fan-out.

**Rejected**: A separate managed realtime service (Pusher/Ably/PartyKit) —
adds a recurring cost and a second realtime system to reason about, when
Nitro already ships WebSocket support natively. SSE — one-directional, chat
needs bidirectional (client sends messages, server broadcasts), so
WebSockets are the correct primitive, not SSE.

**Consequences**: Redis becomes a required piece of infrastructure (also
used for rate limiting and session/cache needs), but the WS layer itself
needs no separate hosting.

---

## ADR-007: better-auth over nuxt-auth-utils

**Context**: Platform needs RBAC (viewer/creator/moderator/admin) with
server-revocable sessions (e.g., a ban must take effect immediately).

**Decision**: better-auth with database-backed sessions against the primary
Postgres instance.

**Rejected**: nuxt-auth-utils — simpler, first-party, cookie-only sessions
with no external dependency, genuinely the better choice for a project that
doesn't need revocable sessions or complex roles. This project does: an
admin banning a user or revoking creator status must take effect without
waiting for a signed cookie to expire, which requires a server-side session
record — nuxt-auth-utils' sealed-cookie model doesn't provide that without
bolting on the same database-backed revocation list better-auth already
gives natively.

**Consequences**: One more service dependency (auth reads/writes the same
Postgres DB — no new infra), but correct RBAC/revocation semantics from day
one.

---

## ADR-008: Postgres full-text search before a dedicated search service

**Context**: Prompt explicitly instructs starting with Postgres search and
introducing dedicated search infra only when justified.

**Decision**: `tsvector`/`tsquery` generated columns + `pg_trgm` for fuzzy
matching on video titles, descriptions, tags, channel names.

**Rejected**: Meilisearch/Typesense/Elasticsearch at launch — real
typo-tolerance and relevance-ranking advantages, but no catalog exists yet
to search; standing up a second data store before there's data or query-
volume pressure is the over-engineering the prompt warns against.

**Consequences**: API contract for search (`/api/search?q=`) is written so
the implementation behind it can be swapped for a dedicated engine later
without changing callers.

---

## ADR-009: Install the third-party `ui-ux-pro-max-skill` CLI (supersedes earlier draft)

**Context**: The master prompt explicitly requires investigating and using
`ui-ux-pro-max-skill` (nextlevelbuilder), including installing it if not
present. Research (via the GitHub API directly, not marketing copy) confirmed
it's a real, actively maintained project: MIT license, ~113k GitHub stars,
~12k forks, published npm package `ui-ux-pro-max-cli` (small, 4 runtime
deps — `chalk`/`commander`/`ora`/`prompts`, no undisclosed Python
dependency despite some third-party summaries claiming otherwise) — not a
scam link — offering a searchable local database (styles, palettes, font
pairings, UX guidelines, per-stack reasoning including dedicated `vue.csv`
and `nuxt-ui.csv` files) for AI coding agents.

An earlier draft of this ADR recommended skipping the install as an
unnecessary supply-chain exposure and flagged the call to the user. The
user was asked directly (installing untrusted third-party code — global
npm package or Claude plugin marketplace — is a security-relevant action
that shouldn't be decided unilaterally) and chose to proceed with the CLI
install.

**Decision**: Installed via `npm install -g ui-ux-pro-max-cli` then
`uipro init --ai claude` in the project root. This populated
`.claude/skills/` with `ui-ux-pro-max` plus a related family of design
skills (`design-system`, `brand`, `design`, `ui-styling`, `banner-design`,
`slides`, `claude-automation-recommender`). These will be used during
Phase 2 (Design System) and ongoing UI work.

**Rejected**: Installing via the Claude plugin marketplace path
(`/plugin marketplace add ...`) — the CLI path grants less ambient trust
(a global npm package vs. a marketplace-registered plugin with broader
tool-access conventions) for the same end result. Skipping the tool
entirely — rejected once the trust concern was resolved by explicit user
sign-off; the prompt itself instructs using this tool, and its curated
per-stack (Vue/Nuxt UI) reference data has real value for Phase 2.

**Consequences**: Design system work in Phase 2 should actually invoke the
`ui-ux-pro-max` skill (and the sibling `design-system`/`ui-styling` skills)
rather than reinventing palette/type-pairing research by hand, since the
whole point of installing it was to use it.

---

## ADR-010: Modular monolith, no premature service split

**Context**: Prompt explicitly warns against 30 microservices, Kubernetes,
Kafka, event sourcing, GraphQL, multiple databases.

**Decision**: One Nuxt/Nitro app, one Postgres database, one Redis instance.
Domain-oriented folder structure (`server/api/streams`,
`server/api/videos`, `server/api/chat`, `server/api/social`,
`server/api/admin`) so boundaries exist in code even though deployment is
unified.

**Rejected**: Any of the above technologies at launch — no current
requirement justifies the operational complexity they'd add.

**Consequences**: Revisit only when a concrete scaling bottleneck appears
(e.g., chat fan-out volume actually saturates a single Redis instance).

---

## ADR-011: motion-v for section/UI animation

**Context**: PROMPT.md §8 calls for "subtle motion" and "premium
micro-interactions" as part of the UI direction; the user asked directly for
a Framer-Motion-equivalent for reusable section animations (fade/slide-in on
scroll, staggered lists) rather than hand-rolled CSS transitions for
anything beyond simple hover/focus states.

**Decision**: `motion-v` — the official Vue port of Motion (the same team
and API as Framer Motion for React: `<motion.div>` components, `while-in-view`
props, `AnimatePresence`), wrapped into reusable components under
`app/components/motion/` (e.g. a `Reveal` wrapper) rather than using its
primitives ad hoc inline in every page.

**Rejected**: `@vueuse/motion` (`v-motion` directive) — also solid and
already in the same ecosystem as VueUse (already a dependency), but a
directive-based API is a worse fit for building named, reusable animation
*components* as the user asked for, and its preset/variant model is less
directly transferable from Framer Motion knowledge. Hand-rolled CSS
`@keyframes`/transitions — sufficient for simple hover/focus states
(already used throughout `AppHeader`/`AppFooter`) but not for scroll-triggered
reveals or staggered children without reimplementing an intersection-observer
layer by hand. GSAP — more powerful for complex timeline choreography, but
heavier and overkill for section-level reveals; revisit only if a specific
page (e.g. a marketing-heavy landing redesign) needs real timeline
choreography.

**Consequences**: One more runtime dependency. `motion-v` does not disable
animation for `prefers-reduced-motion` on its own, so the shared `Reveal`
wrapper (`app/components/motion/Reveal.vue`) checks it explicitly via
VueUse's `usePreferredReducedMotion` and skips the transition, per the
accessibility requirement in PROMPT.md §17 — any future animation component
must do the same rather than assuming the library handles it.

---

## ADR-012: Vidstack for clip playback; clips table replaces discovery fixtures

**Context**: The discovery feed (Phase 5) shipped with `/api/discovery/clips`
serving static fixture data and a player modal that only showed a static
thumbnail with a fake play icon — no actual video ever played, which
violates the "no fake functionality" rule in CLAUDE.md once a feature is
presented as usable rather than as a scaffolding placeholder. The user asked
to connect clips to a real API and wire up a genuine, free, full-featured
player, ahead of Cloudflare Stream (ADR-005) actually being configured
(`CLOUDFLARE_STREAM_API_TOKEN` is still unset in `.env`).

**Decision**: Two changes, scoped to clips only (live signals/streaming stay
on fixtures — that's Phase 7, unchanged):
1. Added a real `clips` table (`server/db/schema/clips.ts`, Drizzle +
   Postgres — same DB already used for auth) with a `videoUrl` column
   holding a directly playable source (mp4 or HLS). `/api/discovery/clips`
   (`server/api/discovery/clips.get.ts`) now queries it instead of
   importing fixture objects. `scripts/seed-clips.mjs` seeds it with
   curl-verified, freely-licensed public test videos (W3C's `media.w3.org`
   assets, MDN's CC0 video set, Mux's public HLS test streams) — real,
   playable content, clearly sourced as seed data rather than hand-waved
   fixtures, matching the pattern of swapping in Cloudflare Stream playback
   URLs later without changing the column shape or the API contract.
2. Installed `vidstack` (`vidstack@1.15.6`, MIT licensed, npm `next` tag —
   the `latest` tag is a stale 0.x beta and must not be reinstalled) as the
   player. Wired via `app/plugins/vidstack.client.ts` (side-effect element
   registration, client-only since it defines real custom elements),
   `nuxt.config.ts`'s `vue.compilerOptions.isCustomElement` (so Vue's
   compiler leaves `media-*` tags as native DOM elements), and its default
   theme CSS. `ClipPlayerModal.vue` renders `<media-player>` +
   `<media-provider>` + `<media-video-layout>` when `item.videoUrl` is set;
   falls back to the old static-thumbnail treatment for live items (which
   still have no playable source, Phase 7).

**Rejected**: `vue-plyr`/Plyr — solid and simpler, but no native HLS/DASH
handling or built-in quality menu; would need hls.js wired up by hand
either way. Video.js — mature but jQuery-era API and heavier default
bundle for a Vue app. Hand-rolled `<video>` — fine for a single mp4 but
doesn't scale to HLS adaptive streaming, which Cloudflare Stream delivers,
so it'd need replacing later anyway. Google's `gtv-videos-bucket` sample
set (the most commonly copy-pasted "free test video" source in tutorials)
was tried first for seed data and rejected — it now 403s on every file
(verified via `curl -I`), so don't reintroduce it without re-checking live.

**Consequences**: `npm run db:seed` must be re-run after
`npm run db:migrate` on any fresh database (documented in
`scripts/seed-clips.mjs`'s header comment). When Cloudflare Stream
credentials land (ADR-005, Phase 7), swap `videoUrl` values for Stream
HLS manifest URLs — no schema or component change needed, since the
player already treats its source as an opaque playable URL. A
`shared/types/vidstack.d.ts` ambient import (`import 'vidstack/vue'`) is
required for `media-player`/`media-provider`/`media-video-layout` to
type-check in `.vue` templates — vidstack ships this augmentation itself,
it just isn't picked up automatically without an import somewhere in the
TS program.
