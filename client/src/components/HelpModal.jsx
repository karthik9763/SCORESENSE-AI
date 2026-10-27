import React from 'react';
import { X, HelpCircle, BookOpen, Search, ShieldCheck, Mail, ExternalLink, Sparkles } from 'lucide-react';

const HelpModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

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
            <div className="p-2 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-heading">Help, Shortcuts & Support</h3>
              <p className="text-[11px] text-slate-400">EduPredict AI Academic Prediction System Guide</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-3.5 text-xs">
          {/* Quick Shortcuts */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400 block">
              Keyboard Shortcuts & Navigation
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-white/5">
                <span className="text-slate-300">Global Search</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono text-[10px]">⌘K / Ctrl+K</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-white/5">
                <span className="text-slate-300">Close Modals</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">ESC</kbd>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 block">
              Deep Neural Network (DNN) Engine
            </span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              EduPredict AI models semester performance using multi-layer neural networks trained on 5,000 verified academic records. Predictions evaluate internal marks, assignment scores, lecture attendance, and study hours with 99.64% validation accuracy.
            </p>
          </div>

          {/* Support Contacts */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 block">
              Academic Support & Inquiries
            </span>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Institutional Administration:</span>
              <a href="mailto:admin@college.edu" className="text-indigo-400 hover:text-indigo-300 font-medium no-underline">
                admin@college.edu
              </a>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-white/10 transition"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
