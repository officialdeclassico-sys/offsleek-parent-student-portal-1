import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MobileFrame } from './components/MobileFrame';
import { LoginScreen } from './components/LoginScreen';
import { ParentDashboardView, ScreenType } from './components/ParentDashboardView';
import { StudentDashboardView } from './components/StudentDashboardView';
import { MyChildrenView } from './components/MyChildrenView';
import { AttendanceView } from './components/AttendanceView';
import { FeesView } from './components/FeesView';
import { TimetableScheduleView } from './components/TimetableScheduleView';
import { ExamsReportCardsView } from './components/ExamsReportCardsView';
import { StudentResultsView } from './components/StudentResultsView';
import { AnnouncementsFeedView } from './components/AnnouncementsFeedView';
import { StudentAnnouncementsView } from './components/StudentAnnouncementsView';
import { TripsEventsView } from './components/TripsEventsView';
import { DocumentRequestsView } from './components/DocumentRequestsView';
import { ParentLeaveRequestsView } from './components/ParentLeaveRequestsView';
import { StudentRequestsView } from './components/StudentRequestsView';
import { ParentProfileSettingsView } from './components/ParentProfileSettingsView';
import { StudentProfileSettingsView } from './components/StudentProfileSettingsView';
import { NotificationsScreenView } from './components/NotificationsScreenView';
import { StudentCalendarView } from './components/StudentCalendarView';
import { StudentCertificatesView } from './components/StudentCertificatesView';
import { ParentPersonalInfoView } from './components/ParentPersonalInfoView';
import { ParentAppSettingsView } from './components/ParentAppSettingsView';
import { BottomNav } from './components/BottomNav';
import { MoreServicesSheet } from './components/MoreServicesSheet';
import { TestVerificationPanel } from './components/TestVerificationPanel';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AlertCircle } from 'lucide-react';
import { safeSession } from './context/AuthContext';
import { UserRole } from './types';

// Role-based screen authorization validator
export const isValidScreenForRole = (screen: ScreenType, role: UserRole): boolean => {
  if (role === 'student') {
    const studentAllowedScreens: ScreenType[] = [
      'dashboard',
      'exams',
      'announcements',
      'documents',
      'notifications',
      'profile',
      'calendar',
      'certificates'
    ];
    return studentAllowedScreens.includes(screen);
  }
  // Parent allowed screens
  const parentAllowedScreens: ScreenType[] = [
    'dashboard',
    'children',
    'attendance',
    'fees',
    'timetable',
    'exams',
    'announcements',
    'trips',
    'documents',
    'profile',
    'notifications',
    'calendar',
    'certificates',
    'personal-info',
    'app-settings',
    'apply-leave'
  ];
  return parentAllowedScreens.includes(screen);
};

// Retrieve initial screen from storage if valid for this role, else default to 'dashboard' (Home)
const getInitialScreen = (role?: UserRole): ScreenType => {
  if (!role) return 'dashboard';
  try {
    const saved = safeSession.getItem(`offsleek_screen_${role}`);
    if (saved && isValidScreenForRole(saved as ScreenType, role)) {
      return saved as ScreenType;
    }
  } catch {
    // fallback
  }
  return 'dashboard';
};

