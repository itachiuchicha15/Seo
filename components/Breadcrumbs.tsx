import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbLink {
  label: string;
  path: string;
}

interface BreadcrumbsProps {
  links: BreadcrumbLink[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ links }) => {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-sm font-medium text-muted">
      {links.map((link, index) => (
        <React.Fragment key={link.path}>
          {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
          {index < links.length - 1 ? (
            <Link to={link.path} className="hover:text-primary transition-colors">
              {link.label}
            </Link>
          ) : (
            <span className="text-dark font-semibold" aria-current="page">
              {link.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
