import React, { useState } from 'react';
import { X, Sliders, Moon, Sun, Bell, Shield, Smartphone, Laptop, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const SettingsModal = ({ isOpen, onClose }) => {
  const { theme, toggleTheme } = useTheme();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [highRiskAlerts, setHighRiskAlerts] = useState(true);
  const [compactView, setCompactView] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg rounded-2xl glass-panel bg-slate-950/95 border border-white/15 p-6 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-heading">Portal Preferences & Settings</h3>
              <p className="text-[11px] text-slate-400">Configure interface, notifications, and telemetry</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-4 text-xs">
          {/* Appearance Section */}
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 block mb-2">
              Appearance & Display
            </span>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
                <div>
                  <p className="font-semibold text-white">Current Theme: {theme === 'dark' ? 'Dark Futuristic' : 'Light Clean'}</p>
                  <p className="text-[11px] text-slate-400">Adaptive color scheme</p>
                </div>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-semibold border border-indigo-500/40 transition text-xs"
              >
                Toggle Mode
              </button>
            </div>
          </div>

          {/* Notifications Section */}
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 block mb-2">
              AI Alerts & Notifications
            </span>
            <div className="space-y-2">
              <label className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between cursor-pointer hover:bg-slate-900 transition">
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4 text-purple-400" />
                  <div>
                    <p className="font-semibold text-white">Real-Time Risk Alerts</p>
                    <p className="text-[11px] text-slate-400">Instant notification when academic performance drops below threshold</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={highRiskAlerts}
                  onChange={(e) => setHighRiskAlerts(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
              </label>

              <label className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between cursor-pointer hover:bg-slate-900 transition">
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <div>
                    <p className="font-semibold text-white">Security & Audit Notifications</p>
                    <p className="text-[11px] text-slate-400">Notify on login from new devices or session terminations</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs">
          <span className="text-slate-500 text-[11px]">Preferences auto-saved to client profile</span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition flex items-center gap-1.5 shadow-md"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Settings</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
