import { and, eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { academyAssessmentAttempts, academyAssessments, academyCourses, academyEnrollments, academyLessons, academyModules, academyPayments } from '../shared/schema';
import { db } from './db';

export class AcademyPaymentError extends Error {
  constructor(message: string, readonly statusCode: number) {
    super(message);
    this.name = 'AcademyPaymentError';
  }
}

function requireDatabase() {
  if (!db) throw new AcademyPaymentError('La base de datos de Academia aún no está conectada.', 503);
  return db;
}

function getEffectivePrice(course: typeof academyCourses.$inferSelect, now: Date) {
  if (course.isFree) return 0;
  const promoActive = Boolean(
    course.promotionEnabled && course.launchPriceClp !== null && course.promotionStartsAt && course.promotionEndsAt &&
    course.promotionStartsAt <= now && course.promotionEndsAt >= now,
  );
  return promoActive ? course.launchPriceClp : course.regularPriceClp;
}

async function getCourseBySlug(slug: string) {
  const [course] = await requireDatabase().select().from(academyCourses).where(eq(academyCourses.slug, slug)).limit(1);
  if (!course) throw new AcademyPaymentError('El curso solicitado no existe.', 404);
  return course;
}

function getSiteUrl() {
  const configuredUrl = process.env.ACADEMY_PUBLIC_URL || process.env.PUBLIC_SITE_URL;
  if (configuredUrl) return configuredUrl.replace(/\/$/, '');
  if (process.env.NODE_ENV !== 'production') return 'http://localhost:5000';
  throw new AcademyPaymentError('La URL pública de Academia no está configurada.', 503);
}

function getAccessToken() {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) throw new AcademyPaymentError('El medio de pago aún no está configurado.', 503);
  return accessToken;
}

export async function getAcademyCatalog() {
  const courses = await requireDatabase().select().from(academyCourses);
  const now = new Date();
  return courses.map((course) => {
    const publiclyAvailable = course.status === 'preview' || course.status === 'published';
    const published = course.status === 'published';
    const promoActive = Boolean(
      published && course.promotionEnabled && course.launchPriceClp !== null && course.promotionStartsAt && course.promotionEndsAt &&
      course.promotionStartsAt <= now && course.promotionEndsAt >= now,
    );
    return {
      slug: course.slug,
      title: course.title,
      description: course.description,
      category: course.category,
      level: course.level,
      status: course.status,
      isFree: course.isFree,
      currency: course.currency,
      regularPriceCLP: published ? course.regularPriceClp : null,
      launchPriceCLP: promoActive ? course.launchPriceClp : null,
      priceCLP: published ? getEffectivePrice(course, now) : null,
      promotionActive: promoActive,
      hasPreview: publiclyAvailable,
      estimatedMinutes: course.estimatedMinutes,
      prerequisites: course.prerequisites,
    };
  });
}

export async function getAcademyPreview(courseSlug: string, studentId: number) {
  const course = await getCourseBySlug(courseSlug);
  if (course.status !== 'preview' && course.status !== 'published') throw new AcademyPaymentError('Este curso aún está en preparación.', 404);
  const database = requireDatabase();
  const [enrollment] = await database.select().from(academyEnrollments)
    .where(and(eq(academyEnrollments.studentId, studentId), eq(academyEnrollments.courseId, course.id), eq(academyEnrollments.status, 'active')))
    .limit(1);
  if (!enrollment) throw new AcademyPaymentError('Inscríbete gratis para acceder a la clase de muestra.', 403);

  const lessons = await database.select({
    title: academyLessons.title,
    description: academyLessons.description,
    content: academyLessons.content,
    videoUrl: academyLessons.videoUrl,
    materials: academyLessons.materials,
  }).from(academyLessons)
    .innerJoin(academyModules, eq(academyLessons.moduleId, academyModules.id))
    .where(and(
      eq(academyModules.courseId, course.id),
      eq(academyModules.published, true),
      eq(academyLessons.published, true),
      eq(academyLessons.isFreePreview, true),
    ))
    .orderBy(academyModules.position, academyLessons.position);
  if (lessons.length === 0) throw new AcademyPaymentError('La clase de muestra aún no está publicada.', 404);

  const [assessment] = await database.select({
    id: academyAssessments.id,
    title: academyAssessments.title,
    passingPercent: academyAssessments.passingPercent,
    questions: academyAssessments.questions,
  }).from(academyAssessments)
    .innerJoin(academyModules, eq(academyAssessments.moduleId, academyModules.id))
    .where(and(
      eq(academyModules.courseId, course.id),
      eq(academyModules.published, true),
      eq(academyAssessments.published, true),
    ))
    .limit(1);

  return {
    course,
    lessons,
    assessment: assessment ? {
      id: assessment.id,
      title: assessment.title,
      passingPercent: assessment.passingPercent,
      questions: assessment.questions.map(({ prompt, options }) => ({ prompt, options })),
    } : null,
  };
}

