import { getAcademyCatalog } from '../../server/academy-payments';

export async function handler(event: { httpMethod: string }) {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'Method not allowed' }) };
  }
  return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(getAcademyCatalog()) };
}
