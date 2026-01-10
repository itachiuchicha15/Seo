/**
 * Navigation Constants
 * Single source of truth for all navigation items
 */
import { ROUTES } from './routes';

export interface NavItem {
    path: string;
    label: string;
}

export const MAIN_NAV_ITEMS: NavItem[] = [
    { path: ROUTES.HOME, label: 'Home' },
    { path: ROUTES.BLOG, label: 'Log' },
    { path: ROUTES.ABOUT, label: 'About' },
    { path: ROUTES.SERVICES, label: 'Services' },
    { path: ROUTES.CHALLENGE, label: 'The Challenge' },
    { path: ROUTES.RESULTS, label: 'Results' },
    { path: ROUTES.CONTACT, label: 'Contact' },
];

export const CTA_NAV_ITEM: NavItem = {
    path: ROUTES.WORK_WITH_ME,
    label: 'Work With Me',
};

export const FOOTER_NAV = {
    'The Challenge': [
        { name: 'Challenge Log', href: ROUTES.BLOG },
        { name: 'The Challenge', href: ROUTES.CHALLENGE },
        { name: 'Results', href: ROUTES.RESULTS },
    ],
    'Connect': [
        { name: 'About', href: ROUTES.ABOUT },
        { name: 'Services', href: ROUTES.SERVICES },
        { name: 'Work With Me', href: ROUTES.WORK_WITH_ME },
        { name: 'Contact', href: ROUTES.CONTACT },
    ],
} as const;

export const SOCIAL_LINKS = [
    { name: 'LinkedIn', href: '#', iconName: 'Linkedin' },
    { name: 'X', href: '#', iconName: 'X' },
    { name: 'Medium', href: '#', iconName: 'PenSquare' },
] as const;

export const THEME_OPTIONS = [
    { id: 'harvest', name: 'Harvest' },
    { id: 'cold-sky', name: 'Cold Sky' },
    { id: 'bright-azure', name: 'Bright Azure' },
    { id: 'deep-space', name: 'Deep Space' },
    { id: 'midnight-sand', name: 'Midnight Sand' },
    { id: 'ocean-breeze', name: 'Ocean Breeze' },
] as const;
