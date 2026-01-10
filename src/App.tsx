/**
 * App.tsx
 * L7 Refactored - Uses centralized ROUTES constant
 */
import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ScrollToTop from './components/ScrollToTop';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ChallengePage from './pages/ChallengePage';
import ResultsPage from './pages/ResultsPage';
import WorkWithMePage from './pages/WorkWithMePage';
import ContactPage from './pages/ContactPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminPostEditorPage from './pages/admin/AdminPostEditorPage';
import PrivateRoute from './components/admin/PrivateRoute';
import { SUPABASE_CONFIG_ERROR } from './lib/supabaseClient';
import { AlertTriangle } from 'lucide-react';
import AdminMessagesPage from './pages/admin/AdminMessagesPage';
import NotFoundPage from './pages/NotFoundPage';

// L7: Centralized routes
import { ROUTES } from './constants';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="bg-light min-h-screen flex flex-col font-sans text-dark fade-in">
      {!isAdminRoute && <Header />}
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.BLOG} element={<BlogPage />} />
          <Route path={ROUTES.BLOG_POST} element={<BlogPostPage />} />
          <Route path={ROUTES.ABOUT} element={<AboutPage />} />
          <Route path={ROUTES.SERVICES} element={<ServicesPage />} />
          <Route path={ROUTES.CHALLENGE} element={<ChallengePage />} />
          <Route path={ROUTES.RESULTS} element={<ResultsPage />} />
          <Route path={ROUTES.WORK_WITH_ME} element={<WorkWithMePage />} />
          <Route path={ROUTES.CONTACT} element={<ContactPage />} />

          {/* Admin Routes */}
          <Route path={ROUTES.ADMIN.LOGIN} element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<PrivateRoute><AdminDashboardPage /></PrivateRoute>} />
          <Route path="/admin/new-post" element={<PrivateRoute><AdminPostEditorPage /></PrivateRoute>} />
          <Route path="/admin/edit/:slug" element={<PrivateRoute><AdminPostEditorPage /></PrivateRoute>} />
          <Route path="/admin/messages" element={<PrivateRoute><AdminMessagesPage /></PrivateRoute>} />

          {/* Catch-all 404 Route */}
          <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
};


const App: React.FC = () => {
  if (SUPABASE_CONFIG_ERROR) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50 text-red-800 p-8">
        <div className="text-center bg-white p-10 rounded-lg shadow-lg border border-red-200">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
          <h1 className="mt-4 text-2xl font-bold text-dark">Configuration Error</h1>
          <p className="mt-2 text-secondary">{SUPABASE_CONFIG_ERROR}</p>
          <p className="mt-4 text-sm text-muted">Please ensure your environment is correctly configured and refresh the page.</p>
        </div>
      </div>
    );
  }

  // Create a client
  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
