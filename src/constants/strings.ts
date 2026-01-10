/**
 * Application String Constants
 * Centralized strings for easy maintenance and future i18n
 */

export const HOME_STRINGS = {
    hero: {
        badge: 'The 60-Day SEO Challenge',
        title: 'Search Me If You Can',
        subtitle: "If I can rank myself, I can rank your brand. A real-time portfolio proving SEO skills, not just talking about them.",
        ctaPrimary: 'Follow the Challenge',
        ctaSecondary: 'About The Challenge',
    },
    dashboard: {
        title: 'Live Performance',
        subtitle: 'Real-time progress, from day zero to total organic domination.',
        noData: 'No challenge data available yet. Check back soon!',
        showLog: 'Show Detailed Log',
        hideLog: 'Hide Detailed Log',
        notEnoughData: 'Not enough data to display chart.',
    },
    metrics: {
        rank: 'Current SERP Rank',
        clicks: 'Total Clicks',
        impressions: 'Total Impressions',
        fromNotIndexed: 'From Not Indexed',
        vsDay1: 'vs Day 1',
    },
    caseStudy: {
        title: 'A Transparent Case Study',
        subtitle: "This challenge is a public demonstration of ranking a brand new site from scratch—pure SEO strategy.",
        goal: {
            title: 'The Goal',
            description: 'Achieve a top-10 Google ranking for "Eswarapandi SEO Challenge" to showcase practical, effective skills.',
        },
        stakes: {
            title: 'The Stakes',
            description: "Success builds my brand. Failure is a public lesson. Either way, it's a real-world demonstration of the SEO journey.",
        },
        rules: {
            title: 'The Rules',
            items: [
                'No budget for ads.',
                'No prior brand authority.',
                'No paid backlink campaigns.',
            ],
        },
    },
    latestUpdates: {
        title: 'Latest Updates',
        viewAll: 'View All Logs',
    },
    faq: {
        title: 'Common Questions',
    },
} as const;

export const FAQ_DATA = [
    {
        question: "What exactly is this challenge?",
        answer: "It's a 60-day public experiment where I build a new personal brand and try to rank it on Google for a specific keyword phrase from scratch, using only organic SEO techniques."
    },
    {
        question: "Why 60 days?",
        answer: "Sixty days is a challenging yet realistic timeframe to demonstrate meaningful progress in SEO. It's long enough for Google to recognize a new site but short enough to keep the pressure on."
    },
    {
        question: "How will rankings be tracked?",
        answer: "I will be using Google Search Console as the primary source of truth for rankings, clicks, and impressions. I'll share regular, unfiltered screenshots in the Challenge Log."
    },
    {
        question: "Can others replicate this?",
        answer: "Absolutely! The goal is to be fully transparent about the process and tactics used. You can follow along and apply the same principles to your own projects."
    }
] as const;

export const COMMON_STRINGS = {
    loading: 'Loading...',
    error: 'An error occurred',
    retry: 'Try Again',
    viewDetails: 'View Details',
    learnMore: 'Learn More',
    getStarted: 'Get Started',
    contactUs: 'Contact Us',
} as const;
