import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ChevronRight, 
  User, 
  Bell, 
  Lock, 
  Settings, 
  LogOut, 
  Info,
  Check, 
  Eye, 
  EyeOff,
  Sun,
  Moon,
  GraduationCap,
  Megaphone,
  Calendar,
  FileText,
  Image as ImageIcon,
  HelpCircle,
  X,
  CheckCircle2
} from 'lucide-react';
import { ScreenType } from './ParentDashboardView';
import aaravAvatarDefault from '../assets/images/aarav_avatar.png';
import { ScreenHeader } from './ScreenHeader';
import { VerifiedAvatarBadge } from './VerifiedAvatarBadge';

export const StudentProfileSettingsView: React.FC<{
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
}> = ({ onBack }) => {
  const { currentStudent, logout } = useAuth();

  // Active subpage navigation
  const [activeSubpage, setActiveSubpage] = useState<
    'main' | 'profile-info' | 'announcements' | 'change-password' | 'app-settings'
  >('main');

  // Logout modal state
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Announcement Preferences state
  const [announcementPrefs, setAnnouncementPrefs] = useState({
    academic: true,
    general: true,
    events: true,
    homework: true,
    media: false,
  });

  // Change Password state
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  // App Settings state
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  // Help & Support and Terms & Policy modals state
  const [activeSettingsModal, setActiveSettingsModal] = useState<'support' | 'terms' | null>(null);
  const [supportChannel, setSupportChannel] = useState<'menu' | 'it' | 'academic'>('menu');
  const [supportSubmitted, setSupportSubmitted] = useState(false);

  // Student Info derivation
  const studentName = currentStudent?.name || 'Aarav Sharma';
  const studentGrade = currentStudent?.grade || 'Class 6';
  const studentSection = currentStudent?.section || 'Section A';
  const studentRollNo = currentStudent?.rollNumber || '6001';
  const studentAvatar = currentStudent?.avatar || aaravAvatarDefault;
  const studentId = currentStudent?.id 
    ? (currentStudent.id.startsWith('STU') ? currentStudent.id : `STU${currentStudent.rollNumber || '6001'}`)
    : 'STU6001';

  const cleanGrade = studentGrade.replace(/Class\s*/i, '').trim() || '6';
  const cleanSection = studentSection.replace(/Section\s*/i, '').trim() || 'A';

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');

    if (!currentPw) {
      setPwError('Please enter your current password.');
      return;
    }
    if (newPw.length < 8) {
      setPwError('New password must be at least 8 characters long.');
      return;
    }
    if (newPw !== confirmPw) {
      setPwError('New password and confirm password do not match.');
      return;
    }

    setPwSuccess('Password updated successfully.');
    setTimeout(() => {
      setPwSuccess('');
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
      setActiveSubpage('main');
    }, 1500);
  };

  const toggleAnnouncement = (key: keyof typeof announcementPrefs) => {
    setAnnouncementPrefs(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  /* ========================================================
   * REUSABLE STUDENT IDENTITY CARD (Used on Main & Profile Info)
   * ======================================================== */
  const renderIdentityCard = () => (
    <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 flex items-center gap-4 shadow-2xs w-full">
      <div className="relative w-16 h-16 rounded-full shrink-0">
        <div className="w-full h-full rounded-full overflow-hidden border border-neutral-200/80 bg-neutral-100 flex items-center justify-center">
          <img
            src={studentAvatar}
            alt={studentName}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = aaravAvatarDefault;
            }}
          />
        </div>
        <VerifiedAvatarBadge size="md" />
      </div>
      <div className="flex flex-col justify-center min-w-0 flex-1">
        <h2 className="text-base font-bold text-black leading-tight truncate text-left">{studentName}</h2>
        <p className="text-xs text-neutral-500 mt-1 leading-normal text-left">{studentGrade} - {studentSection}</p>
        <p className="text-xs text-neutral-500 mt-0.5 leading-normal text-left">Roll No: {studentRollNo}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-full bg-white text-black flex flex-col font-sans pb-24 selection:bg-black selection:text-white">

      {/* ========================================================
       * SCREEN 1: PROFILE & SETTINGS (Main Menu)
       * ======================================================== */}
      {activeSubpage === 'main' && (
        <>
          {/* Header */}
          <ScreenHeader
            title="Profile & Settings"
            onBack={onBack}
            backAriaLabel="Back to Home"
          />

          {/* Student Identity Card */}
          <div className="px-5 pt-4">
            {renderIdentityCard()}
          </div>

          {/* Settings Menu Cards (5 monochrome cards) */}
          <div className="px-5 pt-4 space-y-3">
            {/* 1. Profile Information */}
            <div
              onClick={() => setActiveSubpage('profile-info')}
              className="bg-white border border-neutral-200/90 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs hover:border-neutral-400 cursor-pointer transition-all active:scale-[0.99]"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-2xl bg-neutral-100 text-neutral-800 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-black leading-tight">Profile Information</h3>
                  <p className="text-[11px] text-neutral-400 mt-0.5">View your details</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </div>

            {/* 2. Announcement Preferences */}
            <div
              onClick={() => setActiveSubpage('announcements')}
              className="bg-white border border-neutral-200/90 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs hover:border-neutral-400 cursor-pointer transition-all active:scale-[0.99]"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-2xl bg-neutral-100 text-neutral-800 flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-black leading-tight">Announcement Preferences</h3>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Manage your announcements</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </div>

            {/* 3. Change Password */}
            <div
              onClick={() => setActiveSubpage('change-password')}
              className="bg-white border border-neutral-200/90 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs hover:border-neutral-400 cursor-pointer transition-all active:scale-[0.99]"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-2xl bg-neutral-100 text-neutral-800 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-black leading-tight">Change Password</h3>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Update your password</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </div>

            {/* 4. App Settings */}
            <div
              onClick={() => setActiveSubpage('app-settings')}
              className="bg-white border border-neutral-200/90 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs hover:border-neutral-400 cursor-pointer transition-all active:scale-[0.99]"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-2xl bg-neutral-100 text-neutral-800 flex items-center justify-center shrink-0">
                  <Settings className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-black leading-tight">App Settings</h3>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Theme and language preferences</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </div>

            {/* 5. Help & Support */}
            <div
              onClick={() => {
                setActiveSettingsModal('support');
                setSupportChannel('menu');
                setSupportSubmitted(false);
              }}
              className="bg-white border border-neutral-200/90 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs hover:border-neutral-400 cursor-pointer transition-all active:scale-[0.99]"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-2xl bg-neutral-100 text-neutral-800 flex items-center justify-center shrink-0">
                  <HelpCircle className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-black leading-tight">Help & Support</h3>
                  <p className="text-[11px] text-neutral-400 mt-0.5">FAQs and contact support</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </div>

            {/* 6. Terms & Policy */}
            <div
              onClick={() => setActiveSettingsModal('terms')}
              className="bg-white border border-neutral-200/90 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs hover:border-neutral-400 cursor-pointer transition-all active:scale-[0.99]"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-2xl bg-neutral-100 text-neutral-800 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-black leading-tight">Terms & Policy</h3>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Read our terms and privacy policy</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </div>

            {/* 7. Logout (Clean monochrome matching reference mockup) */}
            <div
              onClick={() => setIsLogoutModalOpen(true)}
              className="bg-white border border-neutral-200/90 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs hover:border-neutral-400 cursor-pointer transition-all active:scale-[0.99]"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-2xl bg-neutral-100 text-neutral-800 flex items-center justify-center shrink-0">
                  <LogOut className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-black leading-tight">Logout</h3>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Sign out from this account</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </div>
          </div>
        </>
      )}

      {/* ========================================================
       * SCREEN 2: PROFILE INFORMATION
       * ======================================================== */}
      {activeSubpage === 'profile-info' && (
        <>
          {/* Header */}
          <ScreenHeader
            title="Profile Information"
            onBack={() => setActiveSubpage('main')}
            backAriaLabel="Back to Settings"
          />

          {/* Page Content: Identity Card, Details Card, and Information Notice */}
          <div className="px-5 pt-3.5 space-y-3.5">
            {/* Student Identity Card */}
            {renderIdentityCard()}

            {/* Profile Details Card */}
            <div className="bg-white border border-neutral-200/90 rounded-2xl px-4 shadow-2xs divide-y divide-neutral-100 w-full">
              <div className="flex items-center justify-between py-3 min-h-[44px] gap-3">
                <span className="text-xs text-neutral-400 font-medium shrink-0 text-left">Student ID</span>
                <span className="text-xs font-semibold text-black text-right break-words max-w-[65%]">{studentId}</span>
              </div>
              <div className="flex items-center justify-between py-3 min-h-[44px] gap-3">
                <span className="text-xs text-neutral-400 font-medium shrink-0 text-left">Date of Birth</span>
                <span className="text-xs font-semibold text-black text-right break-words max-w-[65%]">14 Apr 2013</span>
              </div>
              <div className="flex items-center justify-between py-3 min-h-[44px] gap-3">
                <span className="text-xs text-neutral-400 font-medium shrink-0 text-left">Class</span>
                <span className="text-xs font-semibold text-black text-right break-words max-w-[65%]">{cleanGrade}</span>
              </div>
              <div className="flex items-center justify-between py-3 min-h-[44px] gap-3">
                <span className="text-xs text-neutral-400 font-medium shrink-0 text-left">Section</span>
                <span className="text-xs font-semibold text-black text-right break-words max-w-[65%]">{cleanSection}</span>
              </div>
              <div className="flex items-center justify-between py-3 min-h-[44px] gap-3">
                <span className="text-xs text-neutral-400 font-medium shrink-0 text-left">Roll Number</span>
                <span className="text-xs font-semibold text-black text-right break-words max-w-[65%]">{studentRollNo}</span>
              </div>
              <div className="flex items-center justify-between py-3 min-h-[44px] gap-3">
                <span className="text-xs text-neutral-400 font-medium shrink-0 text-left">Academic Year</span>
                <span className="text-xs font-semibold text-black text-right break-words max-w-[65%]">2025 - 2026</span>
              </div>
              <div className="flex items-center justify-between py-3 min-h-[44px] gap-3">
                <span className="text-xs text-neutral-400 font-medium shrink-0 text-left">Gender</span>
                <span className="text-xs font-semibold text-black text-right break-words max-w-[65%]">Male</span>
              </div>
              <div className="flex items-center justify-between py-3 min-h-[44px] gap-3">
                <span className="text-xs text-neutral-400 font-medium shrink-0 text-left">Phone</span>
                <span className="text-xs font-semibold text-black text-right break-words max-w-[65%]">Not Provided</span>
              </div>
              <div className="flex items-center justify-between py-3 min-h-[44px] gap-3">
                <span className="text-xs text-neutral-400 font-medium shrink-0 text-left">Address</span>
                <span className="text-xs font-semibold text-black text-right break-words max-w-[65%]">Not Provided</span>
              </div>
            </div>

            {/* Information Notice */}
            <div className="bg-neutral-50 border border-neutral-200/70 rounded-2xl p-4 flex items-start gap-3 w-full">
              <Info className="w-4 h-4 text-neutral-700 shrink-0 mt-[1.5px]" />
              <p className="text-[11px] text-neutral-600 leading-relaxed text-left flex-1">
                Profile information is managed by the administration team. For any changes, please reach out to the administration team.
              </p>
            </div>
          </div>
        </>
      )}

      {/* ========================================================
       * SCREEN 3: ANNOUNCEMENT PREFERENCES
       * ======================================================== */}
      {activeSubpage === 'announcements' && (
        <>
          {/* Header */}
          <ScreenHeader
            title="Announcement Preferences"
            onBack={() => setActiveSubpage('main')}
            backAriaLabel="Back to Settings"
          />

          {/* 5 Toggle Cards */}
          <div className="px-5 pt-4 space-y-3">
            {/* Card 1: Academic Announcements */}
            <div className="bg-white border border-neutral-200/90 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs">
              <div className="flex items-center space-x-3.5 pr-2">
                <div className="w-10 h-10 rounded-2xl bg-neutral-100 text-neutral-800 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-black leading-tight">Academic Announcements</h3>
                  <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">Exam schedules, results and academic announcements.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleAnnouncement('academic')}
                className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 shrink-0 ${
                  announcementPrefs.academic ? 'bg-black' : 'bg-neutral-200'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                    announcementPrefs.academic ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Card 2: General Announcements */}
            <div className="bg-white border border-neutral-200/90 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs">
              <div className="flex items-center space-x-3.5 pr-2">
                <div className="w-10 h-10 rounded-2xl bg-neutral-100 text-neutral-800 flex items-center justify-center shrink-0">
                  <Megaphone className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-black leading-tight">General Announcements</h3>
                  <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">Important school news and updates.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleAnnouncement('general')}
                className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 shrink-0 ${
                  announcementPrefs.general ? 'bg-black' : 'bg-neutral-200'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                    announcementPrefs.general ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Card 3: Events & Activities */}
            <div className="bg-white border border-neutral-200/90 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs">
              <div className="flex items-center space-x-3.5 pr-2">
                <div className="w-10 h-10 rounded-2xl bg-neutral-100 text-neutral-800 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-black leading-tight">Events & Activities</h3>
                  <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">Sports, cultural events and other activities.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleAnnouncement('events')}
                className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 shrink-0 ${
                  announcementPrefs.events ? 'bg-black' : 'bg-neutral-200'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                    announcementPrefs.events ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Card 4: Homework Announcements */}
            <div className="bg-white border border-neutral-200/90 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs">
              <div className="flex items-center space-x-3.5 pr-2">
                <div className="w-10 h-10 rounded-2xl bg-neutral-100 text-neutral-800 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-black leading-tight">Homework Announcements</h3>
                  <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">Updates about homework and assignments.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleAnnouncement('homework')}
                className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 shrink-0 ${
                  announcementPrefs.homework ? 'bg-black' : 'bg-neutral-200'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                    announcementPrefs.homework ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Card 5: Media & Gallery Announcements */}
            <div className="bg-white border border-neutral-200/90 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs">
              <div className="flex items-center space-x-3.5 pr-2">
                <div className="w-10 h-10 rounded-2xl bg-neutral-100 text-neutral-800 flex items-center justify-center shrink-0">
                  <ImageIcon className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-black leading-tight">Media & Gallery Announcements</h3>
                  <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">Photos and videos from school events.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleAnnouncement('media')}
                className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 shrink-0 ${
                  announcementPrefs.media ? 'bg-black' : 'bg-neutral-200'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                    announcementPrefs.media ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </>
      )}

      {/* ========================================================
       * SCREEN 4: CHANGE PASSWORD
       * ======================================================== */}
      {activeSubpage === 'change-password' && (
        <>
          {/* Header */}
          <ScreenHeader
            title="Change Password"
            onBack={() => setActiveSubpage('main')}
            backAriaLabel="Back to Settings"
          />

          <form onSubmit={handlePasswordSubmit} className="px-5 pt-4 space-y-4">
            {pwError && (
              <div className="p-3 bg-neutral-100 border border-neutral-300 rounded-xl text-xs text-neutral-800 font-medium">
                {pwError}
              </div>
            )}
            {pwSuccess && (
              <div className="p-3 bg-neutral-900 text-white rounded-xl text-xs font-medium">
                {pwSuccess}
              </div>
            )}

            {/* Current Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-black">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPw ? 'text' : 'password'}
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  placeholder="Enter your current password"
                  className="w-full px-3.5 py-3 rounded-xl border border-neutral-200 text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:border-black pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPw(!showCurrentPw)}
                  className="absolute right-3 top-3 text-neutral-400 hover:text-black"
                >
                  {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-black">New Password</label>
              <div className="relative">
                <input
                  type={showNewPw ? 'text' : 'password'}
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-3.5 py-3 rounded-xl border border-neutral-200 text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:border-black pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPw(!showNewPw)}
                  className="absolute right-3 top-3 text-neutral-400 hover:text-black"
                >
                  {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-black">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPw ? 'text' : 'password'}
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-3.5 py-3 rounded-xl border border-neutral-200 text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:border-black pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPw(!showConfirmPw)}
                  className="absolute right-3 top-3 text-neutral-400 hover:text-black"
                >
                  {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Password Requirements Box */}
            <div className="bg-neutral-50 border border-neutral-200/70 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center space-x-2.5 text-xs text-neutral-600">
                <Check className="w-3.5 h-3.5 text-black shrink-0 stroke-[2.5]" />
                <span>Be at least 8 characters long</span>
              </div>
              <div className="flex items-center space-x-2.5 text-xs text-neutral-600">
                <Check className="w-3.5 h-3.5 text-black shrink-0 stroke-[2.5]" />
                <span>Include a mix of letters and numbers</span>
              </div>
              <div className="flex items-center space-x-2.5 text-xs text-neutral-600">
                <Check className="w-3.5 h-3.5 text-black shrink-0 stroke-[2.5]" />
                <span>Not be a commonly used password</span>
              </div>
            </div>

            {/* Action Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-black text-white rounded-xl text-xs font-semibold hover:bg-neutral-900 active:scale-[0.99] transition-all"
            >
              Update Password
            </button>
          </form>
        </>
      )}

      {/* ========================================================
       * SCREEN 5: APP SETTINGS
       * ======================================================== */}
      {activeSubpage === 'app-settings' && (
        <>
          {/* Header matching reference mockup */}
          <ScreenHeader
            title="App Settings"
            subtitle="Manage your app preferences"
            onBack={() => setActiveSubpage('main')}
            backAriaLabel="Back to Settings"
          />

          <div className="px-5 pt-4 space-y-5">
            {/* Section 1: Theme (Preserved existing setting) */}
            <div className="space-y-2.5">
              <h2 className="text-xs font-medium text-neutral-400">Choose your preferred theme</h2>
              
              <div className="space-y-2.5">
                {/* Light Option */}
                <div
                  onClick={() => setTheme('light')}
                  className="bg-white border border-neutral-200/90 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs cursor-pointer hover:border-neutral-400 transition-all"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-800 flex items-center justify-center shrink-0">
                      <Sun className="w-4.5 h-4.5 stroke-[1.8]" />
                    </div>
                    <span className="text-xs font-bold text-black">Light</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                    theme === 'light' ? 'bg-black text-white' : 'border border-neutral-300'
                  }`}>
                    {theme === 'light' && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>

                {/* Dark Option */}
                <div
                  onClick={() => setTheme('dark')}
                  className="bg-white border border-neutral-200/90 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs cursor-pointer hover:border-neutral-400 transition-all"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-800 flex items-center justify-center shrink-0">
                      <Moon className="w-4.5 h-4.5 stroke-[1.8]" />
                    </div>
                    <span className="text-xs font-bold text-black">Dark</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                    theme === 'dark' ? 'bg-black text-white' : 'border border-neutral-300'
                  }`}>
                    {theme === 'dark' && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Language (Preserved existing setting) */}
            <div className="space-y-2.5">
              <h2 className="text-xs font-medium text-neutral-400">Choose your language</h2>

              <div className="space-y-2.5">
                {/* English Option */}
                <div
                  onClick={() => setLanguage('en')}
                  className="bg-white border border-neutral-200/90 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs cursor-pointer hover:border-neutral-400 transition-all"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-800 flex items-center justify-center font-bold text-xs shrink-0">
                      A/A
                    </div>
                    <span className="text-xs font-bold text-black">English</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                    language === 'en' ? 'bg-black text-white' : 'border border-neutral-300'
                  }`}>
                    {language === 'en' && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>

                {/* Hindi Option */}
                <div
                  onClick={() => setLanguage('hi')}
                  className="bg-white border border-neutral-200/90 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs cursor-pointer hover:border-neutral-400 transition-all"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-800 flex items-center justify-center font-bold text-xs shrink-0">
                      अ/रा
                    </div>
                    <span className="text-xs font-bold text-black">Hindi</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                    language === 'hi' ? 'bg-black text-white' : 'border border-neutral-300'
                  }`}>
                    {language === 'hi' && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </>
      )}

      {/* ========================================================
       * SCREEN 6: LOGOUT CONFIRMATION MODAL
       * ======================================================== */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-5 animate-in fade-in">
          <div className="w-full max-w-xs bg-white rounded-3xl p-6 text-center space-y-4 shadow-2xl border border-neutral-100">
            {/* Top icon in monochrome neutral rounded box */}
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-black flex items-center justify-center mx-auto">
              <LogOut className="w-5 h-5 stroke-[1.8]" />
            </div>

            <div>
              <h3 className="text-base font-bold text-black leading-tight">Logout</h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-[200px] mx-auto">
                Are you sure you want to sign out from this account?
              </p>
            </div>

            <div className="flex items-center space-x-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-neutral-200 text-xs font-semibold text-black bg-white hover:bg-neutral-50 active:scale-[0.99] transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLogoutModalOpen(false);
                  logout();
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-black text-xs font-semibold text-white hover:bg-neutral-900 active:scale-[0.99] transition-all shadow-xs"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
       * SCREEN 7: HELP & SUPPORT MODAL (Students Portal)
       * ======================================================== */}
      {activeSettingsModal === 'support' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white text-black rounded-t-3xl sm:rounded-3xl p-5 space-y-4 shadow-2xl border border-neutral-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-neutral-100 text-neutral-800 flex items-center justify-center shrink-0">
                  <HelpCircle className="w-4.5 h-4.5 stroke-[1.8]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-black leading-tight">Help & Support</h3>
                  <p className="text-[11px] text-neutral-400 mt-0.5">FAQs and contact support</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveSettingsModal(null);
                  setSupportChannel('menu');
                  setSupportSubmitted(false);
                }}
                className="p-1 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-black transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu View: 2 Required Options (IT Help Desk & Academic Coordinator) */}
            {supportChannel === 'menu' && (
              <>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Select a support channel below to get assistance with student portal access or academic questions:
                </p>

                <div className="space-y-2.5">
                  {/* Option 1: IT Help Desk */}
                  <button
                    type="button"
                    onClick={() => {
                      setSupportChannel('it');
                      setSupportSubmitted(false);
                    }}
                    className="w-full p-3.5 bg-neutral-50/70 border border-neutral-200 rounded-2xl flex items-center justify-between text-left transition-all hover:bg-neutral-100 active:scale-[0.99] group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-white border border-neutral-200/80 text-black flex items-center justify-center shrink-0 shadow-2xs">
                        <Lock className="w-4.5 h-4.5 stroke-[1.8]" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-black leading-tight">IT Help Desk</h4>
                        <p className="text-[11px] text-neutral-500 mt-0.5">Portal login, credentials & app assistance</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-black transition-colors" />
                  </button>

                  {/* Option 2: Academic Coordinator */}
                  <button
                    type="button"
                    onClick={() => {
                      setSupportChannel('academic');
                      setSupportSubmitted(false);
                    }}
                    className="w-full p-3.5 bg-neutral-50/70 border border-neutral-200 rounded-2xl flex items-center justify-between text-left transition-all hover:bg-neutral-100 active:scale-[0.99] group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-white border border-neutral-200/80 text-black flex items-center justify-center shrink-0 shadow-2xs">
                        <GraduationCap className="w-4.5 h-4.5 stroke-[1.8]" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-black leading-tight">Academic Coordinator</h4>
                        <p className="text-[11px] text-neutral-500 mt-0.5">Curriculum, syllabus & exam guidance</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-black transition-colors" />
                  </button>
                </div>
              </>
            )}

            {/* Channel View: IT Help Desk */}
            {supportChannel === 'it' && (
              <div className="space-y-3">
                <div className="p-3.5 bg-neutral-50 border border-neutral-200/80 rounded-2xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-black">Greenwood IT Help Desk</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-full">
                      Available
                    </span>
                  </div>
                  <p className="text-neutral-600 text-[11px] leading-relaxed">
                    Assistance with student portal credentials, password updates, mobile app navigation, and technical issues.
                  </p>
                  <div className="pt-1.5 border-t border-neutral-200/60 text-[11px] text-neutral-500 flex justify-between">
                    <span>Operating Hours:</span>
                    <span className="font-medium text-black">Mon – Fri, 8:00 AM – 3:30 PM</span>
                  </div>
                </div>

                {supportSubmitted ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Support ticket #IT-2026-6001 created. The IT team will review it shortly.</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSupportSubmitted(true)}
                    className="w-full py-2.5 bg-black text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition-colors shadow-2xs"
                  >
                    Submit IT Support Request
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSupportChannel('menu')}
                  className="w-full py-1 text-xs font-medium text-neutral-500 hover:text-black text-center"
                >
                  ← Back to Support Channels
                </button>
              </div>
            )}

            {/* Channel View: Academic Coordinator */}
            {supportChannel === 'academic' && (
              <div className="space-y-3">
                <div className="p-3.5 bg-neutral-50 border border-neutral-200/80 rounded-2xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-black">Academic Coordinator Office</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 bg-neutral-200/80 text-neutral-800 rounded-full">
                      Class 6 Coordinator
                    </span>
                  </div>
                  <p className="text-neutral-600 text-[11px] leading-relaxed">
                    Guidance regarding examination schedules, subjects, homework clarification, and academic curriculum queries.
                  </p>
                  <div className="pt-1.5 border-t border-neutral-200/60 text-[11px] text-neutral-500 flex justify-between">
                    <span>Office Hours:</span>
                    <span className="font-medium text-black">Mon – Fri, 8:00 AM – 3:30 PM</span>
                  </div>
                </div>

                {supportSubmitted ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Academic query routed to the Class 6 Coordinator.</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSupportSubmitted(true)}
                    className="w-full py-2.5 bg-black text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition-colors shadow-2xs"
                  >
                    Send Academic Inquiry
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSupportChannel('menu')}
                  className="w-full py-1 text-xs font-medium text-neutral-500 hover:text-black text-center"
                >
                  ← Back to Support Channels
                </button>
              </div>
            )}

            {/* Clearly Visible Close Button */}
            <button
              type="button"
              onClick={() => {
                setActiveSettingsModal(null);
                setSupportChannel('menu');
                setSupportSubmitted(false);
              }}
              className="w-full py-2.5 bg-black text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition-colors shadow-2xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
       * SCREEN 8: TERMS & POLICY MODAL (Students Portal)
       * ======================================================== */}
      {activeSettingsModal === 'terms' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white text-black rounded-t-3xl sm:rounded-3xl p-5 space-y-4 shadow-2xl border border-neutral-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-neutral-100 text-neutral-800 flex items-center justify-center shrink-0">
                  <FileText className="w-4.5 h-4.5 stroke-[1.8]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-black leading-tight">Terms & Policy</h3>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Read our terms and privacy policy</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveSettingsModal(null)}
                className="p-1 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-black transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Policy Content */}
            <div className="max-h-60 overflow-y-auto space-y-3 text-xs text-neutral-600 pr-1 leading-relaxed">
              <div>
                <h4 className="font-bold text-black mb-1">1. Student Terms of Service</h4>
                <p>Welcome to Greenwood International School OS (OFFSLEEK Platform). By accessing the student portal, students agree to use digital school resources responsibly, adhering to school codes of conduct and academic honesty policies.</p>
              </div>
              <div>
                <h4 className="font-bold text-black mb-1">2. Privacy & Data Protection</h4>
                <p>We respect your privacy and protect student records with robust encryption and secure access controls. Data is strictly utilized for academic, administrative, and attendance reporting.</p>
              </div>
              <div>
                <h4 className="font-bold text-black mb-1">3. Account Credentials & Security</h4>
                <p>Students are responsible for maintaining the confidentiality of their login credentials. Never share passwords with other students. Promptly report any suspicious access to the IT Help Desk.</p>
              </div>
              <div>
                <h4 className="font-bold text-black mb-1">4. Acceptable Digital Use</h4>
                <p>This portal is provided solely for educational purposes, accessing timetables, viewing assignments, checking attendance, and requesting official school documents.</p>
              </div>
            </div>

            {/* Required "Understood" Button */}
            <button
              type="button"
              onClick={() => setActiveSettingsModal(null)}
              className="w-full py-2.5 bg-black text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition-colors shadow-2xs"
            >
              Understood
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
