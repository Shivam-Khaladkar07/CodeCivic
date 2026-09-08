import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  User,
  Shield,
  Building,
  Briefcase,
  Layers,
  ArrowRight,
  CheckCircle2,
  X,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface GoldenDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoldenDemoModal: React.FC<GoldenDemoModalProps> = ({ isOpen, onClose }) => {
  const { quickSwitchRole } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Step 1: Citizen Submits Grassroots Challenge',
      persona: 'Citizen / Farmer (Ramesh Kumar, Kanke, Ranchi)',
      role: 'citizen' as const,
      desc: 'Farmer Ramesh reports erratic 140V brownouts causing irrigation pump tripping across Kanke & Ratu fields, threatening 450+ hectares of Rabi crops.',
      actionText: 'View Citizen Submission & AI Analysis',
      actionLink: '/challenge/JH-RNC-1001',
      highlights: ['Step-by-step wizard', 'Ground photographic evidence', 'Geographic coordinates: Kanke (23.43° N)'],
    },
    {
      title: 'Step 2: AI Intelligence & Systemic Clustering',
      persona: 'Autonomous AI Pipeline & System Engine',
      role: 'government' as const,
      desc: 'AI detects 18 matching citizen reports across 4 panchayats in Ranchi Rural, synthesizing an explainable Priority Score (88/100) and clustering them into a Systemic Problem Cluster.',
      actionText: 'Inspect Systemic Challenge Cluster',
      actionLink: '/government/clusters',
      highlights: ['6-Step visible AI pipeline', '18 recurring reports merged', 'Critical infrastructure deficiency flagged'],
    },
    {
      title: 'Step 3: Government Decision & Innovation Pipeline',
      persona: 'Government Officer (Dr. Ananya Roy, IAS)',
      role: 'government' as const,
      desc: 'Panchayat & Planning Department validate the ground evidence, assigning it to the State Innovation Exchange for higher education institution matching.',
      actionText: 'Open Government Decision Radar',
      actionLink: '/government/dashboard',
      highlights: ['Decision Intelligence ("What requires attention?")', 'Jharkhand District Map with 300 challenges', 'Panchayat Ground Verification'],
    },
    {
      title: 'Step 4: University Discovery & Explainable Matching',
      persona: 'University Dean (Prof. Sudhir Sinha, BAU & BIT Mesra)',
      role: 'university_admin' as const,
      desc: 'The University Matching Engine recommends Birsa Agricultural University & BIT Mesra with a 94% explainable match (domain, specialized power electronics labs, and proximity).',
      actionText: 'View Explainable Match Breakdown',
      actionLink: '/challenge/JH-RNC-1001',
      highlights: ['Radar match score: 94%', 'Multi-criteria scoring breakdown', 'Dean assigns Faculty Mentor Dr. A. K. Sharma'],
    },
    {
      title: 'Step 5: Multidisciplinary Team & Industry CSR Backing',
      persona: 'Industry CSR Lead (Saurabh Roy, Tata Steel CSR)',
      role: 'industry' as const,
      desc: 'Faculty assembles a student team (Agronomy + Electrical + CS). Tata Steel CSR discovers the challenge and pledges ₹3,50,000 for manufacturing 10 field prototype units.',
      actionText: 'Inspect Collaborative Project Workspace',
      actionLink: '/projects/PROJ-JH-AGRI-01',
      highlights: ['₹3.5 Lakh CSR Grant committed', 'Cross-departmental student team', 'Threaded stakeholder discussions'],
    },
    {
      title: 'Step 6: IRL Progression & Verified Government Impact',
      persona: 'All Stakeholders & State Planning Department',
      role: 'government' as const,
      desc: 'The project advances through Innovation Readiness Levels (IRL-1 Problem Validated to IRL-5 Community Pilot). 4,200 farmers benefit, with 38% crop loss prevented and ₹14.2L saved.',
      actionText: 'View Verified Impact & Solution Reuse',
      actionLink: '/government/analytics',
      highlights: ['IRL-5 Community Pilot deployed', 'Predicted vs Verified Impact', 'Solution flagged for reuse in Dumka & Deoghar'],
    },
  ];

  const current = steps[currentStep];

  const handleStepAction = async () => {
    await quickSwitchRole(current.role);
    onClose();
    navigate(current.actionLink);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-navy-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-navy-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Zap className="h-4 w-4 fill-current" />
            Smart India Hackathon 2026 Interactive Demo Flow
          </div>
          <h2 className="text-xl font-black text-white">
            The Golden Journey: Grassroots Problem to Measurable Impact
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Ranchi Rural Irrigation Voltage Fluctuation & Smart VFD Controller Innovation
          </p>

          {/* Stepper Dots */}
          <div className="flex items-center gap-2 mt-4">
            {steps.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStep
                    ? 'w-8 bg-amber-400'
                    : idx < currentStep
                    ? 'w-3 bg-emerald-400'
                    : 'w-3 bg-navy-700 hover:bg-navy-600'
                }`}
                title={`Step ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[11px] font-bold text-brand-blue uppercase tracking-wider block">
                Stage {currentStep + 1} of 6
              </span>
              <h3 className="text-base font-extrabold text-slate-900">{current.title}</h3>
            </div>
            <span className="text-xs bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1 rounded-full font-semibold">
              Persona: {current.persona.split(' ')[0]}
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
            <strong className="text-slate-900 font-semibold block mb-1">Context & Action:</strong>
            {current.desc}
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Key Features Highlighted:
            </span>
            <div className="space-y-1.5">
              {current.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              disabled={currentStep === 0}
              onClick={() => setCurrentStep((p) => p - 1)}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 transition"
            >
              Previous
            </button>
            <button
              disabled={currentStep === steps.length - 1}
              onClick={() => setCurrentStep((p) => p + 1)}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 transition"
            >
              Next
            </button>
          </div>

          <button
            onClick={handleStepAction}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-blue to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition transform hover:-translate-y-0.5"
          >
            <span>{current.actionText}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
