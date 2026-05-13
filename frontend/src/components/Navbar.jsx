import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 border-b border-cyan-100/10 bg-base/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <Link to="/dashboard" className="text-xl font-semibold tracking-tight text-cyan-200">
          Valnexis
        </Link>
        {user ? (
          <nav className="flex items-center gap-4">
            <NavLink to="/dashboard" className="text-sm text-slate-300 hover:text-white">
              Dashboard
            </NavLink>
            {user.role === 'admin' ? (
              <NavLink to="/admin" className="text-sm text-slate-300 hover:text-white">
                Admin
              </NavLink>
            ) : null}
            <NotificationBell />
            <button
              onClick={logout}
              className="rounded-lg border border-cyan-300/20 px-3 py-1.5 text-sm text-cyan-100 hover:bg-cyan-400/10"
            >
              Logout
            </button>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
