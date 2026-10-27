import React from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import {
  BrainCircuit,
  ShieldCheck,
  Cpu,
  FileText,
  ExternalLink,
  Award,
  Github,
  Mail,
  Lock,
  FileCode2
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="glass-panel rounded-none border-x-0 border-b-0 mt-20 bg-slate-950/90 backdrop-blur-2xl border-t border-white/10 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">

          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                  <BrainCircuit className="w-5 h-5 text-indigo-400" />
                </div>
              </div>
              <span className="font-heading font-extrabold text-xl text-white tracking-tight">
                EduPredict <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enterprise Student Academic Performance Prediction System integrating 4-Layer Sequential Deep Neural Network architecture with modern web engineering.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 w-fit font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              DNN Engine Online • 99.64% Validation Accuracy
            </div>
          </div>

          {/* Quick Navigation Modules */}
          <div>
            <h4 className="font-heading font-bold text-xs text-white uppercase tracking-wider mb-4">
              Intelligence Modules
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/dashboard" className="hover:text-indigo-400 transition-colors no-underline">Academic Dashboard</Link>
              </li>
              <li>
                <Link to="/predict" className="hover:text-indigo-400 transition-colors no-underline">Multi-Step Predictor</Link>
              </li>
              <li>
                <Link to="/insights" className="hover:text-indigo-400 transition-colors no-underline">AI Insights & Schedule</Link>
              </li>
              <li>
                <Link to="/reports" className="hover:text-indigo-400 transition-colors no-underline">Official PDF Reports</Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-indigo-400 transition-colors no-underline">Prediction History</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-indigo-400 transition-colors no-underline">Enterprise Admin Panel</Link>
              </li>
            </ul>
          </div>

          {/* Neural Architecture Specs */}
          <div>
            <h4 className="font-heading font-bold text-xs text-white uppercase tracking-wider mb-4">
              DNN Neural Specifications
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                <span>Dense 64 → BatchNorm → Dense 32 → Dropout 0.3 → Dense 16 → Sigmoid</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Accuracy: 99.64% | Precision: 99.74%</span>
              </li>
              <li className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Recall: 99.82% | F1-Score: 99.78%</span>
              </li>
              <li className="flex items-center gap-2">
                <FileCode2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Dataset: 5,000 Verified Student Records</span>
              </li>
            </ul>
          </div>

          {/* Documentation & Links */}
          <div>
            <h4 className="font-heading font-bold text-xs text-white uppercase tracking-wider mb-4">
              Resources & Support
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/about" className="hover:text-indigo-400 transition-colors no-underline flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-400" /> About IEEE Project
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-indigo-400 transition-colors no-underline flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" /> Contact Support
                </Link>
              </li>
              <li>
                <a
                  href={API_BASE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-indigo-400 transition-colors no-underline flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-indigo-400" /> REST API Status
                </a>
              </li>
            </ul>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-white/10 text-indigo-300">
                Version 2.5 Enterprise
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} EduPredict AI – Student Academic Performance Prediction System. All rights reserved.</p>
          <div className="flex items-center gap-6 text-[11px]">
            <Link to="/about" className="hover:text-slate-300 transition-colors no-underline">About</Link>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Documentation</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Privacy</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Terms</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer flex items-center gap-1">
              <Github className="w-3 h-3" /> GitHub
            </span>
            <Link to="/contact" className="hover:text-slate-300 transition-colors no-underline">Contact</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
