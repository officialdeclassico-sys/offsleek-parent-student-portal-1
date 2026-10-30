import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Student, UserRole } from '../types';
import { apiClient, DEMO_USERS, DEMO_STUDENTS } from '../services/api';

/**
 * Defensive session storage wrapper.
 * Prevents SecurityError / DOMException in restricted sandboxed iframes.
 */
export const safeSession = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window === 'undefined' || !window.sessionStorage) return null;
      return window.sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.setItem(key, value);
      }
    } catch {
      // storage unavailable or quota exceeded
    }
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.removeItem(key);
      }
    } catch {
      // ignore
    }
  },
  clear: (): void => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.clear();
      }
    } catch {
      // ignore
    }
  }
};

interface AuthContextType {
  user: User | null;
  token: string | null;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  currentStudent: Student | null;
  linkedStudents: Student[];
  switchStudent: (studentId: string) => void;
  switchRole: () => void;
  linkChild: (studentIdOrRoll: string, dob: string) => Promise<{ success: boolean; message: string; student?: Student }>;
  unlinkChild: (studentId: string) => Promise<{ success: boolean; message: string }>;
  login: (email: string, role: UserRole) => Promise<void>;
  logout: () => void;
  recoverPassword: (email: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Safe initial user retrieval with guaranteed demo user fallback for instantaneous preview
  const [user, setUser] = useState<User | null>(() => {
    try {
      if (safeSession.getItem('offsleek_logged_out') === 'true') {
        return null;
      }
      const saved = safeSession.getItem('offsleek_auth_user');
      if (saved && saved !== 'undefined' && saved !== 'null') {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.id) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved user from storage:', e);
    }
    // Default to Priya Sharma (Parent) for immediate live preview if not explicitly logged out
    return safeSession.getItem('offsleek_logged_out') === 'true' ? null : DEMO_USERS[0];
  });

  const [token, setToken] = useState<string | null>(() => {
    try {
      if (safeSession.getItem('offsleek_logged_out') === 'true') {
        return null;
      }
      const saved = safeSession.getItem('offsleek_auth_token');
      if (saved && saved !== 'undefined' && saved !== 'null') {
        return saved;
      }
    } catch {
      // ignore
    }
    return safeSession.getItem('offsleek_logged_out') === 'true' ? null : DEMO_USERS[0].token;
  });

  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

  // Pre-seed students so currentStudent is never null during initial mount
  const [students, setStudents] = useState<Student[]>(() => {
    const initialUser = DEMO_USERS[0];
    const linked = DEMO_STUDENTS.filter(s => initialUser.linkedStudentIds.includes(s.id));
    return linked.length > 0 ? linked : DEMO_STUDENTS;
  });

  const [currentStudentId, setCurrentStudentId] = useState<string | null>(() => {
    return DEMO_STUDENTS[0]?.id || 'std_aarav';
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Keep storage in sync safely
  useEffect(() => {
    if (user && token) {
      safeSession.setItem('offsleek_auth_user', JSON.stringify(user));
      safeSession.setItem('offsleek_auth_token', token);
      fetchStudents();
    } else {
      safeSession.removeItem('offsleek_auth_user');
      safeSession.removeItem('offsleek_auth_token');
    }
  }, [user?.id, token, isDemoMode]);

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient<Student[]>('/portal/students', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      }, isDemoMode);
      
      const safeData = Array.isArray(data) ? data : DEMO_STUDENTS;
      const userLinkedIds = Array.isArray(user?.linkedStudentIds) ? user.linkedStudentIds : ['std_aarav'];

      // Filter students according to linkedStudentIds (Backend authorization enforcement)
      const authorizedStudents = user?.role === 'parent'
        ? safeData.filter(s => userLinkedIds.includes(s.id))
        : safeData.filter(s => userLinkedIds.includes(s.id) || s.id === userLinkedIds[0]);

      const finalStudents = authorizedStudents.length > 0 ? authorizedStudents : [DEMO_STUDENTS[0]];

      setStudents(finalStudents);
      if (finalStudents.length > 0 && (!currentStudentId || !finalStudents.some(s => s.id === currentStudentId))) {
        setCurrentStudentId(finalStudents[0].id);
      }
    } catch (err: any) {
      console.warn('Error fetching student data:', err);
      if (isDemoMode) {
        const userLinkedIds = Array.isArray(user?.linkedStudentIds) ? user.linkedStudentIds : ['std_aarav'];
        const fallback = DEMO_STUDENTS.filter(s => userLinkedIds.includes(s.id));
        setStudents(fallback.length > 0 ? fallback : [DEMO_STUDENTS[0]]);
      } else {
        setError(err?.message || 'Failed to connect to backend server. Please verify connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, role: UserRole) => {
    setLoading(true);
    setError(null);
    try {
      // Clear explicit logout flag and ensure user lands on Home ('dashboard')
      safeSession.removeItem('offsleek_logged_out');
      safeSession.setItem(`offsleek_screen_${role}`, 'dashboard');

      if (isDemoMode) {
        // Find matching demo user or fallback by role
        const matched = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === role)
          || DEMO_USERS.find(u => u.role === role)
          || DEMO_USERS[0];

        setUser(matched);
        setToken(matched.token);
        safeSession.setItem('offsleek_auth_user', JSON.stringify(matched));
        safeSession.setItem('offsleek_auth_token', matched.token);

        const linked = DEMO_STUDENTS.filter(s => (matched.linkedStudentIds || []).includes(s.id));
        const finalStudents = linked.length > 0 ? linked : [DEMO_STUDENTS[0]];
        setStudents(finalStudents);
        setCurrentStudentId(finalStudents[0].id);
      } else {
        // Production API login call
        const res = await apiClient<{ user: User; token: string }>('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, role })
        }, false);
        setUser(res.user);
        setToken(res.token);
        safeSession.setItem('offsleek_auth_user', JSON.stringify(res.user));
        safeSession.setItem('offsleek_auth_token', res.token);
        await fetchStudents();
      }
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setStudents([]);
    setCurrentStudentId(null);
    safeSession.clear();
    // Persist explicit logged-out state so refreshing keeps the user on login screen
    safeSession.setItem('offsleek_logged_out', 'true');
  };

  const switchRole = () => {
    if (user?.role === 'parent') {
      const studentUser = DEMO_USERS.find(u => u.role === 'student') || DEMO_USERS[1];
      setUser(studentUser);
      setToken(studentUser.token);
      const linked = DEMO_STUDENTS.filter(s => (studentUser.linkedStudentIds || []).includes(s.id));
      const finalStudents = linked.length > 0 ? linked : [DEMO_STUDENTS[0]];
      setStudents(finalStudents);
      setCurrentStudentId(finalStudents[0].id);
      safeSession.setItem('offsleek_auth_user', JSON.stringify(studentUser));
      safeSession.setItem('offsleek_auth_token', studentUser.token);
      safeSession.setItem('offsleek_screen_student', 'dashboard');
    } else {
      const parentUser = DEMO_USERS.find(u => u.role === 'parent') || DEMO_USERS[0];
      setUser(parentUser);
      setToken(parentUser.token);
      const linked = DEMO_STUDENTS.filter(s => (parentUser.linkedStudentIds || []).includes(s.id));
      const finalStudents = linked.length > 0 ? linked : DEMO_STUDENTS;
      setStudents(finalStudents);
      setCurrentStudentId(finalStudents[0].id);
      safeSession.setItem('offsleek_auth_user', JSON.stringify(parentUser));
      safeSession.setItem('offsleek_auth_token', parentUser.token);
      safeSession.setItem('offsleek_screen_parent', 'dashboard');
    }
  };

  const recoverPassword = async (email: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(r => setTimeout(r, 600));
      return true;
    } catch (err: any) {
      setError(err?.message || 'Password recovery failed.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const switchStudent = (studentId: string) => {
    const userLinkedIds = Array.isArray(user?.linkedStudentIds) ? user.linkedStudentIds : [];
    if (user?.role === 'parent' && userLinkedIds.length > 0 && !userLinkedIds.includes(studentId)) {
      setError('Unauthorized access to unlinked student profile.');
      return;
    }
    setCurrentStudentId(studentId);
  };

  const linkChild = async (
    studentIdOrRoll: string,
    dob: string
  ): Promise<{ success: boolean; message: string; student?: Student }> => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient<{ success: boolean; message: string; student: Student }>(
        '/portal/students/link',
        {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: JSON.stringify({
            studentIdOrRoll,
            dob,
            parentEmail: user?.email || '',
            currentlyLinkedIds: user?.linkedStudentIds || []
          })
        },
        isDemoMode
      );

      if (res.success && res.student) {
        const updatedUser: User = {
          ...user!,
          linkedStudentIds: [...(user?.linkedStudentIds || []), res.student.id]
        };
        setUser(updatedUser);
        safeSession.setItem('offsleek_auth_user', JSON.stringify(updatedUser));
        setStudents(prev => {
          if (prev.some(s => s.id === res.student.id)) return prev;
          return [...prev, res.student];
        });
        return { success: true, message: res.message, student: res.student };
      }
      throw new Error(res.message || 'Failed to link student.');
    } catch (err: any) {
      const msg = err?.message || 'Verification or authorization failed.';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const unlinkChild = async (studentId: string): Promise<{ success: boolean; message: string }> => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient<{ success: boolean; message: string }>(
        '/portal/students/unlink',
        {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: JSON.stringify({
            studentId,
            parentEmail: user?.email || '',
            currentlyLinkedIds: user?.linkedStudentIds || []
          })
        },
        isDemoMode
      );

      if (res.success) {
        const remainingIds = (user?.linkedStudentIds || []).filter(id => id !== studentId);
        const updatedUser: User = {
          ...user!,
          linkedStudentIds: remainingIds
        };
        setUser(updatedUser);
        safeSession.setItem('offsleek_auth_user', JSON.stringify(updatedUser));

        setStudents(prev => {
          const filtered = prev.filter(s => s.id !== studentId);
          if (currentStudentId === studentId && filtered.length > 0) {
            setCurrentStudentId(filtered[0].id);
          }
          return filtered;
        });

        return { success: true, message: res.message };
      }
      throw new Error(res.message || 'Failed to unlink student.');
    } catch (err: any) {
      const msg = err?.message || 'Unlink authorization failed.';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const currentStudent = students.find(s => s.id === currentStudentId) || students[0] || DEMO_STUDENTS[0];
  const linkedStudents = students.length > 0 ? students : DEMO_STUDENTS;

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isDemoMode,
      setIsDemoMode,
      currentStudent,
      linkedStudents,
      switchStudent,
      switchRole,
      linkChild,
      unlinkChild,
      login,
      logout,
      recoverPassword,
      loading,
      error,
      clearError: () => setError(null)
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
