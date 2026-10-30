import React, { useState } from 'react';
import { Award, X, Download, Eye, CheckCircle2, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { OfficialCertificateViewer } from './OfficialCertificateViewer';
import { OfficialCertificateData, downloadFormalCertificatePdf } from '../utils/pdfGenerator';
import { ScreenType } from './ParentDashboardView';

interface MyCertificatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (screen: ScreenType) => void;
  highlightCertId?: string;
}

export const MyCertificatesModal: React.FC<MyCertificatesModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  highlightCertId = 'REQ-2025-0792',
}) => {
  const { currentStudent } = useAuth();
  const [viewingCertificate, setViewingCertificate] = useState<OfficialCertificateData | null>(null);

  if (!isOpen) return null;

  const studentName = currentStudent?.name || 'Aarav Sharma';
  const studentGrade = currentStudent?.grade || 'Grade 6';
  const studentSection = currentStudent?.section || 'A';
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
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-in fade-in">
        <div className="w-full max-w-sm sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 border border-neutral-200 space-y-4 shadow-2xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center shadow-xs">
                <Award className="w-4 h-4 stroke-[2]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-black">My Certificates</h3>
                <p className="text-[10.5px] text-neutral-400">Official verified documents</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Certificate Records List */}
          <div className="space-y-3 overflow-y-auto flex-1 pr-0.5">
            {certificatesList.map((cert) => {
              const isTargeted = highlightCertId === cert.id;

              return (
                <div
                  key={cert.id}
                  className={`bg-white border rounded-2xl p-4 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col ${
                    isTargeted
                      ? 'border-neutral-900 ring-2 ring-neutral-900/10 shadow-xs'
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
          </div>

          {/* Footer Navigation */}
          <div className="pt-2 border-t border-neutral-100 flex gap-2 shrink-0">
            {onNavigate && (
              <button
                onClick={() => {
                  onClose();
                  onNavigate('documents');
                }}
                className="flex-1 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-semibold rounded-xl transition-colors flex items-center justify-center space-x-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Go to My Requests</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 py-2.5 bg-black text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>

      {/* Embedded In-App Formal Certificate Viewer */}
      {viewingCertificate && (
        <OfficialCertificateViewer
          certificate={viewingCertificate}
          onClose={() => setViewingCertificate(null)}
        />
      )}
    </>
  );
};
