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

export const initialPosts: Post[] = [
  {
    id: 'post-daily-rituals',
    title: 'Designing the Perfect Morning Flow: Creative Routines for Mental Space',
    slug: 'designing-perfect-morning-flow-creative-routines',
    excerpt: 'An investigation of active slow living habits, light therapy, and morning hydration techniques to foster baseline calm before the day gets noisy.',
    content: `<h2>Creating Baseline Calm in a Busy World</h2>
<p>Modern daily life is continuous. We are bombarded with alerts, telemetry, and external obligations from the second we unlock our phones. To craft meaningful mental space, we must build a system of slow living morning habits that protect our early hours and keep our physical environments in check.</p>

<h3>The Architecture of the Morning Nest</h3>
<p>An elegant morning flow starts with physical environment design. Soft bias lighting, indirect natural windows, and the absolute absence of screens during the first 30 minutes are the gold standard. Instead of checking your social notifications, consider these three tactile touchpoints:</p>
<ul>
  <li><strong>Hydration First</strong>: A glass of lightly salted lemon water resets cellular electrolytes and wakes up the sensory gastrointestinal tract asynchronously.</li>
  <li><strong>Prismatic Sunlight Exposure</strong>: Glancing outdoors towards natural indirect sunlight within 10 minutes of waking sets your internal optical clock.</li>
  <li><strong>Kinetic Stretching</strong>: Gently waking up muscle fibers with joint mobility rotations before any physical training or screen work.</li>
</ul>

<h3>Minimalizing Sensory Noise</h3>
<p>In our physical studio layout, we make sure to clear visible surfaces the night before. No clutter, minimal active indicators. By curating your surroundings with spaciousness, you allow your focus muscles a clean, silent launch pad to glide into the day with poise and grace.</p>`,
    coverImageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200',
    authorId: 'user-sarah',
    categoryId: 'cat-lifestyle',
    status: 'published',
    publishedAt: '2026-06-01T10:00:00-07:00',
    metaTitle: 'Designing the Perfect Morning Flow | AuraLife',
    metaDescription: 'Learn how to construct healthy, minimalist morning routines that build focus and ground your day.',
    readingTime: 5,
    viewCount: 1420,
    createdAt: '2026-05-28T08:00:00-07:00',
    updatedAt: '2026-06-01T10:00:00-07:00',
    tags: ['tag-slowliving', 'tag-wellness']
  },
  {
    id: 'post-umami-science',
    title: 'The Alchemy of Umami: Elevating Flat Meals with Modern Flavor Science',
    slug: 'alchemy-of-umami-flavor-science',
    excerpt: 'How understanding glutamate pairing and Maillard reactions can instantly transform simple, home-cooked dishes from standard food into complex culinary art.',
    content: `<h2>The Fifth Taste Profile</h2>
<p>We are all familiar with sweet, salty, sour, and bitter. But the true secret to rich, mouth-coating recipe satisfaction resides in <strong>Umami</strong>. Discovered over a century ago in seaweed broth, this glutamate-rich profile signals the presence of savory amino acids, instructing our brains that we are consuming deeply nourishing foods.</p>

<h3>The Synergistic Glutamate Equation</h3>
<p>The culinary magic of umami happens when you pair raw ingredients containing free glutamates (like tomatoes, aged cheeses, or mushrooms) with nucleotides like inosinate and guanylate (found in meat, fish, and caramelized vegetables). When these components meet, they do not just add together—they multiply the perception of flavor up to eightfold:</p>

<pre><code>Flavor Synergy = Glutamate * Nucleotide Multiplier
</code></pre>

<h3>Practical Umami Hacks for the Home Cook</h3>
<p>To implement this in your daily kitchen flows without gourmet complexity, try these high-flavor seasoning pivots:</p>
<ol>
  <li><strong>The Soy/Parmesan Booster</strong>: Add a splash of fermented soy sauce or a microplane of aged parmesan to simple tomato sauces to round out sharp acidity.</li>
  <li><strong>Dehydrated Mushroom Powder</strong>: Keep a jar of ground dried shiitake mushrooms to dust over roasted broccolini or grain bowls. It adds an instant earthy depth.</li>
  <li><strong>Toasted Tomato Paste</strong>: Before pouring liquids, toast your tomato paste in olive oil until it turns brick-red. This triggers the Maillard reaction, unlocking beautiful savory nodes.</li>
</ol>

<p>By treating flavor combinations through systematic science, we can create comfort food that satisfies our bodies while elevating daily kitchen routines into a joyful culinary art.</p>`,
    coverImageUrl: 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&q=80&w=1200',
    authorId: 'user-marcus',
    categoryId: 'cat-food',
    status: 'published',
    publishedAt: '2026-06-05T14:30:00-07:00',
    metaTitle: 'The Alchemy of Umami Flavor Science | AuraLife',
    metaDescription: 'Discover glutamate synergy and home cook secrets to maximizing savory satisfaction.',
    readingTime: 6,
    viewCount: 980,
    createdAt: '2026-06-03T11:00:00-07:00',
    updatedAt: '2026-06-05T14:30:00-07:00',
    tags: ['tag-recipes', 'tag-gastronomy']
  },
  {
    id: 'post-cognitive-learning',
    title: 'The Spaced Retrieval Engine: Mastering Complex Subjects Without Mental Fatigue',
    slug: 'spaced-retrieval-learning-complex-subjects',
    excerpt: 'How to utilize cognitive memory patterns, active recall tests, and spaced consolidation intervals to learn languages or master complex concepts in half the time.',
    content: `<h2>Combatting the Forgetting Curve</h2>
<p>When studying a new language or learning complex educational curriculum, traditional cramming sessions simply fail. The human brain is pre-wired to discard transient information unless it is actively challenged at mathematically optimized intervals. This decline of memory strength over time is known as the Ebbinghaus Forgetting Curve.</p>

<h3>The Psychology of Active Recall</h3>
<p>Highlighting textbook pages or re-reading slides creates an illusion of competence—a cognitive bias where familiarity is mistaken for actual retrieval strength. Real retention only happens when your brain is forced to strain in order to construct the answer from scratch. This effortful retrieval signals the hippocampus that the memory is vital, prompting neural reinforcement.</p>

<h3>Building Your Personal Study Schedule</h3>
<p>To integrate this active educational protocol, use the progressive spaced interval formula to scale your review times:</p>

<pre><code>Review Intervals: Day 1 -> Day 3 -> Day 7 -> Day 14 -> Day 30
</code></pre>

<p>Every time you successfully retrieve a fact, its consolidation increases, and you can push the next review further out. If you fail, the counter resets. This ensures you spend your vital study hours focusing heavily on weak neural nodes, minimizing time wasted reviewing concepts you already know.</p>`,
    coverImageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=1200',
    authorId: 'user-elena',
    categoryId: 'cat-education',
    status: 'published',
    publishedAt: '2026-06-08T09:00:00-07:00',
    metaTitle: 'Master Spaced Retrieval & Learning Dynamics | AuraLife',
    metaDescription: 'Harness mathematical review spacing and active recall to build long-term retention easily.',
    readingTime: 5,
    viewCount: 710,
    createdAt: '2026-06-07T12:00:00-07:00',
    updatedAt: '2026-06-08T09:00:00-07:00',
    tags: ['tag-learning', 'tag-studyhacks']
  },
  {
    id: 'post-metro-happenings',
    title: 'Metropolitan Pulse: Inside the Ambient Art and Food Pop-up Revival',
    slug: 'metropolitan-pulse-ambient-art-food-revival',
    excerpt: 'A review of the collective visual art hubs and local culinary micro-events that are transforming underutilized urban structures into immersive social atmospheres.',
    content: `<h2>The Rise of Ambient Social Spaces</h2>
<p>The character of metropolitan events is shifting. Traditional static galleries and structured restaurants are giving way to temporary, multi-sensory experiences. Throughout the city, visual artists, independent chefs, and organic dynamic sound designers are collaborating to breathe life back into empty industrial structures.</p>

<h3>Curating the Sensory Pop-up</h3>
<p>These happenings stand out by intentionally rejecting standard visual patterns. Rather than hard white walls, artists use soft colored lanterns, low-frequency kinetic speaker setups, and communal seating charts that encourage spontaneous dialogue. Some elements typical of high-quality urban revivals include:</p>
<ul>
  <li><strong>Immersive Projection Gels</strong>: Shifting digital art loops projected directly on raw concrete surfaces, syncing with the speed of metropolitan life.</li>
  <li><strong>Micro-Culinary Stations</strong>: Moving food carts serving woodfired bread or regional noodle dishes directly to guests in custom paper parcels.</li>
  <li><strong>Spontaneous Education</strong>: Host-led 10-minute storytelling circles where local mentors share short visual histories of the neighborhood.</li>
</ul>

<p>By treating social spaces as breathing, collaborative canvases, urban collectives are building warm havens that make our modern cities feel like welcoming, tight-knit communities.</p>`,
    coverImageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1200',
    authorId: 'user-marcus',
    categoryId: 'cat-happenings',
    status: 'in_review',
    metaTitle: 'Metropolitan Pulse Pop-up Revivals | AuraLife',
    metaDescription: 'Chronicle of communal food hubs, ambient sound structures, and art galleries in the city.',
    readingTime: 4,
    viewCount: 220,
    createdAt: '2026-06-10T10:15:00-07:00',
    updatedAt: '2026-06-11T11:00:00-07:00',
    tags: ['tag-happenings', 'tag-culture']
  },
  {
    id: 'post-slow-coffee',
    title: 'Slow Coffee Chemistry: Understanding Extraction Dynamics at Home',
    slug: 'slow-coffee-chemistry-extraction-dynamics',
    excerpt: 'How coffee water temperatures, grind profiles, and pour agitation speeds regulate flavor profiles from bitter over-extractions to sweet balanced brews.',
    content: `<h2>A Ritual of Patience and Extraction</h2>
<p>Brewing slow coffee is not just a mechanism to consume caffeine—it is a meticulous ritual of water chemistry and patience. Every variable we engage, from the mineral content of our spring water to the flow speed of our copper kettle, affects how organic compounds dissolve from the bean matrix.</p>

<h3>The Sweet Spot of Extraction</h3>
<p>By weight, a coffee bean consists of soluble cellulose, acids, fats, and sugars. When hot water passes through, they dissolve in a strict sequence: sour organic acids extract first, followed by sweet complex sugars and lipids, and finally, bitter dry tannins. To brew the perfect cup, we attempt to halt extraction immediately after the sweet sugars dissolve but before the bitter tannins take over.</p>

<h3>Establishing Your Home Protocol</h3>
<p>Maximize your brewing consistency with these three fundamental standards:</p>
<ul>
  <li><strong>Optimized Temp</strong>: Keep water between 91°C and 94°C. Boiling water scorches the finer origin flavor notes immediately.</li>
  <li><strong>Consistent Grind</strong>: Use a conical burr grinder rather than speed blades to ensure all grounds are uniform shards, preventing uneven extractions.</li>
  <li><strong>Slow Drip Saturation</strong>: Wet your grounds evenly in a 30-second "bloom" flow to release trapped carbon dioxide, then pour water in smooth spiral patterns.</li>
</ul>

<p>Engaging in slow coffee teaches us to slow down, pay attention to the details, and start our mornings with quiet, deliberate craftsmanship.</p>`,
    coverImageUrl: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&q=80&w=1200',
    authorId: 'user-sarah',
    categoryId: 'cat-food',
    status: 'draft',
    readingTime: 4,
    viewCount: 0,
    createdAt: '2026-06-11T09:00:00-07:00',
    updatedAt: '2026-06-11T09:00:00-07:00',
    tags: ['tag-slowliving', 'tag-recipes']
  }
];

