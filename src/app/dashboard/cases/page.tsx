'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Briefcase,
    Search,
    Plus,
    MoreVertical,
    Calendar,
    User,
    Activity,
    Filter,
    AlertCircle,
    FileText,
    Gavel,
    Shield
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useSupabaseUser } from '@/hooks/useSupabaseUser';

interface Case {
    id: string;
    title: string;
    description: string | null;
    case_number: string | null;
    status: string;
    practice_area: string | null;
    client_id: string;
    clients?: { full_name: string };
    created_at: string;
}

interface Client {
    id: string;
    full_name: string;
}

export default function CasesPage() {
    const { user } = useSupabaseUser();
    const [cases, setCases] = useState<Case[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const supabase = createClient();

    // Form state
    const [newCase, setNewCase] = useState({
        title: '',
        description: '',
        case_number: '',
        practice_area: 'Corporate Law',
        client_id: '',
    });

    const fetchData = async () => {
        if (!user) return;
        setIsLoading(true);

        try {
            // Fetch cases with client names
            const { data: casesData, error: casesError } = await supabase
                .from('cases')
                .select('*, clients:contacts(full_name)')
                .eq('lawyer_id', user.id)
                .order('created_at', { ascending: false });

            // Fetch clients for the dropdown
            const { data: clientsData } = await supabase
                .from('contacts')
                .select('id, full_name')
                .eq('lawyer_id', user.id);

            if (!casesError && casesData) {
                setCases(casesData as any[]);
            }
            if (clientsData) {
                setClients(clientsData as Client[]);
            }
        } catch (err) {
            console.error('Data fetch error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const handleAddCase = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        const { error } = await supabase
            .from('cases')
            .insert([
                {
                    ...newCase,
                    lawyer_id: user.id,
                },
            ])
            .select();

        if (!error) {
            setIsAddModalOpen(false);
            setNewCase({ title: '', description: '', case_number: '', practice_area: 'Corporate Law', client_id: '' });
            fetchData();
        }
    };

    const filteredCases = cases.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.case_number?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-10">
            {/* Page Header */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <span className="text-[#c9b38c] text-[10px] font-black uppercase tracking-[0.4em] mb-2 block">Matter Registry</span>
                    <h1 className="text-4xl font-serif text-slate-900 leading-tight flex items-center gap-3">
                        <Gavel className="h-8 w-8 text-[#c9b38c]" />
                        Legal Matters
                    </h1>
                    <p className="text-slate-500 font-light mt-1 italic">Comprehensive archive of all active and historical legal proceedings.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center justify-center gap-3 bg-[#c9b38c] hover:bg-[#b99c69] text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-[#c9b38c]/20"
                >
                    <Plus className="h-4 w-4" />
                    Open New Matter
                </button>
            </div>

            {/* Status Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {[
                    { label: 'Matter Load', value: cases.length, icon: Activity, color: 'text-[#c9b38c]', bg: 'bg-[#c9b38c]/10' },
                    { label: 'Priority Alerts', value: '3', icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-50' },
                    { label: 'Historical Docs', value: '184', icon: FileText, color: 'text-slate-500', bg: 'bg-slate-50' },
                ].map((stat, i) => (
                    <div key={i} className="p-8 bg-white border border-slate-100 shadow-sm flex items-center justify-between group hover:border-[#c9b38c]/30 transition-all">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                            <p className="text-3xl font-serif text-slate-900">{stat.value}</p>
                        </div>
                        <div className={`h-14 w-14 flex items-center justify-center ${stat.bg} ${stat.color} group-hover:bg-[#c9b38c] group-hover:text-white transition-colors`}>
                            <stat.icon className="h-6 w-6" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Registry Controls */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-4 flex items-center">
                        <Search className="h-4 w-4 text-slate-300" />
                    </span>
                    <input
                        type="text"
                        className="block w-full border border-slate-100 bg-white pl-12 pr-4 py-4 text-[11px] font-bold uppercase tracking-widest placeholder-slate-300 focus:outline-none focus:ring-1 focus:ring-[#c9b38c] shadow-sm transition-all"
                        placeholder="Filter Registry by Title or Reference Number..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button className="flex items-center gap-3 px-6 py-4 bg-white border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-all">
                    <Filter className="h-4 w-4" />
                    Jurisdiction/Status
                </button>
            </div>

            {/* Registry Table */}
            <div className="bg-white border border-slate-100 shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center py-24">
                        <div className="h-10 w-10 animate-spin border-t-2 border-[#c9b38c] border-slate-100 rounded-full"></div>
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-[#fafafa]">
                            <tr>
                                <th className="px-8 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Matter Profile</th>
                                <th className="px-8 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Principle Client</th>
                                <th className="px-8 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Practice Unit</th>
                                <th className="px-8 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-6 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest">Protocol</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredCases.length > 0 ? (
                                filteredCases.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-all cursor-pointer group">
                                        <td className="px-8 py-8">
                                            <div className="flex flex-col gap-1.5">
                                                <span className="text-sm font-bold text-slate-900 group-hover:text-[#c9b38c] transition-all">{item.title}</span>
                                                <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400 font-mono">REF: {item.case_number || 'UNN-0000'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-none bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 border border-slate-200 group-hover:bg-[#c9b38c]/10 group-hover:text-[#c9b38c] transition-colors">
                                                    {(item as any).clients?.full_name?.[0] || 'C'}
                                                </div>
                                                <span className="text-sm text-slate-700 font-medium italic font-serif">{(item as any).clients?.full_name || 'Individual Petitioner'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 whitespace-nowrap">
                                            <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">{item.practice_area}</span>
                                        </td>
                                        <td className="px-8 py-8 whitespace-nowrap">
                                            <span className="inline-flex items-center px-3 py-1 bg-white border border-slate-100 text-[10px] font-black uppercase tracking-widest text-[#c9b38c] shadow-sm">
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-8 whitespace-nowrap text-right">
                                            <button className="p-2 text-slate-200 hover:text-[#c9b38c] transition-colors">
                                                <MoreVertical className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-8 py-32 text-center opacity-40">
                                        <div className="flex flex-col items-center">
                                            <Briefcase className="h-16 w-16 text-slate-100 mb-6" />
                                            <p className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-400">Registry Currently Unoccupied</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal remains visually consistent */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative w-full max-w-xl overflow-hidden rounded-none bg-white shadow-2xl border border-slate-100 p-10"
                        >
                            <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-50">
                                <h2 className="text-2xl font-serif text-slate-900 leading-tight italic">Initialize Matter Profile</h2>
                                <button
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="p-3 text-slate-200 hover:text-rose-500 transition-colors bg-slate-50 rounded-full"
                                >
                                    <Plus className="h-6 w-6 rotate-45" />
                                </button>
                            </div>

                            <form onSubmit={handleAddCase} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Matter Nomenclature</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full border-none bg-slate-50 p-4 text-[12px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-[#c9b38c] transition-all shadow-inner"
                                            placeholder="Matter Title..."
                                            value={newCase.title}
                                            onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Primary Counsel Subject</label>
                                        <select
                                            required
                                            className="w-full border-none bg-slate-50 p-4 text-[12px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-[#c9b38c] transition-all shadow-inner"
                                            value={newCase.client_id}
                                            onChange={(e) => setNewCase({ ...newCase, client_id: e.target.value })}
                                        >
                                            <option value="">Select Registry Contact</option>
                                            {clients.map(client => (
                                                <option key={client.id} value={client.id}>{client.full_name.toUpperCase()}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Practice Sub-Unit</label>
                                        <select
                                            className="w-full border-none bg-slate-50 p-4 text-[12px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-[#c9b38c] transition-all shadow-inner"
                                            value={newCase.practice_area}
                                            onChange={(e) => setNewCase({ ...newCase, practice_area: e.target.value })}
                                        >
                                            <option>Corporate Litigation</option>
                                            <option>Intellectual Property</option>
                                            <option>Arbitration</option>
                                            <option>Statutory Compliance</option>
                                            <option>Family/Estate Law</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Reference Number</label>
                                        <input
                                            type="text"
                                            className="w-full border-none bg-slate-50 p-4 text-[12px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-[#c9b38c] transition-all shadow-inner"
                                            placeholder="FILE-A102"
                                            value={newCase.case_number}
                                            onChange={(e) => setNewCase({ ...newCase, case_number: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Matter Briefing</label>
                                    <textarea
                                        rows={4}
                                        className="w-full border-none bg-slate-50 p-4 text-[12px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-[#c9b38c] transition-all resize-none shadow-inner"
                                        placeholder="Detailed background and summary..."
                                        value={newCase.description}
                                        onChange={(e) => setNewCase({ ...newCase, description: e.target.value })}
                                    />
                                </div>

                                <div className="flex gap-6 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="flex-1 bg-slate-100 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-slate-900 transition-all"
                                    >
                                        Cancel Protocol
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-[#c9b38c] py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-[#c9b38c]/20 hover:bg-[#b99c69] transition-all"
                                    >
                                        Commit to Registry
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
