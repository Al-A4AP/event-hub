import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Spinner from './Spinner';
import type { ReactNode } from 'react';


interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'CUSTOMER' | 'ORGANIZER';
  redirectTo?: string;
}

const ProtectedRoute = ({ children, requiredRole, redirectTo = '/login' }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to={redirectTo} replace />;

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
