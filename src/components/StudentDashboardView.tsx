import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  FileText, 
  Clock, 
  Award, 
  Megaphone, 
  Trophy,
  X, 
  CheckCircle2, 
  Download, 
  ChevronRight,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { ScreenType } from './ParentDashboardView';
import aaravAvatarDefault from '../assets/images/aarav_avatar.png';
import { StudentCalendarView } from './StudentCalendarView';
import { VerifiedAvatarBadge } from './VerifiedAvatarBadge';
import {
  formatISTDate,
  formatISTDayAndDate,
  formatISTMonthYear,
  getISTDateParts,
  useISTNow,
} from '../utils/dateTime';

interface AnnouncementItem {
  id: string;
  title: string;
  snippet: string;
  date: string;
  sender: string;
  fullContent: string;
  type: 'general' | 'event' | 'academic';
}

interface UpcomingEventItem {
  id: string;
  day: string;
  month: string;
  color: 'orange' | 'purple' | 'green';
  title: string;
  time: string;
  room: string;
  description: string;
}

export const StudentDashboardView: React.FC<{
  onNavigate: (screen: ScreenType) => void;
}> = ({ onNavigate }) => {
  const { currentStudent } = useAuth();

  // Modals state
  const [activeModal, setActiveModal] = useState<
    'none' | 'attendance' | 'assignments' | 'timetable' | 'calendar' | 'announcement' | 'event' | 'docRequest'
  >('none');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<AnnouncementItem | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<UpcomingEventItem | null>(null);
  const [requestStatus, setRequestStatus] = useState<string | null>(null);

  // Authenticated Student Data with defaults matching reference screenshot
  const studentName = currentStudent?.name || 'Aarav Sharma';
  const studentGrade = currentStudent?.grade || 'Class 6';
  const studentSection = currentStudent?.section || 'Section A';
  const studentRollNo = currentStudent?.rollNumber 
    ? (currentStudent.rollNumber === '6001' ? '08' : currentStudent.rollNumber) 
    : '08';
  
  // High fidelity uniform portrait matching screenshot reference
  const uniformPhoto = 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80';
  const studentAvatar = (currentStudent?.avatar && !currentStudent.avatar.includes('aarav_avatar.png')) 
    ? currentStudent.avatar 
    : uniformPhoto;

  const schoolName = 'Greenwood International School';
  const schoolTagline = 'Learn • Grow • Belong';

  const now = useISTNow(30000);
  const currentDateFormatted = useMemo(() => formatISTDate(now), [now]);
  const currentDayAndDateFormatted = useMemo(() => formatISTDayAndDate(now), [now]);
  const currentWeekdayLong = useMemo(() => getISTDateParts(now).weekdayLong, [now]);

  // 1. Recent Announcements matching reference screenshot
  const recentAnnouncements: AnnouncementItem[] = [
    {
      id: 'ann_1',
      title: 'Parent Teacher Meeting',
      snippet: 'PTM will be held on 15th October 2025 from 9:00 AM to 12:00 PM.',
      date: '5 Oct 2025',
      sender: 'Academic Office',
      fullContent: 'PTM will be held on 15th October 2025 from 9:00 AM to 12:00 PM in the Main Auditorium. Both parents and students are requested to attend together to review first-term performance and discuss academic goals.',
      type: 'general',
    },
    {
      id: 'ann_2',
      title: 'Annual Sports Day',
      snippet: 'Join us for the Annual Sports Day celebration on 25th October 2025.',
      date: '3 Oct 2025',
      sender: 'Physical Education Dept',
      fullContent: 'Join us for the Annual Sports Day celebration on 25th October 2025 at the school sports complex. All students are invited to register for track, football, and badminton events. Parents are warmly welcomed.',
      type: 'event',
    },
  ];

  // 2. Upcoming Events matching reference screenshot
  const upcomingEvents: UpcomingEventItem[] = [
    {
      id: 'evt_1',
      day: '15',
      month: 'OCT',
      color: 'orange',
      title: 'Maths Test',
      time: '9:00 AM - 10:00 AM',
      room: 'Hall A',
      description: 'Unit Test 1 covering Chapters 1-4 (Integers, Fractions, Decimals, Basic Algebra). Please bring geometry sets and blue/black pens.',
    },
    {
      id: 'evt_2',
      day: '18',
      month: 'OCT',
      color: 'purple',
      title: 'Science Test',
      time: '9:00 AM - 10:00 AM',
      room: 'Hall A',
      description: 'Unit Test 1 covering Plant Physiology, Cell Structures, and States of Matter. Diagrams must be labeled with pencils.',
    },
    {
      id: 'evt_3',
      day: '22',
      month: 'OCT',
      color: 'green',
      title: 'English Test',
      time: '9:00 AM - 10:00 AM',
      room: 'Hall B',
      description: 'Grammar and Comprehension unit test. Focus on active/passive voice, reading passages, and formal letter writing.',
    },
  ];

  const handleOpenAnnouncement = (item: AnnouncementItem) => {
    setSelectedAnnouncement(item);
    setActiveModal('announcement');
  };

  const handleOpenEvent = (item: UpcomingEventItem) => {
    setSelectedEvent(item);
    setActiveModal('event');
  };

  const handleDownloadCertificate = (certName: string) => {
    const text = `GREENWOOD INTERNATIONAL SCHOOL\n${schoolTagline}\n=========================================\nACADEMIC DOCUMENT: ${certName.toUpperCase()}\nStudent Name: ${studentName}\nClass & Section: ${studentGrade} - ${studentSection}\nRoll Number: ${studentRollNo}\nStatus: Verified and Issued by Academic Registrar\nDate of Verification: ${formatISTMonthYear(now)}\n=========================================`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${studentName.replace(/\s+/g, '_')}_${certName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
              {/* Open Book */}
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
              {/* Radiating Crest / Leaves above book */}
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

      {/* 2. Welcome & Student Profile Card (Compact Horizontal Layout) */}
      <section className="px-5 pt-3.5 flex items-center justify-between gap-3">
        {/* Left side — Greeting */}
        <div className="flex-1 min-w-0 pr-1">
          <span className="text-[10px] sm:text-[11px] font-bold text-neutral-400 tracking-wider uppercase block leading-none">
            WELCOME BACK
          </span>
          <div className="flex items-center space-x-1.5 mt-1">
            <h2 className="text-base sm:text-lg font-bold text-black tracking-tight leading-tight truncate">
              {studentName}
            </h2>
          </div>
          <p className="text-xs text-neutral-500 font-medium mt-0.5 leading-tight">
            {currentDateFormatted}
          </p>
        </div>

        {/* Right side — Student profile card */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-2.5 sm:p-3 flex items-center gap-2.5 shadow-2xs shrink-0 max-w-[200px] sm:max-w-[220px]">
          <div className="relative w-10 h-10 rounded-full shrink-0">
            <img
              src={studentAvatar}
              alt={studentName}
              className="w-full h-full rounded-full object-cover border border-neutral-200"
              onError={(e) => {
                (e.target as HTMLImageElement).src = aaravAvatarDefault;
              }}
            />
            <VerifiedAvatarBadge size="xs" />
          </div>
          <div className="flex flex-col text-left min-w-0 justify-center">
            <div className="flex items-center space-x-1">
              <span className="text-xs font-bold text-black leading-tight truncate">
                {studentName}
              </span>
            </div>
            <span className="text-[11px] text-neutral-500 font-medium leading-tight mt-0.5 truncate">
              {studentGrade} - {studentSection}
            </span>
            <span className="text-[10px] text-neutral-400 font-medium leading-tight mt-0.5 truncate">
              Roll No. {studentRollNo}
            </span>
          </div>
        </div>
      </section>

      {/* 3. Today's Overview Section */}
      <section className="px-5 pt-5 space-y-2.5">
        <h3 className="text-sm font-bold text-black">Today's Overview</h3>
        <div className="grid grid-cols-3 gap-2.5">
          {/* Card 1: Attendance */}
          <div
            onClick={() => setActiveModal('attendance')}
            className="bg-white border border-neutral-100/90 rounded-2xl p-3 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-neutral-300 transition-all cursor-pointer min-h-[110px]"
          >
            <div className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4 stroke-[1.8]" />
            </div>
            <div className="mt-2">
              <p className="text-[11px] text-neutral-500 font-medium leading-tight">
                Attendance
              </p>
              <p className="text-base font-bold text-black leading-tight mt-1">
                Present
              </p>
              <p className="text-[10px] text-neutral-400 mt-0.5 leading-tight">
                {currentDayAndDateFormatted}
              </p>
            </div>
          </div>

          {/* Card 2: Assignments */}
          <div
            onClick={() => setActiveModal('assignments')}
            className="bg-white border border-neutral-100/90 rounded-2xl p-3 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-neutral-300 transition-all cursor-pointer min-h-[110px]"
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
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveModal('assignments');
                }}
                className="text-[11px] text-neutral-700 underline font-medium hover:text-black mt-0.5 text-left leading-tight"
              >
                View All
              </button>
            </div>
          </div>

          {/* Card 3: Timetable */}
          <div
            onClick={() => setActiveModal('timetable')}
            className="bg-white border border-neutral-100/90 rounded-2xl p-3 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-neutral-300 transition-all cursor-pointer min-h-[110px]"
          >
            <div className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 stroke-[1.8]" />
            </div>
            <div className="mt-2">
              <p className="text-[11px] text-neutral-500 font-medium leading-tight">
                Timetable
              </p>
              <p className="text-base font-bold text-black leading-tight mt-1">
                4 Classes
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveModal('timetable');
                }}
                className="text-[11px] text-neutral-700 underline font-medium hover:text-black mt-0.5 text-left leading-tight"
              >
                View Today
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Quick Access Section */}
      <section className="px-5 pt-5 space-y-2.5">
        <h3 className="text-sm font-bold text-black">Quick Access</h3>
        <div className="grid grid-cols-4 gap-2.5">
          {/* Tile 1: School Calendar */}
          <button
            onClick={() => onNavigate('calendar')}
            className="bg-white border border-neutral-100/90 rounded-2xl py-3 px-1.5 flex flex-col items-center justify-center text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-neutral-300 transition-all min-h-[82px] group"
          >
            <Calendar className="w-5 h-5 text-black stroke-[1.8] group-hover:scale-105 transition-transform" />
            <span className="text-[10.5px] font-medium text-neutral-800 leading-tight mt-2">
              School<br />Calendar
            </span>
          </button>

          {/* Tile 2: My Certificates */}
          <button
            onClick={() => onNavigate('certificates')}
            className="bg-white border border-neutral-100/90 rounded-2xl py-3 px-1.5 flex flex-col items-center justify-center text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-neutral-300 transition-all min-h-[82px] group"
          >
            <div className="relative">
              <FileText className="w-5 h-5 text-black stroke-[1.8] group-hover:scale-105 transition-transform" />
              <Award className="w-2.5 h-2.5 text-black stroke-[2.2] absolute -bottom-0.5 -right-1 bg-white rounded-full" />
            </div>
            <span className="text-[10.5px] font-medium text-neutral-800 leading-tight mt-2">
              My<br />Certificates
            </span>
          </button>

          {/* Tile 3: My Results */}
          <button
            onClick={() => onNavigate('exams')}
            className="bg-white border border-neutral-100/90 rounded-2xl py-3 px-1.5 flex flex-col items-center justify-center text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-neutral-300 transition-all min-h-[82px] group"
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
            <span className="text-[10.5px] font-medium text-neutral-800 leading-tight mt-2">
              My<br />Results
            </span>
          </button>

          {/* Tile 4: Overall Attendance */}
          <button
            onClick={() => setActiveModal('attendance')}
            className="bg-white border border-neutral-100/90 rounded-2xl py-3 px-1.5 flex flex-col items-center justify-center text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-neutral-300 transition-all min-h-[82px] group"
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
            <span className="text-[10.5px] font-medium text-neutral-800 leading-tight mt-2">
              Overall<br />Attendance
            </span>
          </button>
        </div>
      </section>

      {/* 5. Recent Announcements Section */}
      <section className="px-5 pt-5 space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-black">Recent Announcements</h3>
          <button
            onClick={() => onNavigate('announcements')}
            className="text-xs text-neutral-600 hover:text-black font-semibold underline"
          >
            View All
          </button>
        </div>

        {/* Announcements list enclosure matching reference screenshot */}
        <div className="bg-white border border-neutral-100/90 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] divide-y divide-neutral-100/90 overflow-hidden">
          {recentAnnouncements.map((ann) => (
            <div
              key={ann.id}
              onClick={() => handleOpenAnnouncement(ann)}
              className="p-3.5 flex items-start gap-3 hover:bg-neutral-50/50 cursor-pointer transition-colors"
            >
              {/* Icon Container */}
              <div className="w-9 h-9 rounded-xl bg-neutral-100/80 flex items-center justify-center text-neutral-800 shrink-0 mt-0.5">
                {(() => {
                  const t = ann.title.toLowerCase();
                  if (t.includes('parent-teacher') || t.includes('ptm') || t.includes('meeting')) {
                    return <Megaphone className="w-4 h-4 stroke-[1.8]" />;
                  }
                  if (t.includes('sports') || t.includes('sports day') || t.includes('athletic')) {
                    return <Trophy className="w-4 h-4 stroke-[1.8]" />;
                  }
                  if (t.includes('syllabus') || t.includes('curriculum')) {
                    return <FileText className="w-4 h-4 stroke-[1.8]" />;
                  }
                  if (t.includes('holiday') || t.includes('vacation') || t.includes('diwali') || t.includes('break')) {
                    return <Calendar className="w-4 h-4 stroke-[1.8]" />;
                  }
                  if (ann.type === 'event') {
                    return <Trophy className="w-4 h-4 stroke-[1.8]" />;
                  }
                  return <Megaphone className="w-4 h-4 stroke-[1.8]" />;
                })()}
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-black truncate leading-tight">
                    {ann.title}
                  </h4>
                  <span className="text-[11px] text-neutral-400 shrink-0 tabular-nums">
                    {ann.date}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 line-clamp-2 mt-1 leading-snug">
                  {ann.snippet}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Upcoming Events Section */}
      <section className="px-5 pt-5 space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-black">Upcoming Events</h3>
          <button
            onClick={() => setActiveModal('calendar')}
            className="text-xs text-neutral-600 hover:text-black font-semibold underline"
          >
            View All
          </button>
        </div>

        {/* Row of 3 upcoming test/event cards */}
        <div className="grid grid-cols-3 gap-2.5">
          {upcomingEvents.map((evt) => (
            <div
              key={evt.id}
              onClick={() => handleOpenEvent(evt)}
              className="bg-white border border-neutral-100/90 rounded-2xl p-2.5 flex items-center gap-2 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-neutral-300 transition-all cursor-pointer"
            >
              {/* Date Box with color accent */}
              <div
                className={`w-11 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 ${
                  evt.color === 'orange'
                    ? 'bg-orange-50/90 border border-orange-100/80 text-orange-500'
                    : evt.color === 'purple'
                    ? 'bg-purple-50/90 border border-purple-100/80 text-purple-600'
                    : 'bg-emerald-50/90 border border-emerald-100/80 text-emerald-600'
                }`}
              >
                <span className="text-base font-bold leading-none">{evt.day}</span>
                <span className="text-[9px] font-semibold tracking-wider leading-none mt-0.5">
                  {evt.month}
                </span>
              </div>

              {/* Event Title & Time */}
              <div className="min-w-0 flex-1">
                <h4 className="text-[11px] font-bold text-black leading-snug truncate">
                  {evt.title}
                </h4>
                <p className="text-[9px] text-neutral-400 leading-tight mt-0.5 truncate">
                  {evt.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== FUNCTIONAL INTERACTIVE MODALS ===================== */}

      {/* Modal 1: Overall Attendance Sheet */}
      {activeModal === 'attendance' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-5 border border-neutral-200 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Calendar className="w-4 h-4 stroke-[2]" />
                </div>
                <h3 className="text-sm font-bold text-black">Overall Attendance</h3>
              </div>
              <button onClick={() => setActiveModal('none')} className="text-neutral-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-3.5 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-emerald-800 font-medium">Academic Year 2025–26</p>
                <p className="text-2xl font-bold text-emerald-700 tabular-nums">92%</p>
                <p className="text-[10px] text-emerald-600 mt-0.5">Status: Eligible for term exams</p>
              </div>
              <div className="text-right text-xs space-y-0.5 text-neutral-600">
                <p><span className="font-bold text-emerald-700">84</span> Present</p>
                <p><span className="font-bold text-red-600">6</span> Absent</p>
                <p><span className="font-bold text-amber-600">2</span> Excused</p>
              </div>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto divide-y divide-neutral-100 text-xs">
              <div className="py-1.5 flex items-center justify-between">
                <span className="text-neutral-700 font-medium">{currentDateFormatted} (Today)</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/50">Present</span>
              </div>
              <div className="py-1.5 flex items-center justify-between">
                <span className="text-neutral-700 font-medium">13 Oct 2025</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/50">Present</span>
              </div>
              <div className="py-1.5 flex items-center justify-between">
                <span className="text-neutral-700 font-medium">10 Oct 2025</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/50">Present</span>
              </div>
              <div className="py-1.5 flex items-center justify-between">
                <span className="text-neutral-700 font-medium">09 Oct 2025</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/50">Present</span>
              </div>
              <div className="py-1.5 flex items-center justify-between">
                <span className="text-neutral-700 font-medium">08 Oct 2025</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-600 border border-red-200/50">Absent (Medical)</span>
              </div>
            </div>

            <button
              onClick={() => setActiveModal('none')}
              className="w-full py-2.5 bg-black text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Modal 2: Today's Assignments Sheet */}
      {activeModal === 'assignments' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-5 border border-neutral-200 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                  <FileText className="w-4 h-4 stroke-[2]" />
                </div>
                <h3 className="text-sm font-bold text-black">Today's Assignments (2)</h3>
              </div>
              <button onClick={() => setActiveModal('none')} className="text-neutral-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="bg-white border border-neutral-200 rounded-xl p-3 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-black">Mathematics · Algebra Exercise 4.2</span>
                  <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-md">Due Tomorrow</span>
                </div>
                <p className="text-neutral-500 text-[11px]">
                  Complete problems 1 to 15 on page 84. Submit written notebook copy to Mrs. Verma.
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-neutral-400">Assigned by: Mrs. Verma</span>
                  <button
                    onClick={() => alert('Assignment marked as submitted.')}
                    className="text-[10px] font-semibold text-black underline"
                  >
                    Mark as Done
                  </button>
                </div>
              </div>

              <div className="bg-white border border-neutral-200 rounded-xl p-3 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-black">Science · Plant Cell Diagram</span>
                  <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-md">Due 16 Oct</span>
                </div>
                <p className="text-neutral-500 text-[11px]">
                  Draw and label the parts of a plant cell on an A4 sheet. Include chloroplasts and vacuole.
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-neutral-400">Assigned by: Dr. Nair</span>
                  <button
                    onClick={() => alert('Assignment marked as submitted.')}
                    className="text-[10px] font-semibold text-black underline"
                  >
                    Mark as Done
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveModal('none')}
              className="w-full py-2.5 bg-black text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Modal 3: Today's Timetable Sheet */}
      {activeModal === 'timetable' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-5 border border-neutral-200 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Clock className="w-4 h-4 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-black">Today's Timetable</h3>
                  <p className="text-[10px] text-neutral-400">{currentWeekdayLong} · 4 Scheduled Classes</p>
                </div>
              </div>
              <button onClick={() => setActiveModal('none')} className="text-neutral-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-neutral-50 border border-neutral-200/80 rounded-xl p-2.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-black">Mathematics</span>
                  <p className="text-[10px] text-neutral-500">Classroom A1 · Mrs. Verma</p>
                </div>
                <span className="text-[11px] font-semibold text-neutral-700">08:00 AM - 09:00 AM</span>
              </div>

              <div className="bg-neutral-50 border border-neutral-200/80 rounded-xl p-2.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-black">Science</span>
                  <p className="text-[10px] text-neutral-500">Classroom B2 · Dr. Nair</p>
                </div>
                <span className="text-[11px] font-semibold text-neutral-700">09:00 AM - 10:00 AM</span>
              </div>

              <div className="bg-amber-50/50 border border-amber-200/60 rounded-xl px-2.5 py-1.5 flex items-center justify-between text-[11px] text-amber-800">
                <span className="font-medium">Recess Break</span>
                <span>10:00 AM - 10:30 AM</span>
              </div>

              <div className="bg-neutral-50 border border-neutral-200/80 rounded-xl p-2.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-black">English</span>
                  <p className="text-[10px] text-neutral-500">Classroom A1 · Mr. Joseph</p>
                </div>
                <span className="text-[11px] font-semibold text-neutral-700">10:30 AM - 11:30 AM</span>
              </div>

              <div className="bg-neutral-50 border border-neutral-200/80 rounded-xl p-2.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-black">Social Studies</span>
                  <p className="text-[10px] text-neutral-500">Classroom C1 · Mrs. Kapoor</p>
                </div>
                <span className="text-[11px] font-semibold text-neutral-700">11:30 AM - 12:30 PM</span>
              </div>
            </div>

            <button
              onClick={() => setActiveModal('none')}
              className="w-full py-2.5 bg-black text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Modal 4: School Calendar / Events View */}
      {activeModal === 'calendar' && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <StudentCalendarView onBack={() => setActiveModal('none')} />
        </div>
      )}



      {/* Modal 6: Announcement Details Modal */}
      {selectedAnnouncement && activeModal === 'announcement' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6 z-50 animate-in fade-in">
          <div className="w-full max-w-sm bg-white text-black border border-neutral-200 p-6 rounded-3xl space-y-4 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
                  {selectedAnnouncement.sender}
                </span>
                <h3 className="text-base font-bold text-black mt-0.5 leading-snug">
                  {selectedAnnouncement.title}
                </h3>
                <p className="text-xs text-neutral-400 mt-1">{selectedAnnouncement.date}</p>
              </div>
              <button onClick={() => setActiveModal('none')} className="text-neutral-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 text-xs text-neutral-700 leading-relaxed">
              {selectedAnnouncement.fullContent}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setActiveModal('none');
                  onNavigate('announcements');
                }}
                className="flex-1 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-semibold rounded-xl transition-colors"
              >
                All Announcements
              </button>
              <button
                onClick={() => setActiveModal('none')}
                className="flex-1 py-2.5 bg-black text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 7: Event Details Modal */}
      {selectedEvent && activeModal === 'event' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6 z-50 animate-in fade-in">
          <div className="w-full max-w-sm bg-white text-black border border-neutral-200 p-6 rounded-3xl space-y-4 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-800 uppercase">
                    {selectedEvent.day} {selectedEvent.month} 2025
                  </span>
                  <span className="text-[10px] font-semibold text-neutral-500">{selectedEvent.room}</span>
                </div>
                <h3 className="text-base font-bold text-black mt-1.5">{selectedEvent.title}</h3>
                <p className="text-xs text-neutral-500 mt-0.5">{selectedEvent.time}</p>
              </div>
              <button onClick={() => setActiveModal('none')} className="text-neutral-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 text-xs text-neutral-700 leading-relaxed">
              {selectedEvent.description}
            </div>

            <button
              onClick={() => setActiveModal('none')}
              className="w-full py-2.5 bg-black text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
