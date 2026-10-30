import React, { useState } from 'react';
import { ChevronRight, Megaphone, Trophy, Calendar, FileText, BookOpen, X } from 'lucide-react';
import { ScreenHeader } from './ScreenHeader';
import { DEMO_ANNOUNCEMENTS } from '../services/api';
import { Announcement } from '../types';

export const AnnouncementsFeedView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Academic' | 'Events'>('All');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const filtered = activeFilter === 'All' 
    ? DEMO_ANNOUNCEMENTS 
    : DEMO_ANNOUNCEMENTS.filter(a => a.category === activeFilter);

  const getCategoryIcon = (title: string, category: string) => {
    const t = title.toLowerCase();
    const c = category.toLowerCase();

    if (t.includes('parent-teacher') || t.includes('ptm') || t.includes('meeting')) {
      return <Megaphone className="w-5 h-5 stroke-[1.8]" />;
    }
    if (t.includes('sports') || t.includes('sports day') || t.includes('athletic')) {
      return <Trophy className="w-5 h-5 stroke-[1.8]" />;
    }
    if (t.includes('syllabus') || t.includes('curriculum')) {
      return <FileText className="w-5 h-5 stroke-[1.8]" />;
    }
    if (t.includes('holiday') || t.includes('vacation') || t.includes('diwali') || t.includes('break')) {
      return <Calendar className="w-5 h-5 stroke-[1.8]" />;
    }
    if (t.includes('exam') || t.includes('test') || t.includes('assessment')) {
      return <FileText className="w-5 h-5 stroke-[1.8]" />;
    }
    if (t.includes('result') || t.includes('report') || t.includes('academic update')) {
      return <FileText className="w-5 h-5 stroke-[1.8]" />;
    }
    
    if (c === 'events' || c === 'event') {
      return <Trophy className="w-5 h-5 stroke-[1.8]" />;
    }
    if (c === 'academic') {
      return <FileText className="w-5 h-5 stroke-[1.8]" />;
    }
    if (c === 'holidays' || c === 'holiday') {
      return <Calendar className="w-5 h-5 stroke-[1.8]" />;
    }

    return <Megaphone className="w-5 h-5 stroke-[1.8]" />;
  };

  return (
    <div className="min-h-full bg-white text-black flex flex-col font-sans pb-24 selection:bg-black selection:text-white">
      {/* Top Bar matching Screen 8 */}
      <ScreenHeader
        title="Announcements"
        onBack={onBack}
        backAriaLabel="Back to Home"
        className="border-b border-neutral-100"
      />

      <div className="p-4 space-y-4">
        {/* Filter Pills matching Screen 8 */}
        <div className="flex space-x-2">
          {(['All', 'Academic', 'Events'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeFilter === cat
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-[#fafafa] border border-neutral-200 text-neutral-600 hover:border-neutral-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Announcements List matching Screen 8 */}
        <div className="space-y-2.5">
          {filtered.map((ann) => (
            <div
              key={ann.id}
              onClick={() => setSelectedAnnouncement(ann)}
              className="bg-white border border-neutral-200/90 rounded-2xl p-4 flex items-center justify-between shadow-xs hover:border-neutral-400 cursor-pointer transition-all"
            >
              <div className="flex items-start space-x-3.5 pr-2">
                <div className="w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-700 shrink-0 mt-0.5">
                  {getCategoryIcon(ann.title, ann.category)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-bold text-black leading-tight">{ann.title}</h4>
                    {ann.unread && (
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" title="Unread"></span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-0.5">{ann.date}</p>
                  <p className="text-xs text-neutral-600 line-clamp-1 mt-1">{ann.content}</p>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0" />
            </div>
          ))}
        </div>

      </div>

      {/* Announcement Detail Modal */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6 z-50">
          <div className="w-full max-w-sm bg-white text-black border border-neutral-200 p-6 rounded-3xl space-y-4 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  {selectedAnnouncement.category}
                </span>
                <h3 className="text-base font-bold text-black mt-1.5">{selectedAnnouncement.title}</h3>
                <p className="text-xs text-neutral-400 mt-0.5">{selectedAnnouncement.date} • {selectedAnnouncement.sender}</p>
              </div>
              <button onClick={() => setSelectedAnnouncement(null)} className="text-neutral-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-700 leading-relaxed bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
              {selectedAnnouncement.content}
            </p>

            <button
              onClick={() => setSelectedAnnouncement(null)}
              className="w-full py-2.5 bg-black text-white text-xs font-semibold rounded-xl hover:bg-neutral-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
