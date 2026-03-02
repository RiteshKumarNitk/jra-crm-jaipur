import { createClient } from '@insforge/sdk';

export const insforge = createClient({
    baseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nit76zap.us-east.insforge.app',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
});
