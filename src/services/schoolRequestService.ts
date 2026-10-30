import { formatISTDate, formatISTTimestamp, getISTDateParts } from '../utils/dateTime';

/**
 * OFFSLEEK School Request Service
 * Authoritative cross-portal requests management for both Parents and Students.
 * Enforces duplicate checks, persistent storage, and real-time synchronization.
 */

export type SchoolRequestType = 
  | 'Bonafide Certificate' 
  | 'Character Certificate' 
  | 'ID Card Request' 
  | 'Other Request' 
  | 'Leave Request';

export type SchoolRequestStatus = 'In Progress' | 'Approved' | 'Rejected' | 'Pending';

export interface SchoolRequest {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  section: string;
  rollNumber: string;
  type: SchoolRequestType;
  title: string;
  purpose: string;
  additionalDetails?: string;
  attachmentName?: string;
  attachmentSize?: string;
  submissionDate: string; // e.g., "5 Oct 2026"
  submittedTimestamp: string; // e.g., "5 Oct, 10:30 AM"
  status: SchoolRequestStatus;
  reviewedBy?: string;
  decisionTimestamp?: string;
  completedTimestamp?: string;
  rejectionReason?: string;
  submittedBy: 'Parent' | 'Student';
  // Specific to Leave Requests:
  fromDate?: string;
  toDate?: string;
  days?: number;
  leaveType?: string;
}

const STORAGE_KEY = 'offsleek_shared_requests_v3';
const EVENT_NAME = 'offsleek_requests_changed';

