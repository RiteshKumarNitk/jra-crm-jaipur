'use client';

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
    TrendingUp,
    ShieldCheck
} from 'lucide-react';
import { useSupabaseUser } from '@/hooks/useSupabaseUser';
import Link from 'next/link';

export default function DashboardPage() {
    const { user } = useSupabaseUser();
    const userName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Counsel';

    const stats = [
        { label: 'Active Matters', value: '12', icon: Gavel, color: 'text-[#c9b38c]', bg: 'bg-[#c9b38c]/10', trend: '+2 this week' },
        { label: 'Key Contacts', value: '48', icon: Users, color: 'text-slate-600', bg: 'bg-slate-100', trend: '+12% growth' },
        { label: 'Projected Value', value: '$84.2k', icon: Scale, color: 'text-slate-600', bg: 'bg-slate-100', trend: '$12k pending' },
        { label: 'Urgent Tasks', value: '7', icon: CheckSquare, color: 'text-rose-500', bg: 'bg-rose-50', trend: '3 due today' },
    ];

    const recentCases = [
        { id: 1, title: 'Johnson vs. Smith Real Estate', client: 'Alice Johnson', status: 'In Trial', openDate: '2024-01-15' },
        { id: 2, title: 'Corporate Merger - TechFlow Inc.', client: 'TechFlow Inc.', status: 'Discovery', openDate: '2024-02-02' },
        { id: 3, title: 'Estate Planning - Miller Family', client: 'Robert Miller', status: 'Drafting', openDate: '2024-02-10' },
        { id: 4, title: 'Patent Infringement - CyberGrd', client: 'CyberGrd Solutions', status: 'Filing', openDate: '2024-02-12' },
    ];

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
                    <button className="flex items-center gap-3 px-6 py-4 bg-white border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                        <FileText className="h-4 w-4" />
                        Generate Report
                    </button>
                    <button className="flex items-center gap-3 px-8 py-4 bg-[#c9b38c] text-[10px] font-black uppercase tracking-widest text-white hover:bg-[#b99c69] transition-all shadow-lg shadow-[#c9b38c]/20">
                        <PlusCircle className="h-4 w-4" />
                        Initialize Matter
                    </button>
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
                {/* Recent Matters */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-6 bg-[#c9b38c]"></div>
                            <h2 className="text-xl font-serif text-slate-900 leading-none">Active Matters Registry</h2>
                        </div>
                        <Link href="/dashboard/cases" className="text-[10px] font-black text-[#c9b38c] uppercase tracking-[0.2em] hover:underline">Full Docket &rarr;</Link>
                    </div>
                    <div className="bg-white border border-slate-100 overflow-hidden shadow-sm">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-[#fafafa]">
                                <tr>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Matter Title</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Client</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Status</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Initiated</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {recentCases.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <span className="text-sm font-bold text-slate-900 group-hover:text-[#c9b38c] transition-colors">{item.title}</span>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <span className="text-sm text-slate-600 font-medium">{item.client}</span>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <span className="px-3 py-1 bg-slate-50 border border-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-500 rounded-none">
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap text-sm text-slate-500 font-light font-serif italic text-[12px]">{item.openDate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Upcoming Schedule */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-6 bg-[#c9b38c]"></div>
                            <h2 className="text-xl font-serif text-slate-900 leading-none">Approaching</h2>
                        </div>
                        <button className="text-[10px] font-black text-[#c9b38c] uppercase tracking-[0.2em] hover:underline">Calendar</button>
                    </div>
                    <div className="space-y-4">
                        {[
                            { time: '10:00 AM', title: 'Deposition Preparation', client: 'Alice Johnson', type: 'Meeting' },
                            { time: '02:30 PM', title: 'Court Hearing - Room 402', client: 'Smith Group', type: 'Court' },
                            { time: '04:00 PM', title: 'Contract Review', client: 'TechFlow', type: 'Review' },
                        ].map((apt, i) => (
                            <div key={i} className="flex gap-6 p-6 bg-white border border-slate-100 hover:border-[#c9b38c]/30 hover:shadow-lg transition-all group">
                                <div className="flex-shrink-0 w-20 text-center border-r border-slate-50 pr-6">
                                    <p className="text-[11px] font-black text-[#c9b38c] uppercase tracking-tighter mb-1">{apt.time.split(' ')[1]}</p>
                                    <p className="text-lg font-serif italic text-slate-900">{apt.time.split(' ')[0]}</p>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-[#c9b38c] transition-colors">{apt.title}</h4>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Subject: {apt.client}</p>
                                </div>
                                <div className="flex-shrink-0">
                                    <div className="p-2 bg-slate-50 group-hover:bg-[#c9b38c]/10 group-hover:text-[#c9b38c] transition-colors">
                                        <Clock className="h-4 w-4" />
                                    </div>
                                </div>
                            </div>
                        ))}
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
