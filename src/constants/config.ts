/**
 * Application Configuration Constants
 * Centralized config for app-wide settings
 */

export const APP_CONFIG = {
    name: 'Search Me If You Can',
    tagline: 'The 60-Day SEO Challenge',
    author: 'Eswarapandi Vinayagamoorthy',
    challengeDurationDays: 60,
} as const;

export const ANIMATION_CONFIG = {
    /** Default intersection observer threshold */
    intersectionThreshold: 0.1,
    /** Stagger delay for sequential animations (ms) */
    staggerDelay: 200,
    /** Default transition duration (ms) */
    transitionDuration: 300,
} as const;

export const CHART_CONFIG = {
    svgWidth: 800,
    svgHeight: 250,
    padding: {
        top: 20,
        right: 60,
        bottom: 30,
        left: 60,
    },
    /** Distance threshold for tooltip activation */
    tooltipActivationDistance: 50,
    /** Connection distance for particle network */
    particleConnectionDistance: 120,
} as const;

export const PARTICLE_CONFIG = {
    /** Density divisor for particle count calculation */
    densityDivisor: 15000,
    /** Min particle size */
    minSize: 1,
    /** Max additional particle size */
    maxSizeVariance: 2,
    /** Max speed variance */
    speedVariance: 0.2,
    /** Mouse interaction radius */
    mouseRadius: 100,
} as const;
