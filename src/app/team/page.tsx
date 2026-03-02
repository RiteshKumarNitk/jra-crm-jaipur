'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Linkedin, Mail, Users, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { insforge } from '@/utils/insforge';

export default function TeamPage() {
    const [teamMembers, setTeamMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const { data } = await insforge.database
                    .from('team_members')
                    .select('*')
                    .order('order_index', { ascending: true });

                if (data && data.length > 0) {
                    setTeamMembers(data);
                } else {
                    // Fallback team if none in DB
                    setTeamMembers([
                        { name: 'CA Mitesh Rathore', role: 'Managing Director', image_url: 'https://images.unsplash.com/photo-1556155092-490a1ba16284' },
                        { name: 'Onoon Lucy', role: 'Family Lawyer', image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d' },
                        { name: 'John Doe', role: 'Corporate Consultant', image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e' }
                    ]);
                }
            } catch (err) {
                console.error("Team fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTeam();
    }, []);

    return (
        <main className="min-h-screen bg-white font-sans overflow-x-hidden">
            <Navbar />

            <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2000"
                    alt="Our Team"
                    fill
                    className="object-cover brightness-50"
                    priority
                />
                <div className="relative z-10 text-center px-6 mt-20">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight font-serif italic"
                    >
                        Partnership Registry
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/80 text-lg max-w-2xl mx-auto font-light italic"
                    >
                        A dedicated collective of legal professionals committed to strategic excellence.
                    </motion.p>
                </div>
            </section>

            <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 text-[#c9b38c] animate-spin" /></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {teamMembers.map((member, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="group bg-white border border-slate-50 overflow-hidden hover:shadow-2xl transition-all duration-500 shadow-sm"
                            >
                                <div className="relative aspect-[4/5] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-1000">
                                    {member.image_url ? (
                                        <Image
                                            src={`${member.image_url}${!member.image_url.includes('insforge') ? '?auto=format&fit=crop&q=80&w=800' : ''}`}
                                            alt={member.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            unoptimized={!member.image_url.startsWith('http') || member.image_url.includes('insforge')}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-[#c9b38c]/10 bg-slate-50">
                                            <Users size={120} />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-[#1C202E]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
                                        {member.linkedin_url && <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer"><Linkedin className="text-white hover:text-[#c9b38c] transition-colors" size={24} /></a>}
                                        {member.email && <a href={`mailto:${member.email}`}><Mail className="text-white hover:text-[#c9b38c] transition-colors" size={24} /></a>}
                                    </div>
                                </div>
                                <div className="p-10 text-center bg-white border-t border-slate-50">
                                    <h4 className="text-2xl font-bold text-slate-900 mb-2 font-serif italic">{member.name}</h4>
                                    <p className="text-[#c9b38c] text-[10px] font-black uppercase tracking-[0.3em]">{member.role}</p>
                                    {member.bio && (
                                        <p className="mt-4 text-[12px] text-slate-500 font-light italic leading-relaxed line-clamp-2">
                                            "{member.bio}"
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

            <Footer />
        </main>
    );
}
