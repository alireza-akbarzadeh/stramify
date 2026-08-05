# Architecture

Phase 1 deliverable per [PROMPT.md](./PROMPT.md) §19. Builds directly on the
stack choices already made and justified in [DECISIONS.md](./DECISIONS.md)
(ADR-001 through ADR-010) — this document does not re-argue those choices,
it describes how they fit together as a system. See
[ARCHITECTURE_RESEARCH.md](./ARCHITECTURE_RESEARCH.md) for the Phase 0
comparison research behind each decision.

## 1. System overview

Streamify is a single deployable: one Nuxt 4 application whose Nitro server
engine serves both the SSR frontend and the JSON API, backed by one
PostgreSQL database, one Redis instance, and two managed external services
(Cloudflare Stream for video, Cloudflare R2 for object storage). No
microservices, no message queue, no separate API service (ADR-003, ADR-010).

```
                        ┌─────────────────────────────┐
                        │        Cloudflare edge        │
                        │  Stream (video)  ·  R2 (objects) │
                        └───────────────▲───────────────┘
                                        │ signed URLs / RTMPS / HLS
┌──────────┐   HTTPS    ┌───────────────┴───────────────┐
│  Browser │───────────▶│         Nuxt 4 / Nitro          │
│ (Vue 3)  │◀───────────│  SSR pages · /api/* · /ws/*     │
└──────────┘  WebSocket └───────────────┬───────────────┘
                                        │
                        ┌───────────────┼───────────────┐
                        ▼                               ▼
                ┌──────────────┐               ┌────────────────┐
                │  PostgreSQL   │               │      Redis      │
                │ (Drizzle ORM) │               │ pub/sub · cache │
                └──────────────┘               └────────────────┘
```

One Node process handles SSR rendering, REST API routes, and WebSocket
connections. It scales horizontally behind a load balancer; anything that
needs to be shared across instances (chat fan-out, rate-limit counters,
cached query results) lives in Redis rather than in-process memory.

## 2. Frontend architecture

- **Rendering**: Nuxt 4 SSR for all discovery/channel/watch pages (SEO,
  fast first paint on a video-heavy product). Client-side navigation after
  hydration via Vue Router (file-based, `app/pages/`).
- **Component layer**: shadcn-vue (ADR-002) — components are generated into
  `app/components/ui/` and owned directly, not installed as a dependency.
  Product-specific composites (`VideoCard`, `LiveChatPanel`, `StreamPlayer`)
  live in `app/components/` outside the `ui/` primitives folder.
- **State**:
  - Pinia (`app/stores/`) for genuinely global client state only: active
    session/user, theater-mode/PiP UI state, unread notification count.
  - TanStack Query (`app/composables/queries/`) for all server-derived
    data — video lists, channel info, comments, analytics — giving caching,
    pagination, background refetch, and optimistic updates (likes, follows)
    for free instead of hand-rolled invalidation logic.
- **Validation**: Zod schemas shared between client forms and server route
  handlers, defined once per domain (e.g. `shared/schemas/video.ts`) and
  imported on both sides so client and server never validate differently.
- **Styling**: Tailwind CSS v4 driven by CSS custom properties generated
  from the design system (`app/assets/css/main.css`), per
  [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md).

## 3. Backend architecture

Nitro server routes under `server/api/<domain>/`, one route file per
resource/verb, mirroring the domain boundaries from ADR-010:

```
server/
  api/
    streams/        # stream lifecycle, ingest metadata, live state
    videos/          # VOD CRUD, upload orchestration, processing status
    chat/            # message send/history, moderation actions
    social/          # follows, subscriptions, likes, comments, playlists
    admin/           # moderation queue, reports, feature flags, audit log
  db/
    schema/           # Drizzle table definitions, one file per bounded area
    client.ts         # Drizzle client singleton
    migrations/        # drizzle-kit generated SQL
  services/
    video/             # Cloudflare Stream provider abstraction (ADR-005)
  utils/
    auth.ts            # better-auth server instance
    logger.ts           # pino logger
    redis.ts             # Redis client singleton
  routes/
    ws/                 # crossws WebSocket handlers (chat, viewer counts)
```

Each domain folder is deliberately self-contained (its own DB queries, its
own validation) so it could be lifted into a separate service later if a
concrete scaling bottleneck appears — but today it's one process, one
deployable, per ADR-010. Cross-domain calls go through function imports, not
internal HTTP.

