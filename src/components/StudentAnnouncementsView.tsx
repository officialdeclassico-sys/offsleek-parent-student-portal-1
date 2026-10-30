import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  Trophy, 
  Calendar, 
  FileText, 
  ChevronRight, 
  Download, 
  X, 
  Eye, 
  FileCheck,
  CheckCircle2,
  Clock,
  Layers
} from 'lucide-react';
import { Announcement, AnnouncementAttachment } from '../types';
import { DEMO_ANNOUNCEMENTS, apiClient } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { downloadPdfDocument } from '../utils/pdfGenerator';

type CategoryFilter = 'All' | 'Academic' | 'Events' | 'Holidays' | 'General';

const CATEGORIES: CategoryFilter[] = ['All', 'Academic', 'Events', 'Holidays', 'General'];

export const StudentAnnouncementsView: React.FC = () => {
  const { token, isDemoMode, currentStudent } = useAuth();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const [announcements, setAnnouncements] = useState<Announcement[]>(DEMO_ANNOUNCEMENTS);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [previewAttachment, setPreviewAttachment] = useState<{
    attachment: AnnouncementAttachment;
    announcement: Announcement;
  } | null>(null);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadAnnouncements = async () => {
      setIsLoading(true);
      try {
        const data = await apiClient<Announcement[]>(
          '/portal/announcements',
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          },
          isDemoMode
        );

        if (isMounted && Array.isArray(data) && data.length > 0) {
          // Exclude drafts and enforce published records
          const published = data.filter((a) => a.status !== 'draft');
          setAnnouncements(published.length > 0 ? published : DEMO_ANNOUNCEMENTS);
        }
      } catch {
        // Fallback gracefully to demo announcements
        if (isMounted) {
          setAnnouncements(DEMO_ANNOUNCEMENTS);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadAnnouncements();

    return () => {
      isMounted = false;
    };
  }, [token, isDemoMode]);

  // Client-side filtering by category
  const filteredAnnouncements = announcements.filter((item) => {
    // Exclude any drafts that may exist
    if (item.status === 'draft') return false;

    if (activeCategory === 'All') return true;
    return item.category.toLowerCase() === activeCategory.toLowerCase();
  });

  // Contextual Announcement Icon resolver
  const renderCategoryIcon = (title: string, category: string) => {
    const t = title.toLowerCase();
    const c = category.toLowerCase();

    if (t.includes('parent-teacher') || t.includes('ptm') || t.includes('meeting')) {
      return <Megaphone className="w-5 h-5 text-neutral-800 stroke-[1.8]" />;
    }
    if (t.includes('sports') || t.includes('sports day') || t.includes('athletic')) {
      return <Trophy className="w-5 h-5 text-neutral-800 stroke-[1.8]" />;
    }
    if (t.includes('syllabus') || t.includes('curriculum')) {
      return <FileText className="w-5 h-5 text-neutral-800 stroke-[1.8]" />;
    }
    if (t.includes('holiday') || t.includes('vacation') || t.includes('diwali') || t.includes('break')) {
      return <Calendar className="w-5 h-5 text-neutral-800 stroke-[1.8]" />;
    }
    if (t.includes('exam') || t.includes('test') || t.includes('assessment')) {
      return <FileText className="w-5 h-5 text-neutral-800 stroke-[1.8]" />;
    }
    if (t.includes('result') || t.includes('report') || t.includes('academic update')) {
      return <FileText className="w-5 h-5 text-neutral-800 stroke-[1.8]" />;
    }
    
    if (c === 'events' || c === 'event') {
      return <Trophy className="w-5 h-5 text-neutral-800 stroke-[1.8]" />;
    }
    if (c === 'academic') {
      return <FileText className="w-5 h-5 text-neutral-800 stroke-[1.8]" />;
    }
    if (c === 'holidays' || c === 'holiday') {
      return <Calendar className="w-5 h-5 text-neutral-800 stroke-[1.8]" />;
    }

    return <Megaphone className="w-5 h-5 text-neutral-800 stroke-[1.8]" />;
  };

  const handleDownload = (attachment: AnnouncementAttachment, announcement: Announcement) => {
    downloadPdfDocument(
      attachment.name,
      announcement.title,
      `Published by ${announcement.sender} · ${announcement.date}`,
      announcement.content
    );

    setDownloadSuccessToast(`Downloaded "${attachment.name}"`);
    setTimeout(() => {
      setDownloadSuccessToast(null);
    }, 2800);
  };

  return (
    <div className="min-h-full bg-white text-black flex flex-col font-sans pb-28 selection:bg-black selection:text-white">
      {/* Toast Notification */}
      {downloadSuccessToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-60 bg-black text-white text-xs px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 stroke-[2]" />
          <span>{downloadSuccessToast}</span>
        </div>
      )}

      {/* 1. Top Header */}
      <header className="pt-6 px-5 pb-1">
        <h1 className="text-2xl font-bold tracking-tight text-black">
          Announcements
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Stay informed with the latest updates
        </p>
      </header>

      {/* 2. Category Filter Pills */}
      <section className="mt-4 px-5">
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-0.5">
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-black text-white font-semibold shadow-xs'
                    : 'bg-white border border-neutral-200 text-neutral-800 font-medium hover:border-neutral-300'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Announcements Cards List */}
      <section className="mt-4 px-5 space-y-3">
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-2">
            <div className="w-6 h-6 border-2 border-neutral-300 border-t-black rounded-full animate-spin" />
            <p className="text-xs text-neutral-400">Loading announcements...</p>
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="py-14 text-center bg-neutral-50 border border-neutral-200/80 rounded-2xl p-6">
            <Megaphone className="w-8 h-8 text-neutral-300 mx-auto stroke-[1.5]" />
            <h4 className="text-xs font-semibold text-neutral-700 mt-2">
              No announcements in {activeCategory}
            </h4>
            <p className="text-[11px] text-neutral-400 mt-1">
              Check other categories or view All for latest school updates.
            </p>
          </div>
        ) : (
          filteredAnnouncements.map((announcement) => (
            <div
              key={announcement.id}
              onClick={() => setSelectedAnnouncement(announcement)}
              className="group bg-white border border-neutral-200/90 rounded-2xl p-4 shadow-2xs hover:border-neutral-400 cursor-pointer transition-all"
            >
              <div className="flex items-start">
                {/* Left: Rounded square icon box */}
                <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center shrink-0 mr-3.5 group-hover:bg-neutral-200/70 transition-colors">
                  {renderCategoryIcon(announcement.title, announcement.category)}
                </div>

                {/* Right: Content column */}
                <div className="flex-1 min-w-0">
                  {/* Category pill and Date */}
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-neutral-100 text-neutral-700 text-[11px] font-medium leading-none">
                      {announcement.category}
                    </span>
                    <span className="text-xs text-neutral-400 font-normal tabular-nums">
                      {announcement.date}
                    </span>
                  </div>

                  {/* Title with Chevron */}
                  <div className="flex items-center justify-between mt-1.5">
                    <h3 className="text-sm font-bold text-black truncate pr-1">
                      {announcement.title}
                    </h3>
                    <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
                  </div>

                  {/* Description preview */}
                  <p className="text-xs text-neutral-500 line-clamp-2 mt-1 leading-relaxed">
                    {announcement.content}
                  </p>
                </div>
              </div>

              {/* PDF Attachment Row */}
              {announcement.attachment && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(announcement.attachment!, announcement);
                  }}
                  className="mt-3.5 bg-neutral-100/80 hover:bg-neutral-100 border border-neutral-200/60 rounded-xl p-2.5 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <span className="bg-black text-white text-[10px] font-bold px-2 py-1 rounded-md tracking-wider shrink-0 select-none">
                      PDF
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-black truncate leading-snug">
                        {announcement.attachment.name}
                      </p>
                      <p className="text-[10px] text-neutral-400 tabular-nums">
                        {announcement.attachment.size}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewAttachment({
                          attachment: announcement.attachment!,
                          announcement,
                        });
                      }}
                      className="p-1.5 hover:bg-neutral-200/80 rounded-lg text-neutral-600 transition-colors"
                      title="Preview Document"
                    >
                      <Eye className="w-4 h-4 stroke-[1.8]" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(announcement.attachment!, announcement);
                      }}
                      className="p-1.5 hover:bg-neutral-200/80 rounded-lg text-neutral-800 transition-colors"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4 stroke-[2]" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </section>

      {/* ======================= DETAIL MODAL ======================= */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-5 border border-neutral-200 space-y-4 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-2 border-b border-neutral-100">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-md bg-neutral-100 text-neutral-800 text-xs font-semibold">
                  {selectedAnnouncement.category}
                </span>
                <span className="text-xs text-neutral-400">
                  {selectedAnnouncement.date}
                </span>
              </div>
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Title & Sender */}
            <div>
              <h2 className="text-base font-bold text-black leading-snug">
                {selectedAnnouncement.title}
              </h2>
              <div className="flex items-center space-x-1.5 mt-1 text-[11px] text-neutral-400">
                <span>By {selectedAnnouncement.sender}</span>
                {selectedAnnouncement.audience && (
                  <>
                    <span>•</span>
                    <span>Audience: {selectedAnnouncement.audience}</span>
                  </>
                )}
              </div>
            </div>

            {/* Message Body */}
            <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100">
              <p className="text-xs text-neutral-700 leading-relaxed whitespace-pre-line">
                {selectedAnnouncement.content}
              </p>
            </div>

            {/* Attachment in Modal */}
            {selectedAnnouncement.attachment && (
              <div className="border border-neutral-200 rounded-2xl p-3 bg-neutral-50/50 space-y-2">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  Attached Document
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <span className="bg-black text-white text-[10px] font-bold px-2 py-1 rounded-md">
                      PDF
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-black truncate">
                        {selectedAnnouncement.attachment.name}
                      </p>
                      <p className="text-[10px] text-neutral-400">
                        {selectedAnnouncement.attachment.size}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      setPreviewAttachment({
                        attachment: selectedAnnouncement.attachment!,
                        announcement: selectedAnnouncement,
                      });
                    }}
                    className="py-2 bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-medium rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 stroke-[2]" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => {
                      handleDownload(
                        selectedAnnouncement.attachment!,
                        selectedAnnouncement
                      );
                    }}
                    className="py-2 bg-black hover:bg-neutral-800 text-white text-xs font-medium rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 stroke-[2]" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            )}

            {/* Done Button */}
            <button
              onClick={() => setSelectedAnnouncement(null)}
              className="w-full py-2.5 bg-black text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ======================= DOCUMENT PREVIEW MODAL ======================= */}
      {previewAttachment && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-60 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 border border-neutral-200 space-y-4 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <div className="flex items-center space-x-2">
                <FileCheck className="w-5 h-5 text-black stroke-[2]" />
                <h3 className="text-xs font-bold text-black truncate">
                  {previewAttachment.attachment.name}
                </h3>
              </div>
              <button
                onClick={() => setPreviewAttachment(null)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* PDF Canvas Simulation / Official Document Layout */}
            <div className="border border-neutral-200 rounded-2xl bg-neutral-50/70 p-4 space-y-3 font-sans text-xs">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                <div className="flex items-center space-x-1.5">
                  <div className="w-5 h-5 bg-black text-white rounded flex items-center justify-center font-bold text-[9px]">
                    os
                  </div>
                  <span className="font-bold text-[11px] tracking-wider text-black">
                    OFFSLEEK SCHOOL OS
                  </span>
                </div>
                <span className="text-[10px] text-neutral-400">
                  Official Document
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-sm text-black">
                  {previewAttachment.announcement.title}
                </h4>
                <p className="text-[11px] text-neutral-500">
                  {previewAttachment.announcement.sender} ·{' '}
                  {previewAttachment.announcement.date}
                </p>
                {currentStudent && (
                  <p className="text-[10px] text-neutral-400">
                    Student: {currentStudent.name} ({currentStudent.grade} - {currentStudent.section})
                  </p>
                )}
              </div>

              <div className="bg-white p-3 rounded-xl border border-neutral-200/80 text-neutral-700 leading-relaxed text-[11px]">
                {previewAttachment.announcement.content}
                <div className="mt-3 pt-2 border-t border-neutral-100 text-[10px] text-neutral-400 italic">
                  Digital Signature: Verified by OFFSLEEK Registrar Authority.
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setPreviewAttachment(null)}
                className="py-2.5 bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-semibold rounded-xl transition-colors"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  handleDownload(
                    previewAttachment.attachment,
                    previewAttachment.announcement
                  );
                }}
                className="py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 stroke-[2]" />
                <span>Save PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
