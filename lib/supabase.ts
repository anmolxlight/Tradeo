import { createClient } from "@supabase/supabase-js"
import { Database } from "@/types/supabase"

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      "Supabase environment variables are not configured. " +
      "Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file."
    )
    // Return a mock client that logs errors rather than crashing
    return null
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

// Singleton pattern - create the client once
let client: ReturnType<typeof createClient<Database>> | null = null

export function getSupabase() {
  if (!client) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseAnonKey) return null
    client = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  }
  return client
}

// Re-export for backwards compatibility with existing code
export const supabase = new Proxy(
  {},
  {
    get(_, prop) {
      const c = getSupabase()
      if (!c) {
        // Return a mock chain that logs errors
        return (...args: unknown[]) => {
          console.warn(`Supabase not configured. Called .${String(prop)} with:`, ...args)
          return Promise.resolve({ data: null, error: new Error("Supabase not configured") })
        }
      }
      return (c as any)[prop]
    },
  }
) as ReturnType<typeof createClient<Database>>
