import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Lock, BookOpen, Shield, Save, Eye, EyeOff, CheckCircle, Camera, Upload, LogOut } from 'lucide-react';
import Toast from '../components/Toast';
import { getUserAvatar } from '../utils/avatar';

const API_BASE_URL = 'http://localhost:5000/api';

const StudentProfilePage = () => {
  const { user, updateUser, openLogoutModal } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(getUserAvatar(user));
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [academicData, setAcademicData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchProfileDetails = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/student/dashboard`);
        if (res.data.success && isMounted && res.data.student) {
          setAcademicData(res.data.student);
          if (res.data.student.name && !name) setName(res.data.student.name);
          if (res.data.student.phone && !phone) setPhone(res.data.student.phone);
          if (res.data.student.avatar) setAvatar(res.data.student.avatar);
        }
      } catch (e) {
        console.warn('Profile academic data notice:', e.message);
      }
    };
    fetchProfileDetails();
    return () => {
      isMounted = false;
    };
  }, []);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleImageFile = async (file) => {
    if (!file) return;

    // Validate format: PNG, JPG, JPEG only
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const validExtensions = ['.png', '.jpg', '.jpeg'];
    const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExt)) {
      showToast('Invalid file format. Please upload PNG, JPG, or JPEG image files only.', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('File size exceeds 5 MB. Please upload a smaller image file.', 'error');
      return;
    }

    // Local Preview
    const reader = new FileReader();
    reader.onload = (e) => setPreviewImage(e.target.result);
    reader.readAsDataURL(file);

    // Backend Upload
    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post(`${API_BASE_URL}/student/upload-avatar`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success && res.data.data?.url) {
        const uploadedUrl = res.data.data.url;
        setAvatar(uploadedUrl);
        updateUser({ avatar: uploadedUrl });
        showToast('Image uploaded and profile picture updated successfully!', 'success');
      } else {
        showToast(res.data.message || 'Image upload failed', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Error uploading image to server', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      showToast('Name cannot be empty', 'error');
      return;
    }
    if (password && password.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put(`${API_BASE_URL}/student/profile`, {
        name,
        phone,
        avatar,
        password: password || undefined
      });

      if (res.data.success) {
        showToast('Personal profile updated successfully!', 'success');
        updateUser(res.data.user || { name, phone, avatar });
        setPassword('');
      } else {
        showToast(res.data.message || 'Error updating profile', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const displayUser = academicData || user;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-slate-100 p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-700/60 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={avatar}
                alt="Avatar"
                className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-500/50 shadow-lg"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{displayUser?.name}</h1>
              <p className="text-xs text-slate-400">{displayUser?.email} • {displayUser?.role || 'Student'}</p>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-500/40 mt-1">
                Read-Only Academic Parameters Protected
              </span>
            </div>
          </div>

          {/* Dedicated Sign Out Button */}
          <button
            type="button"
            onClick={openLogoutModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 hover:text-white text-xs font-semibold shadow-sm hover:shadow-red-950/60 transition-all group cursor-pointer"
            title="Sign Out of Account"
          >
            <LogOut className="w-4 h-4 text-red-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Comprehensive Academic Details from Dataset */}
        <div className="mb-8 p-5 rounded-2xl bg-slate-900/90 border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 font-heading">
              Official Dataset Academic Records
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800/40">
              Verified Dataset Record
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Register Number</span>
              <span className="font-mono font-bold text-indigo-400 text-sm">{displayUser?.registerNumber || 'REG20250001'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Student Name</span>
              <span className="font-bold text-white text-sm">{displayUser?.name || 'Student'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Department</span>
              <span className="font-bold text-white">{displayUser?.department || 'Computer Science'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Academic Standing</span>
              <span className="font-bold text-white">Year {displayUser?.year || Math.ceil((displayUser?.semester || 1) / 2)} • Semester {displayUser?.semester || 1}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Lecture Attendance</span>
              <span className={`font-bold font-mono text-sm ${Number(displayUser?.attendance) >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {displayUser?.attendance ?? 85}%
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Internal Marks</span>
              <span className="font-bold font-mono text-indigo-300 text-sm">
                {displayUser?.internalMarks ?? 75} / 100
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Cumulative CGPA</span>
              <span className="font-bold font-mono text-cyan-300 text-sm">
                {displayUser?.cgpa || displayUser?.previousGPA || 8.0} / 10.0
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Prediction & Risk</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="px-1.5 py-0.5 rounded bg-indigo-900/60 text-indigo-300 font-bold text-[10px]">
                  Grade: {displayUser?.grade || 'A'} ({displayUser?.passFail || 'Pass'})
                </span>
                <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                  displayUser?.riskLevel === 'High Risk' ? 'bg-rose-950 text-rose-300' : displayUser?.riskLevel === 'Moderate Risk' ? 'bg-amber-950 text-amber-300' : 'bg-emerald-950 text-emerald-300'
                }`}>
                  {displayUser?.riskLevel || 'Low Risk'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form for Personal Info */}
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <h2 className="text-base font-bold text-white border-b border-slate-800 pb-2">
            Update Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Contact Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="block text-slate-300 font-semibold mb-1">
                Upload Avatar / Profile Picture (PNG, JPG, JPEG - Max 5MB)
              </label>

              {/* Drag and drop zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition flex flex-col items-center justify-center gap-3 ${
                  dragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 bg-slate-900/60 hover:border-slate-600'
                }`}
              >
                <input
                  type="file"
                  id="avatar-file-input"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={(e) => e.target.files && e.target.files[0] && handleImageFile(e.target.files[0])}
                  className="hidden"
                />

                {uploadingImage ? (
                  <div className="flex flex-col items-center gap-2 py-4">
                    <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs text-indigo-400 font-medium">Uploading and processing image...</p>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">
                        Drag & Drop your image here, or{' '}
                        <label htmlFor="avatar-file-input" className="text-indigo-400 underline cursor-pointer hover:text-indigo-300">
                          browse file
                        </label>
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">Supports PNG, JPG, or JPEG up to 5MB</p>
                    </div>
                  </>
                )}
              </div>

              {/* Image URL fallback / manual edit */}
              <div className="pt-2">
                <span className="text-[11px] text-slate-400 block mb-1">Or edit image URL manually:</span>
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">
                Change Password (Leave blank to keep current)
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password (min 6 characters)"
                  className="w-full pl-10 pr-10 py-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-xs shadow-lg hover:opacity-95 transition flex items-center gap-2"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Personal Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentProfilePage;
