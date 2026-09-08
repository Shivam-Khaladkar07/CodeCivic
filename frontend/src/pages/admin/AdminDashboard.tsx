import React, { useEffect, useState } from 'react';
import { Sliders, Shield, Save, CheckCircle2, History, Database, Cpu } from 'lucide-react';
import { adminApi } from '../../services/api';

export const AdminDashboard: React.FC = () => {
  const [settings, setSettings] = useState<any | null>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const [sRes, aRes] = await Promise.all([adminApi.getSettings(), adminApi.getAudit()]);
        setSettings(sRes.data);
        setAuditLogs(aRes.data);
      } catch (err) {
        console.error('Failed to load admin data:', err);
      }
    };
    loadAdminData();
  }, []);

  const handleSaveSettings = async () => {
    if (!settings) return;
    setIsSaving(true);
    try {
      await adminApi.updateSettings(settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
      alert('Error updating system weights.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!settings) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-xs text-slate-400">Loading System Governance Panel...</div>;
  }

  const pw = settings.priority_weights;
  const mw = settings.matching_weights;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">
            System Governance & Control
          </span>
          <h1 className="text-3xl font-black text-slate-900">Platform Admin & Algorithms</h1>
          <p className="text-xs text-slate-500 mt-1">
            Dynamic weight reconfiguration for Priority Scoring and Academic Matching without code changes.
          </p>
        </div>

        <button
          disabled={isSaving}
          onClick={handleSaveSettings}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-blue hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          <span>{isSaving ? 'Saving...' : saveSuccess ? 'Weights Saved!' : 'Save System Settings'}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Algorithm weights successfully applied across all active scoring pipelines.</span>
        </div>
      )}

      {/* Dynamic Sliders Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Priority Scoring Weights Slider */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Explainable Priority Engine Weights</h3>
              <p className="text-xs text-slate-500">Calculates challenge urgency (Total target = 100 points)</p>
            </div>
            <Sliders className="h-5 w-5 text-brand-blue" />
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Affected Population Weight:</span>
                <span className="font-bold text-brand-blue">{pw.population} pts</span>
              </div>
              <input
                type="range"
                min={5}
                max={50}
                value={pw.population}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    priority_weights: { ...pw, population: Number(e.target.value) },
                  })
                }
                className="w-full accent-brand-blue cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Urgency Level Weight:</span>
                <span className="font-bold text-brand-blue">{pw.urgency} pts</span>
              </div>
              <input
                type="range"
                min={5}
                max={50}
                value={pw.urgency}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    priority_weights: { ...pw, urgency: Number(e.target.value) },
                  })
                }
                className="w-full accent-brand-blue cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Cluster Recurrence Frequency:</span>
                <span className="font-bold text-brand-blue">{pw.recurrence} pts</span>
              </div>
              <input
                type="range"
                min={5}
                max={40}
                value={pw.recurrence}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    priority_weights: { ...pw, recurrence: Number(e.target.value) },
                  })
                }
                className="w-full accent-brand-blue cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Ground Photographic Evidence:</span>
                <span className="font-bold text-brand-blue">{pw.evidence} pts</span>
              </div>
              <input
                type="range"
                min={5}
                max={30}
                value={pw.evidence}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    priority_weights: { ...pw, evidence: Number(e.target.value) },
                  })
                }
                className="w-full accent-brand-blue cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Geographic Village Spread:</span>
                <span className="font-bold text-brand-blue">{pw.geo_spread} pts</span>
              </div>
              <input
                type="range"
                min={5}
                max={30}
                value={pw.geo_spread}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    priority_weights: { ...pw, geo_spread: Number(e.target.value) },
                  })
                }
                className="w-full accent-brand-blue cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 2. University Matching Engine Weights Slider */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">University Matching Matrix Weights</h3>
              <p className="text-xs text-slate-500">Multi-criteria academic ranking dimensions (Total = 100%)</p>
            </div>
            <Sliders className="h-5 w-5 text-purple-600" />
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Domain & Department Expertise:</span>
                <span className="font-bold text-purple-700">{mw.domain_expertise}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={60}
                value={mw.domain_expertise}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    matching_weights: { ...mw, domain_expertise: Number(e.target.value) },
                  })
                }
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Faculty Research & Publications:</span>
                <span className="font-bold text-purple-700">{mw.faculty_expertise}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={50}
                value={mw.faculty_expertise}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    matching_weights: { ...mw, faculty_expertise: Number(e.target.value) },
                  })
                }
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Laboratory & Testing Infrastructure:</span>
                <span className="font-bold text-purple-700">{mw.lab_infrastructure}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={40}
                value={mw.lab_infrastructure}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    matching_weights: { ...mw, lab_infrastructure: Number(e.target.value) },
                  })
                }
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Geographic Proximity:</span>
                <span className="font-bold text-purple-700">{mw.geography}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={30}
                value={mw.geography}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    matching_weights: { ...mw, geography: Number(e.target.value) },
                  })
                }
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Previous Relevant Track Record:</span>
                <span className="font-bold text-purple-700">{mw.previous_work}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={30}
                value={mw.previous_work}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    matching_weights: { ...mw, previous_work: Number(e.target.value) },
                  })
                }
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-slate-500" />
            <h3 className="text-base font-bold text-slate-900">System Audit Trail & Security Logs</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">LIVE IMMUTABLE LOG</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Log ID</th>
                <th className="p-3">User</th>
                <th className="p-3">Role</th>
                <th className="p-3">Action</th>
                <th className="p-3">Entity</th>
                <th className="p-3">Details</th>
                <th className="p-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {auditLogs.slice(0, 10).map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60">
                  <td className="p-3 text-slate-400">{log.id}</td>
                  <td className="p-3 font-bold text-slate-900 font-sans">{log.user_name}</td>
                  <td className="p-3 text-brand-blue uppercase">{log.user_role}</td>
                  <td className="p-3 font-semibold text-purple-700">{log.action}</td>
                  <td className="p-3 text-slate-600">{log.entity_type}</td>
                  <td className="p-3 font-sans text-slate-700">{log.details}</td>
                  <td className="p-3 text-slate-400">{log.timestamp.split('T')[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
