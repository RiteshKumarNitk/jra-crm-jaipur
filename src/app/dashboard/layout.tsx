'use client';

import {
    Users,
    Briefcase,
    Calendar,
    CheckSquare,
    Settings,
    LogOut,
    Scale,
    Menu,
    X,
    Bell,
    Search,
    LayoutDashboard,
    Gavel,
    FileText
} from 'lucide-react';
import { useState } from 'react';
import { useSupabaseUser } from '@/hooks/useSupabaseUser';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { user } = useSupabaseUser();
    const supabase = createClient();
    const pathname = usePathname();

    const navigation = [
        { name: 'Practice Overview', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Legal Pipeline', href: '/dashboard/deals', icon: Briefcase },
        { name: 'All Matters', href: '/dashboard/cases', icon: Gavel },
        { name: 'Client Registry', href: '/dashboard/clients', icon: Users },
        { name: 'Firm Directory', href: '/dashboard/companies', icon: Scale },
        { name: 'Docket/Calendar', href: '/dashboard/appointments', icon: Calendar },
        { name: 'Protocol Tasks', href: '/dashboard/tasks', icon: CheckSquare },
        { name: 'Practice Settings', href: '/dashboard/settings', icon: Settings },
    ];

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = '/';
    };

    const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Legal Adviser';
    const userInitial = userName[0].toUpperCase();

    return (
        <div className="flex h-screen bg-[#fcfcfc] text-slate-800 overflow-hidden font-sans">
            {/* Sidebar */}
            <AnimatePresence mode="wait">
                {isSidebarOpen && (
                    <motion.aside
                        initial={{ x: -280, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -280, opacity: 0 }}
                        className="fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 lg:static shadow-xl shadow-slate-200/20"
                    >
                        <div className="flex h-full flex-col">
                            <div className="flex h-24 items-center px-8 border-b border-slate-50">
                                <Link href="/" className="flex items-center gap-3 group">
                                    <div className="bg-[#c9b38c] p-2 rounded-sm shadow-lg group-hover:scale-110 transition-transform">
                                        <Scale className="h-6 w-6 text-white" />
                                    </div>
                                    <span className="text-xl font-bold tracking-[0.1em] text-slate-900 uppercase">JRA Legal</span>
                                </Link>
                                <button
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="ml-auto p-2 text-slate-300 hover:text-slate-600 lg:hidden"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="px-6 py-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 px-2">Main Registry</p>
                                <nav className="space-y-1.5 overflow-y-auto">
                                    {navigation.map((item) => {
                                        const isActive = pathname === item.href;
                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className={cn(
                                                    'group flex items-center px-4 py-3.5 text-[11px] font-black uppercase tracking-widest rounded-none transition-all duration-300 border-l-2',
                                                    isActive
                                                        ? 'bg-slate-50 text-[#c9b38c] border-[#c9b38c] shadow-sm'
                                                        : 'text-slate-500 border-transparent hover:bg-slate-50/50 hover:text-slate-900'
                                                )}
                                            >
                                                <item.icon
                                                    className={cn(
                                                        'mr-4 h-5 w-5 transition-colors',
                                                        isActive ? 'text-[#c9b38c]' : 'text-slate-300 group-hover:text-slate-500'
                                                    )}
                                                />
                                                {item.name}
                                            </Link>
                                        );
                                    })}
                                </nav>
                            </div>

                            <div className="mt-auto p-6 border-t border-slate-50">
                                <div className="bg-slate-50 p-4 rounded-sm flex items-center gap-3 mb-4">
                                    <div className="h-10 w-10 rounded-full bg-[#c9b38c] flex items-center justify-center text-white text-xs font-black shadow-lg shadow-[#c9b38c]/20">
                                        {userInitial}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 truncate">{userName}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Senior Counsel</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleSignOut}
                                    className="flex w-full items-center justify-center gap-2 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-colors border border-red-100"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Terminate Session
                                </button>
                            </div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
                <header className="h-24 flex items-center justify-between px-10 bg-white/80 backdrop-blur-md border-b border-slate-50 z-10">
                    <div className="flex items-center gap-8">
                        {!isSidebarOpen && (
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="p-3 text-slate-500 hover:text-slate-900 rounded-sm bg-slate-50 border border-slate-100 transition-all"
                            >
                                <Menu className="h-5 w-5" />
                            </button>
                        )}
                        <div className="hidden md:flex relative w-80">
                            <span className="absolute inset-y-0 left-4 flex items-center">
                                <Search className="h-4 w-4 text-slate-300" />
                            </span>
                            <input
                                type="text"
                                className="block w-full rounded-none border-none bg-slate-50 pl-12 pr-4 py-3 text-[11px] font-bold uppercase tracking-widest placeholder-slate-300 focus:ring-1 focus:ring-[#c9b38c] shadow-inner transition-all"
                                placeholder="Universal Search..."
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden lg:flex items-center gap-4 px-4 py-2 bg-[#c9b38c]/10 rounded-sm border border-[#c9b38c]/20">
                            <div className="h-2 w-2 rounded-full bg-[#c9b38c] animate-pulse"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#c9b38c]">Security Level: High</span>
                        </div>

                        <button className="p-3 text-slate-400 hover:text-[#c9b38c] transition-colors relative bg-slate-50 rounded-sm border border-slate-100 shadow-sm">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
                        </button>

                        <div className="h-10 w-[1px] bg-slate-100 mx-2"></div>

                        <button className="flex items-center gap-3 p-1.5 hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">{userName}</p>
                                <p className="text-[9px] font-bold text-slate-400 text-right">Online</p>
                            </div>
                            <div className="h-10 w-10 rounded-none bg-slate-900 flex items-center justify-center text-white text-[12px] font-black shadow-lg">
                                {userInitial}
                            </div>
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto bg-[#fafafa]">
                    <div className="max-w-7xl mx-auto p-10 lg:p-12 min-h-full">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {children}
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    );
}
