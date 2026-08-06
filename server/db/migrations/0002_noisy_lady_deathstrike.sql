CREATE TABLE "live_streams" (
	"id" text PRIMARY KEY NOT NULL,
	"streamer_name" text NOT NULL,
	"title" text NOT NULL,
	"category" "clip_category" NOT NULL,
	"video_url" text NOT NULL,
	"thumbnail_url" text NOT NULL,
	"viewer_count" integer DEFAULT 0 NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
