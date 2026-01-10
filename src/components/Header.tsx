/**
 * Header Component
 * L7 Refactored - Uses centralized navigation constants
 */
import React, { useState } from 'react';
import { Link, NavLink } from "react-router-dom";
import { X, Menu } from 'lucide-react';
import { MAIN_NAV_ITEMS, CTA_NAV_ITEM, ROUTES } from '../constants';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative px-3 py-2 rounded-md text-sm font-bold transition-colors duration-300 ${isActive
      ? 'text-dark'
      : 'text-muted hover:text-dark'
    } after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 ${isActive ? 'after:w-4' : 'group-hover:after:w-4'
    }`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block py-2 px-3 rounded-md text-base font-bold transition-colors duration-200 ${isActive
      ? 'bg-primary/10 text-dark'
      : 'text-muted hover:bg-muted/10 hover:text-dark'
    }`;

  return (
    <header className="bg-light/90 backdrop-blur-lg sticky top-0 z-50 border-b border-muted/10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to={ROUTES.HOME} className="text-xl md:text-2xl font-extrabold text-dark hover:text-primary transition-all duration-300">
              Search Me If You Can
            </Link>
          </div>

          <div className="hidden md:flex items-center">
            <div className="ml-10 flex items-baseline space-x-1">
              {MAIN_NAV_ITEMS.map((item) => (
                <div key={item.path} className="group">
                  <NavLink to={item.path} className={navLinkClass}>
                    {item.label}
                  </NavLink>
                </div>
              ))}
            </div>

            <div className="ml-6">
              <Link
                to={CTA_NAV_ITEM.path}
                className="inline-block bg-primary text-primary-foreground font-bold py-2 px-5 rounded-full text-sm hover:brightness-95 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-primary/20"
              >
                {CTA_NAV_ITEM.label}
              </Link>
            </div>
          </div>

          <div className="-mr-2 flex items-center md:hidden gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-muted/10 inline-flex items-center justify-center p-2 rounded-md text-muted hover:text-dark hover:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-light focus:ring-primary"
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
        <div className="md:hidden bg-light border-b border-muted/10" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {MAIN_NAV_ITEMS.map((item) => (
              <NavLink key={item.path} to={item.path} className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>
                {item.label}
              </NavLink>
            ))}
            <div className="pt-4 mt-2 border-t border-muted/10">
              <NavLink
                to={CTA_NAV_ITEM.path}
                className={({ isActive }) => `block text-center py-3 px-4 rounded-xl text-base font-bold transition-all duration-200 ${isActive ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-primary text-primary-foreground hover:brightness-95 shadow-lg shadow-primary/20'}`}
                onClick={() => setIsOpen(false)}
              >
                {CTA_NAV_ITEM.label}
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;