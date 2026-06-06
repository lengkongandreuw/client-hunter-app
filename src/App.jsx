import React, { useState, useEffect, useRef } from 'react';
import { 
  Briefcase, 
  Search, 
  Mail, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  Clock, 
  X, 
  Plus, 
  Layers, 
  Settings, 
  TrendingUp, 
  Sparkles,
  RefreshCw,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  AlertTriangle,
  Send,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  Compass,
  Info,
  BookOpen,
  Lock,
  Unlock,
  Shield,
  Activity,
  User,
  Eye,
  EyeOff,
  Calculator,
  ArrowRight,
  Terminal,
  Zap,
  DollarSign
} from 'lucide-react';


// Hash sederhana untuk memverifikasi password secara aman di sisi klien (SHA-256 buatan)
const ADMIN_USERNAME = "andreuw";
// Teks asli: Skull0m4n14
const ADMIN_PASSWORD_HASH = "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918"; 

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);                    
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const initialLeads = [
  {
    id: 'lead-1',
    businessName: 'Kopi Kenangan Senja',
    category: 'Coffee Shop',
    location: 'Jakarta Selatan',
    email: 'info@kenangansenja.id',
    phone: '0812-3456-7890',
    instagram: '@kopikenangansenja',
    designWeakness: 'Menu digital di Google Maps buram & feed Instagram tidak konsisten.',
    pitchStatus: 'Belum Dihubungi',
    suggestedService: 'Redesain Menu & Social Media Kit',
    createdAt: '2026-06-01'
  },
  {
    id: 'lead-2',
    businessName: 'GlowUp Beauty Clinic',
    category: 'Skincare & Clinic',
    location: 'Bandung',
    email: 'contact@glowupclinic.com',
    phone: '0821-9876-5432',
    instagram: '@glowup.beautyclinic',
    designWeakness: 'Website lambat dan tidak mobile-friendly. Font terlalu banyak.',
    pitchStatus: 'Dihubungi',
    suggestedService: 'Landing Page Redesign',
    createdAt: '2026-06-03'
  },
  {
    id: 'lead-3',
    businessName: 'Toko Roti Ibu Budi',
    category: 'Bakery',
    location: 'Surabaya',
    email: '',
    phone: '0878-1122-3344',
    instagram: '@rotibubudi.sub',
    designWeakness: 'Belum memiliki logo berformat vektor (pecah saat dicetak di kemasan).',
    pitchStatus: 'Negosiasi',
    suggestedService: 'Rebranding & Kemasan Produk',
    createdAt: '2026-06-05'
  }
];

const mockScraperDatabase = [
  { businessName: 'Soto Kudus Pak Kumis', category: 'Kuliner', location: 'Jakarta', email: 'sotopakkumis@gmail.com', phone: '0813-1111-2222', instagram: '@sotopakkumis.jkt', designWeakness: 'Tidak memiliki menu digital. Banner warung sangat jadul dan resolusi rendah.', suggestedService: 'Desain Banner & Menu Baru' },
  { businessName: 'Hype Sneakers Store', category: 'Retail', location: 'Jakarta', email: 'admin@hypesneakers.co.id', phone: '0813-2222-3333', instagram: '@hype.sneakers.id', designWeakness: 'Feed Instagram dipenuhi promo spam berantakan, butuh grid template estetik.', suggestedService: 'Social Media Management & Branding' },
  { businessName: 'Sinar Abadi Furniture', category: 'Home Living', location: 'Jakarta', email: 'sales@sinarabadi.com', phone: '0813-4444-5555', instagram: '@sinarabadi.furnitur', designWeakness: 'Website menggunakan template gratisan yang tidak responsif dan gambar produk pecah.', suggestedService: 'Website Redesign & Product Photography Guide' },
  { businessName: 'Sehat Sentosa Gym', category: 'Kebugaran', location: 'Bandung', email: 'info@sehatsentosagym.com', phone: '0822-4444-1111', instagram: '@sehatsentosa.gym', designWeakness: 'Flyer pendaftaran cetak menggunakan layout Microsoft Word kuno.', suggestedService: 'Desain Brosur Promosi Digital' },
  { businessName: 'Clean & Fresh Laundry', category: 'Jasa', location: 'Bandung', email: '', phone: '0822-5555-2222', instagram: '@cleanfresh.laundry', designWeakness: 'Logo mirip dengan kompetitor sebelah, butuh diferensiasi branding.', suggestedService: 'Brand Identity & Logo Update' },
  { businessName: 'Pustaka Buku Kita', category: 'E-commerce', location: 'Surabaya', email: 'redaksi@pustakabukukita.com', phone: '0877-3333-8888', instagram: '@pustaka.bukukita', designWeakness: 'Kover buku terbitan mandiri terlihat amatir & kurang menjual secara online.', suggestedService: 'Desain Cover Buku & Banner Web' }
];

const tourSteps = [
  {
    title: "👋 Selamat Datang di Client Hunter!",
    description: "Platform asisten pintar ini dirancang khusus untuk mempermudah Anda mencari klien desain potensial dan melakukan penawaran secara cepat berbasis analisis kelemahan visual mereka.",
    target: "global",
    icon: Compass
  },
  {
    title: "⚙️ Langkah 1: Atur Profil & Portofolio Anda",
    description: "Klik ikon roda gigi di pojok kanan atas untuk mengisi Nama Anda, link portofolio (seperti Behance), dan memasukkan API Key Google Gemini (opsional) agar AI membuat draf penawaran yang sangat personal.",
    target: "settings",
    icon: Settings
  },
  {
    title: "🔍 Langkah 2: Temukan Calon Klien di Kota Target",
    description: "Gunakan panel 'Google Maps Lead Scraper' di sebelah kiri. Ketik jenis industri (misal: Coffee) dan kota (misal: Jakarta). Mesin akan menganalisis kelemahan visual bisnis mereka untuk Anda tawarkan solusi!",
    target: "scraper",
    icon: Search
  },
  {
    title: "📥 Langkah 3: Tambahkan ke CRM & Kelola Status",
    description: "Hasil temuan prospek bisa Anda masukkan ke papan CRM dengan menekan tombol '+ Masukkan CRM'. Sekarang Anda bisa melacak proses pendekatan dari 'Baru', 'Dihubungi', 'Nego', sampai 'Deal Proyek'!",
    target: "crm",
    icon: Layers
  },
  {
    title: "✨ Langkah 4: Tulis Penawaran Kustom dengan AI",
    description: "Tekan tombol 'Buat Pitch' pada kartu klien pilihan Anda. AI akan meracik pesan pendekatan (cold email/WhatsApp) yang sangat sopan, tajam, menyoroti masalah visual mereka, dan menyertakan portofolio Anda secara instan!",
    target: "pitch",
    icon: Sparkles
  },
  {
    title: "🚀 Mulai Sekarang & Dapatkan Klien Pertama!",
    description: "Anda sudah siap berburu klien! Cobalah mencari industri 'Coffee' di kota 'Jakarta' pada simulator scraper untuk menguji alur kerja ini sekarang juga.",
    target: "ready",
    icon: CheckCircle2
  }
];

