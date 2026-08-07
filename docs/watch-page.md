# Watch page

The destination page for anything playable: `/watch/[slug]`. One page serves
both VOD clips and live channels — see [ADR-014](./DECISIONS.md) for why, and
[ADR-015](./DECISIONS.md) for why chat polls instead of using a WebSocket.

## What a viewer gets

| | Clip (VOD) | Live channel |
|---|---|---|
| Player | Vidstack, on-demand | Vidstack, `stream-type="live"` + LIVE badge |
| Meta line | views · published · duration | viewers · uptime |
| Sidebar | Up next | Live chat **+** Up next |
| Below | Comments (read-only) | — |
| Always | like/dislike · share · save · follow channel · description | |

## Slug resolution

`server/utils/watch.ts` → `resolveWatchTarget(slug)`:

1. `clips.id`, matched exactly (`clip-midnight-echo`)
2. `live_streams.streamer_name`, matched case-insensitively (`Viper_Squadron`)
3. otherwise `null` → the endpoint 404s → the page renders "we couldn't find
   that video"

The two namespaces can't collide: clip ids are prefixed slugs, live slugs are
streamer handles. No `c/` `l/` disambiguation is needed. **If you ever seed a
clip whose id is a bare handle, that assumption breaks** — keep the `clip-`
prefix.

`/live/[username]` is a redirect to `/watch/[username]`, kept so old links and
`e2e/live.spec.ts` still work.

## Component tree

```
app/pages/watch/[slug].vue          thin page
└─ WatchView.vue                    container: composables, loading/404/error
   └─ WatchLayout.vue               presentational shell, all data via props
      ├─ WatchPlayer / WatchMeta / WatchActions
      ├─ WatchChannelBar / WatchDescription
      ├─ WatchComments → WatchCommentItem     (clips)
      └─ aside: WatchChat → WatchChatMessage  (live)
                WatchUpNext → WatchUpNextCard
```

`WatchLayout` takes no data of its own, which is what lets
`app/pages/zz-watch-preview.vue` drive it from
`app/components/watch/__fixtures__/watch.ts` — a dev-only preview of both
modes. **Those fixtures are never imported by `WatchView`**; the real page
always reads the API.

### Responsive layout

One flex column below `lg`, a two-column grid at `lg` and up:

```
flex flex-col gap-8  lg:grid lg:grid-cols-[minmax(0,1fr)_400px]
```

Below `lg` the `aside` is a normal block in flow, so **the sidebar renders
below the video**, with `order-2` keeping it above the comment list so live
chat sits directly under the player on a phone. On desktop the aside is
`lg:row-span-2` with a `lg:sticky lg:top-20` inner div (`top-20` clears the
fixed 4rem `AppHeader`).

## API

All routes Zod-validate at the boundary. Writes go through `requireUser`
(`server/utils/session.ts`), which 401s — authorization is server-side, never
just a hidden button.

| Route | Auth | Notes |
|---|---|---|
| `GET /api/watch/[slug]` | — | 404 on unknown slug |
| `GET /api/watch/[slug]/related` | — | same category, live first, max 12 |
| `POST /api/watch/[slug]/view` | — | clips only; **no-op for live** |
| `GET /api/watch/[slug]/comments` | — | `?sort=top\|new`; `[]` for live |
| `GET /api/watch/[slug]/chat` | — | `?since=<iso>`; `[]` for clips |
| `POST /api/watch/[slug]/chat` | ✔ | 1–200 chars |
| `GET /api/watch/[slug]/reaction` | — | `mine` is null when signed out |
| `POST /api/watch/[slug]/reaction` | ✔ | toggle; upsert on unique constraint |
| `GET /api/channels/[name]` | — | derived, no `channels` table |
| `POST /api/channels/[name]/follow` | ✔ | toggle, returns fresh summary |

## Tables

Migration `0003_*`. See `server/db/schema/`.

- **`comments`** — `clip_id`, one-level `parent_id`, nullable `user_id`
  alongside non-null `author_name`. Read-only in the UI today; the nullable
  FK is what makes enabling posting an endpoint change, not a migration.
- **`chat_messages`** — `stream_id`, denormalized `author_name` so rendering
  needs no join and a deleted account doesn't blank chat history.
- **`reactions`** — `(target_id, target_kind)` instead of two tables. Unique
  on `(user_id, target_id)`: that constraint is what makes the toggle safe
  under a double-click.
- **`follows`** — `channel` is a **text handle, not an FK**. There's no
  `channels` table yet.

Plus a nullable `description` on `clips` and `live_streams`.

## Running it

```bash
npm run db:migrate && npm run db:seed && npm run dev
```

`db:seed` runs clips → live → comments → chat in that order; comments and chat
have FKs into the first two, so **order matters**.

Try `/watch/clip-midnight-echo` (VOD), `/watch/Viper_Squadron` (live),
`/watch/nope` (404 state), and `/zz-watch-preview` (fixtures, both modes).

## Failure modes

- **Comments/chat seed fails with a foreign-key violation** — clips or live
  streams weren't seeded first. Run `npm run db:seed`, not the sub-scripts.
- **Chat is stuck / doesn't update** — polling pauses when the tab is hidden,
  by design. It resumes on focus. If it's still stale, the poll is erroring:
  the panel shows "Chat disconnected" with a Reconnect button.
- **Chat message rejected** — 401 means signed out (the composer should have
  been a log-in prompt), 400 means empty or over 200 chars.
- **Like button snaps back after clicking** — the optimistic update was rolled
  back because the POST failed. Check the session; reactions require auth.
- **Live uptime keeps growing** — seeded `started_at` is fixed. Re-run
  `npm run db:seed:live` to reset it. Real values arrive with Phase 7 ingest.
- **Viewer count never changes on a live page** — correct. It's a seeded
  value; `POST /view` deliberately doesn't touch it (ADR-014 point 8).
- **A clip 404s but exists** — the id must match exactly. Only live handles
  are case-insensitive.

## Known limits

- Comments are read-only (ADR-014). Chat accepts posts; the asymmetry is
  deliberate.
- Chat is up to 5s behind. Phase 8 replaces the interval with crossws.
- Up-next is category-only — no watch history, no recommender.
- Renaming a channel orphans its follows until a `channels` table exists.