// Initial authoritative records matching reference screens exactly
const DEFAULT_REQUESTS: SchoolRequest[] = [
  {
    id: 'REQ-2026-0842',
    studentId: 'std_aarav',
    studentName: 'Aarav Sharma',
    grade: 'Class 6',
    section: 'Section A',
    rollNumber: '6001',
    type: 'Bonafide Certificate',
    title: 'Bonafide Certificate',
    purpose: 'For higher education admission',
    additionalDetails: 'Need bonafide certificate for school admission process.',
    submissionDate: '5 Oct 2026',
    submittedTimestamp: '5 Oct, 10:30 AM',
    status: 'In Progress',
    reviewedBy: 'Administration',
    submittedBy: 'Student'
  },
  {
    id: 'REQ-2026-0831',
    studentId: 'std_aarav',
    studentName: 'Aarav Sharma',
    grade: 'Class 6',
    section: 'Section A',
    rollNumber: '6001',
    type: 'Bonafide Certificate',
    title: 'Bonafide Certificate',
    purpose: 'For bank account opening',
    additionalDetails: 'Required for opening student minor savings account.',
    submissionDate: '12 Sep 2026',
    submittedTimestamp: '12 Sep, 9:15 AM',
    status: 'Approved',
    decisionTimestamp: '13 Sep, 4:20 PM',
    completedTimestamp: '15 Sep, 10:00 AM',
    reviewedBy: 'Administration',
    submittedBy: 'Student'
  },
  {
    id: 'REQ-2026-0818',
    studentId: 'std_aarav',
    studentName: 'Aarav Sharma',
    grade: 'Class 6',
    section: 'Section A',
    rollNumber: '6001',
    type: 'Bonafide Certificate',
    title: 'Bonafide Certificate',
    purpose: 'For travel visa application',
    additionalDetails: 'Visa documentation for upcoming international educational summit.',
    submissionDate: '20 Aug 2026',
    submittedTimestamp: '20 Aug, 11:00 AM',
    status: 'Rejected',
    decisionTimestamp: '21 Aug, 3:45 PM',
    rejectionReason: 'Visa application requires additional documents. Please contact the school office.',
    reviewedBy: 'Administration',
    submittedBy: 'Student'
  },
  {
    id: 'REQ-2026-0850',
    studentId: 'std_aarav',
    studentName: 'Aarav Sharma',
    grade: 'Class 6',
    section: 'Section A',
    rollNumber: '6001',
    type: 'ID Card Request',
    title: 'ID Card Request',
    purpose: 'Replace lost ID card',
    additionalDetails: 'Lost student identity card during bus transit.',
    submissionDate: '2 Oct 2026',
    submittedTimestamp: '2 Oct, 11:30 AM',
    status: 'Approved',
    decisionTimestamp: '3 Oct, 2:15 PM',
    completedTimestamp: '4 Oct, 9:00 AM',
    reviewedBy: 'Administration',
    submittedBy: 'Student'
  },
  {
    id: 'REQ-2026-0792',
    studentId: 'std_aarav',
    studentName: 'Aarav Sharma',
    grade: 'Class 6',
    section: 'Section A',
    rollNumber: '6001',
    type: 'Character Certificate',
    title: 'Character Certificate',
    purpose: 'For competitive exam',
    additionalDetails: 'National Talent Search Olympiad application.',
    submissionDate: '20 Sep 2026',
    submittedTimestamp: '20 Sep, 10:00 AM',
    status: 'Approved',
    decisionTimestamp: '22 Sep, 11:30 AM',
    completedTimestamp: '23 Sep, 2:00 PM',
    reviewedBy: 'Administration',
    submittedBy: 'Student'
  },
  {
    id: 'REQ-2026-0770',
    studentId: 'std_aarav',
    studentName: 'Aarav Sharma',
    grade: 'Class 6',
    section: 'Section A',
    rollNumber: '6001',
    type: 'Other Request',
    title: 'Other Request',
    purpose: 'Request for library access',
    additionalDetails: 'Special access requested for senior reading room and scientific journals.',
    submissionDate: '28 Sep 2026',
    submittedTimestamp: '28 Sep, 1:15 PM',
    status: 'Rejected',
    decisionTimestamp: '29 Sep, 4:00 PM',
    rejectionReason: 'Library access is currently available only for selected grades. Please contact the school office for more information.',
    reviewedBy: 'Administration',
    submittedBy: 'Student'
  },
  {
    id: 'REQ-2026-0865',
    studentId: 'std_aarav',
    studentName: 'Aarav Sharma',
    grade: 'Class 6',
    section: 'Section A',
    rollNumber: '6001',
    type: 'Leave Request',
    title: 'Leave Request',
    leaveType: 'Sick Leave',
    purpose: '14 Oct 2026 - 15 Oct 2026 (2 days)',
    fromDate: '14 Oct 2026',
    toDate: '15 Oct 2026',
    days: 2,
    additionalDetails: 'Aarav is not feeling well due to fever. Please grant leave for 2 days.',
    attachmentName: 'Medical_Certificate.pdf',
    submissionDate: '14 Oct 2026',
    submittedTimestamp: '14 Oct, 10:30 AM',
    status: 'Pending',
    reviewedBy: 'Class Teacher',
    submittedBy: 'Parent'
  },
  {
    id: 'REQ-2026-0712',
    studentId: 'std_aarav',
    studentName: 'Aarav Sharma',
    grade: 'Class 6',
    section: 'Section A',
    rollNumber: '6001',
    type: 'Leave Request',
    title: 'Leave Request',
    leaveType: 'Sick Leave',
    purpose: '5 Sep 2026 - 6 Sep 2026 (2 days)',
    fromDate: '5 Sep 2026',
    toDate: '6 Sep 2026',
    days: 2,
    additionalDetails: "Medical rest as per doctor's advice.",
    submissionDate: '5 Sep 2026',
    submittedTimestamp: '4 Sep, 10:15 AM',
    decisionTimestamp: '5 Sep, 2:20 PM',
    completedTimestamp: '6 Sep, 9:00 AM',
    status: 'Approved',
    reviewedBy: 'Mrs. Verma (Class Teacher)',
    submittedBy: 'Parent'
  },
  {
    id: 'REQ-2026-0680',
    studentId: 'std_aarav',
    studentName: 'Aarav Sharma',
    grade: 'Class 6',
    section: 'Section A',
    rollNumber: '6001',
    type: 'Leave Request',
    title: 'Leave Request',
    leaveType: 'Personal Leave',
    purpose: '12 Aug 2026 (1 day)',
    fromDate: '12 Aug 2026',
    toDate: '12 Aug 2026',
    days: 1,
    additionalDetails: 'Family function.',
    submissionDate: '12 Aug 2026',
    submittedTimestamp: '12 Aug, 9:10 AM',
    decisionTimestamp: '12 Aug, 3:45 PM',
    status: 'Rejected',
    rejectionReason: 'Leave cannot be approved on this date due to scheduled school activities.',
    reviewedBy: 'Mrs. Verma (Class Teacher)',
    submittedBy: 'Parent'
  }
];

