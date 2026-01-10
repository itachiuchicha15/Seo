/**
 * Page Constants
 * NotFound and Process pages only
 */

/**
 * NotFound Page Constants
 */
export const NOT_FOUND_STRINGS = {
    code: '404',
    title: 'Page Not Found',
    description: "It seems you've ventured off the beaten path. The page you're looking for doesn't exist or has been moved.",
    button: 'Return to Homepage',
} as const;

/**
 * Process Page Constants
 */
export const PROCESS_STRINGS = {
    hero: {
        title: 'The Challenge Process',
        subtitle: 'A step-by-step breakdown of how this challenge is structured, from initial setup to the final report.',
    },
    tools: {
        title: 'Tools of the Trade',
        subtitle: 'Sticking to the "no budget" rule means relying on powerful free tools.',
    },
} as const;

export const PROCESS_STEPS = [
    {
        number: 1,
        title: 'Foundation & Setup',
        content: 'The challenge begins with a clean slate. This involves purchasing a new domain, setting up a fast, lightweight website, and installing essential tracking tools to create a solid technical foundation.',
        iconName: 'Layers',
    },
    {
        number: 2,
        title: 'Content Creation & On-Page SEO',
        content: 'This is the core of the strategy. I will be regularly publishing high-quality, relevant content, with each piece meticulously optimized with on-page SEO best practices (titles, metas, headers, etc.).',
        iconName: 'PenTool',
    },
    {
        number: 3,
        title: 'Tracking & Analysis',
        content: "Data drives every decision. I'll constantly monitor keyword rankings, organic traffic, and user engagement metrics. This allows for agile adjustments to the strategy based on what the data reveals.",
        iconName: 'BarChart3',
    },
    {
        number: 4,
        title: 'Public Updates & Transparency',
        content: "Every significant step, success, or failure will be documented in the Challenge Log. This commitment to transparency is key to the project's goal of being an educational resource and an honest portfolio piece.",
        iconName: 'Megaphone',
    },
] as const;

export const PROCESS_TOOLS = [
    'Google Analytics',
    'Google Search Console',
    'Ahrefs Free Tools',
    'Screaming Frog (Free)',
] as const;
