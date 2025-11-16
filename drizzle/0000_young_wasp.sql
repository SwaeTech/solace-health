CREATE TABLE IF NOT EXISTS "advocate_focus_areas" (
	"advocate_id" integer NOT NULL,
	"focus_area_id" integer NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "advocate_focus_areas_advocate_id_focus_area_id_pk" PRIMARY KEY("advocate_id","focus_area_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "advocates" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"city" text NOT NULL,
	"degree" text NOT NULL,
	"years_of_experience" integer NOT NULL,
	"phone_number" bigint NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "focus_areas" (
	"id" serial PRIMARY KEY NOT NULL,
	"specialty_id" integer NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "specialties" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "specialties_name_unique" UNIQUE("name")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "advocate_focus_areas" ADD CONSTRAINT "advocate_focus_areas_advocate_id_advocates_id_fk" FOREIGN KEY ("advocate_id") REFERENCES "public"."advocates"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "advocate_focus_areas" ADD CONSTRAINT "advocate_focus_areas_focus_area_id_focus_areas_id_fk" FOREIGN KEY ("focus_area_id") REFERENCES "public"."focus_areas"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "focus_areas" ADD CONSTRAINT "focus_areas_specialty_id_specialties_id_fk" FOREIGN KEY ("specialty_id") REFERENCES "public"."specialties"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "advocate_focus_area_advocate_idx" ON "advocate_focus_areas" USING btree ("advocate_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "advocate_focus_area_focus_idx" ON "advocate_focus_areas" USING btree ("focus_area_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "advocates" USING btree ("first_name","last_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "city_idx" ON "advocates" USING btree ("city");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "focus_area_specialty_idx" ON "focus_areas" USING btree ("specialty_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "focus_area_name_idx" ON "focus_areas" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "specialty_name_idx" ON "specialties" USING btree ("name");