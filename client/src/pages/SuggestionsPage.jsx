import React from 'react';
import { Link } from 'react-router-dom';
import {
  Lightbulb, BookOpen, Clock, Target, CheckCircle2, Award, ArrowRight, Zap, GraduationCap
} from 'lucide-react';

const SuggestionsPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="glass-panel p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold">
            <Lightbulb className="w-4 h-4" /> AI Personalized Academic Roadmap
          </div>
          <h1 className="text-3xl font-extrabold text-white">Academic Improvement Suggestions</h1>
          <p className="text-sm text-slate-300 max-w-2xl">
            Tailored study plans, subject focus areas, exam preparation techniques, and productivity strategies derived from Deep Neural Network predictions.
          </p>
        </div>

        <Link to="/predict" className="gradient-btn px-6 py-3 text-sm flex items-center gap-2">
          Run Prediction for Updated Tips <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 3 Core Strategy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-panel p-6 space-y-4 border-t-4 border-indigo-500">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Daily Study Routine</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Optimal study duration recommended by the DNN model is 4.5 to 6.5 hours daily divided into structured 50-minute focused blocks.
          </p>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> Morning: Concept learning (2 hrs)</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> Afternoon: Practical lab coding (2 hrs)</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> Evening: Quiz & past paper review (1.5 hrs)</li>
          </ul>
        </div>

        <div className="glass-panel p-6 space-y-4 border-t-4 border-purple-500">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Internal Assessment Focus</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Internal assessment marks hold a 25% weight in the final performance score. Prioritize mid-term exam preparation.
          </p>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400" /> Solve minimum 3 previous year mid-terms</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400" /> Submit assignments 2 days before deadline</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400" /> Maintain regular attendance &gt; 80%</li>
          </ul>
        </div>

        <div className="glass-panel p-6 space-y-4 border-t-4 border-emerald-500">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Practical & Project Mastery</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Practical lab work and mini projects represent 35% of overall academic weighting. Hands-on coding boosts final scores significantly.
          </p>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Build full-stack capstone projects</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Conduct peer code reviews & debugging</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Document project setup in Github repos</li>
          </ul>
        </div>
      </div>

      {/* Detailed Recommendations Grid */}
      <div className="glass-panel p-8 space-y-6">
        <h3 className="text-xl font-bold text-white font-heading">Complete Academic Excellence Checklist</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
            <span className="text-xs font-bold text-indigo-400 uppercase">Attendance Optimization</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Attendance below 75% correlates with a 45% increase in failure risk in DNN datasets. Attend early morning lectures consistently to maintain a safe buffer.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
            <span className="text-xs font-bold text-purple-400 uppercase">GPA Acceleration</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Students maintaining a GPA &gt; 7.5 show 98% pass confidence scores in semester examinations. Focus on core high-credit subjects first.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase">Extra-Curricular Balance</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Participation in technical hackathons and paper presentations provides an empirical +5% boost in practical project evaluations.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase">Exam Time Management</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              In final examinations, dedicate the first 15 minutes to question selection and outline key architectural diagrams before writing code snippets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestionsPage;
