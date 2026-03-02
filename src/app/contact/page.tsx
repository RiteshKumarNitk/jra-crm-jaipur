'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Scale } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { createClient } from '@/utils/supabase/client';

const DEFAULT_FIRM = {
    address: 'Jagdish Enclave, 105, Keshav Nagar, Civil Lines, Jaipur, Rajasthan',
    email: 'jainrathoreassociates@gmail.com',
    phone: '0141 405 3434',
    office_hours: 'Mon-Sun: 10am - 7pm'
};

export default function ContactPage() {
    const [firm, setFirm] = useState(DEFAULT_FIRM);
    const supabase = createClient();

    useEffect(() => {
        const fetchFirm = async () => {
            const { data } = await supabase
                .from('website_content')
                .select('content')
                .eq('section', 'firm_settings')
                .maybeSingle();

            if (data?.content) {
                setFirm(data.content);
            }
        };
        fetchFirm();
    }, [supabase]);

    return (
        <main className="min-h-screen bg-white font-sans overflow-x-hidden">
            <Navbar />

            {/* Hero Section */}
            <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000"
                    alt="Contact Us"
                    fill
                    className="object-cover brightness-50"
                    priority
                />
                <div className="relative z-10 text-center px-6 mt-20">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-9xl font-bold text-white mb-6 tracking-tighter font-serif italic"
                    >
                        Contact Us
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/70 text-lg max-w-2xl mx-auto font-light italic"
                    >
                        Procure strategic legal consultation at our operational headquarters.
                    </motion.p>
                </div>
            </section>

            {/* Contact Form & Info Section */}
            <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    {/* Contact Info */}
                    <div className="space-y-12">
                        <div className="space-y-8">
                            <div className="flex gap-6 items-start group">
                                <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-[#c9b38c] group-hover:bg-[#c9b38c] group-hover:text-white transition-all duration-300 shrink-0">
                                    <MapPin size={28} />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#c9b38c]">Operational Headquarters</h4>
                                    <p className="text-xl font-serif text-slate-800 italic leading-relaxed">
                                        {firm.address}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start group">
                                <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-[#c9b38c] group-hover:bg-[#c9b38c] group-hover:text-white transition-all duration-300 shrink-0">
                                    <Mail size={28} />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#c9b38c]">Encrypted Mail</h4>
                                    <p className="text-xl font-serif text-slate-800 italic leading-relaxed underline">
                                        {firm.email}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start group">
                                <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-[#c9b38c] group-hover:bg-[#c9b38c] group-hover:text-white transition-all duration-300 shrink-0">
                                    <Phone size={28} />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#c9b38c]">Secure Line</h4>
                                    <p className="text-xl font-serif text-slate-800 italic leading-relaxed">
                                        {firm.phone}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start group">
                                <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-[#c9b38c] group-hover:bg-[#c9b38c] group-hover:text-white transition-all duration-300 shrink-0">
                                    <Clock size={28} />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#c9b38c]">Courtroom Availability</h4>
                                    <p className="text-xl font-serif text-slate-800 italic leading-relaxed">
                                        {firm.office_hours}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-12 md:p-16 shadow-2xl border border-slate-50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-5 -rotate-12">
                            <Scale size={200} />
                        </div>
                        <div className="mb-12 relative z-10">
                            <span className="text-[#c9b38c] text-[10px] font-black uppercase tracking-[0.6em] mb-4 block">Communication Portal</span>
                            <h2 className="text-4xl md:text-5xl font-serif italic text-slate-900 tracking-tight leading-tight">
                                Procure Your First <br />Strategic Briefing
                            </h2>
                        </div>

                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const name = `${formData.get('fname')} ${formData.get('lname')}`;
                            const email = formData.get('email') as string;
                            const phone = formData.get('phone') as string;
                            const message = formData.get('message') as string;

                            try {
                                const { createClient } = await import('@/utils/supabase/client');
                                const supabase = createClient();
                                const { error } = await supabase.from('contact_inquiries').insert({
                                    name, email, phone, message
                                });
                                if (error) throw error;
                                alert('Inquiry Transmitted Successfully. We will contact you shortly.');
                                (e.target as HTMLFormElement).reset();
                            } catch (err) {
                                alert('Transmission Error. Please try again.');
                            }
                        }} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <input
                                    name="fname"
                                    type="text"
                                    required
                                    placeholder="First Name"
                                    className="w-full bg-slate-50 border border-slate-100 px-6 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#c9b38c] transition-all"
                                />
                                <input
                                    name="lname"
                                    type="text"
                                    required
                                    placeholder="Last Name"
                                    className="w-full bg-slate-50 border border-slate-100 px-6 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#c9b38c] transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="Email"
                                    className="w-full bg-slate-50 border border-slate-100 px-6 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#c9b38c] transition-all"
                                />
                                <input
                                    name="phone"
                                    type="text"
                                    placeholder="Contact Number"
                                    className="w-full bg-slate-50 border border-slate-100 px-6 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#c9b38c] transition-all"
                                />
                            </div>
                            <textarea
                                name="message"
                                required
                                placeholder="Message"
                                rows={5}
                                className="w-full bg-slate-50 border border-slate-100 px-6 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#c9b38c] transition-all"
                            ></textarea>
                            <button
                                type="submit"
                                className="bg-[#c9b38c] hover:bg-[#b99c69] text-white px-10 py-5 text-xs font-bold uppercase tracking-widest transition-all shadow-xl shadow-[#c9b38c]/20"
                            >
                                Submit It Now
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="h-[500px] relative">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3557.7397637841144!2d75.78712037522432!3d26.9117621766487!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db444f6f4c8e7%3A0xe5a3036329c5a610!2sJagdish%20Enclave!5e0!3m2!1sen!2sin!4v1709110000000!5m2!1sen!2sin"
                    className="absolute inset-0 w-full h-full border-0 grayscale invert"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </section>

            <Footer />
        </main>
    );
}
