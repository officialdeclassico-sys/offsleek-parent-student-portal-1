export type UserRole = 'parent' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  token: string;
  linkedStudentIds: string[];
  phone?: string;
  relationship?: string;
  emergencyContact?: string;
  address?: string;
  avatar?: string;
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  section: string;
  rollNumber: string;
  schoolName: string;
  avatar: string;
  attendancePercentage: number;
  pendingFeeAmount: number;
  upcomingExamsCount: number;
  announcementsCount: number;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  day: number;
  status: 'present' | 'absent' | 'late' | 'weekend';
}

export interface FeeItem {
  id: string;
  studentId: string;
  title: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  receiptNumber?: string;
  paidDate?: string;
  category: 'tuition' | 'transport' | 'activity' | 'library' | 'examination';
}

export interface TimetablePeriod {
  time: string;
  subject: string;
  classroom: string;
  isBreak?: boolean;
}

export interface ExamItem {
  id: string;
  studentId: string;
  title: string;
  subject: string;
  date: string;
  time?: string;
  room?: string;
  marksObtained?: number;
  totalMarks?: number;
  grade?: string;
  status: 'upcoming' | 'completed';
}

export interface Marksheet {
  id: string;
  studentId: string;
  term: string;
  academicYear: string;
  gpa: number;
  subjects: {
    subject: string;
    marksObtained: number;
    totalMarks: number;
    grade: string;
  }[];
  teacherRemarks: string;
}

export interface AnnouncementAttachment {
  name: string;
  size: string;
  type: string;
  url?: string;
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  sender: string;
  content: string;
  category: 'All' | 'Academic' | 'Events' | 'Holidays' | 'General' | string;
  unread?: boolean;
  status?: 'published' | 'draft';
  audience?: string;
  attachment?: AnnouncementAttachment;
}

export interface TripEvent {
  id: string;
  studentId: string;
  title: string;
  date: string;
  status: 'upcoming' | 'past';
  registered: boolean;
  consentGiven: boolean;
  cost?: number;
  description?: string;
}

export interface DocumentRequest {
  id: string;
  studentId: string;
  documentType: 'Bonafide Certificate' | 'Transfer Certificate' | 'Marksheet Copy' | 'Character Certificate';
  purpose: string;
  status: 'requested' | 'processing' | 'ready';
  requestDate?: string;
}

export type RequestType = 'Bonafide Certificate' | 'Character Certificate' | 'ID Card Request' | 'Other Request' | 'Leave Request';
export type RequestStatus = 'In Progress' | 'Approved' | 'Rejected' | 'Submitted';

export interface StudentRequestAttachment {
  name: string;
  size: string;
  type: string;
  url?: string;
}

export interface StudentRequestItem {
  id: string;
  studentId: string;
  type: RequestType;
  title: string;
  purpose: string;
  submissionDate: string;
  status: RequestStatus;
  statusMessage?: string;
  rejectionReason?: string;
  details?: string;
  category?: string;
  submittedBy?: 'Student' | 'Parent';
  attachment?: StudentRequestAttachment;
  roomOrOffice?: string;
}


export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  category: 'attendance' | 'fee' | 'exam' | 'announcement';
}
