import { createServerClient as createSupabaseServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

let supabaseClient: ReturnType<typeof createSupabaseServerClient> | null = null

/**
 * Creates a Supabase client for server-side operations.
 * Uses singleton pattern to prevent multiple GoTrueClient instances.
 */
export async function createClient() {
  if (supabaseClient) {
    return supabaseClient
  }

  const cookieStore = await cookies()

  const client = createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // The "setAll" method was called from a Server Component.
            // This can be ignored if you have proxy refreshing user sessions.
          }
        },
      },
    },
  )

  supabaseClient = client
  return client
}

export const createServerClient = createClient
