'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Building2, Globe, Tag, MoreVertical, ExternalLink, Mail, Phone, Scale } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { insforge } from '@/utils/insforge';
import { motion, AnimatePresence } from 'framer-motion';

export default function CompaniesPage() {
    const { user } = useAuth();
    const [companies, setCompanies] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCompany, setNewCompany] = useState({
        name: '',
        website: '',
        industry: '',
    });

    useEffect(() => {
        if (user) fetchCompanies();
    }, [user]);

    const fetchCompanies = async () => {
        if (!user) return;
        try {
            setIsLoading(true);
            const { data } = await insforge.database
                .from('companies')
                .select('*, contacts(id)')
                .eq('lawyer_id', user.id)
                .order('name', { ascending: true });
            setCompanies(data || []);
        } catch (err) {
            console.error('Error fetching companies:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddCompany = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        try {
            const { error } = await insforge.database
                .from('companies')
                .insert([{ ...newCompany, lawyer_id: user.id }]);
            if (error) throw error;
            setIsModalOpen(false);
            setNewCompany({ name: '', website: '', industry: '' });
            fetchCompanies();
        } catch (err) {
            console.error('Error adding company:', err);
        }
    };

    const filtered = companies.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.industry?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-end gap-6">
                <div>
                    <span className="text-[#c9b38c] text-[10px] font-black uppercase tracking-[0.4em] mb-2 block">Institutional Register</span>
                    <h1 className="text-4xl font-serif text-slate-900 leading-tight flex items-center gap-3">
                        <Scale className="h-8 w-8 text-[#c9b38c]" />
                        Firm Directory
                    </h1>
                    <p className="text-slate-500 font-light mt-1 italic">Managing corporate accounts and multi-jurisdictional entities.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-3 bg-[#c9b38c] hover:bg-[#b99c69] text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-[#c9b38c]/20"
                >
                    <Plus className="w-4 h-4" />
                    Register New Entity
                </button>
            </div>

            {/* Controls */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input
                    type="text"
                    placeholder="Search Entities by Nomenclature or Practice Industry..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-none shadow-sm focus:outline-none focus:ring-1 focus:ring-[#c9b38c] transition-all text-[11px] font-bold uppercase tracking-widest placeholder-slate-300"
                />
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-50 border border-slate-100 animate-pulse" />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filtered.map((company) => (
                        <motion.div
                            layout
                            key={company.id}
                            className="group bg-white p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#c9b38c]/30 hover:-translate-y-1 transition-all"
                        >
                            <div className="flex items-start justify-between mb-8 pb-6 border-b border-slate-50">
                                <div className="flex items-center gap-5">
                                    <div className="h-14 w-14 rounded-none bg-slate-50 flex items-center justify-center text-[#c9b38c] border border-slate-100 group-hover:bg-[#c9b38c] group-hover:text-white transition-all">
                                        <Building2 className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-serif italic text-slate-900 group-hover:text-[#c9b38c] transition-colors leading-tight">
                                            {company.name}
                                        </h3>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{company.industry || 'General Sector'}</p>
                                    </div>
                                </div>
                                <button className="p-2 text-slate-200 hover:text-slate-400 transition-colors">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4 mb-8">
                                {company.website && (
                                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[11px] font-medium text-slate-500 hover:text-[#c9b38c] transition-colors">
                                        <div className="p-2 bg-slate-50 rounded-sm"><Globe className="w-3.5 h-4" /></div>
                                        {company.website.replace(/^https?:\/\//, '')}
                                    </a>
                                )}
                                <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500">
                                    <div className="p-2 bg-slate-50 rounded-sm"><Tag className="w-3.5 h-4" /></div>
                                    <span>{company.contacts?.length || 0} AFFILIATED PERSONNEL</span>
                                </div>
                            </div>

                            <div className="mt-auto pt-6 border-t border-slate-50 flex justify-end">
                                <button className="text-[10px] font-black uppercase tracking-widest text-[#c9b38c] hover:underline flex items-center gap-2">
                                    Access Entity Portfolio <ExternalLink className="w-3 h-3" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                    {filtered.length === 0 && (
                        <div className="col-span-full py-32 text-center opacity-40">
                            <Building2 className="h-16 w-16 text-slate-100 mx-auto mb-6" />
                            <p className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-400">Firm Registry Null</p>
                        </div>
                    )}
                </div>
            )}

            {/* Add Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white rounded-none p-10 max-w-xl w-full shadow-2xl border border-slate-100">
                            <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-50">
                                <h2 className="text-2xl font-serif text-slate-900 leading-tight italic">Incorporate Entity Record</h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-3 text-slate-200 hover:text-rose-500 transition-colors bg-slate-50 rounded-full"
                                >
                                    <Plus className="h-6 w-6 rotate-45" />
                                </button>
                            </div>

                            <form onSubmit={handleAddCompany} className="space-y-8">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Corporate Nomenclature</label>
                                    <input required value={newCompany.name} onChange={e => setNewCompany({ ...newCompany, name: e.target.value })} className="w-full border-none bg-slate-50 p-4 text-[12px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-[#c9b38c] transition-all shadow-inner" placeholder="Acme Jurisdictional Inc." />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Institutional Website</label>
                                        <input value={newCompany.website} onChange={e => setNewCompany({ ...newCompany, website: e.target.value })} className="w-full border-none bg-slate-50 p-4 text-[12px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-[#c9b38c] transition-all shadow-inner" placeholder="https://registry.com" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Primary Industry Sector</label>
                                        <input value={newCompany.industry} onChange={e => setNewCompany({ ...newCompany, industry: e.target.value })} className="w-full border-none bg-slate-50 p-4 text-[12px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-[#c9b38c] transition-all shadow-inner" placeholder="Technology, Finance, etc." />
                                    </div>
                                </div>
                                <div className="flex gap-6 mt-10 pt-6 border-t border-slate-50">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-100 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-slate-900 transition-all">Abort Entry</button>
                                    <button type="submit" className="flex-1 bg-[#c9b38c] py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-[#c9b38c]/20 hover:bg-[#b99c69] transition-all">Commit Entity</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
