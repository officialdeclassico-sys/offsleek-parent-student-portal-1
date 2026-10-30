import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FileText, CheckCircle2, Clock, Download, X } from 'lucide-react';
import { ScreenHeader } from './ScreenHeader';
import { DEMO_DOC_TYPES } from '../services/api';
import { DocumentRequest } from '../types';
import { formatISTDate } from '../utils/dateTime';

export const DocumentRequestsView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { currentStudent, user } = useAuth();
  const isStudent = user?.role === 'student';
  const [activeRequests, setActiveRequests] = useState<DocumentRequest[]>([
    {
      id: 'doc_init',
      studentId: currentStudent?.id || 'std_aarav',
      documentType: 'Bonafide Certificate',
      purpose: 'For bank account',
      status: 'ready',
      requestDate: '10 Oct 2025'
    } as any
  ]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [purposeInput, setPurposeInput] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleOpenRequest = (type: string, defaultPurpose: string) => {
    setSelectedType(type);
    setPurposeInput(defaultPurpose);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) return;

    const newReq: DocumentRequest = {
      id: `doc_${Date.now()}`,
      studentId: currentStudent?.id || 'std_aarav',
      documentType: selectedType as any,
      purpose: purposeInput,
      status: 'requested',
      requestDate: formatISTDate(new Date())
    } as any;

    setActiveRequests([newReq, ...activeRequests]);
    setSuccessMsg(`Official request for ${selectedType} submitted to School Registrar.`);
    setTimeout(() => {
      setSuccessMsg('');
      setSelectedType(null);
      setPurposeInput('');
    }, 2000);
  };

  return (
    <div className="min-h-full bg-white text-black flex flex-col font-sans pb-24 selection:bg-black selection:text-white">
      {/* Top Bar matching Screen 8 */}
      <ScreenHeader
        title={isStudent ? 'Academic Documents' : 'Document Requests'}
        onBack={onBack}
        backAriaLabel="Back to Home"
        className="border-b border-neutral-100"
      />

      <div className="p-4 space-y-4">
        {/* Supported Document Types List matching Screen 8 */}
        <div className="space-y-2.5">
          {DEMO_DOC_TYPES.map((doc, idx) => (
            <div
              key={idx}
              className="bg-white border border-neutral-200/90 rounded-2xl p-4 flex items-center justify-between shadow-xs"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-700">
                  <FileText className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-black">{doc.type}</h4>
                  <p className="text-xs text-neutral-500">{doc.purpose}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenRequest(doc.type, doc.purpose)}
                className="bg-black text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-xs hover:bg-neutral-800"
              >
                Request
              </button>
            </div>
          ))}
        </div>

        {/* Existing Tracked Requests */}
        {activeRequests.length > 0 && (
          <div className="space-y-2.5 pt-2">
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider px-1">Recent Requests & Tracking</h3>
            {activeRequests.map((req: any) => (
              <div key={req.id} className="bg-neutral-50 border border-neutral-200 rounded-2xl p-3.5 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-black">{req.documentType}</h5>
                  <p className="text-[11px] text-neutral-500">{req.purpose} • Requested on {req.requestDate}</p>
                </div>
                {req.status === 'ready' ? (
                  <button
                    onClick={() => alert(`Downloading verified ${req.documentType} PDF for ${currentStudent?.name}`)}
                    className="bg-emerald-600 text-white px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                ) : (
                  <span className="text-[11px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Processing</span>
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Document Request Form Modal */}
      {selectedType && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6 z-50">
          <div className="w-full max-w-sm bg-white text-black border border-neutral-200 p-6 rounded-3xl space-y-4 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-black">Request Document</h3>
                <p className="text-xs text-neutral-500 mt-0.5">For {currentStudent?.name}</p>
              </div>
              <button onClick={() => setSelectedType(null)} className="text-neutral-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            {successMsg ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-800">Certificate Type</label>
                  <input
                    type="text"
                    disabled
                    value={selectedType}
                    className="w-full bg-neutral-100 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-700 font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-800">Purpose / Application Details</label>
                  <textarea
                    required
                    rows={3}
                    value={purposeInput}
                    onChange={(e) => setPurposeInput(e.target.value)}
                    placeholder="Provide specific reason..."
                    className="w-full bg-[#fafafa] border border-neutral-200 rounded-xl p-3 text-xs text-black focus:outline-none focus:border-black resize-none"
                  ></textarea>
                </div>
                <div className="flex space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedType(null)}
                    className="flex-1 py-2.5 bg-neutral-100 text-neutral-700 text-xs font-semibold rounded-xl hover:bg-neutral-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-black text-white text-xs font-semibold rounded-xl hover:bg-neutral-800"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
