CREATE TABLE IF NOT EXISTS "coin" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"idea" text NOT NULL,
	"userId" uuid,
	"text" text,
	"searchTerms" text,
	"pexelVideo" text,
	"srtFilePath" text,
	"subtitledVideo" text,
	"audioPath" text,
	"finalVideoPath" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "coin" ADD CONSTRAINT "coin_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
