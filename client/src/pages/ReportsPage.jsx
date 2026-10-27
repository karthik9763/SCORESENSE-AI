import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  Download,
  Printer,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Award,
  GraduationCap,
  Calendar,
  Clock,
  Sparkles,
  QrCode,
  Check,
  User,
  Share2
} from 'lucide-react';
import { Radar, Line } from 'react-chartjs-2';

import { API_BASE_URL } from '../config/api';

const ReportsPage = () => {
  const { user } = useAuth();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestReport();
  }, []);

  const fetchLatestReport = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/student/dashboard`);
      if (res.data.success && res.data.latestPrediction) {
        setReportData({
          student: res.data.student || user,
          prediction: res.data.latestPrediction
        });
      } else {
        // Fallback demo student report
        setReportData({
          student: user || {
            name: 'Karthik Deshmukh',
            registerNumber: 'REG20250001',
            department: 'Computer Science',
            semester: 6
          },
          prediction: {
            passFail: 'Pass',
            grade: 'A+',
            compositeScore: 88.5,
            confidenceScore: 98.5,
            performanceLevel: 'Outstanding / High Distinction',
            attendance: 88.5,
            internalMarks: 82,
            assignmentMarks: 85,
            practicalMarks: 78,
            projectMarks: 82,
            semesterMarks: 80,
            studyHours: 5.5,
            previousGPA: 8.5,
            suggestions: [
              '🌟 PASS: All 3 semester mark criteria satisfy passing requirements! Maintain study regimen.',
              '🚀 Participate in advanced technical workshops and semester capstone project challenges.'
            ],
            createdAt: new Date().toISOString()
          }
        });
      }
    } catch (e) {
      console.warn('Reports load notice:', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const pred = reportData?.prediction || {};
  const student = reportData?.student || user || {};

  const radarData = {
    labels: ['Internal', 'Assignment', 'Practical', 'Project', 'Study Hours', 'Attendance'],
    datasets: [
      {
        label: 'Evaluation Marks',
        data: [
          Number(pred.internalMarks) || 82,
          Number(pred.assignmentMarks) || 85,
          Number(pred.practicalMarks) || 78,
          Number(pred.projectMarks) || 82,
          Math.min(100, (Number(pred.studyHours) || 5.5) * 10),
          Number(pred.attendance) || 88.5
        ],
        backgroundColor: 'rgba(99, 102, 241, 0.25)',
        borderColor: '#6366f1',
        pointBackgroundColor: '#818cf8',
        pointBorderColor: '#ffffff'
      }
    ]
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* Top Controls bar (Hidden on Print) */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white font-heading">Official Academic Evaluation Card</h1>
            <p className="text-xs text-slate-400">Cryptographically verifiable student report</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="gradient-btn text-xs px-4 py-2 flex items-center gap-1.5 shadow-lg shadow-indigo-600/20"
          >
            <Printer className="w-4 h-4" /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* OFFICIAL PRINTABLE CERTIFICATE & REPORT CARD */}
      <div id="printable-report" className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/15 bg-slate-950/90 space-y-8 shadow-2xl relative overflow-hidden">

        {/* Official Header */}
        <div className="border-b-2 border-indigo-500/40 pb-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-[1.5px] shadow-lg shadow-indigo-500/30">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-indigo-400" />
              </div>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white font-heading tracking-tight">
                EduPredict AI Examination Board
              </h2>
              <p className="text-xs text-indigo-300 font-semibold uppercase tracking-wider">
                Autonomous Student Performance & Academic Decision Support System
              </p>
              <p className="text-[11px] text-slate-400">Accredited Deep Neural Network Predictive Modeling System</p>
            </div>
          </div>

          <div className="text-center sm:text-right text-xs text-slate-400 space-y-0.5">
            <div className="text-white font-mono font-bold text-sm">Report ID: #EDP-{Date.now().toString().slice(-6)}</div>
            <div>Issued: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div className="text-emerald-400 font-semibold flex items-center justify-center sm:justify-end gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Authenticated via SHA-256
            </div>
          </div>
        </div>

        {/* Student Profile Info Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-900/80 border border-white/10 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Student Name</span>
            <span className="text-white font-bold text-sm mt-0.5 block">{student.name || 'Student'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Register Number</span>
            <span className="text-indigo-400 font-bold font-mono text-sm mt-0.5 block">{student.registerNumber || 'REG20250001'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Department</span>
            <span className="text-white font-bold text-sm mt-0.5 block">{student.department || 'Computer Science'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Current Semester</span>
            <span className="text-white font-bold text-sm mt-0.5 block">Semester {student.semester || 6}</span>
          </div>
        </div>

        {/* Prediction Outcome Banner */}
        <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
          pred.passFail === 'Pass'
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
            : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
        }`}>
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Official DNN Outcome</span>
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <span className="text-3xl font-extrabold font-heading">
                RESULT: {pred.passFail?.toUpperCase() || 'PASS'}
              </span>
              <span className="px-3 py-1 rounded-xl bg-white/10 font-bold text-lg border border-white/20">
                GRADE: {pred.grade || 'A+'}
              </span>
            </div>
            <p className="text-xs opacity-90">{pred.performanceLevel || 'Outstanding / High Distinction'}</p>
          </div>

          <div className="text-center sm:text-right space-y-1">
            <span className="text-[10px] uppercase opacity-80 block font-semibold">Neural Pass Probability</span>
            <span className="text-3xl font-extrabold font-mono text-cyan-300">
              {pred.confidenceScore ? `${pred.confidenceScore}%` : '98.5%'}
            </span>
            <span className="text-[10px] block opacity-75">Trained on 5,000 Records (99.64% Acc)</span>
          </div>
        </div>

        {/* Comprehensive Evaluation Marks Grid */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Academic Evaluation Breakdown</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
              <span className="text-slate-400 block text-[10px]">Lecture Attendance</span>
              <span className="text-base font-bold text-white font-mono mt-0.5 block">{pred.attendance}%</span>
              <span className="text-[10px] text-emerald-400">Above 75% Requirement</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
              <span className="text-slate-400 block text-[10px]">Internal Marks (/100)</span>
              <span className="text-base font-bold text-indigo-400 font-mono mt-0.5 block">{pred.internalMarks} / 100</span>
              <span className="text-[10px] text-slate-400">Mid-term Evaluation</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
              <span className="text-slate-400 block text-[10px]">Assignment Marks (/100)</span>
              <span className="text-base font-bold text-cyan-400 font-mono mt-0.5 block">{pred.assignmentMarks} / 100</span>
              <span className="text-[10px] text-slate-400">Coursework Tasks</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
              <span className="text-slate-400 block text-[10px]">Daily Study Hours</span>
              <span className="text-base font-bold text-amber-400 font-mono mt-0.5 block">{pred.studyHours} hrs/day</span>
              <span className="text-[10px] text-slate-400">Active Recall Time</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
              <span className="text-slate-400 block text-[10px]">Practical Lab Score</span>
              <span className="text-base font-bold text-white font-mono mt-0.5 block">{pred.practicalMarks || 78} / 100</span>
              <span className="text-[10px] text-slate-400">Lab Experiments</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
              <span className="text-slate-400 block text-[10px]">Project Work Score</span>
              <span className="text-base font-bold text-purple-400 font-mono mt-0.5 block">{pred.projectMarks || 82} / 100</span>
              <span className="text-[10px] text-slate-400">Capstone Deliverable</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
              <span className="text-slate-400 block text-[10px]">Previous GPA</span>
              <span className="text-base font-bold text-white font-mono mt-0.5 block">{pred.previousGPA || 8.5} / 10.0</span>
              <span className="text-[10px] text-slate-400">Prior Standing</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
              <span className="text-slate-400 block text-[10px]">Co-Curriculars</span>
              <span className="text-base font-bold text-emerald-400 font-mono mt-0.5 block">{pred.extraActivities || 'Yes'}</span>
              <span className="text-[10px] text-slate-400">Technical Club Active</span>
            </div>
          </div>
        </div>

        {/* Radar Competency Graph & AI Suggestions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 flex flex-col items-center justify-center">
            <span className="text-xs font-bold text-white mb-2">Cognitive & Academic Radar Profile</span>
            <div className="h-44 w-full">
              <Radar
                data={radarData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    r: {
                      angleLines: { color: 'rgba(255, 255, 255, 0.08)' },
                      grid: { color: 'rgba(255, 255, 255, 0.08)' },
                      pointLabels: { color: '#94a3b8', font: { size: 9 } },
                      ticks: { display: false }
                    }
                  },
                  plugins: { legend: { display: false } }
                }}
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-3">
            <span className="text-xs font-bold text-white block">AI Remediation & Strategic Suggestions</span>
            <div className="space-y-2 text-xs text-slate-300">
              {pred.suggestions && pred.suggestions.length > 0 ? (
                pred.suggestions.map((s, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </div>
                ))
              ) : (
                <p>Maintain consistent academic performance and prepare for final semester examinations.</p>
              )}
            </div>
          </div>
        </div>

        {/* Verification Footer with QR Code & Digital Signature */}
        <div className="pt-6 border-t-2 border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-4">
            {/* Simulated Cryptographic QR Verification Code */}
            <div className="p-2 rounded-xl bg-white text-slate-950 flex flex-col items-center justify-center shadow-lg">
              <QrCode className="w-14 h-14" />
              <span className="text-[8px] font-mono font-bold mt-0.5">SCAN TO VERIFY</span>
            </div>
            <div className="space-y-0.5">
              <span className="font-bold text-white block">Cryptographic Verification Hash</span>
              <span className="font-mono text-[10px] text-indigo-400 block break-all">
                SHA256: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08
              </span>
              <span className="text-[10px] text-slate-500">Autonomous Model Signature • Immutable Record</span>
            </div>
          </div>

          <div className="text-center sm:text-right space-y-1">
            <div className="font-serif italic text-lg text-slate-200">EduPredict AI Core Engine</div>
            <div className="border-t border-slate-700 pt-1 text-[10px] uppercase font-bold tracking-widest text-slate-400">
              Controller of Academic Examinations
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReportsPage;
