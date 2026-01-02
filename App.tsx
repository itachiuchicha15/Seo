
import React from 'react';
// Use double quotes for react-router-dom to resolve potential type resolution issues in some environments
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
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

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="bg-light min-h-screen flex flex-col font-sans text-secondary fade-in">
      {!isAdminRoute && <Header />}
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/challenge" element={<ChallengePage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/work-with-me" element={<WorkWithMePage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<PrivateRoute><AdminDashboardPage /></PrivateRoute>} />
          <Route path="/admin/new-post" element={<PrivateRoute><AdminPostEditorPage /></PrivateRoute>} />
          <Route path="/admin/edit/:slug" element={<PrivateRoute><AdminPostEditorPage /></PrivateRoute>} />
          <Route path="/admin/messages" element={<PrivateRoute><AdminMessagesPage /></PrivateRoute>} />
          
          {/* Catch-all 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
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
  
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;
