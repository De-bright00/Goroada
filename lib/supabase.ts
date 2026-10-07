import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

/**
 * Supabase backend is PAUSED by default.
 * To turn it on, set NEXT_PUBLIC_SUPABASE_ENABLED=true (plus the URL/keys above)
 * in .env.local and in your Vercel project settings.
 *
 * While paused, every query resolves to `{ data: null, error }`, so all API
 * routes fall through to their built-in mock/sandbox responses.
 */
export const isSupabaseEnabled =
  process.env.NEXT_PUBLIC_SUPABASE_ENABLED === "true" && !!supabaseUrl && !!supabaseAnonKey

const PAUSED_ERROR = {
  message: "SUPABASE_PAUSED: backend is disabled",
  code: "SUPABASE_PAUSED",
}

// Chainable no-op client: supabase.from("x").select().eq()... -> { data: null, error }
function createPausedClient(): any {
  const result = { data: null, error: PAUSED_ERROR, count: null }
  const handler: ProxyHandler<any> = {
    get(_target, prop) {
      if (prop === "then") {
        return (resolve: any, reject: any) => Promise.resolve(result).then(resolve, reject)
      }
      if (typeof prop === "symbol") return undefined
      return proxy
    },
    apply() {
      return proxy
    },
  }
  const proxy: any = new Proxy(function () {}, handler)
  return proxy
}

// Public client (for client-side or anonymous public reads)
export const supabase = isSupabaseEnabled
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : createPausedClient()

// Admin client (for API routes to execute secure database modifications and call security-definer RPCs)
export const supabaseAdmin =
  isSupabaseEnabled && supabaseServiceKey
    ? createClient(supabaseUrl!, supabaseServiceKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })
    : createPausedClient()
