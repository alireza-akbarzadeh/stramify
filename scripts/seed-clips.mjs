// Seeds the `clips` table with real, freely-licensed sample videos (Blender
// Foundation open movies + Google's public test bucket) so the discovery
// feed has genuinely playable content before creator uploads exist.
// Run with: npm run db:seed
import postgres from 'postgres'

const sql = postgres(process.env.DATABASE_URL ?? '', { max: 1 })

const bucket = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample'
const placeholder = (seed) => `https://picsum.photos/seed/${seed}/960/540`
const hoursAgo = (h) => new Date(Date.now() - h * 60 * 60 * 1000)

const clips = [
  {
    id: 'clip-midnight-echo',
    title: 'The Midnight Echo: Unrehearsed Encore at Tokyo Dome',
    creator: 'EchoCollective',
    category: 'Music',
    videoUrl: `${bucket}/Sintel.mp4`,
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
    videoUrl: `${bucket}/ForBiggerBlazes.mp4`,
    thumbnailUrl: placeholder('triple-kill'),
    durationSeconds: 45,
    views: 14200,
    featured: false,
    createdAt: hoursAgo(2)
  },
  {
    id: 'clip-modular-synthesis',
    title: 'Modular Synthesis Peak Moment',
    creator: 'Patch_Bay',
    category: 'Music',
    videoUrl: `${bucket}/ForBiggerJoyrides.mp4`,
    thumbnailUrl: placeholder('modular-synthesis'),
    durationSeconds: 80,
    views: 8900,
    featured: false,
    createdAt: hoursAgo(4)
  },
  {
    id: 'clip-rendering',
    title: 'Rendering the Final Details',
    creator: 'Canvas_Queen',
    category: 'Creative',
    videoUrl: `${bucket}/ElephantsDream.mp4`,
    thumbnailUrl: placeholder('rendering-details'),
    durationSeconds: 192,
    views: 22100,
    featured: false,
    createdAt: hoursAgo(1)
  },
  {
    id: 'clip-golden-hour',
    title: 'Chasing the Golden Hour Light',
    creator: 'Sky_High',
    category: 'Creative',
    videoUrl: `${bucket}/ForBiggerFun.mp4`,
    thumbnailUrl: placeholder('golden-hour'),
    durationSeconds: 58,
    views: 1500,
    featured: false,
    createdAt: hoursAgo(5)
  },
  {
    id: 'clip-street-run',
    title: 'Dirt to Street in Under a Minute',
    creator: 'Subaru_Nomad',
    category: 'Gaming',
    videoUrl: `${bucket}/SubaruOutbackOnStreetAndDirt.mp4`,
    thumbnailUrl: placeholder('street-run'),
    durationSeconds: 596,
    views: 6300,
    featured: false,
    createdAt: hoursAgo(8)
  },
  {
    id: 'clip-steel-forge',
    title: 'Forging the Final Cut',
    creator: 'Canvas_Queen',
    category: 'Creative',
    videoUrl: `${bucket}/TearsOfSteel.mp4`,
    thumbnailUrl: placeholder('steel-forge'),
    durationSeconds: 734,
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
