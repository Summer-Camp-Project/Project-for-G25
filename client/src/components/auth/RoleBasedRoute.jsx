import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const RoleBasedRoute = ({ children, allowedRoles, fallbackRoute = '/' }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user role
    const redirectRoutes = {
      super_admin: '/super-admin',
      admin: '/admin',
      museum: '/museum-dashboard',
      museum_admin: '/museum-dashboard',
      organizer: '/organizer-dashboard',
      visitor: '/visitor-dashboard'
    };

    const redirectTo = redirectRoutes[user.role] || fallbackRoute;
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default RoleBasedRoute;
