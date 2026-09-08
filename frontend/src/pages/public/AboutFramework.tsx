import React from 'react';
import { Layers, ShieldCheck, Cpu, Building2, TrendingUp, Award, CheckCircle2 } from 'lucide-react';

export const AboutFramework: React.FC = () => {
  const irlStages = [
    { level: 'IRL-1', name: 'Problem Ground Validated', desc: 'Civic report inspected and validated by local Panchayat / ULB officers with ground photo/sensor proof.' },
    { level: 'IRL-2', name: 'Solution Proposed & Feasibility', desc: 'Academic engineering team formulates technical specification and mathematical simulations.' },
    { level: 'IRL-3', name: 'Hardware/Software Prototype Built', desc: 'Working laboratory breadboard, CAD mechanical chassis, or software MVP assembled.' },
    { level: 'IRL-4', name: 'Rigorous Lab Testing', desc: 'Stress tested under extreme electrical, chemical, or thermal bench conditions.' },
    { level: 'IRL-5', name: 'Community Field Pilot', desc: 'First deployment in the affected village or facility under real community operating conditions.' },
    { level: 'IRL-6', name: 'Field Validated & Audited', desc: 'Continuous 90-day operation evaluated by District Planning and Agriculture/Health auditors.' },
    { level: 'IRL-7', name: 'Deployment Ready & Standardized', desc: 'Certified for public procurement, manufactured through local MSME/industry partners.' },
    { level: 'IRL-8', name: 'Scaled State Impact', desc: 'Transferred and scaled across multiple Jharkhand districts under government schemes.' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">
          Architecture & Methodology
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
          The Societal Innovation Exchange Framework
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          How Jharkhand transforms scattered grassroots grievances into structured university innovation challenges,
          backed by corporate CSR, and guided to verified deployment.
        </p>
      </div>

      {/* Core Paradigm Comparison */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
        <h2 className="text-xl font-black text-slate-900 text-center">
          Traditional Grievance System vs CivicForge Innovation Engine
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-slate-600">
            <span className="font-bold text-slate-500 uppercase tracking-wider block">
              Traditional Complaint Portals
            </span>
            <ul className="space-y-2">
              <li>❌ Complaints treated as isolated repair tickets</li>
              <li>❌ Bureaucratic backlogs with no engineering root-cause resolution</li>
              <li>❌ No connection to academic universities or student engineering talent</li>
              <li>❌ Zero industry or CSR funding involvement</li>
              <li>❌ Identical problems recurring year after year in adjacent hamlets</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-3 text-slate-700">
            <span className="font-bold text-brand-blue uppercase tracking-wider block">
              CivicForge Societal Innovation Exchange
            </span>
            <ul className="space-y-2 font-medium">
              <li>✓ AI groups recurring complaints into Systemic Challenge Clusters</li>
              <li>✓ Matched to top universities using explainable multi-criteria algorithms</li>
              <li>✓ Multidisciplinary student teams earn academic credit solving real community issues</li>
              <li>✓ Industry CSR foundations sponsor prototype and pilot manufacturing</li>
              <li>✓ Solutions are packaged for instant reuse across all 24 Jharkhand districts</li>
            </ul>
          </div>
        </div>
      </div>

      {/* IRL Framework (IRL 1 to IRL 8) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">
            Standardized Stage Gates
          </span>
          <h2 className="text-xl font-black text-slate-900">
            Innovation Readiness Level (IRL 1 – IRL 8)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Adapted from NASA TRL for civic and societal technology governance
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {irlStages.map((stage) => (
            <div key={stage.level} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-black text-brand-blue bg-white px-2 py-0.5 rounded border border-slate-200 font-mono">
                  {stage.level}
                </span>
                <span className="font-bold text-slate-900">{stage.name}</span>
              </div>
              <p className="text-slate-600 leading-relaxed">{stage.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
