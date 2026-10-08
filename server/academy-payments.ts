import { and, eq } from 'drizzle-orm';
import { academyCourses, academyLessons, academyModules } from '../shared/schema';
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
      estimatedMinutes: course.estimatedMinutes,
      prerequisites: course.prerequisites,
    };
  });
}

export async function createAcademyCheckout(courseSlug: string, buyerEmail: string) {
  const course = await getCourseBySlug(courseSlug);
  if (course.status !== 'published') throw new AcademyPaymentError('Este curso aún no está disponible para inscripción.', 409);
  if (course.isFree) throw new AcademyPaymentError('Este curso es gratuito y no requiere pago.', 400);

  const email = buyerEmail.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new AcademyPaymentError('Ingresa un correo electrónico válido.', 400);
  const price = getEffectivePrice(course, new Date());
  if (!price || price <= 0) throw new AcademyPaymentError('El precio de este curso aún no está configurado.', 503);

  const siteUrl = getSiteUrl();
  const externalReference = `academy:${course.slug}:${email}`;
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
      metadata: { academy_course: course.slug, academy_email: email },
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
    throw new AcademyPaymentError('No se pudo iniciar el pago. Inténtalo nuevamente.', 502);
  }
  const preference = await response.json() as { init_point?: string; sandbox_init_point?: string };
  const checkoutUrl = preference.init_point || preference.sandbox_init_point;
  if (!checkoutUrl) throw new AcademyPaymentError('Mercado Pago no devolvió el enlace de pago.', 502);
  return { checkoutUrl, priceCLP: price };
}

export async function getPaidAcademyContent(courseSlug: string, paymentId: string) {
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
    metadata?: { academy_course?: string; academy_email?: string };
    external_reference?: string;
  };
  if (
    payment.status !== 'approved' || payment.transaction_amount !== price || payment.currency_id !== course.currency ||
    payment.metadata?.academy_course !== course.slug || !payment.metadata.academy_email ||
    payment.external_reference !== `academy:${course.slug}:${payment.metadata.academy_email}`
  ) {
    throw new AcademyPaymentError('El pago aún no está aprobado para este curso.', 403);
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
