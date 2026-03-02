'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Image as ImageIcon,
    Users,
    Briefcase,
    FileText,
    Plus,
    Trash2,
    Edit2,
    Save,
    Rocket,
    Info,
    Layers,
    CheckCircle2,
    Loader2,
    Sparkles,
    MessageSquare,
    MapPin,
    Building2,
    ExternalLink
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { insforge } from '@/utils/insforge/client';

const TABS = [
    { id: 'hero', name: 'Hero Sliders', icon: ImageIcon },
    { id: 'homepage', name: 'Firm Identity', icon: Info },
    { id: 'team', name: 'Team Roster', icon: Users },
    { id: 'blogs', name: 'Practice Blogs', icon: FileText },
    { id: 'career', name: 'Careers', icon: Briefcase },
    { id: 'gallery', name: 'Gallery', icon: Layers },
    { id: 'inquiries', name: 'Inquiries', icon: MessageSquare },
];

export default function ContentManagementPage() {
    const [activeTab, setActiveTab] = useState('hero');
    const [isSaving, setIsSaving] = useState(false);
    const [isGenerating, setIsGenerating] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const [heroSliders, setHeroSliders] = useState<any[]>([]);
    const [homepageContent, setHomepageContent] = useState<any>({
        about: { title: "", description: "", director: { name: "", role: "", bio: "", image: "" } },
        insights: { title: "", description: "" }
    });
    const [teamMembers, setTeamMembers] = useState<any[]>([]);
    const [blogs, setBlogs] = useState<any[]>([]);
    const [careers, setCareers] = useState<any[]>([]);
    const [gallery, setGallery] = useState<any[]>([]);
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const supabase = createClient();

    // Load Initial Data
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch Hero
                const { data: heroData } = await supabase
                    .from('website_content')
                    .select('content')
                    .eq('section', 'hero')
                    .maybeSingle();

                if (heroData?.content?.sliders) {
                    setHeroSliders(heroData.content.sliders);
                } else {
                    setHeroSliders([
                        { label: "Premium Legal Excellence", title: { main: "Our ", highlight: "Independence", sub: "Makes the Difference" }, image: "" }
                    ]);
                }

                // Fetch Homepage Core
                const { data: homeContentData } = await supabase
                    .from('website_content')
                    .select('*')
                    .in('section', ['about', 'insights']);

                if (homeContentData) {
                    const newContent = { ...homepageContent };
                    homeContentData.forEach(item => {
                        if (item.section === 'about') newContent.about = item.content;
                        if (item.section === 'insights') newContent.insights = item.content;
                    });
                    setHomepageContent(newContent);
                }

                // Fetch Team
                const { data: teamData } = await supabase
                    .from('team_members')
                    .select('*')
                    .order('order_index');
                if (teamData) setTeamMembers(teamData);

                // Fetch Blogs
                const { data: blogData } = await supabase
                    .from('blogs')
                    .select('*')
                    .order('created_at', { ascending: false });
                if (blogData) setBlogs(blogData);

                // Fetch Careers
                const { data: careerData } = await supabase
                    .from('job_postings')
                    .select('*')
                    .order('created_at', { ascending: false });
                if (careerData) setCareers(careerData);

                // Fetch Gallery
                const { data: galleryData } = await supabase
                    .from('gallery_items')
                    .select('*')
                    .order('order_index');
                if (galleryData) setGallery(galleryData);

                // Fetch Inquiries separately to ensure robustness
                const { data: inquiryData, error: inquiryError } = await supabase
                    .from('contact_inquiries')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (inquiryError) {
                    console.error("Inquiry fetch error:", inquiryError);
                } else if (inquiryData) {
                    setInquiries(inquiryData);
                }

            } catch (err) {
                console.error("Initial load error:", err);
            }
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const handleUpdate = async () => {
        setIsSaving(true);
        try {
            if (activeTab === 'hero') {
                await supabase.from('website_content').upsert({
                    section: 'hero',
                    content: { sliders: heroSliders }
                }, { onConflict: 'section' });
            } else if (activeTab === 'homepage') {
                await supabase.from('website_content').upsert([
                    { section: 'about', content: homepageContent.about },
                    { section: 'insights', content: homepageContent.insights }
                ], { onConflict: 'section' });
            } else if (activeTab === 'team') {
                const membersToInsert = (teamMembers || []).map((m, i) => ({
                    id: m.id || undefined,
                    name: m.name || 'Untitled Member',
                    role: m.role || 'Partner',
                    bio: m.bio || '',
                    image_url: m.image_url || null,
                    linkedin_url: m.linkedin_url || null,
                    email: m.email || null,
                    order_index: i
                }));
                if (membersToInsert.length > 0) {
                    await supabase.from('team_members').upsert(membersToInsert);
                }
            } else if (activeTab === 'blogs') {
                for (const blog of blogs) {
                    const slug = blog.slug || blog.title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
                    await supabase.from('blogs').upsert({ ...blog, slug });
                }
            } else if (activeTab === 'career') {
                if (careers.length > 0) {
                    await supabase.from('job_postings').upsert(careers);
                }
            } else if (activeTab === 'gallery') {
                const galleryToSave = gallery.map((item, i) => {
                    const obj: any = {
                        title: item.title || 'Untitled Asset',
                        category: item.category || 'Firm',
                        image_url: item.image_url || '',
                        order_index: i
                    };
                    if (item.id) obj.id = item.id;
                    return obj;
                });

                if (galleryToSave.length > 0) {
                    const { error } = await supabase.from('gallery_items').upsert(galleryToSave);
                    if (error) throw error;
                }
            }
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (err: any) {
            alert(`Update Failed: ${err.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageUpload = async (file: File, callback: (url: string) => void) => {
        setIsSaving(true);
        try {
            const fileName = `public/${Date.now()}-${file.name}`;
            const { data, error } = await supabase.storage.from('assets').uploadAuto(file, fileName);
            if (error) throw error;
            if (data?.url) callback(data.url);
        } catch (err: any) {
            alert(`Upload failed: ${err.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (table: string, id: string, setter: any, state: any[]) => {
        if (!confirm('Are you sure you want to destroy this record permanently?')) return;
        if (id) {
            await supabase.from(table).delete().eq('id', id);
        }
        setter(state.filter(item => (item.id || item) !== (id || item)));
    };

    const handleDraftWithAI = async (type: 'blog' | 'career', index: number) => {
        setIsGenerating(`${type}-${index}`);
        try {
            const item = type === 'blog' ? blogs[index] : careers[index];
            const prompt = type === 'blog'
                ? `Write a detailed, authoritative legal blog post about "${item.title}". The content should be professional, insightful, and formatted with clear paragraphs. Suitable for a premium law firm based in Jaipur. Avoid generic fillers; provide high-value legal pointers.`
                : `Write a professional, compelling job description for a "${item.title}" in the "${item.department}" department for a top-tier law firm in Jaipur. Outline the strategic impact of the role, core responsibilities, and elite requirements.`;

            const completion = await insforge.ai.chat.completions.create({
                model: 'anthropic/claude-3.5-haiku',
                messages: [{ role: 'user', content: prompt }]
            });

            const content = completion.choices[0].message.content;

            if (type === 'blog') {
                const nb = [...blogs];
                nb[index].content = content;
                nb[index].excerpt = content.substring(0, 200).replace(/\n/g, ' ') + '...';
                setBlogs(nb);
            } else {
                const nc = [...careers];
                nc[index].description = content;
                setCareers(nc);
            }
        } catch (err) {
            console.error("AI Generation error:", err);
            alert("Strategic Intelligence unreachable. Please verify model permissions in the console.");
        } finally {
            setIsGenerating(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-40">
                <Loader2 className="h-10 w-10 text-[#c9b38c] animate-spin mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">Registry Synchronization...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <span className="text-[#c9b38c] text-[10px] font-black uppercase tracking-[0.4em] mb-2 block">Strategic Controller</span>
                    <h1 className="text-4xl font-serif text-slate-900 leading-tight">Content Management</h1>
                </div>
                <button
                    onClick={handleUpdate}
                    disabled={isSaving || activeTab === 'inquiries'}
                    className={`flex items-center gap-3 px-10 py-5 bg-[#c9b38c] text-[10px] font-black uppercase tracking-widest text-white hover:bg-[#b99c69] transition-all shadow-xl shadow-[#c9b38c]/20 ${activeTab === 'inquiries' ? 'opacity-30 cursor-not-allowed' : ''}`}
                >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> Commit Changes</>}
                </button>
            </div>

            {/* Success Toast */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        className="p-4 bg-emerald-50 border border-emerald-100 flex items-center gap-3 text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-sm">
                        <CheckCircle2 className="h-5 w-5" /> Update Live on Infrastructure
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tabs */}
            <div className="flex flex-wrap border-b border-slate-100 bg-slate-50/50">
                {TABS.map((tab) => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-3 px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === tab.id ? 'text-[#c9b38c] bg-white border-t-2 border-[#c9b38c]' : 'text-slate-400 hover:text-slate-600'}`}>
                        <tab.icon className="h-4 w-4" /> {tab.name}
                        {tab.id === 'inquiries' && inquiries.length > 0 && (
                            <span className="bg-[#c9b38c] text-white text-[8px] px-1.5 py-0.5 rounded-full ml-1">
                                {inquiries.length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* UI Canvas */}
            <div className="bg-white border border-slate-100 shadow-sm p-10 min-h-[600px]">
                {activeTab === 'hero' && (
                    <div className="space-y-10">
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-serif text-slate-800 italic font-medium">Hero Visual Strategy</h3>
                            <button onClick={() => setHeroSliders([...heroSliders, { label: "New Sequence", title: { main: "Headline ", highlight: "Key", sub: "Text" }, image: "" }])}
                                className="flex items-center gap-2 px-6 py-3 border border-[#c9b38c] text-[9px] font-black uppercase tracking-widest text-[#c9b38c] hover:bg-[#c9b38c] hover:text-white transition-all">
                                <Plus className="h-4 w-4" /> New Sequence
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {heroSliders.map((slider, i) => (
                                <div key={i} className="group border border-slate-100 p-8 hover:shadow-2xl transition-all relative rounded-sm bg-slate-50/20">
                                    <div className="aspect-video bg-slate-100 mb-8 relative border border-slate-100 overflow-hidden">
                                        {slider.image ? <img src={slider.image} className="w-full h-full object-cover" /> :
                                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 opacity-50"><ImageIcon className="h-10 w-10 mb-2" /><span className="text-[9px] font-black tracking-[0.2em] uppercase">No Asset Uploaded</span></div>
                                        }
                                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                            <label className="p-4 bg-[#c9b38c] text-white rounded-none cursor-pointer hover:scale-105 transition-transform"><Sparkles className="h-5 w-5" /><input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], (url) => { const ns = [...heroSliders]; ns[i].image = url; setHeroSliders(ns); })} /></label>
                                            <button onClick={() => setHeroSliders(heroSliders.filter((_, idx) => idx !== i))} className="p-4 bg-rose-500 text-white rounded-none hover:scale-105 transition-transform"><Trash2 className="h-5 w-5" /></button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 mb-4">
                                        <input value={slider.title?.main || ''} onChange={(e) => { const ns = [...heroSliders]; ns[i].title.main = e.target.value; setHeroSliders(ns); }} className="w-full bg-white border border-slate-100 p-4 text-xs font-bold text-slate-800 focus:ring-1 focus:ring-[#c9b38c] outline-none" placeholder="Headline Main (e.g. Our)" />
                                        <input value={slider.title?.highlight || ''} onChange={(e) => { const ns = [...heroSliders]; ns[i].title.highlight = e.target.value; setHeroSliders(ns); }} className="w-full bg-slate-50 border border-[#c9b38c]/20 p-4 text-xs font-bold text-[#c9b38c] focus:ring-1 focus:ring-[#c9b38c] outline-none" placeholder="Golden Booster (High Contrast Highlight)" />
                                        <input value={slider.title?.sub || ''} onChange={(e) => { const ns = [...heroSliders]; ns[i].title.sub = e.target.value; setHeroSliders(ns); }} className="w-full bg-white border border-slate-100 p-4 text-xs font-bold text-slate-800 focus:ring-1 focus:ring-[#c9b38c] outline-none" placeholder="Registry Sub-text (Final Line)" />
                                    </div>
                                    <textarea rows={2} value={slider.label || ''} onChange={(e) => { const ns = [...heroSliders]; ns[i].label = e.target.value; setHeroSliders(ns); }} className="w-full bg-white border border-slate-100 p-4 text-[10px] font-light text-slate-400 italic focus:ring-1 focus:ring-[#c9b38c] outline-none resize-none" placeholder="Top Sequence Label (e.g. Premium Legal Excellence)" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'homepage' && (
                    <div className="space-y-12">
                        {/* About Us Registry */}
                        <div className="space-y-8 pb-12 border-b border-slate-50">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-slate-50 border border-slate-100"><Info className="h-5 w-5 text-[#c9b38c]" /></div>
                                <h3 className="text-2xl font-serif text-slate-800 italic font-medium">About Our Firm Identity</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Main Headline</label>
                                        <input value={homepageContent.about?.title || ''} onChange={e => setHomepageContent({ ...homepageContent, about: { ...homepageContent.about, title: e.target.value } })} className="w-full bg-white border border-slate-100 p-4 text-xs font-bold text-slate-900 focus:ring-1 focus:ring-[#c9b38c] outline-none" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Narrative Content (Description)</label>
                                        <textarea rows={6} value={homepageContent.about?.description || ''} onChange={e => setHomepageContent({ ...homepageContent, about: { ...homepageContent.about, description: e.target.value } })} className="w-full bg-white border border-slate-100 p-4 text-[11px] font-light text-slate-500 leading-relaxed focus:ring-1 focus:ring-[#c9b38c] outline-none resize-none" />
                                    </div>
                                </div>
                                <div className="border border-slate-100 p-8 bg-slate-50/20 group">
                                    <h4 className="text-[9px] font-black uppercase tracking-widest text-[#c9b38c] mb-6 underline">Leadership Spotlight</h4>
                                    <div className="flex gap-6 mb-6">
                                        <div className="w-24 h-24 bg-slate-100 relative border border-slate-100 flex-shrink-0 group">
                                            {homepageContent.about?.director?.image ? <img src={homepageContent.about.director.image} className="w-full h-full object-cover" /> : <Users className="h-8 w-8 text-slate-200 m-auto inset-0 absolute" />}
                                            <label className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex cursor-pointer"><Edit2 className="h-4 w-4 text-white m-auto" /><input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], (url) => setHomepageContent({ ...homepageContent, about: { ...homepageContent.about, director: { ...homepageContent.about.director, image: url } } }))} /></label>
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <input placeholder="Leader Name" value={homepageContent.about?.director?.name || ''} onChange={e => setHomepageContent({ ...homepageContent, about: { ...homepageContent.about, director: { ...homepageContent.about.director, name: e.target.value } } })} className="w-full bg-white border border-slate-100 p-3 text-[11px] font-bold text-slate-800" />
                                            <input placeholder="Role Nomenclature" value={homepageContent.about?.director?.role || ''} onChange={e => setHomepageContent({ ...homepageContent, about: { ...homepageContent.about, director: { ...homepageContent.about.director, role: e.target.value } } })} className="w-full bg-white border border-slate-100 p-3 text-[11px] font-black uppercase tracking-widest text-[#c9b38c]" />
                                        </div>
                                    </div>
                                    <textarea placeholder="Leader Briefing/Bio..." rows={3} value={homepageContent.about?.director?.bio || ''} onChange={e => setHomepageContent({ ...homepageContent, about: { ...homepageContent.about, director: { ...homepageContent.about.director, bio: e.target.value } } })} className="w-full bg-white border border-slate-100 p-4 text-[10px] font-light text-slate-500 italic resize-none" />
                                </div>
                            </div>
                        </div>

                        {/* Latest Insights Registry */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-slate-50 border border-slate-100"><Rocket className="h-5 w-5 text-[#c9b38c]" /></div>
                                <h3 className="text-2xl font-serif text-slate-800 italic font-medium">Insights Editorial Registry</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Registry Headline</label>
                                    <input value={homepageContent.insights?.title || ''} onChange={e => setHomepageContent({ ...homepageContent, insights: { ...homepageContent.insights, title: e.target.value } })} className="w-full bg-white border border-slate-100 p-4 text-xs font-bold text-slate-900 focus:ring-1 focus:ring-[#c9b38c] outline-none" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Editorial Narrative</label>
                                    <textarea rows={3} value={homepageContent.insights?.description || ''} onChange={e => setHomepageContent({ ...homepageContent, insights: { ...homepageContent.insights, description: e.target.value } })} className="w-full bg-white border border-slate-100 p-4 text-[11px] font-light text-slate-500 leading-relaxed focus:ring-1 focus:ring-[#c9b38c] outline-none resize-none" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'team' && (
                    <div className="space-y-10">
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-serif text-slate-800 italic font-medium">Partnership Registry</h3>
                            <button onClick={() => setTeamMembers([...teamMembers, { name: "New Partner", role: "Special Counsel", bio: "", image_url: "", linkedin_url: "", email: "" }])}
                                className="flex items-center gap-2 px-6 py-3 border border-[#c9b38c] text-[9px] font-black uppercase tracking-widest text-[#c9b38c] hover:bg-[#c9b38c] hover:text-white transition-all">
                                <Plus className="h-4 w-4" /> Induct Partner
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {teamMembers.map((member, i) => (
                                <div key={i} className="border border-slate-100 p-8 text-center group bg-slate-50/30 hover:bg-white hover:shadow-2xl transition-all relative">
                                    <div className="w-24 h-32 bg-slate-100 mx-auto mb-6 relative border border-slate-100 overflow-hidden">
                                        {member.image_url ? <img src={member.image_url} className="w-full h-full object-cover" /> : <Users className="h-8 w-8 text-slate-200 m-auto inset-0 absolute" />}
                                        <label className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex cursor-pointer"><Edit2 className="h-5 w-5 text-white m-auto" /><input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], (url) => { const nt = [...teamMembers]; nt[i].image_url = url; setTeamMembers(nt); })} /></label>
                                    </div>
                                    <input value={member.name} onChange={(e) => { const nt = [...teamMembers]; nt[i].name = e.target.value; setTeamMembers(nt); }} className="text-lg font-bold text-slate-900 w-full text-center bg-transparent border-none focus:ring-0 mb-1" />
                                    <input value={member.role} onChange={(e) => { const nt = [...teamMembers]; nt[i].role = e.target.value; setTeamMembers(nt); }} className="text-[9px] font-black uppercase tracking-[0.3em] text-[#c9b38c] w-full text-center bg-transparent border-none focus:ring-0 mb-6" />
                                    <textarea rows={3} value={member.bio} onChange={(e) => { const nt = [...teamMembers]; nt[i].bio = e.target.value; setTeamMembers(nt); }} className="text-[11px] text-slate-500 font-light italic w-full text-center bg-transparent border-none focus:ring-0 resize-none px-2 mb-4" placeholder="Brief partnership history..." />
                                    <div className="grid grid-cols-1 gap-2 mb-6 px-4">
                                        <div className="flex items-center gap-2 bg-white border border-slate-100 p-2">
                                            <ImageIcon className="h-3 w-3 text-slate-300" />
                                            <input value={member.linkedin_url || ''} onChange={(e) => { const nt = [...teamMembers]; nt[i].linkedin_url = e.target.value; setTeamMembers(nt); }} className="text-[9px] w-full border-none focus:ring-0 p-0" placeholder="LinkedIn Profile URL" />
                                        </div>
                                        <div className="flex items-center gap-2 bg-white border border-slate-100 p-2">
                                            <FileText className="h-3 w-3 text-slate-300" />
                                            <input value={member.email || ''} onChange={(e) => { const nt = [...teamMembers]; nt[i].email = e.target.value; setTeamMembers(nt); }} className="text-[9px] w-full border-none focus:ring-0 p-0" placeholder="Partner Email Address" />
                                        </div>
                                    </div>
                                    <button onClick={() => handleDelete('team_members', member.id, setTeamMembers, teamMembers)} className="text-[9px] font-black uppercase text-rose-300 hover:text-rose-500 tracking-widest pt-4 border-t border-slate-100 w-full">Expel Record</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'blogs' && (
                    <div className="space-y-10">
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-serif text-slate-800 italic font-medium">Practice Intelligence (Blogs)</h3>
                            <button onClick={() => setBlogs([{ title: "New Legal Insight", excerpt: "", content: "", category: "General", image_url: "" }, ...blogs])}
                                className="flex items-center gap-2 px-6 py-3 border border-[#c9b38c] text-[9px] font-black uppercase tracking-widest text-[#c9b38c] hover:bg-[#c9b38c] hover:text-white transition-all">
                                <Plus className="h-4 w-4" /> New Article
                            </button>
                        </div>
                        <div className="space-y-8">
                            {blogs.map((blog, i) => (
                                <div key={i} className="border border-slate-100 p-10 group bg-slate-50/20 hover:border-[#c9b38c]/40 transition-all rounded-sm flex flex-col xl:flex-row gap-10">
                                    <div className="w-full xl:w-80 aspect-video bg-slate-100 border border-slate-100 relative group overflow-hidden flex-shrink-0">
                                        {blog.image_url ? <img src={blog.image_url} className="w-full h-full object-cover" /> : <ImageIcon className="h-10 w-10 text-slate-200 m-auto inset-0 absolute" />}
                                        <label className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex cursor-pointer"><ImageIcon className="h-6 w-6 text-white m-auto" /><input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], (url) => { const nb = [...blogs]; nb[i].image_url = url; setBlogs(nb); })} /></label>
                                    </div>
                                    <div className="flex-1 space-y-6">
                                        <div className="flex items-center justify-between gap-6">
                                            <input value={blog.title} onChange={(e) => { const nb = [...blogs]; nb[i].title = e.target.value; setBlogs(nb); }} className="text-2xl font-serif text-slate-900 bg-transparent border-none focus:ring-0 p-0 w-full" placeholder="Insight Title" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div><label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-2">Registry Category</label>
                                                <input value={blog.category || ''} onChange={(e) => { const nb = [...blogs]; nb[i].category = e.target.value; setBlogs(nb); }} className="w-full bg-white border border-slate-100 p-4 text-xs font-bold text-slate-700 italic" /></div>
                                            <div><label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-2">Protocol Slug</label>
                                                <input value={blog.slug || ''} readOnly className="w-full bg-slate-100 border-none p-4 text-xs text-slate-400 opacity-60" placeholder="auto-generated" /></div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Article Abstract (Excerpt)</label>
                                            <textarea rows={2} value={blog.excerpt || ''} onChange={(e) => { const nb = [...blogs]; nb[i].excerpt = e.target.value; setBlogs(nb); }} className="w-full bg-white border border-slate-100 p-4 text-[10px] font-light text-slate-500 italic resize-none" placeholder="Primary strategic abstract..." />
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Briefing Intelligence (Main Content)</label>
                                                <button
                                                    onClick={() => handleDraftWithAI('blog', i)}
                                                    disabled={!!isGenerating || !blog.title}
                                                    className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-[#c9b38c] hover:opacity-80 disabled:opacity-30 transition-all border border-[#c9b38c]/20 px-3 py-1.5 rounded-sm"
                                                >
                                                    {isGenerating === `blog-${i}` ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                                                    Draft with AI
                                                </button>
                                            </div>
                                            <textarea rows={10} value={blog.content || ''} onChange={(e) => { const nb = [...blogs]; nb[i].content = e.target.value; setBlogs(nb); }} className="w-full bg-white border border-slate-100 p-6 text-[11px] font-light text-slate-700 leading-relaxed focus:ring-1 focus:ring-[#c9b38c] outline-none" placeholder="Input full legal intelligence briefing here..." />
                                        </div>
                                        <div className="flex justify-end pt-4 border-t border-slate-50"><button onClick={() => handleDelete('blogs', blog.id, setBlogs, blogs)} className="text-[9px] font-black uppercase text-rose-300 hover:text-rose-500 tracking-widest">Destroy Record</button></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'career' && (
                    <div className="space-y-10">
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-serif text-slate-800 italic font-medium">Career Opportunities Registry</h3>
                            <button onClick={() => setCareers([{ title: "New Position", department: "Legal", description: "", requirements: "", type: "Full-time", is_active: true }, ...careers])}
                                className="flex items-center gap-2 px-6 py-3 border border-[#c9b38c] text-[9px] font-black uppercase tracking-widest text-[#c9b38c] hover:bg-[#c9b38c] hover:text-white transition-all">
                                <Plus className="h-4 w-4" /> Post Opportunity
                            </button>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                            {careers.map((job, i) => (
                                <div key={i} className="border border-slate-100 p-8 group bg-slate-50/20 hover:bg-white transition-all rounded-sm">
                                    <div className="flex items-center justify-between mb-8">
                                        <input value={job.title} onChange={(e) => { const nc = [...careers]; nc[i].title = e.target.value; setCareers(nc); }} className="text-xl font-bold text-slate-900 bg-transparent border-none focus:ring-0 p-0 w-full" placeholder="Position Title" />
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <input type="checkbox" checked={job.is_active} onChange={(e) => { const nc = [...careers]; nc[i].is_active = e.target.checked; setCareers(nc); }} className="rounded-sm border-slate-300 text-[#c9b38c] focus:ring-[#c9b38c]" />
                                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Active</span>
                                            </div>
                                            <button onClick={() => handleDelete('job_postings', job.id, setCareers, careers)} className="text-rose-300 hover:text-rose-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                        <div><label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-2">Department</label>
                                            <input value={job.department || ''} onChange={(e) => { const nc = [...careers]; nc[i].department = e.target.value; setCareers(nc); }} className="w-full bg-white border border-slate-100 p-3 text-xs font-bold text-slate-700" /></div>
                                        <div><label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-2">Employment Type</label>
                                            <select value={job.type || 'Full-time'} onChange={(e) => { const nc = [...careers]; nc[i].type = e.target.value; setCareers(nc); }} className="w-full bg-white border border-slate-100 p-3 text-xs font-bold text-slate-700">
                                                <option>Full-time</option><option>Part-time</option><option>Internship</option><option>Contract</option>
                                            </select></div>
                                        <div><label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-2">Primary Location</label>
                                            <input value={job.location || ''} onChange={(e) => { const nc = [...careers]; nc[i].location = e.target.value; setCareers(nc); }} className="w-full bg-white border border-slate-100 p-3 text-xs font-bold text-slate-700" /></div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Operational Description</label>
                                            <button
                                                onClick={() => handleDraftWithAI('career', i)}
                                                disabled={!!isGenerating || !job.title}
                                                className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-[#c9b38c] hover:opacity-80 disabled:opacity-30 transition-all border border-[#c9b38c]/20 px-3 py-1.5 rounded-sm"
                                            >
                                                {isGenerating === `career-${i}` ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                                                Draft Protocol
                                            </button>
                                        </div>
                                        <textarea rows={6} value={job.description || ''} onChange={(e) => { const nc = [...careers]; nc[i].description = e.target.value; setCareers(nc); }} className="w-full bg-white border border-slate-100 p-4 text-xs font-light text-slate-600 focus:ring-1 focus:ring-[#c9b38c] outline-none" placeholder="Job description and strategic role..." />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'gallery' && (
                    <div className="space-y-10">
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-serif text-slate-800 italic font-medium">Firm Asset Gallery</h3>
                            <button onClick={() => setGallery([...gallery, { title: "New Asset", category: "Firm", image_url: "", description: "" }])}
                                className="flex items-center gap-2 px-6 py-3 border border-[#c9b38c] text-[9px] font-black uppercase tracking-widest text-[#c9b38c] hover:bg-[#c9b38c] hover:text-white transition-all">
                                <Plus className="h-4 w-4" /> Induct Asset
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {gallery.map((item, i) => (
                                <div key={i} className="group border border-slate-100 p-4 hover:shadow-2xl transition-all relative bg-slate-50/20">
                                    <div className="aspect-square bg-slate-100 mb-4 relative overflow-hidden border border-slate-100">
                                        {item.image_url ? <img src={item.image_url} className="w-full h-full object-cover" /> : <ImageIcon className="h-8 w-8 text-slate-200 m-auto inset-0 absolute" />}
                                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <label className="p-2 bg-[#c9b38c] text-white cursor-pointer"><Edit2 className="h-4 w-4" /><input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], (url) => { const ng = [...gallery]; ng[i].image_url = url; setGallery(ng); })} /></label>
                                            <button onClick={() => handleDelete('gallery_items', item.id, setGallery, gallery)} className="p-2 bg-rose-500 text-white"><Trash2 className="h-4 w-4" /></button>
                                        </div>
                                    </div>
                                    <input value={item.title || ''} onChange={(e) => { const ng = [...gallery]; ng[i].title = e.target.value; setGallery(ng); }} className="w-full text-[11px] font-bold text-slate-800 bg-transparent mb-1 border-none focus:ring-0 p-0" placeholder="Asset Name" />
                                    <input value={item.category || ''} onChange={(e) => { const ng = [...gallery]; ng[i].category = e.target.value; setGallery(ng); }} className="w-full text-[8px] font-black uppercase tracking-widest text-[#c9b38c] bg-transparent border-none focus:ring-0 p-0" placeholder="Category" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'inquiries' && (
                    <div className="space-y-10">
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-serif text-slate-800 italic font-medium">Client Inquiry Log</h3>
                        </div>
                        <div className="space-y-4">
                            {inquiries.map((inquiry, i) => (
                                <div key={i} className="border border-slate-100 p-6 bg-slate-50/30 hover:bg-white transition-all group">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                                {inquiry.name} <span className="px-2 py-0.5 bg-slate-200 text-[8px] font-black uppercase tracking-widest rounded-full">{inquiry.status}</span>
                                            </h4>
                                            <p className="text-[10px] text-slate-400 font-medium">{inquiry.email} • {inquiry.phone || 'No Phone'}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">{new Date(inquiry.created_at).toLocaleDateString()}</span>
                                            <button onClick={() => handleDelete('contact_inquiries', inquiry.id, setInquiries, inquiries)} className="text-rose-300 hover:text-rose-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-slate-600 font-light leading-relaxed bg-white/50 p-4 border-l-2 border-[#c9b38c]">"{inquiry.message}"</p>
                                </div>
                            ))}
                            {inquiries.length === 0 && <div className="text-center py-20 opacity-30 italic text-sm">No strategic inquiries recorded.</div>}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Note */}
            <div className="p-8 bg-slate-900 border-l-4 border-[#c9b38c] flex items-center gap-6 rounded-sm">
                <div className="p-4 bg-[#c9b38c]/20 text-[#c9b38c]"><Info className="h-6 w-6" /></div>
                <div>
                    <h5 className="text-white text-[12px] font-black uppercase tracking-widest mb-1">Infrastructure Authority</h5>
                    <p className="text-slate-400 text-[11px] font-light">All revisions are committed directly to high-availability database nodes. Asset hosting provided by InsForge Edge Storage.</p>
                </div>
            </div>
        </div>
    );
}
