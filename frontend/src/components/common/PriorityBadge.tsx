import React from 'react';

interface PriorityBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ score, size = 'md', showLabel = true }) => {
  let color = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let badgeText = 'Moderate';

  if (score >= 85) {
    color = 'bg-rose-50 text-rose-700 border-rose-200';
    badgeText = 'Critical';
  } else if (score >= 70) {
    color = 'bg-amber-50 text-amber-700 border-amber-200';
    badgeText = 'High Priority';
  } else if (score >= 50) {
    color = 'bg-blue-50 text-blue-700 border-blue-200';
    badgeText = 'Standard';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1 font-medium',
    lg: 'text-sm px-3.5 py-1.5 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-sm ${color} ${sizeClasses[size]}`}
      title={`AI Calculated Priority Score: ${score}/100`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
      <span>{score}/100</span>
      {showLabel && <span className="opacity-75 font-normal">({badgeText})</span>}
    </span>
  );
};
