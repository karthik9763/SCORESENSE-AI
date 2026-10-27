import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Lightbulb,
  TrendingUp,
  Clock,
  Target,
  CheckCircle2,
  AlertTriangle,
  Award,
  Zap,
  Calendar,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Sliders
} from 'lucide-react';
import { Line, Radar } from 'react-chartjs-2';

const InsightsPage = () => {
  // Interactive Simulation sliders
  const [simStudyHours, setSimStudyHours] = useState(5.5);
  const [simAttendance, setSimAttendance] = useState(85);

  // Dynamic projection calculations
  const projectedScore = Math.min(99.5, Math.max(45.0, (simAttendance * 0.45 + simStudyHours * 7.5 + 20).toFixed(1)));
  const projectedGrade = projectedScore >= 85 ? 'A+' : projectedScore >= 75 ? 'A' : projectedScore >= 65 ? 'B' : projectedScore >= 50 ? 'C' : 'F';
  const riskIndex = projectedScore >= 75 ? 'Low Risk' : projectedScore >= 55 ? 'Moderate' : 'High Risk';

  // Semester Projection Data
  const projectionChartData = {
    labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6 (Current)', 'Sem 7 (Projected)', 'Sem 8 (Projected)'],
    datasets: [
      {
        label: 'Historical & Projected GPA',
        data: [7.2, 7.5, 7.8, 8.1, 8.4, 8.85, (projectedScore / 10).toFixed(2), Math.min(10.0, ((projectedScore / 10) + 0.2).toFixed(2))],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        tension: 0.35,
        fill: true,
        pointBackgroundColor: '#818cf8',
        pointBorderColor: '#ffffff',
        pointRadius: 5
      }
    ]
  };

  // Weak Subject Diagnostics
  const subjectDiagnostics = [
    { name: 'Advanced Algorithms & Complexity', mark: 54, status: 'At Risk', rec: 'Solve 10 Dynamic Programming graph problems weekly', priority: 'High Priority' },
    { name: 'Distributed Cloud Architecture', mark: 62, status: 'Moderate', rec: 'Complete Docker & Kubernetes lab containerization modules', priority: 'Medium Priority' },
    { name: 'Deep Learning & Neural Networks', mark: 88, status: 'Strong', rec: 'Benchmark Sequential DNN with Convolutional models', priority: 'Exemplary' },
    { name: 'Database Management Systems', mark: 76, status: 'Strong', rec: 'Practice SQL indexing and B-tree query optimization', priority: 'Good Pace' }
  ];

  // AI Recommended Daily Study Schedule
  const studySchedule = [
    { time: '07:30 AM - 09:00 AM', activity: 'High-Cognitive Concept Learning', focus: 'Mathematical modeling, algorithm proofs', icon: Lightbulb },
    { time: '02:00 PM - 04:00 PM', activity: 'Laboratory & Project Coding', focus: 'Practical debugging, repository commits', icon: Zap },
    { time: '06:00 PM - 07:30 PM', activity: 'Mid-term Revision & Quiz Review', focus: 'Past exam papers, active recall testing', icon: BookOpen },
    { time: '09:00 PM - 09:45 PM', activity: 'Daily Academic Retrospective', focus: 'Journaling progress, planning next day schedule', icon: Calendar }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-gradient-to-r from-indigo-950/70 via-slate-900 to-purple-950/50">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Autonomous Academic Decision Support Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-heading">
            AI Academic Insights & Diagnostic Roadmap
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Multi-dimensional performance forecasts, risk mitigation schedules, and neural study hour recommendations tailored to maximize semester GPA.
          </p>
        </div>

        <Link to="/predict" className="gradient-btn px-6 py-3 text-xs flex items-center gap-2 whitespace-nowrap shadow-lg shadow-indigo-600/30">
          <Zap className="w-4 h-4" /> Run New Prediction
        </Link>
      </div>

      {/* Interactive Neural Forecast Simulator */}
      <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-slate-950 via-indigo-950/20 to-slate-950 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white font-heading flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-400" />
              What-If Predictive Simulation
            </h3>
            <p className="text-xs text-slate-400">Adjust parameters to see instant projected grade and risk index shift</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs px-3 py-1 rounded-full bg-slate-900 border border-white/10 font-mono text-cyan-300">
              Projected: {projectedScore}% (Grade {projectedGrade})
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-semibold">Target Daily Study Hours</span>
              <span className="font-mono text-indigo-400 font-bold">{simStudyHours} Hours / Day</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="12.0"
              step="0.5"
              value={simStudyHours}
              onChange={(e) => setSimStudyHours(Number(e.target.value))}
              className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>1.0 hr (High Risk)</span>
              <span>5.5 hrs (Recommended)</span>
              <span>12.0 hrs (Max Intensive)</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-semibold">Projected Lecture Attendance</span>
              <span className={`font-mono font-bold ${simAttendance >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {simAttendance}%
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              step="1"
              value={simAttendance}
              onChange={(e) => setSimAttendance(Number(e.target.value))}
              className="w-full accent-cyan-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>50% (Detained)</span>
              <span>75% (Mandatory Cutoff)</span>
              <span>100% (Exemplary)</span>
            </div>
          </div>
        </div>

        {/* Projection KPI Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Projected Grade</span>
            <span className="text-2xl font-extrabold text-white font-heading">{projectedGrade}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Estimated CGPA</span>
            <span className="text-2xl font-extrabold text-indigo-400 font-heading">{(projectedScore / 10).toFixed(2)}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Risk Matrix</span>
            <span className={`text-2xl font-extrabold font-heading ${
              riskIndex === 'Low Risk' ? 'text-emerald-400' : riskIndex === 'Moderate' ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {riskIndex}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Confidence Metric</span>
            <span className="text-2xl font-extrabold text-cyan-400 font-heading">97.8%</span>
          </div>
        </div>
      </div>

      {/* Semester Projection Trajectory */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              Longitudinal Semester CGPA Projection
            </h3>
            <p className="text-xs text-slate-400">Neural extrapolation of graduation CGPA through Semester 8</p>
          </div>
          <span className="text-xs text-emerald-400 font-semibold">+0.48 Expected Growth</span>
        </div>
        <div className="h-64 w-full">
          <Line
            data={projectionChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { labels: { color: '#94a3b8', font: { size: 11 } } }
              },
              scales: {
                x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8', font: { size: 10 } } },
                y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8', font: { size: 10 } } }
              }
            }}
          />
        </div>
      </div>

      {/* Weak Subjects Diagnostic & Suggested Improvements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Risk Diagnostics */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="border-b border-white/10 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="text-base font-bold text-white font-heading">Subject Diagnostics & Remediation</h3>
            </div>
            <span className="text-xs text-slate-400">Semester 6 Enrolled</span>
          </div>

          <div className="space-y-3">
            {subjectDiagnostics.map((sub, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">{sub.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                    sub.status === 'At Risk' ? 'bg-rose-950 text-rose-300 border border-rose-800/40' : sub.status === 'Moderate' ? 'bg-amber-950 text-amber-300 border border-amber-800/40' : 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                  }`}>
                    {sub.mark}/100 • {sub.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300 flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <span>{sub.rec}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Optimized Daily Study Schedule */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="border-b border-white/10 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              <h3 className="text-base font-bold text-white font-heading">AI Recommended Daily Study Schedule</h3>
            </div>
            <span className="text-xs text-purple-300">5.5 Hours Optimized</span>
          </div>

          <div className="space-y-3">
            {studySchedule.map((slot, idx) => {
              const Icon = slot.icon;
              return (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{slot.activity}</span>
                    </div>
                    <span className="text-[11px] font-mono text-indigo-400 block mt-0.5">{slot.time}</span>
                    <p className="text-xs text-slate-300 mt-1">{slot.focus}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsPage;
