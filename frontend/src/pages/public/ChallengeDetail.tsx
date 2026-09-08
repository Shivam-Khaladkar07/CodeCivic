import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Users,
  AlertCircle,
  Building2,
  CheckCircle2,
  Layers,
  ArrowRight,
  Shield,
  Clock,
  Sparkles,
  Share2,
  Check,
} from 'lucide-react';
import { challengesApi, universitiesApi } from '../../services/api';
import { Challenge, UniversityMatch } from '../../types';
import { AISummaryCard } from '../../components/common/AISummaryCard';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { MatchScoreCard } from '../../components/common/MatchScoreCard';
import { useAuth } from '../../context/AuthContext';

export const ChallengeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [matches, setMatches] = useState<UniversityMatch[]>([]);
  const [duplicates, setDuplicates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Government validation form state
  const [validationNotes, setValidationNotes] = useState('');
  const [department, setDepartment] = useState('Agriculture & Water Resources');
  const [isSubmittingVal, setIsSubmittingVal] = useState(false);

  // University acceptance state
  const [isAccepting, setIsAccepting] = useState(false);

  useEffect(() => {
    const loadDetails = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const [cRes, mRes, simRes] = await Promise.all([
          challengesApi.getById(id),
          challengesApi.getMatches(id),
          challengesApi.getSimilar(id),
        ]);
        setChallenge(cRes.data);
        setMatches(mRes.data.matches || []);
        setDuplicates(simRes.data.candidates || []);
      } catch (err) {
        console.error('Failed to load challenge details:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadDetails();
  }, [id]);

  const handleValidate = async (decision: 'VALIDATED' | 'REJECTED' | 'NEEDS_INFORMATION') => {
    if (!challenge) return;
    setIsSubmittingVal(true);
    try {
      const res = await challengesApi.validate(challenge.id, {
        decision,
        notes: validationNotes || 'Ground inspected and verified by administrative officer',
        department_assigned: department,
      });
      setChallenge(res.data.challenge);
      alert(`Challenge successfully marked as ${decision}!`);
    } catch (err) {
      console.error('Validation error:', err);
      alert('Error recording validation.');
    } finally {
      setIsSubmittingVal(false);
    }
  };

  const handleUniversityAccept = async (uniId: string) => {
    if (!challenge) return;
    setIsAccepting(true);
    try {
      const res = await universitiesApi.acceptChallenge(uniId, {
        challenge_id: challenge.id,
        project_title: `Smart Technological Solution for ${challenge.title}`,
        budget: 350000,
      });
      alert('Challenge accepted! New Innovation Project spawned.');
      navigate(`/projects/${res.data.project.id}`);
    } catch (err) {
      console.error('Acceptance error:', err);
      alert('Failed to accept challenge.');
    } finally {
      setIsAccepting(false);
    }
  };

  if (isLoading || !challenge) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center text-xs text-slate-400">
        Loading challenge intelligence...
      </div>
    );
  }

  const isGovUser = user?.role === 'government' || user?.role === 'panchayat_ulb' || user?.role === 'admin';
  const isUniUser = user?.role === 'university_admin' || user?.role === 'faculty' || user?.role === 'admin';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <Link to="/challenges" className="hover:text-brand-blue flex items-center gap-1 font-medium">
          ← Back to Challenge Radar
        </Link>
        <div className="flex items-center gap-2">
          <span className="font-mono bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-700">
            {challenge.id}
          </span>
          <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded capitalize">
            {challenge.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Main Challenge Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-brand-blue uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
              {challenge.primary_domain}
            </span>
            {challenge.sub_domain && (
              <span className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                {challenge.sub_domain}
              </span>
            )}
          </div>
          <PriorityBadge score={challenge.priority_score} size="lg" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
          {challenge.title}
        </h1>

        <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
          {challenge.description}
        </p>

        {/* Location & Metadata Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Location</span>
            <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
              <MapPin className="h-3.5 w-3.5 text-brand-blue" />
              {challenge.village_locality}, {challenge.district}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Affected Population</span>
            <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
              <Users className="h-3.5 w-3.5 text-slate-500" />
              ~{challenge.affected_population.toLocaleString()} Residents
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Urgency</span>
            <span className="font-semibold text-rose-600 flex items-center gap-1 mt-0.5 uppercase">
              <AlertCircle className="h-3.5 w-3.5 text-rose-500" />
              {challenge.urgency}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Reported By</span>
            <span className="font-semibold text-slate-800 mt-0.5 block truncate">
              {isGovUser ? `${challenge.citizen_name || 'Citizen'} (${challenge.citizen_phone || 'Verified'})` : 'Citizen / Community Rep'}
            </span>
          </div>
        </div>
      </div>

      {/* Ground Photographic Evidence */}
      {challenge.media && challenge.media.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Ground Photographic Evidence
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {challenge.media.map((m, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 overflow-hidden">
                <img src={m.url} alt={m.caption} className="w-full h-48 object-cover" />
                {m.caption && (
                  <div className="p-2.5 bg-slate-50 text-xs text-slate-600 font-medium">
                    {m.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visible AI Verification Pipeline */}
      {challenge.ai_analysis && (
        <AISummaryCard
          analysis={challenge.ai_analysis}
          priority={challenge.priority_breakdown}
          isSimulating={false}
        />
      )}

      {/* Systemic Problem Cluster / Semantic Duplicates */}
      {duplicates.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-amber-200 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-amber-100 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-amber-600" />
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Systemic Problem Clustering ({duplicates.length} Related Reports Discovered)
                </h3>
                <p className="text-xs text-slate-500">
                  Semantic duplicate analysis grouped this challenge under a common systemic infrastructure cluster.
                </p>
              </div>
            </div>
            {challenge.cluster_id && (
              <Link
                to={`/government/clusters`}
                className="text-xs font-bold text-brand-blue hover:text-blue-800 flex items-center gap-1"
              >
                Inspect Cluster <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>

          <div className="space-y-2">
            {duplicates.map((dup, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-amber-50/50 rounded-2xl border border-amber-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-amber-200">
                      {dup.challenge.id}
                    </span>
                    <span className="font-bold text-slate-900">{dup.challenge.title}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1">{dup.reason}</div>
                </div>
                <span className="font-black text-amber-800 bg-amber-200/80 px-2.5 py-1 rounded-full text-xs self-start sm:self-center flex-shrink-0">
                  {dup.similarity}% Similarity
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Government / Panchayat Validation Box */}
      {isGovUser && (
        <div className="bg-gradient-to-br from-slate-900 to-navy-900 text-white rounded-3xl p-6 border border-slate-700 shadow-elevated space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Shield className="h-4 w-4" />
            Government & Panchayat Ground Validation Panel
          </div>
          <p className="text-xs text-slate-300">
            Authorized administrative decision: verify ground truth before releasing to university matching matrix.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-slate-400 font-medium mb-1">
                Assign Administrative Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full text-xs bg-navy-800 border border-navy-700 text-white rounded-xl p-2.5 outline-none"
              >
                <option value="Agriculture & Water Resources">Agriculture & Water Resources</option>
                <option value="Energy & Renewable Power (JREDA)">Energy & Renewable Power (JREDA)</option>
                <option value="Drinking Water & Sanitation (DWSD)">Drinking Water & Sanitation (DWSD)</option>
                <option value="Rural Development & Livelihoods">Rural Development & Livelihoods</option>
                <option value="Health & Family Welfare">Health & Family Welfare</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 font-medium mb-1">
                Inspection & Validation Notes
              </label>
              <input
                type="text"
                value={validationNotes}
                onChange={(e) => setValidationNotes(e.target.value)}
                placeholder="e.g. Verified by Panchayat Pradhan and Junior Engineer..."
                className="w-full text-xs bg-navy-800 border border-navy-700 text-white rounded-xl p-2.5 outline-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              disabled={isSubmittingVal}
              onClick={() => handleValidate('VALIDATED')}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="h-4 w-4" />
              Approve & Validate Ground Truth
            </button>
            <button
              disabled={isSubmittingVal}
              onClick={() => handleValidate('NEEDS_INFORMATION')}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl transition"
            >
              Request Citizen Information
            </button>
            <button
              disabled={isSubmittingVal}
              onClick={() => handleValidate('REJECTED')}
              className="px-4 py-2.5 bg-rose-700 hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition"
            >
              Reject (Out of Scope)
            </button>
          </div>
        </div>
      )}

      {/* University Matching Engine Recommendations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">
              Academic Matching Matrix
            </span>
            <h3 className="text-xl font-black text-slate-900">
              Ranked University Recommendations
            </h3>
          </div>
          <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
            {matches.length} Universities Scored
          </span>
        </div>

        <div className="space-y-4">
          {matches.slice(0, 3).map((match) => (
            <MatchScoreCard
              key={match.id}
              match={match}
              showAcceptButton={isUniUser}
              onAccept={() => handleUniversityAccept(match.university_id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
