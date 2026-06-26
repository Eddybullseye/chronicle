import { Profile, Category, Tag, Post, PostReview, PageView, SiteSettings } from './types';

export const initialProfiles: Profile[] = [
  {
    id: 'user-sarah',
    fullName: 'Sarah Jenkins',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    role: 'admin',
    bio: 'Lifestyle curator and daily design practitioner. Passionate about ambient habit integration, slow living, and visual diary aesthetics.',
    slug: 'sarah-jenkins',
    createdAt: '2025-01-15T09:00:00Z'
  },
  {
    id: 'user-marcus',
    fullName: 'Marcus Chen',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    role: 'editor_in_chief',
    bio: 'Culinary writer and persistent food explorer. Marcus chronicles regional happenings, street food reviews, and culinary craft at home.',
    slug: 'marcus-chen',
    createdAt: '2025-02-10T10:30:00Z'
  },
  {
    id: 'user-elena',
    fullName: 'Elena Rostova',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    role: 'editor',
    bio: 'Lifelong learning consultant and event organizer. Elena writes about cognitive masteries, smart educational tools, and metropolitan happenings.',
    slug: 'elena-rostova',
    createdAt: '2025-03-01T14:15:00Z'
  }
];

export const initialCategories: Category[] = [
  {
    id: 'cat-lifestyle',
    name: 'Lifestyle & Habitation',
    slug: 'lifestyle',
    description: 'Devoted to personal rituals, interior design guides, slow living, and visual wellness.',
    coverImageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800',
    sortOrder: 1
  },
  {
    id: 'cat-food',
    name: 'Culinary Arts & Food',
    slug: 'food',
    description: 'Recipes compiled for modern kitchens, culinary science, street food reviews, and flavor pairing guides.',
    coverImageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=800',
    sortOrder: 2
  },
  {
    id: 'cat-education',
    name: 'Smart Education',
    slug: 'education',
    description: 'Cognitive learning hacks, educational technologies, and strategies for lifelong learning progress.',
    coverImageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800',
    sortOrder: 3
  },
  {
    id: 'cat-happenings',
    name: 'Metropolitan Happenings',
    slug: 'happenings',
    description: 'A curated chronicle of modern local art, music hubs, architectural pop-ups, and urban happenings.',
    coverImageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
    sortOrder: 4
  }
];

export const initialTags: Tag[] = [
  { id: 'tag-slowliving', name: 'Slow Living', slug: 'slow-living' },
  { id: 'tag-recipes', name: 'Recipes', slug: 'recipes' },
  { id: 'tag-learning', name: 'Cognitive Learning', slug: 'learning' },
  { id: 'tag-happenings', name: 'Urban Events', slug: 'events' },
  { id: 'tag-wellness', name: 'Daily Habits', slug: 'wellness' },
  { id: 'tag-gastronomy', name: 'Gastronomy', slug: 'gastronomy' },
  { id: 'tag-studyhacks', name: 'Study Hacks', slug: 'study-hacks' },
  { id: 'tag-culture', name: 'Local Culture', slug: 'culture' }
];

export const initialPosts: Post[] = [];

export const initialReviews: PostReview[] = [];

export const initialPageViews: PageView[] = [];

export const initialSiteSettings: SiteSettings = {
  blogName: 'AuraLife',
  tagline: 'An ambient showcase of daily rituals, flavor pairings, local culture, and brain hacks.',
  logoUrl: '',
  faviconUrl: '',
  twitterUrl: 'https://twitter.com/auralife_ambient',
  linkedinUrl: 'https://linkedin.com/company/auralife_ambient',
  githubUrl: 'https://github.com/auralife_ambient',
  newsletterProvider: 'mailchimp',
  newsletterApiKey: 'mc_api_key_xxxxxxxxxxxxxxxx',
  commentsEnabled: true,
  commentsModerated: true
};
