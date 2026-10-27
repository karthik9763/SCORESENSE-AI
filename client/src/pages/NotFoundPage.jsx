import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 text-center">
      <div className="glass-panel p-8 md:p-12 max-w-md w-full space-y-6">
        <div className="inline-flex p-4 rounded-full bg-amber-500/20 text-amber-400">
          <AlertTriangle className="w-12 h-12" />
        </div>

        <h1 className="text-6xl font-extrabold text-white font-heading">404</h1>
        <h2 className="text-xl font-bold text-slate-200">Page Not Found</h2>
        <p className="text-xs text-slate-400">The route or resource you requested does not exist in the EduTrack AI platform.</p>

        <div className="flex justify-center gap-3 pt-2">
          <Link to="/" className="gradient-btn py-2.5 px-5 text-sm flex items-center gap-2">
            <Home className="w-4 h-4" /> Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
