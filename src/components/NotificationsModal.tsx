import React from 'react';
import { Bell, Check, X, Calendar, CreditCard, Megaphone, FileText } from 'lucide-react';
import { DEMO_NOTIFICATIONS } from '../services/api';

export const NotificationsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const getIcon = (category: string) => {
    switch (category) {
      case 'attendance': return <Calendar className="w-4 h-4 text-emerald-600" />;
      case 'fee': return <CreditCard className="w-4 h-4 text-red-500" />;
      case 'announcement': return <Megaphone className="w-4 h-4 text-blue-500" />;
      default: return <FileText className="w-4 h-4 text-purple-500" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6 z-50">
      <div className="w-full max-w-sm bg-white text-black border border-neutral-200 p-6 rounded-3xl space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-black" />
            <h3 className="text-base font-bold text-black">Notifications</h3>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-black">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {DEMO_NOTIFICATIONS.map((n) => (
            <div
              key={n.id}
              className={`p-3 rounded-2xl border transition-all ${
                !n.read ? 'bg-neutral-50/80 border-neutral-200' : 'bg-white border-neutral-100'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0">
                  {getIcon(n.category)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-black">{n.title}</h4>
                    <span className="text-[10px] text-neutral-400">{n.time}</span>
                  </div>
                  <p className="text-xs text-neutral-600 mt-0.5">{n.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-black text-white text-xs font-semibold rounded-xl hover:bg-neutral-800"
        >
          Close
        </button>
      </div>
    </div>
  );
};
