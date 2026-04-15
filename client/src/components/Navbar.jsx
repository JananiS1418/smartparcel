import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Package, User, LogOut, Bell, Menu, Search } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useNotificationStore from '../store/notificationStore';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const { notifications, fetchNotifications, unreadCount, markNotificationRead } = useNotificationStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [fetchNotifications, user]);

  const getNavLinks = () => {
    const common = [{ name: 'Dashboard', path: '/dashboard', label: 'Overview' }];
    
    if (user?.role === 'admin') {
      return [
        ...common,
        { name: 'Admin Panel', path: '/admin', label: 'Administration' },
        { name: 'Reports', path: '/reports', label: 'Analytics' },
      ];
    }

    if (user?.role === 'driver') {
      return [
        { name: 'My Pickups', path: '/dashboard', label: 'Dashboard' },
        { name: 'Trip History', path: '/history', label: 'History' },
        { name: 'Earnings', path: '/earnings', label: 'Analytics' },
      ];
    }
    
    if (user?.role === 'collector') {
      return [
        { name: 'Hub Orders', path: '/dashboard', label: 'Manifest' },
        { name: 'In Transit', path: '/transit', label: 'Active Shipments' },
        { name: 'Payments', path: '/settlements', label: 'Financials' },
      ];
    }
    
    return [
      ...common,
      { name: 'Track Parcel', path: '/tracking', label: 'Tracking' },
      { name: 'My History', path: '/history', label: 'Records' },
    ];
  };

  const navLinks = getNavLinks();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex min-h-[76px] items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0f172a_0%,#2563eb_100%)] shadow-lg shadow-blue-600/20">
                <Package className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="block text-lg font-bold tracking-tight text-slate-950">SmartParcel</span>
                <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Delivery Workspace</span>
              </div>
            </Link>

            {user && (
              <div className="hidden md:flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-standard ${
                      isActive(link.path) ? 'bg-slate-950 text-white shadow-sm' : 'text-slate-600 hover:bg-white hover:text-slate-950'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <button className="hidden h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-standard hover:border-slate-300 hover:text-slate-950 lg:flex">
                  <Search className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowNotifications((current) => !current)}
                  className="relative hidden h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-standard hover:border-slate-300 hover:text-slate-950 lg:flex"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount() > 0 && <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-rose-500" />}
                </button>

                <Link to="/profile" className="hidden items-center gap-3 rounded-full border border-slate-200 bg-white px-2 py-1.5 shadow-sm sm:flex">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-950">{user.name}</p>
                    <p className="text-[11px] font-medium capitalize text-slate-500">{user.role}</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                    <User className="h-5 w-5" />
                  </div>
                </Link>

                {user.role === 'user' && (
                  <Link to="/tracking" className="hidden rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition-standard hover:bg-blue-600 lg:inline-flex">
                    Track parcel
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-standard hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition-standard hover:text-slate-950">
                  Sign In
                </Link>
                <Link to="/register" className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition-standard hover:bg-blue-600">
                  Create Account
                </Link>
              </div>
            )}

            <button className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition-standard hover:border-slate-300 hover:text-slate-950 md:hidden">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      {showNotifications && user && (
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="absolute right-8 top-[78px] z-50 w-[360px] rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-950">Notifications</p>
              <button type="button" onClick={() => setShowNotifications(false)} className="text-sm text-slate-500 hover:text-slate-950">
                Close
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {notifications.length ? (
                notifications.slice(0, 6).map((notification) => (
                  <button
                    key={notification._id}
                    type="button"
                    onClick={() => markNotificationRead(notification._id)}
                    className={`w-full rounded-[1.2rem] px-4 py-3 text-left transition-standard ${
                      notification.read ? 'bg-slate-50' : 'bg-sky-50'
                    }`}
                  >
                    <p className="text-sm font-semibold text-slate-950">{notification.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{notification.message}</p>
                  </button>
                ))
              ) : (
                <div className="rounded-[1.2rem] border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500">
                  No notifications yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
