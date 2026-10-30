import React from 'react';
import { Home, FileText, Megaphone, User } from 'lucide-react';
import { ScreenType } from './ParentDashboardView';
import { useAuth } from '../context/AuthContext';

export const BottomNav: React.FC<{
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  onOpenMore?: () => void;
}> = ({ currentScreen, onNavigate }) => {
  const { user } = useAuth();
  const isStudent = user?.role === 'student';

  const isHome = currentScreen === 'dashboard';
  const isAnnouncements = currentScreen === 'announcements' || currentScreen === 'notifications';
  const isRequests = currentScreen === 'documents' || currentScreen === 'apply-leave';
  const isProfile = currentScreen === 'profile' || currentScreen === 'children' || currentScreen === 'personal-info' || currentScreen === 'app-settings';

  if (isStudent) {
    return (
      <nav className="absolute bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-100 pb-safe shadow-xs">
        <div className="max-w-[420px] mx-auto grid grid-cols-4 h-16 items-center px-4">
          {/* 1. Home */}
          <button
            onClick={() => onNavigate('dashboard')}
            className="min-h-[44px] flex flex-col items-center justify-center transition-transform active:scale-95"
            title="Home"
          >
            <div className="w-14 h-7 flex items-center justify-center mb-0.5">
              <Home
                className={`w-5 h-5 transition-colors ${
                  isHome
                    ? 'stroke-[2.4] text-black'
                    : 'stroke-[1.8] text-neutral-500'
                }`}
              />
            </div>
            <span
              className={`text-[10px] tracking-tight transition-colors ${
                isHome ? 'font-bold text-black' : 'font-medium text-neutral-500'
              }`}
            >
              Home
            </span>
          </button>

          {/* 2. Announcements */}
          <button
            onClick={() => onNavigate('announcements')}
            className="min-h-[44px] flex flex-col items-center justify-center transition-transform active:scale-95"
            title="Announcements"
          >
            <div className="w-14 h-7 flex items-center justify-center mb-0.5">
              <Megaphone
                className={`w-5 h-5 transition-colors ${
                  isAnnouncements
                    ? 'stroke-[2.4] text-black'
                    : 'stroke-[1.8] text-neutral-500'
                }`}
              />
            </div>
            <span
              className={`text-[10px] tracking-tight transition-colors ${
                isAnnouncements ? 'font-bold text-black' : 'font-medium text-neutral-500'
              }`}
            >
              Announcements
            </span>
          </button>

          {/* 3. My Requests */}
          <button
            onClick={() => onNavigate('documents')}
            className="min-h-[44px] flex flex-col items-center justify-center transition-transform active:scale-95"
            title="My Requests"
          >
            <div className="w-14 h-7 flex items-center justify-center mb-0.5">
              <FileText
                className={`w-5 h-5 transition-colors ${
                  isRequests
                    ? 'stroke-[2.4] text-black'
                    : 'stroke-[1.8] text-neutral-500'
                }`}
              />
            </div>
            <span
              className={`text-[10px] tracking-tight transition-colors ${
                isRequests ? 'font-bold text-black' : 'font-medium text-neutral-500'
              }`}
            >
              My Requests
            </span>
          </button>

          {/* 4. Profile */}
          <button
            onClick={() => onNavigate('profile')}
            className="min-h-[44px] flex flex-col items-center justify-center transition-transform active:scale-95"
            title="Profile"
          >
            <div className="w-14 h-7 flex items-center justify-center mb-0.5">
              <User
                className={`w-5 h-5 transition-colors ${
                  isProfile
                    ? 'stroke-[2.4] text-black'
                    : 'stroke-[1.8] text-neutral-500'
                }`}
              />
            </div>
            <span
              className={`text-[10px] tracking-tight transition-colors ${
                isProfile ? 'font-bold text-black' : 'font-medium text-neutral-500'
              }`}
            >
              Profile
            </span>
          </button>
        </div>
      </nav>
    );
  }

  // Parent Navigation
  return (
    <nav className="absolute bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-100 pb-safe shadow-xs">
      <div className="max-w-[420px] mx-auto grid grid-cols-4 h-16 items-center px-4">
        {/* 1. Home */}
        <button
          onClick={() => onNavigate('dashboard')}
          className="min-h-[44px] flex flex-col items-center justify-center transition-transform active:scale-95"
          title="Home"
        >
          <div className="w-14 h-7 flex items-center justify-center mb-0.5">
            <Home
              className={`w-5 h-5 transition-colors ${
                isHome
                  ? 'stroke-[2.4] text-black'
                  : 'stroke-[1.8] text-neutral-500'
              }`}
            />
          </div>
          <span
            className={`text-[10px] tracking-tight transition-colors ${
              isHome ? 'font-bold text-black' : 'font-medium text-neutral-500'
            }`}
          >
            Home
          </span>
        </button>

        {/* 2. Announcements */}
        <button
          onClick={() => onNavigate('announcements')}
          className="min-h-[44px] flex flex-col items-center justify-center transition-transform active:scale-95"
          title="Announcements"
        >
          <div className="w-14 h-7 flex items-center justify-center mb-0.5">
            <Megaphone
              className={`w-5 h-5 transition-colors ${
                isAnnouncements
                  ? 'stroke-[2.4] text-black'
                  : 'stroke-[1.8] text-neutral-500'
              }`}
            />
          </div>
          <span
            className={`text-[10px] tracking-tight transition-colors ${
              isAnnouncements ? 'font-bold text-black' : 'font-medium text-neutral-500'
            }`}
          >
            Announcements
          </span>
        </button>

        {/* 3. My Requests */}
        <button
          onClick={() => onNavigate('documents')}
          className="min-h-[44px] flex flex-col items-center justify-center transition-transform active:scale-95"
          title="My Requests"
        >
          <div className="w-14 h-7 flex items-center justify-center mb-0.5">
            <FileText
              className={`w-5 h-5 transition-colors ${
                isRequests
                  ? 'stroke-[2.4] text-black'
                  : 'stroke-[1.8] text-neutral-500'
              }`}
            />
          </div>
          <span
            className={`text-[10px] tracking-tight transition-colors ${
              isRequests ? 'font-bold text-black' : 'font-medium text-neutral-500'
            }`}
          >
            My Requests
          </span>
        </button>

        {/* 4. Profile */}
        <button
          onClick={() => onNavigate('profile')}
          className="min-h-[44px] flex flex-col items-center justify-center transition-transform active:scale-95"
          title="Profile"
        >
          <div className="w-14 h-7 flex items-center justify-center mb-0.5">
            <User
              className={`w-5 h-5 transition-colors ${
                isProfile
                  ? 'stroke-[2.4] text-black'
                  : 'stroke-[1.8] text-neutral-500'
              }`}
            />
          </div>
          <span
            className={`text-[10px] tracking-tight transition-colors ${
              isProfile ? 'font-bold text-black' : 'font-medium text-neutral-500'
            }`}
          >
            Profile
          </span>
        </button>
      </div>
    </nav>
  );
};
