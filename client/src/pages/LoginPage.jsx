import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserPlus, KeyRound, Mail, Lock, ShieldCheck, CheckCircle2, AlertCircle, Eye, EyeOff, User, Building2, BookOpen } from 'lucide-react';
import Toast from '../components/Toast';

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register' | 'forgot' | 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Student');
  const [registerNumber, setRegisterNumber] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [semester, setSemester] = useState(6);
  const [phone, setPhone] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Forgot / Reset state
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [generatedDemoToken, setGeneratedDemoToken] = useState('');

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const { login, register, forgotPassword, resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || (role === 'Admin' ? '/admin' : '/dashboard');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Check for session expiry notice or saved remember-me identifier
  React.useEffect(() => {
    const expiryNotice = sessionStorage.getItem('session_expired_notice');
    if (expiryNotice) {
      showToast(expiryNotice, 'warning');
      sessionStorage.removeItem('session_expired_notice');
    }

    const isRemembered = localStorage.getItem('remember_me') === 'true';
    const savedIdentifier = localStorage.getItem('remembered_identifier');
    if (isRemembered && savedIdentifier) {
      setEmail(savedIdentifier);
      setRememberMe(true);
    }
  }, []);

  // Register Number & Email validation: accepts any register number or email format
  const isIdentifierValid = (id) => {
    if (!id || String(id).trim().length === 0) return false;
    return true;
  };

  const isEmailValid = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  // Password strength meter
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: 'Empty', color: 'bg-gray-600' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-red-500' };
    if (score <= 4) return { score: 3, label: 'Medium', color: 'bg-amber-500' };
    return { score: 5, label: 'Strong', color: 'bg-emerald-500' };
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both Email / Register Number and Password', 'error');
      return;
    }
    if (!isIdentifierValid(email)) {
      showToast('Please enter a valid Email Address or Register Number (e.g. REG20250001)', 'error');
      return;
    }

    setLoading(true);
    const res = await login(email, password, rememberMe);
    setLoading(false);

    if (res.success) {
      showToast('Login successful! Redirecting...', 'success');
      setTimeout(() => {
        if (res.user?.role === 'Admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }, 500);
    } else {
      showToast(res.message || 'Login failed. Invalid credentials.', 'error');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    if (!isEmailValid(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters long.', 'error');
      return;
    }

    setLoading(true);
    const res = await register({
      name,
      email,
      password,
      role,
      registerNumber: registerNumber || `REG2025${Math.floor(1000 + Math.random() * 9000)}`,
      department,
      semester: Number(semester),
      phone
    });
    setLoading(false);

    if (res.success) {
      showToast('Account created successfully!', 'success');
      setTimeout(() => {
        if (res.user?.role === 'Admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }, 500);
    } else {
      showToast(res.message || 'Registration failed.', 'error');
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!email || !isEmailValid(email)) {
      showToast('Please enter a valid registered email address.', 'error');
      return;
    }

    setLoading(true);
    const res = await forgotPassword(email);
    setLoading(false);

    if (res.success) {
      showToast('Reset token generated successfully!', 'success');
      if (res.resetToken) {
        setGeneratedDemoToken(res.resetToken);
        setResetToken(res.resetToken);
      }
      setActiveTab('reset');
    } else {
      showToast(res.message || 'Error processing request.', 'error');
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!email || !resetToken || !newPassword) {
      showToast('Please enter email, reset token, and new password.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters long.', 'error');
      return;
    }

    setLoading(true);
    const res = await resetPassword(email, resetToken, newPassword);
    setLoading(false);

    if (res.success) {
      showToast('Password reset successfully! Please log in.', 'success');
      setPassword(newPassword);
      setActiveTab('login');
    } else {
      showToast(res.message || 'Reset failed. Token may be invalid.', 'error');
    }
  };


  const pwdStrength = getPasswordStrength(password || newPassword);

  return (
    <div className="min-h-[88vh] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[var(--bg-primary)] via-slate-900 to-[var(--bg-secondary)] relative">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="w-full max-w-xl">
        {/* Card Container */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-700/50 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 mb-4 shadow-lg">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent">
              {activeTab === 'login' && 'System Portal Authentication'}
              {activeTab === 'register' && 'Create Student Account'}
              {activeTab === 'forgot' && 'Forgot Password Recovery'}
              {activeTab === 'reset' && 'Reset Account Password'}
            </h1>
            <p className="text-slate-400 text-sm mt-2">
              Role-Based Access Control System with DNN Predictive Intelligence
            </p>
          </div>


          {/* Navigation Tabs */}
          <div className="flex rounded-xl bg-slate-800/80 p-1 border border-slate-700/60 mb-6 text-sm font-medium">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 ${
                activeTab === 'login'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-4 h-4" /> Sign In
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 ${
                activeTab === 'register'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" /> Register
            </button>
          </div>

          {/* LOGIN FORM */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Email Address or Register Number
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="REG20250001 or student@college.edu"
                    className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveTab('forgot')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 transition"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  <span>Remember me on this device</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-600/30 hover:opacity-95 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-5 h-5" /> Authenticate & Access Portal
                  </>
                )}
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Account Role</label>
                <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center justify-between">
                  <span>🎓 Student Account</span>
                  <span className="text-[10px] text-slate-400">Admin accounts provisioned by System Admins</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Johnson"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@college.edu"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full py-2.5 px-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">Information Tech</option>
                    <option value="Electronics & Comm">Electronics & Comm</option>
                    <option value="Mechanical Eng">Mechanical Eng</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(Number(e.target.value))}
                    className="w-full py-2.5 px-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${pwdStrength.color}`}
                        style={{ width: `${(pwdStrength.score / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-slate-400">{pwdStrength.label}</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-600/30 hover:opacity-95 transition flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" /> Complete Registration
                  </>
                )}
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {activeTab === 'forgot' && (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <p className="text-slate-300 text-xs leading-relaxed">
                Enter your registered college email address below. The system will generate a secure reset token for account recovery.
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Registered Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@college.edu"
                    className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-500 transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <KeyRound className="w-5 h-5" /> Generate Recovery Token
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  ← Back to Login
                </button>
              </div>
            </form>
          )}

          {/* RESET PASSWORD FORM */}
          {activeTab === 'reset' && (
            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              {generatedDemoToken && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-300">
                  <strong>Demo Token Auto-Filled:</strong> {generatedDemoToken}
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Registered Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@college.edu"
                  className="w-full py-2.5 px-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Reset Token</label>
                <input
                  type="text"
                  required
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  placeholder="Paste reset token string"
                  className="w-full py-2.5 px-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 6 chars)"
                  className="w-full py-2.5 px-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-purple-600 text-white font-semibold shadow-lg hover:bg-purple-500 transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" /> Reset & Save Password
                  </>
                )}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
