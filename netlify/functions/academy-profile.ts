import { AcademyAuthError, getAcademyIdentity } from '../../server/academy-auth';

export async function handler(event: { httpMethod: string; headers?: Record<string, string | undefined> }) {
  const json = (statusCode: number, body: unknown) => ({ statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (event.httpMethod !== 'GET') return json(405, { message: 'Method not allowed' });
  try {
    return json(200, await getAcademyIdentity(event.headers?.authorization || event.headers?.Authorization));
  } catch (error) {
    if (error instanceof AcademyAuthError) return json(error.statusCode, { message: error.message });
    console.error('Error validando perfil de Academia:', error);
    return json(500, { message: 'No se pudo validar el perfil.' });
  }
}
