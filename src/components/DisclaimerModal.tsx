'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Scale, Gavel } from 'lucide-react';

export default function DisclaimerModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const hasAgreed = localStorage.getItem('jra_disclaimer_agreed');
        if (!hasAgreed) {
            setIsOpen(true);
        }
    }, []);

    const handleAgree = () => {
        localStorage.setItem('jra_disclaimer_agreed', 'true');
        setIsOpen(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="relative w-full max-w-2xl overflow-hidden rounded-sm bg-white shadow-2xl border border-slate-100"
                    >
                        <div className="bg-[#c9b38c] p-8 text-white text-center">
                            <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm mx-auto mb-6">
                                <Gavel className="h-10 w-10 text-white" />
                            </div>
                            <h2 className="text-2xl font-serif tracking-widest uppercase mb-2">Legal Disclaimer</h2>
                            <p className="text-[#f1ebd3] text-[10px] font-black uppercase tracking-[0.3em]">Official Circulation Registry</p>
                        </div>

                        <div className="p-10">
                            <div className="prose prose-slate max-w-none text-base leading-[1.8] text-slate-700 italic font-serif">
                                <p className="mb-6">
                                    Please be advised that the following application is intended for private circulation only. While every effort has been taken to ensure the veracity of the information provided, we assume no liability for errors or omissions that may have occurred.
                                </p>
                                <p className="mb-6">
                                    Strategic decisions should not be based solely on the contents herein. Jurisprudential facts should be cross-referenced with original Government notifications and statutory publications.
                                </p>
                                <p>
                                    Accessing this secure platform signifies your understanding that no lawyer-client relationship is formally established through its use, and the publisher remains held harmless from any ensuing damage or claim.
                                </p>
                            </div>

                            <div className="mt-12 flex flex-col items-center gap-8">
                                <div className="w-20 h-[1px] bg-[#c9b38c]"></div>
                                <button
                                    onClick={handleAgree}
                                    className="px-16 py-4 bg-[#c9b38c] hover:bg-[#b99c69] text-white text-[12px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-[#c9b38c]/20"
                                >
                                    I Acknowledge & Agree
                                </button>
                                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                    <ShieldCheck className="h-4 w-4 text-[#c9b38c]" />
                                    Secure Legal Access
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
