import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Twitter, PenSquare } from 'lucide-react';

const Footer: React.FC = () => {
  const socialLinks = [
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Medium', icon: PenSquare, href: '#' },
  ];
  
  const navLinks = {
    'The Challenge': [
        { name: 'Challenge Log', href: '/blog' },
        { name: 'The Process', href: '/process' },
        { name: 'Results', href: '/results' },
    ],
    'Connect': [
        { name: 'About', href: '/about' },
        { name: 'Work With Me', href: '/work-with-me' },
        { name: 'Contact', href: '/contact' },
    ],
  }

  return (
    <footer className="bg-dark text-muted border-t border-secondary/20">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
                <h3 className="text-2xl font-bold text-white">Search Me If You Can</h3>
                <p className="mt-2 text-base max-w-sm">
                    A real-time portfolio proving SEO skills, not just talking about them. Follow the 60-day challenge from scratch.
                </p>
            </div>
            {Object.entries(navLinks).map(([title, links]) => (
                <div key={title}>
                    <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-400">{title}</h4>
                    <ul className="mt-4 space-y-3">
                        {links.map(link => (
                            <li key={link.name}>
                                <Link to={link.href} className="text-base hover:text-primary transition-colors">
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>

        <div className="mt-12 pt-8 border-t border-secondary/20 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-base text-center sm:text-left">
                &copy; {new Date().getFullYear()} Alex Doe. All rights reserved.
            </p>
            <div className="flex justify-center space-x-6 mt-4 sm:mt-0">
                {socialLinks.map(social => (
                     <a key={social.name} href={social.href} className="hover:text-primary transition-colors">
                        <span className="sr-only">{social.name}</span>
                        <social.icon />
                    </a>
                ))}
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
