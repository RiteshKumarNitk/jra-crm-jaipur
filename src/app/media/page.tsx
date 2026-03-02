'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, FileText, Image as ImageIcon, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { createClient } from '@/utils/supabase/client';

export default function MediaPage() {
    const [mediaItems, setMediaItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchMedia = async () => {
            const { data } = await supabase
                .from('gallery_items')
                .select('*')
                .order('order_index');
            if (data) setMediaItems(data);
            setLoading(false);
        };
        fetchMedia();
    }, []);

    const getIcon = (type: string) => {
        if (type?.toLowerCase().includes('video')) return Play;
        if (type?.toLowerCase().includes('doc')) return FileText;
        return ImageIcon;
    };

    return (
        <main className="min-h-screen bg-white font-sans overflow-x-hidden">
            <Navbar />

            <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=2000"
                    alt="Media"
                    fill
                    className="object-cover brightness-50"
                    priority
                />
                <div className="relative z-10 text-center px-6 mt-20">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight"
                    >
                        Media & Gallery
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/80 text-lg max-w-2xl mx-auto font-light"
                    >
                        Strategic milestones and firm events from JRA Legal Solution.
                    </motion.p>
                </div>
            </section>

            <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 text-[#c9b38c] animate-spin" /></div>
                ) : mediaItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {mediaItems.map((item, i) => {
                            const Icon = getIcon(item.category);
                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    className="group relative aspect-square overflow-hidden bg-slate-100 cursor-pointer border border-slate-100 grayscale hover:grayscale-0 transition-all duration-1000 shadow-2xl shadow-slate-200"
                                >
                                    {item.image_url ? (
                                        <Image
                                            src={item.image_url}
                                            alt={item.title || 'Gallery Item'}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            unoptimized={!item.image_url.startsWith('http') || item.image_url.includes('insforge')}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[#c9b38c]/10">
                                            <ImageIcon size={100} />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-10 text-center">
                                        <Icon size={40} className="mb-6 text-[#c9b38c]" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-3 text-[#c9b38c]">{item.category || 'Asset'}</span>
                                        <h3 className="text-xl font-bold font-serif italic">{item.title}</h3>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-40 border border-dashed border-slate-200">
                        <ImageIcon className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400 font-serif italic">The Firm's Visual Registry is currently empty.</p>
                    </div>
                )}
            </section>

            <Footer />
        </main>
    );
}
