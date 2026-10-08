import { AcademyPaymentError, getAcademyCatalog } from '../../server/academy-payments';

export async function handler(event: { httpMethod: string }) {
  const json = (statusCode: number, body: unknown) => ({ statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (event.httpMethod !== 'GET') {
    return json(405, { message: 'Method not allowed' });
  }
  try {
    return json(200, await getAcademyCatalog());
  } catch (error) {
    if (error instanceof AcademyPaymentError) return json(error.statusCode, { message: error.message });
    console.error('Error consultando catálogo de Academia:', error);
    return json(500, { message: 'No se pudo consultar el catálogo.' });
  }
}
