/**
 * Challenge Page Constants
 */
export const CHALLENGE_STRINGS = {
    hero: {
        badge: 'An Open Portfolio',
        title: 'The 60-Day SEO Challenge',
        subtitle: '"Search Me If You Can" is a personal experiment to rank a new brand from absolute zero in 60 days, using only pure SEO strategy and consistent execution.',
    },
    why: {
        title: 'Why Take On Such a Difficult Challenge?',
        intro: 'Because I want to prove something simple yet powerful:',
        proof: 'If I can rank myself starting from nothing, I can rank your brand too.',
        description: 'The online world is crowded with self-proclaimed "experts" who speak in theories but rarely demonstrate their abilities with transparent, real-time results. This challenge is my open portfolio. Instead of showing static case studies, I\'m showing a live demonstration of my skillset.',
        skillsTitle: 'Skills on Display:',
        conclusion: 'Every success, every setback, every experiment and every ranking movement is documented in the open. The challenge isn\'t just about gaining visibility. It\'s about showcasing end-to-end SEO thinking, transparency, and digital growth in a way most marketers never attempt.',
    },
    process: {
        title: 'The Challenge Process',
        subtitle: 'A step-by-step breakdown of how this challenge is structured.',
    },
    mission: {
        title: 'The Bigger Picture: Mission & Purpose',
        p1: "This website is more than a portfolio it's a digital laboratory. A place where I test ideas, share insights, document challenges, and showcase the power of consistent, strategic digital marketing. The 60-Day SEO Challenge is just the beginning. My goal is to turn this space into a resource for marketers, creators, business owners, freelancers, and anyone looking to grow online.",
        p2: "Whether you're here out of curiosity, inspiration, or interest in working with me, I want this platform to provide something valuable knowledge, clarity, or simply the confidence that you're witnessing real skills in action.",
        quote: 'My mission is simple but powerful: To help brands grow using creativity, strategy, and full-stack digital execution. I want to empower businesses big or small to build strong digital identities, develop meaningful relationships with their audience, and achieve sustainable growth through organic visibility.',
        closing: 'If I can create my own authority from scratch in 60 days, imagine what I can build for someone who already has a story, vision, and product worth discovering.',
    },
    cta: {
        title: 'Follow The Journey',
        subtitle: 'See the day-by-day progress, learnings, and real-time data from the challenge.',
        primary: 'Read the Challenge Log',
        secondary: 'See The Final Results',
    },
} as const;

export const DEMONSTRATED_SKILLS = [
    'Advanced keyword research and search intent analysis',
    'On-page SEO optimization and semantic structuring',
    'Content creation, topic clustering, and internal linking',
    'Organic growth strategies across search, social, and communities',
    'Analytics monitoring, impression tracking, and rank movement analysis',
    'Iteration, testing, creativity, and problem-solving in real time',
] as const;

export const CHALLENGE_PROCESS_STEPS = [
    {
        iconName: 'Layers',
        defaultTitle: 'Foundation & Setup',
        content: 'The challenge begins with a clean slate. This involves purchasing a new domain, setting up a fast, lightweight website, and installing essential tracking tools to create a solid technical foundation.',
    },
    {
        iconName: 'PenTool',
        defaultTitle: 'Content Creation & On-Page SEO',
        content: 'This is the core of the strategy. I will be regularly publishing high-quality, relevant content, with each piece meticulously optimized with on-page SEO best practices (titles, metas, headers, etc.).',
    },
    {
        iconName: 'BarChart3',
        defaultTitle: 'Tracking & Analysis',
        content: "Data drives every decision. I'll constantly monitor keyword rankings, organic traffic, and user engagement metrics. This allows for agile adjustments to the strategy based on what the data reveals.",
    },
    {
        iconName: 'Megaphone',
        defaultTitle: 'Public Updates & Transparency',
        content: "Every significant step, success, or failure will be documented in the Challenge Log. This commitment to transparency is key to the project's goal of being an educational resource and an honest portfolio piece.",
    },
] as const;
