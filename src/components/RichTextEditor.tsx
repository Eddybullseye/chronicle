import React, { useState, useEffect, useRef } from 'react';
import { Post, Category, Tag, Profile, UserRole } from '../types';
import { useHue } from './HueEngine';
import { Eye, Code, Save, Send, Check, AlertCircle, Sparkles, Image, Settings, Globe } from 'lucide-react';

interface RichTextEditorProps {
  post?: Post | null;
  categories: Category[];
  tags: Tag[];
  profiles: Profile[];
  currentProfile: Profile;
  onSave: (postData: Partial<Post>) => void;
  onCancel: () => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  post,
  categories,
  tags,
  profiles,
  currentProfile,
  onSave,
  onCancel,
}) => {
  const { hue } = useHue();
  const [title, setTitle] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [excerpt, setExcerpt] = useState<string>('');
  const [coverImageUrl, setCoverImageUrl] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [authorId, setAuthorId] = useState<string>('');
  const [scheduledAt, setScheduledAt] = useState<string>('');
  
  // SEO panel variables
  const [showSeo, setShowSeo] = useState<boolean>(false);
  const [metaTitle, setMetaTitle] = useState<string>('');
  const [metaDescription, setMetaDescription] = useState<string>('');

  // Editor states
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saved' | 'saving'>('idle');
  const [wordCount, setWordCount] = useState<number>(0);
  const [readingTime, setReadingTime] = useState<number>(1);
  const [showImagePresets, setShowImagePresets] = useState<boolean>(false);

  // Load post values if editing or local backup
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setSlug(post.slug);
      setContent(post.content);
      setExcerpt(post.excerpt);
      setCoverImageUrl(post.coverImageUrl);
      setCategoryId(post.categoryId);
      setSelectedTags(post.tags || []);
      setAuthorId(post.authorId);
      setScheduledAt(post.scheduledAt || '');
      setMetaTitle(post.metaTitle || '');
      setMetaDescription(post.metaDescription || '');
    } else {
      // New post defaults
      setTitle('');
      setSlug('');
      setContent('');
      setExcerpt('');
      setCoverImageUrl('https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1200');
      setCategoryId(categories[0]?.id || '');
      setSelectedTags([]);
      setAuthorId(currentProfile.id);
      setScheduledAt('');
      setMetaTitle('');
      setMetaDescription('');
    }
  }, [post, categories, currentProfile]);

  // Handle live word count & reading time calculation
  useEffect(() => {
    const text = content.replace(/<[^>]*>/g, ' ').trim();
    const words = text ? text.split(/\s+/).length : 0;
    setWordCount(words);
    setReadingTime(Math.max(1, Math.ceil(words / 225))); // Average 225 wpm reading speed
  }, [content]);

  // Auto slug generation based on human title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!post) {
      // Only auto-generate slug for new posts
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setSlug(generatedSlug);
    }
  };

  // Draft Autosave loop (Every 30 seconds, stored in localStorage)
  useEffect(() => {
    const autoSaveTimer = setInterval(() => {
      if (!title && !content) return; // Don't auto-save empty pages
      
      setAutoSaveStatus('saving');
      const draftKey = post ? `blog_draft_edit_${post.id}` : 'blog_draft_new';
      
      const draftData = {
        title,
        slug,
        content,
        excerpt,
        coverImageUrl,
        categoryId,
        selectedTags,
        authorId,
        scheduledAt,
        metaTitle,
        metaDescription,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem(draftKey, JSON.stringify(draftData));
      
      setTimeout(() => {
        setAutoSaveStatus('saved');
        setTimeout(() => setAutoSaveStatus('idle'), 3000);
      }, 800);
    }, 30000);

    return () => clearInterval(autoSaveTimer);
  }, [title, slug, content, excerpt, coverImageUrl, categoryId, selectedTags, authorId, scheduledAt, metaTitle, metaDescription, post]);

  // Insert rich text styling helper
  const insertStyle = (styleType: string) => {
    const textarea = document.getElementById('editor-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);

    let replacement = '';
    switch (styleType) {
      case 'bold':
        replacement = `<strong>${selected || 'bold text'}</strong>`;
        break;
      case 'italic':
        replacement = `<em>${selected || 'italic text'}</em>`;
        break;
      case 'heading':
        replacement = `<h3>${selected || 'Heading'}</h3>\n`;
        break;
      case 'quote':
        replacement = `<blockquote>${selected || 'Inspirational quote'}</blockquote>\n`;
        break;
      case 'code':
        replacement = `<pre><code>${selected || '// Insert code here'}</code></pre>\n`;
        break;
      case 'link':
        replacement = `<a href="https://example.com" target="_blank">${selected || 'link text'}</a>`;
        break;
      case 'list-item':
        replacement = `<li>${selected || 'List item'}</li>`;
        break;
      default:
        return;
    }

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setContent(newContent);
    
    // Reset focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 50);
  };

  const handleManualSave = (status: 'draft' | 'in_review' | 'published') => {
    const currentTimestamp = new Date().toISOString();
    onSave({
      title,
      slug: slug || `${Date.now()}`,
      content,
      excerpt,
      coverImageUrl,
      categoryId,
      tags: selectedTags,
      authorId,
      status,
      scheduledAt: scheduledAt || undefined,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || excerpt,
      readingTime,
      updatedAt: currentTimestamp,
      ...(status === 'published' ? { publishedAt: currentTimestamp } : {})
    });
  };

  const stockImages = [
    { name: 'Abstract Canvas', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=600' },
    { name: 'Silicon Workstation', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600' },
    { name: 'Chromatic Lights', url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=600' },
    { name: 'Editorial Blueprint', url: 'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?auto=format&fit=crop&q=80&w=600' },
    { name: 'Minimal Workspace', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600' },
    { name: 'Gel Aurora Spectrum', url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=600' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative" id="rich-editor-wrapper">
      
      {/* Top action header info */}
      <div className="bg-slate-950/60 p-4 border-b border-slate-800 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="w-3 h-3 rounded-full animate-pulse shadow-[0_0_10px_rgba(var(--live-hue),0.8)]"
            style={{ backgroundColor: `hsl(${hue}, 85%, 60%)` }}
          />
          <div>
            <h2 className="text-sm font-semibold text-white">
              {post ? `Editing: ${post.title.substring(0, 30)}...` : 'Drafting New Article'}
            </h2>
            <div className="flex gap-2 text-xs text-slate-400 items-center mt-0.5">
              <span>{wordCount} words</span>
              <span>•</span>
              <span>{readingTime} min read</span>
              
              {autoSaveStatus === 'saving' && (
                <span className="text-amber-400 flex items-center gap-1 ml-2 animate-pulse">
                  <Sparkles className="w-3 h-3" /> Auto-saving...
                </span>
              )}
              {autoSaveStatus === 'saved' && (
                <span className="text-emerald-400 flex items-center gap-1 ml-2">
                  <Check className="w-3 h-3" /> Save Recovery Ready
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            {isPreview ? <Code className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {isPreview ? 'Write Screen' : 'Live Preview'}
          </button>
          
          <button
            onClick={onCancel}
            className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
          >
            Exit
          </button>
        </div>
      </div>

      {/* Editor Body Grid */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Main writing column */}
        <div className="col-span-1 lg:col-span-3 space-y-4">
          
          {/* Title Area */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Human Title</label>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Give your article an authoritative, striking title..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-lg font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-700 focus:border-slate-700"
              required
            />
          </div>

          {/* Slug Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Slug URL Path</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                placeholder="url-path-of-article"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-700"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Scheduled Date (Optional)</label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-700"
              />
            </div>
          </div>

          {/* Excerpt Area */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Excerpt (Short TL;DR description)</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              placeholder="Write a concise teaser outlining the core visual or architectural topic of this piece..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-700 resize-none"
            />
          </div>

          {/* WYSIWYG / HTML Editor Panel */}
          <div>
            <div className="flex justify-between items-center bg-slate-950 border border-b-0 border-slate-800 px-3 py-1.5 rounded-t-lg">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Writing Board</span>
              
              {/* Formatting bar icons */}
              <div className="flex gap-1">
                {[
                  { style: 'bold', label: 'B', title: 'Bold Text' },
                  { style: 'italic', label: 'I', title: 'Italic Text' },
                  { style: 'heading', label: 'H3', title: 'Header 3' },
                  { style: 'quote', label: '“”', title: 'Blockquote' },
                  { style: 'code', label: '<>', title: 'Code Block' },
                  { style: 'link', label: 'Link', title: 'Hyperlink' },
                  { style: 'list-item', label: '• List', title: 'List Item' }
                ].map((item) => (
                  <button
                    key={item.style}
                    type="button"
                    onClick={() => insertStyle(item.style)}
                    className="px-2 py-1 text-[11px] font-bold text-slate-400 hover:text-white bg-slate-900 rounded border border-slate-800 hover:border-slate-700 transition-colors"
                    title={item.title}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {isPreview ? (
              <div 
                className="w-full bg-slate-950/40 border border-slate-800 rounded-b-lg p-5 min-h-[320px] max-h-[460px] overflow-y-auto prose prose-invert prose-slate text-slate-300 prose-headings:text-white prose-pre:bg-slate-900/80 prose-blockquote:border-l-4"
                style={{ '--tw-prose-quote-borders': `hsl(${hue}, 80%, 60%)` } as React.CSSProperties}
              >
                <h1 className="text-2xl font-bold tracking-tight text-white mb-2">{title || 'Untitled Post'}</h1>
                {excerpt && <p className="italic text-slate-400 text-sm mb-6 pb-4 border-b border-slate-800/60">{excerpt}</p>}
                <div dangerouslySetInnerHTML={{ __html: content || '<p className="text-slate-500 italic">No content written yet. Type below to see structured styling.</p>' }} />
              </div>
            ) : (
              <textarea
                id="editor-textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                placeholder="Start writing using standard text markup. Try: <h3>Typography</h3> or <pre><code>code blocks</code></pre> to organize items..."
                className="w-full bg-slate-950 border border-slate-800 rounded-b-lg p-4 text-xs font-mono text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-700 focus:border-slate-700"
              />
            )}
          </div>

          {/* Expandable SEO Details Panel */}
          <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950/40">
            <button
              type="button"
              onClick={() => setShowSeo(!showSeo)}
              className="w-full px-4 py-3 flex items-center justify-between font-semibold text-xs text-slate-300 cursor-pointer select-none bg-slate-950/80"
            >
              <span className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-slate-400" />
                SEO Metadata Configurations (Search Engines Optimization)
              </span>
              <span className="text-slate-500">{showSeo ? 'Collapse ▲' : 'Expand ▼'}</span>
            </button>

            {showSeo && (
              <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">Google Search Display Title</label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="Refined title targeting search terms... (Keep within 60 chars)"
                    className="w-full bg-slate-900 border border-slate-800 px-3 py-1.5 rounded text-xs text-slate-300 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">Search Engine Description Snippet</label>
                  <textarea
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    rows={2}
                    placeholder="High-click-rate snippet displayed in search result listings... (Keep within 160 chars)"
                    className="w-full bg-slate-900 border border-slate-800 px-3 py-1.5 rounded text-xs text-slate-300 focus:outline-none resize-none"
                  />
                </div>

                <div className="flex gap-4 items-center">
                  <Globe className="w-4 h-4 text-emerald-500" />
                  <span className="text-[11px] text-slate-400">
                    A sitemap node and static canonical tags will be auto-generated at: <code>{`/blog/${slug || 'slug'}`}</code>
                  </span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right configuration side panel */}
        <div className="space-y-5">
          
          {/* Metadata Controls */}
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-lg space-y-4">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider border-b border-slate-800 pb-2">Properties</h3>
            
            {/* Category selection */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Category Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-xs text-slate-200 focus:ring-1 focus:ring-slate-700"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Author selection (Gate: Admin only reassigns) */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Author Attribution</label>
              {currentProfile.role === 'admin' ? (
                <select
                  value={authorId}
                  onChange={(e) => setAuthorId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-xs text-slate-200 focus:ring-1 focus:ring-slate-700"
                >
                  {profiles.map((p) => (
                    <option key={p.id} value={p.id}>{p.fullName} ({p.role.toUpperCase()})</option>
                  ))}
                </select>
              ) : (
                <div className="bg-slate-900 border border-slate-800/80 rounded px-3 py-1.5 text-xs text-slate-300">
                  {profiles.find(p => p.id === authorId)?.fullName || currentProfile.fullName}
                  <span className="text-[10px] text-slate-500 block">Locked for non-admin writers</span>
                </div>
              )}
            </div>

            {/* Cover Image URL */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Cover Wallpaper Image</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-xs text-slate-300"
                  placeholder="URL link to cover"
                />
                <button
                  type="button"
                  onClick={() => setShowImagePresets(!showImagePresets)}
                  className="bg-slate-850 hover:bg-slate-800 p-1.5 rounded border border-slate-800 text-slate-300"
                  title="Choose from stock assets library"
                >
                  <Image className="w-4 h-4" />
                </button>
              </div>

              {/* Cover presets dropdown */}
              {showImagePresets && (
                <div className="grid grid-cols-2 gap-1.5 mt-2 p-2 bg-slate-900 border border-slate-800 rounded">
                  {stockImages.map((img) => (
                    <button
                      key={img.url}
                      type="button"
                      onClick={() => {
                        setCoverImageUrl(img.url);
                        setShowImagePresets(false);
                      }}
                      className="group relative h-12 rounded overflow-hidden cursor-pointer"
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center text-[9px] text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        Select
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Cover preview with mix-blend tint overlay matching user prompt D */}
              <div className="mt-3 relative h-28 rounded-lg overflow-hidden border border-slate-800 group">
                <img src={coverImageUrl || 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853'} alt="Cover Preview" className="w-full h-full object-cover" />
                
                {/* Wet tint mix layer requested in prompt D */}
                <div 
                  className="absolute inset-0 mix-blend-color opacity-80 transition-colors duration-1000"
                  style={{ backgroundColor: `hsl(${hue}, 85%, 55%)` }}
                />
                
                <div className="absolute bottom-2 left-2 right-2 bg-slate-950/80 px-2 py-1 rounded backdrop-blur text-[10px] text-slate-300">
                  Hue blend tinting active (Prompt D)
                </div>
              </div>
            </div>

            {/* Tag Selection */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-2">Subject Tags</label>
              <div className="flex flex-wrap gap-1.5 max-h-[160px] overflow-y-auto pr-1">
                {tags.map((tag) => {
                  const isChecked = selectedTags.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => {
                        if (isChecked) {
                          setSelectedTags(selectedTags.filter(id => id !== tag.id));
                        } else {
                          setSelectedTags([...selectedTags, tag.id]);
                        }
                      }}
                      className={`px-2 py-1 rounded text-[10px] font-medium transition-all ${
                        isChecked
                          ? 'bg-slate-100 text-slate-950 font-semibold scale-95 shadow-sm'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      {tag.name}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Interactive Role Buttons (Prompt Action Gating) */}
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-lg space-y-3">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider pb-2 border-b border-slate-800">Publish Flow Gates</h3>
            
            <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-black block">Active Role Credentials</span>
              <span className="text-xs text-white font-bold block mt-0.5">
                {currentProfile.fullName}
              </span>
              <span 
                className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase mt-1 inline-block"
                style={{ backgroundColor: `hsla(${hue}, 85%, 20%, 0.4)`, color: `hsl(${hue}, 85%, 65%)` }}
              >
                {currentProfile.role.replace(/_/g, ' ')}
              </span>
            </div>

            {/* Action Buttons with distinct permissions constraints */}
            <div className="space-y-2 pt-2">
              
              {/* Option 1: Save Draft (All users can do this) */}
              <button
                type="button"
                onClick={() => handleManualSave('draft')}
                className="w-full bg-slate-800 hover:bg-slate-700 active:scale-98 text-white px-3 py-2 rounded font-medium text-xs flex items-center justify-center gap-2 cursor-pointer transition-all border border-slate-700/50"
              >
                <Save className="w-3.5 h-3.5 text-slate-400" />
                Save as Draft
              </button>

              {/* Option 2: Submit For Review (All roles can trigger, but they can directly publish if Admin/EIC) */}
              <button
                type="button"
                onClick={() => handleManualSave('in_review')}
                className="w-full bg-slate-900 hover:bg-slate-850 active:scale-98 text-slate-300 hover:text-white px-3 py-2 rounded font-medium text-xs flex items-center justify-center gap-2 cursor-pointer transition-all border border-slate-800 hover:border-slate-750"
              >
                <Send className="w-3.5 h-3.5 text-slate-400" />
                Submit for Editorial Review
              </button>

              {/* Option 3: Gate Button (Publish / Unpublish - Gated: Admin & Editor in Chief ONLY) */}
              {['admin', 'editor_in_chief'].includes(currentProfile.role) ? (
                <button
                  type="button"
                  onClick={() => handleManualSave('published')}
                  className="w-full active:scale-98 text-slate-950 font-bold px-3 py-2.5 rounded text-xs flex items-center justify-center gap-2 cursor-pointer transition-all border shadow-lg hover:brightness-110"
                  style={{ 
                    backgroundColor: `hsl(${hue}, 85%, 60%)`, 
                    borderColor: `hsl(${hue}, 85%, 50%)`,
                    boxShadow: `0 4px 14px -3px hsla(${hue}, 85%, 55%, 0.35)`
                  }}
                >
                  <Globe className="w-3.5 h-3.5 text-slate-900" />
                  Approve &amp; Publish Live
                </button>
              ) : (
                <div className="p-2.5 bg-slate-900/60 border border-slate-850 rounded text-[10px] text-slate-500">
                  <span className="font-semibold text-slate-400 flex items-center gap-1.5 mb-1 text-slate-400">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                    Publish Gate Locked
                  </span>
                  As an <strong>{currentProfile.role}</strong>, you do not possess publishing clearance. You path is restricted to submitting drafted material for editorial review.
                </div>
              )}

            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
