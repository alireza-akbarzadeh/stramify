# Progress / Handoff

> Read this file first in any new session. It is the single source of truth
> for "where things stand" — update it before ending a session, and
> re-read it (don't assume) at the start of one, since another session may
> have advanced it. See the concurrent-session note below for why that
> caution is not hypothetical.

**Last updated**: 2026-08-05, end of Phase 0.

## Current phase: Phase 0 (Research) — done. Phase 1 (Architecture) — not started.

Per [docs/PROMPT.md](./PROMPT.md) §19's 13-phase process
(Phase 0 → Phase 12), tracked in [CLAUDE.md](../CLAUDE.md).

## What exists right now

- `docs/PROMPT.md` — the master spec (do not edit).
- `docs/ARCHITECTURE_RESEARCH.md` — Phase 0 ecosystem research, complete.
- `docs/DECISIONS.md` — ADR-001 through ADR-010, complete for the
  Phase-0-level stack choices (framework, UI, backend shape, DB/ORM, video
  provider, realtime, auth, search, monolith boundary, and the
  ui-ux-pro-max install call).
- `CLAUDE.md` — project operating rules, condensed from PROMPT.md §20–29.
- `.claude/skills/` — `ui-ux-pro-max` + sibling design skills (`design-system`,
  `brand`, `design`, `ui-styling`, `banner-design`, `slides`,
  `claude-automation-recommender`) installed via `ui-ux-pro-max-cli`.
- `.claude/settings.local.json` / `.claude/settings.json` — permission
  config (pre-existing + skill-installer-added).
- Git repo initialized (`git init` already run). **Nothing committed yet —
  everything above is untracked.** First commit is a deliberate next step,
  not yet done (see "Immediate next actions").
- `.idea/` — JetBrains project files (pre-existing, unrelated to this
  build).

## What does NOT exist yet

- No `package.json`, no Nuxt project scaffold, no source code at all.
  Phase 3 (Project Foundation) has not started — do not assume `npm run
  dev` works.
- No `docs/ARCHITECTURE.md` (Phase 1 deliverable — system/frontend/backend/
  database/streaming/realtime/auth/security/deployment/observability/
  scaling architecture, per PROMPT.md §19 Phase 1).
- No `docs/DESIGN_SYSTEM.md` (Phase 2 deliverable).
- No per-subsystem docs yet (`docs/auth.md`, `docs/video-streaming.md`,
  etc. — these come as each subsystem is actually built, per PROMPT.md §21).

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

## Open questions (carried forward, not blocking)

1. **Deployment target** — needs a long-lived Node process for native
   WebSockets (crossws); candidates (Fly.io/Railway/Render/VPS) not yet
   decided. Decide in Phase 1 (`ARCHITECTURE.md`) once hosting
   budget/region constraints are known.
2. **Cloudflare Stream's limits** (1080p delivery cap, no DRM) — accepted
   for v1 per ADR-005; the video-provider abstraction
   (`server/services/video/`, to be created in Phase 7) is the intended
   swap point if Mux becomes necessary later. No action needed now.

## Immediate next actions (start here)

1. **Optional but recommended**: make the first git commit covering
   `docs/`, `CLAUDE.md`, and `.claude/` (Phase 0 output). Not yet done —
   ask the user before committing (per this project's git discipline: only
   commit when explicitly asked).
2. **Start Phase 1 (Architecture)**: write `docs/ARCHITECTURE.md` covering
   system/frontend/backend/database/streaming/realtime architecture, auth,
   security, deployment, observability, and scaling — building on the
   choices already made in `DECISIONS.md`, not re-litigating them.
3. **Then Phase 2 (Design System)**: invoke the installed `ui-ux-pro-max`
   / `design-system` / `ui-styling` skills (don't hand-roll palette/type
   research — that's the whole point of having installed them) to produce
   `docs/DESIGN_SYSTEM.md`, per PROMPT.md §19 Phase 2 and §3's "original,
   premium, not-a-copy-of-Twitch-or-YouTube" direction.
4. **Then Phase 3 (Project Foundation)**: actually scaffold the Nuxt 4
   project (this repo currently has zero application code).
