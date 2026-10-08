import { pgTable, text, serial, integer, boolean, timestamp, jsonb, uniqueIndex, index, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  interest: text("interest").notNull(),
  source: text("source").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chatSessions = pgTable("chat_sessions", {
  id: serial("id").primaryKey(),
  userMessage: text("user_message").notNull(),
  assistantResponse: text("assistant_response").notNull(),
  userName: text("user_name"),
  userEmail: text("user_email"),
  userCompany: text("user_company"),
  conversationSummary: text("conversation_summary"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Academia: tables are additive so existing ArkoData users, leads and chats remain untouched.
export const academyStudents = pgTable("academy_students", {
  id: serial("id").primaryKey(),
  authUserId: uuid("auth_user_id").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull().default("student"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("academy_students_auth_user_unique").on(table.authUserId),
  uniqueIndex("academy_students_email_unique").on(table.email),
]);

export const academyCompanies = pgTable("academy_companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  contactName: text("contact_name"),
  contactEmail: text("contact_email"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const academyCourses = pgTable("academy_courses", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  category: text("category").notNull().default("General"),
  level: text("level").notNull().default("pending"),
  prerequisites: text("prerequisites").array().notNull().default([]),
  estimatedMinutes: integer("estimated_minutes"),
  modality: text("modality").notNull().default("self_paced"),
  status: text("status").notNull().default("coming_soon"),
  isFree: boolean("is_free").notNull().default(false),
  regularPriceClp: integer("regular_price_clp"),
  launchPriceClp: integer("launch_price_clp"),
  promotionEnabled: boolean("promotion_enabled").notNull().default(false),
  promotionStartsAt: timestamp("promotion_starts_at"),
  promotionEndsAt: timestamp("promotion_ends_at"),
  currency: text("currency").notNull().default("CLP"),
  taxTreatment: text("tax_treatment").notNull().default("pending_review"),
  certificateEnabled: boolean("certificate_enabled").notNull().default(false),
  certificatePassPercent: integer("certificate_pass_percent").notNull().default(80),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("academy_courses_slug_unique").on(table.slug),
  index("academy_courses_status_idx").on(table.status),
]);

export const academyModules = pgTable("academy_modules", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => academyCourses.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  position: integer("position").notNull().default(0),
  isRequired: boolean("is_required").notNull().default(true),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [index("academy_modules_course_position_idx").on(table.courseId, table.position)]);

export const academyLessons = pgTable("academy_lessons", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").notNull().references(() => academyModules.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  content: text("content").notNull().default(""),
  videoUrl: text("video_url"),
  materials: jsonb("materials").$type<Array<{ title: string; url: string; type: string }>>().notNull().default([]),
  position: integer("position").notNull().default(0),
  isFreePreview: boolean("is_free_preview").notNull().default(false),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [index("academy_lessons_module_position_idx").on(table.moduleId, table.position)]);

export const academyEnrollments = pgTable("academy_enrollments", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => academyStudents.id, { onDelete: "cascade" }),
  courseId: integer("course_id").notNull().references(() => academyCourses.id, { onDelete: "cascade" }),
  companyId: integer("company_id").references(() => academyCompanies.id, { onDelete: "set null" }),
  status: text("status").notNull().default("active"),
  accessType: text("access_type").notNull().default("free"),
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
  purchasedAt: timestamp("purchased_at"),
  expiresAt: timestamp("expires_at"),
  completedAt: timestamp("completed_at"),
}, (table) => [
  uniqueIndex("academy_enrollments_student_course_unique").on(table.studentId, table.courseId),
  index("academy_enrollments_student_status_idx").on(table.studentId, table.status),
]);

export const academyPayments = pgTable("academy_payments", {
  id: serial("id").primaryKey(),
  enrollmentId: integer("enrollment_id").notNull().references(() => academyEnrollments.id, { onDelete: "restrict" }),
  provider: text("provider").notNull().default("mercado_pago"),
  preferenceId: text("preference_id"),
  providerPaymentId: text("provider_payment_id"),
  externalReference: text("external_reference").notNull(),
  status: text("status").notNull().default("pending"),
  amountClp: integer("amount_clp").notNull(),
  currency: text("currency").notNull().default("CLP"),
  providerFeeClp: integer("provider_fee_clp"),
  paidAt: timestamp("paid_at"),
  refundedAt: timestamp("refunded_at"),
  refundAmountClp: integer("refund_amount_clp"),
  providerData: jsonb("provider_data").$type<Record<string, unknown>>().notNull().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("academy_payments_preference_unique").on(table.preferenceId),
  uniqueIndex("academy_payments_provider_payment_unique").on(table.provider, table.providerPaymentId),
  uniqueIndex("academy_payments_external_reference_unique").on(table.externalReference),
  index("academy_payments_status_created_idx").on(table.status, table.createdAt),
]);

export const academyProgress = pgTable("academy_progress", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => academyStudents.id, { onDelete: "cascade" }),
  lessonId: integer("lesson_id").notNull().references(() => academyLessons.id, { onDelete: "cascade" }),
  completed: boolean("completed").notNull().default(false),
  videoPositionSeconds: integer("video_position_seconds").notNull().default(0),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("academy_progress_student_lesson_unique").on(table.studentId, table.lessonId),
  index("academy_progress_student_updated_idx").on(table.studentId, table.updatedAt),
]);

export const academyAssessments = pgTable("academy_assessments", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").notNull().references(() => academyModules.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  questions: jsonb("questions").$type<Array<{ prompt: string; options: string[]; correctOption: number; explanation?: string }>>().notNull().default([]),
  passingPercent: integer("passing_percent").notNull().default(80),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const academyAssessmentAttempts = pgTable("academy_assessment_attempts", {
  id: serial("id").primaryKey(),
  assessmentId: integer("assessment_id").notNull().references(() => academyAssessments.id, { onDelete: "cascade" }),
  studentId: integer("student_id").notNull().references(() => academyStudents.id, { onDelete: "cascade" }),
  answers: jsonb("answers").$type<number[]>().notNull().default([]),
  scorePercent: integer("score_percent").notNull(),
  passed: boolean("passed").notNull().default(false),
  attemptedAt: timestamp("attempted_at").defaultNow().notNull(),
}, (table) => [index("academy_assessment_attempts_student_time_idx").on(table.studentId, table.attemptedAt)]);

export const academyCertificates = pgTable("academy_certificates", {
  id: serial("id").primaryKey(),
  enrollmentId: integer("enrollment_id").notNull().references(() => academyEnrollments.id, { onDelete: "restrict" }),
  verificationCode: text("verification_code").notNull(),
  issuedAt: timestamp("issued_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("academy_certificates_enrollment_unique").on(table.enrollmentId),
  uniqueIndex("academy_certificates_verification_code_unique").on(table.verificationCode),
]);

export const academySupportRequests = pgTable("academy_support_requests", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => academyStudents.id, { onDelete: "set null" }),
  courseId: integer("course_id").references(() => academyCourses.id, { onDelete: "set null" }),
  category: text("category").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("open"),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at"),
}, (table) => [index("academy_support_status_created_idx").on(table.status, table.createdAt)]);

export const academyTutorUsage = pgTable("academy_tutor_usage", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => academyStudents.id, { onDelete: "cascade" }),
  courseId: integer("course_id").references(() => academyCourses.id, { onDelete: "set null" }),
  moduleId: integer("module_id").references(() => academyModules.id, { onDelete: "set null" }),
  provider: text("provider").notNull(),
  model: text("model").notNull(),
  inputTokens: integer("input_tokens").notNull().default(0),
  outputTokens: integer("output_tokens").notNull().default(0),
  estimatedCostClp: integer("estimated_cost_clp").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [index("academy_tutor_usage_student_created_idx").on(table.studentId, table.createdAt)]);

export const academyCompanySeats = pgTable("academy_company_seats", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().references(() => academyCompanies.id, { onDelete: "cascade" }),
  courseId: integer("course_id").notNull().references(() => academyCourses.id, { onDelete: "cascade" }),
  seatCount: integer("seat_count").notNull().default(1),
  startsAt: timestamp("starts_at").defaultNow().notNull(),
  endsAt: timestamp("ends_at"),
  status: text("status").notNull().default("active"),
}, (table) => [index("academy_company_seats_company_status_idx").on(table.companyId, table.status)]);

export const academyCoupons = pgTable("academy_coupons", {
  id: serial("id").primaryKey(),
  code: text("code").notNull(),
  discountType: text("discount_type").notNull().default("percent"),
  discountValue: integer("discount_value").notNull(),
  startsAt: timestamp("starts_at"),
  endsAt: timestamp("ends_at"),
  usageLimit: integer("usage_limit"),
  usageCount: integer("usage_count").notNull().default(0),
  active: boolean("active").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [uniqueIndex("academy_coupons_code_unique").on(table.code)]);

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
});

export const insertChatSessionSchema = createInsertSchema(chatSessions).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;
export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;
export type ChatSession = typeof chatSessions.$inferSelect;