class SchoolRequestService {
  private getStorage(): SchoolRequest[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load school requests from storage', e);
    }
    this.saveStorage(DEFAULT_REQUESTS);
    return DEFAULT_REQUESTS;
  }

  private saveStorage(requests: SchoolRequest[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: requests }));
      }
    } catch (e) {
      console.warn('Failed to save school requests to storage', e);
    }
  }

  /**
   * Subscribe to live updates across components/portals
   */
  public subscribe(callback: () => void): () => void {
    const handler = () => callback();
    if (typeof window !== 'undefined') {
      window.addEventListener(EVENT_NAME, handler);
      window.addEventListener('storage', handler);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener(EVENT_NAME, handler);
        window.removeEventListener('storage', handler);
      }
    };
  }

  /**
   * Retrieve requests for a specific student
   */
  public getRequestsForStudent(studentId: string): SchoolRequest[] {
    const all = this.getStorage();
    return all.filter(r => r.studentId === studentId);
  }

  /**
   * Check if an active request already exists to prevent duplicates
   */
  public checkDuplicate(
    studentId: string, 
    type: SchoolRequestType, 
    purposeOrCategory: string
  ): SchoolRequest | null {
    const studentRequests = this.getRequestsForStudent(studentId);

    // Active status filter: requests that are still open
    const activeRequests = studentRequests.filter(
      r => r.status === 'In Progress' || r.status === 'Pending'
    );

    if (type === 'Bonafide Certificate') {
      // Prevent duplicate active Bonafide Certificate requests for same student
      return activeRequests.find(r => r.type === 'Bonafide Certificate') || null;
    }

    if (type === 'Character Certificate') {
      // Prevent duplicate active Character Certificate requests for same student
      return activeRequests.find(r => r.type === 'Character Certificate') || null;
    }

    if (type === 'ID Card Request') {
      // Prevent duplicate active ID Card requests for same student and category
      return activeRequests.find(
        r => r.type === 'ID Card Request' && r.purpose.trim().toLowerCase() === purposeOrCategory.trim().toLowerCase()
      ) || null;
    }

    if (type === 'Other Request') {
      // Prevent duplicate active Other Requests when same category/purpose is being processed
      return activeRequests.find(
        r => r.type === 'Other Request' && r.purpose.trim().toLowerCase() === purposeOrCategory.trim().toLowerCase()
      ) || null;
    }

    if (type === 'Leave Request') {
      // Prevent overlapping duplicate leave requests while an existing request is active
      return activeRequests.find(r => r.type === 'Leave Request') || null;
    }

    return null;
  }

  /**
   * Submit a new request with strict backend duplicate validation
   */
  public async submitRequest(params: {
    studentId: string;
    studentName: string;
    grade: string;
    section: string;
    rollNumber: string;
    type: SchoolRequestType;
    purpose: string;
    additionalDetails?: string;
    attachmentName?: string;
    attachmentSize?: string;
    submittedBy: 'Parent' | 'Student';
    fromDate?: string;
    toDate?: string;
    days?: number;
    leaveType?: string;
  }): Promise<{ success: boolean; request?: SchoolRequest; duplicate?: SchoolRequest; error?: string }> {
    // Artificial realistic network delay
    await new Promise(res => setTimeout(res, 400));

    // 1. Enforce duplicate check
    const existingActive = this.checkDuplicate(params.studentId, params.type, params.purpose);
    if (existingActive) {
      return {
        success: false,
        duplicate: existingActive,
        error: `An active request for ${params.type} is already being processed (Reference ID: ${existingActive.id}).`
      };
    }

    // 2. Format submission date and time in Asia/Kolkata (IST)
    const now = new Date();
    const { year } = getISTDateParts(now);
    const submissionDate = formatISTDate(now);
    const submittedTimestamp = formatISTTimestamp(now);

    // Generate reference ID
    const randomSuffix = Math.floor(860 + Math.random() * 120);
    const newId = `REQ-${year}-0${randomSuffix}`;

    const isLeave = params.type === 'Leave Request';
    const initialStatus: SchoolRequestStatus = isLeave ? 'Pending' : 'In Progress';

    const newRequest: SchoolRequest = {
      id: newId,
      studentId: params.studentId,
      studentName: params.studentName,
      grade: params.grade,
      section: params.section,
      rollNumber: params.rollNumber,
      type: params.type,
      title: params.type,
      purpose: params.purpose,
      additionalDetails: params.additionalDetails?.trim() || undefined,
      attachmentName: params.attachmentName,
      attachmentSize: params.attachmentSize,
      submissionDate,
      submittedTimestamp,
      status: initialStatus,
      reviewedBy: isLeave ? 'Class Teacher' : 'Administration',
      submittedBy: params.submittedBy,
      fromDate: params.fromDate,
      toDate: params.toDate,
      days: params.days,
      leaveType: params.leaveType,
    };

    const current = this.getStorage();
    const updated = [newRequest, ...current];
    this.saveStorage(updated);

    return {
      success: true,
      request: newRequest
    };
  }

  /**
   * Reset store to initial defaults (for verification or testing)
   */
  public resetToDefaults(): void {
    this.saveStorage(DEFAULT_REQUESTS);
  }
}

export const schoolRequestService = new SchoolRequestService();
