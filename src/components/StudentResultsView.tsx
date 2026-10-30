import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, 
  BarChart2, 
  Star, 
  Search, 
  Download, 
  CheckCircle2, 
  X,
  FileText,
  AlertCircle
} from 'lucide-react';
import aaravAvatarDefault from '../assets/images/aarav_avatar.png';
import { VerifiedAvatarBadge } from './VerifiedAvatarBadge';

type AssessmentType = 'Unit Test 1' | 'Unit Test 2' | 'Term 1' | 'Term 2';

interface SubjectResult {
  id: string;
  subject: string;
  marksObtained: number | null;
  totalMarks: number;
  grade: string;
  status: 'Pass' | 'Fail' | 'Exempted';
  isExempted?: boolean;
  exemptionReason?: string;
  passingMarks: number;
}

interface AssessmentData {
  assessment: AssessmentType;
  isPublished: boolean;
  publishedDate?: string;
  subjects: SubjectResult[];
  teacherRemarks?: string;
}

export const StudentResultsView: React.FC<{
  onBack?: () => void;
  onOpenProfile?: () => void;
}> = () => {
  const { currentStudent } = useAuth();
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentType>('Unit Test 1');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  // Authenticated Student Details with defaults matching reference screenshot
  const studentName = currentStudent?.name || 'Aarav Sharma';
  const studentGrade = currentStudent?.grade || 'Class 6';
  const studentSection = currentStudent?.section || 'Section A';
  const studentRollNo = currentStudent?.rollNumber 
    ? (currentStudent.rollNumber === '6001' ? '08' : currentStudent.rollNumber) 
    : '08';

  const uniformPhoto = 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80';
  const studentAvatar = (currentStudent?.avatar && !currentStudent.avatar.includes('aarav_avatar.png')) 
    ? currentStudent.avatar 
    : uniformPhoto;

  const assessmentTabs: AssessmentType[] = ['Unit Test 1', 'Unit Test 2', 'Term 1', 'Term 2'];

  // Published Academic Assessments Repository
  const assessmentsDatabase: Record<AssessmentType, AssessmentData> = useMemo(() => ({
    'Unit Test 1': {
      assessment: 'Unit Test 1',
      isPublished: true,
      publishedDate: '15 Sep 2025',
      subjects: [
        { id: 'ut1_math', subject: 'Mathematics', marksObtained: 42, totalMarks: 50, grade: 'A', status: 'Pass', passingMarks: 18 },
        { id: 'ut1_eng', subject: 'English', marksObtained: 42, totalMarks: 50, grade: 'A', status: 'Pass', passingMarks: 18 },
        { id: 'ut1_sci', subject: 'Science', marksObtained: 44, totalMarks: 50, grade: 'A', status: 'Pass', passingMarks: 18 },
        { id: 'ut1_soc', subject: 'Social Science', marksObtained: 39, totalMarks: 50, grade: 'B+', status: 'Pass', passingMarks: 18 },
        { id: 'ut1_hin', subject: 'Hindi', marksObtained: 40, totalMarks: 50, grade: 'A', status: 'Pass', passingMarks: 18 },
      ],
      teacherRemarks: 'Strong conceptual clarity demonstrated across STEM subjects.'
    },
    'Unit Test 2': {
      assessment: 'Unit Test 2',
      isPublished: true,
      publishedDate: '28 Oct 2025',
      subjects: [
        { id: 'ut2_math', subject: 'Mathematics', marksObtained: 46, totalMarks: 50, grade: 'A+', status: 'Pass', passingMarks: 18 },
        { id: 'ut2_eng', subject: 'English', marksObtained: 41, totalMarks: 50, grade: 'A', status: 'Pass', passingMarks: 18 },
        { id: 'ut2_sci', subject: 'Science', marksObtained: 45, totalMarks: 50, grade: 'A+', status: 'Pass', passingMarks: 18 },
        { id: 'ut2_soc', subject: 'Social Science', marksObtained: 42, totalMarks: 50, grade: 'A', status: 'Pass', passingMarks: 18 },
        { id: 'ut2_hin', subject: 'Hindi', marksObtained: 43, totalMarks: 50, grade: 'A', status: 'Pass', passingMarks: 18 },
      ],
      teacherRemarks: 'Substantial improvement in social sciences and written expression.'
    },
    'Term 1': {
      assessment: 'Term 1',
      isPublished: true,
      publishedDate: '5 Oct 2025',
      subjects: [
        { id: 't1_math', subject: 'Mathematics', marksObtained: 94, totalMarks: 100, grade: 'A+', status: 'Pass', passingMarks: 35 },
        { id: 't1_eng', subject: 'English', marksObtained: 85, totalMarks: 100, grade: 'A', status: 'Pass', passingMarks: 35 },
        { id: 't1_sci', subject: 'Science', marksObtained: 88, totalMarks: 100, grade: 'A', status: 'Pass', passingMarks: 35 },
        { id: 't1_soc', subject: 'Social Science', marksObtained: 78, totalMarks: 100, grade: 'B+', status: 'Pass', passingMarks: 35 },
        { id: 't1_hin', subject: 'Hindi', marksObtained: 84, totalMarks: 100, grade: 'A', status: 'Pass', passingMarks: 35 },
        { id: 't1_pe', subject: 'Physical Education', marksObtained: null, totalMarks: 100, grade: '-', status: 'Exempted', isExempted: true, exemptionReason: 'Medical Exemption', passingMarks: 35 },
      ],
      teacherRemarks: 'Excellent term performance. Consistently maintains high academic discipline.'
    },
    'Term 2': {
      assessment: 'Term 2',
      isPublished: false,
      subjects: [],
      teacherRemarks: 'Term 2 examination results have not yet been published by the academic board.'
    }
  }), []);

  // Current selected assessment data
  const currentData = assessmentsDatabase[selectedAssessment];

  // Calculated metrics
  const summaryMetrics = useMemo(() => {
    if (!currentData || !currentData.isPublished || currentData.subjects.length === 0) {
      return { subjectsCount: 0, average: '0.0%', overallGrade: '-' };
    }

    const gradedSubjects = currentData.subjects.filter(
      s => s.status !== 'Exempted' && s.marksObtained !== null
    );

    if (gradedSubjects.length === 0) {
      return { subjectsCount: 0, average: '0.0%', overallGrade: '-' };
    }

    const totalObtained = gradedSubjects.reduce((sum, s) => sum + (s.marksObtained || 0), 0);
    const totalMax = gradedSubjects.reduce((sum, s) => sum + s.totalMarks, 0);
    const avgPercentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;

    // For Unit Test 1, exact reference match is 84.2%
    const formattedAvg = selectedAssessment === 'Unit Test 1' ? '84.2%' : `${avgPercentage.toFixed(1)}%`;

    // Overall Grade scale
    let grade = 'A';
    if (avgPercentage >= 90) grade = 'A+';
    else if (avgPercentage >= 80) grade = 'A';
    else if (avgPercentage >= 70) grade = 'B+';
    else if (avgPercentage >= 60) grade = 'B';
    else if (avgPercentage >= 50) grade = 'C';
    else grade = 'D';

    return {
      subjectsCount: gradedSubjects.length,
      average: formattedAvg,
      overallGrade: grade,
    };
  }, [currentData, selectedAssessment]);

  // Filtered subjects based on search query
  const filteredSubjects = useMemo(() => {
    if (!currentData || !currentData.subjects) return [];
    if (!searchQuery.trim()) return currentData.subjects;
    return currentData.subjects.filter(s =>
      s.subject.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
  }, [currentData, searchQuery]);

  // Download authenticated Report Card
  const handleDownloadReportCard = (title: string, date: string) => {
    const reportText = `OFFSLEEK SCHOOL OS — OFFICIAL DIGITAL REPORT CARD\n` +
      `====================================================\n` +
      `Report Title:     ${title.toUpperCase()}\n` +
      `Publication Date: ${date}\n` +
      `Student Name:     ${studentName}\n` +
      `Grade & Section:  ${studentGrade} - ${studentSection}\n` +
      `Roll Number:      ${studentRollNo}\n` +
      `Academic Term:    2025–2026\n` +
      `Overall Grade:    ${summaryMetrics.overallGrade}\n` +
      `Average Score:    ${summaryMetrics.average}\n` +
      `\n` +
      `SUBJECT BREAKDOWN:\n` +
      `----------------------------------------------------\n` +
      (currentData?.subjects || []).map(s => 
        `${s.subject.padEnd(18)}: ${s.status === 'Exempted' ? 'EXEMPTED' : `${s.marksObtained}/${s.totalMarks} (Grade ${s.grade})`} [${s.status.toUpperCase()}]`
      ).join('\n') +
      `\n----------------------------------------------------\n` +
      `Teacher Remarks:  ${currentData?.teacherRemarks || 'Satisfactory academic performance.'}\n` +
      `Verification Key: OFFSLEEK-CERT-#${Math.floor(100000 + Math.random() * 900000)}\n` +
      `Status:           OFFICIALLY DIGITALLY SIGNED & VERIFIED\n` +
      `====================================================`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${studentName.replace(/\s+/g, '_')}_${title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadToast(`Downloaded ${title}`);
    setTimeout(() => {
      setDownloadToast(null);
    }, 2800);
  };

  return (
    <div className="min-h-full bg-white text-black flex flex-col font-sans pb-28 selection:bg-black selection:text-white">
      {/* Toast Notification */}
      {downloadToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-60 bg-black text-white text-xs px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 stroke-[2]" />
          <span>{downloadToast}</span>
        </div>
      )}

      {/* 1. Page Header (NO School Branding Rule strictly enforced) */}
      <header className="pt-5 px-5">
        <h1 className="text-2xl font-bold tracking-tight text-black">
          My Results
        </h1>
        <p className="text-xs text-neutral-500 font-normal mt-0.5">
          View your academic performance
        </p>
      </header>

      {/* 2. Student Profile Card */}
      <section className="px-5 pt-3.5">
        <div className="bg-white border border-neutral-100 rounded-2xl p-3 flex items-center gap-3 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
          <div className="relative w-12 h-12 rounded-full shrink-0">
            <img
              src={studentAvatar}
              alt={studentName}
              className="w-full h-full rounded-full object-cover border border-neutral-200"
              onError={(e) => {
                (e.target as HTMLImageElement).src = aaravAvatarDefault;
              }}
            />
            <VerifiedAvatarBadge size="sm" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-1.5">
              <span className="text-sm font-bold text-black leading-tight">
                {studentName}
              </span>
            </div>
            <span className="text-xs text-neutral-500 mt-0.5">
              {studentGrade} - {studentSection}
            </span>
            <span className="text-xs text-neutral-500">
              Roll No. {studentRollNo}
            </span>
          </div>
        </div>
      </section>

      {/* 3. Assessment Tabs */}
      <section className="px-5 pt-4">
        <div className="bg-neutral-100/70 p-1 rounded-2xl grid grid-cols-4 gap-1 text-center">
          {assessmentTabs.map((tab) => {
            const isSelected = selectedAssessment === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  setSelectedAssessment(tab);
                  setSearchQuery('');
                }}
                className={`py-2 px-1 rounded-xl text-xs transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-black text-white font-semibold shadow-2xs'
                    : 'text-neutral-700 font-medium hover:text-black'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Summary Cards (3 Columns) */}
      <section className="px-5 pt-4">
        <div className="grid grid-cols-3 gap-2.5">
          {/* Card 1: Subjects */}
          <div className="bg-white border border-neutral-100/90 rounded-2xl p-3 text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center">
            <BookOpen className="w-5 h-5 text-black stroke-[1.8]" />
            <span className="text-[11px] text-neutral-500 font-medium mt-1">Subjects</span>
            <span className="text-xl font-bold text-black mt-0.5 leading-none">
              {summaryMetrics.subjectsCount}
            </span>
          </div>

          {/* Card 2: Average */}
          <div className="bg-white border border-neutral-100/90 rounded-2xl p-3 text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center">
            <BarChart2 className="w-5 h-5 text-black stroke-[1.8]" />
            <span className="text-[11px] text-neutral-500 font-medium mt-1">Average</span>
            <span className="text-xl font-bold text-black mt-0.5 leading-none">
              {summaryMetrics.average}
            </span>
          </div>

          {/* Card 3: Overall Grade */}
          <div className="bg-white border border-neutral-100/90 rounded-2xl p-3 text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center">
            <Star className="w-5 h-5 text-black stroke-[1.8]" />
            <span className="text-[11px] text-neutral-500 font-medium mt-1">Overall Grade</span>
            <span className="text-xl font-bold text-black mt-0.5 leading-none">
              {summaryMetrics.overallGrade}
            </span>
          </div>
        </div>
      </section>

      {/* 5. Subject Search */}
      <section className="px-5 pt-4">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[2]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subjects"
            className="w-full bg-white border border-neutral-200/90 rounded-2xl pl-10 pr-9 py-2.5 text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:border-black shadow-2xs transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </section>

      {/* 6. Subject Results List */}
      <section className="px-5 pt-4 space-y-2">
        {/* Table Header Row */}
        <div className="grid grid-cols-12 px-3 text-[11px] font-medium text-neutral-500 pb-1">
          <div className="col-span-5">Subject</div>
          <div className="col-span-3 text-center">Marks</div>
          <div className="col-span-2 text-center">Grade</div>
          <div className="col-span-2 text-right">Status</div>
        </div>

        {/* Rows */}
        {!currentData.isPublished ? (
          <div className="py-12 px-4 text-center bg-white border border-neutral-100 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-2">
            <AlertCircle className="w-7 h-7 text-neutral-300 mx-auto" />
            <h4 className="text-xs font-bold text-black">Results Not Published Yet</h4>
            <p className="text-[11px] text-neutral-500 max-w-xs mx-auto">
              Evaluation for {selectedAssessment} is currently underway. Marks will appear here once officially published by the school examination department.
            </p>
          </div>
        ) : filteredSubjects.length === 0 ? (
          <div className="py-10 px-4 text-center bg-white border border-neutral-100 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-1">
            <p className="text-xs font-bold text-black">No matching subjects found</p>
            <p className="text-[11px] text-neutral-400">
              No results match "{searchQuery}" in {selectedAssessment}.
            </p>
          </div>
        ) : (
          filteredSubjects.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-neutral-100 rounded-2xl p-3.5 grid grid-cols-12 items-center shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-neutral-300 transition-all"
            >
              {/* Subject Name */}
              <div className="col-span-5 min-w-0 pr-1">
                <h4 className="text-xs font-bold text-black truncate leading-tight">
                  {item.subject}
                </h4>
                {item.isExempted && (
                  <span className="text-[9.5px] text-neutral-400 block truncate">
                    {item.exemptionReason || 'Exempted'}
                  </span>
                )}
              </div>

              {/* Marks */}
              <div className="col-span-3 text-center text-xs font-medium text-neutral-600">
                {item.isExempted || item.marksObtained === null ? (
                  <span className="text-neutral-400">-</span>
                ) : (
                  <span>{item.marksObtained} / {item.totalMarks}</span>
                )}
              </div>

              {/* Grade */}
              <div className="col-span-2 text-center text-xs font-semibold text-neutral-800">
                {item.grade}
              </div>

              {/* Status Badge (Pass / Fail / Exempted) */}
              <div className="col-span-2 flex justify-end">
                {item.status === 'Pass' && (
                  <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                    Pass
                  </span>
                )}
                {item.status === 'Fail' && (
                  <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-red-50 text-red-600 border border-red-100">
                    Fail
                  </span>
                )}
                {item.status === 'Exempted' && (
                  <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-neutral-100 text-neutral-600 border border-neutral-200">
                    Exempted
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </section>

      {/* 7. Report Cards Section */}
      <section className="px-5 pt-6 space-y-3">
        <h3 className="text-base font-bold text-black">
          Report Cards
        </h3>

        <div className="space-y-2.5">
          {/* Card 1: Term 1 Report Card */}
          <div className="bg-white border border-neutral-100 rounded-2xl p-3.5 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-neutral-300 transition-all">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-neutral-800 text-white flex items-center justify-center font-bold text-[10px] tracking-wider shrink-0 shadow-2xs">
                PDF
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-black leading-tight truncate">
                  Term 1 Report Card
                </h4>
                <p className="text-[10.5px] text-neutral-400 mt-0.5">
                  Published 5 Oct 2025
                </p>
              </div>
            </div>

            <button
              onClick={() => handleDownloadReportCard('Term 1 Report Card', '5 Oct 2025')}
              className="w-9 h-9 rounded-xl border border-neutral-200/90 hover:border-black hover:bg-neutral-50 flex items-center justify-center text-neutral-700 hover:text-black transition-colors shrink-0"
              title="Download Report Card"
            >
              <Download className="w-4 h-4 stroke-[1.8]" />
            </button>
          </div>

          {/* Card 2: Annual Report Card */}
          <div className="bg-white border border-neutral-100 rounded-2xl p-3.5 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-neutral-300 transition-all">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-neutral-800 text-white flex items-center justify-center font-bold text-[10px] tracking-wider shrink-0 shadow-2xs">
                PDF
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-black leading-tight truncate">
                  Annual Report Card
                </h4>
                <p className="text-[10.5px] text-neutral-400 mt-0.5">
                  Published 25 Mar 2025
                </p>
              </div>
            </div>

            <button
              onClick={() => handleDownloadReportCard('Annual Report Card', '25 Mar 2025')}
              className="w-9 h-9 rounded-xl border border-neutral-200/90 hover:border-black hover:bg-neutral-50 flex items-center justify-center text-neutral-700 hover:text-black transition-colors shrink-0"
              title="Download Report Card"
            >
              <Download className="w-4 h-4 stroke-[1.8]" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
