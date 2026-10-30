import { Student, AttendanceRecord, FeeItem, ExamItem, Announcement, Marksheet, DocumentRequest, TripEvent, NotificationItem, User, TimetablePeriod } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const DEMO_STUDENTS: Student[] = [
  {
    id: 'std_aarav',
    name: 'Aarav Sharma',
    grade: 'Class 6',
    section: 'Section A',
    rollNumber: '6001',
    schoolName: 'OFFSLEEK International School',
    avatar: '/aarav_avatar.png',
    attendancePercentage: 92,
    pendingFeeAmount: 12400,
    upcomingExamsCount: 3,
    announcementsCount: 2,
  },
  {
    id: 'std_ananya',
    name: 'Ananya Sharma',
    grade: 'Class 9',
    section: 'Section B',
    rollNumber: '9005',
    schoolName: 'OFFSLEEK International School',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    attendancePercentage: 96,
    pendingFeeAmount: 0,
    upcomingExamsCount: 2,
    announcementsCount: 2,
  }
];

export const DEMO_USERS: User[] = [
  {
    id: 'usr_priya',
    name: 'Priya Sharma',
    email: 'parent@offsleek.edu',
    role: 'parent',
    token: 'demo-token-parent-priya-sharma',
    linkedStudentIds: ['std_aarav', 'std_ananya']
  },
  {
    id: 'usr_aarav',
    name: 'Aarav Sharma',
    email: 'student@offsleek.edu',
    role: 'student',
    token: 'demo-token-student-aarav',
    linkedStudentIds: ['std_aarav']
  }
];

export const DEMO_TIMETABLE: Record<string, TimetablePeriod[]> = {
  'Mon': [
    { time: '08:00 AM', subject: 'Mathematics', classroom: 'Classroom A1' },
    { time: '09:00 AM', subject: 'Science', classroom: 'Classroom B2' },
    { time: '10:30 AM', subject: 'English', classroom: 'Classroom A1' },
    { time: '11:30 AM', subject: 'Social Studies', classroom: 'Classroom C1' },
    { time: '01:00 PM', subject: 'Lunch Break', classroom: 'Dining Hall', isBreak: true },
    { time: '02:00 PM', subject: 'Computer Lab', classroom: 'Lab 2' },
  ],
  'Tue': [
    { time: '08:00 AM', subject: 'Mathematics', classroom: 'Classroom A1' },
    { time: '09:00 AM', subject: 'Science', classroom: 'Classroom B2' },
    { time: '10:30 AM', subject: 'English', classroom: 'Classroom A1' },
    { time: '11:30 AM', subject: 'Social Studies', classroom: 'Classroom C1' },
    { time: '01:00 PM', subject: 'Lunch Break', classroom: 'Dining Hall', isBreak: true },
    { time: '02:00 PM', subject: 'Computer Lab', classroom: 'Lab 2' },
  ],
  'Wed': [
    { time: '08:00 AM', subject: 'English', classroom: 'Classroom A1' },
    { time: '09:00 AM', subject: 'Mathematics', classroom: 'Classroom A1' },
    { time: '10:30 AM', subject: 'Art & Design', classroom: 'Studio 1' },
    { time: '11:30 AM', subject: 'Science', classroom: 'Classroom B2' },
    { time: '01:00 PM', subject: 'Lunch Break', classroom: 'Dining Hall', isBreak: true },
    { time: '02:00 PM', subject: 'Physical Education', classroom: 'Playground' },
  ],
  'Thu': [
    { time: '08:00 AM', subject: 'Science', classroom: 'Classroom B2' },
    { time: '09:00 AM', subject: 'Social Studies', classroom: 'Classroom C1' },
    { time: '10:30 AM', subject: 'Mathematics', classroom: 'Classroom A1' },
    { time: '11:30 AM', subject: 'Hindi / Second Lang', classroom: 'Classroom B1' },
    { time: '01:00 PM', subject: 'Lunch Break', classroom: 'Dining Hall', isBreak: true },
    { time: '02:00 PM', subject: 'Music & Drama', classroom: 'Auditorium' },
  ],
  'Fri': [
    { time: '08:00 AM', subject: 'Mathematics', classroom: 'Classroom A1' },
    { time: '09:00 AM', subject: 'English', classroom: 'Classroom A1' },
    { time: '10:30 AM', subject: 'Science Quiz', classroom: 'Classroom B2' },
    { time: '11:30 AM', subject: 'Library Hour', classroom: 'Main Library' },
    { time: '01:00 PM', subject: 'Lunch Break', classroom: 'Dining Hall', isBreak: true },
    { time: '02:00 PM', subject: 'Club Activities', classroom: 'Activity Hall' },
  ]
};

