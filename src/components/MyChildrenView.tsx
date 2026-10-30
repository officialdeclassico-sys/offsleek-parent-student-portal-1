import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Check, 
  ChevronRight, 
  UserPlus, 
  X, 
  Trash2, 
  Eye, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  CreditCard, 
  BookOpen, 
  School,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { ScreenHeader } from './ScreenHeader';
import { Student } from '../types';
import { VerifiedAvatarBadge } from './VerifiedAvatarBadge';

export const MyChildrenView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { currentStudent, linkedStudents, switchStudent, linkChild, unlinkChild, isDemoMode } = useAuth();
  
  // Add Child Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [admissionIdInput, setAdmissionIdInput] = useState('');
  const [dobInput, setDobInput] = useState('');
  const [isLinking, setIsLinking] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState<string | null>(null);

  // View Profile Modal State
  const [viewingChild, setViewingChild] = useState<Student | null>(null);

  // Unlink Modal State
  const [childToUnlink, setChildToUnlink] = useState<Student | null>(null);
  const [isUnlinking, setIsUnlinking] = useState(false);
  const [unlinkNotice, setUnlinkNotice] = useState<string | null>(null);

  // Handle Add Child Form Submission
  const handleLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);
    setAddSuccess(null);

    // Validation
    if (!admissionIdInput.trim()) {
      setAddError('Please enter the Student Admission Number or Roll ID.');
      return;
    }
    if (!dobInput.trim()) {
      setAddError('Please select the Student Date of Birth.');
      return;
    }

    setIsLinking(true);
    try {
      const result = await linkChild(admissionIdInput.trim(), dobInput.trim());
      if (result.success) {
        setAddSuccess(result.message);
        setTimeout(() => {
          setIsAddModalOpen(false);
          setAdmissionIdInput('');
          setDobInput('');
          setAddSuccess(null);
        }, 1500);
      } else {
        setAddError(result.message);
      }
    } catch (err: any) {
      setAddError(err.message || 'Verification failed. Please verify with school administration.');
    } finally {
      setIsLinking(false);
    }
  };

  // Handle Unlink Initiation
  const initiateUnlink = (child: Student) => {
    if (linkedStudents.length <= 1) {
      setUnlinkNotice(
        'School Policy Restriction: You cannot unlink your only remaining registered student. School OS requires active parent accounts to maintain at least one enrolled child. For school withdrawals or custody updates, contact the school registrar.'
      );
      return;
    }
    setChildToUnlink(child);
  };

  // Confirm Unlink
  const handleConfirmUnlink = async () => {
    if (!childToUnlink) return;
    setIsUnlinking(true);
    try {
      const res = await unlinkChild(childToUnlink.id);
      if (res.success) {
        setChildToUnlink(null);
      } else {
        setUnlinkNotice(res.message);
        setChildToUnlink(null);
      }
    } catch (err: any) {
      setUnlinkNotice(err.message || 'Failed to unlink student.');
      setChildToUnlink(null);
    } finally {
      setIsUnlinking(false);
    }
  };

  return (
    <div className="min-h-full bg-white text-black flex flex-col font-sans pb-24 selection:bg-black selection:text-white">
      {/* 1. Top Bar */}
      <ScreenHeader
        title="Linked Children"
        subtitle="Manage student profiles & school records"
        onBack={onBack}
        backAriaLabel="Back to Profile & Settings"
        className="border-b border-neutral-100"
      />

      <div className="p-4 space-y-4">
        {/* Notice Banner if unlink error/policy */}
        {unlinkNotice && (
          <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl flex items-start justify-between space-x-3 animate-in fade-in">
            <div className="flex items-start space-x-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-neutral-700 leading-relaxed">{unlinkNotice}</p>
            </div>
            <button
              onClick={() => setUnlinkNotice(null)}
              className="text-neutral-400 hover:text-black p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 2. Children List */}
        <div className="space-y-3">
          {linkedStudents.map((child: Student) => {
            const isActive = currentStudent?.id === child.id;
            return (
              <div
                key={child.id}
                className={`w-full bg-white border rounded-2xl p-4 shadow-2xs transition-all ${
                  isActive ? 'border-neutral-900 bg-neutral-50/40' : 'border-neutral-200/90 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3.5">
                    <div className="relative w-12 h-12 rounded-full shrink-0">
                      <img
                        src={child.avatar}
                        alt={child.name}
                        className="w-full h-full rounded-full object-cover border border-neutral-200"
                      />
                      <VerifiedAvatarBadge size="sm" />
                    </div>
                    <div className="text-left min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <h3 className="text-sm font-bold text-black truncate">{child.name}</h3>
                        {isActive && (
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center space-x-1 shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>Active</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5 font-medium">
                        {child.grade} · {child.section}
                      </p>
                      <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                        Admission ID: {child.rollNumber}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons Row */}
                <div className="mt-3.5 pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {/* View Profile Button */}
                    <button
                      type="button"
                      onClick={() => setViewingChild(child)}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Profile</span>
                    </button>

                    {/* Switch Active if not current */}
                    {!isActive && (
                      <button
                        type="button"
                        onClick={() => switchStudent(child.id)}
                        className="px-3 py-1.5 border border-neutral-300 hover:border-black bg-white hover:bg-neutral-50 text-black rounded-xl text-xs font-medium transition-all shadow-2xs cursor-pointer"
                      >
                        Set as Active
                      </button>
                    )}
                  </div>

                  {/* Unlink Action */}
                  <button
                    type="button"
                    onClick={() => initiateUnlink(child)}
                    className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    title={`Unlink ${child.name}`}
                  >
                    <Trash2 className="w-4 h-4 stroke-[1.8]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3. Link Another Child Prompt Card */}
        <div 
          onClick={() => {
            setAddError(null);
            setAddSuccess(null);
            setIsAddModalOpen(true);
          }}
          className="border border-dashed border-neutral-300 rounded-2xl p-4 text-center hover:border-black hover:bg-neutral-50/50 transition-all cursor-pointer flex flex-col items-center justify-center space-y-1.5"
        >
          <div className="w-9 h-9 rounded-xl bg-neutral-100 text-black flex items-center justify-center">
            <UserPlus className="w-4.5 h-4.5 stroke-[2]" />
          </div>
          <p className="text-xs font-bold text-black">Link Another Student Profile</p>
          <p className="text-[11px] text-neutral-500 max-w-xs">
            Connect another enrolled child using their School Roll Number and verified Date of Birth.
          </p>
        </div>
      </div>

      {/* 4. ADD CHILD MODAL FORM */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 animate-in fade-in">
          <div className="w-full max-w-md bg-white text-black rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl animate-in slide-in-from-bottom-4">
            
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center">
                  <UserPlus className="w-4 h-4 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-black leading-tight">Link Student</h3>
                  <p className="text-[11px] text-neutral-500">Official School OS Child Verification</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              Enter the student's registered School Roll / Admission ID and Date of Birth as verified in school records.
            </p>

            {/* Error Message Callout */}
            {addError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-2 text-xs text-red-700 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span className="leading-snug">{addError}</span>
              </div>
            )}

            {/* Success Message Callout */}
            {addSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-xs text-emerald-800 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">{addSuccess}</span>
              </div>
            )}

            <form onSubmit={handleLinkSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-800">
                  Student Admission Number or ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={admissionIdInput}
                  onChange={(e) => setAdmissionIdInput(e.target.value)}
                  placeholder="e.g. 7015"
                  disabled={isLinking}
                  className="w-full bg-[#fafafa] border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm text-black focus:outline-none focus:border-black transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-800">
                  Student's Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={dobInput}
                  onChange={(e) => setDobInput(e.target.value)}
                  disabled={isLinking}
                  className="w-full bg-[#fafafa] border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm text-black focus:outline-none focus:border-black transition-colors"
                />
              </div>

              {/* Demo Hint Banner */}
              {isDemoMode && (
                <div className="p-2.5 bg-neutral-50 border border-neutral-100 rounded-xl text-[11px] text-neutral-500 space-y-1">
                  <p className="font-semibold text-neutral-700">Verification Demo Records:</p>
                  <p>• <span className="font-mono text-black">7015</span> · DOB: <span className="font-mono text-black">2014-08-19</span> (Rohan Sharma - Authorized)</p>
                  <p>• <span className="font-mono text-black">8022</span> · DOB: <span className="font-mono text-black">2012-04-10</span> (Vihaan Verma - Tests Guardian Denial)</p>
                </div>
              )}

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={isLinking}
                  className="flex-1 py-2.5 bg-neutral-100 text-neutral-700 text-xs font-semibold rounded-xl hover:bg-neutral-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLinking}
                  className="flex-1 py-2.5 bg-black text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition-colors flex items-center justify-center space-x-1.5 shadow-2xs"
                >
                  {isLinking ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <span>Link Child</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. VIEW CHILD PROFILE MODAL */}
      {viewingChild && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="w-full max-w-sm bg-white text-black rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <h3 className="text-sm font-bold text-black">Student Profile</h3>
              <button
                onClick={() => setViewingChild(null)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-400 hover:text-black hover:bg-neutral-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center pt-1 pb-2">
              <div className="relative w-20 h-20 rounded-full mx-auto">
                <img
                  src={viewingChild.avatar}
                  alt={viewingChild.name}
                  className="w-full h-full rounded-full object-cover border-2 border-neutral-200 shadow-2xs"
                />
                <VerifiedAvatarBadge size="md" />
              </div>
              <div className="flex items-center justify-center space-x-1.5 mt-2">
                <h2 className="text-base font-bold text-black leading-tight">{viewingChild.name}</h2>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">{viewingChild.grade} · {viewingChild.section}</p>
              <p className="text-[11px] text-neutral-400 font-mono mt-0.5">Roll No: {viewingChild.rollNumber}</p>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <div className="p-3 bg-neutral-50 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-2 text-neutral-600">
                  <School className="w-4 h-4 text-neutral-400" />
                  <span>School</span>
                </div>
                <span className="font-semibold text-black text-right truncate max-w-[170px]">
                  {viewingChild.schoolName}
                </span>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-2 text-neutral-600">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>Attendance</span>
                </div>
                <span className="font-bold text-emerald-700">
                  {viewingChild.attendancePercentage}%
                </span>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-2 text-neutral-600">
                  <CreditCard className="w-4 h-4 text-red-500" />
                  <span>Pending Fees</span>
                </div>
                <span className={`font-bold ${viewingChild.pendingFeeAmount > 0 ? 'text-red-600' : 'text-neutral-700'}`}>
                  {viewingChild.pendingFeeAmount > 0 ? `₹${viewingChild.pendingFeeAmount.toLocaleString('en-IN')}` : 'No Dues'}
                </span>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-2 text-neutral-600">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                  <span>Upcoming Exams</span>
                </div>
                <span className="font-bold text-purple-700">
                  {viewingChild.upcomingExamsCount}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setViewingChild(null)}
                className="w-full py-2.5 bg-black text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. UNLINK CONFIRMATION MODAL */}
      {childToUnlink && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="w-full max-w-sm bg-white text-black rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5 stroke-[2]" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-black">Unlink Child Record?</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Are you sure you want to unlink <span className="font-bold text-black">{childToUnlink.name}</span> (Roll No: {childToUnlink.rollNumber}) from your parent account?
              </p>
              <p className="text-[11px] text-red-600 pt-1">
                You will immediately lose access to their real-time attendance, fee invoices, and examination marks until re-verified by the school registrar.
              </p>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setChildToUnlink(null)}
                disabled={isUnlinking}
                className="flex-1 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmUnlink}
                disabled={isUnlinking}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center space-x-1.5 shadow-2xs"
              >
                {isUnlinking ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Unlinking...</span>
                  </>
                ) : (
                  <span>Confirm Unlink</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
