import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  Users,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { dashboardsApi, universitiesApi } from '../../services/api';
import { Project, University } from '../../types';
import { IRLProgress } from '../../components/common/IRLProgress';

export const UniversityDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<{
    university: University;
    kpis: any;
    projects: Project[];
    recommendations: any[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUniData = async () => {
      try {
        const res = await dashboardsApi.getUniversity();
        setData(res.data);
      } catch (err) {
        console.error('Failed to load university dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUniData();
  }, []);

  const handleAcceptMatch = async (challengeId: string) => {
    if (!data) return;
    try {
      const res = await universitiesApi.acceptChallenge(data.university.id, {
        challenge_id: challengeId,
        project_title: 'Multidisciplinary Engineering Solution for Ground Challenge',
        budget: 350000,
      });
      alert('Challenge accepted! Project initialized.');
      navigate(`/projects/${res.data.project.id}`);
    } catch (err) {
      console.error('Failed to accept match:', err);
      alert('Error accepting challenge.');
    }
  };

  if (isLoading || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-xs text-slate-400">
        Loading University Innovation Portal...
      </div>
    );
  }

  const { university, kpis, projects, recommendations } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-navy-950 to-navy-800 text-white rounded-3xl p-6 sm:p-8 shadow-elevated flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-blue-600 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            {university.short_code}
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-brand-blue font-bold uppercase tracking-wider">
              <span>{university.type} University Partner</span>
              <span>•</span>
              <span className="text-emerald-400">Verified Academic Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">{university.name}</h1>
            <p className="text-xs text-slate-300 mt-0.5">
              {university.address} • Research Domains: {university.research_domains.join(', ')}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 self-start md:self-auto">
          <Link
            to="/challenges"
            className="px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-blue-600 text-white text-xs font-bold transition flex items-center gap-1.5"
          >
            <Sparkles className="h-4 w-4" />
            <span>Challenge Marketplace</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-xs text-slate-500 font-medium block">Active Innovation Projects</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{kpis.active_projects}</span>
          <span className="text-[10px] text-brand-blue font-semibold">Under Mentorship</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-xs text-slate-500 font-medium block">Faculty Mentors Engaged</span>
          <span className="text-2xl font-black text-purple-600 mt-1 block">{kpis.faculty_mentors}</span>
          <span className="text-[10px] text-slate-400">Specialized Supervisors</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-xs text-slate-500 font-medium block">Prototypes in Labs (IRL-3/4)</span>
          <span className="text-2xl font-black text-amber-600 mt-1 block">{kpis.prototypes_in_lab}</span>
          <span className="text-[10px] text-amber-700 font-medium">Bench Testing</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-xs text-slate-500 font-medium block">Community Pilots (IRL-5+)</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">{kpis.field_pilots}</span>
          <span className="text-[10px] text-emerald-700 font-medium">Field Deployed</span>
        </div>
      </div>

      {/* RECOMMENDED MATCHES SECTION */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              High-Confidence Challenge Matches for {university.short_code}
            </h3>
            <p className="text-xs text-slate-500">
              Ranked by AI matching algorithms based on department expertise, laboratory equipment, and geographic proximity
            </p>
          </div>
          <span className="text-xs text-brand-blue font-bold bg-blue-50 px-2.5 py-1 rounded-full">
            {recommendations.length} Recommended
          </span>
        </div>

        <div className="space-y-4">
          {recommendations.slice(0, 3).map((rec: any) => (
            <div
              key={rec.challenge.id}
              className="p-4 rounded-2xl border border-slate-200 hover:border-brand-blue/50 hover:bg-slate-50/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {rec.challenge.id}
                  </span>
                  <span className="text-xs font-bold text-brand-blue bg-blue-50 px-2 py-0.5 rounded">
                    {rec.challenge.primary_domain}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {rec.score}% Match Score
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{rec.challenge.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-1">{rec.challenge.description}</p>
                <div className="text-[11px] text-slate-500 italic mt-1">
                  Reason: {rec.breakdown.reason}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                <Link
                  to={`/challenge/${rec.challenge.id}`}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                >
                  View Radar
                </Link>
                <button
                  onClick={() => handleAcceptMatch(rec.challenge.id)}
                  className="px-4 py-2 rounded-xl bg-brand-blue hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs"
                >
                  Accept & Form Team
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* INSTITUTION'S ACTIVE PROJECTS */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              Active Innovation Projects Portfolio
            </h3>
            <p className="text-xs text-slate-500">
              Multidisciplinary teams progressing through Innovation Readiness Levels
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="p-5 rounded-2xl border border-slate-200 hover:border-brand-blue transition space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                      {proj.id}
                    </span>
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      Lead: {proj.lead_faculty_name}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mt-1">{proj.title}</h4>
                </div>

                <Link
                  to={`/projects/${proj.id}`}
                  className="px-4 py-2 rounded-xl bg-brand-blue hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>Open Workspace</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* IRL Stage Gate Tracker */}
              <IRLProgress currentStage={proj.irl_level} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