export async function submitAcademyAssessment(courseSlug: string, studentId: number, assessmentId: number, answers: number[]) {
  const database = requireDatabase();
  const course = await getCourseBySlug(courseSlug);
  if (course.status !== 'preview' && course.status !== 'published') throw new AcademyPaymentError('Este curso aún no está disponible.', 404);
  const [enrollment] = await database.select().from(academyEnrollments)
    .where(and(eq(academyEnrollments.studentId, studentId), eq(academyEnrollments.courseId, course.id), eq(academyEnrollments.status, 'active')))
    .limit(1);
  if (!enrollment) throw new AcademyPaymentError('Inscríbete al curso antes de rendir la evaluación.', 403);

  const [assessment] = await database.select({ assessment: academyAssessments })
    .from(academyAssessments)
    .innerJoin(academyModules, eq(academyAssessments.moduleId, academyModules.id))
    .where(and(
      eq(academyAssessments.id, assessmentId),
      eq(academyAssessments.published, true),
      eq(academyModules.courseId, course.id),
      eq(academyModules.published, true),
    ))
    .limit(1);
  if (!assessment) throw new AcademyPaymentError('La evaluación solicitada no está disponible.', 404);
  const questions = assessment.assessment.questions;
  if (answers.length !== questions.length || answers.some((answer, index) => !Number.isInteger(answer) || answer < 0 || answer >= questions[index].options.length)) {
    throw new AcademyPaymentError('Las respuestas no coinciden con esta evaluación.', 400);
  }
  const correct = answers.reduce((count, answer, index) => count + (answer === questions[index].correctOption ? 1 : 0), 0);
  const scorePercent = Math.round((correct / questions.length) * 100);
  const passed = scorePercent >= assessment.assessment.passingPercent;
  await database.insert(academyAssessmentAttempts).values({ assessmentId, studentId, answers, scorePercent, passed });
  return {
    scorePercent,
    passed,
    passingPercent: assessment.assessment.passingPercent,
    review: questions.map((question, index) => ({
      prompt: question.prompt,
      correct: answers[index] === question.correctOption,
      explanation: question.explanation || '',
    })),
  };
}

