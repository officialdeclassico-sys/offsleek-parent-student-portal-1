import React, { useState } from 'react';
import { Award, Download, Eye, CheckCircle2, FileText } from 'lucide-react';
import { ScreenHeader } from './ScreenHeader';
import { useAuth } from '../context/AuthContext';
import { OfficialCertificateViewer } from './OfficialCertificateViewer';
import { OfficialCertificateData, downloadFormalCertificatePdf } from '../utils/pdfGenerator';
import { ScreenType } from './ParentDashboardView';

interface StudentCertificatesViewProps {
  onBack: () => void;
  onNavigate?: (screen: ScreenType) => void;
  highlightCertId?: string;
}

export const StudentCertificatesView: React.FC<StudentCertificatesViewProps> = ({
  onBack,
  onNavigate,
  highlightCertId = 'REQ-2025-0792',
}) => {
  const { currentStudent } = useAuth();
  const [viewingCertificate, setViewingCertificate] = useState<OfficialCertificateData | null>(null);

  const studentName = currentStudent?.name || 'Aarav Sharma';
  const studentGrade = currentStudent?.grade || 'Class 6';
  const studentSection = currentStudent?.section || 'Section A';
  const studentRollNo = currentStudent?.rollNumber || '08';
  const schoolName = currentStudent?.schoolName || 'Greenwood International School';
  const schoolTagline = 'Inspiring Excellence, Nurturing Character';

  // Sample certificates records
  const certificatesList: {
    id: string;
    title: string;
    issueDate: string;
    statusText: string;
    isApproved: boolean;
    purpose: string;
    details: string;
    collectionDesk: string;
    isDemo: boolean;
  }[] = [
    {
      id: 'REQ-2025-0792',
      title: 'Character Certificate',
      issueDate: '20 Sep 2025',
      statusText: 'Verified & Approved',
      isApproved: true,
      purpose: 'For competitive exam',
      details: 'Required for National Talent Search Olympiad registration.',
      collectionDesk: 'Main Academic Registrar Desk',
      isDemo: true,
    },
    {
      id: 'REQ-2025-0610',
      title: 'Bonafide Student Certificate',
      issueDate: '10 Aug 2025',
      statusText: 'Verified',
      isApproved: true,
      purpose: 'For higher education and scholarship validation',
      details: 'Official proof of active enrollment for academic term 2025-2026.',
      collectionDesk: 'Main Academic Registrar Desk',
      isDemo: true,
    },
    {
      id: 'MS-2025-T1',
      title: 'Term 1 Official Marksheet',
      issueDate: '15 Jul 2025',
      statusText: 'Signed by Principal',
      isApproved: true,
      purpose: 'Term 1 Academic Performance Record (GPA: 3.92)',
      details: 'Consolidated report card with subject-wise evaluation and conduct grading.',
      collectionDesk: 'Exam Evaluation Cell',
      isDemo: false,
    },
  ];

  const handleOpenCertificate = (cert: typeof certificatesList[0]) => {
    setViewingCertificate({
      certificateType: cert.title,
      requestId: cert.id,
      studentName,
      grade: studentGrade,
      section: studentSection,
      rollNo: studentRollNo,
      schoolName,
      schoolTagline,
      issueDate: cert.issueDate,
      purpose: cert.purpose,
      collectionDesk: cert.collectionDesk,
      details: cert.details,
    });
  };

  const handleDownloadCertificate = (cert: typeof certificatesList[0]) => {
    const filename = `${cert.title.replace(/\s+/g, '_')}_DEMO.pdf`;
    downloadFormalCertificatePdf(filename, {
      certificateType: cert.title,
      requestId: cert.id,
      studentName,
      grade: studentGrade,
      section: studentSection,
      rollNo: studentRollNo,
      schoolName,
      schoolTagline,
      issueDate: cert.issueDate,
      purpose: cert.purpose,
      collectionDesk: cert.collectionDesk,
      details: cert.details,
    });
  };

  return (
    <div className="min-h-full bg-white text-black font-sans pb-24 selection:bg-black selection:text-white flex flex-col">
      {/* Top Header */}
      <ScreenHeader
        title="My Certificates"
        subtitle="Official verified documents"
        onBack={onBack}
        backAriaLabel="Back to Dashboard"
      />

      {/* Certificate Records List */}
      <section className="px-5 pt-3 space-y-3 flex-1">
        {certificatesList.map((cert) => {
          const isTargeted = highlightCertId === cert.id;

          return (
            <div
              key={cert.id}
              className={`bg-white border rounded-2xl p-4 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col ${
                isTargeted
                  ? 'border-neutral-900 ring-2 ring-neutral-900/10'
                  : 'border-neutral-200/90 hover:border-neutral-300'
              }`}
            >
              {/* Top Row: Issue Date (Top-Left) & Verification Badge (Top-Right) */}
              <div className="w-full flex items-center justify-between gap-2">
                <span className="text-xs text-neutral-400 font-medium text-left truncate">
                  Issued: {cert.issueDate}
                </span>

                <span className="shrink-0 px-2 py-0.5 rounded-md text-[10.5px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100/90 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 stroke-[2.2] shrink-0" />
                  <span>{cert.statusText}</span>
                </span>
              </div>

              {/* Certificate Name — Centered and Bold */}
              <h3 className="font-bold text-black text-sm sm:text-base text-center leading-snug break-words px-2 my-3.5">
                {cert.title}
              </h3>

              {/* Action Buttons — Bottom */}
              <div className="w-full flex items-center gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => handleOpenCertificate(cert)}
                  className="flex-1 min-h-[40px] py-2.5 px-2.5 bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  title="View Official Certificate"
                >
                  <Eye className="w-4 h-4 text-neutral-700 shrink-0" />
                  <span className="truncate">View Certificate</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadCertificate(cert)}
                  className="flex-1 min-h-[40px] py-2.5 px-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                  title="Download PDF Document"
                >
                  <Download className="w-4 h-4 shrink-0" />
                  <span className="truncate">Download PDF</span>
                </button>
              </div>
            </div>
          );
        })}
      </section>

      {/* Footer Navigation link to My Requests */}
      {onNavigate && (
        <section className="px-5 pt-4 pb-6">
          <button
            onClick={() => onNavigate('documents')}
            className="w-full py-3 bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-semibold rounded-2xl transition-colors flex items-center justify-center space-x-2"
          >
            <FileText className="w-4 h-4 text-neutral-700" />
            <span>Go to My Requests</span>
          </button>
        </section>
      )}

      {/* Embedded In-App Formal Certificate Viewer */}
      {viewingCertificate && (
        <OfficialCertificateViewer
          certificate={viewingCertificate}
          onClose={() => setViewingCertificate(null)}
        />
      )}
    </div>
  );
};
