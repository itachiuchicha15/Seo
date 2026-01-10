/**
 * Results Page Constants
 */
export const RESULTS_STRINGS = {
    hero: {
        badge: 'Challenge Complete',
        title: 'The Final Results',
        subtitle: 'A transparent look at the data, the journey, and the lessons learned from 60 days of pure organic SEO.',
    },
    metrics: {
        title: 'Key Performance Indicators',
        subtitle: 'The numbers that define the challenge outcome.',
    },
    journey: {
        title: 'The Journey Timeline',
        subtitle: 'Key milestones and ranking progress throughout the challenge.',
    },
    lessons: {
        title: 'Key Takeaways',
        subtitle: 'The most important lessons from this 60-day experiment.',
    },
    cta: {
        title: 'Ready to Achieve Similar Results?',
        subtitle: "If I can build authority from scratch, imagine what we can do together for your established brand.",
        primary: 'Start a Conversation',
        secondary: 'View All Challenge Logs',
    },
} as const;

export const RESULTS_LESSONS = [
    {
        iconName: 'Lightbulb',
        title: 'Consistency Beats Perfection',
        description: 'Regular content updates, even if not perfect, signal freshness and authority to search engines far more than sporadic "perfect" posts.',
    },
    {
        iconName: 'Zap',
        title: 'Technical Foundation is Key',
        description: 'A fast, clean, mobile-first site is the bedrock. Content matters, but if your site is slow or broken, rankings will suffer.',
    },
    {
        iconName: 'Target',
        title: 'Intent Alignment Wins',
        description: 'Targeting keywords that match search intent precisely led to faster traction than chasing high-volume, competitive terms.',
    },
] as const;