export const DEMO_FEES: FeeItem[] = [
  { id: 'fee_1', studentId: 'std_aarav', title: 'Tuition Fee', amount: 8000, dueDate: '15 Oct 2025', status: 'pending', category: 'tuition' },
  { id: 'fee_2', studentId: 'std_aarav', title: 'Transport Fee', amount: 2000, dueDate: '15 Oct 2025', status: 'pending', category: 'transport' },
  { id: 'fee_3', studentId: 'std_aarav', title: 'Activity Fee', amount: 2400, dueDate: '15 Oct 2025', status: 'pending', category: 'activity' },
  { id: 'fee_4', studentId: 'std_ananya', title: 'Tuition Fee (Q2)', amount: 9500, dueDate: '15 Oct 2025', status: 'paid', receiptNumber: 'REC-99214', paidDate: '10 Oct 2025', category: 'tuition' },
];

export const DEMO_EXAMS: ExamItem[] = [
  { id: 'ex_1', studentId: 'std_aarav', title: 'Unit Test 1', subject: 'Mathematics', date: '15 Oct 2025', time: '09:00 AM', room: 'Hall A', status: 'upcoming' },
  { id: 'ex_2', studentId: 'std_aarav', title: 'Unit Test 1', subject: 'Science', date: '18 Oct 2025', time: '09:00 AM', room: 'Hall A', status: 'upcoming' },
  { id: 'ex_3', studentId: 'std_aarav', title: 'Term Exam', subject: 'English', date: '12 Nov 2025', time: '10:00 AM', room: 'Hall B', status: 'upcoming' },
  { id: 'ex_4', studentId: 'std_aarav', title: 'Mid Term Exam', subject: 'Social Studies', date: '25 Nov 2025', time: '10:00 AM', room: 'Hall B', status: 'upcoming' },
  { id: 'ex_5', studentId: 'std_ananya', title: 'Mid-Term Exam', subject: 'Physics', date: '20 Oct 2025', time: '09:30 AM', room: 'Lab 1', status: 'upcoming' },
  { id: 'ex_6', studentId: 'std_ananya', title: 'Mid-Term Exam', subject: 'Mathematics', date: '24 Oct 2025', time: '09:30 AM', room: 'Hall C', status: 'upcoming' },
];

