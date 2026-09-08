import React from 'react';
import { IRLStage } from '../../types';

interface IRLProgressProps {
  currentStage: IRLStage;
  className?: string;
}

const STAGES: Array<{ id: IRLStage; label: string; desc: string }> = [
  { id: 'IRL-1', label: 'IRL-1', desc: 'Problem Validated' },
  { id: 'IRL-2', label: 'IRL-2', desc: 'Solution Proposed' },
  { id: 'IRL-3', label: 'IRL-3', desc: 'Prototype Built' },
  { id: 'IRL-4', label: 'IRL-4', desc: 'Lab Tested' },
  { id: 'IRL-5', label: 'IRL-5', desc: 'Community Pilot' },
  { id: 'IRL-6', label: 'IRL-6', desc: 'Field Validated' },
  { id: 'IRL-7', label: 'IRL-7', desc: 'Deployment Ready' },
  { id: 'IRL-8', label: 'IRL-8', desc: 'Scaled Impact' },
];

export const IRLProgress: React.FC<IRLProgressProps> = ({ currentStage, className = '' }) => {
  const currentIndex = STAGES.findIndex((s) => s.id === currentStage);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Innovation Readiness Level (IRL)
        </span>
        <span className="text-xs font-bold text-brand-blue bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
          Stage: {currentStage} ({STAGES[currentIndex]?.desc || 'In Progress'})
        </span>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
        {STAGES.map((stage, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isUpcoming = idx > currentIndex;

          let bg = 'bg-slate-100 text-slate-400 border-slate-200';
          if (isCompleted) {
            bg = 'bg-emerald-500 text-white border-emerald-600 shadow-sm';
          } else if (isCurrent) {
            bg = 'bg-brand-blue text-white border-blue-600 ring-2 ring-blue-300 shadow-sm font-bold animate-pulse';
          }

          return (
            <div
              key={stage.id}
              className={`flex flex-col items-center justify-center p-1.5 rounded text-center border transition-all ${bg}`}
              title={`${stage.id}: ${stage.desc}`}
            >
              <span className="text-[11px] font-semibold">{stage.id}</span>
              <span className="text-[9px] line-clamp-1 leading-tight opacity-90 hidden sm:block">
                {stage.desc}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
