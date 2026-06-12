import React, { useState } from 'react';
import { Post, Category, Tag, Profile, PostReview, SiteSettings } from '../types';
import { useHue } from './HueEngine';
import { RichTextEditor } from './RichTextEditor';
import { 
  LayoutDashboard, BookOpen, Layers, Bookmark, Users, HardDrive, BarChart3, Settings, 
  Plus, Edit, Eye, Trash, RefreshCw, CheckCircle, Search, MessageSquare, AlertCircle, FileText, Ban, Trash2, ArrowUpRight, Copy, Download,
  Sliders, Database, Shield, LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CopyPromptDepot } from './CopyPromptDepot';

interface AdminDashboardProps {
  posts: Post[];
  categories: Category[];
  tags: Tag[];
  profiles: Profile[];
  reviews: PostReview[];
  settings: SiteSettings;
  currentProfile: Profile;
  onUpdatePosts: (updatedPosts: Post[]) => void;
  onUpdateProfiles: (updatedProfiles: Profile[]) => void;
  onUpdateSettings: (updatedSettings: SiteSettings) => void;
  onAddReviewComment: (newReview: PostReview) => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  posts,
  categories,
  tags,
  profiles,
  reviews,
  settings,
  currentProfile,
  onUpdatePosts,
  onUpdateProfiles,
  onUpdateSettings,
  onAddReviewComment,
  onLogout,
}) => {
  const { hue, speed, setSpeed, isPaused, setIsPaused, particleCount, setParticleCount, auroraOpacity, setAuroraOpacity, activeAccentColor } = useHue();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'posts' | 'review' | 'categories' | 'tags' | 'users' | 'media' | 'analytics' | 'settings' | 'atmosphere' | 'blueprints'>('dashboard');
  const [activeSpecSubTab, setActiveSpecSubTab] = useState<'schema' | 'roles' | 'prompts' | 'checklist'>('schema');

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
  
  // Filtering and searching posts list
  const [postStatusFilter, setPostStatusFilter] = useState<string>('all');
  const [postSearchQuery, setPostSearchQuery] = useState<string>('');
  const [postPage, setPostPage] = useState<number>(1);
  const [editingPost, setEditingPost] = useState<Post | null | undefined>(undefined); // undefined means list, null means new post

  // Review state
  const [activeReviewPost, setActiveReviewPost] = useState<Post | null>(null);
  const [reviewComment, setReviewComment] = useState<string>('');

  // User Management
  const [newUserName, setNewUserName] = useState<string>('');
  const [newUserEmail, setNewUserEmail] = useState<string>('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'editor_in_chief' | 'editor'>('editor');
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);

  // Categories CRUD
  const [newCatName, setNewCatName] = useState<string>('');
  const [newCatSlug, setNewCatSlug] = useState<string>('');
  const [newCatDesc, setNewCatDesc] = useState<string>('');

  // Local helper functions
  const getAuthorName = (authorId: string) => {
    return profiles.find(p => p.id === authorId)?.fullName || 'External Writter';
  };

  const getCategoryName = (catId: string) => {
    return categories.find(c => c.id === catId)?.name || 'General';
  };

  // Check roles accessibility (Enterprise Role-Gating)
  const hasAccess = (allowedRoles: string[]) => {
    return allowedRoles.includes(currentProfile.role);
  };

  // Metrics indicators
  const totalPosts = posts.length;
  const publishedCount = posts.filter(p => p.status === 'published').length;
  const draftsCount = posts.filter(p => p.status === 'draft').length;
  const inReviewCount = posts.filter(p => p.status === 'in_review').length;
  const totalPostViews = posts.reduce((acc, p) => acc + (p.viewCount || 0), 0);

  // Invite handler
  const handleInviteUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    const newProfile: Profile = {
      id: `user-${Date.now()}`,
      fullName: newUserName,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      role: newUserRole,
      bio: `Professional workspace content compiler as an ${newUserRole.replace(/_/g, ' ')}.`,
      slug: newUserName.toLowerCase().replace(/\s+/g, '-'),
      createdAt: new Date().toISOString()
    };

    onUpdateProfiles([...profiles, newProfile]);
    setNewUserName('');
    setNewUserEmail('');
    setShowInviteModal(false);
  };

  // Add Category Handler
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName || !newCatSlug) return;
    
    // Check if category doesn't already exist
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: newCatName,
      slug: newCatSlug,
      description: newCatDesc,
      coverImageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=400',
      sortOrder: categories.length + 1
    };
    
    // In our simplified state updates, we can update parent component's arrays
    // For this prototype, we'll append. To make it dynamic, let's keep localized categories
    categories.push(newCat);
    setNewCatName('');
    setNewCatSlug('');
    setNewCatDesc('');
  };

  // Delete Category list action
  const handleDeleteCategory = (catId: string) => {
    const idx = categories.findIndex(c => c.id === catId);
    if (idx !== -1) {
      categories.splice(idx, 1);
      // Trigger update on parent posts to reset deleted categories
      const updated = posts.map(p => p.categoryId === catId ? { ...p, categoryId: categories[0]?.id || '' } : p);
      onUpdatePosts(updated);
    }
  };

  // Save/Edit Post callback
  const handlePostSave = (postData: Partial<Post>) => {
    if (editingPost) {
      // Edit existing post
      const updated = posts.map(p => p.id === editingPost.id ? { ...p, ...postData } as Post : p);
      onUpdatePosts(updated);
    } else {
      // Create new post
      const newPost: Post = {
        id: `post-${Date.now()}`,
        viewCount: 0,
        createdAt: new Date().toISOString(),
        ...postData
      } as Post;
      onUpdatePosts([newPost, ...posts]);
    }
    setEditingPost(undefined);
  };

  // Delete Post list action
  const handleDeletePost = (postId: string) => {
    const confirmed = window.confirm("Are you sure you want to permanently delete this post? This cannot be undone.");
    if (confirmed) {
      const updated = posts.filter(p => p.id !== postId);
      onUpdatePosts(updated);
    }
  };

  // Change post status gate
  const handleUpdateStatus = (postId: string, newStatus: Post['status']) => {
    const updated = posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          status: newStatus,
          ...(newStatus === 'published' ? { publishedAt: new Date().toISOString() } : {})
        };
      }
      return p;
    });
    onUpdatePosts(updated);
  };

  // Review Queue actions
  const handleReviewAction = (action: 'approved' | 'changes_requested') => {
    if (!activeReviewPost) return;

    const newStatus: Post['status'] = action === 'approved' ? 'published' : 'draft';
    
    // Save review audit log
    const audit: PostReview = {
      id: `rev-${Date.now()}`,
      postId: activeReviewPost.id,
      reviewerId: currentProfile.id,
      comment: reviewComment || `Status transition: ${action.replace(/_/g, ' ').toUpperCase()}`,
      action,
      createdAt: new Date().toISOString()
    };

    onAddReviewComment(audit);

    // Update Post status
    const updated = posts.map(p => {
      if (p.id === activeReviewPost.id) {
        return {
          ...p,
          status: newStatus,
          ...(newStatus === 'published' ? { publishedAt: new Date().toISOString() } : {})
        };
      }
      return p;
    });

    onUpdatePosts(updated);
    setReviewComment('');
    setActiveReviewPost(null);
  };

  // Export static database content as JSON download - settings danger zone
  const handleExportDataAsJSON = () => {
    const packageJSONData = {
      exportTimestamp: new Date().toISOString(),
      blogSettings: settings,
      contributorsProfiles: profiles,
      registeredCategories: categories,
      allArticlesPosts: posts,
      editorialReviews: reviews
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(packageJSONData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${settings.blogName.toLowerCase().replace(/\s+/g, '_')}_editorial_backup.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filter posts arrays for datatable
  const datatablePosts = posts.filter(p => {
    const matchesStatus = postStatusFilter === 'all' || p.status === postStatusFilter;
    const matchesSearch = p.title.toLowerCase().includes(postSearchQuery.toLowerCase()) || 
                          getAuthorName(p.authorId).toLowerCase().includes(postSearchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const postsPerPage = 5;
  const totalPages = Math.ceil(datatablePosts.length / postsPerPage) || 1;
  const paginatedPosts = datatablePosts.slice((postPage - 1) * postsPerPage, postPage * postsPerPage);

  const sidebarMenuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, roles: ['admin', 'editor_in_chief', 'editor'] },
    { id: 'atmosphere', label: 'Atmosphere Studio', icon: Sliders, roles: ['admin', 'editor_in_chief', 'editor'] },
    { id: 'posts', label: 'Post Manager', icon: BookOpen, roles: ['admin', 'editor_in_chief', 'editor'] },
    { id: 'review', label: 'Review Queue', icon: Bookmark, badge: inReviewCount, roles: ['admin', 'editor_in_chief'] },
    { id: 'categories', label: 'Categories Hub', icon: Layers, roles: ['admin', 'editor_in_chief'] },
    { id: 'users', label: 'User Directory', icon: Users, roles: ['admin'] },
    { id: 'media', label: 'Media Library', icon: HardDrive, roles: ['admin', 'editor_in_chief', 'editor'] },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, roles: ['admin', 'editor_in_chief'] },
    { id: 'settings', label: 'Site Settings', icon: Settings, roles: ['admin'] },
    { id: 'blueprints', label: 'System Blueprints', icon: Database, roles: ['admin', 'editor_in_chief', 'editor'] },
  ];

  const allowedTabs = sidebarMenuItems.filter(item => hasAccess(item.roles));

  // If a user currently has a tab that's role-blocked, fallback safely!
  if (editingPost === undefined && !allowedTabs.find(t => t.id === activeTab)) {
    setActiveTab(allowedTabs[0]?.id as any || 'dashboard');
  }

  // Intercept view to render Post Editor
  if (editingPost !== undefined) {
    return (
      <div className="max-w-6xl mx-auto py-2 px-1">
        <RichTextEditor
          post={editingPost}
          categories={categories}
          tags={tags}
          profiles={profiles}
          currentProfile={currentProfile}
          onSave={handlePostSave}
          onCancel={() => setEditingPost(undefined)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 text-slate-100 min-h-screen pb-16" id="dashboard-system-layout">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 flex-shrink-0 bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col justify-between" id="dashboard-sidebar">
        <div className="space-y-6">
          <div className="border-b border-slate-850 pb-3">
            <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block">Editorial Dashboard</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-white font-extrabold text-sm">{settings.blogName}</span>
              <span className="text-[9px] bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded uppercase">CONSOLE</span>
            </div>
          </div>

          <nav className="space-y-1.5 flex flex-col">
            {sidebarMenuItems.map((item) => {
              const isAllowed = hasAccess(item.roles);
              const isActive = activeTab === item.id;
              
              if (!isAllowed) return null;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setPostPage(1);
                  }}
                  className={`w-full px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between cursor-pointer transition-all ${
                    isActive 
                      ? 'bg-slate-100 text-slate-950' 
                      : 'hover:bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span 
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${
                        isActive ? 'bg-amber-600 text-white' : 'bg-amber-500/20 text-amber-500'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card inside Sidebar */}
        <div className="pt-4 mt-6 border-t border-slate-850 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <img src={currentProfile.avatarUrl} alt="" className="w-8 h-8 rounded-full border border-slate-800" />
              <div className="flex-1 min-w-0">
                <h5 className="text-xs font-bold text-white truncate">{currentProfile.fullName}</h5>
                <span 
                  className="text-[9px] font-bold px-1 py-0.2 rounded uppercase"
                  style={{ backgroundColor: `hsla(${hue}, 85%, 15%, 0.4)`, color: `hsl(${hue}, 85%, 65%)` }}
                >
                  {currentProfile.role.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="text-slate-500 hover:text-rose-400 p-1.5 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-1 space-y-6" id="dashboard-main-panel">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center flex-wrap gap-4 border-b border-slate-850 pb-4">
              <div>
                <h1 className="text-xl md:text-2xl font-black text-white">System Diagnostics</h1>
                <p className="text-xs text-slate-400">Activity monitor compiled at Real-Time for credentials verification and diagnostic reports.</p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-lg cursor-pointer flex items-center gap-1.5 transition-colors border border-emerald-550"
                >
                  <Plus className="w-4 h-4" /> New Article draft
                </button>
              </div>
            </div>

            {/* Quick Analytics Stats cards (Grid layout) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Articles', count: totalPosts, icon: FileText, color: 'text-slate-200' },
                { label: 'Live Published', count: publishedCount, icon: CheckCircle, color: 'text-emerald-500' },
                { label: 'Pending Review', count: inReviewCount, icon: Bookmark, color: 'text-amber-500' },
                { label: 'Total Traffic', count: totalPostViews, icon: BarChart3, color: 'text-sky-500' },
              ].map((stat, i) => (
                <div key={i} className="bg-slate-950/60 border border-slate-850 p-4 rounded-xl flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">{stat.label}</span>
                    <span className="text-lg font-black text-white block">{stat.count}</span>
                  </div>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              ))}
            </div>

            {/* Simulated Analytical Graph using SVG layout (Prompt B, F aligned) */}
            <div className="bg-slate-950 border border-slate-850 p-5 rounded-xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase">Traffic Distribution Over Last 6 Months</h4>
                <span className="text-[10px] text-slate-500">60-day tracking index</span>
              </div>

              {/* Vector SVG line graph */}
              <div className="relative h-44 w-full">
                {/* Horizontal grid lines */}
                <div className="absolute inset-x-0 top-0 h-px bg-slate-900" />
                <div className="absolute inset-x-0 top-1/3 h-px bg-slate-900" />
                <div className="absolute inset-x-0 top-2/3 h-px bg-slate-900" />
                
                <svg className="w-full h-full text-slate-800" viewBox="0 0 600 150" fill="none">
                  <defs>
                    <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={`hsl(${hue}, 85%, 65%)`} stopOpacity="0.18" />
                      <stop offset="100%" stopColor={`hsl(${hue}, 80%, 45%)`} stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Filled Area beneath curve */}
                  <path
                    d="M 50 120 Q 150 70 250 85 T 450 30 T 550 40 L 550 150 L 50 150 Z"
                    fill="url(#chart-area-grad)"
                  />

                  {/* Main Shifting Color Curve line */}
                  <path
                    d="M 50 120 Q 150 70 250 85 T 450 30 T 550 40"
                    stroke={`hsl(${hue}, 85%, 60%)`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Monthly Plot Nodes */}
                  {[
                    { cx: 50, cy: 120, val: 'Jan: 120v' },
                    { cx: 160, cy: 75, val: 'Feb: 290v' },
                    { cx: 250, cy: 85, val: 'Mar: 340v' },
                    { cx: 370, cy: 45, val: 'Apr: 680v' },
                    { cx: 470, cy: 30, val: 'May: 920v' },
                    { cx: 550, cy: 40, val: 'Jun: Total' }
                  ].map((nd, idx) => (
                    <g key={idx} className="group cursor-pointer">
                      <circle
                        cx={nd.cx}
                        cy={nd.cy}
                        r="5.5"
                        fill="#020617"
                        stroke={`hsl(${hue}, 85%, 65%)`}
                        strokeWidth="2.5"
                      />
                      <text x={nd.cx} y={nd.cy - 12} fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle">
                        {nd.val}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            {/* Side-by-side feed layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Recent activity log lists */}
              <div className="lg:col-span-12 bg-slate-950/80 border border-slate-850 rounded-xl p-4 space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-900">Recent Action Audit Stream</h4>
                
                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2 text-xs">
                  {posts.slice(0, 5).map((p, i) => (
                    <div key={i} className="flex gap-3 justify-between items-start py-2 border-b border-slate-900 last:border-0">
                      <div className="flex gap-2.5">
                        <div 
                          className="w-1.5 h-10 rounded" 
                          style={{ 
                            backgroundColor: p.status === 'published' ? '#10b981' : p.status === 'in_review' ? '#f59e0b' : '#64748b' 
                          }}
                        />
                        <div>
                          <p className="text-white font-medium">{p.title}</p>
                          <p className="text-slate-500 text-[10px] mt-0.5">Written by {getAuthorName(p.authorId)} • Status: {p.status.toUpperCase()}</p>
                        </div>
                      </div>
                      
                      <span className="text-[9px] text-slate-500 italic flex-shrink-0">Jun 11, 2026</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* POSTS LIST TAB */}
        {activeTab === 'posts' && (
          <div className="bg-slate-950 border border-slate-850 rounded-xl p-5 space-y-6">
            
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h2 className="text-lg font-black text-white">Post Directory</h2>
                <p className="text-xs text-slate-500">Query other articles, re-route draft statuses, or perform deletions.</p>
              </div>

              <button
                type="button"
                onClick={() => setEditingPost(null)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" /> New Article
              </button>
            </div>

            {/* Searching Filters Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-900 pb-3">
              <div className="flex gap-1.5 flex-wrap">
                {[
                  { id: 'all', label: 'All Articles' },
                  { id: 'draft', label: 'Drafts' },
                  { id: 'in_review', label: 'In Review' },
                  { id: 'published', label: 'Published' },
                  { id: 'archived', label: 'Archived' }
                ].map((tb) => (
                  <button
                    key={tb.id}
                    onClick={() => {
                      setPostStatusFilter(tb.id);
                      setPostPage(1);
                    }}
                    className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
                      postStatusFilter === tb.id 
                        ? 'bg-slate-800 text-white' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    {tb.label}
                  </button>
                ))}
              </div>

              {/* Title Filter Search Option */}
              <div className="relative w-full sm:w-48">
                <input
                  type="text"
                  value={postSearchQuery}
                  onChange={(e) => {
                    setPostSearchQuery(e.target.value);
                    setPostPage(1);
                  }}
                  placeholder="Filter by title..."
                  className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white pl-8 w-full focus:outline-none"
                />
                <Search className="w-3.5 h-3.5 text-slate-550 absolute left-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Datatable Structure */}
            <div className="overflow-x-auto min-w-full">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-900 text-slate-500 uppercase font-black tracking-wider bg-slate-950/40">
                    <th className="py-2.5 px-4 font-black">Title</th>
                    <th className="py-2.5 px-4 font-black">Author</th>
                    <th className="py-2.5 px-4 font-black">Category</th>
                    <th className="py-2.5 px-4 font-black">Status</th>
                    <th className="py-2.5 px-4 font-black text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/60 font-medium">
                  {paginatedPosts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500 italic">No articles found matching this filter set.</td>
                    </tr>
                  ) : (
                    paginatedPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-slate-900/35 transition-colors">
                        <td className="py-3 px-4 max-w-[280px]">
                          <p className="text-white font-bold truncate" title={post.title}>{post.title}</p>
                          <p className="text-slate-500 text-[10px] mt-0.5 font-mono">/{post.slug}</p>
                        </td>
                        <td className="py-3 px-4 text-slate-300 whitespace-nowrap">{getAuthorName(post.authorId)}</td>
                        <td className="py-3 px-4 text-slate-300 whitespace-nowrap">{getCategoryName(post.categoryId)}</td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span 
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded capitalize ${
                              post.status === 'published' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                              post.status === 'in_review' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                              post.status === 'archived' ? 'bg-slate-805 text-slate-400' :
                              'bg-indigo-500/10 text-indigo-400'
                            }`}
                          >
                            {post.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex gap-1.5 justify-end">
                            
                            {/* Editor Button (All roles can trigger edit on own posts, custom gating fits inside editor) */}
                            <button
                              onClick={() => setEditingPost(post)}
                              className="bg-slate-900 hover:bg-slate-850 text-slate-300 p-1.5 rounded transition-colors"
                              title="Edit Article details"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            {/* Gate publish actions: EIC and Admin only */}
                            {['admin', 'editor_in_chief'].includes(currentProfile.role) && (
                              <>
                                {post.status !== 'published' ? (
                                  <button
                                    onClick={() => handleUpdateStatus(post.id, 'published')}
                                    className="bg-emerald-950/60 hover:bg-emerald-900 text-emerald-400 p-1.5 rounded border border-emerald-900/20 transition-colors"
                                    title="Approve and Publish Live"
                                  >
                                    <CheckCircle className="w-3.5 h-3.5" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleUpdateStatus(post.id, 'draft')}
                                    className="bg-amber-950/60 hover:bg-amber-900 text-amber-400 p-1.5 rounded border border-amber-900/20 transition-colors"
                                    title="Unpublish (Convert back to Draft)"
                                  >
                                    <Ban className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </>
                            )}

                            {/* Gate Delete posts: EIC & Admin only */}
                            {['admin', 'editor_in_chief'].includes(currentProfile.role) && (
                              <button
                                onClick={() => handleDeletePost(post.id)}
                                className="bg-rose-950/60 hover:bg-rose-900 text-rose-400 p-1.5 rounded border border-rose-900/20 transition-colors"
                                title="Delete Post permanently"
                              >
                                <Trash className="w-3.5 h-3.5" />
                              </button>
                            )}

                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination UI Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-900 pt-4 text-[10px] text-slate-500 font-bold">
                <span>Showing page {postPage} of {totalPages}</span>
                <div className="flex gap-1.5">
                  <button
                    disabled={postPage === 1}
                    onClick={() => setPostPage(postPage - 1)}
                    className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-850 hover:text-white disabled:pointer-events-none disabled:opacity-40"
                  >
                    ◀ Prev
                  </button>
                  <button
                    disabled={postPage === totalPages}
                    onClick={() => setPostPage(postPage + 1)}
                    className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-850 hover:text-white disabled:pointer-events-none disabled:opacity-40"
                  >
                    Next ▶
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* REVIEW QUEUE TAB (Admin & EIC) */}
        {activeTab === 'review' && (
          <div className="space-y-6">
            <div className="bg-slate-950 border border-slate-850 rounded-xl p-5 space-y-4">
              <div>
                <h2 className="text-lg font-black text-white">Review Queue Dashboard</h2>
                <p className="text-xs text-slate-400">Content queued recursively. Preview, Approve to published status, or dispatch review comments.</p>
              </div>

              {posts.filter(p => p.status === 'in_review').length === 0 ? (
                <div className="text-center py-12 bg-slate-900/10 border border-slate-900 rounded-lg">
                  <p className="text-xs text-slate-500 italic">Prinstine Queue. No drafts are currently awaiting review.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {posts.filter(p => p.status === 'in_review').map((post) => (
                    <div 
                      key={post.id} 
                      onClick={() => {
                        setActiveReviewPost(post);
                        setReviewComment('');
                      }}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        activeReviewPost?.id === post.id 
                          ? 'bg-slate-900 border-amber-600/60' 
                          : 'bg-slate-950 hover:bg-slate-900 border-slate-850'
                      }`}
                    >
                      <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-500">In Review</span>
                      <h4 className="text-xs font-bold text-white mt-2 mb-1">{post.title}</h4>
                      <p className="text-slate-400 text-[10px] line-clamp-2">{post.excerpt}</p>
                      
                      <div className="flex justify-between items-center pt-3 mt-3 border-t border-slate-900 text-[10px] text-slate-500">
                        <span>Author: {getAuthorName(post.authorId)}</span>
                        <span className="text-slate-300 font-bold">Inspect details →</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Split Screen Modal review compiler */}
            {activeReviewPost && (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-5 animate-fade-in">
                <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                  <h3 className="text-xs font-bold text-slate-350 uppercase">Inspect: {activeReviewPost.title}</h3>
                  <button 
                    onClick={() => setActiveReviewPost(null)}
                    className="text-slate-500 hover:text-white text-xs"
                  >
                    Collapse
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Left Column Previewer */}
                  <div className="max-h-[340px] overflow-y-auto border border-slate-900 p-4 bg-slate-950/40 rounded-lg space-y-4">
                    <img src={activeReviewPost.coverImageUrl} alt="" className="w-full h-24 object-cover rounded" />
                    <h2 className="text-sm font-bold text-white">{activeReviewPost.title}</h2>
                    
                    <div 
                      className="text-slate-300 text-xs leading-relaxed space-y-2.5 font-mono"
                      dangerouslySetInnerHTML={{ __html: activeReviewPost.content }}
                    />
                  </div>

                  {/* Right Column Auditor action pane */}
                  <div className="space-y-4 p-4 bg-slate-900/20 border border-slate-850 rounded-lg">
                    <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Auditor Decision Platform</h4>
                    
                    <div>
                      <label className="text-[10px] font-medium text-slate-400 block mb-1">Feedback/Modifications Comments (*Required on requesting changes)</label>
                      <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        rows={4}
                        placeholder="State clear, helpful recommendations on what should be revised or added..."
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white focus:ring-1 focus:ring-slate-700 font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={() => handleReviewAction('changes_requested')}
                        className="bg-amber-950/65 hover:bg-amber-900 hover:text-white border border-amber-800/20 text-amber-500 px-3 py-2 rounded text-xs font-black transition-all cursor-pointer"
                      >
                        Request Changes
                      </button>

                      <button
                        onClick={() => handleReviewAction('approved')}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded text-xs font-black transition-all cursor-pointer"
                      >
                        Approve &amp; Publish
                      </button>
                    </div>

                    <div className="p-3 bg-slate-950/80 rounded border border-slate-850 space-y-2 text-[10px] text-slate-500">
                      <span className="font-bold text-slate-400 block">Review Archive Logs</span>
                      {reviews.filter(r => r.postId === activeReviewPost.id).length === 0 ? (
                        <p className="italic">No past edits registered on this post.</p>
                      ) : (
                        reviews.filter(r => r.postId === activeReviewPost.id).map((r, index) => (
                          <div key={index} className="border-b border-slate-900/60 pb-1.5 last:border-0 last:pb-0">
                            <span className="text-amber-500 font-semibold">{r.action.replace('_', ' ').toUpperCase()}</span>
                            <span className="text-slate-600"> • by {getAuthorName(r.reviewerId)}</span>
                            <p className="text-slate-400 italic mt-0.5">{r.comment}</p>
                          </div>
                        ))
                      )}
                    </div>

                  </div>

                </div>
              </div>
            )}
          </div>
        )}

        {/* CATEGORIES HUB TAB */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
            {/* Left list table */}
            <div className="lg:col-span-7 bg-slate-950 border border-slate-855 rounded-xl p-5 space-y-4">
              <h2 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-900 pb-2">Registered Editorial categories</h2>

              <div className="space-y-2 text-xs">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex justify-between items-center p-3 bg-slate-900/40 border border-slate-850 rounded-lg">
                    <div>
                      <h4 className="font-bold text-white">{cat.name}</h4>
                      <p className="text-slate-500 text-[10px] truncate max-w-sm">{cat.description}</p>
                    </div>

                    <div className="flex gap-2">
                      <span className="text-[10px] bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-850">
                        {posts.filter(p => p.categoryId === cat.id).length} post(s)
                      </span>

                      {categories.length > 1 && (
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="text-rose-400 hover:text-rose-300 p-0.5 transition-colors"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right add category form */}
            <div className="lg:col-span-5 bg-slate-950 border border-slate-850 p-5 rounded-xl space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-900">Add New Category Segment</h4>
              
              <form onSubmit={handleAddCategory} className="space-y-3.5 text-xs">
                <div>
                  <label className="text-[10px] font-medium text-slate-400 block mb-1">Human Name</label>
                  <input
                    type="text"
                    value={newCatName}
                    onChange={(e) => {
                      setNewCatName(e.target.value);
                      setNewCatSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                    }}
                    placeholder="e.g. Visual Mechanics"
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-medium text-slate-400 block mb-1">Slug URL Tag</label>
                  <input
                    type="text"
                    value={newCatSlug}
                    onChange={(e) => setNewCatSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                    placeholder="e.g. visual-mechanics"
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-medium text-slate-400 block mb-1">Description</label>
                  <textarea
                    value={newCatDesc}
                    onChange={(e) => setNewCatDesc(e.target.value)}
                    rows={3}
                    placeholder="Short summary detailing which styling or system topics cover this hub..."
                    className="w-full bg-slate-900 border border-slate-800 rounded p-2 focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-100 hover:bg-white text-slate-950 font-bold py-2 rounded pointer-events-auto cursor-pointer text-xs"
                >
                  Create Segment
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ATMOSPHERE CONTROL STUDIO TAB */}
        {activeTab === 'atmosphere' && (
          <motion.div
            key="atmosphere-area"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6 animate-fade-in text-xs text-slate-300"
          >
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-widest text-[#d97706] font-extrabold font-mono">Live Variable Calibrator</span>
              <h2 className="text-xl md:text-2xl font-black text-white">AuraLife Ambient Studio</h2>
              <p className="text-slate-400 text-xs font-sans">Calibrate the viewport's core physics, floating stardust, and spectrum shift variables to craft your premium reading mood.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Visual adjustment console */}
              <div className="bg-slate-950 border border-slate-850 p-5 rounded-xl space-y-4">
                <h3 className="text-xs font-bold text-white uppercase border-b border-slate-900 pb-2 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-slate-300" />
                  Physics Multipliers Controls
                </h3>

                {/* Core speed slide slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-semibold text-slate-300">
                    <span>Atmosphere Shifting Velocity</span>
                    <span className="text-white font-mono">{isPaused ? 'FREEZED' : `${speed.toFixed(3)} deg/f`}</span>
                  </div>
                  <input
                    type="range"
                    min="0.01"
                    max="0.8"
                    step="0.01"
                    value={speed}
                    onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    className="w-full accent-slate-100 bg-slate-150 h-1.5 rounded-lg cursor-pointer"
                    disabled={isPaused}
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>Ambient Slow (0.01)</span>
                    <span>Hyper Kinetic (0.8)</span>
                  </div>
                </div>

                {/* Particle density counts */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-semibold text-slate-300">
                    <span>Floating Particulate Counts</span>
                    <span className="text-white font-mono">{particleCount} specs</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={particleCount}
                    onChange={(e) => setParticleCount(parseInt(e.target.value))}
                    className="w-full accent-slate-100 bg-slate-150 h-1.5 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>Cleared Space (0)</span>
                    <span>Dense Cloud (100)</span>
                  </div>
                </div>

                {/* Aurora opacity slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-semibold text-slate-300">
                    <span>Aurora Visual Node Density</span>
                    <span className="text-white font-mono">{(auroraOpacity * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={auroraOpacity}
                    onChange={(e) => setAuroraOpacity(parseFloat(e.target.value))}
                    className="w-full accent-slate-100 bg-slate-150 h-1.5 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>Soft Glow (10%)</span>
                    <span>Deep Intensity (100%)</span>
                  </div>
                </div>

                {/* Freeze Toggles Button */}
                <div className="pt-2">
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className={`w-full font-bold py-2 px-4 rounded text-xs transition-colors cursor-pointer ${
                      isPaused 
                        ? 'bg-amber-600 text-white shadow-[0_0_15px_#d97706]' 
                        : 'bg-slate-800 hover:bg-slate-700 text-white'
                    }`}
                  >
                    {isPaused ? '▶ Resume Atmosphere Engine' : '⏸ Pause Atmosphere Engine'}
                  </button>
                </div>

              </div>

              {/* Shifting Colors Spectrum */}
              <div className="bg-slate-950 border border-slate-850 p-5 rounded-xl space-y-4 flex flex-col justify-between">
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-white uppercase border-b border-slate-900 pb-2">HSL Spectrum Tracker</h3>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-sans">As the requestAnimationFrame loop progresses, the global Hue coordinates update. This updates matching styles dynamically.</p>
                </div>

                {/* Spectrum scale */}
                <div className="space-y-2">
                  <div className="h-6 w-full rounded-md bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-purple-500 to-red-500 relative">
                    {/* Active indicator indexer pin */}
                    <div 
                      className="absolute h-8 w-2 bg-white rounded border border-slate-950 -top-1 shadow-[0_0_10px_white]"
                      style={{ left: `${(hue / 360) * 100}%` }}
                    />
                  </div>

                  <div className="flex justify-between font-mono text-[10px] text-slate-400">
                    <span>Degree: {hue}°</span>
                    <span>RGB Accent: {activeAccentColor}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-900/30 rounded border border-slate-850 font-mono text-[10px] text-slate-400 space-y-1.5">
                  <span className="font-bold text-slate-200 uppercase tracking-wider block text-[9px]">Sensory Coordinates</span>
                  <p>• Clock Loop: ACTIVE (16.67ms ticks)</p>
                  <p>• Delta-Timing Modifier: Delta (Hz-Uniformed)</p>
                  <p>• Blend Compositing Mode: lighter (Screen-Scale)</p>
                </div>
              </div>

              {/* Display Pairing Presets */}
              <div className="bg-slate-950 border border-slate-850 p-5 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-white uppercase border-b border-slate-900 pb-2">Dynamic Styling Pairing</h3>
                
                <div className="p-3 bg-slate-900 rounded-lg space-y-2">
                  <span className="text-[9px] uppercase font-bold text-slate-500 font-mono">Gradience Heading (H1/H2)</span>
                  <h2 
                    className="text-lg font-extrabold tracking-tight bg-clip-text text-transparent leading-snug transition-colors duration-1000"
                    style={{ 
                      backgroundImage: `linear-gradient(135deg, hsl(${hue}, 85%, 65%), hsl(${(hue + 75) % 360}, 75%, 55%))`
                    }}
                  >
                    Refining Variables Over Spatial Gels.
                  </h2>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg space-y-2">
                  <span className="text-[9px] uppercase font-bold text-slate-500 font-mono">Borders &amp; Accents Glows</span>
                  <div 
                    className="p-2.5 rounded text-[11px] text-slate-350 transition-all duration-700 bg-slate-950 font-sans"
                    style={{ 
                      border: `1px solid hsla(${hue}, 85%, 55%, 0.4)`,
                      boxShadow: `0 0 15px -3px hsla(${hue}, 85%, 55%, 0.15)`
                    }}
                  >
                    Borders glow according to HSL coordinates in the canvas framework.
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* USER DIRECTORY TAB (Admin only) */}
        {activeTab === 'users' && (
          <div className="bg-slate-950 border border-slate-850 rounded-xl p-5 space-y-6 animate-fade-in">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h2 className="text-lg font-black text-white">Registered Workspace Members</h2>
                <p className="text-xs text-slate-500">Edit active writer clearances, assign roles, or suspend profiles.</p>
              </div>

              <button
                onClick={() => setShowInviteModal(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Invite Writer
              </button>
            </div>

            {/* Invite Form Overlay modal simulation */}
            {showInviteModal && (
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-1.5">Dispatch Workspace Invitation</h4>
                <form onSubmit={handleInviteUserSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full bg-slate-950 border border-slate-800 px-2.5 py-1.5 rounded focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Email address</label>
                    <input
                      type="email"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      placeholder="john@aurapress.com"
                      className="w-full bg-slate-950 border border-slate-800 px-2.5 py-1.5 rounded focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Assigned Role</label>
                    <select
                      value={newUserRole}
                      onChange={(e: any) => setNewUserRole(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 px-2 py-1.5 rounded text-slate-200"
                    >
                      <option value="editor">Editor</option>
                      <option value="editor_in_chief">Editor in Chief</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 px-4 rounded w-full cursor-pointer"
                    >
                      Send Invite
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowInviteModal(false)}
                      className="bg-slate-800 hover:bg-slate-700 border border-slate-800 text-slate-300 py-1.5 px-3 rounded cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Users list table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 divide-y divide-slate-900 border-collapse">
                <thead>
                  <tr className="text-slate-500 font-black uppercase text-[10px]">
                    <th className="py-2.5 px-3">Profile Name</th>
                    <th className="py-2.5 px-3">Credentials Role</th>
                    <th className="py-2.5 px-3">Joined date</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/60 font-semibold text-slate-300">
                  {profiles.map((prf) => (
                    <tr key={prf.id} className="hover:bg-slate-900/10">
                      <td className="py-3 px-3 flex items-center gap-2.5">
                        <img src={prf.avatarUrl} alt="" className="w-7 h-7 rounded-full border border-slate-800" />
                        <div>
                          <p className="text-white font-bold">{prf.fullName}</p>
                          <p className="text-slate-500 text-[10px] font-mono mt-0.5">/{prf.slug}</p>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <select
                          value={prf.role}
                          onChange={(e: any) => {
                            const updated = profiles.map(p => p.id === prf.id ? { ...p, role: e.target.value } : p);
                            onUpdateProfiles(updated);
                          }}
                          className="bg-slate-900 border border-slate-800 text-xs px-2 py-1 rounded text-white"
                          disabled={prf.id === currentProfile.id} // Prevents self block
                        >
                          <option value="editor">Editor</option>
                          <option value="editor_in_chief">Editor in Chief</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="py-3 px-3 text-slate-500 font-mono">Jun 11, 2026</td>
                      <td className="py-3 px-3 text-right">
                        {prf.id !== currentProfile.id && (
                          <button
                            onClick={() => {
                              const updated = profiles.filter(p => p.id !== prf.id);
                              onUpdateProfiles(updated);
                            }}
                            className="text-rose-400 hover:text-rose-300 p-1 transition-colors"
                            title="Remove Member from workspace"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* MEDIA LIBRARY TAB */}
        {activeTab === 'media' && (
          <div className="bg-slate-950 border border-slate-850 rounded-xl p-5 space-y-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-black text-white">Media Library Vault</h2>
              <p className="text-xs text-slate-500">Multi-file draft drag asset bin. Click a thumbnail card to copy its reference URL to clipboard.</p>
            </div>

            {/* Simulated drag section */}
            <div className="border border-dashed border-slate-800 rounded-lg hover:border-slate-500 p-8 text-center bg-slate-900/10 cursor-pointer transition-colors group">
              <HardDrive className="w-8 h-8 text-slate-500 group-hover:text-white mx-auto mb-2 transition-colors" />
              <p className="font-bold text-xs text-slate-350">Drag &amp; drop photos or document attachments here</p>
              <p className="text-[10px] text-slate-500 mt-1">Supports PNG, WEBP, SVG or PDF assets formats up to 10MB.</p>
            </div>

            {/* Grid listings of mock media assets inside canvas storage */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[
                { title: 'Aurora Gel Fluid', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=400' },
                { title: 'Workspace Design', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400' },
                { title: 'Chromatic Shimmer', url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=400' },
                { title: 'Systems Board', url: 'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?auto=format&fit=crop&q=80&w=400' },
                { title: 'Code Terminal', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400' }
              ].map((med, index) => (
                <div 
                  key={index} 
                  onClick={() => {
                    navigator.clipboard.writeText(med.url);
                    window.alert("Public image URL copied to clipboard!");
                  }}
                  className="group relative bg-slate-900/40 border border-slate-900 rounded-lg overflow-hidden cursor-pointer"
                >
                  <img src={med.url} alt="" className="w-full h-24 object-cover" />
                  <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                    <span className="text-[9px] text-slate-500 block truncate">{med.title}</span>
                    <span className="text-[10px] text-emerald-450 font-bold flex items-center gap-1">
                      <Copy className="w-3 h-3" /> Copy Link
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* SITE SETTINGS TAB (Admin only) */}
        {activeTab === 'settings' && (
          <div className="bg-slate-950 border border-slate-850 rounded-xl p-5 space-y-6 animate-fade-in text-xs">
            
            <div>
              <h2 className="text-lg font-black text-white">System Settings Console</h2>
              <p className="text-xs text-slate-500">Configure global metadata endpoints, brand names, and comments moderators.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-4">
                <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-wider">General settings</h4>
                
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Blog Name</label>
                  <input
                    type="text"
                    value={settings.blogName}
                    onChange={(e) => onUpdateSettings({ ...settings, blogName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Global Tagline Teaser</label>
                  <textarea
                    value={settings.tagline}
                    onChange={(e) => onUpdateSettings({ ...settings, tagline: e.target.value })}
                    rows={3}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-2 focus:outline-none resize-none"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Integrations &amp; comments</h4>
                
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Subscribers Newsletter Node</label>
                  <select
                    value={settings.newsletterProvider}
                    onChange={(e) => onUpdateSettings({ ...settings, newsletterProvider: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-white focus:outline-none"
                  >
                    <option value="mailchimp">Mailchimp Protocol</option>
                    <option value="convertkit">ConvertKit Syncing</option>
                    <option value="resend">Resend SES API</option>
                  </select>
                </div>

                <div className="space-y-2.5 pt-2">
                  <label className="flex items-center gap-2 text-slate-355 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.commentsEnabled}
                      onChange={(e) => onUpdateSettings({ ...settings, commentsEnabled: e.target.checked })}
                      className="accent-slate-700"
                    />
                    Enable reader message discussions comments
                  </label>

                  <label className="flex items-center gap-2 text-slate-355 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.commentsModerated}
                      onChange={(e) => onUpdateSettings({ ...settings, commentsModerated: e.target.checked })}
                      className="accent-slate-700"
                    />
                    Enforce strict pre-publication review moderation
                  </label>
                </div>
              </div>

            </div>

            {/* Settings Danger Zone (As requested by site settings checklist block) */}
            <div className="bg-rose-950/20 border border-rose-900/30 p-5 rounded-lg space-y-3 mt-4">
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-widest flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-500" />
                Workspace Danger Zone
              </h4>
              <p className="text-slate-400 text-[11px] max-w-xl">
                Warning! Export actions save a full structured backup replica of the JSON document containing matching users profile settings and drafts. Reverting deleted items is locked.
              </p>

              <div className="flex gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleExportDataAsJSON}
                  className="bg-rose-900/30 text-rose-400 hover:bg-rose-900 hover:text-white border border-rose-800/25 px-4 py-2 font-bold rounded flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Export All Data (JSON Backup)
                </button>
              </div>
            </div>

          </div>
        )}

        {/* SYSTEM BLUEPRINTS TAB */}
        {activeTab === 'blueprints' && (
          <motion.div
            key="specs-area"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-slate-950 border border-slate-850 rounded-xl p-6 space-y-6 text-slate-300 text-xs animate-fade-in"
          >
            {/* Secondary sub-navigation tab bar for grouping developers specs */}
            <div className="flex flex-col md:flex-row pb-2 border-b border-slate-900 items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-widest text-[#d97706] font-bold font-mono">Platform Documentation</span>
                <h2 className="text-xl md:text-2xl font-black text-white">System Blueprints &amp; Technical Specs</h2>
                <p className="text-slate-400 text-xs text-[11px]">Inspect relational Postgres schemas, row-level security variables, prompt guidelines, and build milestones.</p>
              </div>

              <div className="flex flex-wrap gap-1 bg-slate-900/60 p-1 border border-slate-850 rounded-lg text-[10px] font-bold tracking-wider uppercase font-mono">
                {[
                  { id: 'schema', label: 'DB Schemas & RLS' },
                  { id: 'roles', label: 'Clearance Controls' },
                  { id: 'prompts', label: 'Writing Prompts' },
                  { id: 'checklist', label: 'Build Checklist' }
                ].map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setActiveSpecSubTab(sub.id as any)}
                    className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                      activeSpecSubTab === sub.id
                        ? 'bg-slate-100 text-slate-950 font-black shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-tab view rendering */}
            <AnimatePresence mode="wait">
              
              {/* SUB TAB: DB SCHEMA & RLS MAP */}
              {activeSpecSubTab === 'schema' && (
                <motion.div
                  key="schema-sub"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      {
                        tbl: 'posts',
                        desc: 'Database logs compiling written articles.',
                        cols: [
                          { name: 'id', type: 'UUID Primary Key' },
                          { name: 'title', type: 'TEXT' },
                          { name: 'slug', type: 'TEXT Unique' },
                          { name: 'cover_image_url', type: 'TEXT' },
                          { name: 'author_id', type: 'UUID references profiles(id)' },
                          { name: 'category_id', type: 'UUID references categories(id)' },
                          { name: 'status', type: 'TEXT Checking (draft/review/published/archived)' },
                        ],
                        rls: 'Public can read when published. Authors manage own post. Adms manage all.'
                      },
                      {
                        tbl: 'profiles',
                        desc: 'Linked profiles mapped to Auth logins.',
                        cols: [
                          { name: 'id', type: 'UUID Primary Key references auth.users(id)' },
                          { name: 'full_name', type: 'TEXT' },
                          { name: 'avatar_url', type: 'TEXT' },
                          { name: 'role', type: 'TEXT Checking (admin/editor_in_chief/editor)' },
                        ],
                        rls: 'Users read and update own profile. Admins query all.'
                      },
                      {
                        tbl: 'categories & tags',
                        desc: 'Categorization taxonomy indices.',
                        cols: [
                          { name: 'id', type: 'UUID Primary Key' },
                          { name: 'name', type: 'TEXT' },
                          { name: 'slug', type: 'TEXT Unique' },
                          { name: 'sort_order', type: 'INTEGER' }
                        ],
                        rls: 'Public reads. EIC and Admin make CRUD mutations.'
                      },
                    ].map((s, idx) => (
                      <div key={idx} className="bg-slate-950 border border-slate-900 p-4 rounded-xl flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                            <span className="font-extrabold text-white text-xs font-mono uppercase">TABLE: {s.tbl}</span>
                            <span className="text-[9px] bg-slate-900 border border-slate-850 px-2 py-0.5 rounded text-amber-500 font-bold font-mono">RLS Active</span>
                          </div>
                          <p className="text-slate-400 text-[11px] font-sans leading-relaxed">{s.desc}</p>
                          
                          <div className="space-y-1.5 pt-2 font-mono text-[10px]">
                            {s.cols.map((col, i) => (
                              <div key={i} className="flex justify-between border-b border-slate-900/40 pb-1">
                                <span className="text-slate-300 font-bold">{col.name}</span>
                                <span className="text-slate-500 uppercase font-black text-[9px]">{col.type}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-2.5 bg-slate-900 rounded border border-slate-850 text-[10px] text-slate-400 leading-relaxed font-sans mt-2">
                          <span className="text-rose-450 font-bold block uppercase text-[8px] tracking-wider mb-0.5 font-mono">RLS Policy Gate</span>
                          {s.rls}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* SUB TAB: ACCESS CLEARANCES */}
              {activeSpecSubTab === 'roles' && (
                <motion.div
                  key="roles-sub"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-4"
                >
                  <div className="bg-slate-950 border border-slate-900 rounded-xl p-5 overflow-x-auto">
                    <table className="w-full text-left font-medium border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-900 text-slate-500 font-black uppercase text-[10px] font-mono">
                          <th className="py-2.5 px-3">Publishing Capabilities</th>
                          <th className={`py-2.5 px-3 ${currentProfile.role === 'admin' ? 'text-white font-extrabold bg-slate-900/40' : ''}`}>Admin</th>
                          <th className={`py-2.5 px-3 ${currentProfile.role === 'editor_in_chief' ? 'text-white font-extrabold bg-slate-900/40' : ''}`}>Editor in Chief</th>
                          <th className={`py-2.5 px-3 ${currentProfile.role === 'editor' ? 'text-white font-extrabold bg-slate-900/40' : ''}`}>Editor</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900 text-slate-200">
                        {[
                          { cap: 'Compile / Write own draft logs', admin: true, eic: true, editor: true },
                          { cap: 'Dispatch draft files for review', admin: true, eic: true, editor: true },
                          { cap: 'Review queue audit access (Approve/Reject comments)', admin: true, eic: true, editor: false },
                          { cap: 'Deploy Articles directly Live', admin: true, eic: true, editor: false },
                          { cap: 'Execute permanent post Deletions', admin: true, eic: true, editor: false },
                          { cap: 'Create categories segments', admin: true, eic: true, editor: false },
                          { cap: 'Manage and update team user profiles role permissions', admin: true, eic: false, editor: false },
                          { cap: 'Danger Zone system exports of JSON data', admin: true, eic: false, editor: false }
                        ].map((row, i) => (
                          <tr key={i} className="hover:bg-slate-900/20">
                            <td className="py-3 px-3 text-white font-semibold">{row.cap}</td>
                            <td className={`py-3 px-3 ${currentProfile.role === 'admin' ? 'bg-slate-900/20' : ''}`}>
                              <span className={`px-2 py-0.5 rounded font-bold text-[10px] font-mono ${row.admin ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-450'}`}>
                                {row.admin ? 'Granted' : 'Locked'}
                              </span>
                            </td>
                            <td className={`py-3 px-3 ${currentProfile.role === 'editor_in_chief' ? 'bg-slate-900/20' : ''}`}>
                              <span className={`px-2 py-0.5 rounded font-bold text-[10px] font-mono ${row.eic ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-450'}`}>
                                {row.eic ? 'Granted' : 'Locked'}
                              </span>
                            </td>
                            <td className={`py-3 px-3 ${currentProfile.role === 'editor' ? 'bg-slate-900/20' : ''}`}>
                              <span className={`px-2 py-0.5 rounded font-bold text-[10px] font-mono ${row.editor ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-450'}`}>
                                {row.editor ? 'Granted' : 'Locked'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* SUB TAB: SYSTEM PROMPTS DEPOT */}
              {activeSpecSubTab === 'prompts' && (
                <motion.div
                  key="prompts-sub"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                >
                  <CopyPromptDepot />
                </motion.div>
              )}

              {/* SUB TAB: MILESTONE PROGRESS CHECKLIST */}
              {activeSpecSubTab === 'checklist' && (
                <motion.div
                  key="checklist-sub"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        title: 'Phase 1 — Workspace Initialization &amp; Auth Foundation',
                        items: [
                          { key: 'p1_supabase', label: 'Supabase DB, schema setups, and RLS tables policies config' },
                          { key: 'p1_tailwind', label: 'Next.js App router initialization with Tailwind 4 &amp; animations' },
                          { key: 'p1_auth', label: 'Auth gateways cookie session read-outs &amp; middleware redirect rules' }
                        ]
                      },
                      {
                        title: 'Phase 2 — Executive Admin dashboard Core',
                        items: [
                          { key: 'p2_sidebar', label: 'Sidebar collapsible panel structures with role filters' },
                          { key: 'p2_stats', label: 'Analytics dashboard metrics calculation loops' },
                          { key: 'p2_tiptap', label: 'Extensible Post Editor WYSIWYG draft write board elements' }
                        ]
                      },
                      {
                        title: 'Phase 3 — Review Audit Workflows Gates',
                        items: [
                          { key: 'p3_queue', label: 'Role-filtered Review pipeline modal splitscreen' },
                          { key: 'p3_actions', label: 'Transition gates: Request changes or Approve &amp; Publish live copy' }
                        ]
                      },
                      {
                        title: 'Phase 4 — Team Users Clearance controller',
                        items: [
                          { key: 'p4_userinvite', label: 'Invite users dispatch box with role dropdown modifiers (Admin only)' }
                        ]
                      },
                      {
                        title: 'Phase 5 — Customer Public-facing Frontend and Animations',
                        items: [
                          { key: 'p5_homepage', label: 'Homepage, single route views, and category badges filters (Prompt F)' },
                          { key: 'p5_search', label: 'Full text searching logic using ts_vector comparisons' },
                          { key: 'p5_darkmode', label: 'LocalStorage state tracker for Dark/Light ambient styles' },
                          { key: 'p5_motion', label: 'Smooth page transits &amp; SVG blob organic drift elements (Prompt C)' }
                        ]
                      }
                    ].map((ph, idx) => (
                      <div key={idx} className="bg-slate-950 border border-slate-900 p-5 rounded-xl space-y-3.5">
                        <h3 className="text-xs font-black text-white uppercase border-b border-slate-900 pb-2" dangerouslySetInnerHTML={{ __html: ph.title }} />
                        <div className="space-y-2.5">
                          {ph.items.map((item) => (
                            <label key={item.key} className="flex items-start gap-2.5 text-slate-300 cursor-pointer select-none text-[11px]">
                              <input
                                type="checkbox"
                                checked={checklist[item.key]}
                                onChange={() => toggleChecklistItem(item.key)}
                                className="mt-0.5 accent-emerald-500 cursor-pointer text-xs"
                              />
                              <span className={checklist[item.key] ? 'line-through text-slate-500 font-semibold' : ''} dangerouslySetInnerHTML={{ __html: item.label }} />
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </motion.div>
        )}

      </main>

    </div>
  );
};
