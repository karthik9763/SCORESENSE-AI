import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Settings,
  KeyRound,
  HelpCircle,
  LogOut,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { getUserAvatar } from '../utils/avatar';
import SettingsModal from './SettingsModal';
import HelpModal from './HelpModal';

const ProfileDropdown = ({ user, onLogoutClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleProfileClick = () => {
    setIsOpen(false);
    navigate('/profile');
  };

  const handleChangePasswordClick = () => {
    setIsOpen(false);
    navigate('/profile');
    // Scroll to password section if on profile page
    setTimeout(() => {
      const pwdEl = document.querySelector('input[type="password"]');
      if (pwdEl) pwdEl.focus();
    }, 250);
  };

  const handleSettingsClick = () => {
    setIsOpen(false);
    setShowSettings(true);
  };

  const handleHelpClick = () => {
    setIsOpen(false);
    setShowHelp(true);
  };

  const handleLogoutAction = () => {
    setIsOpen(false);
    onLogoutClick();
  };

  if (!user) return null;

  const roleColor =
    user.role === 'Admin'
      ? 'bg-purple-950/90 text-purple-300 border-purple-800/50'
      : user.role === 'Faculty'
      ? 'bg-cyan-950/90 text-cyan-300 border-cyan-800/50'
      : 'bg-indigo-950/90 text-indigo-300 border-indigo-800/50';

  return (
    <>
      <div className="relative inline-block text-left" ref={dropdownRef}>
        {/* Profile Avatar / Pill Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="true"
          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900/90 border transition text-xs font-semibold text-slate-200 shadow-sm group cursor-pointer ${
            isOpen
              ? 'border-indigo-500/60 ring-2 ring-indigo-500/20 bg-slate-850'
              : 'border-white/10 hover:border-indigo-500/40 hover:bg-slate-800/80'
          }`}
          title="Account Profile & Options"
        >
          {/* Avatar with Status Pulse */}
          <div className="relative shrink-0">
            <img
              src={getUserAvatar(user)}
              alt={user.name || 'User Avatar'}
              className="w-6 h-6 rounded-full object-cover border border-indigo-500/50 group-hover:scale-105 transition-transform"
            />
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-950 animate-pulse"></span>
          </div>

          {/* User First Name */}
          <span className="hidden sm:inline font-medium max-w-[110px] truncate">
            {user.name ? user.name.split(' ')[0] : 'Account'}
          </span>

          {/* Role Pill */}
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider border ${roleColor}`}>
            {user.role || 'Student'}
          </span>

          {/* Animated Chevron */}
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 group-hover:text-white ${
              isOpen ? 'rotate-180 text-indigo-400' : ''
            }`}
          />
        </button>

        {/* Profile Dropdown Menu */}
        {isOpen && (
          <div
            className="absolute right-0 mt-2 w-64 rounded-2xl glass-panel bg-slate-950/98 border border-white/15 p-2 shadow-2xl z-50 transform origin-top-right transition-all duration-200 animate-in fade-in slide-in-from-top-2"
            role="menu"
            aria-orientation="vertical"
          >
            {/* User Header Summary Card */}
            <div className="p-3 mb-1.5 rounded-xl bg-slate-900/80 border border-white/5">
              <div className="flex items-center gap-3">
                <img
                  src={getUserAvatar(user)}
                  alt="Avatar"
                  className="w-9 h-9 rounded-xl object-cover border border-indigo-500/40"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate font-heading">{user.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {user.registerNumber || user.email}
                  </p>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
                <span className="text-slate-400 font-medium">Session Status:</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping"></span>
                  Active Authenticated
                </span>
              </div>
            </div>

            {/* Navigation & Action Links */}
            <div className="space-y-0.5 text-xs">
              {/* My Profile */}
              <button
                type="button"
                onClick={handleProfileClick}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900/90 transition-all font-medium text-left group"
                role="menuitem"
              >
                <div className="p-1 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <span>My Profile</span>
                  <span className="block text-[10px] text-slate-500 group-hover:text-slate-400">View & edit academic info</span>
                </div>
              </button>

              {/* Settings */}
              <button
                type="button"
                onClick={handleSettingsClick}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900/90 transition-all font-medium text-left group"
                role="menuitem"
              >
                <div className="p-1 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition">
                  <Settings className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <span>Settings</span>
                  <span className="block text-[10px] text-slate-500 group-hover:text-slate-400">Theme, alerts & preferences</span>
                </div>
              </button>

              {/* Change Password */}
              <button
                type="button"
                onClick={handleChangePasswordClick}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900/90 transition-all font-medium text-left group"
                role="menuitem"
              >
                <div className="p-1 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition">
                  <KeyRound className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <span>Change Password</span>
                  <span className="block text-[10px] text-slate-500 group-hover:text-slate-400">Security credentials</span>
                </div>
              </button>

              {/* Help */}
              <button
                type="button"
                onClick={handleHelpClick}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900/90 transition-all font-medium text-left group"
                role="menuitem"
              >
                <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition">
                  <HelpCircle className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <span>Help & Support</span>
                  <span className="block text-[10px] text-slate-500 group-hover:text-slate-400">Keyboard shortcuts & FAQ</span>
                </div>
              </button>

              {/* Divider */}
              <div className="my-1.5 border-t border-white/10" />

              {/* Modern Red Logout Button */}
              <button
                type="button"
                onClick={handleLogoutAction}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-red-950/30 hover:bg-red-900/50 border border-red-500/30 text-red-300 hover:text-white font-semibold transition-all duration-200 group shadow-sm hover:shadow-red-950/60"
                role="menuitem"
              >
                <div className="p-1 rounded-lg bg-red-500/20 text-red-400 group-hover:scale-110 transition-transform">
                  <LogOut className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 text-left">
                  <span>Logout</span>
                  <span className="block text-[10px] text-red-400/80 group-hover:text-red-300">End secure session</span>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Settings and Help Modals */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </>
  );
};

export default ProfileDropdown;
