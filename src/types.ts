export type UserRole = 'admin' | 'editor_in_chief' | 'editor';

export interface Profile {
  id: string;
  fullName: string;
  avatarUrl: string;
  role: UserRole;
  bio: string;
  slug: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImageUrl: string;
  parentId?: string;
  sortOrder: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export type PostStatus = 'draft' | 'in_review' | 'published' | 'archived';

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Rich text / markup
  coverImageUrl: string;
  authorId: string;
  categoryId: string;
  status: PostStatus;
  publishedAt?: string;
  scheduledAt?: string;
  metaTitle?: string;
  metaDescription?: string;
  readingTime: number; // in minutes
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  tags: string[]; // tag IDs
}

export interface PostReview {
  id: string;
  postId: string;
  reviewerId: string;
  comment: string;
  action: 'approved' | 'changes_requested' | 'rejected';
  createdAt: string;
}

export interface PageView {
  id: string;
  postId: string;
  viewedAt: string;
  referrer: string;
  country: string;
}

export interface SiteSettings {
  blogName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  newsletterProvider: string;
  newsletterApiKey: string;
  commentsEnabled: boolean;
  commentsModerated: boolean;
}
