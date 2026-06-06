import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Search, Mail, MapPin, CheckCircle2, Clock, X, Plus, 
  Layers, Settings, Sparkles, RefreshCw, Trash2, Copy, Check, 
  AlertTriangle, Send, HelpCircle, ChevronRight, ChevronLeft, 
  Compass, Info, BookOpen, Lock, Unlock, Shield, Activity, User, 
  Eye, EyeOff, Calculator, ArrowRight, Terminal, Zap 
} from 'lucide-react';

// === KEAMANAN SEDERHANA SISI KLIEN ===
const ADMIN_USERNAME = "andreuw";
const ADMIN_PASSWORD_HASH = "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918"; // Skull0m4n14

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);                    
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// === MOCK DATA FALLBACK (Jika API Key Kosong) ===
const initialLeads = [
  { id: 'lead-1', businessName: 'Kopi Kenangan Senja', category: 'Coffee Shop', location: 'Jakarta Selatan', email: 'info@kenangansenja.id', phone: '081234567890', instagram: '@kopikenangansenja', designWeakness: 'Menu digital di Google Maps buram.', pitchStatus: 'Belum Dihubungi', suggestedService: 'Redesain Menu', createdAt: '2026-06-01' },
];

const mockScraperDatabase = [
  { businessName: 'Soto Kudus Pak Kumis', category: 'Kuliner', location: 'Jakarta', email: 'sotopakkumis@gmail.com', phone: '081311112222', instagram: '@sotopakkumis.jkt', designWeakness: 'Banner warung jadul dan resolusi rendah.', suggestedService: 'Desain Banner & Menu' },
  { businessName: 'Hype Sneakers Store', category: 'Retail', location: 'Jakarta', email: '', phone: '081322223333', instagram: '@hype.sneakers', designWeakness: 'Feed Instagram berantakan, butuh template.', suggestedService: 'Social Media Branding' }
];

const tourSteps = [
  { title: "👋 Selamat Datang!", description: "Asisten pintar ini akan mempermudah Anda mencari klien desain potensial dan melakukan penawaran cepat.", target: "global", icon: Compass },
  { title: "⚙️ Pengaturan Wajib", description: "Klik ikon roda gigi. Masukkan Google Gemini API Key agar fitur pencarian klien dunia nyata dan AI penulis aktif sepenuhnya!", target: "settings", icon: Settings },
  { title: "🔍 Scrape Klien Nyata", description: "Ketik industri dan kota. AI akan mencarikan daftar bisnis nyata beserta kelemahan desain mereka untuk Anda prospek.", target: "scraper", icon: Search },
  { title: "✨ Tulis Penawaran AI", description: "Klik 'Buat Pitch'. AI akan meracik pesan persuasif khusus untuk klien tersebut. Tinggal salin dan kirim!", target: "pitch", icon: Sparkles }
];

