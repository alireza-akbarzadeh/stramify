# MASTER PROMPT — BUILD A PRODUCTION-GRADE TWITCH + YOUTUBE PLATFORM WITH VUE

> Saved verbatim from the initiating request on 2026-08-05. This is the source
> of truth for product scope and process. See [ARCHITECTURE_RESEARCH.md](./ARCHITECTURE_RESEARCH.md)
> and [DECISIONS.md](./DECISIONS.md) for the research and decisions made in
> response to it, and [PROGRESS.md](./PROGRESS.md) for what has actually been
> built so far against the phases below.

You are acting as a Principal Software Architect, Senior Full-Stack Engineer, Streaming Infrastructure Engineer, Product Designer, UX Engineer, DevOps Engineer, Security Engineer, and AI Coding Agent.

Your job is to research, architect, scaffold, configure, and progressively build a production-quality video streaming platform inspired by Twitch + YouTube, using the Vue/Nuxt ecosystem.

Do NOT rush directly into coding.

Your first responsibility is to research the current ecosystem, select the best technologies, install the appropriate Claude Code skills/tools, establish the architecture, and only then begin implementation.

## 1. PRODUCT VISION

We are building a modern streaming/video platform where users can:

### Viewers
- Browse live streams
- Watch live broadcasts
- Watch recorded videos / VODs
- Search videos and creators
- Follow creators
- Subscribe to creators
- Like/dislike content
- Comment
- Participate in live chat
- Receive notifications
- Create playlists
- Save videos
- View watch history
- Discover recommended content
- Share videos
- Watch on mobile/tablet/desktop
- Change video quality
- Enable captions
- Enter fullscreen
- Use theater mode
- Use picture-in-picture where supported

### Creators
- Create a channel
- Customize channel profile
- Upload videos
- Start live streams
- Manage stream title/category/tags
- Manage stream thumbnails
- View stream key/integration information securely
- Manage VODs
- Manage clips
- Moderate chat
- Ban/mute users
- Create moderators
- View analytics
- View followers/subscribers
- Manage subscriptions
- Manage channel settings
- Schedule streams

### Platform
- Authentication
- User profiles
- Creator channels
- Following system
- Subscription system
- Live streaming
- VOD
- Video processing
- Video playback
- Search
- Recommendations
- Categories
- Tags
- Comments
- Live chat
- Notifications
- Moderation
- Reporting
- Analytics
- Admin dashboard
- Feature flags
- Rate limiting
- Audit logs
- Security controls

The product should feel like a real commercial platform, not a toy CRUD demo.

## 2. IMPORTANT: RESEARCH BEFORE IMPLEMENTATION

Before writing substantial application code, perform an ecosystem/architecture investigation. Research current versions and documentation for: Vue, Nuxt, TypeScript, Vite, Tailwind CSS, Nuxt UI / shadcn-vue / equivalent, VueUse, Pinia, Zod, TanStack Query for Vue, PostgreSQL, ORM options (Drizzle/Prisma), authentication solutions, Redis/caching, realtime/WebSocket infrastructure, live streaming infrastructure, HLS, DASH, WebRTC/WHIP/WHEP, video players compatible with Vue/Nuxt, object storage, CDN, search infrastructure, observability, testing, CI/CD, deployment, security tooling.

Research official documentation and reputable sources. Do not blindly follow old tutorials. Prefer technologies that are actively maintained, production proven, TypeScript friendly, compatible with Nuxt/Vue, well documented, scalable, easy for an AI coding agent to maintain, reasonable in cost, and open/standards-based where practical. When there are multiple viable choices, compare them and explain the decision.

## 3. USE UI/UX PRO MAX

