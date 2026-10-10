import React from 'react';
import type { RiskCategory, RiskSeverity, RiskStatus } from '../../types/risk';
import { 
  ShieldAlert, 
  DollarSign, 
  Truck, 
  FileCheck2, 
  Users, 
  AlertCircle,
  Clock,
  CheckCircle2
} from 'lucide-react';

interface CategoryBadgeProps {
  category: RiskCategory;
  size?: 'sm' | 'md';
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, size = 'sm' }) => {
  const configs: Record<RiskCategory, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
    delivery: {
      label: 'Delivery',
      icon: <Truck className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
      color: 'text-indigo-400 border-indigo-500/30',
      bg: 'bg-indigo-950/40'
    },
    financial: {
      label: 'Financial',
      icon: <DollarSign className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
      color: 'text-amber-400 border-amber-500/30',
      bg: 'bg-amber-950/40'
    },
    security: {
      label: 'Security',
      icon: <ShieldAlert className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
      color: 'text-rose-400 border-rose-500/30',
      bg: 'bg-rose-950/40'
    },
    compliance: {
      label: 'Compliance',
      icon: <FileCheck2 className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
      color: 'text-teal-400 border-teal-500/30',
      bg: 'bg-teal-950/40'
    },
    customer: {
      label: 'Customer',
      icon: <Users className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
      color: 'text-sky-400 border-sky-500/30',
      bg: 'bg-sky-950/40'
    }
  };

  const config = configs[category] || configs.delivery;

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${config.bg} ${config.color} ${
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
    }`}>
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};

interface SeverityBadgeProps {
  severity: RiskSeverity;
  size?: 'sm' | 'md';
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, size = 'sm' }) => {
  const configs: Record<RiskSeverity, { label: string; text: string; bg: string; border: string; dot: string }> = {
    critical: {
      label: 'Critical',
      text: 'text-rose-400',
      bg: 'bg-rose-950/50',
      border: 'border-rose-500/40',
      dot: 'bg-rose-500 animate-pulse'
    },
    high: {
      label: 'High',
      text: 'text-amber-400',
      bg: 'bg-amber-950/50',
      border: 'border-amber-500/40',
      dot: 'bg-amber-500'
    },
    medium: {
      label: 'Medium',
      text: 'text-sky-400',
      bg: 'bg-sky-950/50',
      border: 'border-sky-500/30',
      dot: 'bg-sky-400'
    },
    low: {
      label: 'Low',
      text: 'text-emerald-400',
      bg: 'bg-emerald-950/50',
      border: 'border-emerald-500/30',
      dot: 'bg-emerald-400'
    }
  };

  const config = configs[severity] || configs.low;

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${config.bg} ${config.text} ${config.border} ${
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span className="capitalize">{config.label}</span>
    </span>
  );
};

interface StatusBadgeProps {
  status: RiskStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'open':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-rose-950/40 text-rose-300 border border-rose-500/30">
          <AlertCircle className="w-3 h-3 text-rose-400" />
          <span>Open</span>
        </span>
      );
    case 'mitigating':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-amber-950/40 text-amber-300 border border-amber-500/30">
          <Clock className="w-3 h-3 text-amber-400" />
          <span>Mitigating</span>
        </span>
      );
    case 'resolved':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-950/40 text-emerald-300 border border-emerald-500/30">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span>Resolved</span>
        </span>
      );
    default:
      return null;
  }
};