## 4. Database architecture

PostgreSQL via Drizzle ORM (ADR-004). Schema is normalized; not every model
in PROMPT.md §13's list is built up front — tables are added when the phase
that needs them is reached (per CLAUDE.md rule 8, "don't build ahead of the
phase"). Phase 3 ships only what auth requires (`user`, `session`,
`account`, `verification` — better-auth's core tables). The full model
below is the target shape for later phases, recorded here so schema
decisions are made once, coherently, rather than piecemeal per phase.

| Entity | Phase introduced | Notes |
|---|---|---|
| `user`, `session`, `account`, `verification` | 3 (Foundation) | better-auth core tables (ADR-007) |
| `profile`, `channel` | 4 (App Shell) / 9 (Creator) | 1:1 with `user`; `channel` created on creator onboarding |
| `category`, `tag`, `video_tag` | 5 (Discovery) | tag is many-to-many via join table |
| `video`, `video_view`, `watch_history` | 6 (Video) | `video_view` is append-only for analytics, not a live counter |
| `live_stream`, `stream_session` | 7 (Live) | `live_stream` = channel's persistent config, `stream_session` = one broadcast instance |
| `live_chat_message`, `chat_ban`, `chat_moderator` | 8 (Chat) | messages partitioned/pruned per retention policy, not kept forever |
| `follow`, `subscription`, `subscription_plan`, `payment` | 9/10 | `payment` deferred until monetization is actually scoped |
| `comment`, `video_like`, `playlist`, `playlist_item`, `notification`, `clip` | 10 (Social) | |
| `report`, `moderation_action`, `audit_log`, `feature_flag` | 11 (Admin) | |
| `creator_analytics` | 9 (Creator) | materialized/aggregated, not computed from raw events on every dashboard load |

Cross-cutting rules for every table added, regardless of phase:

- Primary keys: UUID (`gen_random_uuid()`), not sequential integers —
  avoids enumeration and matches better-auth's default ID shape.
- Every table gets `created_at`/`updated_at` timestamptz columns.
- Foreign keys are explicit with `ON DELETE` behavior chosen per relation
  (e.g. `video.channel_id` cascades on channel delete; `comment.author_id`
  sets null so comments outlive a deleted account, matching most platforms'
  moderation expectations).
- Soft deletion (`deleted_at`) only where "undo" or audit trail matters
  (videos, comments, accounts) — not on high-volume append-only tables
  (`video_view`, `live_chat_message`), which get retention-based pruning
  instead.
- Indexes: FK columns, any column used in a `WHERE`/`ORDER BY` on a
  list/feed endpoint (e.g. `video.channel_id`, `video.published_at`), and
  a composite index for cursor pagination (`(published_at, id)`).
- Pagination: cursor-based (keyset) on all list endpoints expected to grow
  large (videos, chat history, notifications) — offset pagination only for
  small, bounded lists (a channel's category tags).
- Search: generated `tsvector` columns on `video.title`/`description` and
  `channel.name`, plus `pg_trgm` GIN indexes for fuzzy matching (ADR-008),
  behind a stable `/api/search` contract so the implementation can be
  swapped for a dedicated search engine later without touching callers.

## 5. Streaming architecture (video)

Cloudflare Stream owns encoding, storage, and delivery for both VOD and
live (ADR-005); the app never touches raw video bytes or runs ffmpeg.
`server/services/video/` is the only place that calls the Cloudflare Stream
API, so a future provider swap (e.g. to Mux, if DRM becomes a hard
requirement) touches one module, not route handlers or components.

**VOD upload flow**: creator requests an upload → `server/api/videos` calls
Cloudflare's direct-creator-upload API → client uploads directly to
Cloudflare (never through our server, avoiding a large-file bottleneck) →
Cloudflare webhook notifies `server/api/videos/webhook` on encode
completion → `video.status` transitions `processing → ready`, playback ID
and thumbnail URL stored.

**Live flow**: creator starts a stream → `server/api/streams` provisions a
Cloudflare live input, returns an RTMPS ingest URL + **stream key** (never
sent to the browser after initial display — ADR/PROMPT §14 — creators copy
it once into OBS/streaming software) → Cloudflare emits webhook events
(`live_input.connected` / `.disconnected`) → `stream_session` row tracks
`live`/`ended` state → viewers play back the auto-generated HLS manifest via
a signed playback URL. WHIP/WHEP (sub-second latency ingest/playback) is a
documented fast-follow (ADR-005), not required for v1 — RTMPS ingest + HLS
playback is the launch path.

**Viewer count**: not derived from Cloudflare analytics (too coarse/lagged
for a "live" number). Tracked via WebSocket connection count per
`stream_session`, aggregated across server instances through Redis (a
connect/disconnect increments/decrements a Redis counter keyed by stream
ID; periodic snapshot broadcast to viewers, not per-event, to avoid
thundering-herd re-renders on popular streams).

## 6. Realtime architecture (chat, notifications, viewer counts)

Nitro's built-in WebSocket support (`crossws`) terminates client
connections; Redis pub/sub fans messages out across server instances
(ADR-006). Single-process today (no fan-out needed with one instance), but
the pub/sub layer means adding instances later requires no protocol change.

```
Client A ──WS──▶ Nitro instance 1 ──publish──▶ Redis channel "chat:<streamId>"
                                                      │
Client B ──WS──▶ Nitro instance 2 ◀──subscribe───────┘
```

- **Chat**: `server/routes/ws/chat.ts` handles connect/message/disconnect.
  Messages are persisted to `live_chat_message` (append-only) *and*
  published to Redis for fan-out — persistence and delivery are separate
  concerns so a slow DB write never blocks message delivery to other
  viewers (write is fire-and-forget with a bounded retry, not on the
  critical delivery path).
- **Rate limiting / abuse**: per-connection message-rate counter in Redis
  (sliding window), slow-mode and subscriber-only-mode enforced
  server-side before a message is persisted or broadcast, not just
  hidden client-side.
- **Moderation**: bans/mutes checked against `chat_ban` on every message
  (cached in Redis with a short TTL to avoid a DB round-trip per message);
  a moderator action invalidates the cache entry immediately so a ban takes
  effect on the next message attempt, not after TTL expiry.
- **Reconnect**: client-side exponential backoff; on reconnect, client
  requests the last N messages via a regular REST call
  (`GET /api/chat/:streamId/history`) to backfill anything missed during
  the gap, rather than the WS layer trying to replay a buffer.
- **Notifications**: same WS transport, per-user channel
  (`notif:<userId>`) instead of per-stream; falls back to polling
  `GET /api/notifications` if the socket is unavailable, so notifications
  degrade gracefully rather than silently disappearing.

## 7. Auth & authorization architecture

better-auth (ADR-007) with database-backed sessions in the same Postgres
instance — no separate auth service, no JWT-only sessions.

- **Roles**: `viewer` (default) → `creator` (granted on channel creation) →
  `moderator` (per-channel grant, stored on `chat_moderator`, not a global
  role) → `admin` (platform-wide, `admin` table or `user.role` flag,
  narrow list). RBAC checks happen server-side in route handlers
  (`server/utils/auth.ts` exposes a `requireRole()` helper used at the top
  of protected routes) — the UI hiding a button is a UX nicety, never the
  authorization boundary (CLAUDE.md rule 5).
- **Sessions**: database-backed, so an admin ban or a moderator revocation
  takes effect on the *next* request, not after a signed cookie expires —
  the reason better-auth was chosen over `nuxt-auth-utils` (ADR-007).
- **Session transport**: httpOnly, secure, `SameSite=Lax` cookie holding an
  opaque session token; no session data in a client-readable cookie or
  localStorage.
- **CSRF**: same-site cookies plus better-auth's built-in CSRF token
  checks on state-changing requests.
- **Secrets**: `BETTER_AUTH_SECRET`, DB credentials, Cloudflare API tokens,
  and stream keys live only in server-side env vars (`.env`, never
  committed — `.env.example` documents the shape). Nothing secret is
  exposed to `nuxt.config.ts`'s `public` runtime config.

## 8. Security architecture

Per PROMPT.md §14, concretely mapped to this stack:

- **Input validation**: every `server/api/*` route validates its body/query
  with the shared Zod schema before touching the database — no route trusts
  client input past that boundary.
- **SQLi**: not applicable in the classic sense — Drizzle's query builder
  parameterizes all queries; raw SQL is avoided except for the generated
  `tsvector` search columns, which use Drizzle's tagged-SQL helpers (still
  parameterized).
- **XSS**: Vue's default template escaping handles most of this; anything
  rendering user HTML (none planned — comments/chat are plain text with
  emote *tokens*, not raw HTML) would need explicit sanitization if ever
  introduced.
- **Rate limiting / abuse prevention**: Redis-backed sliding-window limits
  on auth endpoints (login/signup attempts), chat message rate, and
  upload-initiation endpoints — separate from the chat-specific slow-mode
  in §6, which is a product feature, not just abuse defense.
- **Stream keys**: generated server-side by Cloudflare, returned to the
  creator's dashboard once (displayed, copyable), never logged, never
  re-displayed via an unauthenticated route, never present in client
  bundle/analytics.
- **Signed video URLs**: playback URLs for unlisted/premium content are
  signed with a short expiry via Cloudflare Stream's signed-URL feature,
  generated server-side per request, not baked into static HTML.
- **Headers**: standard security headers (CSP, `X-Content-Type-Options`,
  `Referrer-Policy`) set via Nitro middleware; CSP allows Cloudflare Stream
  player origins explicitly rather than a wildcard.
- **Audit logging**: privileged actions (ban, role change, video takedown,
  feature-flag toggle) write an `audit_log` row with actor, action, target,
  and timestamp — introduced in Phase 11 alongside the admin surface that
  produces these actions.

## 9. Deployment architecture

Single Node process (Nitro `node-server` preset) — required because
long-lived WebSocket connections rule out edge/serverless-only platforms
unless the WS route is later split into its own always-on process (not
needed at current scale). Specific host (Fly.io/Railway/Render/VPS) is an
open question tracked in PROGRESS.md, to be settled against actual budget
and target region once real traffic patterns exist — not a blocker for
building the app.

- **CI**: GitHub Actions runs lint, typecheck, unit tests (Vitest), and
  build on every PR; E2E (Playwright) runs against a preview deploy or a
  docker-composed Postgres+Redis in CI.
- **Migrations**: `drizzle-kit generate` produces SQL migration files
  committed to the repo; `drizzle-kit migrate` applies them as an explicit
  deploy step (not run automatically on server boot, to keep schema changes
  reviewable and reversible).
- **Environments**: `development` (local Postgres/Redis via Docker Compose
  or local installs), `preview` (per-PR, if the host supports it),
  `production`. Each has its own `.env` (never committed) following the
  shape in `.env.example`.

## 10. Observability architecture

- **Logging**: `pino` structured JSON logs from every Nitro route and WS
  handler (`server/utils/logger.ts`), request-scoped with a correlation ID
  so a single request's logs are traceable across DB calls and WS events.
- **Error tracking**: Sentry (Nuxt SDK) captures unhandled client and
  server errors with source maps; PII (session tokens, chat message
  content) scrubbed before send.
- **Metrics**: Nitro's built-in request metrics initially; no dedicated
  Prometheus/Grafana stack until real traffic volume justifies the
  operational cost (ADR-010's over-engineering guard applies here too).

## 11. Scaling architecture

Not needed at launch, but the design choices above are deliberately made so
scaling is additive, not a rewrite:

- **Stateless app servers**: no in-process session or chat state that
  can't be reconstructed from Postgres/Redis — horizontal scaling is
  "add another Nitro instance behind the load balancer," full stop.
- **Chat fan-out**: already Redis pub/sub (§6), so it's multi-instance-safe
  from day one, not a later migration.
- **Database**: read replicas are the first lever if Postgres becomes a
  bottleneck (discovery/search queries are read-heavy); no sharding
  planned until a concrete table's row count/query pattern demands it.
- **Video/CDN**: already offloaded to Cloudflare's edge network — this
  layer scales independently of the app by construction (ADR-005).
- **Search**: Postgres full-text is the bottleneck most likely to need
  replacing first under real catalog growth; the `/api/search` contract
  (§4) is the seam for that swap.

## 12. Open items

Tracked in [PROGRESS.md](./PROGRESS.md) rather than duplicated here:
final deployment host, and confirmation of Cloudflare Stream's delivery
cap (1080p, no DRM) remaining acceptable for v1.
