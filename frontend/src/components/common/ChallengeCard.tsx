import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, AlertCircle, ArrowUpRight, Layers } from 'lucide-react';
import { Challenge } from '../../types';
import { PriorityBadge } from './PriorityBadge';

interface ChallengeCardProps {
  challenge: Challenge;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge }) => {
  const statusColors: Record<string, string> = {
    SUBMITTED: 'bg-slate-100 text-slate-700 border-slate-200',
    AI_SCREENED: 'bg-purple-50 text-purple-700 border-purple-200',
    VALIDATION_PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
    VALIDATED: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold',
    MATCHED: 'bg-blue-50 text-blue-700 border-blue-200',
    IN_PROJECT: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    SOLVED: 'bg-teal-50 text-teal-800 border-teal-300 font-semibold',
  };

  return (
    <div className="group rounded-2xl border border-slate-200/90 bg-white p-5 shadow-soft hover:shadow-elevated hover:border-brand-blue/40 transition-all flex flex-col justify-between">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {challenge.id}
            </span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded border capitalize ${
                statusColors[challenge.status] || 'bg-slate-100 text-slate-700'
              }`}
            >
              {challenge.status.replace('_', ' ')}
            </span>
            {challenge.cluster_id && (
              <span className="text-[10px] bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.5 rounded flex items-center gap-1">
                <Layers className="h-3 w-3" />
                Cluster
              </span>
            )}
          </div>
          <PriorityBadge score={challenge.priority_score} size="sm" showLabel={false} />
        </div>

        {/* Title & Domain */}
        <div className="mb-2">
          <span className="text-[11px] font-semibold text-brand-blue uppercase tracking-wider block mb-1">
            {challenge.primary_domain} {challenge.sub_domain && `› ${challenge.sub_domain}`}
          </span>
          <Link to={`/challenge/${challenge.id}`}>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-blue transition line-clamp-2 leading-snug">
              {challenge.title}
            </h3>
          </Link>
        </div>

        {/* Description snippet */}
        <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
          {challenge.description}
        </p>
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-slate-100 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            {challenge.block || challenge.district}, {challenge.district}
          </span>
          <span className="flex items-center gap-1 font-medium text-slate-700">
            <Users className="h-3.5 w-3.5 text-slate-400" />
            ~{challenge.affected_population.toLocaleString()} pop
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span
            className={`text-[11px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${
              challenge.urgency === 'critical'
                ? 'bg-rose-50 text-rose-700'
                : challenge.urgency === 'high'
                ? 'bg-amber-50 text-amber-700'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            <AlertCircle className="h-3 w-3" />
            {challenge.urgency.toUpperCase()} URGENCY
          </span>

          <Link
            to={`/challenge/${challenge.id}`}
            className="text-xs font-semibold text-brand-blue hover:text-blue-800 flex items-center gap-0.5 group-hover:translate-x-0.5 transition"
          >
            Details <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
