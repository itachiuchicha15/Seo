import React from 'react';
import { Link } from "react-router-dom";
import { Linkedin, PenSquare } from 'lucide-react';

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const Footer: React.FC = () => {
  const socialLinks = [
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'X', icon: XIcon, href: '#' },
    { name: 'Medium', icon: PenSquare, href: '#' },
  ];
  
  const navLinks = {
    'The Challenge': [
        { name: 'Challenge Log', href: '/blog' },
        { name: 'The Challenge', href: '/challenge' },
        { name: 'Results', href: '/results' },
    ],
    'Connect': [
        { name: 'About', href: '/about' },
        { name: 'Services', href: '/services' },
        { name: 'Work With Me', href: '/work-with-me' },
        { name: 'Contact', href: '/contact' },
    ],
  }

  return (
    <footer className="bg-dark text-light/80 border-t border-muted/10">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
            <div className="md:col-span-2">
                <h3 className="text-2xl font-extrabold text-light">Search Me If You Can</h3>
                <p className="mt-4 text-base max-w-sm mx-auto md:mx-0 leading-relaxed">
                    A real-time portfolio proving SEO skills, not just talking about them. Follow the 60-day challenge from scratch.
                </p>
            </div>
            {Object.entries(navLinks).map(([title, links]) => (
                <div key={title}>
                    <h4 className="font-bold text-xs uppercase tracking-[0.2em] text-muted mb-6">{title}</h4>
                    <ul className="space-y-4">
                        {links.map(link => (
                            <li key={link.name}>
                                <Link to={link.href} className="text-sm hover:text-primary transition-colors duration-200">
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>

        <div className="mt-16 pt-8 border-t border-muted/5 flex flex-col sm:flex-row justify-between items-center gap-6">
            <p className="text-xs font-medium text-muted/60 text-center sm:text-left">
                &copy; {new Date().getFullYear()} Eswarapandi Vinayagamoorthy. Built with precision and strategy.
            </p>
            <div className="flex justify-center space-x-6">
                {socialLinks.map(social => (
                     <a key={social.name} href={social.href} className="text-light/40 hover:text-primary transition-all duration-300 transform hover:scale-110">
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