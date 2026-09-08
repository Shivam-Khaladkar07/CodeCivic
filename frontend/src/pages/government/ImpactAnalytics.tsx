import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  Users,
  Copy,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { dashboardsApi } from '../../services/api';
import { ImpactRecord } from '../../types';

export const ImpactAnalytics: React.FC = () => {
  const [data, setData] = useState<{
    outputs: any;
    impact_records: ImpactRecord[];
    reuse_cases: any[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImpact = async () => {
      try {
        const res = await dashboardsApi.getImpact();
        setData(res.data);
      } catch (err) {
        console.error('Failed to load impact analytics:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImpact();
  }, []);

  if (isLoading || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-xs text-slate-400">
        Loading impact intelligence...
      </div>
    );
  }

  const { outputs, impact_records, reuse_cases } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">
            Outcome Measurement
          </span>
          <h1 className="text-3xl font-black text-slate-900">
            Societal Impact & Knowledge Reuse
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tracking verified ground outcomes vs predicted models, and scaling proven technological solutions across
            Jharkhand districts.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl font-bold self-start">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Independent Ground Audit Verified</span>
        </div>
      </div>

      {/* OUTPUTS VS OUTCOMES FUNNEL */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">
            Results Chain Architecture
          </span>
          <h2 className="text-xl font-extrabold text-slate-900">
            Outputs to Outcomes Transition
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Converting academic research inputs into measurable, permanent community benefits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Outputs Column */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-black uppercase text-slate-700 tracking-wider">
                1. System Outputs (Activities & Prototypes)
              </span>
              <span className="text-[10px] text-slate-400 font-mono">MEASURED TALLY</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs bg-white p-3 rounded-xl border border-slate-100">
                <span className="text-slate-600 font-medium">Challenges Crowdsourced</span>
                <span className="font-black text-slate-900 text-sm">{outputs.challenges_received}</span>
              </div>
              <div className="flex items-center justify-between text-xs bg-white p-3 rounded-xl border border-slate-100">
                <span className="text-slate-600 font-medium">University Projects Initiated</span>
                <span className="font-black text-brand-blue text-sm">{outputs.projects_initiated}</span>
              </div>
              <div className="flex items-center justify-between text-xs bg-white p-3 rounded-xl border border-slate-100">
                <span className="text-slate-600 font-medium">Hardware Prototypes Assembled (IRL-3+)</span>
                <span className="font-black text-purple-600 text-sm">{outputs.prototypes_built}</span>
              </div>
              <div className="flex items-center justify-between text-xs bg-white p-3 rounded-xl border border-slate-100">
                <span className="text-slate-600 font-medium">Community Field Pilots Deployed (IRL-5+)</span>
                <span className="font-black text-amber-600 text-sm">{outputs.community_pilots}</span>
              </div>
            </div>
          </div>

          {/* Outcomes Column */}
          <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
              <span className="text-xs font-black uppercase text-emerald-900 tracking-wider">
                2. Real-World Outcomes (Verified Impact)
              </span>
              <span className="text-[10px] text-emerald-700 font-mono">FIELD AUDITED</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs bg-white p-3 rounded-xl border border-emerald-100">
                <span className="text-slate-600 font-medium">Farmers Benefited from VFD Pilot</span>
                <span className="font-black text-emerald-600 text-sm">4,200 Farmers</span>
              </div>
              <div className="flex items-center justify-between text-xs bg-white p-3 rounded-xl border border-emerald-100">
                <span className="text-slate-600 font-medium">Crop Loss Prevented</span>
                <span className="font-black text-emerald-600 text-sm">38% Harvest Yield Saved</span>
              </div>
              <div className="flex items-center justify-between text-xs bg-white p-3 rounded-xl border border-emerald-100">
                <span className="text-slate-600 font-medium">Diesel Fuel Cost Averted</span>
                <span className="font-black text-emerald-600 text-sm">₹14,20,000 INR Saved</span>
              </div>
              <div className="flex items-center justify-between text-xs bg-white p-3 rounded-xl border border-emerald-100">
                <span className="text-slate-600 font-medium">Clean Solar Carbon Offset</span>
                <span className="font-black text-emerald-600 text-sm">21.8 Metric Tons CO2/yr</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PREDICTED VS VERIFIED AUDIT TABLE */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Predicted vs Ground-Verified Impact Ledger
            </h3>
            <p className="text-xs text-slate-500">
              Comparing machine learning simulation models against ground truth verified by District Officers
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Impact Metric</th>
                <th className="p-3">Predicted Value</th>
                <th className="p-3">Verified Ground Value</th>
                <th className="p-3">Unit</th>
                <th className="p-3">Auditing Authority</th>
                <th className="p-3">Verification Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {impact_records.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/60 transition">
                  <td className="p-3 font-bold text-slate-900">{rec.metric_name}</td>
                  <td className="p-3 text-slate-500 font-mono">
                    {rec.predicted_value.toLocaleString()}
                  </td>
                  <td className="p-3 font-bold text-emerald-700 bg-emerald-50/50 font-mono">
                    {rec.verified_value.toLocaleString()}
                  </td>
                  <td className="p-3 text-slate-600">{rec.unit}</td>
                  <td className="p-3 text-slate-700">{rec.verified_by}</td>
                  <td className="p-3 text-slate-500 font-mono">{rec.verification_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SOLUTION REUSE / KNOWLEDGE TRANSFER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-brand-blue" />
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">
              Problem Family & Cross-District Solution Reuse
            </h3>
            <p className="text-xs text-slate-500">
              Preventing reinventing the wheel by transplanting field-tested innovations into adjacent Jharkhand districts.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reuse_cases.map((rc, i) => (
            <div key={i} className="p-6 rounded-2xl border border-blue-100 bg-blue-50/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">
                  Proven Solution Package
                </span>
                <span className="text-[10px] bg-white text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200">
                  {rc.readiness}
                </span>
              </div>
              <h4 className="text-base font-black text-slate-900">{rc.solution_title}</h4>
              <p className="text-xs text-slate-600">{rc.benefit}</p>

              <div className="pt-3 border-t border-blue-200/50 space-y-2 text-xs">
                <div>
                  <span className="text-slate-500 font-medium">Origin Site:</span>{' '}
                  <strong className="text-slate-800">{rc.origin_district}</strong>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block mb-1">
                    Ready for Instant Replication in:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {rc.reusable_in.map((d: string, idx: number) => (
                      <span
                        key={idx}
                        className="bg-white text-slate-800 font-semibold px-2 py-0.5 rounded border border-slate-200 text-xs"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
