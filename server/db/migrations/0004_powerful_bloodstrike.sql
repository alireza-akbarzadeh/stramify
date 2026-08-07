CREATE TABLE "channels" (
	"handle" text PRIMARY KEY NOT NULL,
	"display_name" text NOT NULL,
	"tagline" text,
	"bio" text,
	"avatar_url" text,
	"banner_url" text,
	"website_url" text,
	"location" text,
	"verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comment_likes" (
	"id" text PRIMARY KEY NOT NULL,
	"comment_id" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "comment_likes_user_comment_unique" UNIQUE("user_id","comment_id")
);
--> statement-breakpoint
CREATE TABLE "notification_reads" (
	"user_id" text PRIMARY KEY NOT NULL,
	"read_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "comment_likes" ADD CONSTRAINT "comment_likes_comment_id_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment_likes" ADD CONSTRAINT "comment_likes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_reads" ADD CONSTRAINT "notification_reads_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;