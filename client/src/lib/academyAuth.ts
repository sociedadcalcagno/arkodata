import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function enrollInAcademyCourse(courseSlug: string, accessToken: string) {
  const response = await fetch('/api/academy/enrollments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ courseSlug }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'No pudimos completar la inscripción.');
  return result;
}
