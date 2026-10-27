import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Radar, Doughnut } from 'react-chartjs-2';
import {
  BrainCircuit,
  TrendingUp,
  Award,
  AlertTriangle,
  Users,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowUpRight,
  ShieldCheck,
  Activity,
  Layers,
  Clock,
  ChevronRight,
  RefreshCw,
  Search
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const LandingPage = () => {
  const canvasRef = useRef(null);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('Sem 6');

  // Animated Neural Network & Floating Gradient Particles Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create Neural Network nodes
    const nodesCount = Math.floor(canvas.width / 40);
    const nodes = [];
    for (let i = 0; i < nodesCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2 + 1.5,
        color: i % 3 === 0 ? 'rgba(99, 102, 241, ' : i % 3 === 1 ? 'rgba(168, 85, 247, ' : 'rgba(6, 182, 212, '
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Connect nodes within threshold distance
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.25;
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw and update nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        ctx.fillStyle = `${n.color}0.85)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();

        // Node movement
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // 1. Today's AI Summary Metrics
  const summaryMetrics = [
    { title: 'Total Students', value: '5,000', change: '+100% Verified', icon: Users, color: 'text-indigo-400', badge: 'Validated' },
    { title: 'Predictions Today', value: '142', change: '+18% vs yesterday', icon: Zap, color: 'text-cyan-400', badge: 'Live Stream' },
    { title: 'Average Grade', value: 'B+ (72.4%)', change: 'Top 3rd Quartile', icon: Award, color: 'text-purple-400', badge: 'Normal Distribution' },
    { title: 'Pass Rate %', value: '91.8%', change: 'Criteria >= 50 marks', icon: CheckCircle2, color: 'text-emerald-400', badge: 'Target > 85%' },
    { title: 'Mean Confidence', value: '96.4%', change: 'Sigmoid Probability', icon: Sparkles, color: 'text-amber-400', badge: 'High Confidence' },
    { title: 'Model Accuracy', value: '99.64%', change: 'Validation (F1: 99.78%)', icon: BrainCircuit, color: 'text-rose-400', badge: '4-Layer DNN' }
  ];

  // 2. Performance Trend Line Chart Data
  const trendLineData = {
    labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6 (Current)', 'Sem 7 (Proj)', 'Sem 8 (Proj)'],
    datasets: [
      {
        label: 'Mean Composite Score',
        data: [64.2, 66.8, 68.5, 71.2, 73.0, 75.8, 77.4, 79.2],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#818cf8',
        pointBorderColor: '#ffffff',
        pointRadius: 4
      },
      {
        label: 'Minimum Pass Cutoff (50)',
        data: [50, 50, 50, 50, 50, 50, 50, 50],
        borderColor: 'rgba(239, 68, 68, 0.6)',
        borderDash: [6, 6],
        pointRadius: 0,
        fill: false
      }
    ]
  };

  // 3. Department Performance Bar Chart Data
  const departmentBarData = {
    labels: ['Computer Science', 'Info Technology', 'Electronics & Comm', 'Electrical & Elec', 'Mechanical Eng'],
    datasets: [
      {
        label: 'Average Score (%)',
        data: [78.6, 76.2, 74.8, 70.4, 69.1],
        backgroundColor: [
          'rgba(99, 102, 241, 0.85)',
          'rgba(168, 85, 247, 0.85)',
          'rgba(6, 182, 212, 0.85)',
          'rgba(16, 185, 129, 0.85)',
          'rgba(245, 158, 11, 0.85)'
        ],
        borderRadius: 8
      }
    ]
  };

  // 4. Cognitive & Academic Skill Radar Data
  const radarSkillData = {
    labels: ['Attendance', 'Internal Marks', 'Assignments', 'Practical Lab', 'Project Work', 'Study Regularity'],
    datasets: [
      {
        label: 'Top 10% Cohort',
        data: [92, 88, 90, 86, 89, 85],
        backgroundColor: 'rgba(6, 182, 212, 0.25)',
        borderColor: '#06b6d4',
        pointBackgroundColor: '#06b6d4'
      },
      {
        label: 'Batch Average',
        data: [74, 68, 72, 70, 75, 65],
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: '#6366f1',
        pointBackgroundColor: '#6366f1'
      }
    ]
  };

  // 5. Grade Prediction Distribution Doughnut
  const gradeDoughnutData = {
    labels: ['Grade A+ (>=85)', 'Grade A (75-84)', 'Grade B (65-74)', 'Grade C (50-64)', 'Grade F (<50)'],
    datasets: [
      {
        data: [18, 32, 28, 14, 8],
        backgroundColor: [
          '#06b6d4',
          '#6366f1',
          '#a855f7',
          '#f59e0b',
          '#ef4444'
        ],
        borderWidth: 0
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#94a3b8',
          font: { family: 'Plus Jakarta Sans', size: 11 }
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', font: { size: 10 } }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', font: { size: 10 } }
      }
    }
  };

  // Dynamic AI Insights
  const dynamicAIInsights = [
    {
      title: 'Attendance Trajectory',
      text: 'Attendance is improving by 5% across Semester 6 cohorts following mid-semester alerts.',
      type: 'positive',
      impact: '+5.2% Pass Prob'
    },
    {
      title: 'Study Hours Correlation',
      text: 'Students reporting study hours above 5 hours/day perform 23% better in internal evaluations.',
      type: 'highlight',
      impact: 'High Correlation'
    },
    {
      title: 'Department Benchmark',
      text: 'Electronics & Comm semester 5 recorded highest average GPA surge (7.82 / 10).',
      type: 'info',
      impact: 'Benchmarked'
    },
    {
      title: 'Neural Weight Analysis',
      text: 'Internal assessment scores contribute 34% relative importance to prediction confidence.',
      type: 'engine',
      impact: 'Key Feature'
    }
  ];

  // Top Performing Students Cohort
  const topStudents = [
    { name: 'Karthik Deshmukh', regNo: 'REG20250001', dept: 'Computer Science', gpa: '9.42', score: '91.8%', grade: 'A+' },
    { name: 'Priya Patel', regNo: 'REG20250574', dept: 'Information Technology', gpa: '9.43', score: '88.5%', grade: 'A+' },
    { name: 'Rohan Sharma', regNo: 'REG20250102', dept: 'Electronics & Comm', gpa: '9.15', score: '86.4%', grade: 'A+' },
    { name: 'Sneha Saxena', regNo: 'REG20250345', dept: 'Computer Science', gpa: '9.08', score: '85.2%', grade: 'A+' }
  ];

  // Weak Student Remediation Alerts
  const weakStudentAlerts = [
    { name: 'Aditya Mehta', regNo: 'REG20250561', dept: 'Information Technology', failReason: 'Study Hours: 1.5 hrs/day, Internal: 41/100', risk: 'High Risk' },
    { name: 'Tanvi Verma', regNo: 'REG20250558', dept: 'Mechanical Eng', failReason: 'Semester marks: 32.6/100, Attendance: 56.5%', risk: 'Critical Remediation' },
    { name: 'Suresh Rao', regNo: 'REG20250568', dept: 'Computer Science', failReason: 'Internal: 45.3/100, Mid-term re-eval required', risk: 'Action Required' }
  ];

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Section with Animated Neural Canvas & Glowing Connections */}
      <section className="relative overflow-hidden pt-8 pb-10 border-b border-white/10 bg-gradient-to-b from-slate-950 via-slate-900/90 to-slate-950">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-0"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-widest shadow-sm">
            <BrainCircuit className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Autonomous Academic Decision Support Engine</span>
          </div>

          {/* Large Hero Title - EXACT User Request */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-heading max-w-4xl mx-auto leading-tight">
            AI Powered Student Academic <br className="hidden sm:inline" />
            <span className="gradient-text">Intelligence Platform</span>
          </h1>

          {/* Subtitle - EXACT User Request */}
          <p className="text-sm sm:text-lg text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Deep Learning Powered Student Performance Analytics & Academic Decision Support System
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-400 pt-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/80 border border-white/5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              DNN Engine: Active (99.64% Acc)
            </span>
            <span className="px-3 py-1 rounded-lg bg-slate-900/80 border border-white/5">
              Inference Latency: &lt; 28ms
            </span>
            <span className="px-3 py-1 rounded-lg bg-slate-900/80 border border-white/5">
              Trained on 5,000 Records
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* 1. TODAY'S AI SUMMARY */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-bold text-white font-heading">Today's AI Summary</h2>
            </div>
            <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" /> Synced Real-time
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {summaryMetrics.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="glass-panel p-4 rounded-xl border border-white/10 hover:border-indigo-500/40 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-slate-400 truncate">{item.title}</span>
                    <Icon className={`w-4 h-4 ${item.color} group-hover:scale-110 transition-transform`} />
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold text-white font-heading">{item.value}</div>
                  <div className="mt-2 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 truncate">{item.change}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 2. LIVE CHARTS & ANALYTICS GRID */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Trend Line Chart */}
          <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                  Semester Performance Trajectory & Neural Projections
                </h3>
                <p className="text-xs text-slate-400">Mean composite score progression from Semester 1 to Semester 8</p>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-white/10 text-xs">
                <span className="px-2 py-0.5 rounded bg-indigo-600 text-white font-semibold">Live Mode</span>
                <span className="px-2 py-0.5 text-slate-400">5,000 Dataset</span>
              </div>
            </div>
            <div className="h-64 sm:h-72 w-full">
              <Line data={trendLineData} options={chartOptions} />
            </div>
          </div>

          {/* Grade Prediction Distribution Doughnut */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
            <div className="border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                Grade Prediction Distribution
              </h3>
              <p className="text-xs text-slate-400">Predicted grade brackets across active cohort</p>
            </div>
            <div className="h-56 w-full flex items-center justify-center">
              <Doughnut
                data={gradeDoughnutData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: { color: '#94a3b8', font: { size: 10 }, boxWidth: 12 }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Department Performance Bar Chart */}
          <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
            <div className="border-b border-white/10 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-heading">
                  Department Academic Performance Index
                </h3>
                <p className="text-xs text-slate-400">Normalized mean score across 5 engineering disciplines</p>
              </div>
              <span className="text-xs text-indigo-400 font-semibold">CSE Leading at 78.6%</span>
            </div>
            <div className="h-60 w-full">
              <Bar data={departmentBarData} options={chartOptions} />
            </div>
          </div>

          {/* Cognitive & Academic Skill Radar Chart */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
            <div className="border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white font-heading">
                Cognitive Skill Radar
              </h3>
              <p className="text-xs text-slate-400">Top 10% cohort vs batch average</p>
            </div>
            <div className="h-60 w-full flex items-center justify-center">
              <Radar
                data={radarSkillData}
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
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: { color: '#94a3b8', font: { size: 10 }, boxWidth: 10 }
                    }
                  }
                }}
              />
            </div>
          </div>
        </section>

        {/* 3. DYNAMIC AI INSIGHT PANEL */}
        <section className="glass-panel p-6 rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-slate-950 via-indigo-950/20 to-slate-950 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
              <h3 className="text-lg font-bold text-white font-heading">AI Dynamic Insight Panel</h3>
            </div>
            <span className="text-xs text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/30">
              Autonomous Correlation Detection
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {dynamicAIInsights.map((insight, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-white/5 hover:border-indigo-500/40 transition">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-white">{insight.title}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                    {insight.impact}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{insight.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. ANIMATED CARDS: TOP PERFORMERS & WEAK STUDENT REMEDIATION ALERTS */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performing Students */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white font-heading">Top Performing Students Cohort</h3>
              </div>
              <span className="text-xs text-slate-400">Dean's Honor List</span>
            </div>

            <div className="space-y-2.5">
              {topStudents.map((student, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between hover:border-amber-500/30 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs flex items-center justify-center">
                      #{idx + 1}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{student.name}</p>
                      <p className="text-[11px] text-slate-400">{student.dept} • {student.regNo}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-emerald-400">{student.score}</span>
                    <p className="text-[10px] text-slate-400">GPA: {student.gpa} (Grade {student.grade})</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weak Student Alerts & Academic Remediation */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <h3 className="text-base font-bold text-white font-heading">Academic Remediation & Risk Alerts</h3>
              </div>
              <span className="text-xs text-rose-400 font-semibold">Priority 1 Attention</span>
            </div>

            <div className="space-y-2.5">
              {weakStudentAlerts.map((alert, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-rose-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-rose-500/40 transition">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white">{alert.name}</p>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                        {alert.regNo}
                      </span>
                    </div>
                    <p className="text-xs text-rose-300/90 mt-0.5">{alert.failReason}</p>
                  </div>
                  <span className="self-start sm:self-center text-[10px] font-bold px-2.5 py-1 rounded-full bg-rose-950 text-rose-300 border border-rose-800/40 whitespace-nowrap">
                    {alert.risk}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default LandingPage;
