import { and, eq } from 'drizzle-orm';
import { academyCourses, academyEnrollments } from '../../shared/schema';
import { AcademyAuthError, getAcademyIdentity } from '../../server/academy-auth';
import { db } from '../../server/db';

export async function handler(event: { httpMethod: string; headers?: Record<string, string | undefined>; body?: string | null }) {
  const json = (statusCode: number, body: unknown) => ({ statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (event.httpMethod !== 'POST') return json(405, { message: 'Method not allowed' });
  try {
    const identity = await getAcademyIdentity(event.headers?.authorization || event.headers?.Authorization);
    const payload = JSON.parse(event.body || '{}') as { courseSlug?: unknown };
    if (typeof payload.courseSlug !== 'string' || !db) return json(400, { message: 'El curso solicitado no es válido.' });
    const [course] = await db.select().from(academyCourses).where(eq(academyCourses.slug, payload.courseSlug)).limit(1);
    if (!course || course.status !== 'published') return json(404, { message: 'Este curso aún no está disponible para inscripción.' });

    await db.insert(academyEnrollments).values({
      studentId: identity.studentId,
      courseId: course.id,
      status: 'active',
      accessType: course.isFree ? 'free' : 'preview',
    }).onConflictDoNothing({ target: [academyEnrollments.studentId, academyEnrollments.courseId] });
    const [enrollment] = await db.select().from(academyEnrollments)
      .where(and(eq(academyEnrollments.studentId, identity.studentId), eq(academyEnrollments.courseId, course.id)))
      .limit(1);
    return json(200, enrollment);
  } catch (error) {
    if (error instanceof AcademyAuthError) return json(error.statusCode, { message: error.message });
    console.error('Error inscribiendo alumno en Academia:', error);
    return json(500, { message: 'No se pudo guardar la inscripción.' });
  }
}