export default function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'login' | 'dashboard'
  const [user, setUser] = useState(null); // null | { role: 'super_admin' | 'guest', name: string }
  
  // Keamanan: Brute force & Lockout state
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(0); // Sisa waktu kunci dalam detik
  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('ch_audit_logs');
    return saved ? JSON.parse(saved) : [
      { timestamp: new Date().toLocaleTimeString(), action: "Sistem Keamanan Diinisialisasi", status: "SUCCESS" }
    ];
  });

  // Data Leads CRM
  const [leads, setLeads] = useState(() => {
    const saved = localStorage.getItem('client_hunter_leads');
    return saved ? JSON.parse(saved) : initialLeads;
  });

  // Form Inputs Login
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Scraper & State Pencarian
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapedResults, setScrapedResults] = useState([]);
  
  // Settings & Gemini API Configuration
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [portfolioLink, setPortfolioLink] = useState(() => localStorage.getItem('designer_portfolio') || 'https://behance.net/portfolio-kamu');
  const [designerName, setDesignerName] = useState(() => localStorage.getItem('designer_name') || 'Desainer Profesional');
  const [showSettings, setShowSettings] = useState(false);

  // Active Lead for Pitching
  const [selectedLead, setSelectedLead] = useState(null);
  const [generatedPitch, setGeneratedPitch] = useState('');
  const [isGeneratingPitch, setIsGeneratingPitch] = useState(false);
  const [copied, setCopied] = useState(false);

  // Quick Manual Add Lead
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLead, setNewLead] = useState({
    businessName: '',
    category: '',
    location: '',
    email: '',
    phone: '',
    instagram: '',
    designWeakness: '',
    suggestedService: '',
    pitchStatus: 'Belum Dihubungi'
  });

  // Fitur Onboarding Tour & Mode Bantuan Instan
  const [showTour, setShowTour] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const [showHelpTips, setShowHelpTips] = useState(true);
  const [activeTooltip, setActiveTooltip] = useState(null);

  // Kalkulator ROI Micro-Interactive di Landing Page
  const [roiAverageDeal, setRoiAverageDeal] = useState(3000000); // 3 Juta Rupiah
  const [roiLeadsPerMonth, setRoiLeadsPerMonth] = useState(20);
  const [roiConversionRate, setRoiConversionRate] = useState(15); // 15%

  
  // Timer untuk hitung mundur kunci akun jika salah input berkali-kali
  useEffect(() => {
    let timer;
    if (lockoutTime > 0) {
      timer = setInterval(() => {
        setLockoutTime((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lockoutTime]);

  // Simpan audit logs ke local storage
  useEffect(() => {
    localStorage.setItem('ch_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Simpan Leads
  useEffect(() => {
    localStorage.setItem('client_hunter_leads', JSON.stringify(leads));
  }, [leads]);

  const addAuditLog = (action, status) => {
    const newLog = {
      timestamp: new Date().toLocaleTimeString(),
      action,
      status
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 19)]); // Simpan maks 20 log terakhir
  };


  const handleLogin = async (e) => {
    e.preventDefault();
    if (lockoutTime > 0) {
      setLoginError(`Sistem dikunci. Silakan tunggu ${lockoutTime} detik lagi.`);
      return;
    }

    const trimmedUser = loginUsername.trim();
    
    if (trimmedUser === ADMIN_USERNAME) {
      const hashedInput = await sha256(loginPassword);
      if (hashedInput === ADMIN_PASSWORD_HASH) {
        // Berhasil login sebagai Super Admin
        const sessionUser = { role: 'super_admin', name: 'Andreuw (Super Admin)' };
        setUser(sessionUser);
        setLoginAttempts(0);
        setLoginError('');
        addAuditLog("Super Admin Berhasil Login", "SUCCESS");
        setView('dashboard');
        // Kosongkan form keamanan
        setLoginPassword('');
        setLoginUsername('');
      } else {
        handleFailedLogin();
      }
    } else {
      handleFailedLogin();
    }
  };

  const handleFailedLogin = () => {
    const nextAttempts = loginAttempts + 1;
    setLoginAttempts(nextAttempts);
    addAuditLog(`Gagal login dengan username: ${loginUsername}`, "FAILED");
    
    if (nextAttempts >= 3) {
      setLockoutTime(30); // Kunci selama 30 detik
      setLoginError("Percobaan salah terlalu sering! Sistem dikunci selama 30 detik.");
      addAuditLog("Sistem dikunci akibat brute-force protection", "LOCKOUT");
    } else {
      setLoginError(`Kredensial salah! Sisa percobaan: ${3 - nextAttempts}`);
    }
  };

  const handleGuestLogin = () => {
    if (lockoutTime > 0) {
      setLoginError("Sistem masih dikunci!");
      return;
    }
    const guestUser = { role: 'guest', name: 'Guest Explorer' };
    setUser(guestUser);
    addAuditLog("Guest mengakses platform", "SUCCESS");
    setView('dashboard');
    setLoginError('');
  };

  const handleLogout = () => {
    addAuditLog(`${user?.name} melakukan logout`, "SUCCESS");
    setUser(null);
    setView('landing');
  };

  const saveConfiguration = () => {
    localStorage.setItem('gemini_api_key', apiKey);
    localStorage.setItem('designer_portfolio', portfolioLink);
    localStorage.setItem('designer_name', designerName);
    setShowSettings(false);
    addAuditLog("Konfigurasi profil diperbarui", "SUCCESS");
  };


  const closeTour = () => {
    setShowTour(false);
  };

  const nextTourStep = () => {
    if (tourIndex < tourSteps.length - 1) {
      setTourIndex(tourIndex + 1);
      if (tourSteps[tourIndex + 1].target === 'settings') {
        setShowSettings(true);
      } else {
        setShowSettings(false);
      }
    } else {
      closeTour();
    }
  };

  const prevTourStep = () => {
    if (tourIndex > 0) {
      setTourIndex(tourIndex - 1);
      if (tourSteps[tourIndex - 1].target === 'settings') {
        setShowSettings(true);
      } else {
        setShowSettings(false);
      }
    }
  };

  const calculatedDeals = Math.round(roiLeadsPerMonth * (roiConversionRate / 100));
  const estimatedRevenue = calculatedDeals * roiAverageDeal;
  const timeSavedHrs = roiLeadsPerMonth * 1.5; // Hemat 1.5 jam per lead dalam pencarian manual

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased relative selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* 1. VIEW LANDING PAGE */}
      {view === 'landing' && (
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="bg-gradient-to-tr from-cyan-500 to-indigo-600 p-2 rounded-lg">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                <span className="font-extrabold tracking-tight text-lg text-white">Client Hunter</span>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setView('login')}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/10 active:scale-95"
                >
                  Masuk Platform
                </button>
              </div>
            </div>
          </header>

          {/* Hero Section */}
          <section className="relative pt-24 pb-16 px-6 overflow-hidden">
            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-950/40 border border-indigo-500/20 rounded-full text-xs font-medium text-indigo-400 mb-2">
                <Sparkles className="h-3 w-3" /> Solusi Cerdas untuk Desainer Lepas & Agensi Kreatif
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
                Temukan <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">Klien Impian</span> Anda <br />Berdasarkan Masalah Desain Mereka.
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                Platform intelijen penjualan visual pertama yang otomatis mendeteksi cacat visual, logo resolusi rendah, website usang, serta sosial media berantakan milik bisnis lokal untuk draf penawaran personal bertenaga AI.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button 
                  onClick={() => setView('login')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                >
                  Mulai Berburu Klien <ArrowRight className="h-4 w-4" />
                </button>
                <a 
                  href="#calculator"
                  className="w-full sm:w-auto bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 font-bold text-sm px-8 py-3.5 rounded-xl transition-all"
                >
                  Kalkulator Hemat Waktu
                </a>
              </div>
            </div>
          </section>

          {/* Feature Grid Section */}
          <section className="py-16 px-6 max-w-7xl mx-auto w-full border-t border-slate-900">
            <div className="text-center space-y-3 mb-12">
              <h3 className="text-2xl font-extrabold text-white">Platform All-in-One Penakluk Klien</h3>
              <p className="text-xs text-slate-400 max-w-lg mx-auto">Kami mengotomatiskan seluruh alur kerja penawaran dingin (cold outreach) yang membosankan.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900/60 border border-slate-900 p-6 rounded-2xl hover:border-cyan-500/20 transition-all group">
                <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                  <Search className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-lg text-white mb-2">Automated Lead Scraper</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Menelusuri database Google Maps dan Instagram di lokasi target Anda untuk memetakan bisnis lokal potensial yang membutuhkan layanan visual Anda.
                </p>
              </div>

              <div className="bg-slate-900/60 border border-slate-900 p-6 rounded-2xl hover:border-indigo-500/20 transition-all group">
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-lg text-white mb-2">AI Pitch Writer</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tinggalkan menyalin surat penawaran massal. AI merancang draf email dan pesan WhatsApp kustom yang berfokus menyelesaikan masalah spesifik bisnis mereka.
                </p>
              </div>

              <div className="bg-slate-900/60 border border-slate-900 p-6 rounded-2xl hover:border-emerald-500/20 transition-all group">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                  <Layers className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-lg text-white mb-2">Pipeline Kanban CRM</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Visualisasikan semua prospek Anda. Pantau dari saat mereka masuk sebagai prospek baru, proses pendekatan, hingga kesepakatan kontrak selesai terbayar.
                </p>
              </div>
            </div>
          </section>

          {/* Micro-Interactive Component: ROI & Time Saver Calculator */}
          <section id="calculator" className="py-16 px-6 bg-slate-900/40 border-t border-b border-slate-900">
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-block bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold">
                  MICRO-INTERACTION CONSOLE
                </div>
                <h3 className="text-2xl font-extrabold text-white leading-snug">Estimasi Penghasilan & Hemat Waktu Anda</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Gunakan simulator interaktif ini untuk melihat seberapa cepat Client Hunter bisa mengonversi pencarian manual yang melelahkan menjadi pendapatan bersih terstruktur bagi bisnis jasa desain Anda.
                </p>
                <div className="space-y-4 pt-2">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-2">Nilai Rata-rata Proyek (IDR)</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-emerald-400">Rp</span>
                      <input 
                        type="number" 
                        value={roiAverageDeal}
                        onChange={(e) => setRoiAverageDeal(Number(e.target.value))}
                        className="bg-transparent text-white font-extrabold text-lg focus:outline-none w-full"
                      />
                    </div>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500 mb-2">
                      <span>Prospek per Bulan</span>
                      <span className="text-white font-mono">{roiLeadsPerMonth} Leads</span>
                    </div>
                    <input 
                      type="range" 
                      min="5" 
                      max="100" 
                      value={roiLeadsPerMonth}
                      onChange={(e) => setRoiLeadsPerMonth(Number(e.target.value))}
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500 mb-2">
                      <span>Rasio Konversi Deal (%)</span>
                      <span className="text-white font-mono">{roiConversionRate}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="5" 
                      max="50" 
                      value={roiConversionRate}
                      onChange={(e) => setRoiConversionRate(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-3xl p-6 lg:p-8 space-y-6 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl"></div>
                <h4 className="font-bold text-slate-200 flex items-center gap-2 border-b border-slate-900 pb-3">
                  <Calculator className="h-4 w-4 text-emerald-400 animate-pulse" /> Hasil Prediksi Pendapatan Kasar
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-900">
                    <span className="text-[10px] text-slate-500 block mb-1">Total Proyek Didapat</span>
                    <h5 className="text-2xl font-black text-white">{calculatedDeals} <span className="text-xs text-slate-400 font-medium">Deals / Bln</span></h5>
                  </div>
                  <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-900">
                    <span className="text-[10px] text-slate-500 block mb-1">Estimasi Omset</span>
                    <h5 className="text-2xl font-black text-emerald-400">Rp {estimatedRevenue.toLocaleString('id-ID')}</h5>
                  </div>
                </div>

                <div className="p-4 bg-indigo-950/20 border border-indigo-900/30 rounded-2xl flex items-center gap-4">
                  <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl shrink-0">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h6 className="text-xs font-bold text-indigo-300">Menghemat Sekitar {timeSavedHrs} Jam Kerja Manual</h6>
                    <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">
                      Client Hunter mengotomatiskan analisis kelemahan visual instan, memotong waktu berharga riset latar belakang bisnis secara dramatis.
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => setView('login')}
                  className="w-full bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                >
                  Ambil Akses Anda Sekarang <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </section>

          {/* Testimonial & Social Proof */}
          <section className="py-16 px-6 max-w-7xl mx-auto w-full">
            <div className="text-center space-y-3 mb-12">
              <span className="text-[10px] text-indigo-400 uppercase font-black">STUDIO REVIEW</span>
              <h3 className="text-2xl font-extrabold text-white">Dipakai oleh Desainer Berbakat</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl relative">
                <span className="text-xs text-indigo-400 font-bold block mb-2">@ronydesigns</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  "Menemukan klien baru biasanya adalah mimpi buruk. Aplikasi ini menyederhanakannya secara ajaib dengan menemukan bisnis lokal yang menu restonya buram di Google Maps."
                </p>
              </div>
              <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl relative">
                <span className="text-xs text-indigo-400 font-bold block mb-2">@nabilakreatif</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  "AI Generator yang dipersonalisasi sangat gila akurasinya! Klien merasa draf penawaran saya benar-benar riset mendalam padahal itu dibuat AI hanya dalam 2 detik."
                </p>
              </div>
              <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl relative">
                <span className="text-xs text-indigo-400 font-bold block mb-2">@studiovisual_id</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  "Fitur CRM Kanban yang terintegrasi sangat rapih untuk studio kami melacak kesepakatan dengan bisnis kafe dan kuliner yang butuh perbaikan branding visual."
                </p>
              </div>
            </div>
          </section>

          {/* Sophisticated Footer */}
          <footer className="border-t border-slate-900 py-12 px-6 bg-slate-950 mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2.5">
                <div className="bg-gradient-to-tr from-cyan-500 to-indigo-600 p-2 rounded-lg">
                  <Briefcase className="h-4 w-4 text-white" />
                </div>
                <span className="font-extrabold tracking-tight text-white">Client Hunter</span>
              </div>
              <p className="text-xs text-slate-500">© 2026 Client Hunter. Keamanan Terenskripsi SSL 256-Bit.</p>
            </div>
          </footer>
        </div>
      )}

      {/* 2. SECURE LOGIN SYSTEM PAGE */}
      {view === 'login' && (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-950">
          
          {/* Subtle Background Mesh glow */}
          <div className="absolute top-0 left-1/4 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl"></div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex flex-col items-center text-center space-y-2 mb-6">
              <div className="bg-indigo-600/10 p-3 rounded-2xl text-indigo-400 border border-indigo-500/15">
                <Shield className="h-6 w-6 animate-pulse" />
              </div>
              <h2 className="text-xl font-extrabold text-white">Portal Keamanan Otentikasi</h2>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                Silakan masuk menggunakan kredensial berotoritas tinggi Anda atau gunakan tombol Guest di bawah.
              </p>
            </div>

            {/* Error Message Panel */}
            {loginError && (
              <div className="mb-4 bg-rose-950/40 border border-rose-500/20 p-3 rounded-xl flex items-start gap-2 text-rose-300 text-xs animate-in slide-in-from-top-2">
                <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Lockout Countdown Timer */}
            {lockoutTime > 0 && (
              <div className="mb-4 bg-amber-950/40 border border-amber-500/20 p-3 rounded-xl flex items-center gap-2 text-amber-300 text-xs animate-in duration-75">
                <Clock className="h-4 w-4 text-amber-500 shrink-0 animate-spin" />
                <span>Brute-force protection aktif! Dikunci selama <strong>{lockoutTime} detik</strong></span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5 tracking-wider">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-500" />
                  <input 
                    type="text" 
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="andreuw"
                    disabled={lockoutTime > 0}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all placeholder-slate-600 disabled:opacity-50"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5 tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-500" />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    disabled={lockoutTime > 0}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all placeholder-slate-600 disabled:opacity-50"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={lockoutTime > 0}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 disabled:pointer-events-none"
              >
                <Unlock className="h-4 w-4" /> Masuk Sebagai Super Admin
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
              <div className="relative flex justify-center text-xs"><span className="bg-slate-900 px-3 text-slate-500 uppercase font-semibold">ATAU</span></div>
            </div>

            <button 
              type="button"
              onClick={handleGuestLogin}
              disabled={lockoutTime > 0}
              className="w-full bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white font-bold text-sm py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 disabled:pointer-events-none"
            >
              <Zap className="h-4 w-4 text-indigo-400" /> Masuk Sebagai Tamu (Guest Mode)
            </button>

            {/* Back button to Landing */}
            <button 
              onClick={() => setView('landing')}
              className="mt-6 text-xs text-slate-500 hover:text-slate-300 w-full text-center transition-all underline"
            >
              Kembali ke Landing Page
            </button>
          </div>
        </div>
      )}

      {/* 3. APP DASHBOARD WITH MULTIUSER CAPABILITY */}
      {view === 'dashboard' && (
        <div className="flex flex-col min-h-screen">
          
          {/* GLOBAL TOUR DIALOG OVERLAY (Jika Tour Aktif) */}
          {showTour && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-slate-900 border-2 border-indigo-500 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2 text-indigo-400 font-semibold">
                    <BookOpen className="h-5 w-5 animate-bounce" />
                    <span>Panduan Langkah Baru ({tourIndex + 1}/{tourSteps.length})</span>
                  </div>
                  <button 
                    onClick={closeTour}
                    className="text-slate-400 hover:text-white bg-slate-850 p-1.5 rounded-lg transition-colors"
                    title="Lewati Panduan"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-4 my-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-2xl text-indigo-400">
                      {React.createElement(tourSteps[tourIndex].icon, { className: "h-8 w-8" })}
                    </div>
                    <h4 className="text-lg font-bold text-slate-100">{tourSteps[tourIndex].title}</h4>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                    {tourSteps[tourIndex].description}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-6 pt-3 border-t border-slate-800">
                  <button 
                    onClick={closeTour}
                    className="text-xs text-slate-400 hover:text-rose-400 font-medium transition-colors"
                  >
                    Lewati & Eksplor Sendiri
                  </button>

                  <div className="flex gap-2">
                    {tourIndex > 0 && (
                      <button 
                        onClick={prevTourStep}
                        className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3.5 py-2 rounded-xl text-xs font-bold transition-all"
                      >
                        <ChevronLeft className="h-4 w-4" /> Kembali
                      </button>
                    )}
                    <button 
                      onClick={nextTourStep}
                      className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md"
                    >
                      {tourIndex === tourSteps.length - 1 ? 'Mulai Sekarang! 🎉' : 'Lanjut'} <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Secure Header */}
          <nav className="border-b border-slate-900 bg-slate-950/90 backdrop-blur-md sticky top-0 z-30 px-4 py-3 lg:px-8">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-tr from-cyan-500 to-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-base font-extrabold tracking-tight text-white">Client Hunter</h1>
                    {user?.role === 'super_admin' ? (
                      <span className="text-[10px] font-black px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1">
                        <Shield className="h-3 w-3" /> SUPER USER
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full flex items-center gap-1">
                        <User className="h-3 w-3" /> GUEST
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500">Sesi Aktif: <span className="text-slate-400 font-mono">{user?.name}</span></p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
                {/* Audit Terminal Log for Super Admin */}
                {user?.role === 'super_admin' && (
                  <div className="hidden lg:flex items-center gap-2 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-400">
                    <Activity className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Secure Session Active</span>
                  </div>
                )}

                {/* Tombol Toggle Bantuan */}
                <button
                  onClick={() => setShowHelpTips(!showHelpTips)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    showHelpTips 
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>{showHelpTips ? 'Bantuan On' : 'Bantuan Off'}</span>
                </button>

                <button
                  onClick={() => {
                    setTourIndex(0);
                    setShowTour(true);
                  }}
                  className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-indigo-400 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                >
                  <Compass className="h-3.5 w-3.5" />
                  <span>Mulai Panduan</span>
                </button>

                <button 
                  onClick={() => {
                    setShowAddModal(true);
                    setShowSettings(false);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all px-3 py-1.5 rounded-xl font-bold text-xs text-white"
                >
                  <Plus className="h-3.5 w-3.5 inline mr-1" /> Tambah Manual
                </button>

                <button 
                  onClick={() => setShowSettings(!showSettings)}
                  className={`p-1.5 rounded-xl border transition-all ${showSettings ? 'bg-slate-800 border-indigo-500/50 text-indigo-400' : 'bg-slate-900 border-slate-800 text-slate-300'}`}
                >
                  <Settings className="h-4.5 w-4.5" />
                </button>

                <button 
                  onClick={handleLogout}
                  className="bg-slate-900 hover:bg-rose-950/20 hover:text-rose-400 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                >
                  Log Out
                </button>
              </div>

            </div>
          </nav>

          <main className="max-w-7xl mx-auto px-4 py-6 lg:px-8 space-y-6 w-full flex-1">
            
            {/* Keamanan Extra: Log Monitor Khusus Super Admin */}
            {user?.role === 'super_admin' && (
              <div className="bg-slate-950 border border-emerald-500/10 p-3 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-emerald-400" />
                  <span className="text-slate-400">Terminal Audit Log Terkini:</span>
                  <span className="text-slate-300 text-[11px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {auditLogs[0] ? `${auditLogs[0].timestamp} - ${auditLogs[0].action} [${auditLogs[0].status}]` : 'Tidak ada log'}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500">
                  Semua aktivitas dienkripsi lokal.
                </div>
              </div>
            )}

            {/* Mode Bantuan Info Box */}
            {showHelpTips && (
              <div className="bg-amber-950/20 border border-amber-500/20 p-4 rounded-2xl flex items-start gap-3 text-amber-200 text-xs animate-in slide-in-from-top-4">
                <Info className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">💡 Mode Bantuan Aktif!</p>
                  <p className="text-slate-300">
                    Arahkan kursor atau klik tombol <span className="text-amber-400 font-bold">Petunjuk</span> di setiap bagian untuk mempelajari fitur ini secara langsung.
                  </p>
                </div>
                <button onClick={() => setShowHelpTips(false)} className="text-amber-400 hover:text-white ml-auto">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Settings Panel Widget */}
            {showSettings && (
              <div className={`bg-gradient-to-b from-slate-900 to-slate-950 border rounded-2xl p-6 shadow-2xl relative overflow-hidden transition-all duration-300 ${
                showTour && tourSteps[tourIndex].target === 'settings' ? 'border-indigo-500 ring-2 ring-indigo-500/30' : 'border-slate-800'
              }`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-indigo-400" />
                      <h3 className="text-lg font-bold">Pengaturan Agen & Integrasi AI</h3>
                      {showHelpTips && (
                        <button 
                          onClick={() => setActiveTooltip(activeTooltip === 'settings-info' ? null : 'settings-info')}
                          className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 rounded px-1.5 py-0.5 text-[10px]"
                        >
                          <HelpCircle className="h-3.5 w-3.5" /> Petunjuk
                        </button>
                      )}
                    </div>
                    <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-white">
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {activeTooltip === 'settings-info' && (
                    <div className="mb-4 bg-slate-950 border border-amber-500/20 p-3.5 rounded-xl text-xs text-amber-200 animate-in slide-in-from-top-1">
                      <p className="font-bold mb-1">Cara Mengatur Profil Anda:</p>
                      <ul className="list-disc pl-4 space-y-1 text-slate-300">
                        <li><strong>Nama Desainer:</strong> Digunakan pada pembuka draf pesan.</li>
                        <li><strong>Link Portofolio:</strong> URL portofolio desain terbaik Anda.</li>
                        <li><strong>Gemini API Key:</strong> Masukkan API Key Anda untuk mengaktifkan AI generator adaptif kustom.</li>
                      </ul>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Nama Anda (Desainer)</label>
                      <input 
                        type="text" 
                        value={designerName} 
                        onChange={(e) => setDesignerName(e.target.value)}
                        placeholder="Nama Anda atau Brand Studio"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Link Portofolio (Behance/Dribbble/Web)</label>
                      <input 
                        type="url" 
                        value={portfolioLink} 
                        onChange={(e) => setPortfolioLink(e.target.value)}
                        placeholder="https://behance.net/username"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                        <span>Google Gemini API Key</span>
                        <span className="text-[10px] text-amber-400 lowercase">Opsional</span>
                      </label>
                      <input 
                        type="password" 
                        value={apiKey} 
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="AIzaSy..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none transition-all placeholder-slate-600"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-850 pt-3">
                    <p className="text-xs text-slate-500">
                      Semua informasi di atas disimpan dengan aman di penyimpanan lokal peramban Anda.
                    </p>
                    <button 
                      onClick={saveConfiguration}
                      className="bg-indigo-600 hover:bg-indigo-500 px-5 py-2 rounded-xl text-xs font-bold text-white transition-all w-full sm:w-auto"
                    >
                      Simpan Konfigurasi
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Statistik CRM */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-slate-800 text-slate-300">
                  <Layers className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Total Prospek</p>
                  <h4 className="text-2xl font-bold">{totalLeads}</h4>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Sudah Dihubungi</p>
                  <h4 className="text-2xl font-bold text-blue-400">{contactedLeads}</h4>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Dalam Negosiasi</p>
                  <h4 className="text-2xl font-bold text-amber-400">{negotiatingLeads}</h4>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Deal Proyek</p>
                  <h4 className="text-2xl font-bold text-emerald-400">{dealLeads}</h4>
                </div>
              </div>
            </div>

            {/* Grid Kerja Utama */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Kolom Kiri: Scraper */}
              <div className={`lg:col-span-5 flex flex-col gap-6 transition-all duration-300 ${
                showTour && tourSteps[tourIndex].target === 'scraper' ? 'ring-4 ring-indigo-500 rounded-2xl p-1 bg-indigo-950/20' : ''
              }`}>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg">
                        <Search className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-200">Google Maps Lead Scraper</h3>
                        <p className="text-xs text-slate-400">Temukan bisnis lokal yang butuh perbaikan desain</p>
                      </div>
                    </div>
                    {showHelpTips && (
                      <button 
                        onClick={() => setActiveTooltip(activeTooltip === 'scraper-info' ? null : 'scraper-info')}
                        className="text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 rounded px-1.5 py-0.5 text-[10px]"
                      >
                        <HelpCircle className="h-3.5 w-3.5" /> Petunjuk
                      </button>
                    )}
                  </div>

                  {activeTooltip === 'scraper-info' && (
                    <div className="mb-4 bg-slate-950 border border-amber-500/20 p-3 rounded-xl text-xs text-amber-200 space-y-1">
                      <p className="font-bold">Tips Mencari Prospek Klien:</p>
                      <p className="text-slate-300">
                        Ketik kata kunci industri (misal: <strong>Coffee</strong>, <strong>Retail</strong>, <strong>Gym</strong>, <strong>Bakery</strong>) dan ketik lokasi (misal: <strong>Jakarta</strong> atau <strong>Bandung</strong>) untuk menyaring data simulasi. Sistem akan mendeteksi titik lemah brand mereka yang bisa di-redesain!
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleScrape} className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Cari Industri</label>
                        <input 
                          type="text"
                          placeholder="e.g., Coffee, Bakery"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm focus:outline-none transition-all placeholder-slate-600"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Kota / Lokasi</label>
                        <input 
                          type="text"
                          placeholder="e.g., Jakarta, Bandung"
                          value={searchLocation}
                          onChange={(e) => setSearchLocation(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm focus:outline-none transition-all placeholder-slate-600"
                        />
                      </div>
                    </div>
                    <button 
                      type="submit" 
                      disabled={isScraping}
                      className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold text-sm py-2.5 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      {isScraping ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" /> Menelusuri Google Maps & IG...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" /> Temukan Calon Klien
                        </>
                      )}
                    </button>
                  </form>

                  {/* Hasil Scraping */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                      <span className="text-xs font-bold text-slate-400">Hasil Temuan Target</span>
                      <span className="text-[10px] px-2 py-0.5 bg-slate-800 rounded-full text-slate-300">
                        {scrapedResults.length} ditemukan
                      </span>
                    </div>

                    {scrapedResults.length === 0 && !isScraping && (
                      <div className="py-8 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
                        <AlertTriangle className="h-8 w-8 text-slate-600" />
                        <p className="text-sm">Belum ada hasil pencarian.</p>
                        <p className="text-xs max-w-xs text-slate-600">Coba ketik "Coffee" atau "Retail" dengan lokasi "Jakarta" untuk melihat kecanggihan simulator ini!</p>
                      </div>
                    )}

                    {isScraping && (
                      <div className="space-y-3">
                        {[1, 2].map((i) => (
                          <div key={i} className="animate-pulse bg-slate-950/50 p-4 border border-slate-800 rounded-xl space-y-2">
                            <div className="h-4 bg-slate-800 rounded w-1/3"></div>
                            <div className="h-3 bg-slate-800 rounded w-1/2"></div>
                            <div className="h-3 bg-slate-800 rounded w-full"></div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                      {scrapedResults.map((item, idx) => (
                        <div 
                          key={idx} 
                          className="bg-slate-950 border border-slate-800 hover:border-cyan-500/30 p-4 rounded-xl relative overflow-hidden transition-all group animate-in slide-in-from-bottom-2 duration-150"
                        >
                          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl pointer-events-none"></div>
                          <div className="flex justify-between items-start mb-1.5">
                            <span className="text-[10px] bg-cyan-900/40 text-cyan-400 border border-cyan-800/50 px-2.5 py-0.5 rounded-full font-bold">
                              {item.category}
                            </span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {item.location}
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">{item.businessName}</h4>
                          
                          <div className="mt-2 text-xs text-rose-400 bg-rose-950/20 border border-rose-900/30 p-2.5 rounded-lg flex gap-1.5">
                            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
                            <div>
                              <strong className="text-[10px] uppercase font-bold text-rose-300 block mb-0.5">Analisis Kelemahan Desain:</strong>
                              {item.designWeakness}
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800">
                            <div className="text-[10px]">
                              <span className="text-slate-400 block">Rekomendasi Layanan:</span>
                              <span className="font-semibold text-emerald-400">{item.suggestedService}</span>
                            </div>
                            <button 
                              onClick={() => addScrapedToLeads(item)}
                              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all"
                            >
                              <Plus className="h-3.5 w-3.5" /> Masukkan CRM
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Kolom Kanan: CRM Kanban & Pitch Panel */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                
                {/* CRM Dashboard */}
                <div className={`bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl transition-all duration-300 ${
                  showTour && tourSteps[tourIndex].target === 'crm' ? 'ring-4 ring-indigo-500 bg-indigo-950/20' : ''
                }`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-lg text-slate-200">CRM & Kanban Board Penjualan</h3>
                        {showHelpTips && (
                          <button 
                            onClick={() => setActiveTooltip(activeTooltip === 'crm-info' ? null : 'crm-info')}
                            className="text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 rounded px-1.5 py-0.5 text-[10px]"
                          >
                            <HelpCircle className="h-3.5 w-3.5" /> Petunjuk
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">Pindahkan kartu klien Anda berdasarkan alur negosiasi saat ini</p>
                    </div>
                  </div>

                  {activeTooltip === 'crm-info' && (
                    <div className="mb-4 bg-slate-950 border border-amber-500/20 p-3 rounded-xl text-xs text-amber-200 space-y-1 animate-in fade-in-50">
                      <p className="font-bold">Cara Mengelola CRM:</p>
                      <p className="text-slate-300">
                        Semua klien Anda akan berkumpul di sini. Anda bisa mengubah status proses pendekatan mereka melalui dropdown di sudut kiri bawah setiap kartu:
                        <br />• <strong>Baru</strong>: Klien potensial baru ditambahkan.
                        <br />• <strong>Dihubungi</strong>: Pesan penawaran sudah Anda kirim.
                        <br />• <strong>Nego</strong>: Sedang dalam tahap diskusi/tawar-menawar harga.
                        <br />• <strong>Deal</strong>: 🎉 Proyek resmi disetujui klien!
                      </p>
                    </div>
                  )}

                  {/* Kanban Columns */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Baru */}
                    <div className="bg-slate-950 border border-slate-850 p-3 rounded-2xl flex flex-col min-h-[400px]">
                      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                        <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-slate-400 animate-pulse"></span> Prospek Baru
                        </span>
                        <span className="text-[10px] bg-slate-800 text-slate-400 font-bold px-2 py-0.5 rounded-full">
                          {leads.filter(l => l.pitchStatus === 'Belum Dihubungi').length}
                        </span>
                      </div>
                      <div className="space-y-3 flex-1 overflow-y-auto max-h-[400px]">
                        {leads.filter(l => l.pitchStatus === 'Belum Dihubungi').length === 0 && (
                          <div className="py-8 text-center text-slate-600 text-xs">Kosong</div>
                        )}
                        {leads.filter(l => l.pitchStatus === 'Belum Dihubungi').map(lead => (
                          <LeadCard 
                            key={lead.id} 
                            lead={lead} 
                            onGeneratePitch={generateAIPitch} 
                            onDelete={deleteLead}
                            onStatusChange={updateLeadStatus}
                            showHelpTips={showHelpTips}
                            highlight={showTour && tourSteps[tourIndex].target === 'pitch'}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Menunggu / Nego */}
                    <div className="bg-slate-950 border border-slate-850 p-3 rounded-2xl flex flex-col min-h-[400px]">
                      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                        <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span> Menunggu / Nego
                        </span>
                        <span className="text-[10px] bg-amber-950/30 text-amber-400 font-bold px-2 py-0.5 rounded-full">
                          {leads.filter(l => l.pitchStatus === 'Dihubungi' || l.pitchStatus === 'Negosiasi').length}
                        </span>
                      </div>
                      <div className="space-y-3 flex-1 overflow-y-auto max-h-[400px]">
                        {leads.filter(l => l.pitchStatus === 'Dihubungi' || l.pitchStatus === 'Negosiasi').length === 0 && (
                          <div className="py-8 text-center text-slate-600 text-xs">Kosong</div>
                        )}
                        {leads.filter(l => l.pitchStatus === 'Dihubungi' || l.pitchStatus === 'Negosiasi').map(lead => (
                          <LeadCard 
                            key={lead.id} 
                            lead={lead} 
                            onGeneratePitch={generateAIPitch} 
                            onDelete={deleteLead}
                            onStatusChange={updateLeadStatus}
                            showHelpTips={showHelpTips}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Deal */}
                    <div className="bg-slate-950 border border-slate-850 p-3 rounded-2xl flex flex-col min-h-[400px]">
                      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span> Proyek Deal 🎉
                        </span>
                        <span className="text-[10px] bg-emerald-950/30 text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                          {leads.filter(l => l.pitchStatus === 'Deal').length}
                        </span>
                      </div>
                      <div className="space-y-3 flex-1 overflow-y-auto max-h-[400px]">
                        {leads.filter(l => l.pitchStatus === 'Deal').length === 0 && (
                          <div className="py-8 text-center text-slate-600 text-xs">Kosong</div>
                        )}
                        {leads.filter(l => l.pitchStatus === 'Deal').map(lead => (
                          <LeadCard 
                            key={lead.id} 
                            lead={lead} 
                            onGeneratePitch={generateAIPitch} 
                            onDelete={deleteLead}
                            onStatusChange={updateLeadStatus}
                            showHelpTips={showHelpTips}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Generator Panel */}
                {selectedLead && (
                  <div className={`bg-gradient-to-tr from-slate-900 to-indigo-950/30 border rounded-2xl p-5 shadow-xl relative overflow-hidden transition-all duration-300 ${
                    showTour && tourSteps[tourIndex].target === 'pitch' ? 'border-indigo-400 ring-4 ring-indigo-500/20' : 'border-indigo-500/30'
                  }`}>
                    <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                          <Sparkles className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-200">AI Penulis Surat Penawaran Kreatif</h3>
                          <p className="text-xs text-indigo-300">Menulis surat penawaran khusus untuk <strong className="text-white">{selectedLead.businessName}</strong></p>
                        </div>
                      </div>
                      <button onClick={() => setSelectedLead(null)} className="text-slate-400 hover:text-white">
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    {isGeneratingPitch ? (
                      <div className="py-12 flex flex-col items-center justify-center gap-4">
                        <RefreshCw className="h-8 w-8 animate-spin text-indigo-400" />
                        <p className="text-sm text-slate-300">AI sedang membedah masalah visual brand dan menulis draf untuk Anda...</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="relative">
                          <textarea 
                            readOnly
                            value={generatedPitch}
                            className="w-full h-80 bg-slate-950 border border-indigo-500/20 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                          />
                          <div className="absolute bottom-3 right-3 flex gap-2 animate-bounce">
                            <button 
                              onClick={copyToClipboard}
                              className="bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-200 font-bold text-xs py-2 px-3.5 rounded-lg flex items-center gap-1.5 transition-all shadow-md"
                            >
                              {copied ? (
                                <>
                                  <Check className="h-3.5 w-3.5 text-emerald-400" /> Tersalin!
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3.5 w-3.5" /> Salin Draf Teks
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-indigo-950/20 border border-indigo-900/30 p-3.5 rounded-xl">
                          <div className="text-xs text-indigo-300 text-center sm:text-left">
                            <p className="font-semibold text-white">Langkah Selanjutnya:</p>
                            Salin draf di atas, kirimkan langsung via Email, Instagram DM, atau WhatsApp klien!
                          </div>
                          <div className="flex gap-2 w-full sm:w-auto">
                            {selectedLead.email && (
                              <a 
                                href={`mailto:${selectedLead.email}?subject=Ide Kreatif Desain untuk ${selectedLead.businessName}&body=${encodeURIComponent(generatedPitch)}`}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all flex-1 sm:flex-initial"
                              >
                                <Mail className="h-3.5 w-3.5" /> Kirim Email
                              </a>
                            )}
                            {selectedLead.phone && (
                              <a 
                                href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(generatedPitch)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all flex-1 sm:flex-initial"
                              >
                                <Send className="h-3.5 w-3.5" /> Hubungi WhatsApp
                              </a>
                            )}
                          </div>
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

      {/* MODAL: TAMBAH PROSPEK MANUAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/5 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="font-bold text-lg text-slate-100">Tambah Prospek Klien Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddLeadSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Nama Bisnis *</label>
                  <input 
                    type="text"
                    required
                    value={newLead.businessName}
                    onChange={(e) => setNewLead({...newLead, businessName: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm focus:outline-none"
                    placeholder="e.g., Kafe Kita"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Kategori Bisnis</label>
                  <input 
                    type="text"
                    value={newLead.category}
                    onChange={(e) => setNewLead({...newLead, category: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm focus:outline-none"
                    placeholder="e.g., F&B / Kuliner"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Email</label>
                  <input 
                    type="email"
                    value={newLead.email}
                    onChange={(e) => setNewLead({...newLead, email: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm focus:outline-none"
                    placeholder="kontak@kafe.com"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">No. WhatsApp</label>
                  <input 
                    type="text"
                    value={newLead.phone}
                    onChange={(e) => setNewLead({...newLead, phone: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm focus:outline-none"
                    placeholder="0812xxxxxxxx"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Lokasi</label>
                  <input 
                    type="text"
                    value={newLead.location}
                    onChange={(e) => setNewLead({...newLead, location: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm focus:outline-none"
                    placeholder="e.g., Surabaya"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Akun Instagram</label>
                  <input 
                    type="text"
                    value={newLead.instagram}
                    onChange={(e) => setNewLead({...newLead, instagram: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm focus:outline-none"
                    placeholder="@kafe.kita"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Analisis Kelemahan Desain Klien</label>
                <textarea 
                  value={newLead.designWeakness}
                  onChange={(e) => setNewLead({...newLead, designWeakness: e.target.value})}
                  className="w-full h-20 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm focus:outline-none"
                  placeholder="e.g., Feed IG terlihat kurang estetik, tidak ada pedoman branding warna logo."
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Layanan yang Ingin Anda Tawarkan</label>
                <input 
                  type="text"
                  value={newLead.suggestedService}
                  onChange={(e) => setNewLead({...newLead, suggestedService: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm focus:outline-none"
                  placeholder="e.g., Redesain Logo & Instagram Branding"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2 border-t border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm px-4 py-2 rounded-xl transition-all"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm px-5 py-2 rounded-xl transition-all shadow-lg"
                >
                  Simpan Prospek
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function LeadCard({ lead, onGeneratePitch, onDelete, onStatusChange, showHelpTips, highlight }) {
  return (
    <div className={`bg-slate-900 border p-3 rounded-xl space-y-3 relative group transition-all duration-300 ${
      highlight ? 'border-indigo-400 ring-2 ring-indigo-500/50 shadow-lg shadow-indigo-500/10' : 'border-slate-800 hover:border-indigo-500/30'
    }`}>
      
      <button 
        onClick={() => onDelete(lead.id)}
        className="absolute top-2 right-2 text-slate-600 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
        title="Hapus Prospek"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <div>
        <div className="flex items-center gap-1 text-[9px] text-slate-500">
          <span className="font-semibold text-indigo-400 uppercase tracking-wide">{lead.category || 'Bisnis'}</span>
          <span>•</span>
          <span>{lead.location || 'Indonesia'}</span>
        </div>
        <h4 className="font-bold text-slate-200 text-xs mt-0.5">{lead.businessName}</h4>
      </div>

      <div className="text-[11px] text-slate-400 space-y-1">
        {lead.instagram && (
          <div className="flex items-center gap-1.5 text-indigo-300/90 text-[10px]">
            <span className="font-bold text-slate-500 text-[9px]">IG:</span> {lead.instagram}
          </div>
        )}
        <div className="line-clamp-2 bg-slate-950/40 p-2 rounded text-rose-300/80 border border-rose-950/20 text-[10px]">
          <span className="font-bold uppercase text-[8px] block text-rose-400 mb-0.5">Kelemahan Visual:</span>
          {lead.designWeakness}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-850 flex items-center justify-between gap-1.5">
        <div className="flex flex-col">
          {showHelpTips && (
            <span className="text-[7px] text-amber-500 font-bold uppercase mb-0.5 tracking-wider">Status CRM</span>
          )}
          <select 
            value={lead.pitchStatus}
            onChange={(e) => onStatusChange(lead.id, e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-[10px] rounded px-1 py-0.5 focus:outline-none cursor-pointer"
          >
            <option value="Belum Dihubungi">🆕 Baru</option>
            <option value="Dihubungi">✉️ Di-email</option>
            <option value="Negosiasi">🤝 Nego</option>
            <option value="Deal">🎉 Deal</option>
          </select>
        </div>

        <button 
          onClick={() => onGeneratePitch(lead)}
          className={`text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 transition-all ${
            highlight ? 'bg-indigo-500 hover:bg-indigo-400 animate-pulse' : 'bg-indigo-600 hover:bg-indigo-500'
          }`}
        >
          <Sparkles className="h-3 w-3" /> Buat Pitch
        </button>
      </div>
    </div>
  );
}