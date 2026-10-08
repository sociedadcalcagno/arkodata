import { AcademyPaymentError, createAcademyCheckout } from '../../server/academy-payments';

export async function handler(event: { httpMethod: string; body?: string | null }) {
  const json = (statusCode: number, body: unknown) => ({ statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (event.httpMethod !== 'POST') return json(405, { message: 'Method not allowed' });
  try {
    const payload = JSON.parse(event.body || '{}') as { courseSlug?: unknown; email?: unknown };
    if (typeof payload.courseSlug !== 'string' || typeof payload.email !== 'string') return json(400, { message: 'Curso y correo electrónico son requeridos.' });
    return json(200, await createAcademyCheckout(payload.courseSlug, payload.email));
  } catch (error) {
    if (error instanceof AcademyPaymentError) return json(error.statusCode, { message: error.message });
    console.error('Error iniciando pago de Academia:', error);
    return json(500, { message: 'No se pudo iniciar el pago.' });
  }
}
