import { AcademyPaymentError, getPaidAcademyContent } from '../../server/academy-payments';
import { AcademyAuthError, getAcademyIdentity } from '../../server/academy-auth';

export async function handler(event: { httpMethod: string; headers?: Record<string, string | undefined>; queryStringParameters?: Record<string, string | undefined> }) {
  const json = (statusCode: number, body: unknown) => ({ statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (event.httpMethod !== 'GET') return json(405, { message: 'Method not allowed' });
  try {
    const identity = await getAcademyIdentity(event.headers?.authorization || event.headers?.Authorization);
    const course = event.queryStringParameters?.course || '';
    const paymentId = event.queryStringParameters?.payment_id || '';
    return json(200, await getPaidAcademyContent(course, paymentId, identity));
  } catch (error) {
    if (error instanceof AcademyAuthError) return json(error.statusCode, { message: error.message });
    if (error instanceof AcademyPaymentError) return json(error.statusCode, { message: error.message });
    console.error('Error verificando pago de Academia:', error);
    return json(500, { message: 'No se pudo verificar el pago.' });
  }
}
