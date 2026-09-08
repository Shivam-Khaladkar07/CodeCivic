import React from 'react';
import { Award, Building2, MapPin, CheckCircle } from 'lucide-react';
import { UniversityMatch } from '../../types';

interface MatchScoreCardProps {
  match: UniversityMatch;
  onAccept?: () => void;
  showAcceptButton?: boolean;
}

export const MatchScoreCard: React.FC<MatchScoreCardProps> = ({
  match,
  onAccept,
  showAcceptButton = false,
}) => {
  const { breakdown } = match;

  const scoreBars = [
    { label: 'Domain Alignment (35%)', value: breakdown.domain_score, color: 'bg-brand-blue' },
    { label: 'Faculty Research Expertise (25%)', value: breakdown.faculty_score, color: 'bg-purple-600' },
    { label: 'Lab & Testing Infrastructure (15%)', value: breakdown.lab_score, color: 'bg-teal-600' },
    { label: 'Geographic Proximity (10%)', value: breakdown.geography_score, color: 'bg-emerald-600' },
    { label: 'Previous Track Record (10%)', value: breakdown.previous_work_score, color: 'bg-amber-500' },
    { label: 'Current Faculty Bandwidth (5%)', value: breakdown.availability_score, color: 'bg-indigo-500' },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft hover:shadow-elevated transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-start gap-3">
          <div className="h-11 w-11 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center flex-shrink-0">
            <Building2 className="h-6 w-6 text-brand-blue" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900">{match.university_name}</h4>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                {match.university_district}, Jharkhand
              </span>
              <span>•</span>
              <span className="text-emerald-700 font-medium">Verified Academic Partner</span>
            </div>
          </div>
        </div>

        <div className="flex items-center sm:flex-col sm:items-end justify-between">
          <span className="text-xs text-slate-500 font-medium">Explainable Match</span>
          <div className="flex items-center gap-1.5">
            <span className="text-2xl font-black text-brand-blue">{match.match_score}%</span>
            <Award className="h-5 w-5 text-amber-500" />
          </div>
        </div>
      </div>

      {/* Progress Bars for each factor */}
      <div className="py-4 space-y-2.5">
        {scoreBars.map((bar, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600 font-medium">{bar.label}</span>
              <span className="text-slate-900 font-semibold">{bar.value}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${bar.color} rounded-full transition-all duration-700`}
                style={{ width: `${bar.value}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Explanation Reasoning */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs text-slate-600 leading-relaxed">
        <strong className="text-slate-800 font-semibold block mb-0.5">Recommendation Rationale:</strong>
        {breakdown.reason}
      </div>

      {showAcceptButton && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onAccept}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-blue text-white text-xs font-semibold hover:bg-blue-700 transition shadow-sm"
          >
            <CheckCircle className="h-4 w-4" />
            Accept Challenge & Form Student Team
          </button>
        </div>
      )}
    </div>
  );
};
