import { Link } from 'react-router-dom';
export default function NotFound() {
  return <div className="auth-wrap"><div className="card"><h1>404</h1><p className="muted">Page not found</p><Link to="/dashboard">Go back</Link></div></div>;
}
