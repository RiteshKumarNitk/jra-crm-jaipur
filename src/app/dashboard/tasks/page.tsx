'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckSquare,
    Clock,
    AlertCircle,
    Plus,
    Search,
    Filter,
    MoreVertical,
    Circle,
    CheckCircle2,
    Loader2,
    Calendar,
    ChevronRight,
    Tag,
    Gavel,
    Trash2
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useSupabaseUser } from '@/hooks/useSupabaseUser';
import { format } from 'date-fns';

interface Task {
    id: string;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    due_date: string | null;
    case_id: string | null;
    cases?: { title: string };
    created_at: string;
}

export default function TasksPage() {
    const { user } = useSupabaseUser();
    const supabase = createClient();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Form state
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        priority: 'medium',
        due_date: '',
        case_id: ''
    });

    const [cases, setCases] = useState<any[]>([]);

    const fetchData = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('tasks')
                .select('*, cases:cases(title)')
                .eq('lawyer_id', user.id)
                .order('created_at', { ascending: false });

            if (data) setTasks(data);

            const { data: casesData } = await supabase.from('cases').select('id, title');
            if (casesData) setCases(casesData);

        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        const { error } = await supabase
            .from('tasks')
            .insert([{
                ...newTask,
                lawyer_id: user.id,
                status: 'pending'
            }]);

        if (!error) {
            setIsAddModalOpen(false);
            setNewTask({ title: '', description: '', priority: 'medium', due_date: '', case_id: '' });
            fetchData();
        }
    };

    const toggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
        const { error } = await supabase
            .from('tasks')
            .update({ status: newStatus })
            .eq('id', id);

        if (!error) fetchData();
    };

    const deleteTask = async (id: string) => {
        const { error } = await supabase.from('tasks').delete().eq('id', id);
        if (!error) fetchData();
    };

    const filteredTasks = tasks.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const pendingTasks = filteredTasks.filter(t => t.status !== 'completed');
    const completedTasks = filteredTasks.filter(t => t.status === 'completed');

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <span className="text-[#c9b38c] text-[10px] font-black uppercase tracking-[0.4em] mb-2 block">Protocol Management</span>
                    <h1 className="text-4xl font-serif text-slate-900 leading-tight flex items-center gap-3">
                        <CheckSquare className="h-8 w-8 text-[#c9b38c]" />
                        Strategic Tasks
                    </h1>
                    <p className="text-slate-500 font-light mt-1 italic">Tracking operational deliverables and legal checkpoints.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center justify-center gap-3 bg-[#c9b38c] hover:bg-[#b99c69] text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-[#c9b38c]/20"
                >
                    <Plus className="h-4 w-4" />
                    Induct Protocol Task
                </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Pending Protocols', value: pendingTasks.length, icon: Clock, color: 'text-[#c9b38c]', bg: 'bg-[#c9b38c]/10' },
                    { label: 'Critical Priority', value: filteredTasks.filter(t => t.priority === 'high' && t.status !== 'completed').length, icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-50' },
                    { label: 'Executed Tasks', value: completedTasks.length, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' }
                ].map((stat, i) => (
                    <div key={i} className="p-8 bg-white border border-slate-100 shadow-sm flex items-center justify-between group hover:border-[#c9b38c]/30 transition-all">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                            <p className="text-3xl font-serif text-slate-900">{stat.value}</p>
                        </div>
                        <div className={`h-12 w-12 flex items-center justify-center ${stat.bg} ${stat.color} group-hover:bg-[#c9b38c] group-hover:text-white transition-colors`}>
                            <stat.icon className="h-5 w-5" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-10">
                {/* Search & Filter */}
                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                        <input
                            className="w-full bg-white border border-slate-100 pl-12 pr-4 py-4 text-[11px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-[#c9b38c] outline-none shadow-sm"
                            placeholder="Search Protocols..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Tasks List */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1 h-6 bg-[#c9b38c]"></div>
                            <h2 className="text-xl font-serif text-slate-900">Active Protocols</h2>
                        </div>

                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-32 bg-white border border-slate-100">
                                <Loader2 className="h-8 w-8 text-[#c9b38c] animate-spin mb-4" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Intelligence...</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {pendingTasks.length > 0 ? pendingTasks.map((task) => (
                                    <div key={task.id} className="bg-white border border-slate-100 p-8 flex items-center gap-6 group hover:border-[#c9b38c]/30 transition-all shadow-sm">
                                        <button onClick={() => toggleStatus(task.id, task.status)} className="p-2 text-slate-200 hover:text-[#c9b38c] transition-colors rounded-full border border-slate-50">
                                            <Circle className="h-6 w-6" />
                                        </button>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#c9b38c] transition-colors truncate">{task.title}</h4>
                                                <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest border ${task.priority === 'high' ? 'bg-rose-50 text-rose-500 border-rose-100' :
                                                        task.priority === 'medium' ? 'bg-[#c9b38c]/10 text-[#c9b38c] border-[#c9b38c]/20' :
                                                            'bg-slate-50 text-slate-400 border-slate-100'
                                                    }`}>
                                                    {task.priority}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                {task.due_date && <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {format(new Date(task.due_date), 'MMM dd, yyyy')}</span>}
                                                {task.cases && <span className="flex items-center gap-1.5 text-slate-300 italic"><Gavel className="h-3 w-3" /> {task.cases.title}</span>}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => deleteTask(task.id)} className="p-2 text-slate-100 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="h-4 w-4" /></button>
                                            <button className="p-2 text-slate-200 hover:text-slate-900 transition-colors"><MoreVertical className="h-5 w-5" /></button>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="bg-slate-50/50 border border-dashed border-slate-200 p-20 text-center">
                                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-300 italic">No Active Protocols recorded.</p>
                                    </div>
                                )}

                                {/* Completed section */}
                                {completedTasks.length > 0 && (
                                    <div className="pt-10 space-y-4 opacity-60">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-1 h-6 bg-emerald-500"></div>
                                            <h2 className="text-xl font-serif text-slate-400">Executed Protocols</h2>
                                        </div>
                                        {completedTasks.map((task) => (
                                            <div key={task.id} className="bg-white border border-slate-50 p-6 flex items-center gap-6 group hover:border-[#c9b38c]/10 transition-all">
                                                <button onClick={() => toggleStatus(task.id, task.status)} className="p-2 text-emerald-500 transition-colors">
                                                    <CheckCircle2 className="h-6 w-6" />
                                                </button>
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-bold text-slate-400 line-through">{task.title}</h4>
                                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Executed {format(new Date(task.created_at), 'MMM dd')}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="bg-[#262B3E] p-10 text-white relative overflow-hidden">
                            <h3 className="text-2xl font-serif italic mb-6 relative z-10">Practice Efficiency</h3>
                            <p className="text-slate-400 text-xs leading-relaxed mb-8 relative z-10">Optimizing firm operations through structured protocol tracking.</p>
                            <div className="h-2 bg-white/5 rounded-full mb-2 overflow-hidden relative z-10">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${(completedTasks.length / (filteredTasks.length || 1)) * 100}%` }} className="h-full bg-[#c9b38c]" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#c9b38c] relative z-10">Completion Yield: {Math.round((completedTasks.length / (filteredTasks.length || 1)) * 100)}%</p>
                            <CheckSquare className="absolute -bottom-6 -right-6 h-32 w-32 text-white/5 rotate-12" />
                        </div>

                        <div className="bg-white border border-slate-100 p-8">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2"><Tag className="h-3 w-3" /> Tactical Guidelines</h4>
                            <div className="space-y-4">
                                <div className="flex gap-4 p-4 bg-slate-50 rounded-sm">
                                    <div className="h-2 w-2 rounded-full bg-rose-500 mt-1 flex-shrink-0" />
                                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tight leading-relaxed">Prioritize matters under Statutory Compliance immediately.</p>
                                </div>
                                <div className="flex gap-4 p-4 bg-slate-50 rounded-sm">
                                    <div className="h-2 w-2 rounded-full bg-[#c9b38c] mt-1 flex-shrink-0" />
                                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tight leading-relaxed">Review Case Mergers during Friday Strategic Docket.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-10 max-w-xl w-full shadow-2xl relative">
                            <h2 className="text-2xl font-serif italic text-slate-900 mb-10 border-b border-slate-50 pb-6">Define Protocol Task</h2>
                            <form onSubmit={handleAddTask} className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Protocol Title</label>
                                    <input required className="w-full bg-slate-50 border-none p-4 text-[12px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-[#c9b38c]" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} placeholder="Task nomenclature..." />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Operational Priority</label>
                                        <select className="w-full bg-slate-50 border-none p-4 text-[12px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-[#c9b38c]" value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })}>
                                            <option value="low">Standard</option>
                                            <option value="medium">Required</option>
                                            <option value="high">Critical</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Target Date (Due)</label>
                                        <input type="date" className="w-full bg-slate-50 border-none p-4 text-[12px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-[#c9b38c]" value={newTask.due_date} onChange={e => setNewTask({ ...newTask, due_date: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Related Legal Matter</label>
                                    <select className="w-full bg-slate-50 border-none p-4 text-[12px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-[#c9b38c]" value={newTask.case_id} onChange={e => setNewTask({ ...newTask, case_id: e.target.value })}>
                                        <option value="">Firm General</option>
                                        {cases.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Operational Briefing</label>
                                    <textarea rows={4} className="w-full bg-slate-50 border-none p-4 text-[12px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-[#c9b38c] resize-none" value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} placeholder="Detailed instructions..." />
                                </div>
                                <div className="flex gap-6 pt-6">
                                    <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-5 text-[10px] font-black uppercase bg-slate-50 tracking-widest text-slate-400">Abort Protocol</button>
                                    <button type="submit" className="flex-1 py-5 text-[10px] font-black uppercase bg-[#c9b38c] tracking-widest text-white shadow-xl shadow-[#c9b38c]/20">Induct Task</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
