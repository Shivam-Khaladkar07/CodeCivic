import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Building2, Award, CheckCircle2, ArrowRight, HeartHandshake, PlusCircle, X } from 'lucide-react';
import { projectsApi, industriesApi } from '../../services/api';
import { Project, Industry } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const IndustryDashboard: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [interestModalOpen, setInterestModalOpen] = useState(false);

  // Form State
  const [collabType, setCollabType] = useState('Offer Funding');
  const [amount, setAmount] = useState('350000');
  const [description, setDescription] = useState(
    'Committed CSR innovation grant for fabrication of 10 field prototype units and farmer training workshops.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const res = await projectsApi.getAll({ limit: 8 });
        setProjects(res.data);
      } catch (err) {
        console.error('Failed to load projects:', err);
      }
    };
    fetchOpportunities();
  }, []);

  const handleExpressInterest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    setIsSubmitting(true);
    try {
      await industriesApi.expressInterest('IND-TATA', {
        project_id: selectedProject.id,
        collaboration_type: collabType,
        amount_inr: Number(amount) || 0,
        description,
      });
      alert(`Interest expressed! ₹${Number(amount).toLocaleString()} pledged to "${selectedProject.title}".`);
      setInterestModalOpen(false);
      setSelectedProject(null);
    } catch (err) {
      console.error('Failed to express interest:', err);
      alert('Error submitting CSR commitment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white rounded-3xl p-6 sm:p-8 shadow-elevated flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Briefcase className="h-4 w-4" />
            Corporate Social Responsibility & Startup Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Tata Steel CSR & Industry Innovation Exchange
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Sponsor university prototype development, provide industrial testbeds, and scale deployable grassroots
            technology solutions across Jharkhand.
          </p>
        </div>

        <div className="text-right bg-navy-800/80 border border-navy-700 p-4 rounded-2xl">
          <span className="text-xs text-slate-400 block font-medium">Annual State CSR Commitment</span>
          <span className="text-2xl font-black text-emerald-400">₹125.0 Cr</span>
        </div>
      </div>

      {/* Projects Available for CSR Sponsorship */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              Vetted University Innovation Projects Seeking Industry Backing
            </h3>
            <p className="text-xs text-slate-500">
              Filtered for Agriculture, Clean Energy, Water Resources, and Health impact
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="p-5 rounded-2xl border border-slate-200 hover:border-brand-blue/60 transition space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {proj.id}
                  </span>
                  <span className="text-[11px] font-bold text-brand-blue bg-blue-50 px-2 py-0.5 rounded">
                    {proj.irl_level}
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 leading-snug">{proj.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2 mt-1">{proj.description}</p>
                <div className="text-[11px] text-slate-500 mt-2">
                  Led by: <strong>{proj.university_name}</strong>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  to={`/projects/${proj.id}`}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Workspace →
                </Link>

                <button
                  onClick={() => {
                    setSelectedProject(proj);
                    setInterestModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-blue to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                >
                  <HeartHandshake className="h-4 w-4" />
                  <span>Offer CSR Grant / Pilot</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Express Interest Modal */}
      {interestModalOpen && selectedProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-brand-blue uppercase tracking-wider block">
                  Industry Collaboration Proposal
                </span>
                <h3 className="text-base font-black text-slate-900 truncate max-w-sm">
                  {selectedProject.title}
                </h3>
              </div>
              <button
                onClick={() => setInterestModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleExpressInterest} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Collaboration Mode *
                </label>
                <select
                  value={collabType}
                  onChange={(e) => setCollabType(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium"
                >
                  <option value="Offer Funding">Offer Grant Funding (CSR)</option>
                  <option value="Offer Mentorship">Offer Engineering Mentorship</option>
                  <option value="Offer Technology">Offer Hardware / Equipment</option>
                  <option value="Offer Testing">Offer Laboratory / Testing Rig</option>
                  <option value="Offer Pilot">Offer Field Pilot Deployment Site</option>
                  <option value="Join Consortium">Join Joint Innovation Consortium</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Committed Grant Amount (INR)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="350000"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Scope & Collaboration Notes *
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setInterestModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? 'Recording...' : 'Commit CSR Sponsorship'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
