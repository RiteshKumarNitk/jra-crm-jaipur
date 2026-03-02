import { createClient as createInsForgeClient } from '@insforge/sdk'

/**
 * CONNECTIVITY BRIDGE: Supabase-Compatible Wrapper
 * This shim makes the InsForge SDK act like the Supabase SDK, 
 * resolving the "Failed to fetch" errors while keeping existing code working.
 */
export function createClient() {
    const client = createInsForgeClient({
        baseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    })

    // Return a shim that matches Supabase's interface
    return {
        ...client,
        // Expose native InsForge features directly for new modules
        ai: client.ai,
        storage: client.storage,
        database: client.database,

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
            },
            // Map getSession()
            getSession: async () => {
                const { data, error } = await client.auth.getCurrentSession();
                return {
                    data: data?.session ? { session: data.session } : null,
                    error
                };
            },
            // Map signUp()
            signUp: async (params: any) => {
                const { data, error } = await client.auth.signUp({
                    email: params.email,
                    password: params.password,
                    name: params.options?.data?.full_name || ''
                });
                return {
                    data: data ? { ...data, session: data.accessToken ? data : null } : null,
                    error
                };
            },
            // Map signInWithPassword()
            signInWithPassword: async (credentials: any) => {
                const { data, error } = await client.auth.signInWithPassword({
                    email: credentials.email,
                    password: credentials.password
                });
                return {
                    data: data ? { ...data, session: data.accessToken ? data : null } : null,
                    error
                };
            },
            signOut: async () => {
                return await client.auth.signOut();
            },
            onAuthStateChange: (callback: any) => {
                // Dummy subscription to prevent crashes
                return {
                    data: { subscription: { unsubscribe: () => { } } }
                };
            }
        }
    } as any;
}
