'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Scale, Gavel } from 'lucide-react';
import { insforge } from '@/utils/insforge';

export default function DisclaimerModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState<any>({
        title: "Legal Protocol Notice",
        mandate: "Official Mandate 2024",
        message: '"This digital infrastructure is reserved exclusively for the private consultants and verified partners of JRA Legal Associates."',
        subtext: "Strategic cross-referencing with official RERA publications is mandatory.",
        acknowledge_text: "Authorize Entry & Agree"
    });

    useEffect(() => {
        const hasAgreed = localStorage.getItem('jra_disclaimer_agreed');
        if (!hasAgreed) {
            setIsOpen(true);
            document.body.style.overflow = 'hidden';
            fetchContent();
        }
    }, []);

    const fetchContent = async () => {
        try {
            const { data } = await insforge.database
                .from('website_content')
                .select('content')
                .eq('section', 'disclaimer')
                .maybeSingle();
            if (data?.content) setContent(data.content);
        } catch (err) { console.error(err); }
    };

    const handleAgree = () => {
        localStorage.setItem('jra_disclaimer_agreed', 'true');
        setIsOpen(false);
        document.body.style.overflow = 'unset';
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#0F111A]">
                    {/* Top Aesthetic Bar */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#c9b38c]" />

                    {/* Artistic Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none overflow-hidden">
                        <span className="text-[500px] font-serif italic font-black text-white rotate-12">JRA</span>
                    </div>

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.1, opacity: 0 }}
                        className="relative w-full max-w-3xl m-6 overflow-y-auto overflow-x-hidden rounded-sm bg-white shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-slate-100 z-10 max-h-[90vh]"
                    >
                        {/* Header Header */}
                        <div className="bg-[#1C202E] p-10 text-white text-center relative overflow-hidden flex-shrink-0">
                            <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
                                <Scale size={120} />
                            </div>

                            <div className="h-24 w-24 rounded-none border border-white/20 flex items-center justify-center rotate-45 mx-auto mb-8 bg-white/5">
                                <Gavel className="h-10 w-10 text-[#c9b38c] -rotate-45" />
                            </div>

                            <h2 className="text-3xl font-serif tracking-[0.2em] uppercase mb-3 italic">{content.title}</h2>
                            <div className="flex items-center justify-center gap-4">
                                <div className="h-[1px] w-8 bg-[#c9b38c]/50" />
                                <p className="text-[#c9b38c] text-[10px] font-black uppercase tracking-[0.4em]">{content.mandate}</p>
                                <div className="h-[1px] w-8 bg-[#c9b38c]/50" />
                            </div>
                        </div>

                        <div className="p-12 md:p-16">
                            <div className="prose prose-slate max-w-none text-lg md:text-xl leading-[1.8] text-slate-800 italic font-serif text-center">
                                <p className="mb-8">
                                    {content.message}
                                </p>
                                <p className="mb-0 text-slate-500 text-sm font-sans not-italic uppercase tracking-widest font-black opacity-60">
                                    {content.subtext}
                                </p>
                            </div>

                            <div className="mt-16 flex flex-col items-center gap-10">
                                <button
                                    onClick={handleAgree}
                                    className="group relative px-20 py-6 bg-[#c9b38c] overflow-hidden transition-all active:scale-95 shadow-[0_20px_40px_rgba(201,179,140,0.3)] hover:shadow-[0_25px_50px_rgba(201,179,140,0.4)]"
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                                    <span className="relative z-10 text-white text-[14px] font-black uppercase tracking-[0.3em]">{content.acknowledge_text}</span>
                                </button>

                                <div className="flex flex-col items-center gap-4">
                                    <div className="flex items-center gap-3 text-slate-300 text-[10px] font-black uppercase tracking-[0.4em]">
                                        <ShieldCheck className="h-4 w-4 text-[#c9b38c]" />
                                        End-to-End Encryption Active
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-light italic text-center max-w-md">
                                        Accessing this platform signifies your formal understanding that no lawyer-client relationship is established through its use.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
