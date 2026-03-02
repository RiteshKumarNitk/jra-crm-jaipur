'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/landing/Hero';
import AboutSection from '@/components/landing/AboutSection';
import Gallery from '@/components/landing/Gallery';
import BlogSection from '@/components/landing/BlogSection';
import TeamSection from '@/components/landing/TeamSection';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-[#c9b38c] selection:text-white">
      {/* Global Navigation */}
      <Navbar />

      {/* Landing Content Sections */}
      <main className="flex-grow">
        <Hero />
        <AboutSection />
        <TeamSection />
        <Gallery />
        <BlogSection />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
