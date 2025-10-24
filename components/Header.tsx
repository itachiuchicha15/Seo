import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { X, Menu } from 'lucide-react';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Style for standard desktop nav links
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
      isActive
        ? 'text-dark'
        : 'text-muted hover:text-dark'
    } after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 ${
      isActive ? 'after:w-4' : 'group-hover:after:w-4'
    }`;
    
  // Style for standard mobile nav links
  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  `block py-2 px-3 rounded-md text-base font-medium transition-colors duration-200 ${
    isActive
      ? 'bg-primary/10 text-dark font-semibold'
      : 'text-secondary hover:bg-gray-100 hover:text-dark'
  }`;

  // All navigation items, in order
  const allNavItems = [
    { path: '/', label: 'Home' },
    { path: '/blog', label: 'Challenge Log' },
    { path: '/about', label: 'About' },
    { path: '/process', label: 'The Process' },
    { path: '/results', label: 'Results' },
    { path: '/work-with-me', label: 'Work With Me' },
    { path: '/contact', label: 'Contact' },
  ];

  const ctaPath = '/work-with-me';

  // For desktop, filter out the CTA for standard link mapping
  const mainNavItems = allNavItems.filter(item => item.path !== ctaPath);
  // Find the CTA item for the button
  const ctaNavItem = allNavItems.find(item => item.path === ctaPath)!;

  return (
    <header className="bg-light/80 backdrop-blur-lg sticky top-0 z-50 border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-dark hover:text-primary transition-colors duration-300">
              Search Me If You Can
            </Link>
          </div>
          <div className="hidden md:flex items-center">
            <div className="ml-10 flex items-baseline space-x-1">
              {mainNavItems.map((item) => (
                <div key={item.path} className="group">
                  <NavLink to={item.path} className={navLinkClass}>
                    {item.label}
                  </NavLink>
                </div>
              ))}
            </div>
            <div className="ml-6">
                <Link
                    to={ctaNavItem.path}
                    className="inline-block bg-primary text-dark font-bold py-2 px-5 rounded-full text-sm hover:brightness-95 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md shadow-primary/20"
                >
                    {ctaNavItem.label}
                </Link>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-gray-100 inline-flex items-center justify-center p-2 rounded-md text-muted hover:text-dark hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-light focus:ring-primary"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? <Menu className="h-6 w-6" /> : <X className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {allNavItems.map((item) => {
                if (item.path === ctaPath) {
                    return (
                        <div className="py-1" key={item.path}>
                            <NavLink 
                                to={item.path} 
                                className={({ isActive }) => `block text-center py-2.5 px-3 rounded-md text-base font-bold transition-colors duration-200 ${isActive ? 'bg-primary text-white shadow-inner' : 'bg-secondary text-white hover:bg-dark'}`}
                                onClick={() => setIsOpen(false)}
                            >
                                {item.label}
                            </NavLink>
                        </div>
                    );
                }
                return (
                    <NavLink key={item.path} to={item.path} className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>
                        {item.label}
                    </NavLink>
                );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;