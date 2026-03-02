'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Scale, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (loginError) {
            setError(loginError.message);
            setLoading(false);
        } else {
            router.push('/dashboard');
            router.refresh();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-6">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1505664194779-8beaceb93744?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-5"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center gap-3 mb-6 group transition-transform hover:scale-105">
                        <div className="bg-[#c9b38c] p-2 rounded-sm shadow-md">
                            <Scale className="h-8 w-8 text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-[0.2em] text-slate-900 uppercase">JRA Legal</span>
                    </Link>
                    <h1 className="text-4xl font-serif text-slate-900">Sign in to Practice</h1>
                    <p className="text-slate-500 mt-2 font-light">Enter your credentials to access the secure registry.</p>
                </div>

                <div className="bg-white border border-slate-100 rounded-sm p-10 shadow-2xl shadow-slate-200/50">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Authenticated Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-4 rounded-none bg-slate-50 border-none focus:ring-1 focus:ring-[#c9b38c] transition-all text-slate-900 placeholder-slate-300 shadow-inner"
                                placeholder="practitioner@jralegal.com"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Security Password</label>
                                <Link href="#" className="text-[10px] font-black text-[#c9b38c] uppercase tracking-widest hover:underline">Reset</Link>
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-4 rounded-none bg-slate-50 border-none focus:ring-1 focus:ring-[#c9b38c] transition-all text-slate-900 shadow-inner"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="p-4 rounded-none bg-red-50 border-l-2 border-red-500 text-red-600 text-[10px] font-black uppercase tracking-widest"
                            >
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-[#c9b38c] hover:bg-[#b99c69] text-white font-black uppercase tracking-[0.2em] shadow-xl shadow-[#c9b38c]/20 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 text-[12px]"
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Access Registry <ArrowRight className="h-4 w-4" /></>}
                        </button>
                    </form>

                    <div className="mt-10 pt-10 border-t border-slate-50">
                        <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            New to the firm? {' '}
                            <Link href="/signup" className="text-[#c9b38c] hover:underline">Apply for Partnership</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
