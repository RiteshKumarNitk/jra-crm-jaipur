'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Settings,
    User,
    Shield,
    Bell,
    Save,
    Loader2,
    CheckCircle2,
    Globe,
    Lock,
    Eye,
    EyeOff,
    Building2,
    Mail,
    Phone,
    MapPin,
    Scale,
    Clock
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useSupabaseUser } from '@/hooks/useSupabaseUser';

export default function SettingsPage() {
    const { user } = useSupabaseUser();
    const supabase = createClient();
    const [activeTab, setActiveTab] = useState('profile');
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Profile State
    const [profile, setProfile] = useState({
        full_name: '',
        role: 'Senior Counsel',
        email: '',
        phone: '',
        bio: '',
        location: 'Jaipur, Rajasthan'
    });

    // Security State
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    // Firm State
    const [firm, setFirm] = useState({
        name: 'JRA Legal Solutions',
        tagline: 'Precision. Independence. Excellence.',
        address: 'Jagdish Enclave, 105, Keshav Nagar, Civil Lines, Jaipur, Rajasthan',
        email: 'jainrathoreassociates@gmail.com',
        phone: '0141 405 3434',
        office_hours: 'Mon-Sun: 10am - 7pm',
        security_level: 'High Availability',
        protocol_version: 'v2.4.0'
    });

    useEffect(() => {
        if (user) {
            setProfile(prev => ({
                ...prev,
                full_name: user.user_metadata?.full_name || '',
                email: user.email || ''
            }));
        }

        const fetchFirmSettings = async () => {
            const { data } = await supabase
                .from('website_content')
                .select('content')
                .eq('section', 'firm_settings')
                .maybeSingle();

            if (data?.content) {
                setFirm(data.content);
            }
        };
        fetchFirmSettings();
    }, [user, supabase]);

    const handleSaveProfile = async () => {
        setIsSaving(true);
        const { error } = await supabase.auth.updateUser({
            data: { full_name: profile.full_name }
        });

        if (!error) {
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }
        setIsSaving(false);
    };

    const handleSaveFirm = async () => {
        setIsSaving(true);
        const { error } = await supabase
            .from('website_content')
            .upsert({
                section: 'firm_settings',
                content: firm,
                updated_at: new Date().toISOString()
            }, { onConflict: 'section' });

        if (!error) {
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }
        setIsSaving(false);
    };

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <span className="text-[#c9b38c] text-[10px] font-black uppercase tracking-[0.4em] mb-2 block">System Authority</span>
                    <h1 className="text-4xl font-serif text-slate-900 leading-tight flex items-center gap-3">
                        <Settings className="h-8 w-8 text-[#c9b38c]" />
                        Practice Settings
                    </h1>
                    <p className="text-slate-500 font-light mt-1 italic">Configure firm protocols, security mandates, and professional identities.</p>
                </div>
                <button
                    onClick={activeTab === 'profile' ? handleSaveProfile : handleSaveFirm}
                    disabled={isSaving}
                    className="flex items-center gap-3 px-10 py-5 bg-[#c9b38c] text-[10px] font-black uppercase tracking-widest text-white hover:bg-[#b99c69] transition-all shadow-xl shadow-[#c9b38c]/20 rounded-sm"
                >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> Commit Protocol</>}
                </button>
            </div>

            {/* Success Toast */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="p-4 bg-emerald-50 border border-emerald-100 flex items-center gap-3 text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-sm"
                    >
                        <CheckCircle2 className="h-5 w-5" /> Protocol Induction Successful
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Settings Layout */}
            <div className="flex flex-col lg:flex-row gap-10">
                {/* Navigation */}
                <div className="w-full lg:w-72 space-y-2">
                    {[
                        { id: 'profile', name: 'Counsel Profile', icon: User },
                        { id: 'security', name: 'Security Mandate', icon: Shield },
                        { id: 'firm', name: 'Firm Infrastructure', icon: Building2 },
                        { id: 'notifications', name: 'Alert Protocols', icon: Bell },
                        { id: 'preferences', name: 'System Interface', icon: Globe },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-4 px-6 py-5 text-[10px] font-black uppercase tracking-widest transition-all rounded-sm border ${activeTab === tab.id
                                ? 'bg-white border-[#c9b38c] text-[#c9b38c] shadow-lg shadow-slate-100'
                                : 'bg-transparent border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? 'text-[#c9b38c]' : 'text-slate-300'}`} />
                            {tab.name}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-white border border-slate-100 shadow-sm p-10 min-h-[500px] rounded-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                        <Scale size={240} className="text-[#c9b38c]" />
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'profile' && (
                            <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10 relative z-10">
                                <div>
                                    <h3 className="text-2xl font-serif text-slate-800 italic mb-2">Professional Identity</h3>
                                    <p className="text-slate-400 text-[11px] font-light italic">Managing high-authority credentials for the Senior Partner.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 px-1">
                                            <User className="h-3 w-3" /> Full Nomenclature
                                        </label>
                                        <input
                                            value={profile.full_name}
                                            onChange={e => setProfile({ ...profile, full_name: e.target.value })}
                                            className="w-full bg-slate-50 border-none p-4 text-xs font-bold text-slate-900 focus:ring-1 focus:ring-[#c9b38c] shadow-inner rounded-sm"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 px-1">
                                            <Briefcase className="h-3 w-3" /> Practice Role
                                        </label>
                                        <input
                                            value={profile.role}
                                            onChange={e => setProfile({ ...profile, role: e.target.value })}
                                            className="w-full bg-slate-50 border-none p-4 text-xs font-bold text-slate-900 focus:ring-1 focus:ring-[#c9b38c] shadow-inner rounded-sm"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 px-1">
                                            <Mail className="h-3 w-3" /> Encrypted Mail
                                        </label>
                                        <input
                                            readOnly
                                            value={profile.email}
                                            className="w-full bg-slate-100 border-none p-4 text-xs font-bold text-slate-400 opacity-60 rounded-sm cursor-not-allowed"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 px-1">
                                            <Phone className="h-3 w-3" /> Secure Line
                                        </label>
                                        <input
                                            value={profile.phone}
                                            onChange={e => setProfile({ ...profile, phone: e.target.value })}
                                            placeholder="+91-XXXX-XXXXXX"
                                            className="w-full bg-slate-50 border-none p-4 text-xs font-bold text-slate-900 focus:ring-1 focus:ring-[#c9b38c] shadow-inner rounded-sm"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-1.5">
                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 px-1">
                                            <FileText className="h-3 w-3" /> Professional Briefing
                                        </label>
                                        <textarea
                                            rows={4}
                                            value={profile.bio}
                                            onChange={e => setProfile({ ...profile, bio: e.target.value })}
                                            placeholder="Senior Partner at JRA Legal, specialized in High Court litigation..."
                                            className="w-full bg-white border border-slate-100 p-4 text-[11px] font-light text-slate-600 leading-relaxed focus:ring-1 focus:ring-[#c9b38c] shadow-sm resize-none rounded-sm"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'security' && (
                            <motion.div key="security" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10 relative z-10">
                                <div>
                                    <h3 className="text-2xl font-serif text-slate-800 italic mb-2">Security Mandate</h3>
                                    <p className="text-slate-400 text-[11px] font-light italic">Encryption key management and access protocol rotation.</p>
                                </div>

                                <div className="max-w-md space-y-8">
                                    <div className="p-6 bg-slate-50 border-l-4 border-[#c9b38c] space-y-4 rounded-sm">
                                        <div className="flex items-center gap-3 text-[#c9b38c]">
                                            <Lock className="h-5 w-5" />
                                            <h4 className="text-[10px] font-black uppercase tracking-widest">Access Key Rotation</h4>
                                        </div>
                                        <p className="text-[9px] text-slate-400 leading-relaxed uppercase tracking-widest font-bold">Recommended: Every 60 operational cycles.</p>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Current Protocol Key</label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    value={passwords.current}
                                                    onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                                                    className="w-full bg-white border border-slate-100 p-4 text-xs font-bold text-slate-800 focus:ring-1 focus:ring-[#c9b38c] shadow-sm rounded-sm"
                                                />
                                                <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600">
                                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">New Mandate Password</label>
                                            <input
                                                type="password"
                                                value={passwords.new}
                                                onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                                                className="w-full bg-white border border-slate-100 p-4 text-xs font-bold text-slate-800 focus:ring-1 focus:ring-[#c9b38c] shadow-sm rounded-sm"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Confirm Mandate</label>
                                            <input
                                                type="password"
                                                value={passwords.confirm}
                                                onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                                                className="w-full bg-white border border-slate-100 p-4 text-xs font-bold text-slate-800 focus:ring-1 focus:ring-[#c9b38c] shadow-sm rounded-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'firm' && (
                            <motion.div key="firm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10 relative z-10">
                                <div>
                                    <h3 className="text-2xl font-serif text-slate-800 italic mb-2">Firm Infrastructure</h3>
                                    <p className="text-slate-400 text-[11px] font-light italic">Strategic branding and legal entity nomenclature.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 px-1">
                                            <Building2 className="h-3 w-3" /> Firm Legal Name
                                        </label>
                                        <input
                                            value={firm.name}
                                            onChange={e => setFirm({ ...firm, name: e.target.value })}
                                            className="w-full bg-slate-50 border-none p-4 text-xs font-bold text-slate-900 focus:ring-1 focus:ring-[#c9b38c] shadow-inner rounded-sm"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 px-1">
                                            <Scale className="h-3 w-3" /> Strategic Tagline
                                        </label>
                                        <input
                                            value={firm.tagline}
                                            onChange={e => setFirm({ ...firm, tagline: e.target.value })}
                                            className="w-full bg-slate-50 border-none p-4 text-xs font-bold text-slate-900 focus:ring-1 focus:ring-[#c9b38c] shadow-inner rounded-sm"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-1.5">
                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 px-1">
                                            <MapPin className="h-3 w-3" /> Operational Headquarters
                                        </label>
                                        <input
                                            value={firm.address}
                                            onChange={e => setFirm({ ...firm, address: e.target.value })}
                                            className="w-full bg-slate-50 border-none p-4 text-xs font-bold text-slate-900 focus:ring-1 focus:ring-[#c9b38c] shadow-inner rounded-sm"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 px-1">
                                            <Mail className="h-3 w-3" /> External Mail Inductor
                                        </label>
                                        <input
                                            value={firm.email}
                                            onChange={e => setFirm({ ...firm, email: e.target.value })}
                                            className="w-full bg-slate-50 border-none p-4 text-xs font-bold text-slate-900 focus:ring-1 focus:ring-[#c9b38c] shadow-inner rounded-sm"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 px-1">
                                            <Phone className="h-3 w-3" /> Main Telephone Dial
                                        </label>
                                        <input
                                            value={firm.phone}
                                            onChange={e => setFirm({ ...firm, phone: e.target.value })}
                                            className="w-full bg-slate-50 border-none p-4 text-xs font-bold text-slate-900 focus:ring-1 focus:ring-[#c9b38c] shadow-inner rounded-sm"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-1.5">
                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 px-1">
                                            <Clock className="h-3 w-3" /> Legal Operational Hours
                                        </label>
                                        <input
                                            value={firm.office_hours}
                                            onChange={e => setFirm({ ...firm, office_hours: e.target.value })}
                                            className="w-full bg-slate-50 border-none p-4 text-xs font-bold text-slate-900 focus:ring-1 focus:ring-[#c9b38c] shadow-inner rounded-sm"
                                        />
                                    </div>

                                    <div className="p-8 border border-slate-100 bg-slate-50/10 flex items-center justify-between rounded-sm">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-[#c9b38c]">Infrastructure Security</p>
                                            <p className="text-xl font-serif text-slate-900">{firm.security_level}</p>
                                        </div>
                                        <Shield className="h-10 w-10 text-[#c9b38c]/20" />
                                    </div>
                                    <div className="p-8 border border-slate-100 bg-slate-50/10 flex items-center justify-between rounded-sm">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Tactical Kernel</p>
                                            <p className="text-xl font-serif text-slate-900">{firm.protocol_version}</p>
                                        </div>
                                        <Globe className="h-10 w-10 text-slate-100" />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Warning Note */}
            <div className="p-8 bg-[#1C202E] border-l-4 border-rose-500 rounded-sm">
                <div className="flex items-center gap-4 text-rose-500 mb-4">
                    <Shield className="h-6 w-6" />
                    <h5 className="text-[12px] font-black uppercase tracking-widest">Critical Authority Notice</h5>
                </div>
                <p className="text-slate-400 text-[11px] font-light leading-relaxed max-w-3xl italic">
                    All administrative alterations are recorded in the high-fidelity protocol log. Unauthorized modification of security mandates may trigger an infrastructure lockdown to protect sensitive client data and legal proceedings.
                </p>
            </div>
        </div>
    );
}
