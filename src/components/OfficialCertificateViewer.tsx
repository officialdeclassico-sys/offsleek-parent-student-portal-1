import React from 'react';
import { X, Download, ShieldCheck, Printer } from 'lucide-react';
import { OfficialCertificateData, downloadFormalCertificatePdf } from '../utils/pdfGenerator';

interface OfficialCertificateViewerProps {
  certificate: OfficialCertificateData;
  onClose: () => void;
}

export const OfficialCertificateViewer: React.FC<OfficialCertificateViewerProps> = ({
  certificate,
  onClose,
}) => {
  const handleDownload = () => {
    const filename = `${certificate.certificateType.replace(/\s+/g, '_')}_DEMO.pdf`;
    downloadFormalCertificatePdf(filename, certificate);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 z-60 animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-neutral-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top bar */}
        <div className="px-5 py-3.5 bg-neutral-900 text-white flex items-center justify-between border-b border-neutral-800 shrink-0">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-xs font-semibold tracking-wide uppercase">Official Document Viewer</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              title="Print Certificate"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 bg-white text-black hover:bg-neutral-100 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-2xs"
              title="Download PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors ml-1"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Display Area (Scrollable if needed) */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-neutral-100/60">
          {/* Certificate Sheet */}
          <div className="bg-white border-4 border-double border-neutral-300 p-5 sm:p-7 rounded-xl shadow-md text-black relative select-none">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-4">
              <span className="text-5xl font-black text-neutral-900 transform -rotate-25 tracking-widest uppercase">
                OFFICIAL DEMO
              </span>
            </div>

            {/* Top School Header */}
            <div className="text-center pb-4 border-b border-neutral-200">
              <div className="flex justify-center mb-1.5">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shadow-xs">
                  <svg className="w-6 h-6" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M4 22C8 20.5 12 20.5 16 22.5C20 20.5 24 20.5 28 22V8C24 6.5 20 6.5 16 8.5C12 6.5 8 6.5 4 8V22Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path d="M16 8.5V22.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 3.5V5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
              <h2 className="text-base sm:text-lg font-black tracking-wider text-black uppercase font-serif">
                {certificate.schoolName}
              </h2>
              <p className="text-[10px] text-neutral-500 font-medium tracking-wide">
                {certificate.schoolTagline} · Affiliation No. 2130847
              </p>
              <p className="text-[9px] text-neutral-400 mt-0.5">
                Sector 14, Institutional Area · Academic Registry Office
              </p>
            </div>

            {/* Document Title & Meta */}
            <div className="py-3.5 text-center">
              <div className="inline-block px-3 py-1 bg-neutral-100 rounded-full text-[10px] font-bold text-neutral-800 tracking-widest uppercase mb-1">
                {certificate.certificateType}
              </div>
              <div className="flex items-center justify-center space-x-3 text-[10px] text-neutral-400">
                <span>Ref: <strong className="text-black">{certificate.requestId}</strong></span>
                <span>•</span>
                <span>Date: <strong className="text-black">{certificate.issueDate}</strong></span>
              </div>
            </div>

            {/* Certificate Body */}
            <div className="space-y-3 text-xs text-neutral-800 leading-relaxed font-serif pt-1">
              <p className="text-center italic font-sans text-[11px] text-neutral-500 font-semibold tracking-wider uppercase">
                TO WHOMSOEVER IT MAY CONCERN
              </p>

              <p className="text-justify indent-6">
                This is to officially certify that <strong className="text-black underline decoration-neutral-300 underline-offset-2">{certificate.studentName}</strong>, bearing Roll Number <strong className="text-black">{certificate.rollNo}</strong>, is a bonafide student of <strong className="text-black">{certificate.schoolName}</strong>, presently studying in <strong className="text-black">{certificate.grade} - Section {certificate.section}</strong> for the academic session 2025–2026.
              </p>

              <p className="text-justify indent-6">
                As per institutional academic and disciplinary records, his character and moral conduct have been found to be <strong className="text-black uppercase">Exemplary</strong>. He has demonstrated consistent academic enthusiasm, personal integrity, and active adherence to institutional ethics.
              </p>

              <p className="text-justify indent-6">
                This certificate is officially issued on student request for the purpose of: <strong className="text-black font-sans">{certificate.purpose}</strong>.
              </p>
            </div>

            {/* Footer / Signatures & Seal */}
            <div className="pt-6 mt-4 border-t border-neutral-100 grid grid-cols-3 items-end gap-2 text-center">
              {/* Registrar Sign */}
              <div>
                <p className="font-serif italic text-xs text-neutral-700 font-bold mb-1">K. S. Raman</p>
                <div className="w-16 h-0.5 bg-neutral-300 mx-auto mb-1"></div>
                <p className="text-[9px] font-bold text-black uppercase tracking-wider">Academic Registrar</p>
                <p className="text-[8px] text-neutral-400">Greenwood Registry</p>
              </div>

              {/* Official Seal */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full border-2 border-emerald-600/70 p-1 flex items-center justify-center text-emerald-700 bg-emerald-50/40">
                  <div className="w-full h-full rounded-full border border-dashed border-emerald-600 flex flex-col items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-[6.5px] font-bold tracking-tight uppercase">VERIFIED</span>
                    <span className="text-[5.5px] text-neutral-500">SEAL</span>
                  </div>
                </div>
                <span className="text-[8px] text-emerald-600 font-semibold mt-1">Digitally Signed</span>
              </div>

              {/* Principal Sign */}
              <div>
                <p className="font-serif italic text-xs text-neutral-700 font-bold mb-1">Dr. Margaret Evans</p>
                <div className="w-16 h-0.5 bg-neutral-300 mx-auto mb-1"></div>
                <p className="text-[9px] font-bold text-black uppercase tracking-wider">Head of School</p>
                <p className="text-[8px] text-neutral-400">Greenwood International</p>
              </div>
            </div>

            {/* Demo Notice Banner */}
            <div className="mt-4 pt-2 border-t border-dashed border-neutral-200 text-center">
              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                [ SAMPLE FORMAL CERTIFICATE FOR OFFSLEEK TESTING · REQ-2025-0792 ]
              </span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-3.5 bg-white border-t border-neutral-100 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-neutral-500">
            Desk: <strong className="text-black">{certificate.collectionDesk || 'Main Academic Registrar Desk'}</strong>
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-semibold rounded-xl transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
