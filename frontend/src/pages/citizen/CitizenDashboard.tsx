import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, CheckCircle, Clock, Sparkles, MapPin, ChevronRight, AlertCircle, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { challengesApi } from '../../services/api';
import { Challenge } from '../../types';
import { PriorityBadge } from '../../components/common/PriorityBadge';

export const CitizenDashboard: React.FC = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const res = await challengesApi.getAll({ limit: 10 });
        setChallenges(res.data.challenges);
      } catch (err) {
        console.error('Failed to load citizen challenges:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChallenges();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 text-white rounded-3xl p-6 sm:p-8 shadow-elevated flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">
            Citizen & Community Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black">
            Welcome back, {user?.full_name || 'Community Member'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Track your submitted challenges, ground validations, and university innovation progress across Jharkhand.
          </p>
        </div>

        <Link
          to="/citizen/challenges/new"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-brand-blue hover:bg-blue-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/25 transition transform hover:-translate-y-0.5 flex-shrink-0"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Report New Challenge</span>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-xs text-slate-500 font-medium block">Total Submitted</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{challenges.length}</span>
          <span className="text-[10px] text-emerald-600 font-semibold">Active in System</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-xs text-slate-500 font-medium block">Panchayat Validated</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">
            {challenges.filter((c) => c.status === 'VALIDATED' || c.status === 'IN_PROJECT').length}
          </span>
          <span className="text-[10px] text-slate-400">Ground verified</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-xs text-slate-500 font-medium block">University Matched</span>
          <span className="text-2xl font-black text-purple-600 mt-1 block">
            {challenges.filter((c) => c.status === 'IN_PROJECT' || c.status === 'MATCHED').length}
          </span>
          <span className="text-[10px] text-purple-600 font-semibold">Under active R&D</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-xs text-slate-500 font-medium block">Community Pilots</span>
          <span className="text-2xl font-black text-amber-600 mt-1 block">1</span>
          <span className="text-[10px] text-amber-600 font-semibold">Kanke Irrigation Pilot</span>
        </div>
      </div>

      {/* Submitted Challenges List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">My Community Challenges</h3>
            <p className="text-xs text-slate-500">Live status tracking from citizen report to deployable solution</p>
          </div>
          <Link to="/challenges" className="text-xs font-semibold text-brand-blue flex items-center gap-1">
            Browse All Public Challenges <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {challenges.slice(0, 5).map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-2xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50/60 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {c.id}
                  </span>
                  <span className="text-[11px] font-semibold text-brand-blue bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {c.primary_domain}
                  </span>
                  <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-medium">
                    {c.status}
                  </span>
                  <PriorityBadge score={c.priority_score} size="sm" showLabel={false} />
                </div>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">{c.title}</h4>
                <div className="text-xs text-slate-500 flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-slate-400" />
                    {c.district} ({c.block || 'Sadar'})
                  </span>
                  <span>•</span>
                  <span>~{c.affected_population.toLocaleString()} affected</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <Link
                  to={`/challenge/${c.id}`}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-brand-blue hover:text-white text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <span>Track Status</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