export const DEMO_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann_1',
    title: 'Parent Teacher Meeting',
    date: '5 Oct 2025',
    sender: 'Academic Office',
    content: 'PTM will be held on 15th October 2025 from 9:00 AM to 12:00 PM. Please book your slot with the class coordinator.',
    category: 'General',
    unread: false,
    status: 'published',
    audience: 'All Students & Parents'
  },
  {
    id: 'ann_2',
    title: 'Annual Sports Day',
    date: '3 Oct 2025',
    sender: 'Physical Education Dept',
    content: 'Join us for the Annual Sports Day celebration on 25th October 2025. All parents are cordially invited to cheer for our young athletes.',
    category: 'Events',
    unread: false,
    status: 'published',
    audience: 'All Grades'
  },
  {
    id: 'ann_3',
    title: 'Term 1 Syllabus Released',
    date: '28 Sep 2025',
    sender: 'Curriculum & Examination Cell',
    content: 'The syllabus for Term 1 (2025–26) is now available. Please check the attached document for chapter breakdowns, learning objectives, and weightage.',
    category: 'Academic',
    unread: false,
    status: 'published',
    audience: 'Class 6 - Class 10',
    attachment: {
      name: 'Term 1 Syllabus.pdf',
      size: '2.4 MB',
      type: 'pdf',
      url: '/assets/sample_syllabus.pdf'
    }
  },
  {
    id: 'ann_4',
    title: 'Dussehra Holidays',
    date: '25 Sep 2025',
    sender: 'Principal Office',
    content: 'The school will remain closed from 10th October 2025 to 12th October 2025 on account of Dussehra celebrations. Regular school hours will resume on Monday, 13th October 2025.',
    category: 'Holidays',
    unread: false,
    status: 'published',
    audience: 'All Students & Faculty'
  },
  {
    id: 'ann_5',
    title: 'School ID Card Update',
    date: '20 Sep 2025',
    sender: 'Administration Office',
    content: 'All students are requested to collect their new RFID-enabled identity cards from the school administration office between 8:30 AM and 2:30 PM on school working days.',
    category: 'General',
    unread: false,
    status: 'published',
    audience: 'All Enrolled Students'
  }
];

export const DEMO_TRIPS: TripEvent[] = [
  {
    id: 'trip_1',
    studentId: 'std_aarav',
    title: 'Science Museum Visit',
    date: '25 Oct 2025',
    status: 'upcoming',
    registered: true,
    consentGiven: true,
    cost: 450,
    description: 'Interactive STEM and Planetarium workshops for middle schoolers.'
  },
  {
    id: 'trip_2',
    studentId: 'std_aarav',
    title: 'Annual Sports Day',
    date: '12 Nov 2025',
    status: 'upcoming',
    registered: false,
    consentGiven: false,
    cost: 0,
    description: 'School athletic competitions and march-past.'
  },
  {
    id: 'trip_3',
    studentId: 'std_aarav',
    title: 'Educational Trip',
    date: '5 Dec 2025',
    status: 'upcoming',
    registered: false,
    consentGiven: false,
    cost: 1200,
    description: 'Historical heritage expedition to archaeological sites.'
  },
  {
    id: 'trip_4',
    studentId: 'std_aarav',
    title: 'Cultural Fest',
    date: '20 Dec 2025',
    status: 'upcoming',
    registered: false,
    consentGiven: false,
    cost: 0,
    description: 'Annual inter-house music, dance, and theatre festival.'
  }
];

export const DEMO_DOC_TYPES = [
  { type: 'Bonafide Certificate', purpose: 'For bank account' },
  { type: 'Transfer Certificate', purpose: 'For school transfer' },
  { type: 'Marksheet Copy', purpose: 'For higher studies' },
  { type: 'Character Certificate', purpose: 'For scholarship' },
] as const;

export const DEMO_MARKSHEET: Marksheet = {
  id: 'ms_term1',
  studentId: 'std_aarav',
  term: 'Term 1 Examination',
  academicYear: '2025-2026',
  gpa: 3.92,
  subjects: [
    { subject: 'Mathematics', marksObtained: 94, totalMarks: 100, grade: 'A+' },
    { subject: 'Science', marksObtained: 92, totalMarks: 100, grade: 'A' },
    { subject: 'English', marksObtained: 88, totalMarks: 100, grade: 'A-' },
    { subject: 'Social Studies', marksObtained: 90, totalMarks: 100, grade: 'A' },
    { subject: 'Computer Science', marksObtained: 98, totalMarks: 100, grade: 'A+' },
  ],
  teacherRemarks: 'Aarav has shown outstanding academic aptitude and active classroom participation.'
};

