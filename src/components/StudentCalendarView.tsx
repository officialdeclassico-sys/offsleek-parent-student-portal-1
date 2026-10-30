import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  FileText, 
  Users, 
  MapPin, 
  Calendar as CalendarIcon, 
  Pencil, 
  Clock,
  Sparkles
} from 'lucide-react';
import { ScreenHeader } from './ScreenHeader';
import { getISTDateParts, useISTNow } from '../utils/dateTime';

export type CalendarCategory = 'Holiday' | 'Event' | 'Exam' | 'Activity' | 'Meeting' | 'Classes';

export interface CalendarEventDetail {
  id: string;
  title: string;
  category: CalendarCategory;
  dateStr: string; // 'Tue, 14 Oct 2025'
  dayNumber: number; // 14
  monthIndex: number; // 9 for Oct
  year: number; // 2025
  time: string; // '9:00 AM – 11:00 AM'
  location: string; // 'Classrooms'
  description: string;
  classesInvolved?: string;
  syllabus?: string;
  itemsToBring?: string;
}

interface StudentCalendarViewProps {
  onBack: () => void;
  initialEventId?: string;
}

// Full school calendar data
const MOCK_EVENTS: CalendarEventDetail[] = [
  // 14 Oct 2025 (Reference Screen 1)
  {
    id: 'evt_14_classes',
    title: 'Regular Classes',
    category: 'Classes',
    dateStr: 'Tue, 14 Oct 2025',
    dayNumber: 14,
    monthIndex: 9,
    year: 2025,
    time: '8:00 AM – 2:30 PM',
    location: 'School Campus',
    description: 'Regular academic timetable schedule for Class 6 Section A. Students will attend standard periods for Mathematics, Science, Social Studies, and English.',
    classesInvolved: 'Class 6 – All Sections',
    syllabus: 'Standard Term 1 Coursework',
    itemsToBring: 'All Daily Textbooks, Notebooks, School Uniform',
  },
  {
    id: 'evt_14_exam',
    title: 'Unit Test 2 – Mathematics',
    category: 'Exam',
    dateStr: 'Tue, 14 Oct 2025',
    dayNumber: 14,
    monthIndex: 9,
    year: 2025,
    time: '9:00 AM – 11:00 AM',
    location: 'Classrooms',
    description: 'Unit Test 2 for Mathematics will be conducted for Class 6. The syllabus includes chapters 4, 5 and 6. Students are advised to revise all topics and bring the necessary stationery.',
    classesInvolved: 'Class 6 – All Sections',
    syllabus: 'Chapters 4, 5 and 6',
    itemsToBring: 'Pen, Pencil, Eraser, Geometry Box',
  },
  {
    id: 'evt_14_meeting',
    title: 'Parent Teacher Meeting',
    category: 'Meeting',
    dateStr: 'Tue, 14 Oct 2025',
    dayNumber: 14,
    monthIndex: 9,
    year: 2025,
    time: '4:00 PM – 5:30 PM',
    location: 'School Auditorium',
    description: 'Quarterly parent-teacher conference to discuss academic progress, behavioral observations, and individual student development for Term 1.',
    classesInvolved: 'Class 6 – All Sections',
    syllabus: 'Term 1 Academic Review',
    itemsToBring: 'Student ID Card, Progress Card Notes',
  },

  // 15 Oct 2025 (Reference Screen 1 Upcoming Event)
  {
    id: 'evt_15_activity',
    title: 'Annual Sports Day Practice',
    category: 'Activity',
    dateStr: 'Wed, 15 Oct 2025',
    dayNumber: 15,
    monthIndex: 9,
    year: 2025,
    time: '8:00 AM – 12:00 PM',
    location: 'School Ground',
    description: 'Preparation and march-past rehearsal for the upcoming Annual Inter-House Sports Meet. Track and field events practice for all qualified students.',
    classesInvolved: 'Class 6 to Class 10',
    syllabus: 'Athletics & March Past Drills',
    itemsToBring: 'Sports House T-Shirt, Running Shoes, Water Bottle',
  },

  // Other October dates matching indicators in the reference mockup
  {
    id: 'evt_2_holiday',
    title: 'Gandhi Jayanti',
    category: 'Holiday',
    dateStr: 'Thu, 2 Oct 2025',
    dayNumber: 2,
    monthIndex: 9,
    year: 2025,
    time: 'All Day',
    location: 'School Campus (Closed)',
    description: 'National holiday in observance of Mahatma Gandhi Jayanti. School campus and administrative offices will remain closed.',
    classesInvolved: 'All Classes',
  },
  {
    id: 'evt_5_meeting',
    title: 'Class 6 Parent Orientation',
    category: 'Meeting',
    dateStr: 'Sun, 5 Oct 2025',
    dayNumber: 5,
    monthIndex: 9,
    year: 2025,
    time: '10:00 AM – 11:30 AM',
    location: 'School Auditorium',
    description: 'Parent orientation session regarding curriculum updates and Olympiad preparation modules.',
    classesInvolved: 'Class 6 Parents & Students',
  },
  {
    id: 'evt_8_event',
    title: 'Inter-House Debate Competition',
    category: 'Event',
    dateStr: 'Wed, 8 Oct 2025',
    dayNumber: 8,
    monthIndex: 9,
    year: 2025,
    time: '11:00 AM – 1:30 PM',
    location: 'Seminar Hall',
    description: 'Annual inter-house English debate championship on scientific ethics and artificial intelligence in education.',
    classesInvolved: 'Middle School (Classes 6-8)',
    itemsToBring: 'Debate Notes, Formal School Blazer',
  },
  {
    id: 'evt_10_activity',
    title: 'Science Exhibition Project Setup',
    category: 'Activity',
    dateStr: 'Fri, 10 Oct 2025',
    dayNumber: 10,
    monthIndex: 9,
    year: 2025,
    time: '1:00 PM – 3:30 PM',
    location: 'Junior Science Lab',
    description: 'Setting up working models and posters for the regional STEM exhibition.',
    classesInvolved: 'Class 6 & Class 7 Science Club',
    itemsToBring: 'Project Models, Chart Papers, Adhesives',
  },
  {
    id: 'evt_18_event',
    title: 'Inter-School Science Fair',
    category: 'Event',
    dateStr: 'Sat, 18 Oct 2025',
    dayNumber: 18,
    monthIndex: 9,
    year: 2025,
    time: '9:00 AM – 3:00 PM',
    location: 'Main Exhibition Hall',
    description: 'Annual inter-school science and innovation fair showcasing creative student projects from across 15 partner schools.',
    classesInvolved: 'Classes 6 to 12',
    itemsToBring: 'Student ID Card, Project Exhibit Display',
  },
  {
    id: 'evt_22_exam',
    title: 'Unit Test 2 – English Literature',
    category: 'Exam',
    dateStr: 'Wed, 22 Oct 2025',
    dayNumber: 22,
    monthIndex: 9,
    year: 2025,
    time: '9:00 AM – 11:00 AM',
    location: 'Classrooms',
    description: 'Unit Test 2 for English Grammar, Reading Comprehension, and Prose Chapters 3 to 5.',
    classesInvolved: 'Class 6 – All Sections',
    syllabus: 'Chapters 3, 4 and 5; Active/Passive Voice; Essay Writing',
    itemsToBring: 'Blue/Black Pens, Writing Pad',
  },
  {
    id: 'evt_25_meeting',
    title: 'Staff & Parent Advisory Council',
    category: 'Meeting',
    dateStr: 'Sat, 25 Oct 2025',
    dayNumber: 25,
    monthIndex: 9,
    year: 2025,
    time: '11:00 AM – 1:00 PM',
    location: 'Conference Room 1',
    description: 'Bimonthly advisory meeting between student council representatives, parent volunteers, and department heads.',
    classesInvolved: 'Parent Representatives & Student Council',
  },
  {
    id: 'evt_28_activity',
    title: 'Annual Sports Day Trials',
    category: 'Activity',
    dateStr: 'Tue, 28 Oct 2025',
    dayNumber: 28,
    monthIndex: 9,
    year: 2025,
    time: '2:30 PM – 4:30 PM',
    location: 'Athletic Track',
    description: 'Qualifying trials for 100m sprint, 200m relay, long jump, and shot put for middle school divisions.',
    classesInvolved: 'Class 6 & Class 7 Registered Athletes',
    itemsToBring: 'Sports Gear, Running Spikes, Water Bottle',
  },
  {
    id: 'evt_31_holiday',
    title: 'Diwali & Mid-Term Break',
    category: 'Holiday',
    dateStr: 'Fri, 31 Oct 2025',
    dayNumber: 31,
    monthIndex: 9,
    year: 2025,
    time: 'All Day',
    location: 'School Campus (Closed)',
    description: 'Commencement of festive holiday break for Diwali and semester midterm. Classes resume following week.',
    classesInvolved: 'All Classes',
  },
];

