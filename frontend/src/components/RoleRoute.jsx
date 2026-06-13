import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RoleRoute({ children, roles = [] }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="auth-wrap"><div className="card">Loading...</div></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles.length && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
}
