import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface Props { children: JSX.Element; requiredRole?: string; }

export const ProtectedRoute: React.FC<Props> = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const loc = useLocation();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/403" replace />;
  return children;
};
