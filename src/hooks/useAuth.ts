'use client';

import { useEffect, useState } from 'react';
import { insforge } from '@/utils/insforge';

export function useAuth() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = typeof window !== 'undefined' ? localStorage.getItem("access_token") : null;

                if (!token) {
                    setUser(null);
                    setLoading(false);
                    return;
                }

                const { data, error } = await insforge.auth.getCurrentUser();
                const user = data?.user;

                if (error || !user) {
                    // Token might be expired or not found by SDK
                    if (error) console.error("Auth error:", error);
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");
                    setUser(null);
                } else {
                    setUser(user);
                }
            } catch (err) {
                console.error("Unexpected auth error:", err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return { user, loading, isAuthenticated: !!user };
}