// Dot indicators color map matching reference
const CATEGORY_DOT_COLORS: Record<CalendarCategory, string> = {
  Holiday: 'bg-emerald-500',
  Event: 'bg-blue-600',
  Exam: 'bg-purple-600',
  Activity: 'bg-orange-400',
  Meeting: 'bg-red-500',
  Classes: 'bg-neutral-600',
};

// Map day numbers in October 2025 to dot colors matching reference
const OCTOBER_DOTS: Record<number, string> = {
  2: 'bg-emerald-500',  // Holiday
  5: 'bg-red-500',      // Meeting
  8: 'bg-blue-600',     // Event
  10: 'bg-orange-400',  // Activity
  14: 'bg-emerald-500', // Selected day
  15: 'bg-purple-600',  // Exam
  18: 'bg-blue-600',    // Event
  22: 'bg-purple-600',  // Exam
  25: 'bg-red-500',     // Meeting
  28: 'bg-orange-400',  // Activity
  31: 'bg-emerald-500', // Holiday
};

export const StudentCalendarView: React.FC<StudentCalendarViewProps> = ({
  onBack,
  initialEventId,
}) => {
  const now = useISTNow(60000);
  const todayIST = getISTDateParts(now);

  // Calendar navigation state initialized dynamically to actual current IST date
  const [currentDate, setCurrentDate] = useState(
    () => {
      const init = getISTDateParts();
      return new Date(init.year, init.monthIndex, init.day);
    }
  );
  const [selectedDay, setSelectedDay] = useState<number>(() => getISTDateParts().day);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventDetail | null>(() => {
    if (initialEventId) {
      return MOCK_EVENTS.find((e) => e.id === initialEventId) || null;
    }
    return null;
  });


  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentMonthIndex = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const currentMonthName = monthNames[currentMonthIndex];

  const handlePrevMonth = () => {
    const prev = new Date(currentYear, currentMonthIndex - 1, 1);
    setCurrentDate(prev);
    setSelectedDay(
      prev.getFullYear() === todayIST.year && prev.getMonth() === todayIST.monthIndex
        ? todayIST.day
        : 1
    );
  };

  const handleNextMonth = () => {
    const next = new Date(currentYear, currentMonthIndex + 1, 1);
    setCurrentDate(next);
    setSelectedDay(
      next.getFullYear() === todayIST.year && next.getMonth() === todayIST.monthIndex
        ? todayIST.day
        : 1
    );
  };

  // Calendar days computation for the active month and year
  const getCalendarDays = () => {
    const firstDayIndex = new Date(currentYear, currentMonthIndex, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonthIndex, 0).getDate();

    const prevDays: { day: number; isCurrentMonth: boolean }[] = [];
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      prevDays.push({ day: daysInPrevMonth - i, isCurrentMonth: false });
    }

    const currentDays: { day: number; isCurrentMonth: boolean }[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      currentDays.push({ day: d, isCurrentMonth: true });
    }

    const totalCells = prevDays.length + currentDays.length;
    const nextDaysNeeded = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    const nextDays: { day: number; isCurrentMonth: boolean }[] = [];
    for (let d = 1; d <= nextDaysNeeded; d++) {
      nextDays.push({ day: d, isCurrentMonth: false });
    }

    return [...prevDays, ...currentDays, ...nextDays];
  };

  const calendarCells = getCalendarDays();

  // Selected date formatted text
  const selectedDateObj = new Date(currentYear, currentMonthIndex, selectedDay);
  const weekdayShort = selectedDateObj.toLocaleDateString('en-US', { weekday: 'short' });
  const monthShort = selectedDateObj.toLocaleDateString('en-US', { month: 'short' });
  const selectedDateHeader = `Events on ${weekdayShort}, ${selectedDay} ${monthShort} ${currentYear}`;

  // Events on the selected day (preserving scheduled October events across academic session)
  const eventsOnSelectedDay = MOCK_EVENTS.filter(
    (e) => e.monthIndex === currentMonthIndex && e.dayNumber === selectedDay
  ).map((e) => ({
    ...e,
    year: currentYear,
    dateStr: `${weekdayShort}, ${selectedDay} ${monthShort} ${currentYear}`,
  }));



  // Helper for event category badge styling: monochrome neutral backgrounds with dark grey text
  const getEventIcon = (category: CalendarCategory) => {
    switch (category) {
      case 'Exam':
        return <FileText className="w-4 h-4 text-black stroke-[1.8]" />;
      case 'Meeting':
        return <Users className="w-4 h-4 text-black stroke-[1.8]" />;
      case 'Classes':
        return <BookOpen className="w-4 h-4 text-black stroke-[1.8]" />;
      case 'Activity':
        return <Pencil className="w-4 h-4 text-black stroke-[1.8]" />;
      default:
        return <CalendarIcon className="w-4 h-4 text-black stroke-[1.8]" />;
    }
  };

  // =========================================================================
  // SCREEN TWO: EVENT DETAILS
  // =========================================================================
  if (selectedEvent) {
    return (
      <div className="min-h-full bg-white text-black font-sans pb-24 selection:bg-black selection:text-white animate-in fade-in">
        {/* Top Header */}
        <ScreenHeader
          title="Event Details"
          onBack={() => setSelectedEvent(null)}
          backAriaLabel="Back to Calendar"
        />

        <div className="px-5 space-y-5 pt-2">
          {/* Hero Event Card */}
          <div className="bg-white border border-neutral-100 rounded-3xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex items-start justify-between">
            <div className="flex items-start space-x-3.5 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center text-black shrink-0 mt-0.5">
                {getEventIcon(selectedEvent.category)}
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-bold text-black leading-snug">
                  {selectedEvent.title}
                </h2>
                <p className="text-xs text-neutral-500 mt-1 font-medium">
                  {selectedEvent.dateStr}
                </p>
                <p className="text-xs text-neutral-500 mt-0.5 font-medium">
                  {selectedEvent.time}
                </p>
                <div className="flex items-center text-xs text-neutral-600 mt-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400 mr-1 shrink-0" />
                  <span className="truncate">{selectedEvent.location}</span>
                </div>
              </div>
            </div>

            <span className="shrink-0 ml-2 px-3 py-1 rounded-xl text-xs font-semibold bg-neutral-100 text-neutral-700 border border-neutral-200/80">
              {selectedEvent.category}
            </span>
          </div>

          {/* Description Section */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-black">Description</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              {selectedEvent.description}
            </p>
            <div className="border-b border-neutral-100/90 pt-3" />
          </section>

          {/* Additional Information Section */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-black">Additional Information</h3>
            <div className="bg-white border border-neutral-100 rounded-3xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] divide-y divide-neutral-100/80">
              {/* Row 1: Classes Involved */}
              <div className="py-3 first:pt-0 flex items-start justify-between gap-3 text-xs">
                <div className="flex items-center space-x-3 text-black font-semibold shrink-0">
                  <BookOpen className="w-4 h-4 text-black stroke-[1.8]" />
                  <span>Classes Involved</span>
                </div>
                <span className="text-neutral-600 text-right font-medium">
                  {selectedEvent.classesInvolved || 'Class 6 – All Sections'}
                </span>
              </div>

              {/* Row 2: Syllabus (if applicable) */}
              {selectedEvent.syllabus && (
                <div className="py-3 flex items-start justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-3 text-black font-semibold shrink-0">
                    <FileText className="w-4 h-4 text-black stroke-[1.8]" />
                    <span>Syllabus</span>
                  </div>
                  <span className="text-neutral-600 text-right font-medium">
                    {selectedEvent.syllabus}
                  </span>
                </div>
              )}

              {/* Row 3: Date & Time */}
              <div className="py-3 flex items-start justify-between gap-3 text-xs">
                <div className="flex items-center space-x-3 text-black font-semibold shrink-0">
                  <CalendarIcon className="w-4 h-4 text-black stroke-[1.8]" />
                  <span>Date & Time</span>
                </div>
                <div className="text-right font-medium text-neutral-600">
                  <p>{selectedEvent.dateStr}</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">{selectedEvent.time}</p>
                </div>
              </div>

              {/* Row 4: Location */}
              <div className="py-3 flex items-start justify-between gap-3 text-xs">
                <div className="flex items-center space-x-3 text-black font-semibold shrink-0">
                  <MapPin className="w-4 h-4 text-black stroke-[1.8]" />
                  <span>Location</span>
                </div>
                <span className="text-neutral-600 text-right font-medium">
                  {selectedEvent.location}
                </span>
              </div>

              {/* Row 5: Items to Bring */}
              {selectedEvent.itemsToBring && (
                <div className="py-3 last:pb-0 flex items-start justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-3 text-black font-semibold shrink-0">
                    <Pencil className="w-4 h-4 text-black stroke-[1.8]" />
                    <span>Items to Bring</span>
                  </div>
                  <div className="text-right font-medium text-neutral-600 max-w-[200px]">
                    {selectedEvent.itemsToBring.split(', ').map((item, idx) => (
                      <p key={idx}>{item}{idx < selectedEvent.itemsToBring!.split(', ').length - 1 ? ',' : ''}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SCREEN ONE: SCHOOL CALENDAR
  // =========================================================================
  return (
    <div className="min-h-full bg-white text-black font-sans pb-24 selection:bg-black selection:text-white">
      {/* Top Header */}
      <ScreenHeader
        title="School Calendar"
        subtitle="Stay updated with important dates"
        onBack={onBack}
        backAriaLabel="Back to Dashboard"
      />

      {/* Calendar Card Enclosure */}
      <section className="px-5">
        <div className="bg-white border border-neutral-100 rounded-3xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3">
          {/* Month Navigation Row */}
          <div className="flex items-center justify-between px-1">
            <button
              onClick={handlePrevMonth}
              className="p-1 rounded-full text-black hover:bg-neutral-100 transition-colors"
              aria-label="Previous Month"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2]" />
            </button>

            <div className="font-bold text-sm text-black select-none">
              {currentMonthName} {currentYear}
            </div>

            <button
              onClick={handleNextMonth}
              className="p-1 rounded-full text-black hover:bg-neutral-100 transition-colors"
              aria-label="Next Month"
            >
              <ChevronRight className="w-5 h-5 stroke-[2]" />
            </button>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 text-center pt-1 pb-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <span key={d} className="text-[11px] font-medium text-neutral-400">
                {d}
              </span>
            ))}
          </div>

          {/* Month Days Grid */}
          <div className="grid grid-cols-7 text-center gap-y-2">
            {calendarCells.map((cell, idx) => {
              const isSelected = cell.isCurrentMonth && cell.day === selectedDay;
              const isToday =
                cell.isCurrentMonth &&
                currentYear === todayIST.year &&
                currentMonthIndex === todayIST.monthIndex &&
                cell.day === todayIST.day;
              const hasDot = cell.isCurrentMonth && currentMonthIndex === 9 && OCTOBER_DOTS[cell.day];
              const dotColor = hasDot ? OCTOBER_DOTS[cell.day] : null;

              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (cell.isCurrentMonth) {
                      setSelectedDay(cell.day);
                    }
                  }}
                  title={isToday ? 'Today' : undefined}
                  className={`h-11 flex flex-col items-center justify-center relative cursor-pointer select-none transition-all ${
                    !cell.isCurrentMonth ? 'opacity-35 cursor-default' : ''
                  }`}
                >
                  {/* Selected Date Circle */}
                  {isSelected ? (
                    <div className="w-8 h-8 rounded-full bg-black text-white flex flex-col items-center justify-center font-bold text-xs shadow-xs relative">
                      <span>{cell.day}</span>
                      {/* Inner dot if selected */}
                      {dotColor && (
                        <span className={`w-1 h-1 rounded-full ${dotColor} absolute bottom-1`} />
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                          isToday
                            ? 'ring-1 ring-black text-black font-bold bg-neutral-100'
                            : cell.isCurrentMonth
                            ? 'text-neutral-800'
                            : 'text-neutral-400'
                        }`}
                      >
                        {cell.day}
                      </span>
                      {/* Indicator dot under unselected date */}
                      {dotColor ? (
                        <span className={`w-1.5 h-1.5 rounded-full ${dotColor} mt-0.5`} />
                      ) : (
                        <span className="w-1.5 h-1.5 mt-0.5" />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Category Legend matching mockup */}
          <div className="pt-2 border-t border-neutral-100/80 flex items-center justify-between text-[10.5px] px-0.5 flex-wrap gap-1">
            <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-neutral-50 border border-neutral-100 text-neutral-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Holiday</span>
            </div>
            <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-neutral-50 border border-neutral-100 text-neutral-600">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              <span>Event</span>
            </div>
            <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-neutral-50 border border-neutral-100 text-neutral-600">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
              <span>Exam</span>
            </div>
            <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-neutral-50 border border-neutral-100 text-neutral-600">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
              <span>Activity</span>
            </div>
            <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-neutral-50 border border-neutral-100 text-neutral-600">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span>Meeting</span>
            </div>
          </div>
        </div>
      </section>

      {/* Selected Day Events Section */}
      <section className="px-5 pt-5 space-y-2.5">
        <h3 className="text-sm font-bold text-black">{selectedDateHeader}</h3>

        {eventsOnSelectedDay.length > 0 ? (
          <div className="space-y-2.5">
            {eventsOnSelectedDay.map((event) => (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className="bg-white border border-neutral-100 rounded-2xl p-3.5 flex items-center justify-between hover:border-neutral-300 transition-all cursor-pointer shadow-[0_1px_4px_rgba(0,0,0,0.02)] group"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-neutral-100 flex items-center justify-center text-black shrink-0 group-hover:scale-102 transition-transform">
                    {getEventIcon(event.category)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-black truncate leading-snug">
                      {event.title}
                    </h4>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      {event.time}
                    </p>
                    <div className="flex items-center text-[10.5px] text-neutral-500 mt-0.5">
                      <MapPin className="w-3 h-3 text-neutral-400 mr-1 shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                </div>

                <span className="shrink-0 ml-2 px-2.5 py-1 rounded-xl text-[11px] font-medium bg-neutral-100 text-neutral-700 border border-neutral-200/60 self-start">
                  {event.category}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-5 text-center">
            <CalendarIcon className="w-6 h-6 text-neutral-400 mx-auto mb-1.5" />
            <p className="text-xs font-semibold text-black">No events scheduled for this day</p>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Select another date with event indicators above.
            </p>
          </div>
        )}
      </section>


    </div>
  );
};
