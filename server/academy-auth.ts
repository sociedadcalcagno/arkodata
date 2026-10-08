import { createClient } from '@supabase/supabase-js';
import { eq } from 'drizzle-orm';
import { academyStudents } from '../shared/schema';
import { db } from './db';

export class AcademyAuthError extends Error {
  constructor(message: string, readonly statusCode: number) {
    super(message);
    this.name = 'AcademyAuthError';
  }
}

export async function getAcademyIdentity(authorization?: string) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey || !db) {
    throw new AcademyAuthError('La autenticación de Academia aún no está configurada.', 503);
  }

  const accessToken = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!accessToken) throw new AcademyAuthError('Inicia sesión para continuar.', 401);

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user?.email) throw new AcademyAuthError('La sesión no es válida o expiró.', 401);

  const authUserId = data.user.id;
  const name = String(data.user.user_metadata?.full_name || data.user.user_metadata?.name || data.user.email.split('@')[0]);
  await db.insert(academyStudents).values({ authUserId, name, email: data.user.email })
    .onConflictDoNothing({ target: academyStudents.authUserId });

  const [student] = await db.select().from(academyStudents).where(eq(academyStudents.authUserId, authUserId)).limit(1);
  if (!student || student.status !== 'active') throw new AcademyAuthError('La cuenta de Academia no está activa.', 403);

  return { authUserId, email: data.user.email, name: student.name, role: student.role, studentId: student.id };
}
