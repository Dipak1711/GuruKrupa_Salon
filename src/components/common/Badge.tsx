import React from 'react';
import { Clock, CheckCircle2, CheckCheck, XCircle, AlertTriangle, UserX, UserCheck } from 'lucide-react';
import { AppointmentStatus } from '../../types';

interface BadgeProps {
  status: AppointmentStatus | 'leave' | 'available' | 'full_day' | 'half_day' | 'active' | 'inactive';
  label?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ status, label, size = 'md' }) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          text: label || 'Pending Request',
          className: 'badge badge-pending',
        };
      case 'confirmed':
        return {
          icon: CheckCircle2,
          text: label || 'Confirmed',
          className: 'badge badge-confirmed',
        };
      case 'completed':
        return {
          icon: CheckCheck,
          text: label || 'Completed',
          className: 'badge badge-completed',
        };
      case 'cancelled':
        return {
          icon: XCircle,
          text: label || 'Cancelled',
          className: 'badge badge-cancelled',
        };
      case 'rejected':
        return {
          icon: AlertTriangle,
          text: label || 'Declined',
          className: 'badge badge-rejected',
        };
      case 'leave':
      case 'full_day':
      case 'half_day':
        return {
          icon: UserX,
          text: label || 'On Leave',
          className: 'badge badge-leave',
        };
      case 'available':
      case 'active':
        return {
          icon: UserCheck,
          text: label || 'Available Today',
          className: 'badge badge-available',
        };
      case 'inactive':
        return {
          icon: XCircle,
          text: label || 'Inactive / Archived',
          className: 'badge badge-cancelled',
        };
      default:
        return {
          icon: Clock,
          text: label || status,
          className: 'badge badge-pending',
        };
    }
  };

  const config = getBadgeConfig();
  const IconComponent = config.icon;
  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <span
      className={config.className}
      style={{
        fontSize: size === 'sm' ? '0.72rem' : '0.78rem',
        padding: size === 'sm' ? '2px 8px' : '4px 12px',
      }}
    >
      <IconComponent size={iconSize} />
      <span>{config.text}</span>
    </span>
  );
};
