import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, MapPin, Users, AlertTriangle, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { clustersApi } from '../../services/api';
import { ChallengeCluster } from '../../types';

export const SystemicClusters: React.FC = () => {
  const [clusters, setClusters] = useState<ChallengeCluster[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClusters = async () => {
      try {
        const res = await clustersApi.getAll();
        setClusters(res.data);
      } catch (err) {
        console.error('Failed to load clusters:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClusters();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">
            Systemic Problem Clustering
          </span>
          <h1 className="text-3xl font-black text-slate-900">
            Systemic Challenge Clusters
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Grouping recurring citizen complaints across villages to prevent fragmented handling and trigger
            high-level engineering solutions.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-purple-50 text-purple-800 border border-purple-200 px-3 py-1.5 rounded-xl font-bold self-start">
          <Layers className="h-4 w-4 text-purple-600" />
          <span>{clusters.length} Active Systemic Clusters</span>
        </div>
      </div>

      {/* Cluster Concept Explainer */}
      <div className="bg-gradient-to-r from-purple-900 to-navy-900 text-white p-6 rounded-3xl shadow-soft space-y-3">
        <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">
          The CivicForge Systemic Clustering Paradigm
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center text-xs">
          <div className="bg-white/10 backdrop-blur p-3 rounded-2xl border border-white/10">
            <span className="text-2xl font-black block">18 Reports</span>
            <span className="text-slate-300 text-[11px]">Individual citizen submissions</span>
          </div>
          <div className="bg-white/10 backdrop-blur p-3 rounded-2xl border border-white/10">
            <span className="text-2xl font-black block">4 Villages</span>
            <span className="text-slate-300 text-[11px]">Kanke & Ratu agrarian blocks</span>
          </div>
          <div className="bg-white/10 backdrop-blur p-3 rounded-2xl border border-white/10">
            <span className="text-2xl font-black block text-amber-300">1 Systemic Cluster</span>
            <span className="text-slate-300 text-[11px]">Low-Voltage Grid Brownout</span>
          </div>
          <div className="bg-white/10 backdrop-blur p-3 rounded-2xl border border-white/10">
            <span className="text-2xl font-black block text-emerald-400">1 Integrated Project</span>
            <span className="text-slate-300 text-[11px]">Smart Solar VFD Controller</span>
          </div>
        </div>
      </div>

      {/* Clusters List */}
      <div className="space-y-6">
        {clusters.map((cluster) => {
          const isGolden = cluster.id === 'CLUS-RNC-AGR-01';
          return (
            <div
              key={cluster.id}
              className={`bg-white rounded-3xl p-6 sm:p-8 border transition shadow-soft hover:shadow-elevated ${
                isGolden ? 'border-purple-300 ring-2 ring-purple-100' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      {cluster.id}
                    </span>
                    <span className="text-xs font-bold text-brand-blue bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {cluster.primary_domain}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        cluster.severity === 'critical'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {cluster.severity} Severity
                    </span>
                    {isGolden && (
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                        ★ SIH Golden Scenario
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 leading-snug">
                    {cluster.cluster_title}
                  </h3>
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-brand-blue" />
                      {cluster.district}, Jharkhand
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Users className="h-3.5 w-3.5 text-slate-400" />
                      ~{cluster.affected_population.toLocaleString()} citizens affected
                    </span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-2">
                  <span className="text-xs text-slate-500">Merged Reports</span>
                  <span className="text-2xl font-black text-purple-700">{cluster.report_count} Reports</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed py-4">{cluster.description}</p>

              {/* Action footer */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-500">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>
                    Status:{' '}
                    <strong className="text-slate-800 font-semibold">{cluster.status}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/challenges?cluster_id=${cluster.id}`}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition"
                  >
                    View All {cluster.report_count} Reports
                  </Link>

                  {cluster.associated_project_ids && cluster.associated_project_ids.length > 0 && (
                    <Link
                      to={`/projects/${cluster.associated_project_ids[0]}`}
                      className="px-4 py-2 rounded-xl bg-brand-blue hover:bg-blue-700 text-white font-bold transition flex items-center gap-1"
                    >
                      <span>Inspect Active Project</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
