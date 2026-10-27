import React from 'react';
import { BrainCircuit } from 'lucide-react';

const LoadingSpinner = ({ fullScreen = false, message = 'Processing Neural Inference...' }) => {
  const spinnerContent = (
    <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
        <BrainCircuit className="w-8 h-8 text-indigo-400 absolute animate-pulse" />
      </div>
      <p className="text-sm font-semibold text-slate-300 font-heading animate-pulse">
        {message}
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md">
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
};

export default LoadingSpinner;
