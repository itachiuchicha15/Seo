/**
 * WorkWithMe Page Constants
 */
export const WORK_WITH_ME_STRINGS = {
    hero: {
        title: "Let's Build Your Authority.",
        subtitle: "This challenge proves a methodology. Now, let's apply that same data-driven, transparent process to elevate your brand above the noise.",
        quote: '"If I can rank myself, imagine what I can do for your established brand."',
        author: '- Eswarapandi V',
    },
    process: {
        title: 'How It Works: A Proven Process',
        subtitle: 'A partnership built on clarity, strategy, and measurable results.',
        included: "What's Included",
    },
    fit: {
        title: 'Is This The Right Fit For You?',
        subtitle: 'My approach works best with partners who are ready for sustainable, long-term growth.',
        goodFit: {
            title: "You're a great fit if...",
            items: [
                'You see SEO as a long-term investment, not a quick fix.',
                'You have an established business and are ready to scale.',
                'You value a transparent process and data-driven decisions.',
                'You are ready to collaborate on content and strategy.',
            ],
        },
        badFit: {
            title: 'This might not be for you if...',
            items: [
                'You need guaranteed first-page rankings in 30 days.',
                "You're looking for the cheapest possible SEO provider.",
                'Your business is brand new with no existing content or traffic.',
                "You aren't able to invest time in collaboration.",
            ],
        },
    },
    cta: {
        title: 'Ready to Build Your Authority?',
        subtitle: "Let's discuss how my proven, transparent approach to SEO can help you achieve your business goals. The first step is a free, no-obligation discovery call.",
        button: 'Book Your Free Discovery Call',
    },
} as const;

export const WORK_PROCESS_STEPS = [
    {
        iconName: 'Search',
        title: '1. Discovery & Audit',
        description: 'We start by diving deep into your brand, your audience, and your competition. I conduct a thorough technical and content audit to establish a baseline and identify the highest-impact opportunities.',
        deliverables: ['Full Technical SEO Audit', 'Competitor Analysis Report', 'Initial Keyword Research', 'Goal-Setting Workshop'],
    },
    {
        iconName: 'Wrench',
        title: '2. Strategy & Execution',
        description: "Using the insights from our discovery phase, I build a custom, data-driven SEO roadmap. This is where we create and optimize content, fix technical issues, and build your site's authority.",
        deliverables: ['60-Day Content Calendar', 'On-Page Optimization Plan', 'Technical Fix Implementation', 'Authority Building Initiatives'],
    },
    {
        iconName: 'LineChart',
        title: '3. Reporting & Growth',
        description: "SEO is a long-term game. You'll receive clear, concise monthly reports tracking our progress against our goals. We'll have regular check-ins to analyze results and adapt our strategy for continuous growth.",
        deliverables: ['Monthly Performance Reports', 'Keyword Rank Tracking', 'Bi-Weekly Strategy Calls', 'Quarterly Business Reviews'],
    },
] as const;
