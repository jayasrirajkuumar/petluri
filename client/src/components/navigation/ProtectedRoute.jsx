import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>; // Or use your Loader component
    }

    if (!user) {
        // Redirect to appropriate login page based on role attempt
        if (allowedRoles.includes('admin')) {
            return <Navigate to="/admin/login" state={{ from: location }} replace />;
        }
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // User logged in but wrong role
        // If admin tries to access student, or student tries to access admin
        if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
        if (user.role === 'student') return <Navigate to="/student/dashboard" replace />;

        return <Navigate to="/" replace />; // Fallback
    }

    return children;
};

export default ProtectedRoute;
