// Seeds the `clips` table with real, freely-licensed sample videos (W3C's
// long-standing media test assets, MDN's CC0 video set, and Mux's public
// HLS test streams) so the discovery feed has genuinely playable content
// before creator uploads exist. Every URL below was curl-verified live —
// Google's old gtv-videos-bucket sample set (a common tutorial choice) now
// 403s, so don't reintroduce it without re-checking.
// Run with: npm run db:seed:clips (or npm run db:seed for every seed script)
import postgres from 'postgres'

const sql = postgres(process.env.DATABASE_URL ?? '', { max: 1 })

const placeholder = (seed) => `https://picsum.photos/seed/${seed}/960/540`
const hoursAgo = (h) => new Date(Date.now() - h * 60 * 60 * 1000)

const clips = [
  {
    id: 'clip-midnight-echo',
    title: 'The Midnight Echo: Unrehearsed Encore at Tokyo Dome',
    creator: 'EchoCollective',
    category: 'Music',
    // Mux's public HLS test stream (adaptive bitrate) — shows off the
    // player's HLS support on the flagship featured clip.
    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    thumbnailUrl: placeholder('midnight-echo'),
    durationSeconds: 165,
    views: 12400,
    featured: true,
    createdAt: hoursAgo(0)
  },
  {
    id: 'clip-triple-kill',
    title: 'The Perfect Triple-Kill Flank',
    creator: 'GhostOperator',
    category: 'Gaming',
    videoUrl: 'https://media.w3.org/2010/05/bunny/trailer.mp4',
    thumbnailUrl: placeholder('triple-kill'),
    durationSeconds: 33,
    views: 14200,
    featured: false,
    createdAt: hoursAgo(2)
  },
  {
    id: 'clip-modular-synthesis',
    title: 'Modular Synthesis Peak Moment',
    creator: 'Patch_Bay',
    category: 'Music',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    thumbnailUrl: placeholder('modular-synthesis'),
    durationSeconds: 60,
    views: 8900,
    featured: false,
    createdAt: hoursAgo(4)
  },
  {
    id: 'clip-rendering',
    title: 'Rendering the Final Details',
    creator: 'Canvas_Queen',
    category: 'Creative',
    videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
    thumbnailUrl: placeholder('rendering-details'),
    durationSeconds: 52,
    views: 22100,
    featured: false,
    createdAt: hoursAgo(1)
  },
  {
    id: 'clip-golden-hour',
    title: 'Chasing the Golden Hour Light',
    creator: 'Sky_High',
    category: 'Creative',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4',
    thumbnailUrl: placeholder('golden-hour'),
    durationSeconds: 30,
    views: 1500,
    featured: false,
    createdAt: hoursAgo(5)
  },
  {
    id: 'clip-street-run',
    title: 'Dirt to Street in Under a Minute',
    creator: 'Subaru_Nomad',
    category: 'Gaming',
    videoUrl: 'https://media.w3.org/2010/05/video/movie_300.mp4',
    thumbnailUrl: placeholder('street-run'),
    durationSeconds: 60,
    views: 6300,
    featured: false,
    createdAt: hoursAgo(8)
  },
  {
    id: 'clip-steel-forge',
    title: 'Forging the Final Cut',
    creator: 'Canvas_Queen',
    category: 'Creative',
    videoUrl: 'https://test-streams.mux.dev/pts_shift/master.m3u8',
    thumbnailUrl: placeholder('steel-forge'),
    durationSeconds: 30,
    views: 9700,
    featured: false,
    createdAt: hoursAgo(12)
  }
]

for (const clip of clips) {
  await sql`
    insert into clips (
      id, title, creator, category, video_url, thumbnail_url,
      duration_seconds, views, featured, created_at
    ) values (
      ${clip.id}, ${clip.title}, ${clip.creator}, ${clip.category},
      ${clip.videoUrl}, ${clip.thumbnailUrl}, ${clip.durationSeconds},
      ${clip.views}, ${clip.featured}, ${clip.createdAt}
    )
    on conflict (id) do update set
      title = excluded.title,
      creator = excluded.creator,
      category = excluded.category,
      video_url = excluded.video_url,
      thumbnail_url = excluded.thumbnail_url,
      duration_seconds = excluded.duration_seconds,
      views = excluded.views,
      featured = excluded.featured,
      created_at = excluded.created_at
  `
}

console.log(`Seeded ${clips.length} clips.`)
await sql.end()
