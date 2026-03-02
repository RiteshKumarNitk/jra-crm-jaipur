'use client';

import React, { useState, useEffect, use } from 'react';
import {
    ArrowLeft,
    Calendar,
    DollarSign,
    Clock,
    FileText,
    CheckCircle2,
    Plus,
    Paperclip,
    History,
    Send,
    Trash2,
    MoreVertical,
    Building2,
    Users
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { insforge } from '@/utils/insforge';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function DealDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { user } = useAuth();
    const [deal, setDeal] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'timeline' | 'tasks' | 'notes' | 'files'>('timeline');

    // Feature states
    const [notes, setNotes] = useState<any[]>([]);
    const [tasks, setTasks] = useState<any[]>([]);
    const [logs, setLogs] = useState<any[]>([]);
    const [attachments, setAttachments] = useState<any[]>([]);

    // Form states
    const [newNote, setNewNote] = useState('');
    const [newTask, setNewTask] = useState('');

    useEffect(() => {
        if (user && id) fetchDealData();
    }, [user, id]);

    const fetchDealData = async () => {
        try {
            setLoading(true);
            const [dealRes, notesRes, tasksRes, logsRes, attachRes] = await Promise.all([
                insforge.database.from('deals').select('*, contacts(*), companies(*)').eq('id', id).maybeSingle(),
                insforge.database.from('deal_notes').select('*').eq('deal_id', id).order('created_at', { ascending: false }),
                insforge.database.from('deal_tasks').select('*').eq('deal_id', id).order('created_at', { ascending: true }),
                insforge.database.from('activity_logs').select('*').eq('deal_id', id).order('created_at', { ascending: false }),
                insforge.database.from('deal_attachments').select('*').eq('deal_id', id)
            ]);

            setDeal(dealRes.data);
            setNotes(notesRes.data || []);
            setTasks(tasksRes.data || []);
            setLogs(logsRes.data || []);
            setAttachments(attachRes.data || []);
        } catch (err) {
            console.error('Error fetching deal data:', err);
        } finally {
            setLoading(false);
        }
    };

    const addNote = async () => {
        if (!newNote.trim()) return;
        try {
            const { data, error } = await insforge.database
                .from('deal_notes')
                .insert([{ deal_id: id, content: newNote, lawyer_id: user?.id }])
                .select();
            if (!error && data) {
                setNotes([data[0], ...notes]);
                setNewNote('');
                fetchDealData();
            }
        } catch (err) { console.error(err); }
    };

    const toggleTask = async (taskId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
        try {
            await insforge.database.from('deal_tasks').update({ status: newStatus }).eq('id', taskId);
            setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
        } catch (err) { console.error(err); }
    };

    if (loading) return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent" /></div>;
    if (!deal) return <div className="text-center py-20 text-slate-500 font-bold">Deal not found.</div>;

    return (
        <div className="space-y-8 pb-20">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/deals" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-slate-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{deal.title}</h1>
                    <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm font-medium text-slate-500 flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5" /> {deal.companies?.name}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-sm font-medium text-slate-500 flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" /> {deal.contacts?.full_name}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Details & Stats */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Overview</h2>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500 font-medium">Stage</span>
                                <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {deal.stage}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500 font-medium">Value</span>
                                <span className="text-slate-900 dark:text-white font-bold flex items-center gap-1">
                                    <DollarSign className="w-4 h-4 text-emerald-500" />
                                    {Number(deal.value).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500 font-medium">Follow Up</span>
                                <span className="text-slate-900 dark:text-white font-semibold flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-xl border border-amber-100 dark:border-amber-800/50">
                                    <Clock className="w-4 h-4 text-amber-500" />
                                    {deal.follow_up_date ? new Date(deal.follow_up_date).toLocaleDateString() : 'None set'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Dynamic Tabs */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit shadow-inner">
                        {[
                            { id: 'timeline', label: 'Timeline', icon: History },
                            { id: 'tasks', label: 'Tasks', icon: CheckCircle2 },
                            { id: 'notes', label: 'Notes', icon: FileText },
                            { id: 'files', label: 'Files', icon: Paperclip },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="min-h-[400px]">
                        {activeTab === 'timeline' && (
                            <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-4 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800 pl-10">
                                {logs.length > 0 ? logs.map((log) => (
                                    <div key={log.id} className="relative group">
                                        <span className="absolute -left-[30px] top-1 h-5 w-5 rounded-full bg-white dark:bg-slate-950 border-4 border-indigo-500 shadow-sm z-10" />
                                        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm group-hover:shadow-md transition-all">
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{log.description}</p>
                                            <span className="text-[10px] text-slate-400 block mt-2 font-bold uppercase tracking-wider">
                                                {new Date(log.created_at).toLocaleString()} • {log.type?.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-10 text-slate-400 font-medium italic">No activity recorded yet</div>
                                )}
                            </div>
                        )}

                        {activeTab === 'notes' && (
                            <div className="space-y-6">
                                <div className="relative group">
                                    <textarea
                                        value={newNote}
                                        onChange={(e) => setNewNote(e.target.value)}
                                        className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 resize-none min-h-[120px] dark:text-white shadow-inner transition-all"
                                        placeholder="Add a private note..."
                                    />
                                    <button
                                        onClick={addNote}
                                        className="absolute bottom-4 right-4 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl shadow-lg shadow-indigo-500/20 active:scale-90 transition-all"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {notes.map(note => (
                                        <div key={note.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                                            <p className="text-sm text-slate-700 dark:text-slate-300 italic">"{note.content}"</p>
                                            <span className="text-[10px] text-slate-400 block mt-2 font-bold uppercase tracking-widest">
                                                Added on {new Date(note.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'tasks' && (
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <input
                                        value={newTask}
                                        onChange={(e) => setNewTask(e.target.value)}
                                        className="flex-1 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white shadow-inner"
                                        placeholder="Add a follow up task..."
                                    />
                                    <button className="bg-indigo-600 p-3 rounded-xl text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 active:scale-95 transition-all"><Plus className="w-5 h-5" /></button>
                                </div>
                                <div className="space-y-2">
                                    {tasks.map(task => (
                                        <div key={task.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 group hover:shadow-md transition-all">
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={task.status === 'completed'}
                                                    onChange={() => toggleTask(task.id, task.status)}
                                                    className="w-5 h-5 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                                />
                                                <span className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-700 dark:text-white'}`}>
                                                    {task.title}
                                                </span>
                                            </div>
                                            <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'files' && (
                            <div className="space-y-6">
                                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group shadow-inner">
                                    <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-colors">
                                        <Paperclip className="w-6 h-6 text-slate-400 group-hover:text-indigo-500 transition-all" />
                                    </div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">Upload Files</h3>
                                    <p className="text-slate-500 text-sm mt-1">Drag and drop or click to attach evidence, contracts, or discovery docs.</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {attachments.map(file => (
                                        <div key={file.id} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all">
                                            <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                                                <FileText className="w-5 h-5 text-indigo-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold truncate dark:text-white">{file.file_name}</p>
                                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">{file.file_type}</p>
                                            </div>
                                            <button className="p-2 text-slate-400 hover:text-indigo-600"><Plus className="w-4 h-4 rotate-45" /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
