CREATE TYPE "public"."reaction_target" AS ENUM('clip', 'live');--> statement-breakpoint
CREATE TYPE "public"."reaction_value" AS ENUM('like', 'dislike');--> statement-breakpoint
CREATE TABLE "comments" (
	"id" text PRIMARY KEY NOT NULL,
	"clip_id" text NOT NULL,
	"parent_id" text,
	"user_id" text,
	"author_name" text NOT NULL,
	"author_image" text,
	"body" text NOT NULL,
	"likes" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" text PRIMARY KEY NOT NULL,
	"stream_id" text NOT NULL,
	"user_id" text,
	"author_name" text NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reactions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"target_id" text NOT NULL,
	"target_kind" "reaction_target" NOT NULL,
	"value" "reaction_value" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "reactions_user_target_unique" UNIQUE("user_id","target_id")
);
--> statement-breakpoint
CREATE TABLE "follows" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"channel" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "follows_user_channel_unique" UNIQUE("user_id","channel")
);
--> statement-breakpoint
ALTER TABLE "clips" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "live_streams" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_clip_id_clips_id_fk" FOREIGN KEY ("clip_id") REFERENCES "public"."clips"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_stream_id_live_streams_id_fk" FOREIGN KEY ("stream_id") REFERENCES "public"."live_streams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reactions" ADD CONSTRAINT "reactions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "comments_clip_created_idx" ON "comments" USING btree ("clip_id","created_at");--> statement-breakpoint
CREATE INDEX "chat_messages_stream_created_idx" ON "chat_messages" USING btree ("stream_id","created_at");--> statement-breakpoint
CREATE INDEX "follows_channel_idx" ON "follows" USING btree ("channel");