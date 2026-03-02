'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { ArrowRight, BookOpen, Clock, Tag, Search, Filter } from 'lucide-react';
import Image from 'next/image';

export default function BlogsPage() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [filteredBlogs, setFilteredBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [categories, setCategories] = useState<string[]>(['All']);

    const supabase = createClient();

    useEffect(() => {
        const fetchBlogs = async () => {
            const { data } = await supabase
                .from('blogs')
                .select('*')
                .order('created_at', { ascending: false });
            if (data) {
                setBlogs(data);
                setFilteredBlogs(data);
                const uniqueCategories = Array.from(new Set(data.map((b: any) => b.category || 'Opinion'))) as string[];
                setCategories(['All', ...uniqueCategories]);
            }
            setLoading(false);
        };
        fetchBlogs();
    }, []);

    useEffect(() => {
        let result = blogs;
        if (activeCategory !== 'All') {
            result = result.filter(b => (b.category || 'Opinion') === activeCategory);
        }
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(b =>
                b.title.toLowerCase().includes(q) ||
                b.excerpt?.toLowerCase().includes(q) ||
                b.content?.toLowerCase().includes(q)
            );
        }
        setFilteredBlogs(result);
    }, [searchQuery, activeCategory, blogs]);

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section */}
            <section className="relative py-40 bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-10 grayscale"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="text-[#c9b38c] text-[10px] font-black uppercase tracking-[0.6em] mb-4 block">Practice Intelligence</motion.span>
                    <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-5xl md:text-8xl font-serif text-white mb-8 italic font-medium">Insights & Authority</motion.h1>

                    {/* Search Bar */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="max-w-xl mx-auto relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-hover:text-[#c9b38c] transition-colors" />
                        <input
                            type="text"
                            placeholder="Discover strategic intelligence..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 px-16 py-6 text-white text-sm font-light focus:outline-none focus:bg-white focus:text-slate-900 focus:ring-0 transition-all rounded-sm backdrop-blur-sm"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Discovery Navigation */}
            <div className="bg-slate-50 border-b border-slate-100 sticky top-20 z-40">
                <div className="max-w-7xl mx-auto px-6 overflow-x-auto scrollbar-hide">
                    <div className="flex items-center gap-10 py-6 min-w-max">
                        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 border-r border-slate-200 pr-10">
                            <Filter className="w-3 h-3" /> Practice Areas
                        </div>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${activeCategory === cat ? 'text-[#c9b38c]' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                {cat}
                                {activeCategory === cat && <motion.div layoutId="activeCat" className="absolute -bottom-[26px] left-0 right-0 h-1 bg-[#c9b38c]" />}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Blog Grid */}
            <section className="py-32 max-w-7xl mx-auto px-6 min-h-[600px]">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {[1, 2, 3].map(i => <div key={i} className="aspect-[16/10] bg-slate-50 border border-slate-100 animate-pulse"></div>)}
                    </div>
                ) : filteredBlogs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 gap-y-24">
                        <AnimatePresence mode="popLayout">
                            {filteredBlogs.map((blog, idx) => (
                                <motion.article
                                    key={blog.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.4 }}
                                    className="group"
                                >
                                    <Link href={`/blogs/${blog.slug}`} className="block">
                                        <div className="relative aspect-[16/10] overflow-hidden mb-10 bg-slate-50 border border-slate-100 grayscale group-hover:grayscale-0 transition-all duration-1000">
                                            {blog.image_url ? (
                                                <Image src={blog.image_url} alt={blog.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" unoptimized={!blog.image_url.startsWith('http') || blog.image_url.includes('insforge')} />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-[#c9b38c]/20"><BookOpen className="w-24 h-24" /></div>
                                            )}
                                        </div>
                                        <div className="space-y-5">
                                            <div className="flex items-center gap-6 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
                                                <span className="flex items-center gap-2 italic"><Tag className="w-3 h-3 text-[#c9b38c]" /> {blog.category || 'Registry'}</span>
                                                <span className="flex items-center gap-2 italic text-slate-300"><Clock className="w-3 h-3" /> {new Date(blog.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <h2 className="text-3xl font-serif text-slate-900 leading-[1.2] italic font-medium group-hover:text-[#c9b38c] transition-colors">{blog.title}</h2>
                                            <p className="text-slate-500 font-light text-sm italic leading-relaxed line-clamp-3">"{blog.excerpt || 'Access the full strategic briefing for more details.'}"</p>
                                            <div className="flex items-center gap-3 text-[#c9b38c] text-[10px] font-black uppercase tracking-[0.3em] pt-6 border-t border-slate-50 group-hover:gap-6 transition-all">
                                                Read Intelligence <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.article>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="text-center py-40 border border-dashed border-slate-100">
                        <BookOpen className="w-16 h-16 text-slate-100 mx-auto mb-8" />
                        <h3 className="text-2xl font-serif text-slate-300 italic">No intelligence matched your strategic query.</h3>
                        <button onClick={() => { setSearchQuery(''); setActiveCategory('All'); }} className="mt-8 text-[10px] font-black uppercase tracking-widest text-[#c9b38c] hover:underline">Reset Discover Registry</button>
                    </div>
                )}
            </section>

            <Footer />
        </div>
    );
}
