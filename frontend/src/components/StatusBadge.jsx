import React from 'react';
import { CheckCircle2, Clock, XCircle, FileText } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'Applied':
        return {
          className: 'badge badge-applied',
          icon: <FileText size={13} />,
          label: 'Applied',
        };
      case 'Reviewed':
        return {
          className: 'badge badge-reviewed',
          icon: <Clock size={13} />,
          label: 'Under Review',
        };
      case 'Accepted':
        return {
          className: 'badge badge-accepted',
          icon: <CheckCircle2 size={13} />,
          label: 'Accepted',
        };
      case 'Rejected':
        return {
          className: 'badge badge-rejected',
          icon: <XCircle size={13} />,
          label: 'Rejected',
        };
      default:
        return {
          className: 'badge badge-neutral',
          icon: null,
          label: status || 'Unknown',
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <span className={config.className}>
      {config.icon}
      {config.label}
    </span>
  );
};

export default StatusBadge;