const PortalMain: React.FC = () => {
  const { user, error, clearError } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<ScreenType>(() => getInitialScreen(user?.role));
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isTestsOpen, setIsTestsOpen] = useState(false);

  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Track previous user to detect fresh sign-in and portal switches
  const prevUserRef = React.useRef<{ id?: string; role?: UserRole } | null>(
    user ? { id: user.id, role: user.role } : null
  );

  // Post-login landing, role switching, and role safety guards
  React.useEffect(() => {
    const prev = prevUserRef.current;
    const current = user ? { id: user.id, role: user.role } : null;

    if (!prev && current) {
      // 1. Fresh login: User lands directly on Home ('dashboard') with Home selected in bottom nav
      setCurrentScreen('dashboard');
      safeSession.setItem(`offsleek_screen_${current.role}`, 'dashboard');
    } else if (prev && current && (prev.role !== current.role || prev.id !== current.id)) {
      // 2. Portal mode or account switch: Land on target portal's Home screen ('dashboard')
      setCurrentScreen('dashboard');
      safeSession.setItem(`offsleek_screen_${current.role}`, 'dashboard');
    } else if (current && !isValidScreenForRole(currentScreen, current.role)) {
      // 3. Authorization safeguard: Redirect unpermitted screens to 'dashboard'
      setCurrentScreen('dashboard');
      safeSession.setItem(`offsleek_screen_${current.role}`, 'dashboard');
    } else if (!current) {
      // 4. Logged out: Ensure subsequent sign-in starts on Home
      setCurrentScreen('dashboard');
    }

    prevUserRef.current = current;
  }, [user?.id, user?.role, currentScreen]);

  // Automatically reset scroll position to top whenever switching screens
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [currentScreen]);

  if (!user) {
    return (
      <MobileFrame>
        <LoginScreen />
      </MobileFrame>
    );
  }

  const isStudent = user.role === 'student';

  const handleNavigate = (screen: ScreenType) => {
    const role = user.role;
    const targetScreen = isValidScreenForRole(screen, role) ? screen : 'dashboard';
    setCurrentScreen(targetScreen);
    safeSession.setItem(`offsleek_screen_${role}`, targetScreen);
  };

  return (
    <MobileFrame>
      <div className="h-full w-full bg-white text-black flex flex-col relative min-h-0 selection:bg-black selection:text-white overflow-hidden">
        
        {/* Backend Error Banner (Safeguard 2) */}
        {error && (
          <div className="bg-red-50 border-b border-red-200 px-4 py-2.5 flex items-center justify-between text-xs text-red-700 z-50 shrink-0">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
            <button
              onClick={clearError}
              className="text-[11px] underline font-medium hover:text-black"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Dynamic Screen Routing - Shared Vertical Scroll Container */}
        <main
          ref={scrollRef}
          className="flex-1 min-h-0 w-full overflow-y-auto overscroll-y-contain scroll-smooth"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <ErrorBoundary onReset={() => handleNavigate('dashboard')}>
            {/* Screen 2: Dashboard */}
            {currentScreen === 'dashboard' && (
              isStudent ? (
                <StudentDashboardView onNavigate={handleNavigate} />
              ) : (
                <ParentDashboardView onNavigate={handleNavigate} />
              )
            )}

            {/* Screen 3: Timetable (Parent/Staff only) */}
            {currentScreen === 'timetable' && !isStudent && (
              <TimetableScheduleView 
                onBack={() => handleNavigate('dashboard')} 
                onSwitchChild={() => handleNavigate('children')}
              />
            )}

            {/* Screen 4: Attendance (Parent only) */}
            {currentScreen === 'attendance' && !isStudent && (
              <AttendanceView 
                onBack={() => handleNavigate('dashboard')} 
                onSwitchChild={() => handleNavigate('children')}
              />
            )}

            {/* Screen 5: Exams & Results */}
            {currentScreen === 'exams' && (
              isStudent ? (
                <StudentResultsView 
                  onBack={() => handleNavigate('dashboard')} 
                  onOpenProfile={() => handleNavigate('profile')}
                />
              ) : (
                <ExamsReportCardsView 
                  onBack={() => handleNavigate('dashboard')} 
                  onSwitchChild={() => handleNavigate('children')}
                  defaultTab="Exam Results"
                />
              )
            )}

            {/* Screen 6: Announcements */}
            {currentScreen === 'announcements' && (
              isStudent ? (
                <StudentAnnouncementsView />
              ) : (
                <AnnouncementsFeedView onBack={() => handleNavigate('dashboard')} />
              )
            )}

            {/* Screen 7: Trips & Events (Parent only) */}
            {currentScreen === 'trips' && !isStudent && (
              <TripsEventsView onBack={() => handleNavigate('dashboard')} />
            )}

            {/* Screen 8: Academic Documents / My Requests */}
            {currentScreen === 'documents' && (
              isStudent ? (
                <StudentRequestsView 
                  onBack={() => handleNavigate('dashboard')} 
                  onNavigate={handleNavigate}
                />
              ) : (
                <ParentLeaveRequestsView onBack={() => handleNavigate('dashboard')} onNavigate={handleNavigate} initialView="main" />
              )
            )}

            {currentScreen === 'apply-leave' && !isStudent && (
              <ParentLeaveRequestsView onBack={() => handleNavigate('dashboard')} onNavigate={handleNavigate} initialView="apply" />
            )}

            {/* Screen 9: Notifications */}
            {currentScreen === 'notifications' && (
              isStudent ? (
                <StudentAnnouncementsView />
              ) : (
                <NotificationsScreenView 
                  onBack={() => handleNavigate('dashboard')} 
                  onOpenProfile={() => handleNavigate('profile')}
                />
              )
            )}

            {/* Screen 10: Profile & Settings */}
            {currentScreen === 'profile' && (
              isStudent ? (
                <StudentProfileSettingsView 
                  onBack={() => handleNavigate('dashboard')} 
                  onNavigate={handleNavigate}
                />
              ) : (
                <ParentProfileSettingsView 
                  onBack={() => handleNavigate('dashboard')} 
                  onNavigate={handleNavigate}
                />
              )
            )}

            {/* Parent-Only Views */}
            {currentScreen === 'children' && !isStudent && (
              <MyChildrenView onBack={() => handleNavigate('profile')} />
            )}

            {currentScreen === 'personal-info' && !isStudent && (
              <ParentPersonalInfoView onBack={() => handleNavigate('profile')} />
            )}

            {currentScreen === 'app-settings' && !isStudent && (
              <ParentAppSettingsView onBack={() => handleNavigate('profile')} />
            )}

            {currentScreen === 'fees' && !isStudent && (
              <FeesView 
                onBack={() => handleNavigate('dashboard')} 
                onSwitchChild={() => handleNavigate('children')}
              />
            )}

            {/* Screen 11: School Calendar */}
            {currentScreen === 'calendar' && (
              <StudentCalendarView onBack={() => handleNavigate('dashboard')} />
            )}

            {/* Screen 12: My Certificates */}
            {currentScreen === 'certificates' && (
              <StudentCertificatesView 
                onBack={() => handleNavigate('dashboard')} 
                onNavigate={handleNavigate}
              />
            )}
          </ErrorBoundary>
        </main>

        {/* Bottom Navigation (5 tabs for Student, 4 tabs for Parent) */}
        <BottomNav
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          onOpenMore={() => setIsMoreOpen(true)}
        />

        {/* More Services Bottom Sheet */}
        <MoreServicesSheet
          isOpen={isMoreOpen}
          onClose={() => setIsMoreOpen(false)}
          onNavigate={handleNavigate}
          onOpenTests={() => setIsTestsOpen(true)}
        />

        {/* Security & Safeguards Test Panel Modal */}
        {isTestsOpen && (
          <TestVerificationPanel onClose={() => setIsTestsOpen(false)} />
        )}

      </div>
    </MobileFrame>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <PortalMain />
    </AuthProvider>
  );
}
