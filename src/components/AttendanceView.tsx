import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ScreenHeader } from './ScreenHeader';
import { VerifiedAvatarBadge } from './VerifiedAvatarBadge';
import { getISTDateParts, useISTNow } from '../utils/dateTime';

export const AttendanceView: React.FC<{ onBack: () => void; onSwitchChild?: () => void }> = ({ onBack, onSwitchChild }) => {
  const { currentStudent, user } = useAuth();
  const isStudent = user?.role === 'student';
  const now = useISTNow(60000);
  const todayIST = getISTDateParts(now);

  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(() => getISTDateParts().monthIndex);
  const [currentYear, setCurrentYear] = useState<number>(() => getISTDateParts().year);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonthIndex((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonthIndex((m) => m + 1);
    }
  };

  // Existing attendance status records by day of month
  const statusByDay: Record<number, 'present' | 'absent' | 'late' | 'weekend'> = {
    1: 'present',
    2: 'present',
    3: 'present',
    4: 'weekend',
    5: 'weekend',
    6: 'present',
    7: 'present',
    8: 'present',
    9: 'absent', // Red absent day
    10: 'present',
    11: 'weekend',
    12: 'weekend',
    13: 'present',
    14: 'present',
    15: 'late', // Amber late day
    16: 'present',
    17: 'present',
    18: 'weekend',
    19: 'weekend',
    20: 'present',
    21: 'present',
    22: 'present',
    23: 'present',
    24: 'present',
    25: 'weekend',
    26: 'weekend',
    27: 'present',
    28: 'present',
    29: 'present',
    30: 'present',
    31: 'present',
  };

  const daysInSelectedMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  const days = Array.from({ length: daysInSelectedMonth }, (_, i) => {
    const dayNum = i + 1;
    return {
      day: dayNum,
      status: statusByDay[dayNum] || 'present',
    };
  });

  return (
    <div className="min-h-full bg-white text-black flex flex-col font-sans pb-24 selection:bg-black selection:text-white">
      {/* Top Bar matching Screen 4 */}
      <ScreenHeader
        title="Attendance"
        onBack={onBack}
        backAriaLabel="Back to Home"
        className="border-b border-neutral-100"
      />

      <div className="p-4 space-y-4">
        {/* Child Selector Pill (Parent mode only) */}
        {!isStudent && (
          <div
            onClick={onSwitchChild}
            className="w-full bg-white border border-neutral-200/90 rounded-2xl p-3 flex items-center justify-between shadow-xs hover:border-neutral-400 cursor-pointer transition-all"
          >
            <div className="flex items-center space-x-3">
              <div className="relative w-9 h-9 rounded-full shrink-0">
                <img
                  src={currentStudent?.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150'}
                  alt={currentStudent?.name}
                  className="w-full h-full rounded-full object-cover border border-neutral-200"
                />
                <VerifiedAvatarBadge size="xs" />
              </div>
              <div className="text-left">
                <div className="flex items-center space-x-1.5">
                  <h3 className="text-xs font-bold text-black leading-tight">{currentStudent?.name || 'Aarav Sharma'}</h3>
                </div>
                <p className="text-[11px] text-neutral-500">{currentStudent?.grade} - {currentStudent?.section}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </div>
        )}

        {/* Month Selector matching Screen 4 */}
        <div className="flex items-center justify-between px-2 pt-1">
          <button
            onClick={handlePrevMonth}
            className="p-1 rounded-full hover:bg-neutral-100 text-neutral-600"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold text-black">{months[currentMonthIndex]} {currentYear}</span>
          <button
            onClick={handleNextMonth}
            className="p-1 rounded-full hover:bg-neutral-100 text-neutral-600"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Circular Progress Gauge & Stats Breakdown */}
        <div className="bg-white border border-neutral-200/90 rounded-3xl p-5 flex items-center justify-between shadow-xs">
          {/* Circular Ring Gauge */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#f3f4f6"
                strokeWidth="10"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#10b981"
                strokeWidth="10"
                strokeDasharray={`${(currentStudent?.attendancePercentage || 92) * 2.51} 251.2`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-bold text-black leading-none">{currentStudent?.attendancePercentage || 92}%</span>
              <span className="text-[10px] text-neutral-500 font-medium mt-0.5">Present</span>
            </div>
          </div>

          {/* Stats Legend List matching Screen 4 */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-neutral-600 w-16">Present</span>
              <span className="font-bold text-black">23</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <span className="text-neutral-600 w-16">Absent</span>
              <span className="font-bold text-black">1</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span className="text-neutral-600 w-16">Late</span>
              <span className="font-bold text-black">1</span>
            </div>
            <div className="flex items-center space-x-2 pt-1 border-t border-neutral-100">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-300"></span>
              <span className="text-neutral-600 w-16">Total</span>
              <span className="font-bold text-black">25</span>
            </div>
          </div>
        </div>

        {/* Calendar Day Matrix matching Screen 4 */}
        <div className="bg-white border border-neutral-200/90 rounded-3xl p-4 shadow-xs">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 text-center text-xs font-semibold text-neutral-500 mb-2">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>

          {/* Dates Grid */}
          <div className="grid grid-cols-7 gap-y-2.5 text-center text-xs">
            {days.map((item) => {
              const isToday =
                currentYear === todayIST.year &&
                currentMonthIndex === todayIST.monthIndex &&
                item.day === todayIST.day;

              let circleColor = 'text-neutral-400';
              if (item.status === 'present') circleColor = 'bg-emerald-100 text-emerald-800 font-semibold';
              if (item.status === 'absent') circleColor = 'bg-red-500 text-white font-bold';
              if (item.status === 'late') circleColor = 'bg-amber-400 text-white font-bold';

              return (
                <div key={item.day} className="flex justify-center items-center">
                  <span
                    title={isToday ? 'Today' : undefined}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${circleColor} ${
                      isToday ? 'ring-2 ring-black ring-offset-1' : ''
                    }`}
                  >
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
