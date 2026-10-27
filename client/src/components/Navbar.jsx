import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getUserAvatar } from '../utils/avatar';
import ProfileDropdown from './ProfileDropdown';
import {
  BrainCircuit,
  LayoutDashboard,
  LineChart,
  Sparkles,
  FileText,
  Lightbulb,
  History,
  ShieldCheck,
  Info,
  User,
  Sun,
  Moon,
  Bell,
  Search,
  LogOut,
  LogIn,
  UserPlus,
  X,
  Menu,
  CheckCircle2,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

const Navbar = () => {
  const { user, openLogoutModal } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);

  const notificationsRef = useRef(null);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'DNN Neural Engine Synced',
      description: 'Model v2.5 loaded with 99.64% validation accuracy across 5,000 dataset records.',
      time: '10m ago',
      read: false,
      type: 'success'
    },
    {
      id: 2,
      title: 'New AI Insights Generated',
      description: 'Study hours & internal marks correlation analysis updated for semester 6.',
      time: '1h ago',
      read: false,
      type: 'info'
    },
    {
      id: 3,
      title: 'Academic Risk Alert',
      description: '2 students identified with internal marks below 50 in mid-term evaluation.',
      time: '3h ago',
      read: false,
      type: 'warning'
    }
  ]);

  // Close notifications dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setUnreadNotifications(0);
  };

  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Dynamic real-time search across 100% of the 5,000 dataset records
  useEffect(() => {
    let isMounted = true;
    const fetchResults = async () => {
      try {
        setSearchLoading(true);
        const res = await axios.get(`http://localhost:5000/api/student/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.data.success && isMounted) {
          setSearchResults(res.data.students || []);
        }
      } catch (e) {
        console.warn('Search notice:', e.message);
      } finally {
        if (isMounted) setSearchLoading(false);
      }
    };

    const timer = setTimeout(fetchResults, 150);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  // Exact navigation items as specified by User (NO HOME BUTTON)
  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Analytics', path: '/dashboard#analytics', icon: LineChart },
    { name: 'Predictions', path: '/predict', icon: Sparkles },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Insights', path: '/insights', icon: Lightbulb },
    { name: 'History', path: '/history', icon: History },
    { name: 'Admin', path: '/admin', icon: ShieldCheck, role: 'Admin' },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Profile', path: '/profile', icon: User }
  ];

  const userRole = String(user?.role || '').toLowerCase();

  const filteredLinks = navLinks.filter(link => {
    if (!user) {
      // If not logged in, show Dashboard, Insights, About
      return ['Dashboard', 'Insights', 'About'].includes(link.name);
    }
    if (link.role === 'Admin' && userRole !== 'admin') {
      return false;
    }
    return true;
  });

  const isActive = (path) => {
    if (path.includes('#')) {
      return location.pathname === path.split('#')[0] && location.hash === `#${path.split('#')[1]}`;
    }
    return location.pathname === path;
  };

  return (
    <>
      <nav className="glass-panel sticky top-0 z-50 rounded-none border-t-0 border-x-0 bg-slate-950/85 backdrop-blur-2xl border-b border-white/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo: EduPredict AI (NO HOME BUTTON) */}
            <Link to="/dashboard" className="flex items-center gap-3 shrink-0 no-underline group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-all duration-300">
                <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                  <BrainCircuit className="w-5 h-5 text-indigo-400 group-hover:text-cyan-300 transition-colors" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-xl text-white tracking-tight flex items-center gap-1.5">
                  EduPredict <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400">AI</span>
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-indigo-400/80 -mt-1">
                  Enterprise Academic Intelligence
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden xl:flex items-center space-x-1">
              {filteredLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs transition-all duration-200 no-underline ${
                      active
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm shadow-indigo-500/10'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${active ? 'text-indigo-400' : 'text-slate-400'}`} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Top Right Controls & Profile */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Global Search Student Button */}
              <button
                onClick={() => setSearchModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800/80 border border-white/10 text-slate-300 hover:text-white text-xs transition-all duration-200 shadow-sm"
                title="Search Student, Register Number, or Department"
              >
                <Search className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden lg:inline text-slate-400">Search student...</span>
                <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[9px] font-mono bg-slate-800 text-slate-400 rounded border border-slate-700">⌘K</kbd>
              </button>

              {/* Notification Bell with interactive dropdown */}
              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  aria-label="Notifications"
                  className="relative p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition-all duration-200"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4 text-slate-300" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                      {unreadNotifications}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl glass-panel bg-slate-950/95 border border-white/15 p-4 shadow-2xl z-50 animate-fade-in">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-indigo-400" />
                        <h4 className="text-sm font-bold text-white font-heading">AI Notifications</h4>
                      </div>
                      {unreadNotifications > 0 && (
                        <button
                          onClick={markAllNotificationsRead}
                          className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="divide-y divide-white/5 max-h-72 overflow-y-auto mt-2">
                      {notifications.map((item) => (
                        <div key={item.id} className="py-2.5 px-2 hover:bg-slate-900/60 rounded-xl transition flex gap-3">
                          <div className="mt-0.5">
                            {item.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                            {item.type === 'info' && <BrainCircuit className="w-4 h-4 text-cyan-400 shrink-0" />}
                            {item.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-semibold text-white">{item.title}</p>
                              <span className="text-[10px] text-slate-500">{item.time}</span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle Theme"
                className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition-all duration-200"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-400" />
                )}
              </button>

              {/* User Avatar / Profile Dropdown & Logout Buttons */}
              {user ? (
                <div className="flex items-center gap-2">
                  {/* Professional Profile Dropdown */}
                  <ProfileDropdown user={user} onLogoutClick={openLogoutModal} />

                  {/* Direct Red Logout Button with Exit Icon */}
                  <button
                    onClick={openLogoutModal}
                    className="p-2 rounded-xl bg-red-950/30 hover:bg-red-900/50 border border-red-500/25 hover:border-red-500/40 text-red-400 hover:text-red-300 transition-all duration-200 group shadow-sm hover:shadow-red-950/50 cursor-pointer"
                    title="Sign Out of Account"
                    aria-label="Sign Out"
                  >
                    <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="gradient-btn text-xs px-3.5 py-1.5 whitespace-nowrap flex items-center gap-1.5"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    to="/register"
                    className="hidden sm:flex px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-200 text-xs font-semibold whitespace-nowrap items-center gap-1.5 transition no-underline"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Sign Up</span>
                  </Link>
                </div>
              )}

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 rounded-xl bg-slate-900/90 border border-white/10 text-slate-300 hover:text-white"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-slate-950/98 border-b border-white/10 backdrop-blur-2xl px-4 pt-2 pb-6 space-y-2 animate-fade-in">
            {/* Mobile User Profile Section */}
            {user && (
              <div className="p-3 mb-2 rounded-2xl bg-slate-900/90 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={getUserAvatar(user)}
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover border border-indigo-500/50"
                  />
                  <div>
                    <p className="text-sm font-bold text-white">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.registerNumber || user.email}</p>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                  user.role === 'Admin' ? 'bg-purple-950 text-purple-300 border border-purple-800/40' : 'bg-indigo-950 text-indigo-300 border border-indigo-800/40'
                }`}>
                  {user.role}
                </span>
              </div>
            )}

            {filteredLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all no-underline ${
                    active
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-slate-300 hover:bg-slate-900/80'
                  }`}
                >
                  <Icon className="w-4 h-4 text-indigo-400" />
                  <span>{link.name}</span>
                </Link>
              );
            })}

            {/* Mobile Logout Button */}
            {user && (
              <div className="pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openLogoutModal();
                  }}
                  className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold text-sm shadow-lg shadow-red-900/30 hover:opacity-95 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Global Search Student Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl rounded-2xl glass-panel bg-slate-950/95 border border-white/20 p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-indigo-400 font-heading font-bold text-base">
                <Search className="w-5 h-5" />
                <span>Global Student Intelligence Search</span>
              </div>
              <button
                onClick={() => setSearchModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 relative">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by student name, register number (e.g. REG20250001), or department..."
                className="form-control text-sm py-3 pl-11 pr-4 bg-slate-900 border-indigo-500/30 text-white placeholder-slate-500 rounded-xl"
              />
              <Search className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                  {searchQuery ? `Matching Student Records (${searchResults.length})` : 'Indexed Student Directory'}
                </p>
                {searchLoading && <span className="text-[10px] text-indigo-400 animate-pulse font-mono">Searching 5,000 records...</span>}
              </div>
              <div className="space-y-1.5 max-h-72 overflow-y-auto">
                {searchResults.length > 0 ? (
                  searchResults.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setSearchModalOpen(false);
                        navigate('/dashboard');
                      }}
                      className="p-3 rounded-xl bg-slate-900/60 hover:bg-indigo-950/40 border border-white/5 hover:border-indigo-500/30 transition cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{item.studentName || item.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono">
                            {item.registerNumber}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {item.department} • Semester {item.semester} • Att: {item.attendance}% • GPA: {item.cgpa || item.previousGPA}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-xs font-bold text-emerald-400">{item.finalScore || item.compositeScore}%</span>
                          <div className="text-[10px] text-slate-400">Grade: {item.grade} ({item.passFail})</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500 text-sm">
                    {searchLoading ? 'Scanning 5,000 dataset records...' : `No student records found matching "${searchQuery}".`}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-[11px] text-slate-500">
              <span>ProTip: Press <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700">ESC</kbd> to close</span>
              <span>Total Indexed Dataset: 5,000 Verified Students</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
