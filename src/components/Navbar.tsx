'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
    const { user } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { name: 'Home', href: '/' },
        { name: 'About Us', href: '/about' },
        { name: 'Team', href: '/team' },
        { name: 'Blogs', href: '/blogs' },
        { name: 'Career', href: '/career' },
        { name: 'Gallery', href: '/media' },
    ];

    return (
        <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 px-6 ${isScrolled ? 'py-3 bg-[#1C202E]/80 backdrop-blur-md shadow-lg border-b border-white/5' : 'py-6 bg-transparent'}`}>
            <nav className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="h-10 w-10 relative">
                        <div className="absolute inset-0 bg-[#c9b38c] rounded-lg rotate-45 transform origin-center"></div>
                        <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl uppercase tracking-tighter">JRA</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white font-bold text-xl tracking-wide leading-none">JRA</span>
                        <span className="text-[#c9b38c] text-[10px] font-black uppercase tracking-[0.2em]">Legal Solution</span>
                    </div>
                </Link>

                <div className="hidden lg:flex items-center gap-10">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-white text-[11px] font-bold uppercase tracking-widest hover:text-[#c9b38c] transition-colors flex items-center gap-1"
                        >
                            {item.name}
                            {item.name !== 'Home' && <ChevronLeft className="w-2 h-2 -rotate-90 opacity-50" />}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-6">
                    <Link
                        href="/contact"
                        className="bg-[#c9b38c] hover:bg-[#b99c69] text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest transition-all shadow-xl shadow-black/10"
                    >
                        Contact
                    </Link>
                    {user && (
                        <Link
                            href="/dashboard"
                            className="hidden md:block border border-white/20 text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
                        >
                            Dashboard
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    );
}
