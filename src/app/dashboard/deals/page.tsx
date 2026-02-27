'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreHorizontal, ArrowRight, DollarSign, Clock, Tag, Gavel, Briefcase } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

const STAGES = [
    { id: 'lead', name: 'Intake/Lead', color: 'bg-slate-50 text-slate-600 border border-slate-100' },
    { id: 'discovery', name: 'Discovery', color: 'bg-blue-50 text-blue-600 border border-blue-100' },
    { id: 'proposal', name: 'Engagement', color: 'bg-[#c9b38c]/10 text-[#c9b38c] border border-[#c9b38c]/20' },
    { id: 'negotiation', name: 'Negotiation', color: 'bg-amber-50 text-amber-600 border border-amber-100' },
    { id: 'won', name: 'Retained', color: 'bg-emerald-50 text-emerald-600 border border-emerald-100' },
    { id: 'lost', name: 'Released', color: 'bg-rose-50 text-rose-600 border border-rose-100' },
];

export default function DealsPage() {
    const [deals, setDeals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        fetchDeals();
    }, []);

    const fetchDeals = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('deals')
                .select('*, contacts(full_name), companies(name)');
            if (error) throw error;
            setDeals(data || []);
        } catch (err) {
            console.error('Error fetching deals:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateStage = async (dealId: string, newStage: string) => {
        try {
            const { error } = await supabase
                .from('deals')
                .update({ stage: newStage })
                .eq('id', dealId);
            if (error) throw error;
            setDeals(deals.map(d => d.id === dealId ? { ...d, stage: newStage } : d));
        } catch (err) {
            console.error('Error updating stage:', err);
        }
    };

    const filteredDeals = deals.filter(deal =>
        deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.companies?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-end gap-6">
                <div>
                    <span className="text-[#c9b38c] text-[10px] font-black uppercase tracking-[0.4em] mb-2 block">Case Acquisition</span>
                    <h1 className="text-4xl font-serif text-slate-900 leading-tight flex items-center gap-3">
                        <Briefcase className="h-8 w-8 text-[#c9b38c]" />
                        Legal Pipeline
                    </h1>
                    <p className="text-slate-500 font-light mt-1 italic">Tracking potential engagements and active negotiation phases.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-[#c9b38c] hover:bg-[#b99c69] text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-[#c9b38c]/20"
                >
                    <Plus className="w-4 h-4" />
                    Initialize Prospect
                </button>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-6">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input
                        type="text"
                        placeholder="Search registry by title or company..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-none shadow-sm focus:outline-none focus:ring-1 focus:ring-[#c9b38c] transition-all text-[11px] font-bold uppercase tracking-widest placeholder-slate-300"
                    />
                </div>
                <button className="flex items-center gap-3 px-6 py-4 bg-white border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-all">
                    <Filter className="w-4 h-4" />
                    Filter Parameters
                </button>
            </div>

            {/* Pipeline Board */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 overflow-x-auto pb-10">
                {STAGES.map((stage) => (
                    <div key={stage.id} className="min-w-[280px] flex flex-col gap-6">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    {stage.name}
                                </span>
                                <div className="h-5 w-5 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                                    <span className="text-[9px] font-black text-slate-400">
                                        {filteredDeals.filter(d => d.stage === stage.id).length}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 space-y-4 min-h-[500px]">
                            {filteredDeals
                                .filter(d => d.stage === stage.id)
                                .map((deal) => (
                                    <motion.div
                                        layoutId={deal.id}
                                        key={deal.id}
                                        className="group bg-white p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#c9b38c]/30 hover:-translate-y-1 transition-all cursor-pointer relative"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#c9b38c] transition-colors leading-tight">{deal.title}</h3>
                                            <MoreHorizontal className="w-4 h-4 text-slate-200 group-hover:text-slate-400 transition-colors" />
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Principal Client</span>
                                                <span className="text-sm text-slate-600 font-medium truncate">{deal.companies?.name || deal.contacts?.full_name || 'N/A'}</span>
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                                <div className="flex items-center gap-1.5">
                                                    <DollarSign className="w-3.5 h-3.5 text-[#c9b38c]" />
                                                    <span className="text-sm font-serif italic font-bold text-slate-800">
                                                        {Number(deal.value).toLocaleString()}
                                                    </span>
                                                </div>
                                                {deal.follow_up_date && (
                                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-rose-50 border border-rose-100">
                                                        <Clock className="w-3 h-3 text-rose-400" />
                                                        <span className="text-[9px] font-black uppercase tracking-tighter text-rose-500">Expedite</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4">
                                            <select
                                                onChange={(e) => updateStage(deal.id, e.target.value)}
                                                value={deal.stage}
                                                className="text-[9px] font-black uppercase tracking-widest bg-transparent border-none focus:ring-0 cursor-pointer text-slate-400 hover:text-[#c9b38c] transition-colors p-0"
                                            >
                                                {STAGES.map(s => (
                                                    <option key={s.id} value={s.id}>{s.name.toUpperCase()}</option>
                                                ))}
                                            </select>
                                            <ArrowRight className="w-3 h-3 text-slate-100 group-hover:text-[#c9b38c] transition-colors" />
                                        </div>
                                    </motion.div>
                                ))}

                            {filteredDeals.filter(d => d.stage === stage.id).length === 0 && (
                                <div className="h-40 border border-dashed border-slate-100 flex flex-col items-center justify-center p-6 text-center opacity-40">
                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                                        <Plus className="w-3 h-3 text-slate-200" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Phase Empty</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
