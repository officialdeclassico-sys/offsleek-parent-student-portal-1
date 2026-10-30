import React from 'react';
import { UnifiedRequestsFlow } from './UnifiedRequestsFlow';
import { ScreenType } from './ParentDashboardView';

interface Props {
  onBack: () => void;
  onNavigate?: (screen: ScreenType) => void;
  onOpenCertificates?: (certId?: string) => void;
}

export const StudentRequestsView: React.FC<Props> = ({ onBack, onNavigate }) => {
  return (
    <UnifiedRequestsFlow
      onBack={onBack}
      onNavigate={onNavigate || (() => {})}
      initialView="dashboard"
    />
  );
};
