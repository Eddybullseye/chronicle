import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Post, Category, Tag, Profile, SiteSettings } from '../types';
import { useHue } from './HueEngine';
import { MorphingBlob } from './MorphingBlob';
import { TableOfContents } from './TableOfContents';
import { 
  Search, Calendar, Clock, Share2, Twitter, Linkedin, Send, 
  ChevronRight, ArrowLeft, Heart, Moon, Sun, BookOpen, ThumbsUp, 
  Tag as TagIcon, Sparkles, Check, Bookmark, MessageSquare, 
  AlertCircle, Eye, Award, BookmarkCheck, ArrowUpRight, Zap 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Elegant companion vector logo
const AuraLifeLogo = ({ className = "w-8 h-8", hue = 220 }: { className?: string; hue?: number }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="auraGradBlog" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={`hsl(${hue}, 90%, 65%)`} />
        <stop offset="50%" stopColor={`hsl(${(hue + 45) % 360}, 85%, 55%)`} />
        <stop offset="100%" stopColor={`hsl(${(hue + 90) % 360}, 80%, 45%)`} />
      </linearGradient>
      <filter id="logoGlowBlog" x="-25%" y="-25%" width="150%" height="150%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <circle
      cx="50"
      cy="50"
      r="42"
      stroke="url(#auraGradBlog)"
      strokeWidth="1.2"
      strokeDasharray="4 8"
      className="animate-[spin_40s_linear_infinite]"
    />
    <path
      d="M50 15 C66 33, 70 52, 50 82 C30 52, 34 33, 50 15 Z"
      fill="url(#auraGradBlog)"
      filter="url(#logoGlowBlog)"
      className="opacity-90"
    />
    <path
      d="M50 25 C60 40, 60 55, 50 72"
      stroke="#ffffff"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeOpacity="0.8"
    />
    <circle cx="50" cy="50" r="2.5" fill="#ffffff" />
  </svg>
);

interface BlogFrontendProps {
  posts: Post[];
  categories: Category[];
  tags: Tag[];
  profiles: Profile[];
  settings: SiteSettings;
  activePostId?: string;
  onPostSelect: (postId: string) => void;
  onNavigateToAdmin: () => void;
  initialCategoryFilter?: string;
}

interface Comment {
  id: string;
  postId: string;
  authorName: string;
  content: string;
  createdAt: string;
  avatarUrl: string;
}

export const BlogFrontend: React.FC<BlogFrontendProps> = ({
  posts,
  categories,
  tags,
  profiles,
  settings,
  activePostId,
  onPostSelect,
  onNavigateToAdmin,
  initialCategoryFilter,
}) => {
  const { hue, isPaused } = useHue();
  const [route, setRoute] = useState<{ type: 'home' | 'article' | 'category' | 'tag' | 'search'; id?: string }>({ type: 'home' });
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Custom interactive state elements
  const [email, setEmail] = useState<string>('');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  
  // Font reader size: 'sm' (Small/Compact), 'base' (Standard Serif), 'lg' (Editorial Bold)
  const [textSize, setTextSize] = useState<'sm' | 'base' | 'lg'>('base');
  
  // Bookmarks
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const local = localStorage.getItem('auroralife_bookmarks');
    return local ? JSON.parse(local) : [];
  });
  
  // Shows reading/bookmarks modal panel
  const [showBookmarksPanel, setShowBookmarksPanel] = useState<boolean>(false);

  // Floating Clapping states
  const [claps, setClaps] = useState<Record<string, number>>(() => {
    const local = localStorage.getItem('auroralife_claps');
    return local ? JSON.parse(local) : {};
  });
  const [clapParticles, setClapParticles] = useState<{ id: number; x: number; y: number }[]>([]);
  const clapParticleIdRef = useRef<number>(0);

  // Follow states for editorial curators
  const [followedCurators, setFollowedCurators] = useState<string[]>(() => {
    const local = localStorage.getItem('auroralife_followed_curators');
    return local ? JSON.parse(local) : [];
  });

  // User comments (persists in localStorage)
  const [comments, setComments] = useState<Comment[]>(() => {
    const local = localStorage.getItem('auroralife_user_comments');
    if (local) return JSON.parse(local);
    return [
      {
        id: 'init-c1',
        postId: 'post-daily-rituals',
        authorName: 'Jean-Luc G.',
        content: 'Fascinating perspective on early morning sunlight intervals. Implementing a strict 10-minute visual routine has drastically stabilized my focus.',
        createdAt: '2026-06-10T09:30:00Z',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100'
      },
      {
        id: 'init-c2',
        postId: 'post-daily-rituals',
        authorName: 'Dr. Evelyn Foster',
        content: 'Waking stretching before screen contact allows baseline dopamine reserves to remain undisturbed. A beautifully formulated piece on habitation.',
        createdAt: '2026-06-11T08:15:00Z',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100'
      },
      {
        id: 'init-c3',
        postId: 'post-aurora-canvas',
        authorName: 'Julian Vant',
        content: 'The custom spectrum calculations offer complete visual immersion. There is an absolute luxury in adjusting variables to fit our cognitive focus.',
        createdAt: '2026-06-09T14:45:00Z',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100'
      }
    ];
  });

  // New Comment Form state
  const [newCommentName, setNewCommentName] = useState<string>('');
  const [newCommentContent, setNewCommentContent] = useState<string>('');
  const [commentStatus, setCommentStatus] = useState<boolean>(false);

  // Online reader count ticker simulation
  const [onlineReaders, setOnlineReaders] = useState<number>(142);

  // Article scroll reading progress
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const articleContainerRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroller for loading an article
  useEffect(() => {
    if (activePostId) {
      setRoute({ type: 'article', id: activePostId });
      window.scrollTo({ top: 320, behavior: 'smooth' });
    }
  }, [activePostId]);

  // Sync category tab selection with route
  useEffect(() => {
    if (initialCategoryFilter) {
      if (initialCategoryFilter === 'lifestyle') {
        setRoute({ type: 'category', id: 'cat-lifestyle' });
      } else if (initialCategoryFilter === 'food') {
        setRoute({ type: 'category', id: 'cat-food' });
      } else if (initialCategoryFilter === 'education') {
        setRoute({ type: 'category', id: 'cat-education' });
      } else {
        setRoute({ type: 'home' });
      }
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  }, [initialCategoryFilter]);

  // Online readers updates periodically
  useEffect(() => {
    const clock = setInterval(() => {
      setOnlineReaders(prev => {
        const delta = Math.floor(Math.random() * 9) - 4;
        return Math.max(120, prev + delta);
      });
    }, 5500);
    return () => clearInterval(clock);
  }, []);

  // Update localStorage hooks
  useEffect(() => {
    localStorage.setItem('auroralife_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('auroralife_claps', JSON.stringify(claps));
  }, [claps]);

  useEffect(() => {
    localStorage.setItem('auroralife_followed_curators', JSON.stringify(followedCurators));
  }, [followedCurators]);

  useEffect(() => {
    localStorage.setItem('auroralife_user_comments', JSON.stringify(comments));
  }, [comments]);

  // Article scroll calculation
  useEffect(() => {
    if (route.type !== 'article') {
      setScrollProgress(0);
      return;
    }

    const handleScroll = () => {
      const el = articleContainerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const st = window.scrollY || document.documentElement.scrollTop;
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollableHeight <= 0) {
        setScrollProgress(100);
        return;
      }
      const scrolled = (st / scrollableHeight) * 100;
      setScrollProgress(Math.min(100, Math.max(0, scrolled)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    setTimeout(handleScroll, 120);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [route]);

  // Prepare article content with IDs
  const processedArticle = useMemo(() => {
    if (route.type !== 'article' || !route.id) return null;
    const article = posts.find(p => p.id === route.id);
    if (!article) return null;

    const parser = new DOMParser();
    const doc = parser.parseFromString(article.content, 'text/html');
    const headings = Array.from(doc.querySelectorAll('h2'));
    
    headings.forEach((h2, index) => {
      if (!h2.id) {
        h2.id = `section-${index}-${h2.textContent?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'heading'}`;
      }
    });

    return {
        ...article,
        content: doc.body.innerHTML
    };
  }, [route, posts]);

  // Helper selectors
  const getAuthor = (authorId: string) => {
    return profiles.find(p => p.id === authorId) || {
      fullName: 'Sarah Jenkins',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200',
      role: 'admin',
      bio: 'Lifestyle curator and writer.'
    };
  };

  const getCategory = (catId: string) => {
    return categories.find(c => c.id === catId) || { name: 'Chronicles', slug: 'chronicles' };
  };

  const getTagsForPost = (tagIds: string[]) => {
    return tags.filter(t => tagIds?.includes(t.id));
  };

  // Filter published posts
  const getPublishedPosts = () => {
    return posts.filter(p => p.status === 'published');
  };

  const getFilteredPosts = () => {
    const published = getPublishedPosts();
    if (route.type === 'category') {
      return published.filter(p => p.categoryId === route.id);
    }
    if (route.type === 'tag') {
      return published.filter(p => p.tags?.includes(route.id || ''));
    }
    if (route.type === 'search') {
      const query = (route.id || '').toLowerCase();
      return published.filter(
        p => p.title.toLowerCase().includes(query) ||
             p.content.toLowerCase().includes(query) ||
             p.excerpt.toLowerCase().includes(query)
      );
    }
    return published;
  };

  // Primary featured post
  const featuredPost = posts.find(p => p.status === 'published' && p.id === 'post-daily-rituals') || getPublishedPosts()[0];
  
  // Trending stories selection (top stories by status/length)
  const trendingStories = getPublishedPosts()
    .filter(p => p.id !== (route.type === 'home' ? featuredPost?.id : ''))
    .slice(0, 3);

  // Latest journals rows
  const finalGridPosts = getFilteredPosts().filter(
    p => p.id !== (route.type === 'home' ? featuredPost?.id : '')
  );

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setEmailStatus('error');
      setTimeout(() => setEmailStatus('idle'), 2000);
      return;
    }
    setEmailStatus('submitting');
    setTimeout(() => {
      setEmailStatus('success');
      setEmail('');
    }, 1500);
  };

  const toggleBookmark = (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (bookmarks.includes(postId)) {
      setBookmarks(bookmarks.filter(id => id !== postId));
    } else {
      setBookmarks([...bookmarks, postId]);
    }
  };

  // Perform a clap event complete with rising pixel particle
  const handleClap = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const currentClaps = claps[postId] || 0;
    setClaps({
      ...claps,
      [postId]: currentClaps + 1
    });

    // Spawn a cute custom animated numeric chip
    const rect = e.currentTarget.getBoundingClientRect();
    const particleId = ++clapParticleIdRef.current;
    
    // Spawn randomized coordinates above click point
    const newY = -40 - Math.random() * 20;
    const newX = (Math.random() * 40) - 20;
    
    setClapParticles(prev => [
      ...prev,
      { id: particleId, x: newX, y: newY }
    ]);

    // Cleanup particle
    setTimeout(() => {
      setClapParticles(prev => prev.filter(p => p.id !== particleId));
    }, 1000);
  };

  const toggleFollowCurator = (authorId: string) => {
    if (followedCurators.includes(authorId)) {
      setFollowedCurators(followedCurators.filter(id => id !== authorId));
    } else {
      setFollowedCurators([...followedCurators, authorId]);
    }
  };

  const handleAddComment = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentName.trim() || !newCommentContent.trim()) return;

    const added: Comment = {
      id: `comm-${Date.now()}`,
      postId,
      authorName: newCommentName.trim(),
      content: newCommentContent.trim(),
      createdAt: new Date().toISOString(),
      avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 999999)}?auto=format&fit=crop&w=100&q=80`
    };

    setComments([added, ...comments]);
    setNewCommentName('');
    setNewCommentContent('');
    setCommentStatus(true);
    setTimeout(() => setCommentStatus(false), 3000);
  };

  return (
    <div className="relative text-slate-100 min-h-screen" id="editorial-blog-frontend-framework">
      
      {/* Editorial Ticker tape at the absolute top of the blog */}
      <div 
        className="w-full bg-[#090b10] border-b border-white/5 py-2 text-[10px] tracking-[0.15em] text-slate-400 font-mono overflow-hidden select-none"
        id="news-ticker-band"
      >
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <span className="inline-flex items-center gap-1.5 font-bold text-amber-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              IN RECENT CHRONICLES:
            </span>
            <span className="animate-[marquee_25s_linear_infinite] inline-block pl-4 font-medium text-slate-300">
              ● Waking morning stretch rituals stabilizes early baseline cortisol reserve ● Marcus Chen releases French country street kitchen flavor profiles ● Cognitive learning consulter Elena Rostova highlights spaced repetition techniques
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[9px] font-black uppercase text-slate-500">
            <span>ISSUE NO. 44</span>
            <span>VOL. III</span>
          </div>
        </div>
      </div>

      {/* Embedded Reading Progress Track for Article viewing */}
      {route.type === 'article' && route.id && (
        <div 
          className="fixed top-0 left-0 h-1 z-55 transition-all duration-100"
          style={{ 
            width: `${scrollProgress}%`,
            background: `linear-gradient(to right, rgb(251, 191, 36), hsl(${hue}, 90%, 60%))`,
            boxShadow: `0 1px 12px hsla(${hue}, 90%, 55%, 0.6)`
          }}
          id="premium-editorial-progress"
        />
      )}

      {/* Styled Public Header Navigation */}
      <nav className="border-b border-slate-900/90 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          
          {/* Elegant Logo section */}
          <button 
            type="button" 
            onClick={() => {
              setRoute({ type: 'home' });
              if (onPostSelect) onPostSelect('');
            }}
            className="flex items-center gap-2.5 cursor-pointer font-black text-xl tracking-tight text-white focus:outline-none group"
            id="brand-logo-trigger"
          >
            <AuraLifeLogo className="w-7 h-7 transform group-hover:rotate-45 transition-transform duration-500" hue={hue} />
            <div className="text-left font-sans">
              <span className="text-white font-extrabold uppercase tracking-widest text-base">AuraLife</span>
              <span className="text-[9px] text-[#fbbf24] block leading-none font-bold font-mono tracking-widest">GAZETTE</span>
            </div>
          </button>

          {/* Expanded Midbar Category Quick jumps */}
          <div className="hidden lg:flex items-center gap-6 text-[11px] font-bold text-slate-400 font-sans">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setRoute({ type: 'category', id: cat.id })}
                className={`transition-colors py-1 cursor-pointer relative hover:text-white ${
                  route.type === 'category' && route.id === cat.id ? 'text-[#fbbf24] font-black' : ''
                }`}
              >
                {cat.name.split(' & ')[0]}
                {route.type === 'category' && route.id === cat.id && (
                  <motion.div 
                    layoutId="activeCategoryHeaderLine" 
                    className="absolute -bottom-5 left-0 right-0 h-[2px] bg-[#fbbf24]"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Actions & Bookmarks Bar */}
          <div className="flex items-center gap-3">
            
            {/* Search Input Box */}
            <div className="relative hidden md:block max-w-[180px]">
              <input
                type="text"
                placeholder="Search index..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.trim().length > 0) {
                    setRoute({ type: 'search', id: e.target.value.trim() });
                  }
                }}
                className="bg-slate-900 border border-slate-800 text-[11px] font-sans text-white rounded-full pl-7 pr-3 py-1.5 w-full focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all focus:max-w-[220px]"
              />
              <Search className="w-3 h-3 text-slate-500 absolute left-2.5 top-2.5" />
            </div>

            {/* Reading list Bookmark trigger */}
            <button
              onClick={() => setShowBookmarksPanel(!showBookmarksPanel)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-850 hover:border-slate-800 text-slate-400 hover:text-white cursor-pointer transition-all flex items-center gap-1.5 text-xs font-semibold relative"
              title="Saved Reading List"
              id="bookmark-list-panel-trigger"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
              <span className="hidden sm:inline">Saved List</span>
              {bookmarks.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black flex items-center justify-center shadow-md animate-pulse">
                  {bookmarks.length}
                </span>
              )}
            </button>


          </div>
        </div>
      </nav>

      {/* Bookmarks Overlay Panel */}
      <AnimatePresence>
        {showBookmarksPanel && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-20 right-4 sm:right-16 w-80 bg-slate-950 border border-slate-800 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.8)] z-50 p-4 space-y-3"
            id="saved-reading-modal"
          >
            <div className="flex justify-between items-center border-b border-slate-900 pb-2">
              <div className="flex items-center gap-1.5">
                <Bookmark className="w-4 h-4 text-amber-500" />
                <h4 className="text-xs font-black uppercase tracking-wider text-white">Your Reading List</h4>
              </div>
              <button 
                onClick={() => setShowBookmarksPanel(false)}
                className="text-[10px] text-slate-500 hover:text-white hover:underline cursor-pointer"
              >
                Close
              </button>
            </div>

            {bookmarks.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500 italic">No articles saved. Tap the bookmark icon on any post to save for offline.</div>
            ) : (
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {bookmarks.map(id => {
                  const saved = posts.find(p => p.id === id);
                  if (!saved) return null;
                  return (
                    <div 
                      key={id}
                      onClick={() => {
                        setRoute({ type: 'article', id });
                        setShowBookmarksPanel(false);
                      }}
                      className="p-2 rounded bg-slate-900/60 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 cursor-pointer flex gap-2 items-center transition-all group"
                    >
                      <img src={saved.coverImageUrl} className="w-9 h-9 rounded object-cover" alt="" />
                      <div className="flex-1 min-w-0">
                        <span className="text-[8px] uppercase tracking-wider text-amber-400 block font-mono font-bold">
                          {getCategory(saved.categoryId).name.split(' & ')[0]}
                        </span>
                        <h5 className="text-[11px] font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                          {saved.title}
                        </h5>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(id);
                        }}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        title="Remove bookmark"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-4 mt-6">
        <AnimatePresence mode="wait">
          
          {/* HOMEPAGE VIEW */}
          {route.type === 'home' && (
            <motion.div
              key="homepage"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="space-y-12"
            >
              
              {/* ASYMMETRICAL EDITORIAL HERO GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2" id="editorial-master-hero">
                
                {/* Left Side: Featured Master Story (2/3 size) */}
                <div className="lg:col-span-8 flex flex-col justify-between">
                  {featuredPost && (
                    <div 
                      onClick={() => setRoute({ type: 'article', id: featuredPost.id })}
                      className="group relative cursor-pointer bg-slate-950 rounded-2xl border border-slate-900 overflow-hidden hover:shadow-[0_12px_40px_rgba(0,0,0,0.85)] hover:border-slate-800 transition-all duration-500 flex flex-col h-full"
                    >
                      {/* Image section with dynamic sizing */}
                      <div className="relative h-64 sm:h-96 w-full overflow-hidden">
                        <img 
                          src={featuredPost.coverImageUrl} 
                          alt={featuredPost.title} 
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-1000"
                        />
                        {/* Immersive photo color blending under dynamic HUE coordinate */}
                        <div 
                          className="absolute inset-0 mix-blend-color opacity-60 group-hover:opacity-30 transition-all duration-700"
                          style={{ backgroundColor: `hsl(${hue}, 80%, 45%)` }}
                        />
                        {/* Gradient shadows overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />
                        
                        {/* Floating visual tags */}
                        <div className="absolute bottom-4 left-4 flex gap-2">
                          <span className="px-2.5 py-1 rounded bg-[#fbbf24] text-slate-950 text-[10px] uppercase font-black tracking-widest font-mono shadow-md">
                            ★ Featured Chronicle
                          </span>
                          <span className="px-2.5 py-1 rounded bg-slate-950/90 text-slate-300 text-[10px] uppercase font-bold tracking-widest font-mono">
                            {getCategory(featuredPost.categoryId).name}
                          </span>
                        </div>

                        {/* Quick Hover action indicator */}
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0 bg-black/80 backdrop-blur border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-1">
                          <span>Begin Reading</span>
                          <ArrowUpRight className="w-3 h-3 text-[#fbbf24]" />
                        </div>
                      </div>

                      {/* Info details Section */}
                      <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4 bg-gradient-to-b from-slate-950/60 to-slate-950/90">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-slate-400 text-xs font-medium">
                            <span className="flex items-center gap-1 text-slate-400"><Calendar className="w-3.5 h-3.5" /> Jun 11, 2026</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {featuredPost.readingTime} min read</span>
                            <span>•</span>
                            <span className="text-[#fbbf24]">By {getAuthor(featuredPost.authorId).fullName}</span>
                          </div>

                          <h2 className="text-2xl sm:text-3.5xl font-black text-white leading-tight group-hover:text-amber-400 transition-colors tracking-tight">
                            {featuredPost.title}
                          </h2>

                          <p className="text-slate-400 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                            {featuredPost.excerpt}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-900 text-xs">
                          {/* Author profile tag */}
                          <div className="flex items-center gap-2">
                            <img 
                              src={getAuthor(featuredPost.authorId).avatarUrl} 
                              alt="" 
                              className="w-7 h-7 rounded-full object-cover border border-slate-800"
                            />
                            <div>
                              <span className="text-white block font-bold text-xs">{getAuthor(featuredPost.authorId).fullName}</span>
                              <span className="text-[9px] text-slate-500 uppercase block font-semibold">Lifestyle Architect</span>
                            </div>
                          </div>

                          {/* Interactive clap + bookmark quick-link combo */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleBookmark(featuredPost.id);
                              }}
                              className="p-1.5 rounded-md hover:bg-slate-900 border border-transparent hover:border-slate-850 transition-all text-slate-400 hover:text-amber-400"
                              title="Bookmark article"
                            >
                              {bookmarks.includes(featuredPost.id) ? (
                                <BookmarkCheck className="w-4 h-4 text-amber-400 fill-amber-400/10" />
                              ) : (
                                <Bookmark className="w-4 h-4" />
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={(e) => handleClap(featuredPost.id, e)}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 relative overflow-visible"
                            >
                              👏 <span className="font-mono text-slate-300 font-bold">{claps[featuredPost.id] || 24}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Side: Trending Stories Stack (1/3 size) */}
                <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-900 flex flex-col h-full justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                        <div className="flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-amber-400 animate-bounce" />
                          <h4 className="text-xs font-black uppercase tracking-widest text-[#fbbf24] font-mono">Trending Stories</h4>
                        </div>
                        <span className="text-[10px] text-slate-500 font-bold">Aura Rank</span>
                      </div>

                      <div className="divide-y divide-slate-900 mt-2">
                        {trendingStories.map((post, idx) => (
                          <div 
                            key={post.id}
                            onClick={() => setRoute({ type: 'article', id: post.id })}
                            className="py-4 flex gap-4 cursor-pointer group transition-colors first:pt-2 last:pb-2"
                          >
                            {/* Prominent editorial ranking number */}
                            <div className="text-3xl font-black font-serif text-slate-800 group-hover:text-amber-500/80 transition-colors w-10 select-none">
                              {`0${idx + 1}`}
                            </div>
                            <div className="flex-1 space-y-1">
                              <span className="text-[8px] uppercase tracking-wider text-slate-500 block font-mono font-bold">
                                {getCategory(post.categoryId).name.split(' & ')[0]}
                              </span>
                              <h5 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-relaxed">
                                {post.title}
                              </h5>
                              <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-1">
                                <img src={getAuthor(post.authorId).avatarUrl} className="w-3.5 h-3.5 rounded-full" alt="" />
                                <span>{getAuthor(post.authorId).fullName}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Vibe calibration highlight */}
                    <div className="p-3 bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/15 rounded-xl space-y-1">
                      <span className="text-[8px] uppercase tracking-wider text-amber-400 font-bold font-mono block">Design Concept</span>
                      <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                        Adjusting the global variable calibrator updates the background stardust canvas to tune your personal reading baseline. Give it a spin!
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Category Badges horizontal filters drawer */}
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-900 pb-4">
                <span className="text-xs text-slate-500 mr-2 uppercase font-black tracking-wider">Explore Hubs:</span>
                <button
                  onClick={() => setRoute({ type: 'home' })}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all ${
                    route.type === 'home'
                      ? 'bg-white text-slate-950 shadow-md'
                      : 'bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white border border-transparent'
                  }`}
                >
                  All Chronicles
                </button>
                {categories.map((cat, index) => {
                  const isSelected = route.type === 'category' && route.id === cat.id;
                  const catHue = (hue + index * 40) % 360;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setRoute({ type: 'category', id: cat.id })}
                      className="px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5"
                      style={
                        isSelected 
                          ? { backgroundColor: `hsl(${catHue}, 80%, 55%)`, color: '#090d16', fontWeight: 'bold' }
                          : { backgroundColor: '#0f172a80', border: `1px solid hsla(${catHue}, 70%, 45%, 0.25)`, color: '#94a3b8' }
                      }
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isSelected ? '#090d16' : `hsl(${catHue}, 80%, 65%)` }} />
                      {cat.name}
                    </button>
                  );
                })}
              </div>

              {/* Two-Column Gazette Feed Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Side: core list grid of journals (lg:col-span-8) */}
                <div className="lg:col-span-8 space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#fbbf24]" />
                    Latest Gazette Chronicles ({finalGridPosts.length})
                  </h3>

                  {finalGridPosts.length === 0 ? (
                    <div className="text-center p-12 bg-slate-950/40 rounded-xl border border-slate-900">
                      <p className="text-xs text-slate-500 italic font-mono">No published articles map inside this curation query.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {finalGridPosts.map((post, idx) => {
                        const postHue = (hue + idx * 30) % 360;
                        const isSaved = bookmarks.includes(post.id);
                        return (
                          <div
                            key={post.id}
                            onClick={() => setRoute({ type: 'article', id: post.id })}
                            className="group cursor-pointer bg-slate-950 rounded-xl border border-slate-900 hover:border-slate-800/80 hover:shadow-[0_10px_35px_rgba(0,0,0,0.85)] overflow-hidden transition-all duration-300 flex flex-col justify-between"
                          >
                            {/* Card Cover image */}
                            <div className="relative h-48 overflow-hidden">
                              <img src={post.coverImageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              <div 
                                className="absolute inset-0 mix-blend-color opacity-30 group-hover:opacity-10 transition-opacity"
                                style={{ backgroundColor: `hsl(${postHue}, 80%, 50%)` }}
                              />
                              <div className="absolute top-3 left-3 flex justify-between w-[calc(100%-24px)]">
                                <span 
                                  className="px-2 py-0.5 rounded text-[9px] uppercase font-black tracking-wider shadow-sm font-mono"
                                  style={{ backgroundColor: `hsla(${postHue}, 85%, 15%, 0.9)`, color: `hsl(${postHue}, 90%, 65%)` }}
                                >
                                  {getCategory(post.categoryId).name.split(' & ')[0]}
                                </span>

                                <button
                                  type="button"
                                  onClick={(e) => toggleBookmark(post.id, e)}
                                  className="p-1.5 rounded-full bg-slate-950/80 backdrop-blur border border-white/5 text-slate-400 hover:text-amber-400 transition-all shadow"
                                >
                                  {isSaved ? (
                                    <BookmarkCheck className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                                  ) : (
                                    <Bookmark className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Card context info */}
                            <div className="p-5 flex-1 flex flex-col justify-between space-y-3 bg-slate-950/30">
                              <div className="space-y-1.5">
                                <div className="flex gap-2 text-slate-500 text-[10px] font-bold font-mono">
                                  <span>Jun 11, 2026</span>
                                  <span>•</span>
                                  <span>{post.readingTime} min read</span>
                                </div>
                                <h4 className="font-extrabold text-sm text-white group-hover:text-amber-400 transition-colors line-clamp-2 leading-relaxed tracking-tight">
                                  {post.title}
                                </h4>
                                <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                                  {post.excerpt}
                                </p>
                              </div>

                              <div className="flex items-center justify-between pt-3 border-t border-slate-900/60 text-xs">
                                <div className="flex items-center gap-1.5">
                                  <img src={getAuthor(post.authorId).avatarUrl} className="w-4 h-4 rounded-full object-cover" alt="" />
                                  <span className="text-slate-300 font-medium text-[11px]">{getAuthor(post.authorId).fullName}</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Right Side: Editorial interactive widgets column (lg:col-span-4) */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Widget 1: Working Author follow segment */}
                  <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 space-y-3.5">
                    <div className="border-b border-slate-900 pb-2 flex items-center justify-between">
                      <h4 className="text-[11px] font-black uppercase tracking-wider text-[#fbbf24] font-mono">Curator Council</h4>
                      <span className="text-[9px] bg-slate-900 border border-slate-850 text-slate-400 px-1.5 py-0.5 rounded">Editorial</span>
                    </div>

                    <div className="space-y-3.5">
                      {profiles.map(prf => {
                        const isFollowing = followedCurators.includes(prf.id);
                        return (
                          <div key={prf.id} className="flex items-start gap-3 text-xs">
                            <img src={prf.avatarUrl} className="w-9 h-9 rounded-full object-cover border border-slate-900 mt-0.5" alt="" />
                            <div className="flex-1 min-w-0 space-y-0.5">
                              <span className="font-bold text-white hover:text-amber-400 transition-colors cursor-pointer select-text block truncate text-[12px]">{prf.fullName}</span>
                              <p className="text-slate-400 text-[10px] line-clamp-1 italic text-slate-400 leading-tight">{prf.bio}</p>
                            </div>
                            <button
                              onClick={() => toggleFollowCurator(prf.id)}
                              className={`px-2 py-1 rounded text-[10px] font-black tracking-wider uppercase cursor-pointer transition-all ${
                                isFollowing 
                                  ? 'bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981]'
                                  : 'bg-slate-900 hover:bg-slate-850 border border-slate-850 hover:border-slate-800 text-slate-300 hover:text-white'
                              }`}
                            >
                              {isFollowing ? '✓ Joined' : '+ Join'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Widget 2: Reading preferences toolbox */}
                  <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 space-y-4">
                    <div className="border-b border-slate-900 pb-2">
                      <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400 font-mono">Reader Toolbox</h4>
                    </div>

                    {/* Font sizes choice */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[11px] text-slate-400 font-bold">
                        <span>Serif Reading Font Scale:</span>
                        <span className="text-white font-mono uppercase text-[9px]">{textSize === 'sm' ? 'Compact' : textSize === 'base' ? 'Standard' : 'Editorial'}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        {(['sm', 'base', 'lg'] as const).map(size => (
                          <button
                            key={size}
                            onClick={() => setTextSize(size)}
                            className={`py-1 text-xs font-bold rounded cursor-pointer transition-colors ${
                              textSize === size
                                ? 'bg-amber-400 text-slate-950'
                                : 'bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white'
                            }`}
                          >
                            {size === 'sm' ? 'Aa-' : size === 'base' ? 'Aa' : 'Aa+'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Active indicators metrics */}
                    <div className="bg-slate-900/30 border border-slate-850 p-3 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Live Viewers Online</span>
                      </div>
                      <span className="font-mono text-xs font-black text-white">{onlineReaders}</span>
                    </div>
                  </div>

                  {/* Widget 3: Newsletter Sign up block */}
                  <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 space-y-3.5 relative overflow-hidden" id="newsletter-sidebar-widget">
                    
                    {/* Glowing highlight corner */}
                    <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

                    <div className="space-y-1 relative z-10">
                      <h4 className="text-xs font-black uppercase text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                        Aura Gazette Newsletter
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        Receive monthly hand-picked design rituals, French culinary reviews, and metropolitan listings. Pure editorial craft.
                      </p>
                    </div>

                    {emailStatus === 'success' ? (
                      <div className="bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981] px-3 py-2 rounded-lg text-[10px] font-bold flex items-center gap-1.5 animate-bounce">
                        <Check className="w-3.5 h-3.5" /> Subscriber Confirmed! Welcome aboard.
                      </div>
                    ) : (
                      <form onSubmit={handleNewsletterSubmit} className="space-y-2 relative z-10">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="bg-slate-900 border border-slate-850 text-xs px-3 py-2 rounded-lg w-full text-white focus:outline-none focus:ring-1 focus:ring-amber-500 text-[11px]"
                          disabled={emailStatus === 'submitting'}
                          required
                        />
                        <button
                          type="submit"
                          className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black tracking-wider uppercase py-2 px-3 rounded-lg w-full text-[10px] cursor-pointer transition-colors flex items-center justify-center gap-1"
                          disabled={emailStatus === 'submitting'}
                        >
                          <Send className="w-3 h-3" /> Subscribe
                        </button>
                      </form>
                    )}
                  </div>

                </div>

              </div>
              
            </motion.div>
          )}

          {/* SINGLE ARTICLE VIEW */}
          {route.type === 'article' && route.id && (() => {
            const article = processedArticle;
            if (!article) return <div className="text-slate-400 font-mono text-xs italic">Article not found in localized index.</div>;
            
            const author = getAuthor(article.authorId);
            const category = getCategory(article.categoryId);
            const articleTags = getTagsForPost(article.tags);
            const postComments = comments.filter(c => c.postId === article.id);
            const isBookmarked = bookmarks.includes(article.id);

            return (
              <motion.div
                key="article"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                ref={articleContainerRef}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative pb-12"
              >
                
                {/* Left Side: Floating reading helper toolbar (lg:col-span-1) */}
                <div className="lg:col-span-1 flex lg:flex-col lg:items-center justify-start gap-3.5 sticky top-24 z-20">
                  <button
                    onClick={() => {
                      setRoute({ type: 'home' });
                      if (onPostSelect) onPostSelect('');
                    }}
                    className="p-2.5 rounded-full bg-slate-950 border border-slate-900 hover:border-slate-800 text-slate-400 hover:text-white cursor-pointer transition-colors"
                    title="Return to latest feed"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => toggleBookmark(article.id)}
                    className={`p-2.5 rounded-full border cursor-pointer transition-colors ${
                      isBookmarked
                        ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                        : 'bg-slate-950 border-slate-900 hover:border-slate-800 text-slate-400 hover:text-amber-400'
                    }`}
                    title="Save this reading bookmark"
                  >
                    <Bookmark className="w-4 h-4 fill-current text-amber-400" />
                  </button>
                  </div>

                {/* Table of Contents - new column */}
                <div className="lg:col-span-2 sticky top-24 z-20">
                  <TableOfContents content={article.content} />
                </div>

                  {/* Dynamic clapping button with rising particles */}
                  <div className="relative">
                    <button
                      onClick={(e) => handleClap(article.id, e)}
                      className="p-2.5 rounded-full bg-slate-950 border border-slate-900 hover:border-slate-800 text-slate-400 hover:text-white cursor-pointer transition-colors flex items-center justify-center relative overflow-visible shadow"
                      title="Clap article support"
                    >
                      <span className="text-sm">👏</span>
                      
                      {/* Floating overlay particle numbers */}
                      <AnimatePresence>
                        {clapParticles.map(p => (
                          <motion.span
                            key={p.id}
                            initial={{ y: 0, opacity: 1, scale: 0.7 }}
                            animate={{ y: p.y, opacity: 0, scale: 1.2 }}
                            exit={{ opacity: 0 }}
                            className="absolute bg-amber-500 text-slate-950 px-1 py-0.2 rounded-full text-[9px] font-black z-30 select-none"
                            style={{ left: `${p.x}px` }}
                          >
                            +1
                          </motion.span>
                        ))}
                      </AnimatePresence>
                    </button>
                    {claps[article.id] && (
                      <span className="absolute -bottom-1 -right-1 bg-slate-900 px-1 rounded text-[8px] font-bold text-slate-400 border border-slate-850">
                        {claps[article.id]}
                      </span>
                    )}
                  </div>

                  <div className="h-px bg-slate-900 lg:w-8 hidden lg:block" />

                  {/* Share button links */}
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-full bg-slate-950 border border-slate-900 hover:border-slate-800 text-slate-400 hover:text-blue-400 cursor-pointer transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                {/* Center Content Column: core article (lg:col-span-8) */}
                <div className="lg:col-span-8 space-y-6 bg-slate-950/40 p-5 sm:p-7 rounded-2xl border border-slate-900">
                  
                  <TableOfContents content={article.content} />
                  
                  {/* Category and reading meta details */}
                  <div className="flex flex-wrap gap-2 items-center text-xs">
                    <span 
                      className="px-2.5 py-0.5 rounded text-[10px] uppercase font-black tracking-widest font-mono"
                      style={{ backgroundColor: `hsla(${hue}, 85%, 15%, 0.9)`, color: `hsl(${hue}, 90%, 65%)` }}
                    >
                      {category.name}
                    </span>
                    <span className="text-slate-700">•</span>
                    <span className="text-slate-400 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Jun 11, 2026</span>
                    <span className="text-slate-700">•</span>
                    <span className="text-slate-400 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {article.readingTime} min read</span>
                  </div>

                  {/* Layout Title */}
                  <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                    {article.title}
                  </h1>

                  {/* Custom Reader text size tuner block */}
                  <div className="flex justify-between items-center py-2 border-y border-slate-900 text-xs">
                    <span className="text-slate-500 font-bold font-mono">READER COMPANION PREFERENCE:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">Scale text</span>
                      <div className="flex bg-slate-900 p-0.5 rounded border border-slate-850">
                        {(['sm', 'base', 'lg'] as const).map(sz => (
                          <button
                            key={sz}
                            onClick={() => setTextSize(sz)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              textSize === sz ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {sz === 'sm' ? 'A-' : sz === 'base' ? 'A' : 'A+'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Excerpt introduction */}
                  <p className="text-slate-400 italic text-sm sm:text-base border-l-4 pl-4 py-2 bg-slate-950/40 border-amber-500">
                    {article.excerpt}
                  </p>

                  {/* Fully formatted cover image section */}
                  <div className="relative h-60 sm:h-96 rounded-xl overflow-hidden border border-slate-900 group">
                    <img src={article.coverImageUrl} alt="" className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-1000" />
                    <div 
                      className="absolute inset-0 mix-blend-color opacity-70"
                      style={{ backgroundColor: `hsl(${hue}, 85%, 55%)` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Embedded Rich text structure */}
                  <article 
                    className={`prose prose-invert max-w-none text-slate-300 leading-relaxed font-sans space-y-5 prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight prose-blockquote:italic prose-blockquote:text-slate-400 prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-a:text-amber-400 hover:prose-a:text-amber-300 transition-colors ${
                      textSize === 'sm' ? 'prose-sm text-[13px] md:text-[14px]' : textSize === 'base' ? 'prose-base text-[14px] md:text-[16px]' : 'prose-lg text-[16px] md:text-[18px]'
                    }`}
                    style={{ '--tw-prose-quote-borders': `hsl(${hue}, 80%, 60%)` } as React.CSSProperties}
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  />

                  {/* Tags cluster post-footer */}
                  <div className="pt-6 border-t border-slate-900 flex justify-between items-center flex-wrap gap-4">
                    <div className="flex flex-wrap gap-1.5">
                      {articleTags.map(t => (
                        <button
                          key={t.id}
                          onClick={() => setRoute({ type: 'tag', id: t.id })}
                          className="bg-slate-900 border border-slate-850 hover:border-slate-800 text-slate-400 hover:text-white px-2.5 py-0.5 rounded text-[10px] font-semibold cursor-pointer"
                        >
                          # {t.name}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded border border-slate-850">
                      <span>🎉</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">
                        {claps[article.id] || 24} claps received
                      </span>
                    </div>
                  </div>

                  {/* Author board Section */}
                  <div className="p-6 bg-slate-950 border border-slate-900 rounded-xl flex items-start gap-4" id="post-author-segment">
                    <img src={author.avatarUrl} alt="" className="w-12 h-12 rounded-full object-cover border border-slate-850 mt-1" />
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex justify-between items-center gap-4 flex-wrap">
                        <div>
                          <h4 className="text-sm font-black text-white">{author.fullName}</h4>
                          <span className="text-[9px] text-slate-500 uppercase tracking-wider font-extrabold block">Aura Curator</span>
                        </div>
                        <button
                          onClick={() => toggleFollowCurator(author.id)}
                          className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${
                            followedCurators.includes(author.id)
                              ? 'bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981]'
                              : 'bg-[#fbbf24] text-slate-950 font-black'
                          }`}
                        >
                          {followedCurators.includes(author.id) ? 'Joined Curations' : 'Join Council'}
                        </button>
                      </div>
                      <p className="text-slate-400 text-xs leading-relaxed select-text">{author.bio}</p>
                    </div>
                  </div>

                  {/* COMMENTS BOX & FEEDBACK FORM */}
                  <div className="pt-8 border-t border-slate-900 space-y-6" id="comments-box-section">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                      <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-amber-500" />
                        Reader Discussions ({postComments.length})
                      </h4>
                      <span className="text-[10px] font-mono text-slate-500 font-bold">Chronicle Comments</span>
                    </div>

                    {/* Feedback Form */}
                    <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 space-y-3">
                      <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-amber-400 block">Add Public Discussion Word</span>
                      
                      {commentStatus && (
                        <div className="bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981] p-2.5 rounded text-xs font-bold animate-pulse">
                          ✓ Comment broadcasted successfully to simulated LocalStorage session database cache.
                        </div>
                      )}

                      <form onSubmit={(e) => handleAddComment(article.id, e)} className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <input
                            type="text"
                            placeholder="Your Name (e.g. Elena R.)"
                            value={newCommentName}
                            onChange={(e) => setNewCommentName(e.target.value)}
                            className="bg-slate-900 border border-slate-850 px-3 py-1.8 text-xs text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-[#fbbf24]"
                            required
                          />
                        </div>
                        <textarea
                          rows={3}
                          placeholder="Join the discussion... write your thoughts or questions for the editors"
                          value={newCommentContent}
                          onChange={(e) => setNewCommentContent(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-850 px-3 py-2 text-xs text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-[#fbbf24]"
                          required
                        />
                        <button
                          type="submit"
                          className="bg-[#fbbf24] hover:bg-amber-500 text-slate-950 font-black uppercase text-[10px] py-1.5 px-3 rounded-lg cursor-pointer transition-colors"
                        >
                          Submit Discussion
                        </button>
                      </form>
                    </div>

                    {/* Discussions List */}
                    <div className="space-y-4">
                      {postComments.length === 0 ? (
                        <p className="text-xs text-slate-500 italic text-center py-4">Be the first to provide thoughts on this journal!</p>
                      ) : (
                        postComments.map(comment => (
                          <div 
                            key={comment.id}
                            className="p-4 rounded-xl bg-slate-900/40 border border-slate-850 space-y-2.5 flex gap-3 h-full items-start"
                          >
                            <img src={comment.avatarUrl} className="w-8 h-8 rounded-full border border-slate-800 object-cover mt-0.5" alt="" />
                            <div className="space-y-1 flex-1">
                              <div className="flex justify-between items-center text-[10px] font-bold">
                                <span className="text-white font-extrabold">{comment.authorName}</span>
                                <span className="text-slate-500 font-mono">Jun 11, 2026</span>
                              </div>
                              <p className="text-slate-350 text-xs leading-relaxed select-text">{comment.content}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                  </div>

                </div>

                {/* Right Side: Table of Content drawer inside Article viewing (lg:col-span-3) */}
                <div className="lg:col-span-3 space-y-6 sticky top-24">
                  
                  {/* Visual Category reference box */}
                  <div className="p-4 bg-slate-950 border border-slate-900 rounded-xl space-y-3">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono">Journal Details</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between border-b border-slate-900 pb-1.5">
                        <span className="text-slate-500 font-bold">Status:</span>
                        <span className="text-[#10b981] font-black uppercase text-[10px]">● Live Published</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-900 pb-1.5">
                        <span className="text-slate-500 font-bold">Audience:</span>
                        <span className="text-slate-300 font-semibold">Public Reader</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-900 pb-1.5">
                        <span className="text-slate-500 font-bold">Claps Given:</span>
                        <span className="text-amber-400 font-mono font-black">{claps[article.id] || 24}</span>
                      </div>
                    </div>
                  </div>

                  {/* Mini recommended row widgets */}
                  <div className="bg-slate-950/40 border border-slate-900 p-4 rounded-xl space-y-3">
                    <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">Further Readings</h4>
                    <div className="space-y-4">
                      {posts.filter(p => p.status === 'published' && p.id !== article.id).slice(0, 3).map(rel => (
                        <div 
                          key={rel.id}
                          onClick={() => {
                            setRoute({ type: 'article', id: rel.id });
                            window.scrollTo({ top: 320, behavior: 'smooth' });
                          }}
                          className="space-y-1 cursor-pointer group"
                        >
                          <span className="text-[8px] uppercase tracking-wider text-amber-400 font-bold font-mono">
                            {getCategory(rel.categoryId).name.split(' & ')[0]}
                          </span>
                          <h5 className="text-[11px] font-bold text-white group-hover:text-amber-300 line-clamp-2 leading-snug transition-colors">
                            {rel.title}
                          </h5>
                          <span className="text-[9px] text-slate-550 font-mono flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" /> {rel.readingTime}m read
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </motion.div>
            );
          })()}

          {/* FILTERED FEEDS VIEW (Category / Tag / Search matches) */}
          {(route.type === 'category' || route.type === 'tag' || route.type === 'search') && (
            <motion.div
              key="filtered-feed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8 pb-12"
            >
              <div className="flex justify-between items-center flex-wrap gap-4 border-b border-slate-900 pb-4">
                <button
                  onClick={() => {
                    setRoute({ type: 'home' });
                    if (onPostSelect) onPostSelect('');
                  }}
                  className="px-3.5 py-1.8 rounded-lg bg-slate-950 border border-slate-900 hover:border-slate-800 text-xs text-slate-300 cursor-pointer flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to latest Chronicles
                </button>

                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block font-mono">Curated Selection Feed</span>
                  <p className="text-sm font-black text-white uppercase tracking-wider">
                    {route.type === 'category' && `${categories.find(c => c.id === route.id)?.name || 'Category'}`}
                    {route.type === 'tag' && `#${tags.find(t => t.id === route.id)?.name || 'Tag'}`}
                    {route.type === 'search' && `Matches for: "${route.id}"`}
                  </p>
                </div>
              </div>

              {/* Grid content matching */}
              {getFilteredPosts().length === 0 ? (
                <div className="text-center py-20 bg-slate-950/20 rounded-xl border border-slate-900">
                  <p className="text-xs text-slate-500 italic font-mono">No published articles map inside this curation query context.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                  {getFilteredPosts().map((post, idx) => {
                    const postHue = (hue + idx * 30) % 360;
                    const isSaved = bookmarks.includes(post.id);
                    return (
                      <div
                        key={post.id}
                        onClick={() => setRoute({ type: 'article', id: post.id })}
                        className="group cursor-pointer bg-slate-950 rounded-xl border border-slate-900 hover:border-slate-800/80 hover:shadow-[0_10px_35px_rgba(0,0,0,0.85)] overflow-hidden transition-all duration-300 flex flex-col justify-between"
                      >
                        <div className="relative h-44 overflow-hidden">
                          <img src={post.coverImageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div 
                            className="absolute inset-0 mix-blend-color opacity-30 group-hover:opacity-10 transition-opacity"
                            style={{ backgroundColor: `hsl(${postHue}, 80%, 50%)` }}
                          />
                          <div className="absolute top-3 left-3 flex justify-between w-[calc(100%-24px)]">
                            <span 
                              className="px-2 py-0.5 rounded text-[9px] uppercase font-black tracking-wider shadow-sm font-mono"
                              style={{ backgroundColor: `hsla(${postHue}, 85%, 15%, 0.9)`, color: `hsl(${postHue}, 90%, 65%)` }}
                            >
                              {getCategory(post.categoryId).name.split(' & ')[0]}
                            </span>

                            <button
                              type="button"
                              onClick={(e) => toggleBookmark(post.id, e)}
                              className="p-1.5 rounded-full bg-slate-950/80 backdrop-blur border border-white/5 text-slate-400 hover:text-amber-400 transition-all shadow"
                            >
                              {isSaved ? (
                                <BookmarkCheck className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                              ) : (
                                <Bookmark className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between space-y-3 bg-slate-950/30">
                          <div className="space-y-1.5">
                            <div className="flex gap-2 text-slate-500 text-[10px] font-bold font-mono">
                              <span>Jun 11, 2026</span>
                              <span>•</span>
                              <span>{post.readingTime} min read</span>
                            </div>
                            <h4 className="font-extrabold text-sm text-white group-hover:text-amber-400 transition-colors line-clamp-2 leading-relaxed tracking-tight">
                              {post.title}
                            </h4>
                            <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                              {post.excerpt}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-slate-900/60 text-xs">
                            <div className="flex items-center gap-1.5">
                              <img src={getAuthor(post.authorId).avatarUrl} className="w-4 h-4 rounded-full object-cover" alt="" />
                              <span className="text-slate-300 font-medium text-[11px]">{getAuthor(post.authorId).fullName}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-500" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
};
