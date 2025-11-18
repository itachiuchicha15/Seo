
import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] bg-light text-center px-4">
      <div className="bg-white p-12 rounded-3xl shadow-xl border border-gray-200">
        <Compass className="mx-auto h-20 w-20 text-primary animate-pulse" />
        <h1 className="mt-8 text-6xl font-extrabold text-dark tracking-tighter">404</h1>
        <h2 className="mt-2 text-3xl font-bold text-secondary">Page Not Found</h2>
        <p className="mt-4 max-w-sm text-muted">
          It seems you've ventured off the beaten path. The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-10">
          <Link
            to="/"
            className="group inline-flex items-center justify-center bg-primary text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 shadow-lg hover:brightness-95 transform hover:scale-105"
          >
            <Home className="mr-2 -ml-1 transition-transform group-hover:-rotate-12" />
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
