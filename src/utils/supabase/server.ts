import { createClient as createInsForgeClient } from '@insforge/sdk'

/**
 * CONNECTIVITY BRIDGE (SERVER): Supabase-Compatible Wrapper
 * Ensures that server-side data fetching also uses the reachable IPv4 gateway.
 */
export async function createClient() {
    const client = createInsForgeClient({
        baseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    })

    // Return a shim that matches Supabase's interface for server-side logic
    return {
        ...client,
        // Map supabase.from()
        from: (table: string) => client.database.from(table),

        auth: {
            ...client.auth,
            // Map getUser() to getCurrentSession()
            getUser: async () => {
                const { data, error } = await client.auth.getCurrentSession();
                return {
                    data: { user: data?.session?.user || null },
                    error
                };
            }
        }
    } as any;
}
