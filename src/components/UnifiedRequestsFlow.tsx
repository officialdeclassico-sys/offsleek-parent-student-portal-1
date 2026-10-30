import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ChevronLeft,
  FileText, 
  CreditCard, 
  HelpCircle, 
  Calendar, 
  ChevronDown, 
  Paperclip, 
  Info, 
  Check, 
  AlertCircle, 
  X, 
  MessageSquare,
  User,
  Clock,
  Loader2
} from 'lucide-react';
import { ScreenHeader } from './ScreenHeader';
import glossyBadgeImg from '../assets/images/glossy_black_verification_badge.png';
import { 
  schoolRequestService, 
  SchoolRequest, 
  SchoolRequestType, 
  SchoolRequestStatus 
} from '../services/schoolRequestService';
import { ScreenType } from './ParentDashboardView';
import { addISTDays, formatISTDate } from '../utils/dateTime';

interface Props {
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
  initialView?: 'dashboard' | 'form' | 'success' | 'history' | 'apply';
  initialFilter?: 'All' | 'Bonafide' | 'Character' | 'ID Card' | 'Other' | 'Leave';
}

export const UnifiedRequestsFlow: React.FC<Props> = ({
  onBack,
  onNavigate,
  initialView = 'dashboard',
  initialFilter = 'All'
}) => {
  const { user, currentStudent } = useAuth();
  const isStudent = user?.role === 'student';
  const studentId = currentStudent?.id || 'std_aarav';
  const studentName = currentStudent?.name || 'Aarav Sharma';
  const studentGrade = currentStudent?.grade || 'Class 6';
  const studentSection = currentStudent?.section || 'Section A';
  const studentRollNo = currentStudent?.rollNumber 
    ? (currentStudent.rollNumber === '08' ? '6001' : currentStudent.rollNumber) 
    : '6001';

  // Screen View state:
  // 'dashboard' = Screen 1: My Requests dashboard
  // 'form'      = Screen 2: Dedicated request form (Bonafide, Character, ID Card, Other)
  // 'apply'     = Dedicated leave form for parents
  // 'success'   = Screen 3: Request submitted confirmation
  // 'history'   = Screen 4: Request tracking
  const [currentView, setCurrentView] = useState<'dashboard' | 'form' | 'apply' | 'success' | 'history'>(
    initialView === 'apply' ? 'apply' : initialView === 'history' ? 'history' : 'dashboard'
  );

  // Active form type
  const [formType, setFormType] = useState<SchoolRequestType>('Bonafide Certificate');

  // History tab filter: All, Bonafide, Character, ID Card, Other, Leave
  const [activeFilter, setActiveFilter] = useState<'All' | 'Bonafide' | 'Character' | 'ID Card' | 'Other' | 'Leave'>(
    initialFilter
  );

  // Form input states
  const [selectedPurpose, setSelectedPurpose] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const [attachedFileSize, setAttachedFileSize] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<SchoolRequest | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Leave form states (for Parents Portal)
  const [leaveFromDate, setLeaveFromDate] = useState(() => formatISTDate(new Date()));
  const [leaveToDate, setLeaveToDate] = useState(() => formatISTDate(addISTDays(new Date(), 1)));
  const [leaveType, setLeaveType] = useState('Sick Leave');
  const [leaveReason, setLeaveReason] = useState('Aarav is not feeling well due to fever. Please grant leave for 2 days.');

  // Confirmed request state for Screen 3
  const [confirmedRequest, setConfirmedRequest] = useState<SchoolRequest | null>(null);

  // Real data loaded from shared service
  const [requests, setRequests] = useState<SchoolRequest[]>(() => {
    return schoolRequestService.getRequestsForStudent(studentId);
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Subscribe to live changes across parent/student sessions
  useEffect(() => {
    const refreshData = () => {
      setRequests(schoolRequestService.getRequestsForStudent(studentId));
    };
    refreshData();
    const unsubscribe = schoolRequestService.subscribe(refreshData);
    return () => unsubscribe();
  }, [studentId]);

  // Dropdown options matching specifications
  const getPurposeOptions = (type: SchoolRequestType): string[] => {
    switch (type) {
      case 'Bonafide Certificate':
        return [
          'For higher education admission',
          'For visa / passport application',
          'For bank account opening',
          'For scholarship application',
          'For government concession',
          'General school verification'
        ];
      case 'Character Certificate':
        return [
          'For competitive exam',
          'For sports federation registration',
          'For secondary school transfer',
          'For academic scholarship',
          'Other official requirement'
        ];
      case 'ID Card Request':
        return [
          'Replace lost ID card',
          'Replace damaged ID card',
          'New ID Card'
        ];
      case 'Other Request':
        return [
          'Request for library access',
          'Locker key replacement',
          'School bus route change query',
          'Laboratory equipment permission',
          'General administrative query'
        ];
      default:
        return ['General purpose'];
    }
  };

  // Open dedicated form for a given request type
  const handleOpenForm = (type: SchoolRequestType) => {
    setFormType(type);
    setSelectedPurpose('');
    setAdditionalDetails('');
    setAttachedFileName(null);
    setAttachedFileSize(null);
    setUploadError(null);
    setFormError(null);
    setDuplicateWarning(null);
    setIsDropdownOpen(false);
    setCurrentView('form');
  };

  // Handle purpose selection with proactive duplicate check
  const handleSelectPurpose = (purpose: string) => {
    setSelectedPurpose(purpose);
    setIsDropdownOpen(false);
    setFormError(null);

    // Enforce duplicate check
    const existing = schoolRequestService.checkDuplicate(studentId, formType, purpose);
    if (existing) {
      setDuplicateWarning(existing);
    } else {
      setDuplicateWarning(null);
    }
  };

  // Real document upload validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);
    if (!file) return;

    // Validate type: PDF, JPG, PNG
    const validExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!validExtensions.includes(ext)) {
      setUploadError('Invalid format. Only PDF, JPG, and PNG files are supported.');
      e.target.value = '';
      return;
    }

    // Validate size: 5MB max
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError('File is too large. Maximum allowed size is 5 MB.');
      e.target.value = '';
      return;
    }

    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    const formattedSize = file.size >= 1024 * 1024 ? `${sizeInMb} MB` : `${Math.round(file.size / 1024)} KB`;

    setAttachedFileName(file.name);
    setAttachedFileSize(formattedSize);
  };

  const handleRemoveFile = () => {
    setAttachedFileName(null);
    setAttachedFileSize(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Screen 2 Form submission handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!selectedPurpose.trim()) {
      setFormError(formType === 'ID Card Request' ? 'Please select a request type.' : 'Please select a purpose.');
      return;
    }

    // Enforce duplicate check before submitting
    const existing = schoolRequestService.checkDuplicate(studentId, formType, selectedPurpose);
    if (existing) {
      setDuplicateWarning(existing);
      setFormError(`An active request for ${formType} is already in progress.`);
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    const result = await schoolRequestService.submitRequest({
      studentId,
      studentName,
      grade: studentGrade,
      section: studentSection,
      rollNumber: studentRollNo,
      type: formType,
      purpose: selectedPurpose,
      additionalDetails,
      attachmentName: attachedFileName || undefined,
      attachmentSize: attachedFileSize || undefined,
      submittedBy: isStudent ? 'Student' : 'Parent',
    });

    setIsSubmitting(false);

    if (result.success && result.request) {
      setConfirmedRequest(result.request);
      setCurrentView('success');
    } else if (result.duplicate) {
      setDuplicateWarning(result.duplicate);
      setFormError(result.error || 'Duplicate request detected.');
    } else {
      setFormError(result.error || 'Failed to submit request. Please try again.');
    }
  };

  // Parent Leave form submission handler
  const handleLeaveFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!leaveReason.trim()) {
      setFormError('Please enter a reason for the leave.');
      return;
    }

    // Enforce duplicate check
    const existing = schoolRequestService.checkDuplicate(studentId, 'Leave Request', leaveReason);
    if (existing) {
      setDuplicateWarning(existing);
      setFormError('An active leave request is already being reviewed.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    const result = await schoolRequestService.submitRequest({
      studentId,
      studentName,
      grade: studentGrade,
      section: studentSection,
      rollNumber: studentRollNo,
      type: 'Leave Request',
      purpose: `${leaveFromDate} - ${leaveToDate} (2 days)`,
      fromDate: leaveFromDate,
      toDate: leaveToDate,
      days: 2,
      leaveType,
      additionalDetails: leaveReason,
      attachmentName: attachedFileName || 'Medical_Certificate.pdf',
      submittedBy: 'Parent',
    });

    setIsSubmitting(false);

    if (result.success && result.request) {
      setConfirmedRequest(result.request);
      setCurrentView('success');
    } else if (result.duplicate) {
      setDuplicateWarning(result.duplicate);
      setFormError(result.error || 'Duplicate leave request detected.');
    }
  };

  // Filter requests for Screen 4
  const filteredRequests = requests.filter(req => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Bonafide') return req.type === 'Bonafide Certificate';
    if (activeFilter === 'Character') return req.type === 'Character Certificate';
    if (activeFilter === 'ID Card') return req.type === 'ID Card Request';
    if (activeFilter === 'Other') return req.type === 'Other Request';
    if (activeFilter === 'Leave') return req.type === 'Leave Request';
    return true;
  });

  // Top 2 recent requests for Screen 1
  const recentRequests = requests.slice(0, 2);

  // Helper to map request type to filter tab
  const getFilterForType = (type: SchoolRequestType): 'All' | 'Bonafide' | 'Character' | 'ID Card' | 'Other' | 'Leave' => {
    if (type === 'Bonafide Certificate') return 'Bonafide';
    if (type === 'Character Certificate') return 'Character';
    if (type === 'ID Card Request') return 'ID Card';
    if (type === 'Other Request') return 'Other';
    if (type === 'Leave Request') return 'Leave';
    return 'All';
  };

  // =========================================================================
  // SCREEN 3: REQUEST SUBMITTED CONFIRMATION
  // =========================================================================
  if (currentView === 'success' && confirmedRequest) {
    const isLeave = confirmedRequest.type === 'Leave Request';
    const typeLabel = confirmedRequest.type;
    const successHeading = typeLabel.includes('Request')
      ? `${typeLabel} Submitted`
      : `${typeLabel} Request Submitted`;

    return (
      <div className="min-h-full bg-white text-black flex flex-col font-sans pb-24 selection:bg-black selection:text-white">
        {/* Top Header with Standardized Chevron */}
        <header className="pt-3 px-4 pb-1 flex items-center shrink-0">
          <button
            type="button"
            onClick={() => setCurrentView('dashboard')}
            aria-label="Back to requests"
            className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-black hover:bg-neutral-100 active:bg-neutral-200 transition-colors shrink-0 cursor-pointer"
          >
            <ChevronLeft className="w-[18px] h-[18px] stroke-[2.2] text-black" />
          </button>
        </header>

        <div className="px-4 pt-1 pb-6 space-y-3.5 flex-1 flex flex-col">
          {/* Centered Confirmation Badge & Heading (No extra decorative borders or document checkmark) */}
          <div className="flex flex-col items-center text-center">
            {/* The uploaded glossy black verification badge PNG with continuous subtle animation */}
            <div className="relative flex items-center justify-center mb-2">
              <div 
                className="absolute w-16 h-16 rounded-full bg-black/10 blur-xl pointer-events-none transform-gpu animate-badge-pulse motion-reduce:hidden" 
                aria-hidden="true" 
              />
              <img
                src={glossyBadgeImg}
                alt="Verification Badge"
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain shrink-0 relative z-10 select-none pointer-events-none transform-gpu animate-badge-pulse"
              />
            </div>

            <h2 className="text-[15px] sm:text-base font-bold tracking-tight text-black text-center leading-snug px-1">
              {successHeading}
            </h2>
            <p className="text-xs text-neutral-500 font-normal mt-1 max-w-[320px] text-center leading-snug">
              {isLeave
                ? 'Your leave request has been submitted successfully.'
                : typeLabel === 'ID Card Request'
                ? 'Your request for ID card has been submitted successfully.'
                : typeLabel === 'Other Request'
                ? 'Your request has been submitted successfully.'
                : `Your request for ${typeLabel.toLowerCase()} has been submitted successfully.`}
            </p>
          </div>

          {/* Request Details Card - Compact & Readable */}
          <div className="bg-white border border-neutral-200/90 rounded-2xl p-3.5 space-y-2.5 shadow-2xs">
            <h3 className="text-xs font-bold text-black border-b border-neutral-100 pb-2">
              Request Details
            </h3>

            {/* Student Name */}
            <div className="flex items-start space-x-2.5">
              <User className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider leading-tight">Student</p>
                <p className="text-xs font-bold text-black mt-0.5">{studentName}</p>
              </div>
            </div>

            {/* Submitted On */}
            <div className="flex items-start space-x-2.5">
              <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider leading-tight">Submitted On</p>
                <p className="text-xs font-bold text-black mt-0.5">{confirmedRequest.submittedTimestamp}</p>
              </div>
            </div>

            {/* Purpose */}
            <div className="flex items-start space-x-2.5">
              <FileText className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider leading-tight">
                  {isLeave ? 'Leave Period' : 'Purpose'}
                </p>
                <p className="text-xs text-neutral-800 mt-0.5 font-medium">{confirmedRequest.purpose}</p>
              </div>
            </div>

            {/* Additional Details */}
            <div className="flex items-start space-x-2.5">
              <MessageSquare className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider leading-tight">Additional Details</p>
                <p className="text-xs text-neutral-700 mt-0.5 leading-snug">
                  {confirmedRequest.additionalDetails || 'None provided'}
                </p>
              </div>
            </div>

            {/* Attached Document */}
            <div className="flex items-start space-x-2.5">
              <Paperclip className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider leading-tight">Attached Document</p>
                <p className="text-xs text-neutral-700 mt-0.5">
                  {confirmedRequest.attachmentName || 'No document attached'}
                </p>
              </div>
            </div>
          </div>

          {/* Pending Approval Status Notice */}
          <div className="bg-sky-50 border border-sky-100 rounded-2xl p-3 flex items-start space-x-2.5 shadow-2xs">
            <Clock className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-sky-900 leading-tight">Pending Approval</h4>
              <p className="text-[11px] text-sky-700 mt-0.5 leading-snug">
                {isLeave
                  ? 'Your request has been sent to the class teacher for review. You will be notified once a decision is made.'
                  : 'Your request has been sent to the school administration for approval. You will be notified once it is reviewed.'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1 mt-auto">
            <button
              onClick={() => {
                setActiveFilter(getFilterForType(confirmedRequest.type));
                setCurrentView('history');
              }}
              className="w-full py-3 bg-black text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition-colors shadow-2xs text-center cursor-pointer active:scale-[0.99]"
            >
              View My Requests
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full py-3 bg-white border border-neutral-200/90 text-black text-xs font-bold rounded-xl hover:bg-neutral-50 transition-colors shadow-2xs text-center cursor-pointer active:scale-[0.99]"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SCREEN 2: DEDICATED REQUEST FORM (BONAFIDE, CHARACTER, ID CARD, OTHER)
  // STRICT: NO CHILD-INFORMATION / PROFILE CARD!
  // =========================================================================
  if (currentView === 'form') {
    const isIdCard = formType === 'ID Card Request';
    const isOther = formType === 'Other Request';

    const pageTitle = `${formType} Request`;
    const subtitle = formType === 'Bonafide Certificate'
      ? 'Submit a request for your bonafide certificate'
      : formType === 'Character Certificate'
      ? 'Submit a request for your character certificate'
      : formType === 'ID Card Request'
      ? 'Submit a request for a new or replacement ID card'
      : 'Submit any other request to the school administration';

    const fieldLabel = isIdCard 
      ? 'Request Type' 
      : isOther 
      ? 'Request Category' 
      : 'Purpose of Certificate';

    const fieldPlaceholder = isIdCard 
      ? 'Select Request Type' 
      : isOther 
      ? 'Select Category' 
      : 'Select Purpose';

    return (
      <div className="min-h-full bg-white text-black flex flex-col font-sans pb-28 selection:bg-black selection:text-white">
        {/* Standardized Header with Chevron, Heading & Subtitle on same row */}
        <ScreenHeader
          title={pageTitle}
          subtitle={subtitle}
          onBack={() => setCurrentView('dashboard')}
          backAriaLabel="Back to requests"
        />

        {/* Info Notice Box */}
        <section className="px-5 pt-3.5">
          <div className="bg-[#fffbeb] border border-amber-200/80 rounded-2xl p-3.5 flex items-start gap-2.5">
            <Info className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-900 leading-snug font-normal">
              Your request will be sent to the school administration for approval. You can track the status in My Requests.
            </p>
          </div>
        </section>

        {/* Duplicate Warning Callout if active request exists */}
        {duplicateWarning && (
          <section className="px-5 pt-3">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900">
                  <span className="font-bold">Active Request In Progress: </span>
                  You already have an active request for {formType} (Ref: {duplicateWarning.id}) with status: <span className="font-semibold">{duplicateWarning.status}</span>.
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveFilter(getFilterForType(duplicateWarning.type));
                  setCurrentView('history');
                }}
                className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                View Existing Request
              </button>
            </div>
          </section>
        )}

        {/* Form Error Banner */}
        {formError && !duplicateWarning && (
          <section className="px-5 pt-2">
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{formError}</span>
            </div>
          </section>
        )}

        {/* Form Body */}
        <form onSubmit={handleFormSubmit} className="px-5 pt-4 space-y-4 flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Field 1: Dropdown */}
            <div className="space-y-1.5 relative">
              <label className="text-xs font-bold text-black flex items-center gap-0.5">
                <span>{fieldLabel}</span>
                <span className="text-red-500">*</span>
              </label>

              <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full bg-white border ${
                  formError && !selectedPurpose ? 'border-red-400' : 'border-neutral-200/90'
                } rounded-2xl px-3.5 py-3 flex items-center justify-between cursor-pointer hover:border-neutral-400 transition-colors shadow-2xs`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {isIdCard ? (
                    <CreditCard className="w-4 h-4 text-neutral-600 stroke-[1.8] shrink-0" />
                  ) : isOther ? (
                    <HelpCircle className="w-4 h-4 text-neutral-600 stroke-[1.8] shrink-0" />
                  ) : (
                    <FileText className="w-4 h-4 text-neutral-600 stroke-[1.8] shrink-0" />
                  )}
                  <span className={`text-xs truncate ${selectedPurpose ? 'text-black font-medium' : 'text-neutral-400'}`}>
                    {selectedPurpose || fieldPlaceholder}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {/* Dropdown Options */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-2xl shadow-xl z-30 py-1 max-h-52 overflow-y-auto divide-y divide-neutral-100">
                  {getPurposeOptions(formType).map((opt, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelectPurpose(opt)}
                      className={`px-4 py-2.5 text-xs cursor-pointer hover:bg-neutral-50 flex items-center justify-between ${
                        selectedPurpose === opt ? 'font-bold text-black bg-neutral-50/80' : 'text-neutral-700'
                      }`}
                    >
                      <span>{opt}</span>
                      {selectedPurpose === opt && (
                        <Check className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Field 2: Additional Details (Optional) with 0/500 char counter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black">
                Additional Details (Optional)
              </label>
              <div className="relative">
                <textarea
                  rows={4}
                  maxLength={500}
                  value={additionalDetails}
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                  placeholder="Enter any additional details..."
                  className="w-full bg-white border border-neutral-200/90 rounded-2xl p-3.5 pb-7 text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:border-black resize-none shadow-2xs"
                />
                <span className="absolute bottom-2.5 right-3 text-[10px] text-neutral-400 font-medium">
                  {additionalDetails.length}/500
                </span>
              </div>
            </div>

            {/* Field 3: Attach Document (Optional) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black">
                Attach Document (Optional)
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,image/png,image/jpeg,application/pdf"
                onChange={handleFileChange}
                className="hidden"
                id="doc-upload-input"
              />

              {!attachedFileName ? (
                <label
                  htmlFor="doc-upload-input"
                  className="w-full bg-white border border-neutral-200/90 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-neutral-400 transition-colors shadow-2xs group"
                >
                  <Paperclip className="w-5 h-5 text-neutral-500 mb-1.5 group-hover:scale-105 transition-transform" />
                  <span className="text-xs font-bold text-black">Tap to upload document</span>
                  <span className="text-[10px] text-neutral-400 mt-0.5">PDF, JPG, PNG (Max 5 MB)</span>
                </label>
              ) : (
                <div className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <Paperclip className="w-4 h-4 text-neutral-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-black truncate">{attachedFileName}</p>
                      {attachedFileSize && (
                        <p className="text-[10px] text-neutral-400">{attachedFileSize}</p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-neutral-400 hover:text-black p-1"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {uploadError && (
                <p className="text-[11px] text-red-500 mt-1 font-medium">{uploadError}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !!duplicateWarning}
              className={`w-full py-3.5 rounded-2xl text-xs font-bold text-white transition-all shadow-2xs flex items-center justify-center space-x-2 ${
                isSubmitting || !!duplicateWarning
                  ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                  : 'bg-black hover:bg-neutral-800'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Request</span>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // =========================================================================
  // SCREEN 2 (LEAVE): APPLY FOR LEAVE (FOR PARENT PORTAL)
  // STRICT: NO CHILD CARD!
  // =========================================================================
  if (currentView === 'apply') {
    return (
      <div className="min-h-full bg-white text-black flex flex-col font-sans pb-28 selection:bg-black selection:text-white">
        {/* Standardized Header with Chevron, Heading & Subtitle */}
        <ScreenHeader
          title="Apply for Leave"
          subtitle={`Submit a leave request for ${studentName} (${studentGrade})`}
          onBack={() => setCurrentView('dashboard')}
          backAriaLabel="Back to requests"
        />

        {/* Notice */}
        <section className="px-5 pt-3.5">
          <div className="bg-[#fffbeb] border border-amber-200/80 rounded-2xl p-3.5 flex items-start gap-2.5">
            <Info className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-900 leading-snug font-normal">
              Leave requests are directly submitted to the authorized class teacher for review and approval.
            </p>
          </div>
        </section>

        {duplicateWarning && (
          <section className="px-5 pt-3">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900">
                  <span className="font-bold">Active Leave In Progress: </span>
                  An active leave request is already awaiting decision (Ref: {duplicateWarning.id}).
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveFilter('Leave');
                  setCurrentView('history');
                }}
                className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                View Existing Leave Request
              </button>
            </div>
          </section>
        )}

        {formError && !duplicateWarning && (
          <section className="px-5 pt-2">
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{formError}</span>
            </div>
          </section>
        )}

        <form onSubmit={handleLeaveFormSubmit} className="px-5 pt-4 space-y-4 flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Dates row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-black">From Date *</label>
                <div className="bg-white border border-neutral-200/90 rounded-2xl p-3 flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-neutral-400 shrink-0" />
                  <input
                    type="text"
                    value={leaveFromDate}
                    onChange={(e) => setLeaveFromDate(e.target.value)}
                    className="w-full text-xs text-black font-medium focus:outline-none bg-transparent"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-black">To Date *</label>
                <div className="bg-white border border-neutral-200/90 rounded-2xl p-3 flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-neutral-400 shrink-0" />
                  <input
                    type="text"
                    value={leaveToDate}
                    onChange={(e) => setLeaveToDate(e.target.value)}
                    className="w-full text-xs text-black font-medium focus:outline-none bg-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Leave Type */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-black">Leave Type *</label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="w-full bg-white border border-neutral-200/90 rounded-2xl p-3 text-xs text-black font-medium focus:outline-none focus:border-black"
              >
                <option value="Sick Leave">Sick Leave</option>
                <option value="Personal Leave">Personal Leave</option>
                <option value="Family Function">Family Function</option>
                <option value="Medical Rest">Medical Rest</option>
              </select>
            </div>

            {/* Reason */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-black">Reason for Leave *</label>
              <textarea
                rows={3}
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                placeholder="Enter detailed reason..."
                className="w-full bg-white border border-neutral-200/90 rounded-2xl p-3.5 text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:border-black resize-none shadow-2xs"
              />
            </div>

            {/* Attachment */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-black">Medical / Supporting Doc (Optional)</label>
              <div className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl p-3 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <Paperclip className="w-4 h-4 text-neutral-600 shrink-0" />
                  <span className="text-xs font-medium text-black">Medical_Certificate.pdf</span>
                </div>
                <span className="text-[10px] text-neutral-400 font-semibold">Attached</span>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !!duplicateWarning}
              className={`w-full py-3.5 rounded-2xl text-xs font-bold text-white transition-all shadow-2xs flex items-center justify-center space-x-2 ${
                isSubmitting || !!duplicateWarning
                  ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                  : 'bg-black hover:bg-neutral-800'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Leave Request</span>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // =========================================================================
  // SCREEN 4: REQUEST TRACKING (ALL, BONAFIDE, CHARACTER, ID CARD, OTHER, LEAVE)
  // EXACT REFERENCE REPLICA MATCHING SCREEN 4
  // =========================================================================
  if (currentView === 'history') {
    const filterTabs: Array<'All' | 'Bonafide' | 'Character' | 'ID Card' | 'Other' | 'Leave'> = [
      'All', 
      'Bonafide', 
      'Character', 
      'ID Card', 
      'Other', 
      'Leave'
    ];

    const isLeaveFilter = activeFilter === 'Leave';
    const isLeaveEmptyForStudent = isLeaveFilter && isStudent && filteredRequests.length === 0;

    return (
      <div className="min-h-full bg-white text-black flex flex-col font-sans pb-28 selection:bg-black selection:text-white">
        {/* Standardized Header with Chevron, Heading & Subtitle on same row */}
        <ScreenHeader
          title="My Requests"
          subtitle="Track the status of your submitted requests"
          onBack={() => setCurrentView('dashboard')}
          backAriaLabel="Back to requests"
        />

        {/* Filter Pill Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto px-5 pt-3.5 pb-2 no-scrollbar">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                  isActive
                    ? 'bg-black text-white shadow-2xs'
                    : 'bg-white border border-neutral-200 text-neutral-700 hover:text-black hover:border-neutral-400'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Student Empty State for Leave Request */}
        {isLeaveEmptyForStudent && (
          <div className="px-5 py-12 flex flex-col items-center text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-500">
              <Calendar className="w-7 h-7 stroke-[1.8]" />
            </div>
            <div className="space-y-1 max-w-[280px]">
              <h4 className="text-sm font-bold text-black">No leave request has been submitted for you.</h4>
              <p className="text-xs text-neutral-400 leading-snug">
                Leave requests can be applied by your parents. Once submitted, their live approval status will be visible here.
              </p>
            </div>
          </div>
        )}

        {/* General Empty State */}
        {!isLeaveEmptyForStudent && filteredRequests.length === 0 && (
          <div className="px-5 py-12 flex flex-col items-center text-center space-y-2">
            <p className="text-sm font-medium text-neutral-500">No requests found in this category.</p>
            <button
              onClick={() => setCurrentView('dashboard')}
              className="text-xs font-bold text-black underline mt-1"
            >
              Submit a new request
            </button>
          </div>
        )}

        {/* Request Cards List matching Reference Screen 4 */}
        <div className="p-4 space-y-3.5">
          {filteredRequests.map((req) => {
            const isPending = req.status === 'In Progress' || req.status === 'Pending';
            const isApproved = req.status === 'Approved';
            const isRejected = req.status === 'Rejected';

            const isCert = req.type === 'Bonafide Certificate' || req.type === 'Character Certificate';
            const isIdCard = req.type === 'ID Card Request';
            const isOther = req.type === 'Other Request';
            const isLeave = req.type === 'Leave Request';

            // Reviewer badge
            const reviewParty = req.reviewedBy || (isLeave ? 'Class Teacher' : 'Administration');

            return (
              <div
                key={req.id}
                className="bg-white border border-neutral-200/90 rounded-2xl p-4 space-y-3.5 shadow-2xs text-left"
              >
                {/* 1. Header: Icon + Title & Purpose + Status Badge */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 min-w-0 pr-2">
                    <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800 shrink-0 mt-0.5">
                      {isIdCard ? (
                        <CreditCard className="w-4 h-4 stroke-[1.8]" />
                      ) : isOther ? (
                        <HelpCircle className="w-4 h-4 stroke-[1.8]" />
                      ) : isLeave ? (
                        <Calendar className="w-4 h-4 stroke-[1.8]" />
                      ) : (
                        <FileText className="w-4 h-4 stroke-[1.8]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-black leading-tight truncate">
                        {req.title}
                      </h4>
                      <div className="mt-0.5">
                        <span className="text-[10.5px] font-medium text-neutral-700 truncate">{studentName}</span>
                      </div>
                      <p className="text-[11px] text-neutral-600 mt-0.5 leading-snug line-clamp-1">
                        {req.purpose}
                      </p>
                      <p className="text-[10px] text-neutral-400 mt-0.5">
                        {req.submissionDate}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="shrink-0">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold ${
                        isPending
                          ? isLeave ? 'bg-amber-100/80 text-amber-800' : 'bg-sky-50 text-sky-700 border border-sky-100'
                          : isApproved
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'bg-red-50 text-red-700 border border-red-100'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                </div>

                {/* 2. Three-Stage Horizontal Progress Tracker (PRECISELY ALIGNED) */}
                <div className="pt-3 pb-1 border-t border-neutral-100">
                  <div className="relative flex items-start justify-between max-w-[340px] mx-auto px-2">
                    
                    {/* Connecting Line 1 (Between Stage 1 & 2) */}
                    <div
                      className={`absolute left-[16%] right-[50%] top-3 h-[2px] -translate-y-1/2 z-0 ${
                        isApproved || isRejected ? 'bg-black' : 'bg-neutral-200'
                      }`}
                    />

                    {/* Connecting Line 2 (Between Stage 2 & 3) */}
                    <div
                      className={`absolute left-[50%] right-[16%] top-3 h-[2px] -translate-y-1/2 z-0 ${
                        isApproved && req.completedTimestamp ? 'bg-black' : 'bg-neutral-200'
                      }`}
                    />

                    {/* Stage 1: Submitted */}
                    <div className="relative z-10 flex flex-col items-center text-center w-24">
                      <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center shadow-2xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span className="text-[11px] font-bold text-black mt-2 leading-tight">Submitted</span>
                      <span className="text-[10px] text-neutral-400 mt-0.5 leading-tight">
                        {req.submittedTimestamp}
                      </span>
                    </div>

                    {/* Stage 2: Under Review / Approved / Rejected */}
                    <div className="relative z-10 flex flex-col items-center text-center w-28">
                      {isPending ? (
                        <div className="w-6 h-6 rounded-full bg-white border-2 border-neutral-300 shadow-2xs" />
                      ) : isApproved ? (
                        <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center shadow-2xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xs">
                          <X className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                      <span
                        className={`text-[11px] mt-2 leading-tight ${
                          isRejected
                            ? 'font-bold text-red-600'
                            : isApproved
                            ? 'font-bold text-black'
                            : 'font-medium text-neutral-700'
                        }`}
                      >
                        {isPending ? 'Under Review' : isApproved ? 'Approved' : 'Rejected'}
                      </span>
                      <span className="text-[10px] text-neutral-400 mt-0.5 leading-tight">
                        {isPending
                          ? `(${reviewParty})`
                          : req.decisionTimestamp}
                      </span>
                    </div>

                    {/* Stage 3: Completed */}
                    <div className="relative z-10 flex flex-col items-center text-center w-24">
                      {isApproved && req.completedTimestamp ? (
                        <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center shadow-2xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-white border-2 border-neutral-300 shadow-2xs" />
                      )}
                      <span className="text-[11px] font-medium text-neutral-500 mt-2 leading-tight">
                        Completed
                      </span>
                      {isApproved && req.completedTimestamp && (
                        <span className="text-[10px] text-neutral-400 mt-0.5 leading-tight">
                          {req.completedTimestamp}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. Rejection Reason Callout Banner (Matching Reference Screen 4) */}
                {isRejected && (
                  <div className="bg-red-50/80 border border-red-100 rounded-2xl p-3 flex items-start space-x-2.5 mt-2">
                    <AlertCircle className="w-4.5 h-4.5 text-red-500 stroke-[2] shrink-0 mt-0.5" />
                    <p className="text-xs text-red-800 leading-snug">
                      <span className="font-semibold">Reason: </span>
                      {req.rejectionReason || 'Please contact the school office for additional details.'}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // =========================================================================
  // SCREEN 1: MY REQUESTS DASHBOARD (DEFAULT)
  // EXACT REFERENCE REPLICA MATCHING SCREEN 1
  // =========================================================================
  return (
    <div className="min-h-full bg-white text-black flex flex-col font-sans pb-28 selection:bg-black selection:text-white">
      {/* 1. Header */}
      <section className="px-5 pt-4">
        <h1 className="text-2xl font-bold tracking-tight text-black">
          My Requests
        </h1>
        <p className="text-xs text-neutral-500 font-normal mt-0.5">
          Submit and track your requests
        </p>
      </section>

      <div className="p-5 space-y-5">
        {/* 2. Request Options Section */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-black uppercase tracking-wider px-0.5">
            Request Options
          </h3>

          {/* 2x2 Grid matching reference Screen 1 */}
          <div className="grid grid-cols-2 gap-3">
            {/* Card 1: Bonafide Certificate */}
            <div
              onClick={() => handleOpenForm('Bonafide Certificate')}
              className="bg-white border border-neutral-200/90 rounded-2xl p-3.5 space-y-2 shadow-2xs hover:border-neutral-300 cursor-pointer transition-all flex flex-col justify-between min-h-[118px]"
            >
              <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-black shrink-0">
                <FileText className="w-4.5 h-4.5 stroke-[1.8]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-black leading-tight">
                  Bonafide Certificate
                </h4>
                <p className="text-[10px] text-neutral-400 mt-1 leading-snug">
                  Request bonafide certificate from school
                </p>
              </div>
            </div>

            {/* Card 2: Character Certificate */}
            <div
              onClick={() => handleOpenForm('Character Certificate')}
              className="bg-white border border-neutral-200/90 rounded-2xl p-3.5 space-y-2 shadow-2xs hover:border-neutral-300 cursor-pointer transition-all flex flex-col justify-between min-h-[118px]"
            >
              <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-black shrink-0">
                <User className="w-4.5 h-4.5 stroke-[1.8]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-black leading-tight">
                  Character Certificate
                </h4>
                <p className="text-[10px] text-neutral-400 mt-1 leading-snug">
                  Request character certificate from school
                </p>
              </div>
            </div>

            {/* Card 3: ID Card Request */}
            <div
              onClick={() => handleOpenForm('ID Card Request')}
              className="bg-white border border-neutral-200/90 rounded-2xl p-3.5 space-y-2 shadow-2xs hover:border-neutral-300 cursor-pointer transition-all flex flex-col justify-between min-h-[118px]"
            >
              <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-black shrink-0">
                <CreditCard className="w-4.5 h-4.5 stroke-[1.8]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-black leading-tight">
                  ID Card Request
                </h4>
                <p className="text-[10px] text-neutral-400 mt-1 leading-snug">
                  Request a new ID card or replacement
                </p>
              </div>
            </div>

            {/* Card 4: Other Request */}
            <div
              onClick={() => handleOpenForm('Other Request')}
              className="bg-white border border-neutral-200/90 rounded-2xl p-3.5 space-y-2 shadow-2xs hover:border-neutral-300 cursor-pointer transition-all flex flex-col justify-between min-h-[118px]"
            >
              <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-black shrink-0">
                <HelpCircle className="w-4.5 h-4.5 stroke-[1.8]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-black leading-tight">
                  Other Request
                </h4>
                <p className="text-[10px] text-neutral-400 mt-1 leading-snug">
                  Submit any other request to school
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Leave Request Card with View Status button */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs">
          <div className="flex items-center space-x-3 pr-2 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-black shrink-0">
              <Calendar className="w-5 h-5 stroke-[1.8]" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-black leading-tight">
                Leave Request
              </h4>
              <p className="text-[10px] text-neutral-500 mt-0.5 leading-tight">
                Leave requests can be applied by your parents. You can check the status of submitted leave requests here.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setActiveFilter('Leave');
              setCurrentView('history');
            }}
            className="border border-neutral-300 hover:border-neutral-400 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-black hover:bg-neutral-50 transition-colors shrink-0"
          >
            View Status
          </button>
        </div>

        {/* 4. Recent Requests Section with View All */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between px-0.5">
            <h3 className="text-xs font-bold text-black uppercase tracking-wider">
              Recent Requests
            </h3>
            <button
              onClick={() => {
                setActiveFilter('All');
                setCurrentView('history');
              }}
              className="text-xs font-semibold text-neutral-500 hover:text-black underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-2">
            {recentRequests.map(item => (
              <div
                key={item.id}
                onClick={() => {
                  setActiveFilter(getFilterForType(item.type));
                  setCurrentView('history');
                }}
                className="bg-white border border-neutral-200/90 rounded-2xl p-3 flex items-center justify-between shadow-2xs hover:border-neutral-300 cursor-pointer transition-all"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-black shrink-0">
                    {item.type === 'ID Card Request' ? (
                      <CreditCard className="w-4 h-4 stroke-[1.8]" />
                    ) : item.type === 'Other Request' ? (
                      <HelpCircle className="w-4 h-4 stroke-[1.8]" />
                    ) : item.type === 'Leave Request' ? (
                      <Calendar className="w-4 h-4 stroke-[1.8]" />
                    ) : (
                      <FileText className="w-4 h-4 stroke-[1.8]" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-black leading-tight truncate">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-neutral-400 mt-0.5">
                      Submitted on {item.submissionDate}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold shrink-0 ml-2 ${
                    item.status === 'Approved'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      : item.status === 'Rejected'
                      ? 'bg-red-50 text-red-700 border border-red-100'
                      : 'bg-sky-50 text-sky-700 border border-sky-100'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
