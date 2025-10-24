
import { BlogPost } from '../types';

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: 'day-1-starting-from-zero',
    title: 'Day 1: Starting from Zero – No Authority, No Backlinks',
    date: '2024-07-28',
    author: 'Alex Doe',
    excerpt: 'The journey begins. Today, I registered the domain, set up the basic site, and published the first piece of content. Here is a look at the baseline metrics - zero everything.',
    imageUrl: 'https://picsum.photos/seed/day1/800/400',
    content: `
      <p class="mb-4">It's Day 1 of the "Search Me If You Can" challenge, and the starting line couldn't be more humbling. We have a fresh domain, a barebones website, and absolutely zero authority in the eyes of Google. This is the ultimate test: can pure SEO strategy and execution build a brand from literal digital dust?</p>
      <h3 class="text-2xl font-bold mb-2 text-brand-dark">The Setup</h3>
      <ul class="list-disc list-inside mb-4 pl-4 space-y-2">
        <li><strong>Domain:</strong> Registered 'searchmeifyoucan.challenge' (hypothetical).</li>
        <li><strong>Hosting & CMS:</strong> A lightweight setup using a static site generator for maximum speed.</li>
        <li><strong>Analytics:</strong> Google Analytics and Search Console are installed. It feels like staring into an empty void right now.</li>
      </ul>
      <h3 class="text-2xl font-bold mb-2 text-brand-dark">Initial Metrics</h3>
      <p class="mb-4">Here's the beautiful, terrifying dashboard of a brand new site:</p>
      <img src="https://picsum.photos/seed/metrics1/600/300" alt="Empty metrics dashboard" class="rounded-lg shadow-md mx-auto mb-4" />
      <ul class="list-disc list-inside mb-4 pl-4 space-y-2">
        <li><strong>Impressions:</strong> 0</li>
        <li><strong>Clicks:</strong> 0</li>
        <li><strong>Keyword Ranking for "Alex Doe SEO Challenge":</strong> Not indexed.</li>
        <li><strong>Domain Authority:</strong> 1 (the default).</li>
      </ul>
      <h3 class="text-2xl font-bold mb-2 text-brand-dark">The Takeaway</h3>
      <p>This is ground zero. Every single impression from here on out will be a victory. The plan for this week is to focus on foundational on-page SEO and creating the first few pieces of core content. Let the games begin.</p>
    `,
    metrics: { rank: 'Not Indexed', clicks: 0, impressions: 0 },
    tags: ['Challenge Start', 'On-Page SEO', 'Baseline'],
  },
  {
    id: 2,
    slug: 'week-1-first-impressions',
    title: 'Week 1 Update: We Have Impressions! (And a Long Way to Go)',
    date: '2024-08-04',
    author: 'Alex Doe',
    excerpt: 'The first week is in the books! We are officially on Google\'s radar. This post breaks down the first few pieces of content, the initial on-page SEO tweaks, and our first (tiny) trickle of data.',
    imageUrl: 'https://picsum.photos/seed/week1/800/400',
    content: `
      <p class="mb-4">Seven days into the challenge, and we have a pulse! It's faint, but it's there. After submitting the sitemap and getting the initial pages indexed, Google Search Console is no longer an empty void. It's a testament to the fact that just showing up is the first step.</p>
      <h3 class="text-2xl font-bold mb-2 text-brand-dark">Tactics Tried This Week</h3>
      <ul class="list-disc list-inside mb-4 pl-4 space-y-2">
        <li><strong>Content Creation:</strong> Published three blog posts, including the "Day 1" log and the "About the Challenge" page. Each was optimized for our target keywords.</li>
        <li><strong>On-Page SEO:</strong> Ensured all title tags, meta descriptions, header tags, and image alt texts were meticulously optimized.</li>
        <li><strong>Internal Linking:</strong> Created a logical internal linking structure between the new pages to distribute link equity (what little there is).</li>
      </ul>
      <h3 class="text-2xl font-bold mb-2 text-brand-dark">Progress Metrics</h3>
      <img src="https://picsum.photos/seed/metrics2/600/300" alt="First impressions on Search Console" class="rounded-lg shadow-md mx-auto mb-4" />
      <ul class="list-disc list-inside mb-4 pl-4 space-y-2">
        <li><strong>Impressions:</strong> 15</li>
        <li><strong>Clicks:</strong> 0</li>
        <li><strong>Keyword Ranking for "Alex Doe SEO Challenge":</strong> Position 87</li>
      </ul>
      <h3 class="text-2xl font-bold mb-2 text-brand-dark">Takeaway Lessons</h3>
      <p>Patience is everything. Seeing a rank of 87 isn't glamorous, but it's proof that we exist. The focus for Week 2 will be on creating more in-depth content and starting some manual, no-budget distribution efforts on social media and relevant communities.</p>
    `,
    metrics: { rank: 87, clicks: 0, impressions: 15 },
    tags: ['Week 1', 'Impressions', 'Content Strategy'],
  },
  {
    id: 3,
    slug: 'week-2-the-content-grind',
    title: 'Week 2: The Content Grind and First Click',
    date: '2024-08-11',
    author: 'Alex Doe',
    excerpt: 'This week was all about content. I published two long-form guides related to our niche to act as "pillar content". And the biggest news? We got our very first organic click!',
    imageUrl: 'https://picsum.photos/seed/week2/800/400',
    content: `
      <p class="mb-4">If Week 1 was about getting on the board, Week 2 was about building the foundation. SEO is a content game, and this week I put my head down and wrote. The goal was to create pieces that were genuinely useful, not just keyword-stuffed pages.</p>
      <h3 class="text-2xl font-bold mb-2 text-brand-dark">Key Activities</h3>
      <ul class="list-disc list-inside mb-4 pl-4 space-y-2">
        <li><strong>Pillar Content:</strong> Wrote a 2,500-word guide on "Personal Branding SEO for Freelancers."</li>
        <li><strong>Supporting Content:</strong> Published another post on "10 Free Tools to Track Your SEO Progress."</li>
        <li><strong>Content Distribution:</strong> Shared the new articles on LinkedIn and a few niche subreddits. This was purely for visibility, not for building backlinks directly.</li>
      </ul>
      <h3 class="text-2xl font-bold mb-2 text-brand-dark">The Big Milestone: Our First Click!</h3>
      <img src="https://picsum.photos/seed/metrics3/600/300" alt="First click on Search Console" class="rounded-lg shadow-md mx-auto mb-4" />
       <p class="mb-4 text-center text-lg font-semibold text-brand-primary">It happened! One glorious, solitary click.</p>
       <ul class="list-disc list-inside mb-4 pl-4 space-y-2">
        <li><strong>Impressions:</strong> 78</li>
        <li><strong>Clicks:</strong> 1</li>
        <li><strong>Keyword Ranking for "Alex Doe SEO Challenge":</strong> Position 62</li>
      </ul>
      <h3 class="text-2xl font-bold mb-2 text-brand-dark">Takeaway Lessons</h3>
      <p>Quality content is the engine of SEO. While the numbers are still small, the jump in impressions and our first click show that providing value is what gets Google's attention. Next week, I'll explore some digital PR and outreach strategies that don't require a budget.</p>
    `,
    metrics: { rank: 62, clicks: 1, impressions: 78 },
    tags: ['Week 2', 'Content Marketing', 'Milestone'],
  },
];
