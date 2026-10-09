import { AcademyPaymentError, getAcademyPreview } from '../../server/academy-payments';
import { AcademyAuthError, getAcademyIdentity } from '../../server/academy-auth';

export async function handler(event: { httpMethod: string; headers?: Record<string, string | undefined>; queryStringParameters?: Record<string, string | undefined> }) {
  const json = (statusCode: number, body: unknown) => ({ statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (event.httpMethod !== 'GET') return json(405, { message: 'Method not allowed' });
  try {
    const identity = await getAcademyIdentity(event.headers?.authorization || event.headers?.Authorization);
    return json(200, await getAcademyPreview(event.queryStringParameters?.course || '', identity.studentId));
  } catch (error) {
    if (error instanceof AcademyAuthError) return json(error.statusCode, { message: error.message });
    if (error instanceof AcademyPaymentError) return json(error.statusCode, { message: error.message });
    console.error('Error consultando la clase de muestra:', error);
    return json(500, { message: 'No se pudo cargar la clase de muestra.' });
  }
}
