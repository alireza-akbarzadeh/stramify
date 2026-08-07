# Progress / Handoff

> Read this file first in any new session. It is the single source of truth
> for "where things stand" — update it before ending a session, and
> re-read it (don't assume) at the start of one, since another session may
> have advanced it. See the concurrent-session note below for why that
> caution is not hypothetical.

**Last updated**: 2026-08-06.

> **This file drifted badly between 2026-08-05 and 2026-08-06** — it still
> said "Phase 0 done, no `package.json`, no Nuxt scaffold" while the repo
> had already grown a full Nuxt 4 app (auth, landing page, dashboard shell,
> discovery feed) across several commits (`7387e2b` onward) that never
> updated this doc. The stale sections below have been corrected to match
> what's actually in the repo as of this update; treat anything not listed
> here as unverified rather than assuming it's still missing. If you're
> picking this up next: a full phase-by-phase audit (does `dashboard/`,
> `live.vue`, `following.vue` etc. actually work end to end, or are they
> scaffolds?) is still owed and wasn't in scope for this session.

## Current phase

Well past Phase 5 (Discovery) in terms of code present — `npm run dev`
works, Postgres (Neon) + Drizzle + better-auth are wired and functional,
and there's a working discovery/clips feed. **Not phase-audited** in the
strict PROMPT.md §19 sense (no session has confirmed every earlier-phase
deliverable is actually complete vs. scaffolded) — don't take low-numbered
"not started" phases at face value without checking the code first.

## What exists right now (verified in this session, 2026-08-06)

- Full Nuxt 4 app (`package.json`, `nuxt.config.ts`) — Vue 3.5, Tailwind v4
  + shadcn-vue, Pinia + TanStack Query, Drizzle ORM + Postgres (Neon,
  `DATABASE_URL` configured in `.env`), better-auth (auth routes live under
  `server/api/auth/`), pino logging.
- Pages present: `index`, `about`, `careers`, `login`/`signup`/
  `forgot-password`/`reset-password`/`verify-email`, `settings/security`,
  `settings/two-factor`, `security`, `clips`, `live`, `following`,
  `category/index`, `dashboard/index`, `dashboard/analytics`,
  `dashboard/stream` — existence confirmed by file listing only; not all
  individually verified working end to end this session.
- **Clips (`/clips`) — verified working end to end this session**: real
  `clips` Postgres table (`server/db/schema/clips.ts`), `/api/discovery/clips`
  queries it live (no more fixture data), seeded via `npm run db:seed`
  with curl-verified freely-licensed sample videos, and clip playback uses
  a real Vidstack player (`vidstack@1.15.6`) instead of a static
  thumbnail + fake play icon. See [video-streaming.md](./video-streaming.md)
  and [DECISIONS.md](./DECISIONS.md) ADR-012. Confirmed via Playwright:
  grid reflows to one column and the player modal fits without horizontal
  overflow at 375×812; clicking play advances `currentTime`, no console
  errors.
- **Categories (`/category`, `/category/[slug]`) — real, verified end to end**:
  derived views over the existing `clips.category` enum (no `categories`
  table). `server/api/discovery/categories.get.ts` (group-by count/total
  views/top-clip thumbnail) and `server/api/discovery/categories/[slug].get.ts`
  (Zod-validated slug, 404 on unknown) back
  `app/composables/useDiscoveryCategories.ts` /`useDiscoveryCategoryClips.ts`,
  rendered by `app/components/discovery/CategoryGrid.vue` + `CategoryCard.vue`
  + `CategoryDetail.vue` (reuses `ClipCard`/`ClipPlayerModal`/`useWatchlist`).
  Slug ↔ enum mapping and editorial copy live in `shared/utils/category.ts`;
  `server/utils/discovery.ts` holds the shared `toClip` mapper. Covered by
  `CategoryCard.spec.ts`, `shared/utils/category.spec.ts`, and
  `e2e/category.spec.ts` (all green against the seeded Neon DB).
- **Live directory (`/live`) — real, verified end to end**: no more
  `ComingSoon` placeholder and **no fixtures anywhere in discovery**
  (`server/utils/fixtures/` is deleted). Real `live_streams` Postgres table
  (`server/db/schema/live-streams.ts`, migration
  `0002_noisy_lady_deathstrike.sql`, reusing `clipCategoryEnum`), seeded by
  `npm run db:seed:live` with 8 channels on curl-verified freely-licensed
  HLS/mp4 sources. `/api/discovery/live` queries it ordered by viewer count
  and formats `"8.4k watching"` / uptime `"3h 17m"` (`formatUptime`, new in
  `server/utils/format.ts`). UI: `app/components/discovery/LiveDirectory.vue`
  → `LiveChannelGrid.vue` → `LiveChannelCard.vue` with search, category
  tabs, skeleton/empty/error states, `useWatchlist()` save (kind `'live'`),
  and real playback through the shared `ClipPlayerModal`. Verified in a real
  browser: 8 cards render, category/search filtering works, `currentTime`
  advances on both an HLS and an mp4 channel, single column with no
  horizontal overflow at 375×812, no console errors. See ADR-013 and
  [video-streaming.md](./video-streaming.md).
- The "Live Signals" rail on `/clips` consumes that same endpoint, so it now
  shows real rows too (`LiveSignal` gained `title`/`category`/`uptime`/
  `videoUrl` additively). Still Phase 7 and unbuilt: RTMPS ingest, stream
  keys, per-channel `/live/[username]` pages, live chat, realtime viewer
  counts (seeded counts are static).
- `docs/ARCHITECTURE.md` **exists** (Phase 1 deliverable, contrary to what
  this file previously said) — system/frontend/backend/database/streaming/
  realtime/auth/security/deployment/observability/scaling, per PROMPT.md
  §19 Phase 1.
- `docs/DECISIONS.md` — ADR-001 through ADR-013 (video player + real clips
  DB is ADR-012; the real `live_streams` table behind `/live` is ADR-013).
- `.claude/skills/` has grown well beyond the original `ui-ux-pro-max` set
  — a `motion` skill appeared during this session (installed by a
  concurrent session/process, not by this one — see the concurrent-session
  note below).

## What's still missing (only the parts checked this session)

- No `docs/DESIGN_SYSTEM.md` yet (Phase 2 deliverable) — check before
  assuming it's still absent, this file has been wrong about that before.
- No per-subsystem docs beyond what's listed above — `docs/auth.md`,
  `docs/live-chat.md`, `docs/database.md`, `docs/deployment.md`,
  `docs/security.md`, `docs/testing.md` per CLAUDE.md's docs-discipline
  rule (§7) have not been confirmed to exist or not; not checked this
  session.
- Live streaming ingest (Phase 7) — RTMPS, stream keys, Cloudflare Stream
  live inputs, broadcaster tooling, per-channel `/live/[username]` pages,
  live chat, realtime viewer counts — not built. The **viewer-facing live
  directory and playback are done** (ADR-013, above); what's missing is
  everything that would put a genuine creator broadcast behind it.
- `/following` is still a `ComingSoon` placeholder (deliberately untouched
  by the live-directory work).

## Concurrent-session note (important — read this)

On 2026-08-05, two Claude Code sessions were independently working this
same prompt in this same repo at the same time (one in this conversation,
one in another window the user had open). Both wrote to
`docs/ARCHITECTURE_RESEARCH.md` / `docs/DECISIONS.md` around 14:36–14:37.
The user chose to keep the other session's docs (thorough, ADR-format) and
had this session patch the one factual inconsistency between them: the
other session's draft ADR-009 recommended *not* installing
`ui-ux-pro-max-cli`, but this session had already installed it with the
user's explicit approval a few turns earlier. ADR-009 was rewritten in
place to say so (superseding its own draft — noted inline, not hidden).

**Lesson for future sessions**: before writing to `docs/` or `CLAUDE.md`,
check file modification timestamps (`stat` / `git status` timestamps) for
anything newer than expected. If something looks like it wasn't written by
you, stop and ask the user rather than silently overwriting — see the
"Concurrent sessions" rule in `CLAUDE.md`.

**Update, 2026-08-06**: happened again. Mid-session, `app/components/
UserMenu.vue` was rewritten (new avatar-ring treatment, verified-badge
icon, dropdown entrance/exit animation) and a new `.claude/skills/motion/`
skill appeared — neither started by this session. This session's own edits
(`ClipPlayerModal.vue`) picked up matching entrance/exit animation classes
on the dialog too, additively, with no conflict. Left both as-is per the
same lesson above: don't revert another session's in-progress work
silently. If you're reading this and don't recognize the `UserMenu.vue`
redesign or the `motion` skill as yours, they came from a parallel
session — check `git log`/`git diff` before assuming your context is the
full picture.

## Open questions (carried forward, not blocking)

1. **Deployment target** — needs a long-lived Node process for native
   WebSockets (crossws); candidates (Fly.io/Railway/Render/VPS) not yet
   decided.
2. **Cloudflare Stream's limits** (1080p delivery cap, no DRM) — accepted
   for v1 per ADR-005. Still unconfigured (`CLOUDFLARE_STREAM_API_TOKEN`
   empty in `.env`) — clips and live channels currently play from seeded
   public test-video URLs instead (ADR-012/ADR-013); swap `clips.video_url`
   and `live_streams.video_url` rows for Stream HLS manifests once an
   account exists, no schema/component change needed.

## Immediate next actions (start here)

1. Decide whether to keep chasing the original phase-by-phase plan or
   continue the pattern this repo has actually followed (build
   vertical-slice features — auth, landing, discovery/clips — ahead of a
   full `DESIGN_SYSTEM.md`/phase audit). Worth a direct conversation with
   the user rather than assuming either way.
2. If continuing feature work: live *ingest* (Phase 7) is the natural next
   vertical slice now that clips play real video and `/live` lists real
   channels from a real table (ADR-013) — ingest strategy, RTMPS/stream
   keys, per-channel `/live/[username]` pages, live chat, and realtime
   viewer counts are all still unbuilt.
3. If closing the documentation gap: audit `dashboard/*`, `live.vue`,
   `following.vue`, `category/index.vue` against PROMPT.md's definition of
   done (§20 point 4 in CLAUDE.md — loading/empty/error states, real
   backend, validation, auth, tests, a11y) rather than assuming their
   existence means they're finished.