export async function createAcademyCheckout(courseSlug: string, student: { studentId: number; email: string }) {
  const course = await getCourseBySlug(courseSlug);
  if (course.status !== 'published') throw new AcademyPaymentError('Este curso aún no está disponible para inscripción.', 409);
  if (course.isFree) throw new AcademyPaymentError('Este curso es gratuito y no requiere pago.', 400);

  const email = student.email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new AcademyPaymentError('Ingresa un correo electrónico válido.', 400);
  const price = getEffectivePrice(course, new Date());
  if (!price || price <= 0) throw new AcademyPaymentError('El precio de este curso aún no está configurado.', 503);

  const database = requireDatabase();
  const [enrollment] = await database.select().from(academyEnrollments)
    .where(and(eq(academyEnrollments.studentId, student.studentId), eq(academyEnrollments.courseId, course.id), eq(academyEnrollments.status, 'active')))
    .limit(1);
  if (!enrollment) throw new AcademyPaymentError('Primero inscríbete al curso para continuar.', 403);
  if (enrollment.accessType === 'paid' && enrollment.expiresAt && enrollment.expiresAt > new Date()) {
    throw new AcademyPaymentError('Ya tienes acceso activo a este curso.', 409);
  }

  const pendingCutoff = new Date(Date.now() - 30 * 60 * 1000);
  const [pendingPayment] = await database.select().from(academyPayments)
    .where(and(eq(academyPayments.enrollmentId, enrollment.id), eq(academyPayments.status, 'pending')))
    .limit(1);
  if (pendingPayment && pendingPayment.createdAt > pendingCutoff) {
    if (!pendingPayment.preferenceId) throw new AcademyPaymentError('Estamos iniciando tu pago. Espera un momento y vuelve a intentarlo.', 409);
    const preferenceResponse = await fetch(`https://api.mercadopago.com/checkout/preferences/${encodeURIComponent(pendingPayment.preferenceId)}`, {
      headers: { Authorization: `Bearer ${getAccessToken()}` },
    });
    if (!preferenceResponse.ok) throw new AcademyPaymentError('Ya hay un pago pendiente para este curso. Espera 30 minutos y vuelve a intentar.', 409);
    const existingPreference = await preferenceResponse.json() as { init_point?: string; sandbox_init_point?: string };
    const existingCheckoutUrl = existingPreference.init_point || existingPreference.sandbox_init_point;
    if (existingCheckoutUrl) return { checkoutUrl: existingCheckoutUrl, priceCLP: pendingPayment.amountClp };
    throw new AcademyPaymentError('El pago anterior sigue pendiente. Espera 30 minutos y vuelve a intentar.', 409);
  }
  if (pendingPayment) {
    await database.update(academyPayments).set({ status: 'expired', updatedAt: new Date() })
      .where(eq(academyPayments.id, pendingPayment.id));
  }

  const siteUrl = getSiteUrl();
  const externalReference = `academy:${course.slug}:${randomUUID()}`;
  const [newPayment] = await database.insert(academyPayments).values({
    enrollmentId: enrollment.id,
    externalReference,
    amountClp: price,
    currency: course.currency,
    status: 'pending',
  }).returning({ id: academyPayments.id });

  const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      items: [{ id: course.slug, title: course.title, quantity: 1, currency_id: course.currency, unit_price: price }],
      payer: { email },
      external_reference: externalReference,
      metadata: { academy_course: course.slug, academy_email: email, academy_student_id: student.studentId, academy_enrollment_id: enrollment.id },
      back_urls: {
        success: `${siteUrl}/academia/aula/${course.slug}`,
        failure: `${siteUrl}/academia/aula/${course.slug}`,
        pending: `${siteUrl}/academia/aula/${course.slug}`,
      },
      auto_return: 'approved',
    }),
  });

  if (!response.ok) {
    console.error('Mercado Pago preference error:', response.status, await response.text());
    await database.update(academyPayments).set({ status: 'failed', updatedAt: new Date() }).where(eq(academyPayments.id, newPayment.id));
    throw new AcademyPaymentError('No se pudo iniciar el pago. Inténtalo nuevamente.', 502);
  }
  const preference = await response.json() as { id?: string; init_point?: string; sandbox_init_point?: string };
  const checkoutUrl = preference.init_point || preference.sandbox_init_point;
  if (!checkoutUrl || !preference.id) {
    await database.update(academyPayments).set({ status: 'failed', updatedAt: new Date() }).where(eq(academyPayments.id, newPayment.id));
    throw new AcademyPaymentError('Mercado Pago no devolvió el enlace de pago.', 502);
  }
  await database.update(academyPayments).set({ preferenceId: preference.id, updatedAt: new Date() }).where(eq(academyPayments.id, newPayment.id));
  return { checkoutUrl, priceCLP: price };
}