Investigate and use UI/UX Pro Max (https://ui-ux-pro-max-skill.nextlevelbuilder.io/, github.com/nextlevelbuilder/ui-ux-pro-max-skill) — determine the correct installation method for the current Claude Code version, install if not present, and use its methodology to research product type, UI style, design system, color palette, typography, UX guidelines, layout, responsive behavior, accessibility, components, icons, charts, motion, interaction patterns. Do not copy Twitch or YouTube — use them as references while creating an original design system that feels like a premium next-generation streaming platform.

## 4. CLAUDE CODE SKILLS / AI DEVELOPMENT ENVIRONMENT

Inspect available Claude Code Skills, plugins, MCP integrations, and dev tools before implementation. Evaluate each candidate for problem solved, maintenance status, trustworthiness, compatibility, project benefit, and complexity cost. Install only the useful ones.

## 5. CREATE A PROJECT AI OPERATING SYSTEM

Create and maintain `CLAUDE.md` and, where useful, `.claude/{skills,commands,agents,hooks}/`. Use Skills for repeatable procedures (UI implementation, Vue/Nuxt architecture, streaming architecture, database work, security review, testing, performance review, accessibility review, code review) rather than dumping every rule into CLAUDE.md.

## 6. SELECT THE STACK

Do not assume the stack before researching it. Candidate architecture to investigate:

**Frontend:** Nuxt, Vue 3, TypeScript, Tailwind CSS, a UI component system appropriate for Nuxt/Vue, VueUse, Pinia where genuinely needed, TanStack Query where beneficial, Zod, Vitest, Playwright.

**Backend:** Investigate whether Nuxt server routes / Nitro, a dedicated API service, or a modular hybrid is best. Do not introduce microservices unless justified.

**Database:** PostgreSQL, Drizzle vs Prisma, migrations, indexes, full-text/search strategy, transactional integrity.

**Realtime:** WebSockets, SSE, managed realtime services, Redis pub/sub — appropriate architecture for live chat and notifications.

**Video:** Research and select the most appropriate streaming infrastructure. Strongly investigate managed services (Cloudflare Stream, Mux, etc.) and compare live streaming, RTMPS, SRT, WebRTC, WHIP/WHEP, HLS, DASH, latency, encoding, adaptive bitrate, VOD, thumbnails, captions, analytics, CDN, signed playback, creator upload, cost, scalability. Do NOT implement custom video transcoding infrastructure unless there is a strong architectural reason — the application should own product logic, a specialized video platform should handle video infrastructure.

## 7. PROPOSED DEFAULT ARCHITECTURE

Unless research demonstrates a clearly better solution: Nuxt + Vue 3 + TypeScript frontend; Tailwind + accessible Vue/Nuxt component system for UI; TanStack Query + Pinia for state; Nuxt/Nitro server API initially; PostgreSQL with Drizzle or Prisma; mature secure auth solution for Nuxt; Redis-compatible caching; WebSockets/managed realtime; Cloudflare Stream/Mux/equivalent for video; object storage for non-server assets; Postgres search initially, dedicated search infra only when justified; structured logging + error tracking + metrics; Vitest + Playwright; GitHub Actions CI; deployment chosen based on architecture and streaming requirements. Research first — this list is not fixed.

## 8. UI/UX DIRECTION

Combine Twitch-like live discovery, YouTube-like VOD discovery, modern creator dashboards, premium SaaS-level polish, strong information hierarchy, excellent responsive design, fast navigation, accessible controls, excellent video viewing experience. Dark-first, high contrast, strong typography, compact but breathable layouts, large video surfaces, excellent thumbnails, clear creator identity, subtle motion, fast interactions, minimal visual noise, premium micro-interactions. Avoid generic AI-dashboard look, excessive gradients/glassmorphism, unnecessary animation, giant rounded cards everywhere, poor contrast, inconsistent spacing, random component styles, emoji as icons, fake functionality. Use a real icon system and consistent design tokens.

## 9. CORE ROUTES

`/` explore/discovery · `/live` live directory · `/category/:slug` · `/channel/:username` · `/watch/:id` · `/search` · `/clips` · `/following` · `/history` · `/playlists` · `/settings` · `/dashboard` · `/dashboard/stream` · `/dashboard/videos` · `/dashboard/analytics` · `/dashboard/community` · `/dashboard/settings` · `/admin`

## 10. VIDEO WATCH PAGE

High-quality watch experience. Desktop: large player, title, creator info, follow/subscribe, like/share/save, description, tags, live chat when applicable, comments, recommended/related content. Mobile redesigned, not shrunk. Support adaptive quality, volume, fullscreen, theater mode, captions, playback speed, PiP where supported, keyboard shortcuts, buffering indicators, error states, offline/network failure states, live status, latency indicator where useful.

## 11. LIVE STREAM EXPERIENCE

Real streaming-platform feel: player + channel info + follow/subscribe/share + description/tags + live chat side panel. Implement live viewer count, stream title/category/tags, creator info, follow, subscription, chat, moderation, emotes architecture, slow mode, subscriber-only chat architecture, banned users, moderators, reconnect handling, stream ended/offline states. Do not fake realtime behavior — build proper interfaces and architecture.

## 12. CREATOR DASHBOARD

Overview, Go Live, stream configuration, Videos, VOD, Clips, Analytics, Audience, Subscribers, Chat moderation, Channel customization, Settings. Analytics should eventually support views, watch time, average/peak concurrent viewers, followers gained, subscribers, engagement, traffic sources, top videos/streams, with readable charts.

## 13. DATABASE MODEL

Investigate models for: User, Profile, Channel, Follow, Subscription, Video, LiveStream, StreamSession, Category, Tag, VideoTag, Comment, LiveChatMessage, ChatBan, ChatModerator, Playlist, PlaylistItem, VideoLike, VideoView, WatchHistory, Notification, Clip, Report, ModerationAction, CreatorAnalytics, SubscriptionPlan, Payment, AuditLog, FeatureFlag. Do not blindly implement every model — normalize appropriately, with proper PKs/FKs/unique constraints/indexes/timestamps/soft deletion where justified/pagination strategy/transaction boundaries.

## 14. SECURITY

Secure authentication, authorization, RBAC (creator/moderator/admin), input validation, CSRF protection where relevant, XSS/SQLi protection, rate limiting, abuse prevention, secure cookies/headers, signed video URLs where necessary, protected stream keys, secret management, audit logging, account recovery, session management, upload validation, API abuse prevention. NEVER expose stream keys or secrets to the browser unnecessarily. NEVER commit secrets to Git — create `.env.example`.

## 15. PERFORMANCE

Design for a large number of viewers: SSR, caching, CDN, lazy loading, image/thumbnail optimization, route-level code splitting, virtualized lists, efficient chat rendering, database indexes, pagination (cursor where appropriate), optimistic UI where appropriate, background jobs, queue architecture, rate limiting, Redis caching, realtime fan-out. Do not prematurely over-engineer — build a modular monolith first unless research proves otherwise.

## 16. RESPONSIVE DESIGN

Desktop, laptop, tablet, mobile — mobile gets its own interaction strategy (bottom navigation, mobile video player, chat, comments, creator dashboard, upload workflow, discovery, search, navigation drawer), not a shrunk desktop layout.

## 17. ACCESSIBILITY

Target WCAG 2.2 AA where practical: keyboard navigation, focus management, semantic HTML, ARIA only when necessary, accessible dialogs/menus, captions, contrast, screen-reader labels, reduced motion, accessible forms and error messaging. Run accessibility checks during development.

## 18. TESTING STRATEGY

Unit tests (business logic, utilities, validation, permissions, composables), integration tests (API, database, auth, creator permissions, streaming lifecycle), E2E tests with Playwright (signup, login, browse, search, watch, follow, dashboard, upload, stream config, chat, moderation, logout). Create test fixtures, avoid brittle selectors. Test throughout, not just at the end.

## 19. DEVELOPMENT PROCESS

**Phase 0 — Research:** ecosystem, current versions, architecture choices, UI/UX, streaming infra, Claude Code skills, deployment → `docs/ARCHITECTURE_RESEARCH.md`.

**Phase 1 — Architecture:** `docs/ARCHITECTURE.md` (system/frontend/backend/database/streaming/realtime architecture, auth, security, deployment, observability, scaling) + `docs/DECISIONS.md` (decisions and rejected alternatives).

**Phase 2 — Design System:** `docs/DESIGN_SYSTEM.md` (brand, color tokens, typography, spacing, radius, shadows, borders, motion, iconography, components, states, breakpoints, accessibility rules), then implement the design foundation.

**Phase 3 — Project Foundation:** Nuxt, Vue, TS, Tailwind, UI system, linting, formatting, testing, env vars, database, migrations, auth, logging, error handling. Project must run cleanly.

**Phase 4 — Application Shell:** navigation, sidebar, mobile nav, header, search, user menu, notifications, theme, responsive shell.

**Phase 5 — Discovery:** home, live directory, categories, search, channels, recommendations, thumbnails, infinite scroll/pagination.

**Phase 6 — Video:** VOD page, player, HLS/DASH, quality controls, captions, fullscreen, theater mode, watch history, reactions, comments.

**Phase 7 — Live Streaming:** real streaming integration — stream creation/lifecycle/metadata, ingest integration, playback, live state, viewer count architecture, reconnect behavior, stream ended state. Not a fake `<video>` demo.

**Phase 8 — Live Chat:** realtime transport, message persistence, rate limiting, moderation, bans, moderators, slow mode, subscriber-only mode architecture, reconnect handling.

**Phase 9 — Creator System:** onboarding, channel settings, video/stream management, dashboard, analytics, moderation.

**Phase 10 — Social System:** follows, likes, comments, subscriptions, playlists, history, notifications, sharing.

**Phase 11 — Admin:** user/creator management, reports, moderation, content management, feature flags, audit logs.

**Phase 12 — Hardening:** security, performance, accessibility, UX, database, API, dependency, error-handling, mobile audits — fix issues found.

## 20. AI CODING RULES

Inspect repo → understand existing code → search official docs → search existing implementations → determine smallest safe change → implement → test → review → fix → document meaningful decisions. Never rewrite working systems without reason. Never create duplicate utilities or unnecessary abstractions. Never add dependencies without evaluating them. Never leave TODO placeholders pretending functionality is complete. Never fake backend behavior as production functionality or hard-code fake data into production paths — mock data only in clearly separated dev fixtures.

## 21. DOCUMENTATION RULE

For every significant subsystem, create concise docs (e.g. `docs/auth.md`, `docs/video-streaming.md`, `docs/live-chat.md`, `docs/database.md`, `docs/deployment.md`, `docs/security.md`, `docs/testing.md`) explaining architecture, why it exists, how it works, how to run it, common failure modes, how to modify it.

## 22. RESEARCH QUALITY RULE

Prefer official documentation → official GitHub repo → official changelog/release notes → reputable technical sources → community discussion as supplementary evidence only. Do not trust outdated blog posts when official docs exist. Verify current APIs before implementation.

## 23. DON'T GET STUCK ASKING QUESTIONS

If information is missing, make a sensible engineering assumption, document it, and continue. Only stop to ask when a decision would create a major irreversible architectural consequence.

## 24. DO NOT OVER-ENGINEER

No 30 microservices, no Kubernetes, no Kafka, no unnecessary event sourcing/GraphQL, no multiple databases, no custom transcoding infra, no complicated distributed systems. Start with a modular monolith + managed streaming infrastructure. Design boundaries so the system can evolve later.

## 25. DEFINITION OF DONE

A feature is done only when: UI exists, responsive behavior works, loading/empty/error states work, backend + database integration exists where required, validation exists, authorization exists, tests exist, accessibility/performance/security have been considered, documentation exists where appropriate.

## 26. GIT DISCIPLINE

Meaningful, scoped commits, e.g. `feat(auth): implement authentication`, `feat(streaming): add live stream lifecycle`, `fix(player): handle playback reconnect`. No giant meaningless commits.

## 27. FIRST TASK — DO THIS BEFORE BUILDING

A. Inspect the repository (framework, package manager, dependencies, existing code/architecture/Claude config).
B. Research the current best stack for this project.
C. Research UI/UX Pro Max and determine the correct current installation method.
D. Research current Claude Code docs for Skills/plugins/MCP/commands/hooks/project instructions.
E. Compare managed streaming solutions and choose the best one for the initial implementation.
F. Produce `docs/ARCHITECTURE_RESEARCH.md` and `docs/DECISIONS.md`.
G. Present a concise summary: recommended stack + why, alternatives considered, streaming provider recommendation, UI/UX strategy, Claude Skills/tools installed, architecture, estimated implementation phases, major risks. Then proceed to implementation unless there is a genuinely blocking architectural question.

## 28. IMPORTANT — USE THE WEB

Research current documentation rather than relying only on pretrained knowledge. Verify current information for technology choices. Adapt implementation to current library versions rather than forcing old tutorial patterns.

## 29. FINAL ENGINEERING STANDARD

Target quality bar: Linear-level product polish, YouTube-level video experience, Twitch-level live experience, modern SaaS-level developer architecture, excellent accessibility, production-grade security, excellent mobile UX, AI-assisted engineering discipline. Not a generic template — a real foundation that could eventually support thousands or millions of users. Research → architecture → design system → implementation → tests → hardening, in that order. Do not skip phases.