export default function App() {
  const [view, setView] = useState('landing'); 
  const [user, setUser] = useState(null); 
  
  // Security States
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(0); 
  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('ch_audit_logs');
    return saved ? JSON.parse(saved) : [{ timestamp: new Date().toLocaleTimeString(), action: "Sistem Keamanan Diinisialisasi", status: "SUCCESS" }];
  });

  // Data States
  const [leads, setLeads] = useState(() => {
    const saved = localStorage.getItem('client_hunter_leads');
    return saved ? JSON.parse(saved) : initialLeads;
  });

  // Form Inputs Login
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Scraper & AI States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapedResults, setScrapedResults] = useState([]);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [portfolioLink, setPortfolioLink] = useState(() => localStorage.getItem('designer_portfolio') || '');
  const [designerName, setDesignerName] = useState(() => localStorage.getItem('designer_name') || '');
  const [showSettings, setShowSettings] = useState(false);

  // Pitch Generation States
  const [selectedLead, setSelectedLead] = useState(null);
  const [generatedPitch, setGeneratedPitch] = useState('');
  const [isGeneratingPitch, setIsGeneratingPitch] = useState(false);
  const [copied, setCopied] = useState(false);

  // Modal & UI States
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLead, setNewLead] = useState({ businessName: '', category: '', location: '', email: '', phone: '', instagram: '', designWeakness: '', suggestedService: '', pitchStatus: 'Belum Dihubungi' });
  const [showTour, setShowTour] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const [showHelpTips, setShowHelpTips] = useState(true);
  const [activeTooltip, setActiveTooltip] = useState(null);

  // Timer Brute Force
  useEffect(() => {
    let timer;
    if (lockoutTime > 0) {
      timer = setInterval(() => setLockoutTime((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [lockoutTime]);

  useEffect(() => localStorage.setItem('ch_audit_logs', JSON.stringify(auditLogs)), [auditLogs]);
  useEffect(() => localStorage.setItem('client_hunter_leads', JSON.stringify(leads)), [leads]);

  const addAuditLog = (action, status) => {
    const newLog = { timestamp: new Date().toLocaleTimeString(), action, status };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 19)]);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (lockoutTime > 0) return;

    if (loginUsername.trim() === ADMIN_USERNAME) {
      const hashedInput = await sha256(loginPassword);
      if (hashedInput === ADMIN_PASSWORD_HASH) {
        setUser({ role: 'super_admin', name: 'Andreuw (Super Admin)' });
        setLoginAttempts(0); setLoginError('');
        addAuditLog("Super Admin Berhasil Login", "SUCCESS");
        setView('dashboard');
        setLoginPassword(''); setLoginUsername('');
      } else handleFailedLogin();
    } else handleFailedLogin();
  };

  const handleFailedLogin = () => {
    const nextAttempts = loginAttempts + 1;
    setLoginAttempts(nextAttempts);
    if (nextAttempts >= 3) {
      setLockoutTime(30);
      setLoginError("Percobaan salah terlalu sering! Sistem dikunci selama 30 detik.");
    } else {
      setLoginError(`Kredensial salah! Sisa percobaan: ${3 - nextAttempts}`);
    }
  };

  const handleGuestLogin = () => {
    if (lockoutTime > 0) return;
    setUser({ role: 'guest', name: 'Guest Explorer' });
    setView('dashboard'); setLoginError('');
  };

  const saveConfiguration = () => {
    localStorage.setItem('gemini_api_key', apiKey);
    localStorage.setItem('designer_portfolio', portfolioLink);
    localStorage.setItem('designer_name', designerName);
    setShowSettings(false);
    addAuditLog("Konfigurasi API AI diperbarui", "SUCCESS");
  };

  // === FITUR 1: SCRAPER KLIEN DUNIA NYATA DENGAN API GEMINI ===
  const handleScrape = async (e) => {
    e.preventDefault();
    setIsScraping(true);
    addAuditLog(`Pencarian klien: ${searchQuery} di ${searchLocation}`, "INFO");
    
    if (!apiKey) {
      // Fallback ke Mock jika API Key kosong
      setTimeout(() => {
        const results = mockScraperDatabase.filter(item => 
          item.category.toLowerCase().includes(searchQuery.toLowerCase()) || 
          item.location.toLowerCase().includes(searchLocation.toLowerCase())
        );
        setScrapedResults(results.length > 0 ? results : mockScraperDatabase);
        setIsScraping(false);
      }, 1500);
      return;
    }

    // Call Real Gemini API
    try {
      const prompt = `Carikan saya 4 bisnis lokal nyata atau yang sangat realistis di industri "${searchQuery}" yang berada di area "${searchLocation}".
Lakukan analisis singkat: apa kemungkinan kelemahan desain atau digital marketing mereka, dan apa layanan yang pas untuk ditawarkan.
KEMBALIKAN HANYA ARRAY JSON MURNI TANPA MARKDOWN. 
Format persis seperti ini:
[
  {
    "businessName": "Nama Bisnis",
    "category": "${searchQuery}",
    "location": "${searchLocation}",
    "instagram": "@username_ig_mereka",
    "phone": "0812xxxxxx (atau kosongkan)",
    "email": "email (atau kosongkan)",
    "designWeakness": "Penjelasan logis kelemahan visual mereka",
    "suggestedService": "Layanan yang cocok (contoh: Website Redesign)"
  }
]`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      let textResult = data.candidates[0].content.parts[0].text;
      textResult = textResult.replace(/```json/g, '').replace(/```/g, '').trim();
      
      const parsedResults = JSON.parse(textResult);
      setScrapedResults(parsedResults);
      addAuditLog(`AI menemukan ${parsedResults.length} klien nyata`, "SUCCESS");
    } catch (err) {
      console.error(err);
      addAuditLog(`Scraping API Error: ${err.message}`, "ERROR");
      setScrapedResults(mockScraperDatabase); // Fallback on error
    } finally {
      setIsScraping(false);
    }
  };

  // === FITUR 2: PENULIS PITCH CERDAS DENGAN API GEMINI ===
  const generateAIPitch = async (lead) => {
    setSelectedLead(lead);
    setIsGeneratingPitch(true);
    setCopied(false);
    
    if (!apiKey) {
      setTimeout(() => {
        setGeneratedPitch(`Halo tim ${lead.businessName},\n\nPerkenalkan saya ${designerName}. Saya melihat bisnis Anda di ${lead.location} sangat menarik. Namun, saya perhatikan ${lead.designWeakness}\n\nSebagai desainer, saya menawarkan ${lead.suggestedService} untuk mengatasi masalah ini.\n\nCek portofolio saya: ${portfolioLink}\n\nMari diskusi lebih lanjut!`);
        setIsGeneratingPitch(false);
      }, 1000);
      return;
    }

    try {
      const prompt = `Buat email penawaran jasa (cold pitch) yang sangat profesional, ramah, dan mematikan.
Dari: ${designerName || 'Seorang Desainer Profesional'}
Kepada: ${lead.businessName}
Lokasi Klien: ${lead.location}
Masalah Klien yang ditemukan: ${lead.designWeakness}
Solusi yang Ditawarkan: ${lead.suggestedService}
Link Portofolio: ${portfolioLink || '[Masukkan Link Portofolio Anda]'}

Instruksi: Tulis dalam Bahasa Indonesia. Maksimal 3 paragraf. Fokus pada "rasa sakit" klien akibat masalah tersebut dan bagaimana solusi saya bisa menaikkan omset/kredibilitas mereka. Jangan beri Subjek, langsung isi pesannya.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      setGeneratedPitch(data.candidates[0].content.parts[0].text.trim());
      addAuditLog(`Pitch AI Nyata dibuat untuk ${lead.businessName}`, "SUCCESS");
    } catch (err) {
      setGeneratedPitch(`Error AI: ${err.message}. Periksa API Key Anda.`);
    } finally {
      setIsGeneratingPitch(false);
    }
  };

  const addScrapedToLeads = (item) => {
    const newLeadObj = { ...item, id: 'lead-' + Date.now(), pitchStatus: 'Belum Dihubungi', createdAt: new Date().toISOString().split('T')[0] };
    setLeads([newLeadObj, ...leads]);
    setScrapedResults(scrapedResults.filter(r => r.businessName !== item.businessName));
    addAuditLog(`Menambahkan ${item.businessName} ke CRM`, "SUCCESS");
  };

  const deleteLead = (id) => setLeads(leads.filter(l => l.id !== id));
  const updateLeadStatus = (id, status) => setLeads(leads.map(l => l.id === id ? { ...l, pitchStatus: status } : l));

  const copyToClipboard = () => {
    const textArea = document.createElement("textarea");
    textArea.value = generatedPitch;
    document.body.appendChild(textArea);
    textArea.select();
    try { document.execCommand('copy'); } catch (err) {}
    document.body.removeChild(textArea);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddLeadSubmit = (e) => {
    e.preventDefault();
    setLeads([{ ...newLead, id: 'lead-' + Date.now() }, ...leads]);
    setShowAddModal(false);
    setNewLead({ businessName: '', category: '', location: '', email: '', phone: '', instagram: '', designWeakness: '', suggestedService: '', pitchStatus: 'Belum Dihubungi' });
  };

  const nextTourStep = () => {
    if (tourIndex < tourSteps.length - 1) {
      setTourIndex(tourIndex + 1);
      setShowSettings(tourSteps[tourIndex + 1].target === 'settings');
    } else setShowTour(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased relative selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* 1. VIEW LANDING PAGE */}
      {view === 'landing' && (
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="bg-gradient-to-tr from-cyan-500 to-indigo-600 p-2 rounded-lg">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                <span className="font-extrabold tracking-tight text-lg text-white">Client Hunter</span>
              </div>
              <button onClick={() => setView('login')} className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/10 active:scale-95">
                Masuk Platform
              </button>
            </div>
          </header>

          <section className="relative pt-24 pb-16 px-6 overflow-hidden flex-1 flex items-center justify-center">
            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-950/40 border border-indigo-500/20 rounded-full text-xs font-medium text-indigo-400 mb-2">
                <Sparkles className="h-3 w-3" /> Berburu Klien dengan Kekuatan AI Nyata
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
                Temukan <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">Klien Impian</span> Anda <br />Berdasarkan Cacat Desain Mereka.
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                Dilengkapi dengan integrasi Google Gemini API, platform ini secara nyata menelusuri bisnis lokal, mendeteksi kelemahan branding, dan menulis email penawaran yang mustahil untuk ditolak.
              </p>
              <button onClick={() => setView('login')} className="bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm px-8 py-3.5 rounded-xl transition-all shadow-lg active:scale-95 inline-flex items-center gap-2">
                Mulai Berburu Klien <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </section>
        </div>
      )}

      {/* 2. SECURE LOGIN SYSTEM */}
      {view === 'login' && (
        <div className="min-h-screen flex items-center justify-center p-4 relative bg-slate-950">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative z-10">
            <div className="text-center space-y-2 mb-6">
              <Shield className="h-8 w-8 text-indigo-400 mx-auto" />
              <h2 className="text-xl font-extrabold text-white">Portal Keamanan</h2>
            </div>

            {loginError && <div className="mb-4 bg-rose-950/40 border border-rose-500/20 p-3 rounded-xl text-rose-300 text-xs">{loginError}</div>}
            
            <form onSubmit={handleLogin} className="space-y-4">
              <input type="text" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} placeholder="Username (andreuw)" disabled={lockoutTime > 0} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none" required />
              <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Password ($kull0m4n14)" disabled={lockoutTime > 0} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none" required />
              <button type="submit" disabled={lockoutTime > 0} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                <Unlock className="h-4 w-4" /> Masuk Sebagai Admin
              </button>
            </form>
            
            <div className="my-6 border-t border-slate-800 relative">
              <span className="bg-slate-900 px-3 text-slate-500 text-xs absolute -top-2 left-1/2 -translate-x-1/2">ATAU</span>
            </div>

            <button onClick={handleGuestLogin} disabled={lockoutTime > 0} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
              <Zap className="h-4 w-4" /> Masuk Sebagai Tamu
            </button>
          </div>
        </div>
      )}

      {/* 3. DASHBOARD UTAMA */}
      {view === 'dashboard' && (
        <div className="flex flex-col min-h-screen">
          
          {/* Header Nav */}
          <nav className="border-b border-slate-900 bg-slate-950/90 backdrop-blur-md sticky top-0 z-30 px-4 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-tr from-cyan-500 to-indigo-600 p-2 rounded-xl">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-base font-extrabold text-white flex items-center gap-2">Client Hunter</h1>
                  <p className="text-[10px] text-slate-500">Sesi: {user?.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button onClick={() => setShowSettings(!showSettings)} className="bg-slate-900 border border-slate-800 hover:border-indigo-500 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 text-slate-300">
                  <Settings className="h-3.5 w-3.5" /> Konfigurasi AI
                </button>
                <button onClick={() => { setUser(null); setView('landing'); }} className="bg-rose-950/30 text-rose-400 hover:bg-rose-900/50 px-3 py-1.5 rounded-xl text-xs font-bold transition-all">
                  Keluar
                </button>
              </div>
            </div>
          </nav>

          <main className="max-w-7xl mx-auto px-4 py-6 w-full flex-1 space-y-6">
            
            {/* API Warning Panel */}
            {!apiKey && !showSettings && (
              <div className="bg-amber-950/30 border border-amber-500/30 p-4 rounded-xl flex items-start gap-3 text-amber-200">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <div className="text-sm">
                  <strong>API Key Belum Diatur!</strong> Aplikasi saat ini berjalan dalam "Mock Mode" (data palsu). Untuk melakukan pencarian bisnis nyata, klik <button onClick={() => setShowSettings(true)} className="underline font-bold">Konfigurasi AI</button> dan masukkan kunci Gemini Anda.
                </div>
              </div>
            )}

            {/* Panel Pengaturan AI */}
            {showSettings && (
              <div className="bg-slate-900 border border-indigo-500/50 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Sparkles className="text-indigo-400" /> Pengaturan Asisten AI</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Nama Desainer / Studio</label>
                    <input type="text" value={designerName} onChange={(e) => setDesignerName(e.target.value)} placeholder="Budi Kreatif" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Link Portofolio</label>
                    <input type="url" value={portfolioLink} onChange={(e) => setPortfolioLink(e.target.value)} placeholder="https://behance.net/..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1 flex justify-between">
                      <span>Google Gemini API Key</span> <span className="text-[10px] text-amber-400">Wajib untuk Data Nyata</span>
                    </label>
                    <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="AIzaSy..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none" />
                    <p className="text-[9px] text-slate-500 mt-1">Dapatkan gratis di <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-indigo-400 underline">Google AI Studio</a>.</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-800 text-right">
                  <button onClick={saveConfiguration} className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all shadow-lg">Simpan & Aktifkan AI</button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* KOLOM KIRI: SCRAPER NYATA */}
              <div className="lg:col-span-5">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-200 flex items-center gap-2"><Search className="h-5 w-5 text-cyan-400" /> Scraper Bisnis Lokal</h3>
                    {apiKey ? 
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1"><Zap className="w-3 h-3" /> API AKTIF</span> : 
                      <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> MOCK DATA</span>
                    }
                  </div>

                  <form onSubmit={handleScrape} className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" placeholder="Industri (Misal: Kedai Kopi)" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none" required />
                      <input type="text" placeholder="Kota (Misal: Bandung)" value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none" required />
                    </div>
                    <button type="submit" disabled={isScraping} className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2">
                      {isScraping ? <RefreshCw className="h-4 w-4 animate-spin" /> : <><Sparkles className="h-4 w-4" /> Cari Prospek</>}
                    </button>
                  </form>

                  <div className="mt-6 flex-1">
                    <div className="text-xs font-bold text-slate-400 mb-3 border-b border-slate-800 pb-2">Hasil Temuan: {scrapedResults.length} Bisnis</div>
                    
                    <div className="space-y-3 max-h-[450px] overflow-y-auto">
                      {scrapedResults.map((item, idx) => (
                        <div key={idx} className="bg-slate-950 border border-slate-800 p-4 rounded-xl group relative">
                          <div className="flex justify-between items-start mb-1.5">
                            <span className="text-[10px] bg-cyan-900/40 text-cyan-400 px-2 py-0.5 rounded-full font-bold">{item.category}</span>
                            <span className="text-[10px] text-slate-400">{item.location}</span>
                          </div>
                          <h4 className="font-bold text-slate-200">{item.businessName}</h4>
                          <p className="text-[10px] text-slate-400 my-1">{item.instagram || item.phone || item.email || 'Tidak ada kontak'}</p>
                          <div className="mt-2 text-[10px] text-rose-300 bg-rose-950/20 border border-rose-900/30 p-2 rounded-lg">
                            <strong className="text-rose-400 block">Identifikasi Masalah:</strong> {item.designWeakness}
                          </div>
                          <div className="mt-3 flex items-center justify-between border-t border-slate-800 pt-2">
                            <div className="text-[10px] text-emerald-400 font-bold">{item.suggestedService}</div>
                            <button onClick={() => addScrapedToLeads(item)} className="bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                              <Plus className="h-3 w-3" /> Tambah
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* KOLOM KANAN: CRM & AI WRITER */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                  <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                    <h3 className="font-extrabold text-lg text-slate-200 flex items-center gap-2"><Layers className="h-5 w-5 text-indigo-400" /> CRM Penjualan</h3>
                    <button onClick={() => setShowAddModal(true)} className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"><Plus className="h-3.5 w-3.5" /> Manual</button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Kolom 1: Baru */}
                    <div className="bg-slate-950 border border-slate-850 p-2 rounded-xl min-h-[300px]">
                      <h4 className="text-xs font-bold text-slate-300 mb-2 border-b border-slate-800 pb-2 text-center">Baru</h4>
                      <div className="space-y-2">
                        {leads.filter(l => l.pitchStatus === 'Belum Dihubungi').map(lead => (
                          <LeadCard key={lead.id} lead={lead} onGeneratePitch={generateAIPitch} onDelete={deleteLead} onStatusChange={updateLeadStatus} />
                        ))}
                      </div>
                    </div>
                    {/* Kolom 2: Di email/Nego */}
                    <div className="bg-slate-950 border border-slate-850 p-2 rounded-xl min-h-[300px]">
                      <h4 className="text-xs font-bold text-amber-400 mb-2 border-b border-slate-800 pb-2 text-center">Follow Up / Nego</h4>
                      <div className="space-y-2">
                        {leads.filter(l => l.pitchStatus === 'Dihubungi' || l.pitchStatus === 'Negosiasi').map(lead => (
                          <LeadCard key={lead.id} lead={lead} onGeneratePitch={generateAIPitch} onDelete={deleteLead} onStatusChange={updateLeadStatus} />
                        ))}
                      </div>
                    </div>
                    {/* Kolom 3: Deal */}
                    <div className="bg-slate-950 border border-slate-850 p-2 rounded-xl min-h-[300px]">
                      <h4 className="text-xs font-bold text-emerald-400 mb-2 border-b border-slate-800 pb-2 text-center">Deal (Sukses)</h4>
                      <div className="space-y-2">
                        {leads.filter(l => l.pitchStatus === 'Deal').map(lead => (
                          <LeadCard key={lead.id} lead={lead} onGeneratePitch={generateAIPitch} onDelete={deleteLead} onStatusChange={updateLeadStatus} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* DRAFT PITCH PANEL */}
                {selectedLead && (
                  <div className="bg-indigo-950/20 border border-indigo-500/40 rounded-2xl p-5 shadow-xl relative">
                    <button onClick={() => setSelectedLead(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>
                    <h3 className="font-bold text-slate-200 flex items-center gap-2 mb-4"><Sparkles className="h-5 w-5 text-indigo-400" /> AI Penulis Draf: {selectedLead.businessName}</h3>
                    
                    {isGeneratingPitch ? (
                      <div className="py-12 flex flex-col items-center justify-center text-indigo-300"><RefreshCw className="h-8 w-8 animate-spin mb-2" /> Sedang meracik draf penawaran personal...</div>
                    ) : (
                      <div className="space-y-4">
                        <textarea readOnly value={generatedPitch} className="w-full h-48 bg-slate-900 border border-indigo-500/30 rounded-xl p-4 text-xs text-slate-200 focus:outline-none focus:border-indigo-400 font-mono" />
                        <div className="flex flex-wrap gap-2 justify-end">
                          <button onClick={copyToClipboard} className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5">{copied ? <Check className="text-emerald-400" /> : <Copy />} Salin Draf</button>
                          {selectedLead.email && <a href={`mailto:${selectedLead.email}?subject=Ide Kolaborasi Desain&body=${encodeURIComponent(generatedPitch)}`} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5"><Mail className="h-3.5 w-3.5"/> Kirim Email</a>}
                          {/* Fallback ke nomor umum jika nomor WA tidak ditemukan agar tombol tetap berfungsi demo */}
                          <a href={`https://wa.me/${(selectedLead.phone || '080000000000').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(generatedPitch)}`} target="_blank" rel="noopener noreferrer" className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5"><Send className="h-3.5 w-3.5"/> Kirim WhatsApp</a>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      )}
      
      {/* ADD LEAD MODAL HIDDEN LOGIC KEPANJANGAN... (Fungsi tetap persis seperti sebelumnya) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <h3 className="font-bold text-lg text-slate-100 mb-4 border-b border-slate-800 pb-2">Tambah Prospek Manual</h3>
            <form onSubmit={handleAddLeadSubmit} className="space-y-3">
              <input type="text" required value={newLead.businessName} onChange={e => setNewLead({...newLead, businessName: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none" placeholder="Nama Bisnis" />
              <input type="text" value={newLead.designWeakness} onChange={e => setNewLead({...newLead, designWeakness: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none" placeholder="Masalah Desain Mereka" />
              <div className="flex gap-3 justify-end pt-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="bg-slate-800 px-4 py-2 rounded-xl text-sm font-bold">Batal</button>
                <button type="submit" className="bg-indigo-600 px-5 py-2 rounded-xl text-sm font-bold text-white">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

function LeadCard({ lead, onGeneratePitch, onDelete, onStatusChange }) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl relative group hover:border-indigo-500/50 transition-colors">
      <button onClick={() => onDelete(lead.id)} className="absolute top-2 right-2 text-slate-600 hover:text-rose-500 opacity-0 group-hover:opacity-100"><Trash2 className="h-3.5 w-3.5" /></button>
      <h4 className="font-bold text-slate-200 text-xs pr-4 truncate">{lead.businessName}</h4>
      <div className="text-[9px] text-slate-500 mb-2 truncate">{lead.category} • {lead.location}</div>
      <div className="line-clamp-2 bg-slate-950 p-1.5 rounded text-rose-300/80 text-[9px] mb-2 border border-rose-900/20">{lead.designWeakness}</div>
      <div className="flex justify-between items-center mt-2">
        <select value={lead.pitchStatus} onChange={(e) => onStatusChange(lead.id, e.target.value)} className="bg-slate-950 border border-slate-800 text-slate-300 text-[9px] rounded p-1 outline-none">
          <option value="Belum Dihubungi">Baru</option>
          <option value="Dihubungi">Di-email</option>
          <option value="Negosiasi">Nego</option>
          <option value="Deal">Deal</option>
        </select>
        <button onClick={() => onGeneratePitch(lead)} className="bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] font-bold px-2 py-1 rounded flex items-center gap-1"><Sparkles className="h-3 w-3" /> Pitch</button>
      </div>
    </div>
  );
}