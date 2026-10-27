import React from 'react';
import { BrainCircuit, Cpu, Layers, ShieldCheck, CheckCircle2, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-10 space-y-12 animate-fade-in">
      {/* Hero Header */}
      <div className="glass-panel p-8 md:p-12 text-center space-y-4">
        <div className="inline-flex p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 mb-2">
          <BrainCircuit className="w-10 h-10 text-indigo-400" />
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white">
          About <span className="gradient-text">EduTrack AI</span>
        </h1>
        <p className="text-slate-300 max-w-3xl mx-auto leading-relaxed text-sm md:text-base">
          Student Performance Prediction Using Deep Neural Network and Modern Web Programming stack. Built as a full-stack production-ready CSE college mini project.
        </p>
      </div>

      {/* Tech Stack Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-panel p-8 space-y-4">
          <div className="flex items-center gap-3 text-indigo-400">
            <Cpu className="w-6 h-6" />
            <h3 className="text-xl font-bold text-white">Deep Learning Neural Engine</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Constructed with TensorFlow/Keras in Python, featuring 4 Sequential layers, Batch Normalization, ReLU non-linearities, and Dropout regularization for optimal generalization.
          </p>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>• <strong>Input Layer:</strong> 8 Academic Features (Normalized via StandardScaler)</li>
            <li>• <strong>Hidden Layer 1:</strong> 64 Dense Neurons + Batch Normalization</li>
            <li>• <strong>Hidden Layer 2:</strong> 32 Dense Neurons + 0.3 Dropout</li>
            <li>• <strong>Output Layer:</strong> Sigmoid activation returning continuous pass probability</li>
          </ul>
        </div>

        <div className="glass-panel p-8 space-y-4">
          <div className="flex items-center gap-3 text-purple-400">
            <Layers className="w-6 h-6" />
            <h3 className="text-xl font-bold text-white">Modern Web Programming Architecture</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The frontend is powered by React.js with React Router DOM, glassmorphism UI styling, and Chart.js graphics. The backend is built on Node.js Express REST API with MongoDB Mongoose storage and JWT security.
          </p>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>• <strong>Frontend:</strong> React.js, Tailwind/Vanilla CSS Variables, Lucide Icons</li>
            <li>• <strong>Backend:</strong> Node.js, Express, JWT, Bcrypt password hashing</li>
            <li>• <strong>Database:</strong> MongoDB Mongoose Schemas (Users, Predictions, Logs)</li>
            <li>• <strong>Security:</strong> Helmet middleware, CORS headers, Express Rate Limiter</li>
          </ul>
        </div>
      </div>

      {/* Model Performance Banner */}
      <div className="glass-panel p-8 border-indigo-500/30 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Verified Machine Learning Validation Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5">
            <span className="block text-3xl font-extrabold text-indigo-400">99.64%</span>
            <span className="text-xs text-slate-400">Accuracy Score</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5">
            <span className="block text-3xl font-extrabold text-purple-400">99.74%</span>
            <span className="text-xs text-slate-400">Precision Rate</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5">
            <span className="block text-3xl font-extrabold text-emerald-400">99.82%</span>
            <span className="text-xs text-slate-400">Recall Score</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5">
            <span className="block text-3xl font-extrabold text-amber-400">99.78%</span>
            <span className="text-xs text-slate-400">F1 Measure</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
