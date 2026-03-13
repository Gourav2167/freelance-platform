import { createBrowserClient } from '@supabase/ssr'
import { SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null;

export function createClient() {
    if (client) return client;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
        return createBrowserClient(
            'https://placeholder.supabase.co',
            'placeholder'
        );
    }

    client = createBrowserClient(url, key);
    return client;
}
