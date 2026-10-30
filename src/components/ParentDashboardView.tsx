import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  CreditCard, 
  BookOpen, 
  Megaphone, 
  ChevronDown, 
  ChevronRight, 
  Award, 
  MapPin, 
  FileText, 
  Check, 
  X,
  Clock,
  Trophy
} from 'lucide-react';
import { Student } from '../types';
import { VerifiedAvatarBadge } from './VerifiedAvatarBadge';
import { formatISTDayAndDate, getISTGreeting, useISTNow } from '../utils/dateTime';

export type ScreenType = 
  | 'dashboard' 
  | 'children' 
  | 'attendance' 
  | 'fees' 
  | 'timetable' 
  | 'exams' 
  | 'announcements' 
  | 'trips' 
  | 'documents' 
  | 'profile' 
  | 'notifications'
  | 'calendar'
  | 'certificates'
  | 'personal-info'
  | 'app-settings'
  | 'apply-leave';

export const ParentDashboardView: React.FC<{
  onNavigate: (screen: ScreenType) => void;
}> = ({ onNavigate }) => {
  const { user, currentStudent, linkedStudents, switchStudent } = useAuth();
  const [isChildModalOpen, setIsChildModalOpen] = useState(false);
  const now = useISTNow(30000);

  const parentName = user?.name || 'Priya Sharma';
  const studentName = currentStudent?.name || 'Aarav Sharma';
  const studentGrade = currentStudent?.grade || 'Class 6';
  const studentSection = currentStudent?.section || 'Section A';
  const studentRollNo = currentStudent?.rollNumber ? (currentStudent.rollNumber === '08' ? '6001' : currentStudent.rollNumber) : '6001';
  const studentAvatar = currentStudent?.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80';

  const schoolName = 'GREENWOOD INTERNATIONAL SCHOOL';
  const schoolTagline = 'Learn • Grow • Belong';

  // Recent announcements matching reference screenshot
  const recentAnnouncements = [
    {
      id: 'ann_1',
      title: 'Parent Teacher Meeting',
      date: '5 Oct 2026',
      snippet: 'PTM will be held on 15th October 2026 from 9:00 AM to 12:00 PM. Please be present...',
    },
    {
      id: 'ann_2',
      title: 'Annual Sports Day',
      date: '3 Oct 2026',
      snippet: 'Join us for the Annual Sports Day celebration on 25th October 2026. All parents are invited...',
    },
  ];

  // Upcoming events matching reference screenshot
  const upcomingEvents = [
    {
      id: 'evt_1',
      day: '15',
      month: 'OCT',
      title: 'Parent Teacher Meeting',
      time: '9:00 AM - 12:00 PM',
    },
    {
      id: 'evt_2',
      day: '25',
      month: 'OCT',
      title: 'Annual Sports Day',
      time: '9:00 AM - 1:00 PM',
    },
    {
      id: 'evt_3',
      day: '10',
      month: 'NOV',
      title: 'Term 2 Exams Begin',
      time: '9:00 AM',
    },
  ];

  return (
    <div className="min-h-full bg-white text-black flex flex-col font-sans pb-24 selection:bg-black selection:text-white">
      {/* 1. School Header Bar */}
      <header className="pt-3 px-5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Greenwood School Emblem SVG */}
          <div className="w-8 h-8 flex items-center justify-center shrink-0">
            <svg
              className="w-7 h-7 text-black"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 22C8 20.5 12 20.5 16 22.5C20 20.5 24 20.5 28 22V8C24 6.5 20 6.5 16 8.5C12 6.5 8 6.5 4 8V22Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 8.5V22.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 3.5V5.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M12 4.5L13.2 6.2"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M20 4.5L18.8 6.2"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M8.5 7L10.2 8.2"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M23.5 7L21.8 8.2"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <h1 className="text-[13px] font-bold text-black tracking-tight leading-tight">
              {schoolName}
            </h1>
            <p className="text-[10px] text-neutral-500 font-medium tracking-wide mt-0.5">
              {schoolTagline}
            </p>
          </div>
        </div>
      </header>

      {/* Main Container Content */}
      <div className="px-5 pt-3.5 space-y-4">
        {/* 2. Greeting Section */}
        <div>
          <p className="text-xs text-neutral-500 font-normal">{getISTGreeting(now)},</p>
          <div className="flex items-center space-x-2 mt-0.5">
            <h2 className="text-2xl font-bold tracking-tight text-black">{parentName}</h2>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">Stay updated with your child's progress</p>
        </div>

        {/* 3. Child Selector Card */}
        <div
          onClick={() => setIsChildModalOpen(true)}
          className="w-full bg-white border border-neutral-200/90 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs hover:border-neutral-300 cursor-pointer transition-all"
        >
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10 rounded-full shrink-0">
              <img
                src={studentAvatar}
                alt={studentName}
                className="w-full h-full rounded-full object-cover border border-neutral-100"
              />
              <VerifiedAvatarBadge size="xs" />
            </div>
            <div className="text-left">
              <div className="flex items-center space-x-1.5">
                <h3 className="text-sm font-bold text-black leading-tight">{studentName}</h3>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">{studentGrade} - {studentSection}</p>
              <p className="text-[10px] text-neutral-400 mt-0.5">Roll No. {studentRollNo}</p>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-neutral-400" />
        </div>

        {/* 4. Today's Overview Section (3 Cards in Grid) */}
        <div className="space-y-2.5">
          <h3 className="text-sm font-bold text-black">Today's Overview</h3>
          <div className="grid grid-cols-3 gap-2.5">
            {/* Card 1: Attendance */}
            <div
              onClick={() => onNavigate('attendance')}
              className="bg-white border border-neutral-100/90 rounded-2xl p-3 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-neutral-300 transition-all cursor-pointer min-h-[115px]"
            >
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 stroke-[1.8]" />
                </div>
                <span className="text-[9px] text-neutral-400 font-medium">{formatISTDayAndDate(now)}</span>
              </div>
              <div className="mt-2">
                <p className="text-[11px] text-neutral-500 font-medium leading-tight">
                  Attendance
                </p>
                <p className="text-base font-bold text-black leading-tight mt-1">
                  Present
                </p>
              </div>
            </div>

            {/* Card 2: Assignments */}
            <div
              onClick={() => onNavigate('timetable')}
              className="bg-white border border-neutral-100/90 rounded-2xl p-3 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-neutral-300 transition-all cursor-pointer min-h-[115px]"
            >
              <div className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 stroke-[1.8]" />
              </div>
              <div className="mt-2">
                <p className="text-[11px] text-neutral-500 font-medium leading-tight">
                  Assignments
                </p>
                <p className="text-base font-bold text-black leading-tight mt-1">
                  2
                </p>
              </div>
            </div>

            {/* Card 3: Timetable */}
            <div
              onClick={() => onNavigate('timetable')}
              className="bg-white border border-neutral-100/90 rounded-2xl p-3 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-neutral-300 transition-all cursor-pointer min-h-[115px]"
            >
              <div className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 stroke-[1.8]" />
              </div>
              <div className="mt-2">
                <p className="text-[11px] text-neutral-500 font-medium leading-tight">
                  Today's Timetable
                </p>
                <p className="text-base font-bold text-black leading-tight mt-1">
                  4 Classes
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Quick Access Section (6 Cards in 2x3 Grid) */}
        <div className="space-y-2.5">
          <h3 className="text-sm font-bold text-black">Quick Access</h3>
          <div className="grid grid-cols-3 gap-2.5">
            {/* Tile 1: Pending Fees */}
            <button
              onClick={() => onNavigate('fees')}
              className="bg-white border border-neutral-100/90 rounded-2xl py-3.5 px-2 flex flex-col items-center justify-center text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-neutral-300 transition-all min-h-[88px] group"
            >
              <CreditCard className="w-5 h-5 text-black stroke-[1.8] group-hover:scale-105 transition-transform" />
              <span className="text-[11px] font-medium text-neutral-900 leading-tight mt-2">
                Pending Fees
              </span>
            </button>

            {/* Tile 2: Apply Leave */}
            <button
              onClick={() => onNavigate('apply-leave')}
              className="bg-white border border-neutral-100/90 rounded-2xl py-3.5 px-2 flex flex-col items-center justify-center text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-neutral-300 transition-all min-h-[88px] group"
            >
              <div className="relative">
                <FileText className="w-5 h-5 text-black stroke-[1.8] group-hover:scale-105 transition-transform" />
                <span className="absolute -bottom-0.5 -right-1 text-[10px] font-bold text-black bg-white rounded-full px-0.5">+</span>
              </div>
              <span className="text-[11px] font-medium text-neutral-900 leading-tight mt-2">
                Apply Leave
              </span>
            </button>

            {/* Tile 3: School Calendar */}
            <button
              onClick={() => onNavigate('calendar')}
              className="bg-white border border-neutral-100/90 rounded-2xl py-3.5 px-2 flex flex-col items-center justify-center text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-neutral-300 transition-all min-h-[88px] group"
            >
              <Calendar className="w-5 h-5 text-black stroke-[1.8] group-hover:scale-105 transition-transform" />
              <span className="text-[11px] font-medium text-neutral-900 leading-tight mt-2">
                School Calendar
              </span>
            </button>

            {/* Tile 4: Certificates */}
            <button
              onClick={() => onNavigate('certificates')}
              className="bg-white border border-neutral-100/90 rounded-2xl py-3.5 px-2 flex flex-col items-center justify-center text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-neutral-300 transition-all min-h-[88px] group"
            >
              <div className="relative">
                <FileText className="w-5 h-5 text-black stroke-[1.8] group-hover:scale-105 transition-transform" />
                <Award className="w-2.5 h-2.5 text-black stroke-[2.2] absolute -bottom-0.5 -right-1 bg-white rounded-full" />
              </div>
              <span className="text-[11px] font-medium text-neutral-900 leading-tight mt-2">
                Certificates
              </span>
            </button>

            {/* Tile 5: Overall Attendance */}
            <button
              onClick={() => onNavigate('attendance')}
              className="bg-white border border-neutral-100/90 rounded-2xl py-3.5 px-2 flex flex-col items-center justify-center text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-neutral-300 transition-all min-h-[88px] group"
            >
              <svg
                className="w-5 h-5 text-black group-hover:scale-105 transition-transform"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
                <path d="M9 15l2 2 4-4" />
              </svg>
              <span className="text-[11px] font-medium text-neutral-900 leading-tight mt-2">
                Overall Attendance
              </span>
            </button>

            {/* Tile 6: Results */}
            <button
              onClick={() => onNavigate('exams')}
              className="bg-white border border-neutral-100/90 rounded-2xl py-3.5 px-2 flex flex-col items-center justify-center text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-neutral-300 transition-all min-h-[88px] group"
            >
              <svg
                className="w-5 h-5 text-black group-hover:scale-105 transition-transform"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M8 18v-3" />
                <path d="M12 18v-5" />
                <path d="M16 18v-7" />
              </svg>
              <span className="text-[11px] font-medium text-neutral-900 leading-tight mt-2">
                Results
              </span>
            </button>
          </div>
        </div>

        {/* 6. Recent Announcements Section */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-black">Recent Announcements</h3>
            <button
              onClick={() => onNavigate('announcements')}
              className="text-xs text-neutral-800 hover:text-black font-semibold underline"
            >
              View All
            </button>
          </div>

          <div className="bg-white border border-neutral-100/90 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] divide-y divide-neutral-100/90 overflow-hidden">
            {recentAnnouncements.map((ann) => (
              <div
                key={ann.id}
                onClick={() => onNavigate('announcements')}
                className="p-3.5 flex items-start gap-3 hover:bg-neutral-50/50 cursor-pointer transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-neutral-100/80 flex items-center justify-center text-neutral-800 shrink-0 mt-0.5">
                  {ann.title.includes('Sports') ? (
                    <Trophy className="w-4 h-4 stroke-[1.8]" />
                  ) : (
                    <Megaphone className="w-4 h-4 stroke-[1.8]" />
                  )}
                </div>
                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-black truncate leading-tight">
                      {ann.title}
                    </h4>
                    <span className="text-[11px] text-neutral-400 shrink-0 tabular-nums">
                      {ann.date}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 line-clamp-1 mt-1 leading-snug">
                    {ann.snippet}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7. Upcoming Events Section */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-black">Upcoming Events</h3>
            <button
              onClick={() => onNavigate('calendar')}
              className="text-xs text-neutral-800 hover:text-black font-semibold underline"
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {upcomingEvents.map((evt) => (
              <div
                key={evt.id}
                onClick={() => onNavigate('calendar')}
                className="bg-white border border-neutral-100/90 rounded-2xl p-2.5 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-neutral-300 transition-all cursor-pointer min-h-[96px]"
              >
                <div className="flex items-center gap-2">
                  <div className="w-10 h-11 rounded-xl bg-neutral-100/90 border border-neutral-200/60 flex flex-col items-center justify-center text-black shrink-0">
                    <span className="text-sm font-bold leading-none">{evt.day}</span>
                    <span className="text-[9px] font-semibold tracking-wider leading-none mt-0.5">
                      {evt.month}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[11px] font-bold text-black leading-snug line-clamp-2">
                      {evt.title}
                    </h4>
                  </div>
                </div>
                <p className="text-[9px] text-neutral-400 leading-tight mt-2 truncate">
                  {evt.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Child Switcher Modal */}
      {isChildModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white text-black rounded-t-3xl sm:rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <h3 className="text-base font-bold text-black">Select Child</h3>
              <button
                onClick={() => setIsChildModalOpen(false)}
                className="p-1 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {linkedStudents.map((child: Student) => {
                const isSelected = currentStudent?.id === child.id;
                return (
                  <div
                    key={child.id}
                    onClick={() => {
                      switchStudent(child.id);
                      setIsChildModalOpen(false);
                    }}
                    className={`w-full p-3.5 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'border-black bg-neutral-50/80 shadow-2xs'
                        : 'border-neutral-200 hover:border-neutral-400 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative w-10 h-10 rounded-full shrink-0">
                        <img
                          src={child.avatar}
                          alt={child.name}
                          className="w-full h-full rounded-full object-cover border border-neutral-200"
                        />
                        <VerifiedAvatarBadge size="xs" />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center space-x-1.5">
                          <p className="text-sm font-bold text-black leading-tight">{child.name}</p>
                        </div>
                        <p className="text-xs text-neutral-500">{child.grade} - {child.section}</p>
                        <p className="text-[10px] text-neutral-400 mt-0.5">Roll No: {child.rollNumber}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
