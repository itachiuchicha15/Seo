import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { session, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>; // Or a spinner component
  }

  if (!session) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default PrivateRoute;