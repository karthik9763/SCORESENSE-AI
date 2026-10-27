import React, { useEffect, useRef } from 'react';
import { LogOut, AlertTriangle, X, ShieldAlert } from 'lucide-react';

const SignOutModal = ({ isOpen, onClose, onConfirm, user }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="signout-modal-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-md rounded-2xl glass-panel bg-slate-950/95 border border-red-500/25 p-6 shadow-2xl relative overflow-hidden transition-all transform scale-100 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-16 -left-16 w-36 h-36 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with Exit Icon */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500/20 to-rose-600/20 border border-red-500/40 text-red-400 flex items-center justify-center shrink-0 shadow-lg shadow-red-950/40">
            <LogOut className="w-6 h-6 text-red-400" />
          </div>
          <div className="flex-1 pr-6">
            <h3 id="signout-modal-title" className="text-xl font-bold font-heading text-white tracking-tight">
              Sign Out?
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Are you sure you want to sign out from your account?
            </p>
          </div>
        </div>

        {/* Active User Context Box */}
        {user && (
          <div className="mb-5 p-3 rounded-xl bg-slate-900/80 border border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/15 flex items-center justify-center text-xs font-bold text-indigo-300 uppercase">
              {user.name ? user.name.charAt(0) : 'U'}
            </div>
            <div className="flex-1 min-w-0 text-xs">
              <p className="font-semibold text-white truncate">{user.name || 'User Account'}</p>
              <p className="text-[11px] text-slate-400 truncate">
                {user.registerNumber || user.email || 'Active Session'} •{' '}
                <span className="text-indigo-400 font-medium">{user.role || 'Student'}</span>
              </p>
            </div>
          </div>
        )}

        {/* Information Notice */}
        <div className="mb-6 p-3 rounded-xl bg-red-950/20 border border-red-500/20 flex items-center gap-2.5 text-xs text-red-300/90">
          <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
          <span className="text-[11px] leading-relaxed">
            Your secure session token will be destroyed. All protected dashboard routes will require re-authentication.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-medium text-xs border border-white/10 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-semibold text-xs shadow-lg shadow-red-900/40 hover:shadow-red-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-2 group cursor-pointer"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignOutModal;
