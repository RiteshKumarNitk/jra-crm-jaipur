'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

const DEFAULT_ABOUT = {
    title: "We Are The Most Popular Firm With Various Services!",
    description: "Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero.",
    director: {
        name: "CA Mitesh Rathore",
        role: "Chairman of ICAI RERA Jaipur",
        bio: "JRALegalSolution.com helps Rajasthan RERA in achieving these objectives by bringing more and more awareness among public about it.",
        image: "https://images.unsplash.com/photo-1556155092-490a1ba16284?auto=format&fit=crop&q=80&w=800"
    }
};

const AboutSection = () => {
    const [content, setContent] = useState(DEFAULT_ABOUT);
    const supabase = createClient();

    useEffect(() => {
        const fetchContent = async () => {
            const { data } = await supabase
                .from('website_content')
                .select('content')
                .eq('section', 'about')
                .maybeSingle();

            if (data?.content) {
                setContent(data.content);
            }
        };
        fetchContent();
    }, [supabase]);

    return (
        <section id="about" className="py-32 px-6 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                <div className="space-y-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-[1px] bg-[#c9b38c]"></div>
                        <span className="text-[#c9b38c] text-[10px] font-bold uppercase tracking-[0.4em]">About Our Firm</span>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-bold text-slate-900 leading-[1.15] tracking-tight">
                        {content.title}
                    </h2>

                    <p className="text-slate-500 text-lg font-light leading-relaxed max-w-xl">
                        {content.description}
                    </p>

                    <div className="pt-6">
                        <Link href="/about" className="inline-flex items-center gap-4 group">
                            <div className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-[#c9b38c] group-hover:border-[#c9b38c] transition-all duration-500">
                                <div className="w-2 h-2 bg-slate-900 rounded-full group-hover:bg-white transition-colors" />
                            </div>
                            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-900">Explore Our Story</span>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start relative">
                    {/* Decorative element */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 border-8 border-slate-50 z-0 pointer-events-none" />

                    <div className="relative aspect-[3/4] overflow-hidden shadow-2xl z-10 group">
                        <Image
                            src={content.director.image || "https://images.unsplash.com/photo-1556155092-490a1ba16284?auto=format&fit=crop&q=80&w=800"}
                            alt="Managing Director"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 ring-1 ring-inset ring-black/10" />
                    </div>

                    <div className="space-y-8 pt-8 z-10">
                        <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{content.director.role || 'Managing Director'}</h3>
                        <p className="text-base text-slate-500 font-light leading-relaxed">
                            {content.director.bio}
                        </p>

                        <div className="pt-6 border-t border-slate-100">
                            <p className="font-bold text-slate-900 tracking-wide text-xl">{content.director.name}</p>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c9b38c] mt-1">Founding Authority</p>
                        </div>

                        <Link
                            href="/about"
                            className="inline-block bg-slate-900 text-white px-10 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-[#c9b38c] transition-all"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
