'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Scale, Gavel, Shield, FileText, Briefcase, Globe, ChevronLeft, ChevronRight, Users, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { createClient } from '@/utils/supabase/client';

const DEFAULT_ABOUT = {
    hero: {
        title: "About Our Firm",
        subtitle: "Strategic excellence in the legal landscape of Rajasthan.",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c"
    },
    mission_cards: [
        { title: "Our Mission", desc: "To provide world-class legal solutions with integrity, precision, and a client-first approach across all jurisdictions." },
        { title: "Our Vision", desc: "To be the foremost legal authority in Rajasthan RERA and High Court litigation, setting benchmarks for professional excellence." },
        { title: "RERA Authority", desc: "Driving awareness and compliance in the real estate sector, ensuring transparency and justice for all stakeholders." }
    ],
    practice_areas: [
        { title: "Govt. Registration", icon: Gavel, desc: "Seamless navigation through complex regulatory and registration protocols." },
        { title: "RERA Law", icon: Globe, desc: "Specialized advocacy and compliance management in the real estate domain." },
        { title: "Intellectual Property", icon: FileText, desc: "Protecting your innovation and brand equity with strategic legal safeguards." },
        { title: "Banking Law", icon: Scale, desc: "Expert consultation for financial institutions and debt recovery mandates." }
    ]
};

export default function AboutPage() {
    const [content, setContent] = useState(DEFAULT_ABOUT);
    const [team, setTeam] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchData = async () => {
            // Fetch About Page Content
            const { data: pageData } = await supabase
                .from('website_content')
                .select('content')
                .eq('section', 'about_page')
                .maybeSingle();

            if (pageData?.content) setContent(pageData.content);

            // Fetch Top 3 Team Members
            const { data: teamData } = await supabase
                .from('team_members')
                .select('*')
                .order('order_index')
                .limit(3);

            if (teamData) setTeam(teamData);

            setLoading(false);
        };
        fetchData();
    }, [supabase]);

    return (
        <main className="min-h-screen bg-white font-sans overflow-x-hidden">
            <Navbar />

            {/* Hero Section */}
            <section className="relative h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden">
                <Image
                    src={`${content.hero.image}?auto=format&fit=crop&q=80&w=2000`}
                    alt="Hero Background"
                    fill
                    className="object-cover brightness-[0.3]"
                    priority
                />
                <div className="relative z-10 text-center px-6 mt-20">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-9xl font-bold text-white mb-6 tracking-tighter font-serif italic"
                    >
                        {content.hero.title}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/70 text-lg max-w-2xl mx-auto font-light italic"
                    >
                        {content.hero.subtitle}
                    </motion.p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-1/3 bg-[#1C202E] p-12 flex flex-col justify-center items-start text-left shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 text-white group-hover:scale-110 transition-transform duration-1000">
                            <Scale size={160} />
                        </div>
                        <h2 className="text-3xl text-white font-serif italic leading-snug mb-12 relative z-10">
                            Strategic pathways to unmatched legal excellence.
                        </h2>
                        <Link href="/contact" className="relative z-10 bg-[#c9b38c] text-white py-5 px-10 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-[#1C202E] transition-all">
                            Procure Consultation
                        </Link>
                    </div>

                    <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-8">
                        {content.mission_cards.map((item, i) => (
                            <div key={i} className="bg-white border border-slate-50 p-12 flex flex-col justify-between shadow-sm hover:shadow-2xl transition-all duration-700">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-8 font-serif italic">{item.title}</h3>
                                    <p className="text-slate-500 text-[13px] leading-relaxed font-light italic mb-8">
                                        {item.desc}
                                    </p>
                                </div>
                                <div className="h-1 w-10 bg-[#c9b38c]/20" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Practice Areas */}
            <section className="bg-white overflow-hidden py-12">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row shadow-2xl">
                    <div className="lg:w-[45%] relative aspect-[4/5] lg:aspect-auto">
                        <Image
                            src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1000"
                            alt="Legal Practice"
                            fill
                            className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                        />
                    </div>
                    <div className="lg:w-[55%] bg-[#1C202E] p-16 md:p-24 flex flex-col justify-center relative overflow-hidden">
                        <div className="absolute -bottom-20 -right-20 opacity-[0.02] text-white">
                            <Gavel size={400} />
                        </div>
                        <div className="flex items-center gap-6 mb-16 relative z-10">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-[#c9b38c] border border-white/10">
                                <Scale size={32} />
                            </div>
                            <h2 className="text-4xl text-white font-serif italic tracking-tight uppercase">Operational Command</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16 relative z-10">
                            {content.practice_areas.map((area: any, i) => {
                                const Icon = i === 0 ? Gavel : i === 1 ? Globe : i === 2 ? FileText : Scale;
                                return (
                                    <div key={i} className="flex gap-6 items-start group">
                                        <div className="text-[#c9b38c] shrink-0 group-hover:scale-110 transition-transform">
                                            <Icon size={28} strokeWidth={1} />
                                        </div>
                                        <div className="space-y-3">
                                            <h4 className="text-white text-lg font-bold tracking-wide">{area.title}</h4>
                                            <p className="text-white/40 text-[12px] leading-relaxed font-light italic">
                                                {area.desc}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Expert Registry */}
            <section className="py-32 px-6 bg-slate-50/30">
                <div className="max-w-7xl mx-auto text-center mb-24 space-y-6">
                    <div className="w-14 h-14 bg-[#c9b38c]/10 rounded-full flex items-center justify-center mx-auto text-[#c9b38c] mb-2">
                        <Briefcase size={28} strokeWidth={1} />
                    </div>
                    <span className="text-[#c9b38c] text-[10px] font-black uppercase tracking-[0.6em] block">Professional Registry</span>
                    <h2 className="text-5xl font-serif italic text-slate-900 tracking-tight">Meet the Command</h2>
                    <p className="text-slate-400 font-light italic text-base max-w-2xl mx-auto">
                        A collective of elite legal strategists dedicated to your constitutional and civil mandate.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto pb-12">
                    {loading ? (
                        <div className="flex justify-center"><Loader2 className="animate-spin text-[#c9b38c]" /></div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {team.map((member, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="group">
                                    <div className="bg-white border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 text-center pb-10">
                                        <div className="relative aspect-[4/5] mb-8 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-1000">
                                            {member.image_url ? (
                                                <Image
                                                    src={member.image_url}
                                                    alt={member.name}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                                                    unoptimized={!member.image_url.startsWith('http') || member.image_url.includes('insforge')}
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-slate-50 flex items-center justify-center text-[#c9b38c]/10"><Users size={100} /></div>
                                            )}
                                        </div>
                                        <h4 className="text-2xl font-bold text-slate-900 mb-2 font-serif italic">{member.name}</h4>
                                        <p className="text-[#c9b38c] text-[10px] font-black uppercase tracking-[0.3em]">{member.role}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
