'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { BookOpen } from 'lucide-react';
import { insforge } from '@/utils/insforge';

const GALLERY_FALLBACK = [
    "https://images.unsplash.com/photo-1505664194779-8beaceb93744",
    "https://images.unsplash.com/photo-1553484771-047a44f997a9",
    "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4"
];

const Gallery = () => {
    const [images, setImages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const { data } = await insforge.database
                    .from('gallery_items')
                    .select('*')
                    .order('order_index', { ascending: true });
                if (data && data.length > 0) {
                    setImages(data.map((item: any) => item.image_url));
                } else {
                    setImages(GALLERY_FALLBACK);
                }
            } catch (err) {
                setImages(GALLERY_FALLBACK);
            } finally {
                setIsLoading(false);
            }
        };
        fetchGallery();
    }, []);

    if (isLoading) return null;

    return (
        <section className="py-32 bg-[#fafafa] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 text-center mb-24 space-y-6">
                <div className="inline-flex h-16 w-16 rounded-full bg-white border border-slate-200 items-center justify-center mx-auto shadow-sm text-[#c9b38c]">
                    <BookOpen className="w-6 h-6" />
                </div>
                <div className="space-y-4">
                    <p className="text-[#c9b38c] text-[10px] font-bold uppercase tracking-[0.5em]">Work Experience</p>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">Insides & News</h2>
                    <p className="text-slate-400 font-light text-base max-w-xl mx-auto">
                        Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6 max-w-[1600px] mx-auto">
                {images.map((src, idx) => (
                    <div key={idx} className="relative aspect-[3/4] overflow-hidden group shadow-lg">
                        <Image
                            src={`${src}?auto=format&fit=crop&q=80&w=800`}
                            alt={`Gallery Image ${idx + 1}`}
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                            <div className="space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <span className="text-[#c9b38c] text-[10px] font-bold uppercase tracking-[0.2em]">View Detail</span>
                                <h4 className="text-white font-bold text-xl">Legal Excellence</h4>
                            </div>
                        </div>
                        <div className="absolute inset-0 ring-1 ring-inset ring-black/5" />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Gallery;
