import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/slices/authSlice';

function ProtectedRoute({ allowedRoles }) {
  const user = useSelector(selectCurrentUser);

  console.log('[ProtectedRoute] user:', user, 'allowedRoles:', allowedRoles);

  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // super_admin uses admin routes
    const home = user.role === 'super_admin' ? '/admin' : `/${user.role}`;
    return <Navigate to={home} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
