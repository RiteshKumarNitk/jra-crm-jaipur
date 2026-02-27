'use client';

import React, { useState, useEffect } from 'react';
import {
    Users,
    Search,
    Plus,
    Mail,
    Phone,
    Building2,
    Tag,
    MoreVertical,
    Filter,
    ArrowRight
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useSupabaseUser } from '@/hooks/useSupabaseUser';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactsPage() {
    const { user } = useSupabaseUser();
    const [contacts, setContacts] = useState<any[]>([]);
    const [companies, setCompanies] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const supabase = createClient();

    const [newContact, setNewContact] = useState({
        full_name: '',
        email: '',
        phone: '',
        company_id: '',
        tags: [] as string[],
        role: ''
    });

    const [tagInput, setTagInput] = useState('');

    useEffect(() => {
        if (user) {
            fetchContacts();
            fetchCompanies();
        }
    }, [user]);

    const fetchContacts = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('contacts')
                .select('*, companies(name)')
                .eq('lawyer_id', user?.id);
            if (error) throw error;
            setContacts(data || []);
        } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };

    const fetchCompanies = async () => {
        const { data } = await supabase.from('companies').select('id, name').eq('lawyer_id', user?.id);
        setCompanies(data || []);
    };

    const handleAddContact = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        try {
            const { error } = await supabase
                .from('contacts')
                .insert([{ ...newContact, lawyer_id: user.id }]);
            if (error) throw error;
            setIsModalOpen(false);
            setNewContact({ full_name: '', email: '', phone: '', company_id: '', tags: [], role: '' });
            fetchContacts();
        } catch (err) { console.error(err); }
    };

    const filtered = contacts.filter(c =>
        c.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.tags?.some((t: string) => t.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-end gap-6 text-slate-800">
                <div>
                    <span className="text-[#c9b38c] text-[10px] font-black uppercase tracking-[0.4em] mb-2 block">Personnel Index</span>
                    <h1 className="text-4xl font-serif text-slate-900 leading-tight flex items-center gap-3">
                        <Users className="h-8 w-8 text-[#c9b38c]" />
                        Client Registry
                    </h1>
                    <p className="text-slate-500 font-light mt-1 italic">Managing individual counterparts and their institutional affiliations.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#c9b38c] hover:bg-[#b99c69] text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-[#c9b38c]/20 flex items-center gap-3"
                >
                    <Plus className="w-4 h-4" /> Add Registry Entry
                </button>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-6">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input
                        placeholder="Search Registry by Name, Identity or Tags..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-none shadow-sm focus:outline-none focus:ring-1 focus:ring-[#c9b38c] transition-all text-[11px] font-bold uppercase tracking-widest placeholder-slate-300"
                    />
                </div>
                <button className="flex items-center gap-3 px-6 py-4 bg-white border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-all">
                    <Filter className="w-4 h-4" /> Categorize
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map((contact) => (
                    <motion.div
                        layout
                        id={contact.id}
                        key={contact.id}
                        className="bg-white p-8 border border-slate-100 shadow-sm relative group hover:shadow-xl hover:border-[#c9b38c]/30 hover:-translate-y-1 transition-all"
                    >
                        <div className="flex items-start justify-between mb-6 pb-6 border-b border-slate-50">
                            <div className="h-16 w-16 rounded-none bg-slate-50 flex items-center justify-center text-xl font-black text-slate-300 group-hover:bg-[#c9b38c]/10 group-hover:text-[#c9b38c] transition-all border border-slate-100">
                                {contact.full_name[0]}
                            </div>
                            <button className="p-2 text-slate-200 hover:text-[#c9b38c]"><MoreVertical className="w-5 h-5" /></button>
                        </div>

                        <h3 className="text-xl font-serif italic text-slate-900 mb-2 group-hover:text-[#c9b38c] transition-colors">{contact.full_name}</h3>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#c9b38c] mb-6">
                            <Building2 className="w-3.5 h-3.5" /> {contact.companies?.name || 'Private Individual'}
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500 hover:text-slate-900 transition-colors truncate">
                                <div className="p-2 bg-slate-50 rounded-sm"><Mail className="w-3.5 h-3.5" /></div> {contact.email || 'No Encrypted Email'}
                            </div>
                            <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500 hover:text-slate-900 transition-colors">
                                <div className="p-2 bg-slate-50 rounded-sm"><Phone className="w-3.5 h-3.5" /></div> {contact.phone || 'No Secure Line'}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-50">
                            {contact.tags?.map((tag: string) => (
                                <span key={tag} className="px-3 py-1 bg-slate-50 text-[9px] font-black uppercase tracking-widest text-slate-400 border border-slate-100 hover:border-[#c9b38c]/30 transition-colors">
                                    {tag}
                                </span>
                            ))}
                            {(!contact.tags || contact.tags.length === 0) && (
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-300 italic">No Metadata Tags</span>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Add Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white rounded-none p-10 max-w-xl w-full shadow-2xl border border-slate-100">
                            <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-50">
                                <h2 className="text-2xl font-serif text-slate-900 italic">Register New Personnel</h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-3 text-slate-200 hover:text-rose-500 transition-colors bg-slate-50 rounded-full"
                                >
                                    <Plus className="h-6 w-6 rotate-45" />
                                </button>
                            </div>

                            <form onSubmit={handleAddContact} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Legal Identity (Name)</label>
                                        <input required value={newContact.full_name} onChange={e => setNewContact({ ...newContact, full_name: e.target.value })} className="w-full border-none bg-slate-50 p-4 text-[12px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-[#c9b38c] transition-all shadow-inner" placeholder="Honorable Representative" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Electronic Mail</label>
                                        <input type="email" value={newContact.email} onChange={e => setNewContact({ ...newContact, email: e.target.value })} className="w-full border-none bg-slate-50 p-4 text-[12px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-[#c9b38c] transition-all shadow-inner" placeholder="contact@registry.com" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Secure Line (Phone)</label>
                                        <input value={newContact.phone} onChange={e => setNewContact({ ...newContact, phone: e.target.value })} className="w-full border-none bg-slate-50 p-4 text-[12px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-[#c9b38c] transition-all shadow-inner" placeholder="+00 123 456 789" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Institutional Affiliation</label>
                                    <select
                                        value={newContact.company_id}
                                        onChange={e => setNewContact({ ...newContact, company_id: e.target.value })}
                                        className="w-full border-none bg-slate-50 p-4 text-[12px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-[#c9b38c] transition-all shadow-inner"
                                    >
                                        <option value="">PRIVATE CAPACITY / INDIVIDUAL</option>
                                        {companies.map(c => <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Categorization Tags</label>
                                    <div className="flex gap-2 mb-4 flex-wrap">
                                        {newContact.tags.map(t => (
                                            <span key={t} className="px-3 py-1 bg-[#c9b38c]/10 text-[#c9b38c] text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-[#c9b38c]/20">
                                                {t} <button type="button" onClick={() => setNewContact({ ...newContact, tags: newContact.tags.filter(tag => tag !== t) })} className="hover:text-rose-500">×</button>
                                            </span>
                                        ))}
                                    </div>
                                    <input
                                        value={tagInput}
                                        onChange={e => setTagInput(e.target.value)}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                if (tagInput.trim()) {
                                                    setNewContact({ ...newContact, tags: [...newContact.tags, tagInput.trim()] });
                                                    setTagInput('');
                                                }
                                            }
                                        }}
                                        className="w-full border-none bg-slate-50 p-4 text-[12px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-[#c9b38c] transition-all shadow-inner"
                                        placeholder="Type Descriptor and Press ENTER..."
                                    />
                                </div>
                                <div className="flex gap-6 mt-10 pt-6 border-t border-slate-50">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-100 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-slate-900 transition-all">Abort Protocol</button>
                                    <button type="submit" className="flex-1 bg-[#c9b38c] py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-[#c9b38c]/20 hover:bg-[#b99c69] transition-all">Commit Registry entry</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
