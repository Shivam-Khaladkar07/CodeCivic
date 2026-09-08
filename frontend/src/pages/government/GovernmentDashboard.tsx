import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  AlertTriangle,
  Layers,
  Building2,
  Users,
  Compass,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { dashboardsApi } from '../../services/api';
import { Challenge, ChallengeCluster } from '../../types';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const GovernmentDashboard: React.FC = () => {
  const [data, setData] = useState<{
    kpis: any;
    attention_required: { high_priority_unvalidated: Challenge[]; critical_clusters: ChallengeCluster[] };
    charts: { domain_distribution: any[]; district_distribution: any[]; irl_distribution: any[] };
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadGovData = async () => {
      try {
        const res = await dashboardsApi.getGovernment();
        setData(res.data);
      } catch (err) {
        console.error('Failed to load government dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadGovData();
  }, []);

  if (isLoading || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-xs text-slate-400">
        Loading Government Decision Intelligence...
      </div>
    );
  }

  const { kpis, attention_required, charts } = data;
  const COLORS = ['#0284C7', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#0D9488', '#6366F1'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Executive Header */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white rounded-3xl p-6 sm:p-8 shadow-elevated flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Shield className="h-4 w-4" />
            Executive Decision Intelligence Radar
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            State Societal Innovation Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Real-time pipeline governance: from citizen problem crowdsourcing through university matching and
            deployable community impact.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/government/clusters"
            className="px-4 py-2.5 rounded-xl bg-purple-600/80 hover:bg-purple-600 text-white text-xs font-bold transition flex items-center gap-1.5"
          >
            <Layers className="h-4 w-4" />
            <span>Problem Clusters ({kpis.challenge_clusters})</span>
          </Link>
          <Link
            to="/government/map"
            className="px-4 py-2.5 rounded-xl bg-navy-700 hover:bg-navy-600 text-slate-200 text-xs font-semibold transition flex items-center gap-1.5"
          >
            <MapPin className="h-4 w-4 text-brand-blue" />
            <span>Geospatial Radar</span>
          </Link>
          <Link
            to="/government/analytics"
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5"
          >
            <TrendingUp className="h-4 w-4" />
            <span>Impact Analytics</span>
          </Link>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-[11px] text-slate-400 font-bold uppercase">Total Challenges</span>
          <span className="text-2xl font-black text-slate-900 block mt-1">{kpis.total_challenges}</span>
          <span className="text-[10px] text-slate-500">Across 24 Districts</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-[11px] text-slate-400 font-bold uppercase">Validated Truth</span>
          <span className="text-2xl font-black text-emerald-600 block mt-1">{kpis.validated_challenges}</span>
          <span className="text-[10px] text-emerald-700 font-medium">Ground Inspected</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-[11px] text-slate-400 font-bold uppercase">Active Projects</span>
          <span className="text-2xl font-black text-brand-blue block mt-1">{kpis.active_projects}</span>
          <span className="text-[10px] text-blue-600 font-medium">Under HEI Teams</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-[11px] text-slate-400 font-bold uppercase">Lab Prototypes</span>
          <span className="text-2xl font-black text-purple-600 block mt-1">{kpis.prototypes_built}</span>
          <span className="text-[10px] text-purple-700 font-medium">IRL-3 / IRL-4</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-[11px] text-slate-400 font-bold uppercase">Community Pilots</span>
          <span className="text-2xl font-black text-amber-600 block mt-1">{kpis.pilots_deployed}</span>
          <span className="text-[10px] text-amber-700 font-medium">IRL-5 Field Units</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-[11px] text-slate-400 font-bold uppercase">Verified Impact</span>
          <span className="text-2xl font-black text-emerald-600 block mt-1">14.2L+</span>
          <span className="text-[10px] text-slate-400">Citizens Benefited</span>
        </div>
      </div>

      {/* "WHAT REQUIRES ATTENTION?" DECISION INTELLIGENCE */}
      <div className="bg-rose-50/50 rounded-3xl border border-rose-200 p-6 space-y-4 shadow-soft">
        <div className="flex items-center justify-between border-b border-rose-100 pb-3">
          <div className="flex items-center gap-2 text-rose-800">
            <AlertTriangle className="h-5 w-5 text-rose-600" />
            <h3 className="text-base font-black">Executive Priority: What Requires Immediate Attention?</h3>
          </div>
          <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
            Action Recommended
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* High Priority Unvalidated */}
          <div className="bg-white p-4 rounded-2xl border border-rose-200/80 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Unvalidated High-Priority Challenges (Score ≥ 80)
              </span>
              <span className="text-[10px] text-rose-600 font-bold">Needs Review</span>
            </div>

            <div className="space-y-2">
              {attention_required.high_priority_unvalidated.slice(0, 3).map((ch) => (
                <Link
                  key={ch.id}
                  to={`/challenge/${ch.id}`}
                  className="p-2.5 rounded-xl border border-slate-100 hover:border-brand-blue hover:bg-blue-50/40 transition block"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-slate-500">{ch.id}</span>
                    <PriorityBadge score={ch.priority_score} size="sm" showLabel={false} />
                  </div>
                  <div className="text-xs font-bold text-slate-900 truncate mt-0.5">{ch.title}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {ch.district} • ~{ch.affected_population} pop affected
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Critical Clusters */}
          <div className="bg-white p-4 rounded-2xl border border-rose-200/80 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Critical Systemic Problem Clusters
              </span>
              <Link to="/government/clusters" className="text-[10px] text-brand-blue font-bold">
                View All Clusters →
              </Link>
            </div>

            <div className="space-y-2">
              {attention_required.critical_clusters.slice(0, 3).map((cl) => (
                <Link
                  key={cl.id}
                  to={`/government/clusters`}
                  className="p-2.5 rounded-xl border border-slate-100 hover:border-purple-300 hover:bg-purple-50/40 transition block"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-purple-700">{cl.id}</span>
                    <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-[10px] uppercase">
                      {cl.severity} Severity
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 truncate mt-0.5">{cl.cluster_title}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {cl.district} • {cl.report_count} Reports Merged • ~{cl.affected_population.toLocaleString()} pop
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Domain Distribution Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Challenges by Societal Domain</h3>
              <p className="text-xs text-slate-400">Total volume across 12 thematic areas</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.domain_distribution}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-25} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#0284C7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* IRL Project Progression Funnel */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Innovation Readiness Level (IRL) Funnel</h3>
              <p className="text-xs text-slate-400">50 active projects moving from IRL-1 to IRL-8</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.irl_distribution}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 'bold' }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
