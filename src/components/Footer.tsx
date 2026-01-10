/**
 * Footer Component
 * L7 Refactored - Uses centralized navigation constants
 */
import React from 'react';
import { Link } from "react-router-dom";
import { Linkedin, PenSquare } from 'lucide-react';
import { FOOTER_NAV, ROUTES } from '../constants';
import { APP_CONFIG } from '../constants/config';

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Icon mapping for social links
const SOCIAL_ICONS = {
  Linkedin,
  X: XIcon,
  PenSquare,
};

const SOCIAL_LINKS = [
  { name: 'LinkedIn', icon: SOCIAL_ICONS.Linkedin, href: '#' },
  { name: 'X', icon: SOCIAL_ICONS.X, href: '#' },
  { name: 'Medium', icon: SOCIAL_ICONS.PenSquare, href: '#' },
];

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
          <div className="md:col-span-2">
            <Link to={ROUTES.HOME} className="text-2xl font-extrabold text-white hover:text-primary transition-colors">
              {APP_CONFIG.name}
            </Link>
            <p className="mt-4 text-base max-w-sm mx-auto md:mx-0 leading-relaxed text-slate-400">
              A real-time portfolio proving SEO skills, not just talking about them. Follow the {APP_CONFIG.challengeDurationDays}-day challenge from scratch.
            </p>
          </div>
          {Object.entries(FOOTER_NAV).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-bold text-xs uppercase tracking-[0.2em] text-slate-500 mb-6">{title}</h4>
              <ul className="space-y-4">
                {links.map(link => (
                  <li key={link.name}>
                    <Link to={link.href} className="text-sm text-slate-300 hover:text-white transition-colors duration-200">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-xs font-medium text-slate-500 text-center sm:text-left">
            &copy; {new Date().getFullYear()} {APP_CONFIG.author}. Built with precision and strategy.
          </p>
          <div className="flex justify-center space-x-6">
            {SOCIAL_LINKS.map(social => (
              <a key={social.name} href={social.href} className="text-slate-500 hover:text-white transition-all duration-300 transform hover:scale-110">
                <span className="sr-only">{social.name}</span>
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;