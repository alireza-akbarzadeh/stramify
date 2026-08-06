# Video streaming (clip playback)

Covers clip playback only. Live streaming (ingest, RTMPS, viewer-facing live
player) is Phase 7 and not built yet — see [PROGRESS.md](./PROGRESS.md).

## What it is

The discovery feed (`/clips`) plays real video through
[Vidstack](https://www.vidstack.io) (`vidstack@1.15.6`, MIT), backed by a
real `clips` database table. See [DECISIONS.md](./DECISIONS.md) ADR-012 for
why Vidstack and why a real table instead of the fixtures the discovery
feed originally shipped with.

## How it works

- **Data**: `server/db/schema/clips.ts` defines the `clips` table —
  `videoUrl` (directly playable mp4/HLS source), `thumbnailUrl`,
  `durationSeconds`, `views`, `category`, `featured`. `scripts/seed-clips.mjs`
  seeds it with freely-licensed public test videos (curl-verified live at
  seed time — see the script's header before adding more).
- **API**: `server/api/discovery/clips.get.ts` queries the table via
  Drizzle, formats display strings (`formatDuration`/`formatCount`/
  `formatAge` in `server/utils/format.ts`), and returns the same
  `{ featured, clips }` shape the frontend already expected.
- **Player**: `app/plugins/vidstack.client.ts` registers Vidstack's custom
  elements client-side only (`vidstack/player`, `.../layouts/default`,
  `.../ui`). `nuxt.config.ts` loads the default theme CSS and sets
  `vue.compilerOptions.isCustomElement` so Vue leaves `media-*` tags as
  native DOM elements instead of trying to resolve them as components.
  `app/components/discovery/ClipPlayerModal.vue` renders
  `<media-player src="..." poster="...">` + `<media-provider>` +
  `<media-video-layout>` whenever the selected `WatchlistItem` has a
  `videoUrl`; live-signal items (no `videoUrl` yet) fall back to a static
  thumbnail with a "coming soon" badge.
- **Types**: `shared/types/vidstack.d.ts` does a type-only
  `import 'vidstack/vue'` so the `media-*` elements type-check in `.vue`
  templates (Vidstack ships this augmentation but it needs one import
  somewhere in the TS program to be picked up).

## How to run / modify

```bash
npm run db:generate   # after changing server/db/schema/clips.ts
npm run db:migrate    # apply to $DATABASE_URL
npm run db:seed       # (re-)seed sample clips — safe to re-run, upserts by id
```

To add a new sample clip, add a row to the `clips` array in
`scripts/seed-clips.mjs` and re-run `npm run db:seed`. To point at real
creator uploads once Cloudflare Stream (ADR-005) is configured, write
`videoUrl` as the Stream HLS manifest URL — no schema or component change
needed, the player treats it as an opaque playable source.

## Common failure modes

- **403 on a seeded video URL**: the public test-video host pulled the
  asset. `curl -I` the URL; if it's dead, swap it for another
  curl-verified source in `scripts/seed-clips.mjs` (see the ADR-012 note
  on `gtv-videos-bucket` — it died mid-project once already).
- **`media-player` etc. show up as unknown-element warnings in the
  console**: `vidstack.client.ts` didn't register in time, or
  `isCustomElement` in `nuxt.config.ts` got reverted. Both are required.
- **TypeScript complains about `media-player` in a `.vue` template**:
  `shared/types/vidstack.d.ts` got deleted or excluded from the tsconfig.
- **Unmuted `autoplay` silently doesn't start**: expected — browsers block
  unmuted autoplay without sufficient user/media engagement. The player
  still renders paused with working controls; this isn't a bug to "fix"
  with a permanent mute default, since it degrades the primary "click a
  clip, hear it" experience for normal browser sessions.
