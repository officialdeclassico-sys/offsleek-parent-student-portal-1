import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ChevronRight, FileText, Download, Award, BarChart2, History, X, CheckCircle2 } from 'lucide-react';
import { ScreenHeader } from './ScreenHeader';
import { DEMO_MARKSHEET } from '../services/api';

export const ExamsReportCardsView: React.FC<{ 
  onBack: () => void; 
  onSwitchChild?: () => void;
  defaultTab?: 'Exam Results' | 'Report Cards';
  title?: string;
}> = ({ onBack, onSwitchChild, defaultTab = 'Exam Results', title }) => {
  const { currentStudent, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'Exam Results' | 'Report Cards'>(defaultTab);
  const [isPastModalOpen, setIsPastModalOpen] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  React.useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  const isStudent = user?.role === 'student';

  // Demo subject marks matching reference screenshot 2
  const resultsData = [
    { subject: 'English', grade: 'A', marks: '85/100' },
    { subject: 'Mathematics', grade: 'A+', marks: '92/100' },
    { subject: 'Science', grade: 'A', marks: '88/100' },
    { subject: 'Social Science', grade: 'B+', marks: '78/100' },
    { subject: 'Hindi', grade: 'A', marks: '84/100' },
  ];

  const handleDownloadReport = (title: string) => {
    setDownloadSuccess(`Downloaded ${title} for ${currentStudent?.name || 'student'}`);
    setTimeout(() => {
      setDownloadSuccess(null);
    }, 2500);
  };

  return (
    <div className="min-h-full bg-white text-black flex flex-col font-sans pb-24 selection:bg-black selection:text-white">
      {/* 1. Top Bar matching Screen 2 */}
      <ScreenHeader
        title={title || 'Results'}
        onBack={onBack}
        backAriaLabel="Back to Home"
        className="border-b border-neutral-100"
      />

      {/* Download Toast Notification */}
      {downloadSuccess && (
        <div className="mx-4 mt-2 p-3 bg-neutral-900 text-white rounded-xl text-xs flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* 2. Two Underline Tabs matching Screen 2: Exam Results | Report Cards */}
      <div className="px-4 border-b border-neutral-200/80 flex space-x-6 text-sm">
        <button
          onClick={() => setActiveTab('Exam Results')}
          className={`py-3 text-xs sm:text-sm font-semibold transition-all relative ${
            activeTab === 'Exam Results'
              ? 'text-black border-b-2 border-black'
              : 'text-neutral-500 hover:text-black border-b-2 border-transparent'
          }`}
        >
          Exam Results
        </button>

        <button
          onClick={() => setActiveTab('Report Cards')}
          className={`py-3 text-xs sm:text-sm font-semibold transition-all relative ${
            activeTab === 'Report Cards'
              ? 'text-black border-b-2 border-black'
              : 'text-neutral-500 hover:text-black border-b-2 border-transparent'
          }`}
        >
          Report Cards
        </button>
      </div>

      <div className="p-4 space-y-3.5">
        
        {/* Tab 1: Exam Results */}
        {activeTab === 'Exam Results' && (
          <>
            {/* Card 1: Latest Results Card matching Screen 2 */}
            <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <BarChart2 className="w-4.5 h-4.5 stroke-[2]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-black leading-tight">Latest Results</h3>
                    <p className="text-xs text-neutral-500">Term 1 · 2025</p>
                  </div>
                </div>

                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
                  Published
                </span>
              </div>

              {/* Subject Breakdown Table matching reference screenshot */}
              <div className="divide-y divide-neutral-100 pt-1">
                {resultsData.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <span className="text-neutral-700 font-medium">{item.subject}</span>
                    <div className="flex items-center space-x-6">
                      <span className="font-bold text-black w-6 text-center">{item.grade}</span>
                      <span className="text-neutral-500 w-14 text-right">{item.marks}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2: Overall Grade Card matching Screen 2 */}
            <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Award className="w-4.5 h-4.5 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-black leading-tight">Overall Grade</h3>
                  <p className="text-xs text-neutral-500">Term 1 · 2025</p>
                </div>
              </div>

              <span className="text-xl font-bold text-blue-600 pr-1">
                A
              </span>
            </div>

            {/* Card 3: Past Results Card matching Screen 2 */}
            <div
              onClick={() => setIsPastModalOpen(true)}
              className="bg-white border border-neutral-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between cursor-pointer hover:border-neutral-300 transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center">
                  <History className="w-4.5 h-4.5 stroke-[1.8]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-black leading-tight">Past Results</h3>
                  <p className="text-xs text-neutral-500">View previous exam results</p>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </div>

            {/* Section: Report Cards List matching Screen 2 */}
            <div className="pt-2 space-y-2">
              <h3 className="text-sm font-bold text-black">Report Cards</h3>

              {/* Term 1 Report Card */}
              <div className="bg-white border border-neutral-200/90 rounded-2xl p-3.5 shadow-2xs flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <FileText className="w-4.5 h-4.5 stroke-[2]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-black leading-tight">Term 1 Report Card</h4>
                    <p className="text-[10px] text-neutral-500 mt-0.5">Published on 5 Oct 2025</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDownloadReport('Term 1 Report Card')}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors"
                  title="Download Report Card"
                >
                  <Download className="w-4 h-4 stroke-[2]" />
                </button>
              </div>

              {/* Annual Report Card */}
              <div className="bg-white border border-neutral-200/90 rounded-2xl p-3.5 shadow-2xs flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <FileText className="w-4.5 h-4.5 stroke-[2]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-black leading-tight">Annual Report Card</h4>
                    <p className="text-[10px] text-neutral-500 mt-0.5">Published on 25 Mar 2025</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDownloadReport('Annual Report Card')}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors"
                  title="Download Report Card"
                >
                  <Download className="w-4 h-4 stroke-[2]" />
                </button>
              </div>
            </div>
          </>
        )}

        {/* Tab 2: Report Cards Dedicated View */}
        {activeTab === 'Report Cards' && (
          <div className="space-y-3">
            <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Award className="w-4.5 h-4.5 stroke-[2]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-black">Official Term 1 Report Card</h3>
                    <p className="text-xs text-neutral-500">Academic Year 2024-2025</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  GPA 3.8
                </span>
              </div>

              <div className="bg-neutral-50 p-3 rounded-xl text-xs text-neutral-600 my-3 border border-neutral-100">
                <p><span className="font-semibold text-black">Teacher Remarks:</span> "{DEMO_MARKSHEET.teacherRemarks}"</p>
              </div>

              <button
                onClick={() => handleDownloadReport('Official Term 1 Report Card')}
                className="w-full py-2.5 bg-black text-white text-xs font-semibold rounded-xl flex items-center justify-center space-x-2 hover:bg-neutral-800 transition-colors shadow-2xs"
              >
                <Download className="w-4 h-4" />
                <span>Download Verified PDF Report Card</span>
              </button>
            </div>

            <div className="bg-white border border-neutral-200/90 rounded-2xl p-3.5 shadow-2xs flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <FileText className="w-4.5 h-4.5 stroke-[2]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-black leading-tight">Previous Annual Report Card</h4>
                  <p className="text-[10px] text-neutral-500 mt-0.5">Published on 25 Mar 2025 · Verified</p>
                </div>
              </div>

              <button
                onClick={() => handleDownloadReport('Annual Report Card 2024-2025')}
                className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors"
                title="Download Report Card"
              >
                <Download className="w-4 h-4 stroke-[2]" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Past Results Modal */}
      {isPastModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white text-black rounded-t-3xl sm:rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <h3 className="text-base font-bold text-black">Past Results Archives</h3>
              <button
                onClick={() => setIsPastModalOpen(false)}
                className="p-1 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              <div className="p-3.5 rounded-2xl border border-neutral-200 bg-neutral-50 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-black">Annual Examination 2024</p>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Grade A · 91.4%</span>
                </div>
                <p className="text-[11px] text-neutral-500">Published on 25 Mar 2024 · All 5 subjects cleared</p>
              </div>

              <div className="p-3.5 rounded-2xl border border-neutral-200 bg-neutral-50 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-black">Mid-Term Examination 2024</p>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Grade A+ · 95.0%</span>
                </div>
                <p className="text-[11px] text-neutral-500">Published on 18 Oct 2024 · Class Topper</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
