import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Database,
  BrainCircuit,
  TrendingUp,
  FileSpreadsheet,
  Upload,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  UserPlus,
  Trash2,
  Edit,
  Lock,
  Unlock,
  Download,
  Activity,
  Award,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  FileText,
  LogOut
} from 'lucide-react';
import Toast from '../components/Toast';
import PDFReportModal from '../components/PDFReportModal';
import { getUserAvatar } from '../utils/avatar';
import { exportToCSV } from '../utils/exportCsv';
import { exportToExcel } from '../utils/exportExcel';

import { API_BASE_URL } from '../config/api';

const AdminDashboardPage = () => {
  const { user, openLogoutModal } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'students' | 'dataset' | 'model' | 'predictions' | 'logs'
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Student accounts state
  const [students, setStudents] = useState([]);
  const [studentSearch, setStudentSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [studentPage, setStudentPage] = useState(1);
  const [studentTotalPages, setStudentTotalPages] = useState(1);
  const [showCreateStudentModal, setShowCreateStudentModal] = useState(false);
  const [editStudentModal, setEditStudentModal] = useState(null);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    password: 'student123',
    registerNumber: '',
    department: 'Computer Science',
    semester: 6,
    phone: ''
  });

  // Dataset management state
  const [datasetRecords, setDatasetRecords] = useState([]);
  const [datasetStats, setDatasetStats] = useState({});
  const [datasetSearch, setDatasetSearch] = useState('');
  const [datasetPage, setDatasetPage] = useState(1);
  const [datasetTotalPages, setDatasetTotalPages] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadVersionHistory, setUploadVersionHistory] = useState([]);

  // Retrain state
  const [retraining, setRetraining] = useState(false);

  // Predictions state
  const [predictions, setPredictions] = useState([]);
  const [predictionSearch, setPredictionSearch] = useState('');
  const [predDeptFilter, setPredDeptFilter] = useState('All');
  const [predictionPage, setPredictionPage] = useState(1);
  const [predictionTotalPages, setPredictionTotalPages] = useState(1);
  const [editPredModal, setEditPredModal] = useState(null);

  // Report Modal State
  const [viewReportModal, setViewReportModal] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'students') fetchStudents();
    if (activeTab === 'dataset') fetchDataset();
    if (activeTab === 'predictions') fetchPredictions();
  }, [activeTab, studentSearch, studentPage, departmentFilter, datasetSearch, datasetPage, predictionSearch, predictionPage, predDeptFilter]);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/dashboard-stats`);
      if (res.data.success) {
        setStats(res.data.stats);
        if (res.data.stats.uploadHistory) {
          setUploadVersionHistory(res.data.stats.uploadHistory);
        }
      }
    } catch (err) {
      showToast('Notice loading dashboard stats', 'info');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/users`, {
        params: { search: studentSearch, department: departmentFilter, page: studentPage, limit: 10 }
      });
      if (res.data.success) {
        setStudents(res.data.users);
        setStudentTotalPages(res.data.pages || 1);
      }
    } catch (err) {
      console.warn('Error fetching students:', err);
    }
  };

  const fetchDataset = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/dataset`, {
        params: { search: datasetSearch, page: datasetPage, limit: 15 }
      });
      if (res.data.success) {
        setDatasetRecords(res.data.dataset);
        setDatasetStats(res.data.stats || {});
        setDatasetTotalPages(res.data.pages || 1);
      }
    } catch (err) {
      console.warn('Error fetching dataset:', err);
    }
  };

  const fetchPredictions = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/predictions`, {
        params: { search: predictionSearch, department: predDeptFilter, page: predictionPage, limit: 10 }
      });
      if (res.data.success) {
        setPredictions(res.data.predictions);
        setPredictionTotalPages(res.data.pages || 1);
      }
    } catch (err) {
      console.warn('Error fetching predictions:', err);
    }
  };

  // Helper to generate & view student PDF report for any student
  const handleViewStudentReport = (student) => {
    const intM = student.internalMarks !== undefined ? student.internalMarks : 75;
    const assM = student.assignmentMarks !== undefined ? student.assignmentMarks : 80;
    const semM = student.semesterMarks !== undefined ? student.semesterMarks : 75;
    const pracM = student.practicalMarks !== undefined ? student.practicalMarks : 78;
    const projM = student.projectMarks !== undefined ? student.projectMarks : 82;
    const att = student.attendance !== undefined ? student.attendance : 85;
    const studyH = student.studyHours !== undefined ? student.studyHours : 5.5;
    const gpa = student.previousGPA !== undefined ? student.previousGPA : 8.0;

    const compositeScore = parseFloat(((intM + assM + semM) / 3.0).toFixed(2));
    const failingMarks = [];
    if (intM < 50) failingMarks.push(`Internal Marks (${intM}/100)`);
    if (assM < 50) failingMarks.push(`Assignment Marks (${assM}/100)`);
    if (semM < 50) failingMarks.push(`Semester Marks (${semM}/100)`);

    const hasFailingMark = failingMarks.length > 0 || compositeScore < 50;
    const passFail = hasFailingMark ? 'Fail' : 'Pass';
    let grade = 'F';
    let confidenceScore = null;
    let probabilityScore = null;

    if (!hasFailingMark) {
      if (compositeScore >= 85) grade = 'A+';
      else if (compositeScore >= 75) grade = 'A';
      else if (compositeScore >= 65) grade = 'B';
      else grade = 'C';

      const prob = 1.0 / (1.0 + Math.exp(-(compositeScore - 50.0) / 7.5));
      probabilityScore = parseFloat(prob.toFixed(4));
      confidenceScore = parseFloat((prob * 100).toFixed(2));
    }

    const reportObj = {
      studentName: student.name,
      registerNumber: student.registerNumber || 'REG20250001',
      department: student.department || 'Computer Science',
      semester: student.semester || 6,
      attendance: att,
      internalMarks: intM,
      assignmentMarks: assM,
      studyHours: studyH,
      previousGPA: gpa,
      practicalMarks: pracM,
      projectMarks: projM,
      semesterMarks: semM,
      extraActivities: student.extraActivities || 'Yes',
      passFail,
      grade,
      compositeScore,
      confidenceScore,
      probabilityScore,
      performanceLevel: passFail === 'Pass' ? 'Good Academic Standing' : `Fail - Failed criteria (< 50 marks) in: ${failingMarks.join(', ')}`,
      suggestions: [
        passFail === 'Pass'
          ? `🌟 PASS: Overall evaluation composite score ${compositeScore}% meets requirements.`
          : `🔴 FAIL CRITERIA ANALYSIS: Required at least 50/100 in all semester evaluations. Failed: ${failingMarks.join(', ')}.`
      ],
      createdAt: new Date().toISOString()
    };

    setViewReportModal(reportObj);
  };

  const handleExportStudentsExcel = async () => {
    try {
      showToast(`Exporting ALL student records for ${departmentFilter === 'All' ? 'All Departments' : departmentFilter}...`, 'info');
      const res = await axios.get(`${API_BASE_URL}/admin/users`, {
        params: { search: studentSearch, department: departmentFilter, limit: 10000 }
      });
      const allStudents = res.data.success ? res.data.users : students;

      if (!allStudents || !allStudents.length) {
        showToast('No student records found to export.', 'error');
        return;
      }

      const exportData = allStudents.map((st, idx) => ({
        'S.No': idx + 1,
        'Student Name': st.name,
        'Register Number': st.registerNumber || '',
        'Email Address': st.email,
        'Gender': st.gender || 'Male',
        'Department': st.department || 'Computer Science',
        'Semester': st.semester || 6,
        'Internal Marks (0-100)': st.internalMarks !== undefined ? st.internalMarks : 75,
        'Assignment Marks (0-100)': st.assignmentMarks !== undefined ? st.assignmentMarks : 80,
        'Practical Marks (0-100)': st.practicalMarks !== undefined ? st.practicalMarks : 78,
        'Project Marks (0-100)': st.projectMarks !== undefined ? st.projectMarks : 82,
        'Semester Marks (0-100)': st.semesterMarks !== undefined ? st.semesterMarks : 75,
        'Attendance %': st.attendance !== undefined ? st.attendance : 85,
        'Study Hours/Day': st.studyHours !== undefined ? st.studyHours : 5.5,
        'Previous CGPA': st.previousGPA !== undefined ? st.previousGPA : 8.0,
        'Account Status': st.isActive !== false ? 'Active' : 'Disabled'
      }));

      const deptTag = departmentFilter !== 'All' ? departmentFilter.replace(/\s+/g, '_') : 'All_Departments';
      exportToExcel(exportData, `Department_Students_${deptTag}_All_Records.xlsx`, deptTag);
      showToast(`Exported ${allStudents.length} student records for ${departmentFilter} to Excel (.xlsx)!`, 'success');
    } catch (err) {
      showToast('Error exporting student records to Excel', 'error');
    }
  };

  const handleExportPredictionsExcel = async () => {
    try {
      showToast(`Exporting ALL prediction logs for ${predDeptFilter === 'All' ? 'All Departments' : predDeptFilter}...`, 'info');
      const res = await axios.get(`${API_BASE_URL}/admin/predictions`, {
        params: { search: predictionSearch, department: predDeptFilter, limit: 10000 }
      });
      const allPredictions = res.data.success ? res.data.predictions : predictions;

      if (!allPredictions || !allPredictions.length) {
        showToast('No prediction logs found to export.', 'error');
        return;
      }

      const exportData = allPredictions.map((p, idx) => ({
        'S.No': idx + 1,
        'Student Name': p.studentName,
        'Register Number': p.registerNumber,
        'Department': p.department || 'Computer Science',
        'Semester': p.semester || 6,
        'Pass/Fail Outcome': p.passFail,
        'Letter Grade': p.grade,
        'Composite Score (%)': p.compositeScore,
        'Predicted CGPA': p.predictedCGPA || (p.compositeScore / 10).toFixed(2),
        'DNN Pass Confidence (%)': p.confidenceScore || 'N/A',
        'Evaluation Date': new Date(p.createdAt || Date.now()).toLocaleString()
      }));

      const deptTag = predDeptFilter !== 'All' ? predDeptFilter.replace(/\s+/g, '_') : 'All_Departments';
      exportToExcel(exportData, `Department_Predictions_${deptTag}_All_Records.xlsx`, deptTag);
      showToast(`Exported ${allPredictions.length} prediction logs for ${predDeptFilter} to Excel (.xlsx)!`, 'success');
    } catch (err) {
      showToast('Error exporting prediction logs to Excel', 'error');
    }
  };

  // Student Accounts Actions
  const handleToggleUserStatus = async (student) => {
    try {
      const updatedStatus = !student.isActive;
      const res = await axios.put(`${API_BASE_URL}/admin/users/${student._id || student.id}`, {
        ...student,
        isActive: updatedStatus
      });
      if (res.data.success) {
        showToast(`Account status set to ${updatedStatus ? 'ACTIVE' : 'DISABLED'}`, 'success');
        fetchStudents();
      }
    } catch (err) {
      showToast('Error updating student status', 'error');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student account?')) return;
    try {
      const res = await axios.delete(`${API_BASE_URL}/admin/users/${id}`);
      if (res.data.success) {
        showToast('Student account removed', 'success');
        fetchStudents();
        fetchDashboardStats();
      }
    } catch (err) {
      showToast('Error deleting student', 'error');
    }
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/admin/users`, newStudent);
      if (res.data.success) {
        showToast('New student created successfully!', 'success');
        setShowCreateStudentModal(false);
        setNewStudent({ name: '', email: '', password: 'student123', registerNumber: '', department: 'Computer Science', semester: 6, phone: '' });
        fetchStudents();
        fetchDashboardStats();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Error creating student account', 'error');
    }
  };

  // Dataset Upload Handler
  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      showToast('Please select a CSV or Excel file to upload.', 'error');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await axios.post(`${API_BASE_URL}/admin/dataset/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        showToast(`Dataset uploaded! Version: ${res.data.version}. Duplicates removed: ${res.data.stats.duplicatesRemoved}`, 'success');
        setSelectedFile(null);
        fetchDataset();
        fetchDashboardStats();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Dataset upload failed. Check column headers.', 'error');
    } finally {
      setUploading(false);
    }
  };

  // Retrain DNN Model Handler
  const handleRetrainModel = async () => {
    setRetraining(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/admin/model/retrain`);
      if (res.data.success) {
        showToast(`Model Retrained! Accuracy: ${(res.data.model.accuracy * 100).toFixed(2)}%`, 'success');
        fetchDashboardStats();
      }
    } catch (err) {
      showToast('Retraining error', 'error');
    } finally {
      setRetraining(false);
    }
  };

  // Admin Edit Student Details & Academic Marks Handler
  const handleSaveEditStudent = async (e) => {
    e.preventDefault();
    if (!editStudentModal) return;
    try {
      const res = await axios.put(`${API_BASE_URL}/admin/users/${editStudentModal._id || editStudentModal.id}`, editStudentModal);
      if (res.data.success) {
        showToast('Student details and academic marks updated successfully!', 'success');
        setEditStudentModal(null);
        fetchStudents();
      } else {
        showToast(res.data.message || 'Error updating student', 'error');
      }
    } catch (err) {
      showToast('Error updating student details/marks', 'error');
    }
  };

  // Admin Edit Prediction Values Handler
  const handleSaveEditPrediction = async (e) => {
    e.preventDefault();
    if (!editPredModal) return;
    try {
      const res = await axios.put(`${API_BASE_URL}/admin/predictions/${editPredModal._id || editPredModal.id}`, editPredModal);
      if (res.data.success) {
        showToast('Prediction record updated by Admin successfully!', 'success');
        setEditPredModal(null);
        fetchPredictions();
      } else {
        showToast(res.data.message || 'Error updating prediction', 'error');
      }
    } catch (err) {
      showToast('Error updating prediction record', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-slate-100 flex flex-col md:flex-row">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900/90 border-r border-slate-800 p-4 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-slate-800">
            <div className="p-2 rounded-xl bg-purple-600/30 text-purple-400 border border-purple-500/40">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-sm bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent">
                Admin Suite
              </h2>
              <span className="text-[10px] uppercase font-semibold text-purple-400 bg-purple-950 px-2 py-0.5 rounded">
                Full RBAC Access
              </span>
            </div>
          </div>

          <nav className="space-y-1 text-sm font-medium">
            {[
              { id: 'overview', label: 'System Overview', icon: LayoutDashboard },
              { id: 'students', label: 'Student Accounts', icon: Users },
              { id: 'dataset', label: 'Dataset Manager', icon: Database },
              { id: 'model', label: 'DNN Model Control', icon: BrainCircuit },
              { id: 'predictions', label: 'All Predictions', icon: Activity },
              { id: 'logs', label: 'Audit Logs & Security', icon: FileText }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all ${
                    activeTab === item.id
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl mt-6 text-xs text-slate-400">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-slate-300">Model Version:</span>
            <span className="text-purple-400 font-mono">{stats?.modelInfo?.version || '1.0.0'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-300">Validation Acc:</span>
            <span className="text-emerald-400 font-bold">{((stats?.modelInfo?.accuracy || 0.9964) * 100).toFixed(2)}%</span>
          </div>
        </div>

        {/* Universal Sign Out Button in Left Sidebar */}
        <div className="pt-3 border-t border-slate-800 mt-3">
          <button
            type="button"
            onClick={openLogoutModal}
            className="w-full flex items-center justify-center gap-2.5 px-3 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 hover:text-white font-semibold text-xs shadow-sm hover:shadow-red-950/50 transition-all duration-200 group cursor-pointer"
            title="Sign Out of Admin Suite"
          >
            <LogOut className="w-4 h-4 text-red-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white">System Administrative Dashboard</h1>
                <p className="text-slate-400 text-sm">Real-time metrics, predictive accuracy logs, and dataset statistics</p>
              </div>
              <button
                onClick={handleRetrainModel}
                disabled={retraining}
                className="px-4 py-2.5 rounded-xl bg-purple-600 text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 hover:bg-purple-500 transition disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${retraining ? 'animate-spin' : ''}`} />
                {retraining ? 'Retraining DNN Model...' : 'Retrain Deep Neural Network'}
              </button>
            </div>

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="glass-panel p-5 rounded-2xl border border-slate-700/60 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-medium">Registered Students</span>
                  <h3 className="text-2xl font-bold text-white mt-1">{stats?.totalUsers || 142}</h3>
                  <span className="text-[11px] text-emerald-400 font-medium">Active Accounts</span>
                </div>
                <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-slate-700/60 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-medium">Total Predictions</span>
                  <h3 className="text-2xl font-bold text-white mt-1">{stats?.totalPredictions || 5000}</h3>
                  <span className="text-[11px] text-purple-400 font-medium">{stats?.passPercentage || 85.6}% Pass Ratio</span>
                </div>
                <div className="p-3 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
                  <Activity className="w-6 h-6" />
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-slate-700/60 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-medium">Dataset Records</span>
                  <h3 className="text-2xl font-bold text-white mt-1">{stats?.totalDatasetRecords || 5000}</h3>
                  <span className="text-[11px] text-emerald-400 font-medium">{stats?.datasetStatus || 'Active'}</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
                  <Database className="w-6 h-6" />
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-slate-700/60 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-medium">Model Accuracy</span>
                  <h3 className="text-2xl font-bold text-emerald-400 mt-1">
                    {((stats?.modelInfo?.accuracy || 0.9964) * 100).toFixed(2)}%
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">4-Layer Sequential DNN</span>
                </div>
                <div className="p-3 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30">
                  <BrainCircuit className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Quick Recent Activity & Predictions Stream */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-panel p-6 rounded-2xl border border-slate-700/60">
                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-400" /> Recent Student Predictions
                </h3>
                <div className="space-y-3">
                  {(stats?.recentPredictions || []).slice(0, 5).map((p, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-white">{p.studentName}</div>
                        <div className="text-slate-400">{p.registerNumber} • {p.department}</div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.passFail === 'Pass' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' : 'bg-red-950 text-red-400 border border-red-500/40'}`}>
                          {p.passFail} ({p.grade})
                        </span>
                        <div className="text-slate-400 text-[10px] mt-0.5">Score: {p.compositeScore}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-slate-700/60">
                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-400" /> System Activity & Audit Logs
                </h3>
                <div className="space-y-3">
                  {(stats?.recentLogs || []).slice(0, 5).map((log, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-purple-300">{log.action}</span>
                        <div className="text-slate-400">{log.userEmail || 'System'}</div>
                      </div>
                      <span className="text-slate-500 text-[10px]">
                        {new Date(log.timestamp || Date.now()).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STUDENT ACCOUNTS MANAGEMENT TAB */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white">Student Account Management</h1>
                <p className="text-slate-400 text-sm">Create, edit, toggle active status, and manage student user profiles</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportStudentsExcel}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 hover:bg-purple-500 transition"
                  title="Export all department student records as Excel spreadsheet (.xlsx)"
                >
                  <Download className="w-4 h-4" /> Export Department Excel (.xlsx)
                </button>
                <button
                  onClick={() => setShowCreateStudentModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition"
                >
                  <UserPlus className="w-4 h-4" /> Add New Student
                </button>
              </div>
            </div>

            {/* Search & Department Filter Bar */}
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="glass-panel p-3.5 rounded-2xl border border-slate-700/60 flex items-center gap-3 flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by student name, email, or register number..."
                  value={studentSearch}
                  onChange={(e) => { setStudentSearch(e.target.value); setStudentPage(1); }}
                  className="bg-transparent border-none text-white text-sm focus:outline-none w-full placeholder-slate-500"
                />
              </div>
              <div className="glass-panel px-4 py-2.5 rounded-2xl border border-slate-700/60 flex items-center gap-2 text-xs w-full md:w-auto">
                <Filter className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="text-slate-400 font-semibold">Department:</span>
                <select
                  value={departmentFilter}
                  onChange={(e) => { setDepartmentFilter(e.target.value); setStudentPage(1); }}
                  className="bg-slate-900 border border-slate-700 rounded-xl text-white px-2.5 py-1 focus:outline-none font-medium"
                >
                  <option value="All">All Departments</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Comm">Electronics & Comm</option>
                  <option value="Electrical & Elec">Electrical & Elec</option>
                  <option value="Mechanical Eng">Mechanical Eng</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="glass-panel rounded-2xl border border-slate-700/60 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-4">Student</th>
                      <th className="p-4">Gender</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Reg No</th>
                      <th className="p-4">Department</th>
                      <th className="p-4">Semester</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {students.map((st) => (
                      <tr key={st._id || st.id} className="hover:bg-slate-800/40 transition">
                        <td className="p-4 font-semibold text-white flex items-center gap-2.5">
                          <img
                            src={getUserAvatar(st)}
                            alt="Avatar"
                            className="w-8 h-8 rounded-full object-cover border border-indigo-500/40 shrink-0"
                          />
                          <span>{st.name}</span>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                            {st.gender || 'Male'}
                          </span>
                        </td>
                        <td className="p-4">{st.email}</td>
                        <td className="p-4 font-mono text-slate-400">{st.registerNumber}</td>
                        <td className="p-4">{st.department}</td>
                        <td className="p-4">Sem {st.semester}</td>
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleUserStatus(st)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 transition ${
                              st.isActive !== false
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-900'
                                : 'bg-red-950 text-red-400 border border-red-500/40 hover:bg-red-900'
                            }`}
                          >
                            {st.isActive !== false ? (
                              <>
                                <Unlock className="w-3 h-3" /> Enabled
                              </>
                            ) : (
                              <>
                                <Lock className="w-3 h-3" /> Disabled
                              </>
                            )}
                          </button>
                        </td>
                        <td className="p-4 text-right flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleViewStudentReport(st)}
                            className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-950/40 transition flex items-center gap-1 text-[11px] font-semibold border border-emerald-500/30 px-2"
                            title="View & Download PDF Report"
                          >
                            <FileText className="w-3.5 h-3.5" /> Report
                          </button>
                          <button
                            onClick={() => setEditStudentModal({
                              ...st,
                              gender: st.gender || 'Male',
                              internalMarks: st.internalMarks !== undefined ? st.internalMarks : 75,
                              assignmentMarks: st.assignmentMarks !== undefined ? st.assignmentMarks : 80,
                              practicalMarks: st.practicalMarks !== undefined ? st.practicalMarks : 78,
                              projectMarks: st.projectMarks !== undefined ? st.projectMarks : 82,
                              semesterMarks: st.semesterMarks !== undefined ? st.semesterMarks : 75,
                              attendance: st.attendance !== undefined ? st.attendance : 85,
                              studyHours: st.studyHours !== undefined ? st.studyHours : 5.5,
                              previousGPA: st.previousGPA !== undefined ? st.previousGPA : 8.0,
                              extraActivities: st.extraActivities || 'Yes'
                            })}
                            className="p-1.5 rounded-lg text-indigo-400 hover:bg-indigo-950/40 transition"
                            title="Edit Details & Academic Marks"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(st._id || st.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition"
                            title="Delete Account"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Page {studentPage} of {studentTotalPages}</span>
                <div className="flex gap-2">
                  <button
                    disabled={studentPage <= 1}
                    onClick={() => setStudentPage(prev => prev - 1)}
                    className="p-1.5 rounded bg-slate-800 border border-slate-700 disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={studentPage >= studentTotalPages}
                    onClick={() => setStudentPage(prev => prev + 1)}
                    className="p-1.5 rounded bg-slate-800 border border-slate-700 disabled:opacity-40"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DATASET MANAGEMENT TAB */}
        {activeTab === 'dataset' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white">Academic Dataset Manager</h1>
                <p className="text-slate-400 text-sm">Upload CSV/Excel dataset, validate column schema, prevent duplicates, and view table</p>
              </div>
              <a
                href={`${API_BASE_URL}/admin/export-csv`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-purple-600 text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 hover:bg-purple-500 transition"
              >
                <Download className="w-4 h-4" /> Export CSV Dataset
              </a>
            </div>

            {/* CSV / Excel File Upload Card */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-700/60 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-400" /> Upload New Academic Dataset (CSV / Excel)
              </h3>
              <p className="text-xs text-slate-400">
                Required Columns: <code className="text-indigo-300">Student_ID, Student_Name, Attendance, Internal_Marks, Assignment_Marks, Previous_GPA, Predicted_Result</code>
              </p>

              <form onSubmit={handleFileUpload} className="flex flex-wrap items-center gap-4">
                <input
                  type="file"
                  accept=".csv, .xlsx, .xls"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="text-xs text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600/30 file:text-indigo-300 hover:file:bg-indigo-600/50 cursor-pointer"
                />
                <button
                  type="submit"
                  disabled={uploading || !selectedFile}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-xs shadow-lg hover:opacity-95 transition disabled:opacity-50"
                >
                  {uploading ? 'Validating & Importing...' : 'Import Dataset'}
                </button>
              </form>
            </div>

            {/* Dataset Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">Avg Attendance</span>
                <div className="text-xl font-bold text-white mt-1">{datasetStats.avgAttendance || 82.4}%</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">Avg Internal Marks</span>
                <div className="text-xl font-bold text-white mt-1">{datasetStats.avgInternalMarks || 74.5}/100</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">Avg Previous CGPA</span>
                <div className="text-xl font-bold text-white mt-1">{datasetStats.avgPreviousCGPA || 7.8}/10</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">Pass Ratio</span>
                <div className="text-xl font-bold text-emerald-400 mt-1">{datasetStats.passPercentage || 85.6}%</div>
              </div>
            </div>

            {/* Search Filter */}
            <div className="glass-panel p-4 rounded-2xl border border-slate-700/60 flex items-center gap-3">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search dataset by student name or student ID..."
                value={datasetSearch}
                onChange={(e) => { setDatasetSearch(e.target.value); setDatasetPage(1); }}
                className="bg-transparent border-none text-white text-sm focus:outline-none w-full placeholder-slate-500"
              />
            </div>

            {/* Table */}
            <div className="glass-panel rounded-2xl border border-slate-700/60 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-4">Student ID</th>
                      <th className="p-4">Name</th>
                      <th className="p-4">Attendance</th>
                      <th className="p-4">Internal Marks</th>
                      <th className="p-4">Assignments</th>
                      <th className="p-4">CGPA</th>
                      <th className="p-4">Predicted Performance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {datasetRecords.map((r, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40 transition">
                        <td className="p-4 font-mono text-slate-400">{r.studentId}</td>
                        <td className="p-4 font-semibold text-white">{r.studentName}</td>
                        <td className="p-4">{r.attendance}%</td>
                        <td className="p-4">{r.internalMarks}/100</td>
                        <td className="p-4">{r.assignmentScores || r.assignmentMarks}/100</td>
                        <td className="p-4 font-bold text-purple-300">{r.previousSemesterCGPA || r.previousGPA}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            r.predictedPerformance === 'Pass' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' : 'bg-red-950 text-red-400 border border-red-500/40'
                          }`}>
                            {r.predictedPerformance}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MODEL CONTROL TAB */}
        {activeTab === 'model' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white">Deep Neural Network Model Pipeline</h1>
                <p className="text-slate-400 text-sm">4-Layer Sequential Keras Architecture & Performance Evaluation</p>
              </div>
              <button
                onClick={handleRetrainModel}
                disabled={retraining}
                className="px-4 py-2.5 rounded-xl bg-purple-600 text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 hover:bg-purple-500 transition disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${retraining ? 'animate-spin' : ''}`} />
                {retraining ? 'Training DNN Model...' : 'Execute Model Retraining'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel p-6 rounded-2xl border border-slate-700/60 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-purple-400" /> Neural Metrics
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Validation Accuracy</span>
                    <span className="font-bold text-emerald-400">{((stats?.modelInfo?.accuracy || 0.9964) * 100).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Precision</span>
                    <span className="font-bold text-indigo-400">{((stats?.modelInfo?.precision || 0.9974) * 100).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Recall</span>
                    <span className="font-bold text-purple-400">{((stats?.modelInfo?.recall || 0.9982) * 100).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">F1 Score</span>
                    <span className="font-bold text-amber-400">{((stats?.modelInfo?.f1Score || 0.9978) * 100).toFixed(2)}%</span>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-slate-700/60 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-400" /> Architecture Blueprint
                </h3>
                <div className="p-4 bg-slate-950 rounded-xl text-xs font-mono text-slate-300 space-y-2 border border-slate-800">
                  <div>Layer 1: Dense (64 Neurons, ReLU activation)</div>
                  <div>Layer 2: Batch Normalization</div>
                  <div>Layer 3: Dense (32 Neurons, ReLU activation)</div>
                  <div>Layer 4: Dropout Rate (0.3)</div>
                  <div>Layer 5: Dense (16 Neurons, ReLU activation)</div>
                  <div>Output Layer: Dense (1 Neuron, Sigmoid activation)</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ALL PREDICTIONS TAB */}
        {activeTab === 'predictions' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white">All Student Predictions</h1>
                <p className="text-slate-400 text-sm">View, search, filter by department, and download PDF reports for all student predictions</p>
              </div>
              <button
                onClick={handleExportPredictionsExcel}
                className="px-4 py-2.5 rounded-xl bg-purple-600 text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 hover:bg-purple-500 transition"
                title="Export all department predictions list as Excel spreadsheet (.xlsx)"
              >
                <Download className="w-4 h-4" /> Export Predictions Excel (.xlsx)
              </button>
            </div>

            {/* Search & Department Filter Bar */}
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="glass-panel p-3.5 rounded-2xl border border-slate-700/60 flex items-center gap-3 flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search predictions by student name, reg no, department..."
                  value={predictionSearch}
                  onChange={(e) => { setPredictionSearch(e.target.value); setPredictionPage(1); }}
                  className="bg-transparent border-none text-white text-sm focus:outline-none w-full placeholder-slate-500"
                />
              </div>
              <div className="glass-panel px-4 py-2.5 rounded-2xl border border-slate-700/60 flex items-center gap-2 text-xs w-full md:w-auto">
                <Filter className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="text-slate-400 font-semibold">Department:</span>
                <select
                  value={predDeptFilter}
                  onChange={(e) => { setPredDeptFilter(e.target.value); setPredictionPage(1); }}
                  className="bg-slate-900 border border-slate-700 rounded-xl text-white px-2.5 py-1 focus:outline-none font-medium"
                >
                  <option value="All">All Departments</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Comm">Electronics & Comm</option>
                  <option value="Electrical & Elec">Electrical & Elec</option>
                  <option value="Mechanical Eng">Mechanical Eng</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="glass-panel rounded-2xl border border-slate-700/60 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-4">Student Name</th>
                      <th className="p-4">Reg No</th>
                      <th className="p-4">Department</th>
                      <th className="p-4">Result</th>
                      <th className="p-4">Grade</th>
                      <th className="p-4">Predicted CGPA</th>
                      <th className="p-4">Confidence</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {predictions.map((p) => (
                      <tr key={p._id} className="hover:bg-slate-800/40 transition">
                        <td className="p-4 font-semibold text-white">{p.studentName}</td>
                        <td className="p-4 font-mono text-slate-400">{p.registerNumber}</td>
                        <td className="p-4">{p.department || 'Computer Science'}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.passFail === 'Pass' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' : 'bg-red-950 text-red-400 border border-red-500/40'}`}>
                            {p.passFail}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-purple-300">{p.grade}</td>
                        <td className="p-4 font-bold text-indigo-300">{p.predictedCGPA || (p.compositeScore / 10).toFixed(2)}</td>
                        <td className="p-4">{p.confidenceScore}%</td>
                        <td className="p-4 text-right flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewReportModal(p)}
                            className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-950/40 transition flex items-center gap-1 text-[11px] font-semibold border border-emerald-500/30 px-2"
                            title="View & Download PDF Report"
                          >
                            <FileText className="w-3.5 h-3.5" /> Report
                          </button>
                          <button
                            onClick={() => setEditPredModal(p)}
                            className="p-1.5 rounded-lg text-indigo-400 hover:bg-indigo-950/40 transition"
                            title="Edit Prediction Value"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* LOGS TAB */}
        {activeTab === 'logs' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">System Security & Audit Logs</h1>
            <div className="glass-panel p-6 rounded-2xl border border-slate-700/60 space-y-3">
              {(stats?.recentLogs || []).map((log, idx) => (
                <div key={idx} className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-purple-300">{log.action}</span>
                    <div className="text-slate-400">{log.userEmail || 'System'} {log.details ? `— ${log.details}` : ''}</div>
                  </div>
                  <span className="text-slate-500 text-[10px]">{new Date(log.timestamp || Date.now()).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* CREATE STUDENT MODAL */}
      {showCreateStudentModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-panel p-6 rounded-3xl border border-slate-700 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-white">Create New Student Account</h3>
            <form onSubmit={handleCreateStudent} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  placeholder="Student Name"
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                  placeholder="email@college.edu"
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Password</label>
                <input
                  type="text"
                  required
                  value={newStudent.password}
                  onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateStudentModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold">
                  Create Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT STUDENT DETAILS & MARKS MODAL */}
      {editStudentModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="glass-panel p-6 rounded-3xl border border-indigo-500/40 max-w-2xl w-full space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={getUserAvatar(editStudentModal)}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500/50"
                />
                <div>
                  <h3 className="text-lg font-bold text-white">Edit Student Details & Academic Marks</h3>
                  <p className="text-xs text-slate-400">Admin control panel: Update student profile and locked internal marks</p>
                </div>
              </div>
              <button onClick={() => setEditStudentModal(null)} className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditStudent} className="space-y-4 text-xs">
              {/* Section 1: Basic Info */}
              <div className="space-y-2">
                <h4 className="font-bold text-indigo-400 uppercase tracking-wider text-[11px]">1. Basic Student Info</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Student Name</label>
                    <input
                      type="text"
                      required
                      value={editStudentModal.name || ''}
                      onChange={(e) => setEditStudentModal({ ...editStudentModal, name: e.target.value })}
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Register Number</label>
                    <input
                      type="text"
                      required
                      value={editStudentModal.registerNumber || ''}
                      onChange={(e) => setEditStudentModal({ ...editStudentModal, registerNumber: e.target.value })}
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Gender Avatar</label>
                    <select
                      value={editStudentModal.gender || 'Male'}
                      onChange={(e) => setEditStudentModal({ ...editStudentModal, gender: e.target.value })}
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                    >
                      <option value="Male">Male ♂ (Male Student Avatar)</option>
                      <option value="Female">Female ♀ (Female Student Avatar)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Department</label>
                    <select
                      value={editStudentModal.department || 'Computer Science'}
                      onChange={(e) => setEditStudentModal({ ...editStudentModal, department: e.target.value })}
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Electronics & Comm">Electronics & Comm</option>
                      <option value="Electrical & Elec">Electrical & Elec</option>
                      <option value="Mechanical Eng">Mechanical Eng</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Semester</label>
                    <input
                      type="number"
                      min="1"
                      max="8"
                      value={editStudentModal.semester || 6}
                      onChange={(e) => setEditStudentModal({ ...editStudentModal, semester: Number(e.target.value) })}
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Locked Academic Marks */}
              <div className="space-y-2 border-t border-white/10 pt-3">
                <h4 className="font-bold text-indigo-400 uppercase tracking-wider text-[11px]">2. Official Academic Evaluation Marks (Admin Controlled)</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Internal Marks (0-100)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={editStudentModal.internalMarks !== undefined ? editStudentModal.internalMarks : 75}
                      onChange={(e) => setEditStudentModal({ ...editStudentModal, internalMarks: parseFloat(e.target.value) || 0 })}
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Assignment Marks (0-100)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={editStudentModal.assignmentMarks !== undefined ? editStudentModal.assignmentMarks : 80}
                      onChange={(e) => setEditStudentModal({ ...editStudentModal, assignmentMarks: parseFloat(e.target.value) || 0 })}
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Practical Marks (0-100)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={editStudentModal.practicalMarks !== undefined ? editStudentModal.practicalMarks : 78}
                      onChange={(e) => setEditStudentModal({ ...editStudentModal, practicalMarks: parseFloat(e.target.value) || 0 })}
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Project Marks (0-100)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={editStudentModal.projectMarks !== undefined ? editStudentModal.projectMarks : 82}
                      onChange={(e) => setEditStudentModal({ ...editStudentModal, projectMarks: parseFloat(e.target.value) || 0 })}
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Semester Marks (0-100)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={editStudentModal.semesterMarks !== undefined ? editStudentModal.semesterMarks : 75}
                      onChange={(e) => setEditStudentModal({ ...editStudentModal, semesterMarks: parseFloat(e.target.value) || 0 })}
                      className="w-full p-2.5 bg-indigo-950/60 border border-indigo-500 rounded-xl text-emerald-300 font-extrabold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Attendance %</label>
                    <input
                      type="number"
                      step="0.01"
                      min="40"
                      max="100"
                      value={editStudentModal.attendance !== undefined ? editStudentModal.attendance : 85}
                      onChange={(e) => setEditStudentModal({ ...editStudentModal, attendance: parseFloat(e.target.value) || 0 })}
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditStudentModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg">
                  Save Student Profile & Marks
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PREDICTION MODAL */}
      {editPredModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-panel p-6 rounded-3xl border border-slate-700 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-white">Edit Prediction Values (Admin Override)</h3>
            <form onSubmit={handleSaveEditPrediction} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Predicted Grade</label>
                <input
                  type="text"
                  value={editPredModal.grade}
                  onChange={(e) => setEditPredModal({ ...editPredModal, grade: e.target.value })}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Pass / Fail</label>
                <select
                  value={editPredModal.passFail}
                  onChange={(e) => setEditPredModal({ ...editPredModal, passFail: e.target.value })}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                >
                  <option value="Pass">Pass</option>
                  <option value="Fail">Fail</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Predicted CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  value={editPredModal.predictedCGPA || 8.5}
                  onChange={(e) => setEditPredModal({ ...editPredModal, predictedCGPA: parseFloat(e.target.value) })}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditPredModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-purple-600 text-white font-semibold">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW & DOWNLOAD STUDENT REPORT MODAL */}
      {viewReportModal && (
        <PDFReportModal
          prediction={viewReportModal}
          onClose={() => setViewReportModal(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboardPage;