export async function getPaidAcademyContent(courseSlug: string, paymentId: string, student: { studentId: number; email: string }) {
  const course = await getCourseBySlug(courseSlug);
  if (course.status !== 'published') throw new AcademyPaymentError('Este curso aún no está disponible.', 404);
  if (!/^\d{6,30}$/.test(paymentId)) throw new AcademyPaymentError('Identificador de pago inválido.', 400);
  const price = getEffectivePrice(course, new Date());
  if (!price || price <= 0) throw new AcademyPaymentError('El precio de este curso aún no está configurado.', 503);

  const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${getAccessToken()}` },
  });
  if (!response.ok) {
    console.error('Mercado Pago payment lookup error:', response.status, await response.text());
    throw new AcademyPaymentError('No se pudo verificar el pago todavía.', 502);
  }

  const payment = await response.json() as {
    status?: string;
    transaction_amount?: number;
    currency_id?: string;
    preference_id?: string;
    metadata?: { academy_course?: string; academy_email?: string; academy_student_id?: number; academy_enrollment_id?: number };
    external_reference?: string;
    fee_details?: Array<{ amount?: number }>;
  };
  if (payment.status !== 'approved' || payment.currency_id !== course.currency ||
    payment.metadata?.academy_course !== course.slug || payment.metadata?.academy_email?.toLowerCase() !== student.email.toLowerCase() ||
    Number(payment.metadata.academy_student_id) !== student.studentId || !payment.external_reference) {
    throw new AcademyPaymentError('El pago aún no está aprobado para este curso.', 403);
  }

  const database = requireDatabase();
  const [storedPayment] = await database.select({ payment: academyPayments, enrollment: academyEnrollments })
    .from(academyPayments)
    .innerJoin(academyEnrollments, eq(academyPayments.enrollmentId, academyEnrollments.id))
    .where(eq(academyPayments.externalReference, payment.external_reference))
    .limit(1);
  if (!storedPayment || storedPayment.enrollment.studentId !== student.studentId || storedPayment.enrollment.courseId !== course.id ||
    storedPayment.payment.status === 'refunded' || payment.transaction_amount !== storedPayment.payment.amountClp) {
    throw new AcademyPaymentError('El pago no corresponde a una matrícula válida.', 403);
  }

  if (storedPayment.payment.status !== 'approved') {
    const paidAt = new Date();
    const expiresAt = new Date(paidAt);
    expiresAt.setUTCFullYear(expiresAt.getUTCFullYear() + 1);
    await database.transaction(async (tx) => {
      const approved = await tx.update(academyPayments).set({
        providerPaymentId: paymentId,
        status: 'approved',
        paidAt,
        providerFeeClp: Math.round((payment.fee_details || []).reduce((sum, fee) => sum + (fee.amount || 0), 0)),
        updatedAt: paidAt,
      }).where(and(eq(academyPayments.id, storedPayment.payment.id), eq(academyPayments.status, 'pending')))
        .returning({ id: academyPayments.id });
      if (approved.length > 0) {
        await tx.update(academyEnrollments).set({
          status: 'active',
          accessType: 'paid',
          purchasedAt: paidAt,
          expiresAt,
        }).where(eq(academyEnrollments.id, storedPayment.enrollment.id));
      }
    });
  }

  const [activeEnrollment] = await database.select().from(academyEnrollments).where(eq(academyEnrollments.id, storedPayment.enrollment.id)).limit(1);
  if (!activeEnrollment || activeEnrollment.status !== 'active' || !activeEnrollment.expiresAt || activeEnrollment.expiresAt <= new Date()) {
    throw new AcademyPaymentError('El acceso a este curso venció. Renueva tu matrícula para continuar.', 403);
  }

  const lessons = await requireDatabase().select({ title: academyLessons.title, content: academyLessons.content })
    .from(academyLessons)
    .innerJoin(academyModules, eq(academyLessons.moduleId, academyModules.id))
    .where(and(
      eq(academyModules.courseId, course.id),
      eq(academyModules.published, true),
      eq(academyLessons.published, true),
      eq(academyLessons.isFreePreview, false),
    ))
    .orderBy(academyModules.position, academyLessons.position);
  if (lessons.length === 0) throw new AcademyPaymentError('El contenido del curso aún no está disponible.', 404);
  return { course: course.slug, lessons };
}
