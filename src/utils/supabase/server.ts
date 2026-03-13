import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // If keys are missing, we handle it based on environment
    if (!url || !key) {
        // During build time (prerendering), we use placeholders to avoid crashes
        if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
             console.error("CRITICAL: Supabase keys missing in production environment.");
        }
        
        return createServerClient(
            url || 'https://placeholder.supabase.co',
            key || 'placeholder',
            { cookies: { getAll: () => [], setAll: () => {} } }
        )
    }

    const cookieStore = cookies()

    return createServerClient(
        url,
        key,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )
}
