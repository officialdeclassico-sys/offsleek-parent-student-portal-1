import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ChevronRight } from 'lucide-react';
import { ScreenHeader } from './ScreenHeader';
import { VerifiedAvatarBadge } from './VerifiedAvatarBadge';
import { DEMO_TIMETABLE } from '../services/api';
import { getISTCurrentWeekMonToFri, useISTNow } from '../utils/dateTime';

export const TimetableScheduleView: React.FC<{ onBack: () => void; onSwitchChild?: () => void }> = ({ onBack, onSwitchChild }) => {
  const { currentStudent, user } = useAuth();
  const isStudent = user?.role === 'student';
  const now = useISTNow(60000);
  const { daysList } = getISTCurrentWeekMonToFri(now);
  const [selectedDayKey, setSelectedDayKey] = useState<string>(() => getISTCurrentWeekMonToFri().currentWeekdayKey);

  const currentSchedule = DEMO_TIMETABLE[selectedDayKey] || DEMO_TIMETABLE['Tue'];

  const getAccentBorder = (subject: string, isBreak?: boolean) => {
    if (isBreak) return 'border-l-amber-500';
    if (subject.includes('Math')) return 'border-l-emerald-500';
    if (subject.includes('Sci')) return 'border-l-amber-500';
    if (subject.includes('Eng')) return 'border-l-blue-500';
    if (subject.includes('Social') || subject.includes('History')) return 'border-l-purple-500';
    if (subject.includes('Comp')) return 'border-l-cyan-500';
    return 'border-l-neutral-400';
  };

  return (
    <div className="min-h-full bg-white text-black flex flex-col font-sans pb-24 selection:bg-black selection:text-white">
      {/* Top Bar matching Screen 3 */}
      <ScreenHeader
        title="Timetable"
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

        {/* Day Selector Pills matching Screen 3 */}
        <div className="grid grid-cols-5 gap-2">
          {daysList.map((d) => {
            const isActive = selectedDayKey === d.key;
            return (
              <button
                key={d.key}
                onClick={() => setSelectedDayKey(d.key)}
                className={`py-2 px-1 rounded-2xl flex flex-col items-center justify-center transition-all ${
                  isActive
                    ? 'bg-black text-white shadow-xs'
                    : 'bg-[#fafafa] border border-neutral-200 text-neutral-600 hover:border-neutral-300'
                }`}
              >
                <span className="text-[10px] font-medium leading-tight">{d.dayName}</span>
                <span className="text-sm font-bold leading-tight mt-0.5">{d.dateNum}</span>
              </button>
            );
          })}
        </div>

        {/* Schedule List matching Screen 3 */}
        <div className="space-y-2.5 pt-1">
          {currentSchedule.map((period, idx) => (
            <div
              key={idx}
              className={`border border-neutral-200/90 rounded-2xl p-3.5 flex items-center justify-between shadow-xs transition-all pl-3 border-l-3 ${getAccentBorder(period.subject, period.isBreak)} ${
                period.isBreak ? 'bg-neutral-50/70' : 'bg-white'
              }`}
            >
              <div className="w-20">
                <span className="text-xs font-semibold text-neutral-700">{period.time}</span>
              </div>

              <div className="flex-1 px-3">
                <h4 className="text-sm font-bold text-black">{period.subject}</h4>
                <p className="text-xs text-neutral-500 mt-0.5">{period.classroom}</p>
              </div>

              {period.isBreak && (
                <span className="text-[10px] bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded font-medium">
                  Break
                </span>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
