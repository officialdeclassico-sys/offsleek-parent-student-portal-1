import React from 'react';
import { Megaphone, MapPin, FileText, Settings, Bell, X, ShieldAlert, Calendar, Clock, BookOpen, Users, CreditCard } from 'lucide-react';
import { ScreenType } from './ParentDashboardView';
import { useAuth } from '../context/AuthContext';
import { OffsleekLogo } from './OffsleekLogo';

export const MoreServicesSheet: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: ScreenType) => void;
  onOpenTests?: () => void;
}> = ({ isOpen, onClose, onNavigate, onOpenTests }) => {
  const { user } = useAuth();
  if (!isOpen) return null;

  const isStudent = user?.role === 'student';

  const studentServices = [
    { id: 'announcements' as ScreenType, label: 'Announcements', desc: 'School circulars & notices', icon: Megaphone, color: 'text-blue-600 bg-blue-50' },
    { id: 'trips' as ScreenType, label: 'Trips & Events', desc: 'Picnics, sports & fests', icon: MapPin, color: 'text-indigo-600 bg-indigo-50' },
    { id: 'documents' as ScreenType, label: 'Academic Documents', desc: 'Certificates & transcripts', icon: FileText, color: 'text-neutral-800 bg-neutral-100' },
    { id: 'notifications' as ScreenType, label: 'Notifications', desc: 'Alerts & updates feed', icon: Bell, color: 'text-amber-600 bg-amber-50' },
    { id: 'profile' as ScreenType, label: 'Profile & Settings', desc: 'My profile & password', icon: Settings, color: 'text-neutral-800 bg-neutral-100' },
  ];

  const parentServices = [
    { id: 'children' as ScreenType, label: 'Children / Switch Child', desc: 'Linked student profiles', icon: Users, color: 'text-neutral-900 bg-neutral-100' },
    { id: 'timetable' as ScreenType, label: 'Exam Timetable', desc: 'Schedules & dates', icon: Clock, color: 'text-blue-600 bg-blue-50' },
    { id: 'announcements' as ScreenType, label: 'Announcements', desc: 'Circulars & notices', icon: Megaphone, color: 'text-amber-600 bg-amber-50' },
    { id: 'trips' as ScreenType, label: 'Trips & Events', desc: 'Consents & registrations', icon: MapPin, color: 'text-indigo-600 bg-indigo-50' },
    { id: 'documents' as ScreenType, label: 'Document Requests', desc: 'Certificates & transcripts', icon: FileText, color: 'text-neutral-700 bg-neutral-100' },
    { id: 'profile' as ScreenType, label: 'Profile & Settings', desc: 'Account & preferences', icon: Settings, color: 'text-neutral-800 bg-neutral-100' },
  ];

  const services = isStudent ? studentServices : parentServices;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="w-full max-w-[420px] bg-white text-black rounded-t-3xl sm:rounded-3xl p-5 space-y-4 shadow-2xl animate-in slide-in-from-bottom-5">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-white border border-neutral-200/90 shadow-2xs flex items-center justify-center p-1 shrink-0 overflow-hidden">
              <OffsleekLogo variant="mark" imgClassName="h-6 w-auto" showSubtitle={false} />
            </div>
            <div>
              <h3 className="text-base font-bold text-black leading-tight">
                {isStudent ? 'Student Services' : 'All School Services'}
              </h3>
              <p className="text-xs text-neutral-500">
                {isStudent ? 'Quick access to student modules' : 'Quick access to parent portal modules'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-black">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {services.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className="p-3 rounded-2xl border border-neutral-200/90 hover:border-black text-left flex flex-col justify-between transition-all bg-[#fafafa] hover:bg-white"
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${item.color} mb-2`}>
                  <Icon className="w-4 h-4 stroke-[2]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-black">{item.label}</h4>
                  <p className="text-[10px] text-neutral-500 mt-0.5">{item.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {onOpenTests && (
          <div className="pt-2 border-t border-neutral-100">
            <button
              onClick={() => {
                onClose();
                onOpenTests();
              }}
              className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
            >
              <ShieldAlert className="w-4 h-4 text-black" />
              <span>Run 9 Security & Safeguard Tests</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