export const initialReviews: PostReview[] = [
  {
    id: 'rev-01',
    postId: 'post-metro-happenings',
    reviewerId: 'user-sarah',
    comment: 'Marcus, this POP-UP chronicle captures the urban art vibe perfectly! Can you add a little more details about the educational mini-lectures? Once appended, I will approve the state for publishing immediately.',
    action: 'changes_requested',
    createdAt: '2026-06-11T08:00:00-07:00'
  }
];

export const initialPageViews: PageView[] = [
  { id: 'pv-1', postId: 'post-daily-rituals', viewedAt: '2026-06-01T12:00:00Z', referrer: 'google', country: 'US' },
  { id: 'pv-2', postId: 'post-daily-rituals', viewedAt: '2026-06-02T13:00:00Z', referrer: 'instagram', country: 'CA' },
  { id: 'pv-3', postId: 'post-umami-science', viewedAt: '2026-06-06T15:00:00Z', referrer: 'direct', country: 'GB' },
  { id: 'pv-4', postId: 'post-umami-science', viewedAt: '2026-06-07T16:00:00Z', referrer: 'pinterest', country: 'DE' },
  { id: 'pv-5', postId: 'post-cognitive-learning', viewedAt: '2026-06-09T09:05:00Z', referrer: 'google', country: 'FR' },
  { id: 'pv-6', postId: 'post-cognitive-learning', viewedAt: '2026-06-10T11:45:00Z', referrer: 'substack', country: 'JP' }
];

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
