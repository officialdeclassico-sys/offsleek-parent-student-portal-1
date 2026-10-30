import React from 'react';
import { UnifiedRequestsFlow } from './UnifiedRequestsFlow';
import { ScreenType } from './ParentDashboardView';

export interface LeaveRequestRecord {
  id: string;
  childName: string;
  grade: string;
  rollNumber: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submissionDate: string;
  fromDate: string;
  toDate: string;
  days: number;
  leaveType: string;
  reason: string;
  attachment?: string;
  submittedTimestamp: string;
  decisionTimestamp?: string;
  completedTimestamp?: string;
  rejectionReason?: string;
  reviewedBy?: string;
}

export const ParentLeaveRequestsView: React.FC<{
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
  initialView?: 'main' | 'leave-tab' | 'apply' | 'success';
}> = ({ onBack, onNavigate, initialView = 'main' }) => {
  const mappedView: 'dashboard' | 'history' | 'apply' = 
    initialView === 'apply' 
      ? 'apply' 
      : initialView === 'leave-tab' 
      ? 'history' 
      : 'dashboard';

  const mappedFilter: 'All' | 'Leave' = 
    initialView === 'leave-tab' ? 'Leave' : 'All';

  return (
    <UnifiedRequestsFlow
      onBack={onBack}
      onNavigate={onNavigate}
      initialView={mappedView}
      initialFilter={mappedFilter}
    />
  );
};
