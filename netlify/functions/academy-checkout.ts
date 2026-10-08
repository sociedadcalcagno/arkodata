import { AcademyPaymentError, createAcademyCheckout } from '../../server/academy-payments';
import { AcademyAuthError, getAcademyIdentity } from '../../server/academy-auth';

export async function handler(event: { httpMethod: string; body?: string | null; headers?: Record<string, string | undefined> }) {
  const json = (statusCode: number, body: unknown) => ({ statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (event.httpMethod !== 'POST') return json(405, { message: 'Method not allowed' });
  try {
    const identity = await getAcademyIdentity(event.headers?.authorization || event.headers?.Authorization);
    const payload = JSON.parse(event.body || '{}') as { courseSlug?: unknown };
    if (typeof payload.courseSlug !== 'string') return json(400, { message: 'El curso es requerido.' });
    return json(200, await createAcademyCheckout(payload.courseSlug, identity));
  } catch (error) {
    if (error instanceof AcademyAuthError) return json(error.statusCode, { message: error.message });
    if (error instanceof AcademyPaymentError) return json(error.statusCode, { message: error.message });
    console.error('Error iniciando pago de Academia:', error);
    return json(500, { message: 'No se pudo iniciar el pago.' });
  }
}
