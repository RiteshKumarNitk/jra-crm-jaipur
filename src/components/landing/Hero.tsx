'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { insforge } from '@/utils/insforge';

const STATIC_SLIDES = [
    {
        image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=2000",
        label: "Premium Legal Excellence",
        title: { main: "Our ", highlight: "Independence", sub: "Makes the Difference" },
    },
    {
        image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=2000",
        label: "Expert Representation",
        title: { main: "Defending ", highlight: "Your Rights", sub: "With Integrity" },
    },
    {
        image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&q=80&w=2000",
        label: "Strategic Solutions",
        title: { main: "Tailored ", highlight: "Legal Advice", sub: "For Your Success" },
    },
];

const Hero = () => {
    const [current, setCurrent] = useState(0);
    const [slides, setSlides] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHero = async () => {
            try {
                const { data } = await insforge.database
                    .from('website_content')
                    .select('content')
                    .eq('section', 'hero')
                    .maybeSingle();

                if (data?.content?.sliders) {
                    setSlides(data.content.sliders);
                } else {
                    setSlides(STATIC_SLIDES);
                }
            } catch (err) {
                setSlides(STATIC_SLIDES);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHero();
    }, []);

    useEffect(() => {
        if (slides.length === 0) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const nextSlide = () => setCurrent((prev) => (prev + 1) % (slides.length || 1));
    const prevSlide = () => setCurrent((prev) => (prev - 1 + (slides.length || 1)) % (slides.length || 1));

    if (isLoading || !slides || slides.length === 0) return (
        <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-[#1C202E]">
            <div className="flex flex-col items-center justify-center">
                <div className="h-10 w-10 border-4 border-[#c9b38c] border-t-transparent rounded-full animate-spin mb-4" />
                <span className="text-white/30 text-[10px] uppercase tracking-widest font-bold">Synchronizing...</span>
            </div>
        </section>
    );

    return (
        <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-[#1C202E]">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="absolute inset-0 z-0"
                >
                    <Image
                        src={slides[current]?.image || STATIC_SLIDES[0].image}
                        alt="Hero Background"
                        fill
                        className="object-cover brightness-[0.4] contrast-[1.1]"
                        priority
                        unoptimized={!(slides[current]?.image || STATIC_SLIDES[0].image).startsWith('http') || (slides[current]?.image || STATIC_SLIDES[0].image).includes('insforge')}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#1C202E]/60 via-transparent to-[#1C202E]/80" />
                </motion.div>
            </AnimatePresence>

            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-6 md:px-10 z-30 pointer-events-none">
                <button
                    onClick={prevSlide}
                    className="h-14 w-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-[#c9b38c] hover:border-[#c9b38c] transition-all duration-500 pointer-events-auto group backdrop-blur-sm"
                >
                    <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                </button>
                <button
                    onClick={nextSlide}
                    className="h-14 w-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-[#c9b38c] hover:border-[#c9b38c] transition-all duration-500 pointer-events-auto group backdrop-blur-sm"
                >
                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="mb-10">
                            <span className="inline-block px-5 py-2 bg-[#c9b38c]/10 border border-[#c9b38c]/20 text-[#c9b38c] text-[10px] font-bold uppercase tracking-[0.5em] rounded-full backdrop-blur-md">
                                {slides[current].label}
                            </span>
                        </div>

                        <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold text-white leading-[1.1] mb-12 tracking-tight">
                            {slides[current].title?.main || 'JRA '}
                            <span className="text-[#c9b38c]">{slides[current].title?.highlight || 'Legal'}</span> <br />
                            {slides[current].title?.sub || 'Excellence'}
                        </h1>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                            <Link
                                href="/contact"
                                className="group relative bg-[#c9b38c] text-white px-14 py-6 text-[11px] font-bold uppercase tracking-[0.3em] transition-all hover:bg-[#b99c69] shadow-2xl overflow-hidden"
                            >
                                <span className="relative z-10">Free Consultation</span>
                                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </Link>
                            <Link
                                href="/about"
                                className="group flex items-center gap-4 text-white uppercase text-[11px] font-bold tracking-[0.3em] transition-all"
                            >
                                <span className="text-white/70 group-hover:text-white transition-colors">Explore Services</span>
                                <div className="w-10 h-[1px] bg-white/30 group-hover:w-14 group-hover:bg-[#c9b38c] transition-all duration-500" />
                            </Link>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-8 z-20">
                {slides.map((_, i) => (
                    <div
                        key={i}
                        onClick={() => setCurrent(i)}
                        className="flex flex-col items-center gap-3 group cursor-pointer"
                    >
                        <span className={`text-[10px] font-bold transition-colors ${i === current ? 'text-[#c9b38c]' : 'text-white/20 group-hover:text-white/50'}`}>0{i + 1}</span>
                        <span className={`h-12 w-[2px] transition-all duration-500 ${i === current ? 'bg-[#c9b38c]' : 'bg-white/10 group-hover:bg-white/20'}`}></span>
                    </div>
                ))}
            </div>

            <div className="absolute left-10 bottom-24 z-20 hidden xl:block origin-bottom-left -rotate-90">
                <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.8em]">Jaipur • Rajasthan • Since 2023</span>
            </div>
        </section>
    );
};

export default Hero;
