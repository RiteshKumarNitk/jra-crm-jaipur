'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Tag, Share2, Printer, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function BlogDetailPage() {
    const { slug } = useParams();
    const [blog, setBlog] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const fetchBlog = async () => {
            const { data, error } = await supabase
                .from('blogs')
                .select('*')
                .eq('slug', slug)
                .maybeSingle();

            if (data) setBlog(data);
            else if (!error) router.push('/blogs');
            setLoading(false);
        };
        fetchBlog();
    }, [slug]);

    if (loading) return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center animate-pulse">
            <div className="h-4 w-48 bg-slate-50 mb-6"></div>
            <div className="h-10 w-96 bg-slate-50"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="max-w-4xl mx-auto px-6 py-32">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-20">
                    <Link href="/blogs" className="inline-flex items-center gap-2 text-[#c9b38c] text-[10px] font-black uppercase tracking-[0.3em] hover:gap-4 transition-all mb-12">
                        <ArrowLeft className="w-4 h-4" /> Back to Intelligence Registry
                    </Link>
                    <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 italic">
                        <span className="flex items-center gap-2"><Tag className="w-3 h-3 text-[#c9b38c]" /> {blog?.category || 'Registry'}</span>
                        <span className="flex items-center gap-2"><Clock className="w-3 h-3" /> {new Date(blog?.created_at).toLocaleDateString()}</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif text-slate-900 leading-[1.1] mb-8 italic tracking-tight font-medium">{blog?.title}</h1>
                    <p className="text-xl md:text-2xl font-light text-slate-500 italic leading-relaxed border-l-4 border-[#c9b38c] pl-10 py-2">
                        "{blog?.excerpt || 'Strategic briefing regarding current legal developments and practice updates.'}"
                    </p>
                </motion.div>

                {blog?.image_url && (
                    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="relative aspect-[21/9] mb-24 overflow-hidden border border-slate-100 shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000 group">
                        <Image src={blog.image_url} alt={blog.title} fill className="object-cover group-hover:scale-105 transition-transform duration-[3s]" unoptimized={!blog.image_url.startsWith('http') || blog.image_url.includes('insforge')} />
                    </motion.div>
                )}

                <div className="flex flex-col lg:flex-row gap-20">
                    <article className="flex-1 text-slate-700 leading-relaxed font-light text-lg space-y-8 first-letter:text-7xl first-letter:font-serif first-letter:mr-3 first-letter:float-left first-letter:text-[#c9b38c]">
                        {blog?.content?.split('\n').map((para: string, i: number) => (
                            para.trim() ? <p key={i}>{para}</p> : null
                        ))}
                        {!blog?.content && (
                            <p className="italic text-slate-400">Content detail is currently restricted. Please contact the firm directly for full strategic disclosure regarding this matter.</p>
                        )}
                    </article>

                    <aside className="w-full lg:w-72 space-y-12">
                        <div className="p-10 border border-slate-100 bg-slate-50/30 sticky top-32 space-y-8">
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 mb-6">Article Protocol</h4>
                                <div className="flex justify-between items-center py-4 border-b border-slate-100">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Share</span>
                                    <div className="flex gap-4 text-slate-900 hover:text-[#c9b38c] transition-colors"><Link href="#"><Share2 className="w-4 h-4" /></Link></div>
                                </div>
                                <div className="flex justify-between items-center py-4 border-b border-slate-100">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Print</span>
                                    <div className="flex gap-4 text-slate-900 hover:text-[#c9b38c] transition-colors"><Link href="#"><Printer className="w-4 h-4" /></Link></div>
                                </div>
                            </div>

                            <div className="pt-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-10 w-1 bg-[#c9b38c]"></div>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900">Firm Registry</h4>
                                </div>
                                <div className="space-y-4 text-[11px] font-light text-slate-500">
                                    <p className="flex items-center gap-3"><MapPin className="w-4 h-4 text-[#c9b38c]" /> C-Scheme, Jaipur</p>
                                    <p className="italic">Registered under the Rajasthan Bar Council Authority.</p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            <Footer />
        </div>
    );
}
