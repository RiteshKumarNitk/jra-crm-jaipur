'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Instagram, Send, ArrowUp } from 'lucide-react';
import { insforge } from '@/utils/insforge';

const DEFAULT_FIRM = {
    address: 'Jagdish Enclave, 105, Keshav Nagar, Civil Lines, Jaipur, Rajasthan',
    email: 'jainrathoreassociates@gmail.com',
    phone: '0141 405 3434',
    name: 'JRA Legal Solutions'
};

export default function Footer() {
    const [firm, setFirm] = useState(DEFAULT_FIRM);

    useEffect(() => {
        const fetchFirm = async () => {
            const { data } = await insforge.database
                .from('website_content')
                .select('content')
                .eq('section', 'firm_settings')
                .maybeSingle();

            if (data?.content) {
                setFirm(data.content);
            }
        };
        fetchFirm();
    }, []);

    const scrollUp = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-[#1C202E] text-white pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-20 opacity-[0.02] text-white rotate-12 pointer-events-none">
                <span className="text-[200px] font-serif italic font-black">JRA</span>
            </div>

            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-12 pb-16 border-b border-white/5 relative z-10">
                    <div className="flex items-center gap-4">
                        {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                            <button key={i} className="h-12 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#c9b38c] transition-all hover:scale-110 shadow-lg shadow-black/20">
                                <Icon size={16} />
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-col items-center">
                        <Link href="/" className="flex items-center gap-4 group">
                            <div className="h-12 w-12 relative flex items-center justify-center text-white font-bold text-2xl border border-white/20 rotate-45 group-hover:border-[#c9b38c] transition-all duration-500">
                                <span className="-rotate-45 font-serif italic">J</span>
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-white font-bold text-2xl tracking-[0.1em] leading-none font-serif italic">{firm.name?.split(' ')[0] || 'JRA'}</span>
                                <span className="text-[#c9b38c] text-[10px] font-black uppercase tracking-[0.3em] mt-1">Legal Excellence</span>
                            </div>
                        </Link>
                    </div>

                    <div className="w-full max-w-sm flex items-center border border-white/10 p-1 bg-white/5 shadow-inner">
                        <input
                            type="email"
                            placeholder="SUBSCRIBE TO BRIEFINGS..."
                            className="flex-1 bg-transparent px-6 py-4 text-[10px] font-black tracking-widest focus:outline-none placeholder:text-white/20 uppercase"
                        />
                        <button className="bg-[#c9b38c] h-12 w-12 flex items-center justify-center hover:bg-[#b99c69] transition-all group shadow-lg shadow-[#c9b38c]/10">
                            <Send size={16} className="text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 py-20 relative z-10">
                    <div className="space-y-10">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-[#c9b38c]">The Genesis</h4>
                        <p className="text-[14px] text-white/40 leading-relaxed font-light italic">
                            JRA is dedicated to empowering the public of Rajasthan with high-fidelity legal strategies, ensuring the RERA mandate is executed with precision and absolute transparency.
                        </p>
                    </div>

                    <div className="space-y-10">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-[#c9b38c]">The Command</h4>
                        <div className="space-y-6 text-[14px] text-white/40 font-light italic">
                            <p className="leading-relaxed">{firm.address}</p>
                            <p>Line: <span className="text-white font-serif">{firm.phone}</span></p>
                            <p>Protocol: <span className="text-white underline decoration-[#c9b38c]/30 underline-offset-4">{firm.email}</span></p>
                        </div>
                    </div>

                    <div className="space-y-10">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-[#c9b38c]">Registry</h4>
                        <ul className="grid grid-cols-2 gap-y-4 text-[13px] text-white/40 font-light italic">
                            {[
                                { name: 'Genesis', href: '/about' },
                                { name: 'Tactics', href: '#' },
                                { name: 'Contact', href: '/contact' },
                                { name: 'Partners', href: '/team' },
                                { name: 'Briefs', href: '/blogs' },
                                { name: 'Career', href: '/career' },
                                { name: 'Visuals', href: '/media' },
                                { name: 'Mandate', href: '#' }
                            ].map(item => (
                                <li key={item.name}><Link href={item.href} className="hover:text-[#c9b38c] transition-colors">{item.name}</Link></li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-10">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-[#c9b38c]">Jurisdictions</h4>
                        <ul className="space-y-4 text-[13px] text-white/40 font-light italic">
                            {['RERA Regulation', 'Intellectual Property', 'Corporate Mandate', 'Banking Protocols'].map(item => (
                                <li key={item}><Link href="#" className="hover:text-[#c9b38c] transition-colors">{item}</Link></li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 opacity-30">
                    <p className="text-[9px] font-black tracking-[0.4em] uppercase">© 2024 JRA LEGAL STRATEGY. ALL PROTOCOLS RESERVED.</p>
                    <div className="flex gap-10 text-[9px] font-black uppercase tracking-[0.4em]">
                        {['Privacy', 'Terms', 'Genesis', 'FAQ'].map(item => (
                            <Link key={item} href="#" className="hover:text-white transition-colors">{item}</Link>
                        ))}
                    </div>
                    <button
                        onClick={scrollUp}
                        className="h-12 w-12 bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#c9b38c] transition-all hover:-translate-y-2 group shadow-xl"
                    >
                        <ArrowUp size={16} className="group-hover:scale-125 transition-transform" />
                    </button>
                </div>
            </div>
        </footer>
    );
}
