import React from 'react';
import {
  BrainCircuit, Download, X, CheckCircle, AlertTriangle, Award, GraduationCap, Calendar, ShieldCheck
} from 'lucide-react';

const PDFReportModal = ({ prediction, onClose }) => {
  if (!prediction) return null;

  const handlePrintDownload = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="glass-panel w-full max-w-3xl p-6 md:p-8 space-y-6 relative border-indigo-500/40 my-8">
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-7 h-7 text-indigo-400" />
            <div>
              <h2 className="text-xl font-bold text-white font-heading">DNN Prediction Performance Report</h2>
              <p className="text-xs text-slate-400">Official Neural Network Assessment Output</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Print Printable Area */}
        <div id="printable-report" className="space-y-6">
          {/* Main Status Banner */}
          <div className={`p-6 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 ${
            prediction.passFail === 'Pass'
              ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
              : 'bg-red-950/50 border-red-500/40 text-red-200'
          }`}>
            <div className="space-y-1 text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-wider opacity-80">Predicted Outcome</span>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-extrabold font-heading">
                  RESULT: {prediction.passFail.toUpperCase()}
                </span>
                <span className="px-3 py-1 rounded-lg bg-white/20 font-bold text-lg">
                  GRADE: {prediction.grade}
                </span>
              </div>
              <p className="text-xs opacity-90">{prediction.performanceLevel}</p>
            </div>

            <div className="text-center md:text-right space-y-1">
              <span className="text-xs uppercase opacity-80 block">DNN Pass Probability</span>
              {prediction.passFail === 'Pass' && prediction.confidenceScore != null ? (
                <>
                  <span className="text-3xl font-extrabold font-mono text-emerald-300">{prediction.confidenceScore}%</span>
                  <span className="text-[11px] block opacity-75">Confidence Index</span>
                </>
              ) : (
                <>
                  <span className="text-xl font-bold font-mono text-red-300">N/A (Failed Criteria)</span>
                  <span className="text-[11px] block opacity-75">No Pass Probability for Fail Outcome</span>
                </>
              )}
            </div>
          </div>

          {/* Student Profile Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-900/60 border border-white/5 text-xs">
            <div>
              <span className="text-slate-400 block">Student Name</span>
              <span className="font-bold text-white text-sm">{prediction.studentName}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Register Number</span>
              <span className="font-mono font-bold text-indigo-300">{prediction.registerNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Department</span>
              <span className="font-bold text-white">{prediction.department}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Semester</span>
              <span className="font-bold text-white">Semester {prediction.semester}</span>
            </div>
          </div>

          {/* Academic Input Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-indigo-400 tracking-wider">Evaluation Metrics Summary</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-900/40 border border-white/5">
                <span className="text-slate-400 block">Attendance</span>
                <span className="font-bold text-white text-base">{prediction.attendance}%</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/40 border border-white/5">
                <span className="text-slate-400 block">Internal Marks</span>
                <span className="font-bold text-white text-base">{prediction.internalMarks} / 100</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/40 border border-white/5">
                <span className="text-slate-400 block">Study Hours</span>
                <span className="font-bold text-white text-base">{prediction.studyHours} hrs/day</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/40 border border-white/5">
                <span className="text-slate-400 block">Previous GPA</span>
                <span className="font-bold text-white text-base">{prediction.previousGPA} / 10</span>
              </div>
            </div>
          </div>

          {/* Actionable AI Suggestions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-amber-400 tracking-wider">AI Tailored Improvement Recommendations</h4>
            <div className="space-y-2">
              {prediction.suggestions && prediction.suggestions.map((rec, i) => (
                <div key={i} className="p-3 rounded-lg bg-slate-900/60 border border-amber-500/20 text-xs text-slate-300">
                  {rec}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row gap-3 justify-between items-center">
          <span className="text-xs text-slate-400">Generated on {new Date(prediction.createdAt || Date.now()).toLocaleString()}</span>
          <div className="flex gap-3 w-full sm:w-auto">
            <button onClick={handlePrintDownload} className="gradient-btn py-2.5 px-5 text-sm flex items-center justify-center gap-2 w-full sm:w-auto">
              <Download className="w-4 h-4" /> Save / Download PDF Report
            </button>
            <button onClick={onClose} className="btn-secondary py-2.5 px-4 text-sm w-full sm:w-auto">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFReportModal;
