/**
 * Application Route Constants
 * Single source of truth for all navigation paths
 */
export const ROUTES = {
    HOME: '/',
    ABOUT: '/about',
    BLOG: '/blog',
    BLOG_POST: '/blog/:slug',
    CHALLENGE: '/challenge',
    CONTACT: '/contact',
    PROCESS: '/process',
    RESULTS: '/results',
    SERVICES: '/services',
    WORK_WITH_ME: '/work-with-me',
    NOT_FOUND: '*',

    // Admin Routes
    ADMIN: {
        LOGIN: '/admin/login',
        DASHBOARD: '/admin',
        POST_EDITOR: '/admin/posts/:id',
        POST_NEW: '/admin/posts/new',
    },
} as const;

/**
 * Helper to generate dynamic routes
 */
export const generateRoute = {
    blogPost: (slug: string) => `/blog/${slug}`,
    adminPostEditor: (id: string) => `/admin/posts/${id}`,
} as const;
