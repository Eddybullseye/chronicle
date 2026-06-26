import React, { useState, useEffect } from 'react';
import { HueProvider, useHue } from './components/HueEngine';
import { AuroraCanvas } from './components/AuroraCanvas';
import { ParticleCanvas } from './components/ParticleCanvas';
import { MorphingBlob } from './components/MorphingBlob';
import { BlogFrontend } from './components/BlogFrontend';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminSignIn } from './components/AdminSignIn';
import { CopyPromptDepot } from './components/CopyPromptDepot';
import { 
  initialPosts, 
  initialProfiles, 
  initialCategories, 
  initialTags, 
  initialReviews, 
  initialSiteSettings 
} from './initialData';
import { Post, Profile, Category, Tag, PostReview, SiteSettings } from './types';
import { 
  Sparkles, Code, Shield, Key, Database, CheckSquare, Layers, Users, Sliders, Globe, RefreshCw, Smartphone, Monitor, BookOpen, Sun, Moon, Coffee, GraduationCap, Leaf
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Premium high-end vector logo representing Aura and Life
const AuraLifeLogo = ({ className = "w-8 h-8", hue = 220 }: { className?: string; hue?: number }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="auraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={`hsl(${hue}, 90%, 65%)`} />
        <stop offset="50%" stopColor={`hsl(${(hue + 45) % 360}, 85%, 55%)`} />
        <stop offset="100%" stopColor={`hsl(${(hue + 90) % 360}, 80%, 45%)`} />
      </linearGradient>
      <filter id="logoGlow" x="-25%" y="-25%" width="150%" height="150%">
        <feGaussianBlur stdDeviation="5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    {/* Concentric orbital rings */}
    <circle
      cx="50"
      cy="50"
      r="42"
      stroke="url(#auraGrad)"
      strokeWidth="1.2"
      strokeDasharray="4 8"
      className="animate-[spin_40s_linear_infinite]"
    />
    <circle
      cx="50"
      cy="50"
      r="34"
      stroke="url(#auraGrad)"
      strokeWidth="0.6"
      strokeOpacity="0.4"
    />
    {/* Glowing elegant organic leaf flame core */}
    <path
      d="M50 15 C66 33, 70 52, 50 82 C30 52, 34 33, 50 15 Z"
      fill="url(#auraGrad)"
      filter="url(#logoGlow)"
      className="opacity-90 hover:opacity-100 transition-opacity"
    />
    {/* Internal precision vector flourishes */}
    <path
      d="M50 25 C60 40, 60 55, 50 72"
      stroke="#ffffff"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeOpacity="0.8"
    />
    <path
      d="M50 34 C42 46, 42 57, 50 68"
      stroke="#ffffff"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeOpacity="0.5"
    />
    <circle cx="50" cy="50" r="2.5" fill="#ffffff" />
  </svg>
);

function DesignWorkshopOrchestrator() {
  const { hue, speed, setSpeed, isPaused, setIsPaused, particleCount, setParticleCount, auroraOpacity, setAuroraOpacity, activeAccentColor } = useHue();
  const [activeTab, setActiveTab] = useState<'feed' | 'lifestyle' | 'food' | 'education' | 'team' | 'console'>('feed');
  const [activeSpecSubTab, setActiveSpecSubTab] = useState<'schema' | 'roles' | 'prompts' | 'checklist'>('schema');
  
  // Custom preload overlay state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  // Theme support
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('theme_mode') as 'dark' | 'light') || 'dark';
  });

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme_mode', nextTheme);
  };

  // Dynamic Island interactive visual states
  const [isIslandExpanded, setIsIslandExpanded] = useState(false);
  const [isIslandLocked, setIsIslandLocked] = useState(false);

  // Pure OLED Dark Mode state synced to localStorage
  const [isForceOledDark, setIsForceOledDark] = useState(() => {
    return localStorage.getItem('is_oled_dark') === 'true';
  });

  const toggleForceOledDark = () => {
    const newVal = !isForceOledDark;
    setIsForceOledDark(newVal);
    localStorage.setItem('is_oled_dark', String(newVal));
  };

  // Unique Context Menu states for Apple-style long-press or right-click Quick Menu
  const [isIslandMenuOpen, setIsIslandMenuOpen] = useState(false);
  const [islandMenuCoords, setIsIslandMenuCoords] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const longPressTimerRef = React.useRef<any>(null);

  const handleIslandQuickActionMenu = (clientX: number, clientY: number) => {
    setIsIslandMenuCoords({ x: clientX, y: clientY });
    setIsIslandMenuOpen(true);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(30);
    }
  };

  const startLongPressTimer = (clientX: number, clientY: number) => {
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = setTimeout(() => {
      handleIslandQuickActionMenu(clientX, clientY);
    }, 500); // 500ms hold trigger
  };

  const cancelLongPressTimer = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const t = e.touches[0];
      startLongPressTimer(t.clientX, t.clientY);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      startLongPressTimer(e.clientX, e.clientY);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    handleIslandQuickActionMenu(e.clientX, e.clientY);
  };

  // Check URL parameters or hash to unlock Admin Workspace
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(() => {
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    return hash.includes('admin') || hash.includes('portal') || search.includes('admin') || search.includes('portal') || sessionStorage.getItem('admin_portal_unlocked') === 'true';
  });

  useEffect(() => {
    const checkUrlForAdmin = () => {
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (
        hash.includes('admin') || 
        hash.includes('portal') || 
        search.includes('admin') || 
        search.includes('portal')
      ) {
        setIsAdminUnlocked(true);
        sessionStorage.setItem('admin_portal_unlocked', 'true');
        
        // Auto navigate if user entered via unique URL triggers
        if (hash.includes('specs') || search.includes('specs')) {
          setActiveTab('specs');
        } else {
          setActiveTab('console');
        }
      }
    };

    // Run initial check
    checkUrlForAdmin();

    window.addEventListener('hashchange', checkUrlForAdmin);
    return () => {
      window.removeEventListener('hashchange', checkUrlForAdmin);
    };
  }, []);

  // Shared application states with localStorage synchronization with hot database upgrade for lifestyle focus
  const [posts, setPosts] = useState<Post[]>(() => {
    const local = localStorage.getItem('aura_clean_db_posts');
    return local ? JSON.parse(local) : initialPosts;
  });

  const [profiles, setProfiles] = useState<Profile[]>(() => {
    const local = localStorage.getItem('aura_clean_db_profiles');
    return local ? JSON.parse(local) : initialProfiles;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    return initialCategories; // Keep static list, extensible via admin appended lists
  });

  const [tags] = useState<Tag[]>(initialTags);

  const [reviews, setReviews] = useState<PostReview[]>(() => {
    const local = localStorage.getItem('aura_clean_db_reviews');
    return local ? JSON.parse(local) : initialReviews;
  });

  const [settings, setSettings] = useState<SiteSettings>(() => {
    const local = localStorage.getItem('aura_clean_db_settings');
    return local ? JSON.parse(local) : initialSiteSettings;
  });

  // Current active logged profile
  const [currentProfileIndex, setCurrentProfileIndex] = useState<number>(0);
  const currentProfile = profiles[currentProfileIndex] || profiles[0] || initialProfiles[0];

  // Specific selected article id for public view jumps
  const [activePostId, setActivePostId] = useState<string | undefined>(undefined);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Synchronise state arrays to localStorage for persistent play
  useEffect(() => {
    localStorage.setItem('aura_clean_db_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('aura_clean_db_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('aura_clean_db_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('aura_clean_db_settings', JSON.stringify(settings));
  }, [settings]);

  // Reset local development database
  const handleResetDatabase = () => {
    const confirmed = window.confirm("Are you sure you want to restore the development database to default settings? Your custom modifications will be retired.");
    if (confirmed) {
      setPosts(initialPosts);
      setProfiles(initialProfiles);
      setReviews(initialReviews);
      setSettings(initialSiteSettings);
      localStorage.clear();
      setActivePostId(undefined);
      setActiveTab('feed');
      window.alert("Database restored successfully!");
    }
  };

  const handleUpdatePosts = (newPosts: Post[]) => {
    setPosts(newPosts);
  };

  const handleUpdateProfiles = (newProfiles: Profile[]) => {
    setProfiles(newProfiles);
  };

  const handleUpdateSettings = (newSettings: SiteSettings) => {
    setSettings(newSettings);
  };

  const handleAddReviewComment = (newReview: PostReview) => {
    setReviews([newReview, ...reviews]);
  };

  const handlePostSelectFromPublic = (postId: string) => {
    // Navigate from grid post straight into reading
    setActivePostId(postId);
  };

  // Build Phase checklist states (Interactive trackers)
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    p1_supabase: true,
    p1_tailwind: true,
    p1_auth: true,
    p2_sidebar: true,
    p2_stats: true,
    p2_tiptap: true,
    p3_queue: true,
    p3_actions: true,
    p4_userinvite: true,
    p5_homepage: true,
    p5_search: true,
    p5_darkmode: true,
    p5_motion: true,
  });

  const toggleChecklistItem = (key: string) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-slate-200 selection:text-slate-900" id="workshop-root-shell">
      {/* Premium custom animated preloader */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#070708] text-white"
          >
            {/* Ambient background glow for preloader */}
            <div 
              className="absolute inset-x-0 top-1/4 bottom-1/4 mx-auto w-80 h-80 rounded-full blur-[120px] opacity-40 transition-colors duration-1000 select-none pointer-events-none"
              style={{
                background: `radial-gradient(circle, hsl(${hue}, 85%, 60%) 0%, transparent 70%)`
              }}
            />

            {/* Glowing Logo Container with spring entrance */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
              className="flex flex-col items-center gap-6 relative z-10"
            >
              <div className="relative">
                {/* Visual pulse ring surrounding the logo */}
                <motion.div
                  animate={{
                    scale: [0.95, 1.15, 0.95],
                    opacity: [0.4, 0.8, 0.4]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 rounded-full blur-md"
                  style={{
                    border: `2px solid hsla(${hue}, 85%, 55%, 0.3)`
                  }}
                />
                <AuraLifeLogo className="w-20 h-20 relative z-10 animate-[pulse_3s_ease-in-out_infinite]" hue={hue} />
              </div>

              {/* Text tracking animation */}
              <div className="text-center space-y-2">
                <motion.h1 
                  initial={{ letterSpacing: "0.1em", opacity: 0 }}
                  animate={{ letterSpacing: "0.25em", opacity: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
                  className="text-2xl md:text-3xl font-black uppercase text-transparent bg-clip-text"
                  style={{
                    backgroundImage: `linear-gradient(135deg, #ffffff 0%, hsl(${hue}, 30%, 85%) 100%)`
                  }}
                >
                  AuraLife
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 0.6, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                  className="text-[10px] tracking-wider text-slate-400 font-mono"
                >
                  CHROMATIC STUDIO CHRONICLE
                </motion.p>
              </div>
            </motion.div>

            {/* Elegant loading progress indicator line */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ left: "-100%" }}
                animate={{ left: "100%" }}
                transition={{
                  duration: 2.2,
                  repeat: 0,
                  ease: "easeInOut"
                }}
                className="absolute top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white to-transparent"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Global CSS Style Override for OLED Pure Dark Mode */}
      {isForceOledDark && (
        <style dangerouslySetInnerHTML={{ __html: `
          body, #workshop-root-shell, #aurora-container, .bg-slate-950, .bg-slate-950\\/80, .bg-slate-950\\/60, .bg-slate-950\\/40 {
            background-color: #000000 !important;
            background-image: none !important;
          }
          .border-slate-900, .border-slate-850, .border-slate-800, .border-slate-800\\/60 {
            border-color: #141414 !important;
          }
          .text-slate-400 {
            color: #8a8a8a !important;
          }
        `}} />
      )}

      {/* Global CSS Style Override for light-theme Mode */}
      {theme === 'light' && (
        <style dangerouslySetInnerHTML={{ __html: `
          body, #workshop-root-shell, #aurora-container {
            background-color: #f8fafc !important;
            background-image: none !important;
            color: #0f172a !important;
          }
          #workshop-root-shell .text-white, 
          #workshop-root-shell .text-slate-100, 
          #workshop-root-shell .text-slate-200, 
          #workshop-root-shell .text-zinc-100,
          #workshop-root-shell h1,
          #workshop-root-shell h2,
          #workshop-root-shell h3,
          #workshop-root-shell h4,
          #workshop-root-shell h5 {
            color: #0f172a !important;
          }
          #workshop-root-shell .text-slate-300, 
          #workshop-root-shell .text-slate-400, 
          #workshop-root-shell .text-slate-350, 
          #workshop-root-shell .text-slate-355, 
          #workshop-root-shell .text-slate-450,
          #workshop-root-shell .text-zinc-400 {
            color: #334155 !important;
          }
          #workshop-root-shell .text-slate-500,
          #workshop-root-shell .text-zinc-500 {
            color: #64748b !important;
          }
          #workshop-root-shell .bg-slate-950, 
          #workshop-root-shell .bg-slate-950\\/60, 
          #workshop-root-shell .bg-slate-950\\/80, 
          #workshop-root-shell .bg-slate-950\\/40, 
          #workshop-root-shell .bg-slate-900, 
          #workshop-root-shell .bg-slate-900\\/60, 
          #workshop-root-shell .bg-slate-900\\/80, 
          #workshop-root-shell .bg-slate-900\\/40,
          #workshop-root-shell .bg-zinc-950,
          #workshop-root-shell .bg-zinc-900,
          #workshop-root-shell .bg-slate-900\\/10 {
            background-color: #ffffff !important;
            color: #0f172a !important;
          }
          #workshop-root-shell .border-slate-900, 
          #workshop-root-shell .border-slate-850, 
          #workshop-root-shell .border-slate-800, 
          #workshop-root-shell .border-slate-800\\/60,
          #workshop-root-shell .border-slate-850\\/80,
          #workshop-root-shell .border-zinc-900,
          #workshop-root-shell .border-zinc-800,
          #workshop-root-shell .border-zinc-850 {
            border-color: #cbd5e1 !important;
          }
          #workshop-root-shell select, 
          #workshop-root-shell input:not([type="range"]):not([type="checkbox"]), 
          #workshop-root-shell textarea,
          #workshop-root-shell .bg-slate-900\\/30,
          #workshop-root-shell .bg-slate-950\\/20,
          #workshop-root-shell .bg-[#020617],
          #workshop-root-shell .bg-[#050506],
          #workshop-root-shell .bg-[#070708] {
            background-color: #f1f5f9 !important;
            color: #0f172a !important;
            border-color: #cbd5e1 !important;
          }
          #workbench-header .bg-black\\/95,
          #workbench-header .bg-slate-900\\/60,
          #workbench-header .text-white,
          #workbench-header .text-slate-100,
          #workbench-header .text-slate-200,
          #workbench-header .text-slate-300,
          #workbench-header .text-slate-400,
          #workbench-header .text-slate-500,
          #workbench-header select,
          #workbench-header .border-slate-850,
          #workbench-header .border-slate-900 {
            background-color: rgba(0, 0, 0, 0.95) !important;
            color: #f8fafc !important;
            border-color: rgba(255, 255, 255, 0.15) !important;
          }
          #workbench-header .bg-slate-900 {
            background-color: #111827 !important;
          }
          #workbench-header .text-slate-400 {
            color: #94a3b8 !important;
          }
          #workbench-header button:hover,
          #workbench-header a:hover {
            background-color: #1f2937 !important;
            color: #ffffff !important;
          }
          #workbench-header .text-slate-950 {
            color: #030712 !important;
          }
          #dev-controller-deck {
            background-color: #f1f5f9 !important;
            color: #334155 !important;
            border-bottom: 1px solid #cbd5e1 !important;
          }
          #workshop-root-shell .bg-slate-950\\/60 {
            background-color: #ffffff !important;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03) !important;
          }
        `}} />
      )}
      
      {/* Background Canvases Backdrop Integration */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <AuroraCanvas />
        <ParticleCanvas />
        <div className="absolute top-10 left-10">
          <MorphingBlob />
        </div>
        <div className="absolute bottom-10 right-10">
          <MorphingBlob />
        </div>
      </div>

      {/* Apple Dynamic Island Inspired Atmosphere Header */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-fit px-4" id="workbench-header">
        <motion.div
          layout
          initial={{ borderRadius: 32 }}
          animate={{ 
            borderRadius: isIslandExpanded || isIslandLocked ? 24 : 32,
            width: isIslandExpanded || isIslandLocked 
              ? "min(92vw, 820px)" 
              : "280px"
          }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          onMouseEnter={() => setIsIslandExpanded(true)}
          onMouseLeave={() => setIsIslandExpanded(false)}
          className="bg-black/95 backdrop-blur-lg border text-white overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] transition-all duration-300"
          style={{
            borderColor: `hsla(${hue}, 85%, 55%, 0.35)`,
            boxShadow: `0 10px 40px -10px rgba(0,0,0,0.9), 0 0 20px -3px hsla(${hue}, 85%, 55%, 0.2)`
          }}
        >
          <div className="p-1 sm:p-2">
            <AnimatePresence mode="wait">
              {!(isIslandExpanded || isIslandLocked) ? (
                 /* COMPACT ISLAND STATE */
                <motion.div
                  key="compact-island"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  onClick={() => setIsIslandLocked(true)}
                  className="flex items-center justify-between px-3 py-1.5 text-xs cursor-pointer select-none h-9"
                >
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <AuraLifeLogo className="w-4 h-4" hue={hue} />
                    <span className="font-black text-slate-200 tracking-wider text-[10px] uppercase font-mono">
                      AuraLife
                    </span>
                  </div>

                  <div className="text-[9px] text-slate-400 font-black bg-slate-900/80 px-2 py-0.5 rounded-full border border-slate-800/60 font-mono">
                    {activeTab === 'feed' && 'All Articles'}
                    {activeTab === 'lifestyle' && 'Lifestyle'}
                    {activeTab === 'food' && 'Culinary & Food'}
                    {activeTab === 'education' && 'Education'}
                    {activeTab === 'team' && 'Board'}
                    {activeTab === 'console' && 'Workspace'}
                  </div>

                  {/* Elegant Quick actions and visualizer combo */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTheme();
                      }}
                      className="p-1 rounded-full text-slate-400 hover:text-white transition-all cursor-pointer flex items-center justify-center bg-slate-900/60 hover:bg-slate-800"
                      title="Quick Mode Toggle"
                    >
                      {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-sky-405" />}
                    </button>

                    {/* Compact iOS audio/vibe visualizer based on live atmosphere speed */}
                    <div className="flex items-center gap-[2.5px] h-3 pr-1">
                    {[1, 2, 3, 4, 5].map((bar) => (
                      <motion.div
                        key={bar}
                        animate={{
                          height: isPaused ? "3px" : ["3px", "12px", "4px", "10px", "3px"][bar - 1]
                        }}
                        transition={{
                          repeat: Infinity,
                          repeatType: "reverse",
                          duration: isPaused ? 1 : 0.4 + (bar * 0.12) / (speed + 0.1),
                          ease: "easeInOut"
                        }}
                        className="w-[2px] rounded-full"
                        style={{
                          backgroundColor: `hsl(${(hue + bar * 40) % 360}, 85%, 65%)`
                        }}
                      />
                    ))}
                  </div>
                  </div>
                </motion.div>
              ) : (
                /* EXPANDED DYNAMIC ISLAND STATE */
                <motion.div
                  key="expanded-island"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="px-4 py-3 space-y-4 cursor-default select-none relative"
                  onContextMenu={handleContextMenu}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={cancelLongPressTimer}
                  onTouchMove={cancelLongPressTimer}
                  onMouseDown={handleMouseDown}
                  onMouseUp={cancelLongPressTimer}
                  onMouseLeave={cancelLongPressTimer}
                >
                  {/* Brand & Action Controls Row */}
                  <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                    <div className="flex items-center gap-3">
                      <AuraLifeLogo className="w-8 h-8" hue={hue} />
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-sm font-black text-white tracking-widest uppercase">AuraLife</h2>
                        </div>
                        <p className="text-[9px] text-slate-400 font-medium font-sans">
                          Lifestyle, Food, Education &amp; Happenings Chronicle • <span className="text-amber-400 font-bold uppercase tracking-wider text-[8px] animate-pulse">Hold / Right-Click for Actions</span>
                        </p>
                      </div>
                    </div>

                    {/* Theme Toggles and Lock controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTheme();
                        }}
                        className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-[9px] font-bold cursor-pointer"
                        title={theme === 'dark' ? "Switch to Light theme" : "Switch to Dark theme"}
                      >
                        {theme === 'dark' ? (
                          <>
                            <Sun className="w-3.5 h-3.5 text-amber-400" />
                            <span>Light</span>
                          </>
                        ) : (
                          <>
                            <Moon className="w-3.5 h-3.5 text-sky-400" />
                            <span>Dark</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => setIsIslandLocked(!isIslandLocked)}
                        className={`text-[9px] font-bold px-2 py-1 rounded border transition-colors flex items-center gap-1 cursor-pointer ${
                          isIslandLocked
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                        title={isIslandLocked ? "Unlock Auto-Collapse" : "Lock expanded"}
                      >
                        {isIslandLocked ? "🔒 Locked" : "🔓 Hover Expand"}
                      </button>
                      <button
                        onClick={() => {
                          setIsIslandLocked(false);
                          setIsIslandExpanded(false);
                        }}
                        className="p-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" stroke="currentColor" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Navigation Tab selection menu integrated right inside the dynamic island */}
                  <div className="flex flex-wrap items-center justify-center gap-1 p-1 bg-slate-900/60 rounded-xl border border-slate-850/80 text-[11px] font-semibold">
                    {[
                      { id: 'feed', label: 'All Articles', icon: BookOpen },
                      { id: 'lifestyle', label: 'Lifestyle', icon: Leaf },
                      { id: 'food', label: 'Culinary & Food', icon: Coffee },
                      { id: 'education', label: 'Smart Education', icon: GraduationCap },
                      { id: 'team', label: 'Editorial Board', icon: Users }
                    ].map((tab) => {
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setActiveTab(tab.id as any);
                            // Highlight transition or auto collapse if not locked
                            if (!isIslandLocked) {
                              setIsIslandExpanded(false);
                            }
                          }}
                          className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 cursor-pointer select-none text-[10px] ${
                            isActive 
                              ? 'bg-slate-100 text-slate-950 shadow-md font-extrabold scale-95' 
                              : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                          }`}
                        >
                          <tab.icon className="w-3.5 h-3.5" />
                          <span dangerouslySetInnerHTML={{ __html: tab.label }} />
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </header>

      {/* Apple-style floating Context Menu quick action drawer */}
      {isIslandMenuOpen && (
        <>
          {/* Backdrop layer to dismiss context menu safely */}
          <div 
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] cursor-default" 
            onClick={() => setIsIslandMenuOpen(false)}
            onContextMenu={(e) => {
              e.preventDefault();
              setIsIslandMenuOpen(false);
            }}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 5 }}
            className="fixed z-50 bg-[#070708] border rounded-xl p-1.5 shadow-[0_15px_40px_rgba(0,0,0,0.95)] max-w-[245px] w-60 text-xs text-zinc-100 font-sans"
            style={{
              top: Math.min(window.innerHeight - 250, Math.max(10, islandMenuCoords.y)),
              left: Math.min(window.innerWidth - 255, Math.max(10, islandMenuCoords.x)),
              borderColor: `hsla(${hue}, 85%, 55%, 0.45)`,
              boxShadow: `0 12px 36px rgba(0,0,0,0.92), 0 0 15px -3px hsla(${hue}, 85%, 55%, 0.25)`
            }}
          >
            <div className="px-2.5 py-1.5 border-b border-zinc-900 flex items-center justify-between">
              <span className="font-extrabold text-[10px] uppercase font-mono tracking-wider text-slate-400">Quick Actions</span>
              <span className="text-[8px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1.5 py-0.5 rounded-full font-bold">iOS HAPTIC</span>
            </div>
            
            <div className="p-1 space-y-0.5 select-none">
              
              {/* Force Dark Mode Toggle */}
              <button
                onClick={() => {
                  toggleForceOledDark();
                  setIsIslandMenuOpen(false);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-zinc-900/60 transition-colors flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">🕶️</span>
                  <span className="font-medium text-slate-200">Pure OLED Dark Mode</span>
                </div>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ${
                  isForceOledDark 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-zinc-800 text-zinc-500'
                }`}>
                  {isForceOledDark ? 'ACTIVE' : 'OFF'}
                </span>
              </button>

              {/* Toggle Aurora Canvas */}
              <button
                onClick={() => {
                  setAuroraOpacity(auroraOpacity > 0 ? 0 : 0.65);
                  setIsIslandMenuOpen(false);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-zinc-900/60 transition-colors flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">🌌</span>
                  <span className="font-medium text-slate-200">Aurora Background</span>
                </div>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ${
                  auroraOpacity > 0 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-zinc-800 text-zinc-500'
                }`}>
                  {auroraOpacity > 0 ? 'ON' : 'OFF'}
                </span>
              </button>

              {/* Mute/Pause Atmosphere Loop */}
              <button
                onClick={() => {
                  setIsPaused(!isPaused);
                  setIsIslandMenuOpen(false);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-zinc-900/60 transition-colors flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">⏱️</span>
                  <span className="font-medium text-slate-200">Atmosphere Motor</span>
                </div>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ${
                  !isPaused 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-red-500/20 text-red-500 border border-red-500/30'
                }`}>
                  {!isPaused ? 'ACTIVE' : 'PAUSED'}
                </span>
              </button>

              {/* Adjust density */}
              <button
                onClick={() => {
                  setParticleCount(particleCount === 0 ? 45 : particleCount === 45 ? 100 : 0);
                  setIsIslandMenuOpen(false);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-zinc-900/60 transition-colors flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">✨</span>
                  <span className="font-medium text-slate-200">Stardust Particles</span>
                </div>
                <span className="text-[9px] bg-slate-900 border border-slate-800/80 text-slate-350 font-extrabold px-1.5 py-0.5 rounded font-mono">
                  {particleCount === 0 ? 'Off' : particleCount === 45 ? 'Standard' : 'Dense'}
                </span>
              </button>

            </div>

            <div className="border-t border-zinc-900 p-1">
              <button
                onClick={() => setIsIslandMenuOpen(false)}
                className="w-full text-center py-1 rounded bg-zinc-900/60 hover:bg-zinc-900/90 text-zinc-400 hover:text-white transition-colors text-[10px] font-mono font-medium cursor-pointer"
              >
                Dismiss Menu
              </button>
            </div>
          </motion.div>
        </>
      )}

      {/* Top spacer to offset the floating fixed Dynamic Island header */}
      <div className="h-16 sm:h-20 w-full shrink-0" />

      {/* Role Switcher Deck (only visible inside console and specs) */}
      {(activeTab === 'console' || activeTab === 'specs') && (
        <section className="bg-slate-950 border-b border-slate-900/60 py-2.5 px-4 relative z-25 text-xs text-slate-300 animate-fade-in" id="dev-controller-deck">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider font-mono">Simulated Team Identity:</span>
              <div className="flex gap-1.5 bg-slate-900/40 p-1 border border-slate-850 rounded">
                {profiles.slice(0, 3).map((prf, idx) => (
                  <button
                    key={prf.id}
                    onClick={() => {
                      setCurrentProfileIndex(idx);
                      // Custom swapped feedback alert
                      window.alert(`Swapped workspace session identity to: ${prf.fullName} (${prf.role.toUpperCase()})`);
                    }}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      currentProfile.id === prf.id 
                        ? 'bg-slate-100 text-slate-950 font-black scale-95 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <img src={prf.avatarUrl} alt="" className="w-3.5 h-3.5 rounded-full object-cover" />
                    {prf.fullName.split(' ')[0]} ({prf.role.replace(/_/g, ' ')})
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              
              {/* Database storage backup indicator */}
              <div className="flex items-center gap-2 text-[10px] bg-slate-900/40 border border-slate-850 px-2 py-1 rounded font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                <span className="text-slate-400 font-mono">Sandbox Local-Sync: Connected</span>
              </div>

              <button
                onClick={handleResetDatabase}
                className="text-slate-400 hover:text-white px-2.5 py-1 text-[10px] font-bold border border-slate-850 rounded hover:border-slate-700 bg-slate-900/10 cursor-pointer flex items-center gap-1 transition-colors"
                title="Reset Simulated Database Schema"
              >
                <RefreshCw className="w-3 h-3" /> Reset cache
              </button>
            </div>

          </div>
        </section>
      )}

      {/* Primary Stage */}
      <section className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 relative z-20" id="main-stage-workspace">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: ARTICLES FEED */}
          {['feed', 'lifestyle', 'food', 'education'].includes(activeTab) && (
            <motion.div
              key="portal-area"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 animate-fade-in"
            >
              <div className="transition-all duration-300">
                <BlogFrontend
                  posts={posts}
                  categories={categories}
                  tags={tags}
                  profiles={profiles}
                  settings={settings}
                  activePostId={activePostId}
                  onPostSelect={handlePostSelectFromPublic}
                  onNavigateToAdmin={() => setActiveTab('console')}
                  initialCategoryFilter={activeTab !== 'feed' ? activeTab : undefined}
                />
              </div>
            </motion.div>
          )}

          {/* TAB 2: EDITORIAL BOARD */}
          {activeTab === 'team' && (
            <motion.div
              key="team-area"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8 text-xs text-slate-355"
            >
              <div className="space-y-1.5 text-center max-w-2xl mx-auto">
                <span className="text-[10px] uppercase tracking-widest text-[#d97706] font-bold font-mono">Meet the Curators</span>
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">The AuraLife Collective</h2>
                <p className="text-slate-400 text-sm">Our team of lifestyle designers, culinary enthusiasts, cognitive specialists, and metropolitan reporters.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                {profiles.map((prf) => {
                  const authorPosts = posts.filter(p => p.authorId === prf.id && p.status === 'published');
                  return (
                    <div 
                      key={prf.id}
                      className="bg-slate-950/80 border border-slate-900 rounded-2xl p-6 flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-slate-800 transition-colors"
                      style={{
                        boxShadow: `0 8px 30px -10px rgba(0,0,0,0.8)`
                      }}
                    >
                      {/* Decorative ambient background matching live hue */}
                      <div 
                        className="absolute -right-20 -top-20 w-45 h-45 rounded-full opacity-10 filter blur-2xl group-hover:opacity-15 transition-opacity duration-700"
                        style={{ background: `hsl(${hue}, 85%, 65%)` }}
                      />

                      <div className="space-y-4 relative z-10">
                        {/* Upper profile header */}
                        <div className="flex items-center gap-4">
                          <img 
                            src={prf.avatarUrl} 
                            alt={prf.fullName} 
                            className="w-14 h-14 rounded-full object-cover border-2 border-slate-900 shadow-md"
                          />
                          <div>
                            <h3 className="text-sm font-extrabold text-white group-hover:text-amber-400 transition-colors">{prf.fullName}</h3>
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-850 text-slate-400 uppercase font-bold mt-1 inline-block">
                              {prf.role.replace(/_/g, ' ')}
                            </span>
                          </div>
                        </div>

                        {/* Bio */}
                        <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                          {prf.bio}
                        </p>
                      </div>

                      {/* Author posts list */}
                      <div className="space-y-2.5 pt-4 border-t border-slate-900 relative z-10">
                        <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider font-mono">Published Articles ({authorPosts.length})</span>
                        {authorPosts.length === 0 ? (
                          <span className="text-slate-600 italic block text-[10px]">No public articles yet. Current draft logs in editorial review.</span>
                        ) : (
                          <div className="space-y-1.5 max-h-32 overflow-y-auto">
                            {authorPosts.map((post) => (
                              <button
                                key={post.id}
                                onClick={() => {
                                  setActivePostId(post.id);
                                  setActiveTab('feed');
                                }}
                                className="w-full text-left font-serif text-slate-300 hover:text-white transition-colors flex items-start gap-1 justify-between group/lnk cursor-pointer"
                              >
                                <span className="font-sans font-semibold text-xs leading-tight line-clamp-1 flex-1 group-hover/lnk:underline">
                                  {post.title}
                                </span>
                                <span className="text-[9px] font-mono text-slate-600 block shrink-0 ml-2">{post.readingTime}m read</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'console' && (
            <motion.div
              key="console-area"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {isAdminLoggedIn ? (
                <AdminDashboard
                  posts={posts}
                  categories={categories}
                  tags={tags}
                  profiles={profiles}
                  reviews={reviews}
                  settings={settings}
                  currentProfile={currentProfile}
                  onUpdatePosts={handleUpdatePosts}
                  onUpdateProfiles={handleUpdateProfiles}
                  onUpdateSettings={handleUpdateSettings}
                  onAddReviewComment={handleAddReviewComment}
                  onLogout={() => setIsAdminLoggedIn(false)}
                />
              ) : (
                <AdminSignIn onSignIn={() => setIsAdminLoggedIn(true)} />
              )}
            </motion.div>
          )}



        </AnimatePresence>
      </section>

      {/* Footer credits panel */}
      <footer className="border-t border-slate-900 bg-slate-950/60 pb-6 pt-4 relative z-30" id="workbench-footer">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center text-[11px] text-slate-500 font-bold">
          <p>© 2026 AuraLife. Deserving reads in an atmosphere of slow living, gastronomy, and lifelong education.</p>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <HueProvider>
      <DesignWorkshopOrchestrator />
    </HueProvider>
  );
}
