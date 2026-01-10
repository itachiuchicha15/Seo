/**
 * Services Page Constants
 * All content data for the services page
 */

export const SERVICES_STRINGS = {
    hero: {
        title: 'What I Bring to the Digital World',
        subtitle: 'A multidimensional skill set built on creativity, analytics, and full-stack digital execution. My services are organized into four core pillars designed to create visibility, engagement, and long-term brand growth.',
    },
    cta: {
        title: 'Ready to put these skills to work?',
        subtitle: "This is what I bring to the table. Let's discuss how these services can be tailored to meet your brand's unique goals.",
        button: "Let's Work Together",
    },
} as const;

export const SKILL_PILLARS = [
    {
        iconName: 'Search',
        title: 'SEO & Digital Marketing',
        skills: [
            'Uncover Hidden Growth Opportunities with Technical Audits',
            'Capture Your Audience with Search Intent Mapping',
            'Build Authority with Content Strategy & Topic Clustering',
            'Maximize Visibility with On-Page & Semantic SEO',
            'Track What Matters with Performance Analytics',
            'Dominate Your Niche with Personal Branding SEO',
            'Implement Frameworks for Sustainable Organic Growth',
        ],
        description: 'My SEO approach blends creativity with data. I focus on building content ecosystems that drive consistent traffic, rank for high-intent keywords, and establish long-term authority.',
    },
    {
        iconName: 'Share2',
        title: 'Social Media Marketing',
        skills: [
            'Develop Platform-Specific Content Strategies',
            'Create High-Engagement Formats (Reels, Carousels)',
            'Gain an Edge with Audience & Competitor Benchmarking',
            'Maximize Reach with Strategic Hashtags & Trend Analysis',
            'Build Your Brand Narrative Through Visual Storytelling',
            'Cultivate a Loyal Following with Organic Engagement Systems',
            'Optimize for Growth with Social Media Analytics',
        ],
        description: 'I turn social platforms into lead-generating ecosystems that strengthen brand identity, increase reach, and drive measurable growth without relying on paid ads.',
    },
    {
        iconName: 'Palette',
        title: 'Creative Graphic Design',
        skills: [
            'Establish a Memorable Brand with Visual Identity Kits',
            'Drive Action with High-Impact Marketing Materials',
            'Stop the Scroll with Stunning Social Media Creatives',
            'Define Your Brand with Professional Logo Design',
            'Enhance User Experience with Intuitive UI/UX Designs',
            'Communicate Your Message with Clarity and Impact',
        ],
        description: 'My design philosophy: Simple. Bold. Strategic. Every design I create supports your brand story and enhances user experience.',
    },
    {
        iconName: 'Code',
        title: 'Full-Stack Website Development',
        skills: [
            'Bring Your Vision to Life with End-to-End Development',
            'Build a Foundation for SEO Success',
            'Ensure a Flawless Experience on Any Device',
            'Convert Visitors with High-Performance Landing Pages',
            'Take Control of Your Content with Custom CMS',
            'Boost Rankings with a Fast, Secure, and Performant Site',
        ],
        description: 'I build websites that are not just visually appealing but also technically strong, fast, user-friendly, and optimized for search engines.',
    },
] as const;
