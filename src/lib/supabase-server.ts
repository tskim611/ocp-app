import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

/**
 * Server-side Supabase client
 * Use this for Server Components, Server Actions, and Route Handlers
 *
 * This client respects user authentication by reading cookies
 */
export async function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const cookieStore = await cookies();

  const cookieOptions = {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: Record<string, unknown>) {
        try {
          cookieStore.set(name, value, options);
        } catch {
          // Cookie setting may fail in middleware or during SSR
          // This is expected and can be safely ignored
        }
      },
      remove(name: string, options: Record<string, unknown>) {
        try {
          cookieStore.set(name, '', { ...options, maxAge: 0 });
        } catch {
          // Cookie removal may fail in middleware or during SSR
          // This is expected and can be safely ignored
        }
      },
    },
  };

  return createClient(supabaseUrl, supabaseAnonKey, cookieOptions as Parameters<typeof createClient>[2]);
}