export const DEMO_NOTIFICATIONS: NotificationItem[] = [
  { id: 'notif_1', title: 'Science Exam Syllabus Updated', message: 'The syllabus for the upcoming unit test has been updated by the science department.', time: '5 Oct 2025', read: false, category: 'exam' },
  { id: 'notif_2', title: 'Holiday on 12th October', message: 'School will remain closed on 12th October in observance of regional festival.', time: '3 Oct 2025', read: false, category: 'announcement' },
  { id: 'notif_3', title: 'Mathematics Revision Class', message: 'Special remedial and doubt clearing session on Saturday 10:00 AM.', time: '1 Oct 2025', read: true, category: 'announcement' },
  { id: 'notif_4', title: 'Attendance Alert', message: 'Aarav Sharma was marked present today at 08:05 AM.', time: 'Today, 8:15 AM', read: true, category: 'attendance' },
  { id: 'notif_5', title: 'Fee Due Reminder', message: 'Tuition and Transport fee for Q3 is due on 15 Oct 2025.', time: 'Yesterday', read: true, category: 'fee' },
];

export interface RegistryStudent extends Student {
  dob: string; // YYYY-MM-DD
  authorizedParentEmails: string[];
}

export const SCHOOL_STUDENT_REGISTRY: RegistryStudent[] = [
  {
    ...DEMO_STUDENTS[0],
    dob: '2013-05-14',
    authorizedParentEmails: ['parent@offsleek.edu', 'priya@oxi.edu']
  },
  {
    ...DEMO_STUDENTS[1],
    dob: '2010-11-22',
    authorizedParentEmails: ['parent@offsleek.edu', 'priya@oxi.edu']
  },
  {
    id: 'std_rohan',
    name: 'Rohan Sharma',
    grade: 'Class 5',
    section: 'Section C',
    rollNumber: '7015',
    schoolName: 'OFFSLEEK International School',
    avatar: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=150&auto=format&fit=crop&q=80',
    attendancePercentage: 95,
    pendingFeeAmount: 6500,
    upcomingExamsCount: 2,
    announcementsCount: 1,
    dob: '2014-08-19',
    authorizedParentEmails: ['parent@offsleek.edu', 'priya@oxi.edu']
  },
  {
    id: 'std_vihaan',
    name: 'Vihaan Verma',
    grade: 'Class 7',
    section: 'Section B',
    rollNumber: '8022',
    schoolName: 'OFFSLEEK International School',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    attendancePercentage: 89,
    pendingFeeAmount: 0,
    upcomingExamsCount: 3,
    announcementsCount: 2,
    dob: '2012-04-10',
    authorizedParentEmails: ['rajesh.verma@example.com'] // Unauthorized for Priya
  }
];

export interface LinkChildParams {
  studentIdOrRoll: string;
  dob: string;
  parentEmail: string;
  currentlyLinkedIds: string[];
}

export interface LinkChildResponse {
  success: boolean;
  message: string;
  student: Student;
}

export interface UnlinkChildParams {
  studentId: string;
  parentEmail: string;
  currentlyLinkedIds: string[];
}

export interface UnlinkChildResponse {
  success: boolean;
  message: string;
}

