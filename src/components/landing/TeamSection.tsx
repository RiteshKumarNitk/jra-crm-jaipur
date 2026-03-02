'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Users, Mail, Linkedin, Scale } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function TeamSection() {
    const [team, setTeam] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchTeam = async () => {
            const { data } = await supabase
                .from('team_members')
                .select('*')
                .order('order_index');
            if (data && data.length > 0) setTeam(data);
            setLoading(false);
        };
        fetchTeam();
    }, []);

    if (loading && team.length === 0) return null;

    return (
        <section className="py-32 bg-white relative overflow-hidden" id="team">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50/50 -skew-x-12 translate-x-1/2 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-12">
                    <div className="space-y-6 max-w-2xl">
                        <div className="inline-flex items-center gap-4 text-[#c9b38c]">
                            <Scale className="w-5 h-5" />
                            <span className="text-[10px] font-black uppercase tracking-[0.6em]">Partnership Registry</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-serif text-slate-900 leading-tight italic font-medium">Commanding Presence, <br />Expert Authority.</h2>
                    </div>
                    <p className="text-slate-400 font-light text-lg italic max-w-sm border-l border-slate-100 pl-8">
                        Our partners represent the highest standard of legal practice in the Rajasthan high court and beyond.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                    {team.map((member, idx) => (
                        <motion.div key={member.id || idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1, duration: 0.8 }} viewport={{ once: true }} className="group">
                            <div className="relative aspect-[3/4] overflow-hidden mb-10 bg-slate-50 border border-slate-100 grayscale group-hover:grayscale-0 transition-all duration-[1s] shadow-2xl shadow-slate-200">
                                {member.image_url ? (
                                    <Image src={member.image_url} alt={member.name} fill className="object-cover transition-transform duration-[2s] group-hover:scale-110" unoptimized={!member.image_url.startsWith('http') || member.image_url.includes('insforge')} />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-[#c9b38c]/10 bg-slate-50 italic">
                                        <Users className="w-24 h-24 mb-4" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-20">Identity Protected</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            </div>

                            <div className="space-y-4">
                                <span className="text-[#c9b38c] text-[10px] font-black uppercase tracking-[0.4em] block">{member.role}</span>
                                <h3 className="text-3xl font-serif text-slate-900 tracking-tight group-hover:text-[#c9b38c] transition-colors italic">{member.name}</h3>
                                <p className="text-slate-500 font-light text-sm italic leading-relaxed border-l-2 border-slate-50 pl-6 group-hover:border-[#c9b38c]/30 transition-colors">
                                    "{member.bio || 'Experience in strategic legal consultation and multi-jurisdictional litigation.'}"
                                </p>

                                <div className="flex items-center gap-8 pt-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                    {member.linkedin_url && (
                                        <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-50 text-slate-400 hover:bg-[#c9b38c] hover:text-white transition-all shadow-sm">
                                            <Linkedin className="w-4 h-4" />
                                        </a>
                                    )}
                                    {member.email && (
                                        <a href={`mailto:${member.email}`} className="p-3 bg-slate-50 text-slate-400 hover:bg-[#c9b38c] hover:text-white transition-all shadow-sm">
                                            <Mail className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
