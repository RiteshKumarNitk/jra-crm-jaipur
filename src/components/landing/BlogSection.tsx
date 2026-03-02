'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Lightbulb, ArrowRight } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

const DEFAULT_INSIGHTS = {
    title: "Check Our Latest Tips & News",
    description: "Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum."
};

const BlogSection = () => {
    const [header, setHeader] = useState<any>(null);
    const [blogs, setBlogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Header
                const { data: headerData } = await supabase
                    .from('website_content')
                    .select('content')
                    .eq('section', 'insights')
                    .maybeSingle();

                if (headerData?.content) {
                    setHeader(headerData.content);
                } else {
                    setHeader(DEFAULT_INSIGHTS);
                }

                // Fetch Latest 2 Blogs
                const { data: blogData } = await supabase
                    .from('blogs')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(2);

                if (blogData && blogData.length > 0) {
                    setBlogs(blogData);
                } else {
                    // Fallback blogs if none in DB
                    setBlogs([
                        {
                            title: "Provide insight into how canna businesspeople can use",
                            category: "Advocate, Law",
                            image_url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f",
                            slug: "insight-1"
                        },
                        {
                            title: "Canna Law Blog is a forum for discussing the practical",
                            category: "Lawyer, Law",
                            image_url: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da",
                            slug: "insight-2"
                        }
                    ]);
                }
            } catch (err) {
                setHeader(DEFAULT_INSIGHTS);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []); // Removed supabase from dependencies to prevent infinite loop

    if (isLoading) return null;

    return (
        <section className="py-32 px-6 bg-white">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-24 items-start">
                <div className="space-y-10">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-[#c9b38c]/10 flex items-center justify-center text-[#c9b38c]">
                            <Lightbulb className="w-6 h-6" />
                        </div>
                        <span className="text-[#c9b38c] text-[10px] font-bold uppercase tracking-[0.4em]">Latest Insights</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-[1.15] tracking-tight">
                        {header.title}
                    </h2>

                    <p className="text-slate-500 text-lg font-light leading-relaxed">
                        {header.description}
                    </p>

                    <div className="pt-6">
                        <Link
                            href="/blogs"
                            className="group relative inline-flex items-center gap-4 bg-[#c9b38c] text-white px-10 py-5 text-[11px] font-bold uppercase tracking-widest transition-all hover:bg-[#b99c69] overflow-hidden shadow-xl"
                        >
                            <span className="relative z-10">More Blog Posts</span>
                            <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-12">
                    {blogs.map((blog, idx) => (
                        <div key={idx} className="group space-y-8">
                            <div className="relative aspect-[16/11] overflow-hidden shadow-2xl rounded-sm">
                                <Image
                                    src={`${blog.image_url || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f'}?auto=format&fit=crop&q=80&w=800`}
                                    alt={blog.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute top-6 left-6">
                                    <span className="bg-white/90 backdrop-blur-md border border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-600 px-4 py-2 shadow-sm rounded-sm">
                                        {blog.category || 'Legal Insight'}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-[#c9b38c] transition-colors leading-tight tracking-tight">
                                    {blog.title}
                                </h3>

                                <Link
                                    href={`/blogs/${blog.slug}`}
                                    className="inline-flex items-center gap-3 text-slate-400 hover:text-[#c9b38c] transition-all group/link"
                                >
                                    <div className="w-10 h-[1px] bg-slate-200 group-hover/link:bg-[#c9b38c] group-hover/link:w-14 transition-all duration-500" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Read Article</span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BlogSection;
