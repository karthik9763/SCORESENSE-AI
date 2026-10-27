import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import SignOutModal from '../components/SignOutModal';

const AuthContext = createContext();

const API_BASE_URL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user_details') || sessionStorage.getItem('user_details');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || sessionStorage.getItem('token') || '';
  });

  const [loading, setLoading] = useState(true);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Configure global Axios authorization header
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  // Pure session destroyer that thoroughly purges all cached authentication data
  const purgeAuthSession = useCallback((options = {}) => {
    const { sessionExpired = false, reason = '' } = options;

    // Send session revocation to backend in background (silent catch)
    try {
      if (token) {
        axios.post(`${API_BASE_URL}/auth/logout`).catch(() => {});
      }
    } catch (e) {}

    // Check if user enabled "Remember Me"
    const isRememberMe = localStorage.getItem('remember_me') === 'true';
    const rememberedId = localStorage.getItem('remembered_identifier');

    // Wipe all sensitive auth data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user_details');
    localStorage.removeItem('last_auth_time');

    // Wipe all sensitive auth data from sessionStorage
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user_details');

    // Preserve ONLY login preference if remember me was enabled
    if (isRememberMe && rememberedId) {
      localStorage.setItem('remember_me', 'true');
      localStorage.setItem('remembered_identifier', rememberedId);
    } else {
      localStorage.removeItem('remember_me');
      localStorage.removeItem('remembered_identifier');
    }

    // If session expired, record notification for login page
    if (sessionExpired) {
      sessionStorage.setItem(
        'session_expired_notice',
        reason || 'Session expired. Please login again.'
      );
    }

    // Reset Axios defaults
    delete axios.defaults.headers.common['Authorization'];

    // Reset Context state
    setToken('');
    setUser(null);
    setIsLogoutModalOpen(false);

    // Prevent browser Back button from navigating back to cached/protected dashboard pages
    try {
      if (typeof window !== 'undefined' && window.history) {
        window.history.replaceState(null, '', '/login');
      }
    } catch (e) {}
  }, [token]);

  // Open confirmation dialog before logout
  const openLogoutModal = useCallback(() => {
    setIsLogoutModalOpen(true);
  }, []);

  // Close confirmation dialog
  const closeLogoutModal = useCallback(() => {
    setIsLogoutModalOpen(false);
  }, []);

  // User confirms sign out in modal
  const confirmLogout = useCallback(() => {
    purgeAuthSession({ sessionExpired: false });
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }, [purgeAuthSession]);

  // Direct logout method (opens modal by default, or forces logout if showConfirm=false)
  const logout = useCallback((forceDirect = false) => {
    if (forceDirect) {
      purgeAuthSession({ sessionExpired: false });
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } else {
      openLogoutModal();
    }
  }, [openLogoutModal, purgeAuthSession]);

  // Global Axios 401 Interceptor to automatically handle Session Expiration
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          const requestUrl = error.config?.url || '';
          // Avoid intercepting deliberate credential failures on login or register routes
          if (!requestUrl.includes('/auth/login') && !requestUrl.includes('/auth/register')) {
            console.warn('Session expired or unauthorized request detected (401). Triggering automatic signout.');
            purgeAuthSession({
              sessionExpired: true,
              reason: 'Session expired. Please login again.'
            });
            if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [purgeAuthSession]);

  // Fetch current authenticated user on load or token change
  useEffect(() => {
    let isMounted = true;
    const fetchCurrentUser = async () => {
      if (!token) {
        if (isMounted) setLoading(false);
        return;
      }

      // Check client-side JWT token expiration if possible
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          if (payload.exp && payload.exp * 1000 < Date.now()) {
            console.warn('JWT token has expired based on expiration timestamp.');
            purgeAuthSession({ sessionExpired: true, reason: 'Session expired. Please login again.' });
            if (isMounted) setLoading(false);
            return;
          }
        }
      } catch (e) {}

      try {
        const res = await axios.get(`${API_BASE_URL}/auth/me`);
        if (res.data.success && isMounted) {
          setUser(res.data.user);
        } else {
          purgeAuthSession({ sessionExpired: true });
        }
      } catch (err) {
        console.warn('Auth token verification notice:', err.message);
        if (err.response?.status === 401) {
          purgeAuthSession({ sessionExpired: true, reason: 'Session expired. Please login again.' });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCurrentUser();
    return () => {
      isMounted = false;
    };
  }, [token, purgeAuthSession]);

  const login = async (email, password, rememberMe = true) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      if (res.data.success) {
        const newToken = res.data.token;
        const userData = res.data.user;

        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('token', newToken);
        storage.setItem('user_details', JSON.stringify(userData));

        if (rememberMe) {
          localStorage.setItem('remember_me', 'true');
          localStorage.setItem('remembered_identifier', email);
        } else {
          localStorage.removeItem('remember_me');
          localStorage.removeItem('remembered_identifier');
        }

        setToken(newToken);
        setUser(userData);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        return { success: true, user: userData };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed. Please check your credentials.'
      };
    }
  };

  const register = async (userData) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/register`, userData);
      if (res.data.success) {
        const newToken = res.data.token;
        const newUserData = res.data.user;

        localStorage.setItem('token', newToken);
        localStorage.setItem('user_details', JSON.stringify(newUserData));

        setToken(newToken);
        setUser(newUserData);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        return { success: true, user: newUserData };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed.'
      };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
      return res.data;
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Error processing forgot password request.'
      };
    }
  };

  const resetPassword = async (email, resetToken, newPassword) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/reset-password`, { email, resetToken, newPassword });
      return res.data;
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Error resetting password.'
      };
    }
  };

  const updateUser = (updatedData) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedData };
      if (localStorage.getItem('token')) {
        localStorage.setItem('user_details', JSON.stringify(updated));
      } else {
        sessionStorage.setItem('user_details', JSON.stringify(updated));
      }
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        forgotPassword,
        resetPassword,
        logout,
        openLogoutModal,
        closeLogoutModal,
        confirmLogout,
        isLogoutModalOpen,
        updateUser
      }}
    >
      {children}
      {/* Global Confirmation Modal rendered universally */}
      <SignOutModal
        isOpen={isLogoutModalOpen}
        onClose={closeLogoutModal}
        onConfirm={confirmLogout}
        user={user}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
