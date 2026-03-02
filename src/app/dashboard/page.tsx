'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Briefcase,
    Clock,
    PlusCircle,
    FileText,
    MessageSquare,
    Scale,
    CheckSquare,
    Gavel,
    ShieldCheck,
    Loader2,
    Layers
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { insforge } from '@/utils/insforge';
import { isLoggedIn } from '@/utils/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
    const { user, loading: authLoading } = useAuth();
    const [stats, setStats] = useState<any[]>([]);
    const [recentInquiries, setRecentInquiries] = useState<any[]>([]);
    const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !isLoggedIn()) {
            router.push('/login');
        }
    }, [authLoading, router]);

    const fullName = user?.profile?.name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Counsel';
    const userName = fullName.split(' ')[0];

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!isLoggedIn()) return;
            setIsLoading(true);
            try {
                // Fetch stats and recent data using insforge
                // Note: The .from() syntax in insforge/sdk usually expects a resource name
                const { count: careerCount } = await insforge.database
                    .from('job_postings')
                    .select('*', { count: 'exact', head: true })
                    .eq('is_active', true);

                const { count: inquiryCount } = await insforge.database
                    .from('contact_inquiries')
                    .select('*', { count: 'exact', head: true });

                const { count: blogCount } = await insforge.database
                    .from('blogs')
                    .select('*', { count: 'exact', head: true });

                const { count: galleryCount } = await insforge.database
                    .from('gallery_items')
                    .select('*', { count: 'exact', head: true });

                setStats([
                    { label: 'Active Opportunities', value: careerCount || 0, icon: Briefcase, color: 'text-[#c9b38c]', bg: 'bg-[#c9b38c]/10', trend: 'Recruitment' },
                    { label: 'Client Inquiries', value: inquiryCount || 0, icon: MessageSquare, color: 'text-slate-600', bg: 'bg-slate-100', trend: 'Reach-outs' },
                    { label: 'Strategic Briefings', value: blogCount || 0, icon: FileText, color: 'text-slate-600', bg: 'bg-slate-100', trend: 'Authority' },
                    { label: 'Firm Assets', value: galleryCount || 0, icon: Layers, color: 'text-emerald-500', bg: 'bg-emerald-50', trend: 'Gallery' },
                ]);

                const { data: inquiries } = await insforge.database
                    .from('contact_inquiries')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(5);
                if (inquiries) setRecentInquiries(inquiries);

                const { data: appointments } = await insforge.database
                    .from('appointments')
                    .select('*')
                    .gte('start_time', new Date().toISOString())
                    .order('start_time', { ascending: true })
                    .limit(3);
                if (appointments) setUpcomingAppointments(appointments);

            } catch (err) {
                console.error("Dashboard error:", err);
            }
            setIsLoading(false);
        };

        if (!authLoading && isLoggedIn()) {
            fetchDashboardData();
        }
    }, [authLoading]);

    if (authLoading || isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-40">
                <Loader2 className="h-10 w-10 text-[#c9b38c] animate-spin mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">Strategic Briefing... Loading Overview</p>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <span className="text-[#c9b38c] text-[10px] font-black uppercase tracking-[0.4em] mb-2 block">Executive Overview</span>
                    <h1 className="text-4xl font-serif text-slate-900 leading-tight">Welcome back, {userName}</h1>
                    <p className="text-slate-500 font-light mt-1">Reviewing the practice docket for {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}.</p>
                </div>
                <div className="flex gap-4">
                    <Link href="/dashboard/content" className="flex items-center gap-3 px-6 py-4 bg-white border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                        <Scale className="h-4 w-4" />
                        Manage Content
                    </Link>
                    <Link href="/dashboard/content" className="flex items-center gap-3 px-8 py-4 bg-[#c9b38c] text-[10px] font-black uppercase tracking-widest text-white hover:bg-[#b99c69] transition-all shadow-lg shadow-[#c9b38c]/20">
                        <PlusCircle className="h-4 w-4" />
                        New Intelligence
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all group"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className={`p-3 rounded-none ${stat.bg} ${stat.color} transition-colors group-hover:bg-[#c9b38c] group-hover:text-white`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                                {stat.trend}
                            </span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-serif text-slate-900">{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
                {/* Recent Matters (Inquiries) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-6 bg-[#c9b38c]"></div>
                            <h2 className="text-xl font-serif text-slate-900 leading-none">Incoming Strategic Inquiries</h2>
                        </div>
                        <Link href="/dashboard/content" className="text-[10px] font-black text-[#c9b38c] uppercase tracking-[0.2em] hover:underline">Full Log &rarr;</Link>
                    </div>
                    <div className="bg-white border border-slate-100 overflow-hidden shadow-sm">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-[#fafafa]">
                                <tr>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Client Name</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Status</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Initiated</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {recentInquiries.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-900 group-hover:text-[#c9b38c] transition-colors">{item.name}</span>
                                                <span className="text-[10px] text-slate-400 italic">{item.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <span className="px-3 py-1 bg-slate-50 border border-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-500 rounded-none">
                                                {item.status || 'New'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap text-sm text-slate-500 font-light font-serif italic text-[12px]">{new Date(item.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                                {recentInquiries.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-8 py-20 text-center text-slate-400 italic font-serif opacity-50">No inquiries recorded in the registry.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Upcoming Schedule / Practice Status */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-6 bg-[#c9b38c]"></div>
                            <h2 className="text-xl font-serif text-slate-900 leading-none">Approaching</h2>
                        </div>
                        <Link href="/dashboard/appointments" className="text-[10px] font-black text-[#c9b38c] uppercase tracking-[0.2em] hover:underline">Registry</Link>
                    </div>
                    <div className="space-y-4">
                        {upcomingAppointments.length > 0 ? upcomingAppointments.map((appt, i) => (
                            <div key={i} className="flex gap-6 p-6 bg-white border border-slate-100 hover:border-[#c9b38c]/30 hover:shadow-lg transition-all group">
                                <div className="flex-shrink-0 w-20 text-center border-r border-slate-50 pr-6">
                                    <p className="text-[11px] font-black text-[#c9b38c] uppercase tracking-tighter mb-1">{new Date(appt.start_time).getHours() >= 12 ? 'PM' : 'AM'}</p>
                                    <p className="text-lg font-serif italic text-slate-900">{new Date(appt.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</p>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-[#c9b38c] transition-colors">{appt.title}</h4>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status: {appt.status}</p>
                                </div>
                                <div className="flex-shrink-0">
                                    <div className="p-2 bg-slate-50 group-hover:bg-[#c9b38c]/10 group-hover:text-[#c9b38c] transition-colors">
                                        <Clock className="h-4 w-4" />
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="flex gap-6 p-6 bg-white border border-slate-100 hover:border-[#c9b38c]/30 hover:shadow-lg transition-all group">
                                <div className="flex-shrink-0 w-20 text-center border-r border-slate-50 pr-6">
                                    <p className="text-[11px] font-black text-[#c9b38c] uppercase tracking-tighter mb-1">AM</p>
                                    <p className="text-lg font-serif italic text-slate-900">09:00</p>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-[#c9b38c] transition-colors">Daily Docket Review</h4>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Subject: Internal</p>
                                </div>
                                <div className="flex-shrink-0">
                                    <div className="p-2 bg-slate-50 group-hover:bg-[#c9b38c]/10 group-hover:text-[#c9b38c] transition-colors">
                                        <Clock className="h-4 w-4" />
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* More schedule items can be added here once a calendar system is implemented */}
                    </div>

                    <div className="bg-[#262B3E] p-8 text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-slate-900 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                        <ShieldCheck className="h-10 w-10 text-[#c9b38c] mx-auto mb-4" />
                        <h4 className="text-white text-[12px] font-black uppercase tracking-[0.2em] mb-2">Practice Secure</h4>
                        <p className="text-slate-400 text-[10px] leading-relaxed">All sessions are encrypted with military-grade protocol. Your data remains your exclusive property.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
