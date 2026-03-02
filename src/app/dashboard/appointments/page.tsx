'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar as CalendarIcon,
    Clock,
    User,
    MapPin,
    Plus,
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    CheckCircle2,
    XCircle,
    Loader2,
    Gavel
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useSupabaseUser } from '@/hooks/useSupabaseUser';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

interface Appointment {
    id: string;
    title: string;
    description: string | null;
    start_time: string;
    end_time: string;
    location: string | null;
    status: string;
    client_id: string | null;
    case_id: string | null;
    clients?: { full_name: string };
    cases?: { title: string };
}

export default function AppointmentsPage() {
    const { user } = useSupabaseUser();
    const supabase = createClient();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());

    // Form state
    const [newAppointment, setNewAppointment] = useState({
        title: '',
        description: '',
        start_time: '',
        end_time: '',
        location: '',
        client_id: '',
        case_id: ''
    });

    const [clients, setClients] = useState<any[]>([]);
    const [cases, setCases] = useState<any[]>([]);

    const fetchData = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('appointments')
                .select('*, clients:clients(full_name), cases:cases(title)')
                .eq('lawyer_id', user.id)
                .order('start_time', { ascending: true });

            if (data) setAppointments(data);

            const { data: clientsData } = await supabase.from('clients').select('id, full_name');
            const { data: casesData } = await supabase.from('cases').select('id, title');

            if (clientsData) setClients(clientsData);
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

    const handleAddAppointment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        const { error } = await supabase
            .from('appointments')
            .insert([{
                ...newAppointment,
                lawyer_id: user.id,
                status: 'scheduled'
            }]);

        if (!error) {
            setIsAddModalOpen(false);
            setNewAppointment({ title: '', description: '', start_time: '', end_time: '', location: '', client_id: '', case_id: '' });
            fetchData();
        }
    };

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <span className="text-[#c9b38c] text-[10px] font-black uppercase tracking-[0.4em] mb-2 block">Docket Registry</span>
                    <h1 className="text-4xl font-serif text-slate-900 leading-tight flex items-center gap-3">
                        <CalendarIcon className="h-8 w-8 text-[#c9b38c]" />
                        Strategic Schedule
                    </h1>
                    <p className="text-slate-500 font-light mt-1 italic">Managing legal appearances, client consultations, and firm sessions.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center justify-center gap-3 bg-[#c9b38c] hover:bg-[#b99c69] text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-[#c9b38c]/20"
                >
                    <Plus className="h-4 w-4" />
                    New Appointment
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Calendar View (Mini) */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white border border-slate-100 p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">{format(currentDate, 'MMMM yyyy')}</h3>
                            <div className="flex gap-2">
                                <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 hover:bg-slate-50 border border-slate-100"><ChevronLeft className="h-4 w-4 text-slate-400" /></button>
                                <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 hover:bg-slate-50 border border-slate-100"><ChevronRight className="h-4 w-4 text-slate-400" /></button>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-2 text-center mb-4">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                                <span key={d} className="text-[10px] font-black text-slate-300">{d}</span>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                            {calendarDays.map((day, i) => {
                                const dayAppointments = appointments.filter(a => isSameDay(new Date(a.start_time), day));
                                return (
                                    <div
                                        key={i}
                                        className={`aspect-square flex flex-col items-center justify-center text-[11px] font-bold border ${isSameDay(day, new Date()) ? 'border-[#c9b38c] text-[#c9b38c]' : 'border-transparent text-slate-600'} hover:bg-slate-50 cursor-pointer relative transition-all rounded-sm`}
                                    >
                                        {format(day, 'd')}
                                        {dayAppointments.length > 0 && <span className="absolute bottom-1 h-1 w-1 bg-[#c9b38c] rounded-full"></span>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-[#1C202E] p-8 text-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#c9b38c] mb-4">Daily Briefing</h4>
                            <p className="text-xl font-serif italic mb-6">"Punctuality is the soul of strategic diplomacy."</p>
                            <div className="w-12 h-[1px] bg-[#c9b38c]"></div>
                        </div>
                        <Gavel className="absolute -bottom-4 -right-4 h-24 w-24 text-white/5 rotate-12" />
                    </div>
                </div>

                {/* Agenda List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-6 bg-[#c9b38c]"></div>
                            <h2 className="text-xl font-serif text-slate-900 leading-none">Upcoming Agenda</h2>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300" />
                                <input className="bg-white border border-slate-100 pl-10 pr-4 py-2 text-[10px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-[#c9b38c] outline-none" placeholder="Search Agenda..." />
                            </div>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-32 bg-white border border-slate-100">
                            <Loader2 className="h-8 w-8 text-[#c9b38c] animate-spin mb-4" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Docket...</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {appointments.length > 0 ? appointments.map((appt) => (
                                <div key={appt.id} className="bg-white border border-slate-100 p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#c9b38c]/30 hover:shadow-xl transition-all group">
                                    <div className="flex gap-8">
                                        <div className="flex flex-col items-center justify-center border-r border-slate-50 pr-8 min-w-[100px]">
                                            <span className="text-[10px] font-black text-[#c9b38c] uppercase tracking-tighter mb-1">{format(new Date(appt.start_time), 'MMM')}</span>
                                            <span className="text-3xl font-serif italic text-slate-900">{format(new Date(appt.start_time), 'dd')}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-lg font-bold text-slate-900 group-hover:text-[#c9b38c] transition-colors">{appt.title}</h4>
                                            <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {format(new Date(appt.start_time), 'HH:mm')} - {format(new Date(appt.end_time), 'HH:mm')}</span>
                                                {appt.location && <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {appt.location}</span>}
                                                {appt.clients && <span className="flex items-center gap-1.5 text-[#c9b38c]"><User className="h-3 w-3" /> {appt.clients.full_name}</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-none border ${appt.status === 'scheduled' ? 'bg-slate-50 text-slate-400 border-slate-100' :
                                                appt.status === 'completed' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' :
                                                    'bg-rose-50 text-rose-500 border-rose-100'
                                            }`}>
                                            {appt.status}
                                        </span>
                                        <button className="p-2 text-slate-200 hover:text-slate-900 transition-colors"><MoreVertical className="h-5 w-5" /></button>
                                    </div>
                                </div>
                            )) : (
                                <div className="bg-white border border-slate-100 p-20 text-center">
                                    <CalendarIcon className="h-12 w-12 text-slate-50 mx-auto mb-4" />
                                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-300">Registry is currently unoccupied.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-10 max-w-2xl w-full shadow-2xl border border-slate-100 relative">
                            <button onClick={() => setIsAddModalOpen(false)} className="absolute top-6 right-6 p-2 text-slate-300 hover:text-rose-500"><XCircle className="h-6 w-6" /></button>
                            <h2 className="text-2xl font-serif italic text-slate-900 mb-10 border-b border-slate-50 pb-6">Initialize Appointment Profile</h2>
                            <form onSubmit={handleAddAppointment} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="md:col-span-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Agenda Title</label>
                                        <input required className="w-full bg-slate-50 border-none p-4 text-[12px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-[#c9b38c]" value={newAppointment.title} onChange={e => setNewAppointment({ ...newAppointment, title: e.target.value })} placeholder="Session Title..." />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Inception (Start)</label>
                                        <input type="datetime-local" required className="w-full bg-slate-50 border-none p-4 text-[12px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-[#c9b38c]" value={newAppointment.start_time} onChange={e => setNewAppointment({ ...newAppointment, start_time: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Termination (End)</label>
                                        <input type="datetime-local" required className="w-full bg-slate-50 border-none p-4 text-[12px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-[#c9b38c]" value={newAppointment.end_time} onChange={e => setNewAppointment({ ...newAppointment, end_time: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Deployment Location</label>
                                        <input className="w-full bg-slate-50 border-none p-4 text-[12px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-[#c9b38c]" value={newAppointment.location} onChange={e => setNewAppointment({ ...newAppointment, location: e.target.value })} placeholder="Room 402 / Virtual..." />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Principal Subject</label>
                                        <select className="w-full bg-slate-50 border-none p-4 text-[12px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-[#c9b38c]" value={newAppointment.client_id} onChange={e => setNewAppointment({ ...newAppointment, client_id: e.target.value })}>
                                            <option value="">Public / Individual</option>
                                            {clients.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex gap-6 pt-6">
                                    <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-5 text-[10px] font-black uppercase bg-slate-50 tracking-widest text-slate-400">Cancel Protocol</button>
                                    <button type="submit" className="flex-1 py-5 text-[10px] font-black uppercase bg-[#c9b38c] tracking-widest text-white shadow-xl shadow-[#c9b38c]/20">Commit to Docket</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
