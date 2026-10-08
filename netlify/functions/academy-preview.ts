import { AcademyPaymentError, getAcademyPreview } from '../../server/academy-payments';

export async function handler(event: { httpMethod: string; queryStringParameters?: Record<string, string | undefined> }) {
  const json = (statusCode: number, body: unknown) => ({ statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (event.httpMethod !== 'GET') return json(405, { message: 'Method not allowed' });
  try {
    return json(200, await getAcademyPreview(event.queryStringParameters?.course || ''));
  } catch (error) {
    if (error instanceof AcademyPaymentError) return json(error.statusCode, { message: error.message });
    console.error('Error consultando la clase de muestra:', error);
    return json(500, { message: 'No se pudo cargar la clase de muestra.' });
  }
}
