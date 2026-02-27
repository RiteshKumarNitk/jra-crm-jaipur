'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Home as HomeIcon,
  BookOpen,
  Users,
  Lightbulb,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Send,
  ArrowUp
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import DisclaimerModal from '@/components/DisclaimerModal';

export default function LandingPage() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase]);

  return (
    <main className="min-h-screen bg-white">
      <DisclaimerModal />

      {/* Header / Navbar */}
      <header className="absolute top-0 left-0 right-0 z-50 px-6 py-4">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 relative">
              <div className="absolute inset-0 bg-[#c9b38c] rounded-lg rotate-45 transform origin-center"></div>
              <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl uppercase tracking-tighter">JRA</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-serif font-bold text-xl tracking-wide leading-none">JRA</span>
              <span className="text-[#c9b38c] text-[10px] font-black uppercase tracking-[0.2em]">Legal Solution</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-10">
            {['Home', 'About Us', 'Expertise', 'Team', 'Career'].map((item) => (
              <Link key={item} href="#" className="text-white text-[12px] font-black uppercase tracking-widest hover:text-[#c9b38c] transition-colors flex items-center gap-1">
                {item}
                {item !== 'Home' && <ChevronLeft className="w-3 h-3 -rotate-90 opacity-50" />}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-6">
            {user ? (
              <Link href="/dashboard" className="bg-[#c9b38c] hover:bg-[#b99c69] text-white px-8 py-3 text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-black/10">
                Dashboard
              </Link>
            ) : (
              <Link href="/login" className="bg-[#c9b38c] hover:bg-[#b99c69] text-white px-8 py-3 text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-black/10">
                Contact
              </Link>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=2000"
          alt="Law Firm"
          fill
          className="object-cover brightness-[0.5]"
          priority
          onError={(e: any) => {
            e.currentTarget.src = 'https://placehold.co/1920x1080/1C202E/c9b38c?text=JRA+Legal+Solution';
          }}
        />

        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-10 z-20 hidden md:flex">
          <button className="h-12 w-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button className="h-12 w-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-20">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-8xl font-serif text-white leading-tight mb-10 italic"
          >
            Our Independence <br /> Makes the Difference
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Link href="#about" className="bg-[#c9b38c] hover:bg-[#b99c69] text-white px-12 py-5 text-[12px] font-black uppercase tracking-[0.3em] transition-all shadow-2xl">
              Free Consultation
            </Link>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-20">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-2 w-2 rounded-full ${i === 1 ? 'bg-[#c9b38c]' : 'bg-white/30'}`}></div>
          ))}
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-24 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-[#c9b38c]/10 flex items-center justify-center">
                <HomeIcon className="w-5 h-5 text-[#c9b38c]" />
              </div>
              <span className="text-[#c9b38c] text-[10px] font-black uppercase tracking-[0.4em]">About Us</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-serif text-slate-900 leading-[1.1] italic">
              We Are The Most Popular Firm With Various Services!
            </h2>

            <p className="text-slate-500 font-light leading-relaxed">
              Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero.
            </p>

            <div className="pt-4">
              <Link href="#" className="inline-flex items-center gap-2 group">
                <span className="w-10 h-[1px] bg-[#c9b38c] group-hover:w-16 transition-all"></span>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#c9b38c]">Learn More</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="relative aspect-[3/4] overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1556155092-490a1ba16284?auto=format&fit=crop&q=80&w=800"
                alt="Managing Director"
                fill
                className="object-cover"
                onError={(e: any) => {
                  e.currentTarget.src = 'https://placehold.co/800x1200/fafafa/c9b38c?text=Director';
                }}
              />
            </div>

            <div className="space-y-6 pt-4">
              <h3 className="text-2xl font-serif text-slate-800 italic">About our Managing Director</h3>
              <p className="text-sm text-slate-500 font-light leading-relaxed">
                JRALegalSolution.com helps Rajasthan RERA in achieving these objectives by bringing more and more awareness among public about it and solve their queries related to various provisions of the Act. The importance of RERA in Rajasthan can be judged by the fact that it is the fifth most populous state in India with increasing need for residential and commercial development.
              </p>

              <div className="pt-4 border-t border-slate-100">
                <p className="font-serif font-bold text-slate-900 tracking-wide">CA Mitesh Rathore</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#c9b38c]">- Chairman of ICAI RERA Jaipur</p>
              </div>

              <div className="pt-6">
                <button className="bg-slate-900 text-white px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-[#c9b38c] transition-all">
                  Read More...
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24 px-6 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto text-center mb-16 space-y-4">
          <div className="inline-flex h-12 w-12 rounded-full bg-white border border-slate-200 items-center justify-center mx-auto shadow-sm">
            <BookOpen className="w-5 h-5 text-[#c9b38c]" />
          </div>
          <p className="text-[#c9b38c] text-[10px] font-black uppercase tracking-[0.4em]">Here Our Best Work</p>
          <h2 className="text-4xl font-serif text-slate-900 italic">Insides & News</h2>
          <p className="text-slate-400 font-light text-sm max-w-lg mx-auto italic">
            Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 overflow-hidden">
          {[
            "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1553484771-047a44f997a9?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800"
          ].map((src, idx) => (
            <div key={idx} className="relative aspect-[3/4] overflow-hidden group">
              <Image
                src={src}
                alt={`Gallery ${idx + 1}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2"
                onError={(e: any) => {
                  e.currentTarget.src = `https://placehold.co/800x1200/ffffff/c9b38c?text=Matter+${idx + 1}`;
                }}
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-[#c9b38c]/10 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-[#c9b38c]" />
              </div>
              <span className="text-[#c9b38c] text-[10px] font-black uppercase tracking-[0.4em]">Latest Blog</span>
            </div>

            <h2 className="text-4xl font-serif text-slate-900 leading-[1.1] italic">
              Check Our Latest Tips & News
            </h2>

            <p className="text-slate-500 font-light leading-relaxed">
              Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit a, luctus sed, vulputate a, felis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
            </p>

            <div className="pt-6">
              <button className="bg-[#c9b38c] hover:bg-[#b99c69] text-white px-10 py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-xl shadow-[#c9b38c]/20">
                More Blog Post
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-10">
            {[
              {
                title: "Provide insight into how canna businesspeople can use",
                tag: "Advocate, Law",
                img: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800"
              },
              {
                title: "Canna Law Blog is a forum for discussing the practical",
                tag: "Lawyer, Law",
                img: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800"
              }
            ].map((blog, idx) => (
              <div key={idx} className="group space-y-6">
                <div className="relative aspect-[16/10] overflow-hidden shadow-lg">
                  <Image
                    src={blog.img}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e: any) => {
                      e.currentTarget.src = `https://placehold.co/800x500/1C202E/c9b38c?text=Blog+${idx + 1}`;
                    }}
                  />
                  <span className="absolute bottom-4 left-4 bg-white border border-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-600 px-3 py-1.5 shadow-sm">
                    {blog.tag}
                  </span>
                </div>
                <h3 className="text-lg font-serif italic text-slate-800 group-hover:text-[#c9b38c] transition-colors leading-relaxed">
                  {blog.title}
                </h3>
                <div className="flex items-center gap-3 group/link cursor-pointer">
                  <div className="w-8 h-[1px] bg-[#c9b38c] group-hover/link:w-12 transition-all"></div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover/link:text-[#c9b38c]">Read More</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1C202E] text-white pt-24 pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          {/* Top Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pb-16 border-b border-white/5">
            <div className="flex items-center gap-6">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <button key={i} className="h-10 w-10 rounded-full bg-[#1C202E] border border-white/10 flex items-center justify-center hover:bg-[#c9b38c] transition-all">
                  <Icon size={16} />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="h-12 w-12 relative flex items-center justify-center text-white font-bold text-2xl uppercase tracking-tighter border border-white/20 rotate-45">
                <span className="-rotate-45">JRA</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-serif font-bold text-2xl tracking-wide leading-none">JRA</span>
                <span className="text-[#c9b38c] text-[11px] font-black uppercase tracking-[0.2em]">Legal Solution</span>
              </div>
            </div>

            <div className="relative w-full max-w-sm">
              <input
                type="email"
                placeholder="Email Address..."
                className="w-full bg-white/5 border border-white/10 px-6 py-4 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#c9b38c] pr-16"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-[#c9b38c] flex items-center justify-center hover:bg-[#b99c69] transition-all">
                <Send size={16} className="text-white" />
              </button>
            </div>
          </div>

          {/* Middle Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 py-16">
            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/50">About Us</h4>
              <p className="text-sm text-white/40 leading-relaxed font-light italic">
                JRA is trying to help the public at large in Rajasthan to understand, evaluate and execute the provisions of Rajasthan - RERA in efficient manner.
              </p>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/50">Our Address</h4>
              <div className="space-y-4 text-sm text-white/40 font-light">
                <p>Jagdish Enclave, 105, Keshav Nagar, <br /> Civil Lines, Jaipur, Rajasthan</p>
                <p className="flex items-center gap-2">Phone: <span className="text-white/60 italic">0141 405 3434</span></p>
                <p className="flex items-center gap-2 truncate whitespace-nowrap">Email: <span className="text-white/60 italic overflow-ellipsis underline underline-offset-4 decoration-white/10">jraassociates@gmail.com</span></p>
                <p className="flex items-center gap-2">Office Time: <span className="text-white/60 italic">10AM - 7PM</span></p>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/50">Useful Links</h4>
              <ul className="space-y-3 text-sm text-white/40 font-light italic">
                {['About us', 'Our services', 'Contact us', 'Meet team', 'Privacy Policy', 'Testimonials', 'News', 'FAQ'].map(link => (
                  <li key={link}><Link href="#" className="hover:text-[#c9b38c] transition-colors">{link}</Link></li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/50">Practice Area</h4>
              <ul className="space-y-3 text-sm text-white/40 font-light italic">
                {['Govt. Registration', 'Intellectual Property', 'Business Law', 'RERA Law'].map(link => (
                  <li key={link}><Link href="#" className="hover:text-[#c9b38c] transition-colors">{link}</Link></li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-white/20">Copyright © 2023. All rights reserved.</p>

            <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-white/20">
              {['Privacy & Policy', 'Terms', 'About us', 'FAQ'].map(item => (
                <Link key={item} href="#" className="hover:text-white transition-colors">{item}</Link>
              ))}
            </div>

            <button className="h-10 w-10 bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#c9b38c] transition-all">
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </footer>
    </main>
  );
}
