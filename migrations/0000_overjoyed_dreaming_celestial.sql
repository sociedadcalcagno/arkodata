CREATE TABLE "academy_assessment_attempts" (
	"id" serial PRIMARY KEY NOT NULL,
	"assessment_id" integer NOT NULL,
	"student_id" integer NOT NULL,
	"answers" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"score_percent" integer NOT NULL,
	"passed" boolean DEFAULT false NOT NULL,
	"attempted_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "academy_assessments" (
	"id" serial PRIMARY KEY NOT NULL,
	"module_id" integer NOT NULL,
	"title" text NOT NULL,
	"questions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"passing_percent" integer DEFAULT 80 NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "academy_certificates" (
	"id" serial PRIMARY KEY NOT NULL,
	"enrollment_id" integer NOT NULL,
	"verification_code" text NOT NULL,
	"issued_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "academy_companies" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"contact_name" text,
	"contact_email" text,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "academy_company_seats" (
	"id" serial PRIMARY KEY NOT NULL,
	"company_id" integer NOT NULL,
	"course_id" integer NOT NULL,
	"seat_count" integer DEFAULT 1 NOT NULL,
	"starts_at" timestamp DEFAULT now() NOT NULL,
	"ends_at" timestamp,
	"status" text DEFAULT 'active' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "academy_coupons" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"discount_type" text DEFAULT 'percent' NOT NULL,
	"discount_value" integer NOT NULL,
	"starts_at" timestamp,
	"ends_at" timestamp,
	"usage_limit" integer,
	"usage_count" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "academy_courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"category" text DEFAULT 'General' NOT NULL,
	"level" text DEFAULT 'pending' NOT NULL,
	"prerequisites" text[] DEFAULT '{}' NOT NULL,
	"estimated_minutes" integer,
	"modality" text DEFAULT 'self_paced' NOT NULL,
	"status" text DEFAULT 'coming_soon' NOT NULL,
	"is_free" boolean DEFAULT false NOT NULL,
	"regular_price_clp" integer,
	"launch_price_clp" integer,
	"promotion_enabled" boolean DEFAULT false NOT NULL,
	"promotion_starts_at" timestamp,
	"promotion_ends_at" timestamp,
	"currency" text DEFAULT 'CLP' NOT NULL,
	"tax_treatment" text DEFAULT 'pending_review' NOT NULL,
	"certificate_enabled" boolean DEFAULT false NOT NULL,
	"certificate_pass_percent" integer DEFAULT 80 NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "academy_enrollments" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"course_id" integer NOT NULL,
	"company_id" integer,
	"status" text DEFAULT 'active' NOT NULL,
	"access_type" text DEFAULT 'free' NOT NULL,
	"enrolled_at" timestamp DEFAULT now() NOT NULL,
	"purchased_at" timestamp,
	"expires_at" timestamp,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "academy_lessons" (
	"id" serial PRIMARY KEY NOT NULL,
	"module_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"video_url" text,
	"materials" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"is_free_preview" boolean DEFAULT false NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "academy_modules" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"is_required" boolean DEFAULT true NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "academy_payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"enrollment_id" integer NOT NULL,
	"provider" text DEFAULT 'mercado_pago' NOT NULL,
	"preference_id" text,
	"provider_payment_id" text,
	"external_reference" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"amount_clp" integer NOT NULL,
	"currency" text DEFAULT 'CLP' NOT NULL,
	"provider_fee_clp" integer,
	"paid_at" timestamp,
	"refunded_at" timestamp,
	"refund_amount_clp" integer,
	"provider_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "academy_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"lesson_id" integer NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"video_position_seconds" integer DEFAULT 0 NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "academy_students" (
	"id" serial PRIMARY KEY NOT NULL,
	"auth_user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"role" text DEFAULT 'student' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "academy_support_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer,
	"course_id" integer,
	"category" text NOT NULL,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"resolved_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "academy_tutor_usage" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"course_id" integer,
	"module_id" integer,
	"provider" text NOT NULL,
	"model" text NOT NULL,
	"input_tokens" integer DEFAULT 0 NOT NULL,
	"output_tokens" integer DEFAULT 0 NOT NULL,
	"estimated_cost_clp" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "academy_assessment_attempts" ADD CONSTRAINT "academy_assessment_attempts_assessment_id_academy_assessments_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."academy_assessments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_assessment_attempts" ADD CONSTRAINT "academy_assessment_attempts_student_id_academy_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."academy_students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_assessments" ADD CONSTRAINT "academy_assessments_module_id_academy_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."academy_modules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_certificates" ADD CONSTRAINT "academy_certificates_enrollment_id_academy_enrollments_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."academy_enrollments"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_company_seats" ADD CONSTRAINT "academy_company_seats_company_id_academy_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."academy_companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_company_seats" ADD CONSTRAINT "academy_company_seats_course_id_academy_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."academy_courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_enrollments" ADD CONSTRAINT "academy_enrollments_student_id_academy_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."academy_students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_enrollments" ADD CONSTRAINT "academy_enrollments_course_id_academy_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."academy_courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_enrollments" ADD CONSTRAINT "academy_enrollments_company_id_academy_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."academy_companies"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_lessons" ADD CONSTRAINT "academy_lessons_module_id_academy_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."academy_modules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_modules" ADD CONSTRAINT "academy_modules_course_id_academy_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."academy_courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_payments" ADD CONSTRAINT "academy_payments_enrollment_id_academy_enrollments_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."academy_enrollments"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_progress" ADD CONSTRAINT "academy_progress_student_id_academy_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."academy_students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_progress" ADD CONSTRAINT "academy_progress_lesson_id_academy_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."academy_lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_support_requests" ADD CONSTRAINT "academy_support_requests_student_id_academy_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."academy_students"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_support_requests" ADD CONSTRAINT "academy_support_requests_course_id_academy_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."academy_courses"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_tutor_usage" ADD CONSTRAINT "academy_tutor_usage_student_id_academy_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."academy_students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_tutor_usage" ADD CONSTRAINT "academy_tutor_usage_course_id_academy_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."academy_courses"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_tutor_usage" ADD CONSTRAINT "academy_tutor_usage_module_id_academy_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."academy_modules"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "academy_assessment_attempts_student_time_idx" ON "academy_assessment_attempts" USING btree ("student_id","attempted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "academy_certificates_enrollment_unique" ON "academy_certificates" USING btree ("enrollment_id");--> statement-breakpoint
CREATE UNIQUE INDEX "academy_certificates_verification_code_unique" ON "academy_certificates" USING btree ("verification_code");--> statement-breakpoint
CREATE INDEX "academy_company_seats_company_status_idx" ON "academy_company_seats" USING btree ("company_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "academy_coupons_code_unique" ON "academy_coupons" USING btree ("code");--> statement-breakpoint
CREATE UNIQUE INDEX "academy_courses_slug_unique" ON "academy_courses" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "academy_courses_status_idx" ON "academy_courses" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "academy_enrollments_student_course_unique" ON "academy_enrollments" USING btree ("student_id","course_id");--> statement-breakpoint
CREATE INDEX "academy_enrollments_student_status_idx" ON "academy_enrollments" USING btree ("student_id","status");--> statement-breakpoint
CREATE INDEX "academy_lessons_module_position_idx" ON "academy_lessons" USING btree ("module_id","position");--> statement-breakpoint
CREATE INDEX "academy_modules_course_position_idx" ON "academy_modules" USING btree ("course_id","position");--> statement-breakpoint
CREATE UNIQUE INDEX "academy_payments_preference_unique" ON "academy_payments" USING btree ("preference_id");--> statement-breakpoint
CREATE UNIQUE INDEX "academy_payments_provider_payment_unique" ON "academy_payments" USING btree ("provider","provider_payment_id");--> statement-breakpoint
CREATE UNIQUE INDEX "academy_payments_external_reference_unique" ON "academy_payments" USING btree ("external_reference");--> statement-breakpoint
CREATE INDEX "academy_payments_status_created_idx" ON "academy_payments" USING btree ("status","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "academy_progress_student_lesson_unique" ON "academy_progress" USING btree ("student_id","lesson_id");--> statement-breakpoint
CREATE INDEX "academy_progress_student_updated_idx" ON "academy_progress" USING btree ("student_id","updated_at");--> statement-breakpoint
CREATE UNIQUE INDEX "academy_students_auth_user_unique" ON "academy_students" USING btree ("auth_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "academy_students_email_unique" ON "academy_students" USING btree ("email");--> statement-breakpoint
CREATE INDEX "academy_support_status_created_idx" ON "academy_support_requests" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "academy_tutor_usage_student_created_idx" ON "academy_tutor_usage" USING btree ("student_id","created_at");
--> statement-breakpoint
-- Suggested starting prices. These courses remain unpublished and promotions disabled.
INSERT INTO "academy_courses" (
	"slug", "title", "category", "status", "is_free", "regular_price_clp",
	"launch_price_clp", "promotion_enabled", "currency", "tax_treatment"
) VALUES
	('inteligencia-artificial', 'Inteligencia Artificial aplicada', 'IA y automatización', 'coming_soon', false, 39900, 24900, false, 'CLP', 'pending_review'),
	('automatizacion-workflows', 'Automatización (n8n, RPA, workflows)', 'IA y automatización', 'coming_soon', false, 49900, 29900, false, 'CLP', 'pending_review'),
	('business-intelligence', 'Business Intelligence / Power BI', 'Datos y analítica', 'coming_soon', false, 39900, 24900, false, 'CLP', 'pending_review'),
	('bases-datos-sql', 'Bases de Datos / SQL / PostgreSQL', 'Datos y desarrollo', 'coming_soon', false, 34900, 19900, false, 'CLP', 'pending_review'),
	('desarrollo-web-apis', 'Desarrollo de Software / APIs', 'Datos y desarrollo', 'coming_soon', false, 49900, 29900, false, 'CLP', 'pending_review'),
	('cloud-devops', 'Cloud & DevOps', 'Datos y desarrollo', 'coming_soon', false, 49900, 29900, false, 'CLP', 'pending_review'),
	('gestion-documental', 'Gestión Documental / OCR / IA', 'Negocio y operaciones', 'coming_soon', false, 39900, 24900, false, 'CLP', 'pending_review'),
	('tecnologia-salud', 'Salud / Gestión de Honorarios Médicos', 'Negocio y operaciones', 'coming_soon', false, 49900, 29900, false, 'CLP', 'pending_review')
ON CONFLICT ("slug") DO NOTHING;
--> statement-breakpoint
ALTER TABLE "academy_assessment_attempts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "academy_assessments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "academy_certificates" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "academy_companies" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "academy_company_seats" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "academy_coupons" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "academy_courses" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "academy_enrollments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "academy_lessons" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "academy_modules" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "academy_payments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "academy_progress" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "academy_students" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "academy_support_requests" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "academy_tutor_usage" ENABLE ROW LEVEL SECURITY;
