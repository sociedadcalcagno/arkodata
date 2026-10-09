import { AcademyAuthError, getAcademyIdentity } from '../../server/academy-auth';
import { AcademyPaymentError, submitAcademyAssessment } from '../../server/academy-payments';

export async function handler(event: { httpMethod: string; headers?: Record<string, string | undefined>; body?: string | null }) {
  const json = (statusCode: number, body: unknown) => ({ statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (event.httpMethod !== 'POST') return json(405, { message: 'Method not allowed' });
  try {
    const identity = await getAcademyIdentity(event.headers?.authorization || event.headers?.Authorization);
    const payload = JSON.parse(event.body || '{}') as { courseSlug?: unknown; assessmentId?: unknown; answers?: unknown };
    if (typeof payload.courseSlug !== 'string' || !Number.isInteger(payload.assessmentId) || !Array.isArray(payload.answers) || !payload.answers.every(Number.isInteger)) {
      return json(400, { message: 'La evaluación y las respuestas no son válidas.' });
    }
    return json(200, await submitAcademyAssessment(payload.courseSlug, identity.studentId, Number(payload.assessmentId), payload.answers as number[]));
  } catch (error) {
    if (error instanceof AcademyAuthError || error instanceof AcademyPaymentError) return json(error.statusCode, { message: error.message });
    console.error('Error corrigiendo evaluación de Academia:', error);
    return json(500, { message: 'No se pudo corregir la evaluación.' });
  }
}
