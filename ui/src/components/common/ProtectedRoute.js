import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/slices/authSlice';

function ProtectedRoute({ allowedRoles }) {
  const user = useSelector(selectCurrentUser);

  console.log('[ProtectedRoute] user:', user, 'allowedRoles:', allowedRoles);

  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
