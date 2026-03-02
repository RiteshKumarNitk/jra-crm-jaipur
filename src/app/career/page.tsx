'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, ArrowRight, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { createClient } from '@/utils/supabase/client';

export default function CareerPage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchJobs = async () => {
            const { data } = await supabase
                .from('job_postings')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false });
            if (data) setJobs(data);
            setLoading(false);
        };
        fetchJobs();
    }, []);

    return (
        <main className="min-h-screen bg-white font-sans overflow-x-hidden">
            <Navbar />

            <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=2000"
                    alt="Careers"
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
                        Join Our Team
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/80 text-lg max-w-2xl mx-auto font-light"
                    >
                        Start your professional journey with a team of elite legal practitioners.
                    </motion.p>
                </div>
            </section>

            <section className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <span className="text-[#c9b38c] text-[11px] font-bold uppercase tracking-[0.4em]">Registry</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">Available Positions</h2>
                </div>

                <div className="space-y-6">
                    {loading ? (
                        <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 text-[#c9b38c] animate-spin" /></div>
                    ) : jobs.length > 0 ? jobs.map((job, i) => (
                        <motion.div
                            key={job.id}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="group bg-white border border-slate-100 p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-2xl hover:shadow-slate-200 transition-all duration-300"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="bg-[#c9b38c]/10 text-[#c9b38c] px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full">{job.type}</span>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{job.department}</span>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-[#c9b38c] transition-colors">{job.title}</h3>
                                <div className="flex flex-wrap gap-6 text-slate-400 text-sm font-light">
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} />
                                        {job.location || 'Jaipur, Rajasthan'}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} />
                                        Posted: {new Date(job.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                                <p className="text-slate-500 font-light text-sm italic line-clamp-2 max-w-2xl">{job.description}</p>
                            </div>
                            <button className="h-14 w-14 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:bg-[#c9b38c] transition-all duration-300">
                                <ArrowRight size={24} />
                            </button>
                        </motion.div>
                    )) : (
                        <div className="text-center py-40 border border-dashed border-slate-200">
                            <Briefcase className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                            <p className="text-slate-400 font-serif italic">No current openings available in the registry.</p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
