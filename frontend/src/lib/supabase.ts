import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Fail loudly at startup if the .env.local vars are missing,
// instead of getting a confusing "fetch failed" later.
if (!url || !anonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env.local')
}

// One client, shared across the app. It persists the session in
// localStorage and refreshes the JWT automatically.
export const supabase = createClient(url, anonKey)
