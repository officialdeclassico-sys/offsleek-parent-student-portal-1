import React, { useState } from 'react';
import { ChevronRight, Bell, X, CheckCircle2 } from 'lucide-react';
import { ScreenHeader } from './ScreenHeader';
import { DEMO_NOTIFICATIONS } from '../services/api';
import { NotificationItem } from '../types';
import { useAuth } from '../context/AuthContext';
import aaravAvatarDefault from '../assets/images/aarav_avatar.png';

export const NotificationsScreenView: React.FC<{ 
  onBack: () => void;
  onOpenProfile?: () => void;
}> = ({ onBack, onOpenProfile }) => {
  const { currentStudent, user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<'All' | 'Unread'>('All');
  const [notifications, setNotifications] = useState<NotificationItem[]>(DEMO_NOTIFICATIONS);
  const [selectedNotif, setSelectedNotif] = useState<NotificationItem | null>(null);

  const studentAvatar = currentStudent?.avatar || aaravAvatarDefault;
  const isStudent = user?.role === 'student';

  const filtered = activeFilter === 'All' 
    ? notifications 
    : notifications.filter(n => !n.read);

  const handleOpenNotif = (notif: NotificationItem) => {
    setSelectedNotif(notif);
    // Mark as read
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
  };

  return (
    <div className="min-h-full bg-white text-black flex flex-col font-sans pb-24 selection:bg-black selection:text-white">
      {/* Top Header */}
      <ScreenHeader
        title="Notifications"
        onBack={onBack}
        backAriaLabel="Back to Home"
        className="border-b border-neutral-100"
        rightAction={
          isStudent && (
            <button
              onClick={onOpenProfile}
              className="w-8 h-8 rounded-full overflow-hidden border border-neutral-200/90 shadow-2xs hover:border-neutral-400 transition-colors shrink-0"
              title="Profile"
            >
              <img
                src={studentAvatar}
                alt="Student Avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = aaravAvatarDefault;
                }}
              />
            </button>
          )
        }
      />

      <div className="p-5 space-y-4">
        {/* Filter Tabs */}
        <div className="flex space-x-2">
          {(['All', 'Unread'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeFilter === filter
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-[#fafafa] border border-neutral-200 text-neutral-600 hover:border-neutral-300'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Notifications Feed */}
        <div className="space-y-2.5">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-400 bg-neutral-50 rounded-2xl border border-neutral-200">
              No notifications to display.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => handleOpenNotif(item)}
                className="bg-white border border-neutral-200/90 rounded-2xl p-3.5 flex items-start justify-between shadow-2xs hover:border-neutral-400 cursor-pointer transition-all"
              >
                <div className="flex items-start space-x-3 pr-2 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700 shrink-0 mt-0.5">
                    <Bell className="w-4 h-4 stroke-[1.8]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-xs font-bold text-black leading-tight truncate">{item.title}</h4>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" title="Unread"></span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-600 line-clamp-1 mt-1">{item.message}</p>
                    <p className="text-[10px] text-neutral-400 mt-0.5 tabular-nums">{item.time}</p>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0 mt-2" />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedNotif && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6 z-50 animate-in fade-in">
          <div className="w-full max-w-sm bg-white text-black border border-neutral-200 p-6 rounded-3xl space-y-4 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-black">{selectedNotif.title}</h3>
                <p className="text-xs text-neutral-400 mt-0.5">{selectedNotif.time}</p>
              </div>
              <button onClick={() => setSelectedNotif(null)} className="text-neutral-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-700 leading-relaxed bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
              {selectedNotif.message}
            </p>

            <button
              onClick={() => setSelectedNotif(null)}
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
