CREATE TYPE "public"."clip_category" AS ENUM('Music', 'Gaming', 'Creative');--> statement-breakpoint
CREATE TABLE "clips" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"creator" text NOT NULL,
	"category" "clip_category" NOT NULL,
	"video_url" text NOT NULL,
	"thumbnail_url" text NOT NULL,
	"duration_seconds" integer NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