export async function apiClient<T>(endpoint: string, options: RequestInit = {}, isDemoMode: boolean = false): Promise<T> {
  if (isDemoMode) {
    await new Promise((resolve) => setTimeout(resolve, 350));
    return handleDemoRequest<T>(endpoint, options);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server API Error (${response.status}): ${errorText || response.statusText}`);
    }

    return response.json();
  } catch (err: any) {
    if (endpoint.includes('/portal/students/link') || endpoint.includes('/portal/students/unlink')) {
      throw new Error(
        `Missing Backend Integration: The live School OS endpoint ${endpoint} is not provisioned on the production server. To link live records, configure the registrar API route.`
      );
    }
    throw err;
  }
}

function handleDemoRequest<T>(endpoint: string, options: RequestInit): T {
  if (endpoint.startsWith('/auth/login')) {
    const body = options.body ? JSON.parse(options.body as string) : {};
    const user = DEMO_USERS.find(u => u.email === body.email) || DEMO_USERS[0];
    return { user, token: user.token } as unknown as T;
  }
  if (endpoint === '/portal/students/link') {
    const body: LinkChildParams = options.body ? JSON.parse(options.body as string) : ({} as LinkChildParams);
    const { studentIdOrRoll, dob, parentEmail, currentlyLinkedIds = [] } = body;

    if (!studentIdOrRoll || !studentIdOrRoll.trim()) {
      throw new Error('Validation Error: Student Admission Number or Roll ID is required.');
    }
    if (!dob || !dob.trim()) {
      throw new Error('Validation Error: Student Date of Birth is required for verification.');
    }

    const cleanInput = studentIdOrRoll.trim().toLowerCase();
    const student = SCHOOL_STUDENT_REGISTRY.find(
      s => s.rollNumber.toLowerCase() === cleanInput || s.id.toLowerCase() === cleanInput
    );

    if (!student) {
      throw new Error(
        `Verification Failed: No student record found matching Admission ID / Roll No "${studentIdOrRoll}". Please check the admission number provided by the school.`
      );
    }

    // Verify Date of Birth
    if (student.dob !== dob.trim()) {
      throw new Error(
        `Verification Failed: The date of birth provided does not match the official school registrar records for this student.`
      );
    }

    // Verify Parent Authorization
    const cleanEmail = (parentEmail || '').trim().toLowerCase();
    const isAuthorized = student.authorizedParentEmails.some(e => e.toLowerCase() === cleanEmail);
    if (!isAuthorized) {
      throw new Error(
        `Authorization Denied: Your parent account (${parentEmail}) is not listed as the authorized guardian for student "${student.name}". For student safety, please submit custody/guardian documents to the school registrar.`
      );
    }

    // Prevent Duplicate Links
    if (currentlyLinkedIds.includes(student.id)) {
      throw new Error(`Duplicate Link: Student "${student.name}" (Roll No: ${student.rollNumber}) is already linked to your account.`);
    }

    const cleanStudent: Student = {
      id: student.id,
      name: student.name,
      grade: student.grade,
      section: student.section,
      rollNumber: student.rollNumber,
      schoolName: student.schoolName,
      avatar: student.avatar,
      attendancePercentage: student.attendancePercentage,
      pendingFeeAmount: student.pendingFeeAmount,
      upcomingExamsCount: student.upcomingExamsCount,
      announcementsCount: student.announcementsCount,
    };

    return {
      success: true,
      message: `Identity verified. Successfully linked ${student.name} to your parent portal.`,
      student: cleanStudent
    } as unknown as T;
  }

  if (endpoint === '/portal/students/unlink') {
    const body: UnlinkChildParams = options.body ? JSON.parse(options.body as string) : ({} as UnlinkChildParams);
    const { currentlyLinkedIds = [] } = body;

    if (currentlyLinkedIds.length <= 1) {
      throw new Error(
        'Authorization Rule: Cannot unlink your only remaining linked child. School OS security requires parent accounts to have at least one active enrolled student. Contact school administration for withdrawal procedures.'
      );
    }

    return {
      success: true,
      message: 'Student record successfully unlinked from your parent portal.'
    } as unknown as T;
  }

  if (endpoint.startsWith('/portal/students')) {
    return DEMO_STUDENTS as unknown as T;
  }
  if (endpoint.startsWith('/portal/fees')) {
    return DEMO_FEES as unknown as T;
  }
  if (endpoint.startsWith('/portal/announcements')) {
    return DEMO_ANNOUNCEMENTS as unknown as T;
  }
  if (endpoint.startsWith('/portal/exams')) {
    return DEMO_EXAMS as unknown as T;
  }
  if (endpoint.startsWith('/portal/trips')) {
    return DEMO_TRIPS as unknown as T;
  }
  if (endpoint.startsWith('/portal/notifications')) {
    return DEMO_NOTIFICATIONS as unknown as T;
  }
  if (endpoint.startsWith('/portal/marksheets')) {
    return DEMO_MARKSHEET as unknown as T;
  }

  throw new Error(`Demo endpoint not found: ${endpoint}`);
}
