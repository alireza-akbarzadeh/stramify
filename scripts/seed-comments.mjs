// Seeds the `comments` table so the watch page's comment section has real
// rows to render. Comments are read-only in the UI for now (ADR-014), so
// these are the only rows that exist — they're seeded sample content, the
// same category of data as the clips and live streams they hang off, not
// fixtures wired into a production code path.
//
// Every `clip_id` below must exist: run `npm run db:seed:clips` first (or
// just `npm run db:seed`, which orders them correctly).
// Run with: npm run db:seed:comments
import postgres from 'postgres'

const sql = postgres(process.env.DATABASE_URL ?? '', { max: 1 })

const minutesAgo = (m) => new Date(Date.now() - m * 60 * 1000)

// Shape: [id, clipId, parentId, author, body, likes, minutesAgo]
const comments = [
  {
    id: 'comment-echo-1',
    clipId: 'clip-midnight-echo',
    parentId: null,
    authorName: 'sable_reverb',
    body: 'The transition at 1:12 is the best thing I have heard all year. Whoever ran the desk feed deserves a raise.',
    likes: 412,
    createdAt: minutesAgo(64)
  },
  {
    id: 'comment-echo-1-r1',
    clipId: 'clip-midnight-echo',
    parentId: 'comment-echo-1',
    authorName: 'EchoCollective',
    body: 'That was completely unplanned — the desk engineer caught it on instinct.',
    likes: 96,
    createdAt: minutesAgo(48)
  },
  {
    id: 'comment-echo-2',
    clipId: 'clip-midnight-echo',
    parentId: null,
    authorName: 'hollow_frequency',
    body: 'Been waiting three years for a proper recording of this encore. Worth every minute.',
    likes: 188,
    createdAt: minutesAgo(120)
  },
  {
    id: 'comment-echo-3',
    clipId: 'clip-midnight-echo',
    parentId: null,
    authorName: 'tape_hiss',
    body: 'Four handhelds and it still cuts cleaner than most studio releases.',
    likes: 74,
    createdAt: minutesAgo(190)
  },
  {
    id: 'comment-triple-1',
    clipId: 'clip-triple-kill',
    parentId: null,
    authorName: 'quickscope_kev',
    body: 'The flank timing here is genuinely unfair. Watched it six times.',
    likes: 233,
    createdAt: minutesAgo(90)
  },
  {
    id: 'comment-triple-1-r1',
    clipId: 'clip-triple-kill',
    parentId: 'comment-triple-1',
    authorName: 'GhostOperator',
    body: 'Third-partied the rotation on purpose. They never check that corridor.',
    likes: 118,
    createdAt: minutesAgo(70)
  },
  {
    id: 'comment-triple-2',
    clipId: 'clip-triple-kill',
    parentId: null,
    authorName: 'lumen_ghost',
    body: 'What sensitivity is this? The tracking is absurdly smooth.',
    likes: 41,
    createdAt: minutesAgo(150)
  },
  {
    id: 'comment-modular-1',
    clipId: 'clip-modular-synthesis',
    parentId: null,
    authorName: 'patchcable_pete',
    body: 'That filter sweep at the end is exactly why I got into modular in the first place.',
    likes: 156,
    createdAt: minutesAgo(200)
  },
  {
    id: 'comment-modular-2',
    clipId: 'clip-modular-synthesis',
    parentId: null,
    authorName: 'drift_and_decay',
    body: 'Please post the patch notes. Begging.',
    likes: 88,
    createdAt: minutesAgo(260)
  },
  {
    id: 'comment-forge-1',
    clipId: 'clip-steel-forge',
    parentId: null,
    authorName: 'kiln_and_ink',
    body: 'The confidence in those final strokes. No undo, no hesitation.',
    likes: 97,
    createdAt: minutesAgo(310)
  }
]

for (const comment of comments) {
  await sql`
    insert into comments (
      id, clip_id, parent_id, user_id, author_name, author_image,
      body, likes, created_at
    ) values (
      ${comment.id}, ${comment.clipId}, ${comment.parentId}, null,
      ${comment.authorName}, null, ${comment.body}, ${comment.likes},
      ${comment.createdAt}
    )
    on conflict (id) do update set
      clip_id = excluded.clip_id,
      parent_id = excluded.parent_id,
      author_name = excluded.author_name,
      body = excluded.body,
      likes = excluded.likes,
      created_at = excluded.created_at
  `
}

console.log(`Seeded ${comments.length} comments.`)
await sql.end()
