import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, Cpu, Tag, Layers, Wrench, ShieldAlert } from 'lucide-react';
import { AIAnalysis, PriorityBreakdown } from '../../types';

interface AISummaryCardProps {
  analysis?: AIAnalysis;
  priority?: PriorityBreakdown;
  isSimulating?: boolean;
}

export const AISummaryCard: React.FC<AISummaryCardProps> = ({ analysis, priority, isSimulating = false }) => {
  const [activeStep, setActiveStep] = useState<number>(isSimulating ? 0 : 6);

  useEffect(() => {
    if (isSimulating) {
      setActiveStep(0);
      const interval = setInterval(() => {
        setActiveStep((prev) => {
          if (prev >= 6) {
            clearInterval(interval);
            return 6;
          }
          return prev + 1;
        });
      }, 500);
      return () => clearInterval(interval);
    } else {
      setActiveStep(6);
    }
  }, [isSimulating]);

  const pipelineSteps = [
    { title: 'Vernacular & Context Understood', desc: 'Natural language parsing, stopwords removed & intent extracted' },
    { title: 'Primary & Secondary Domain Classified', desc: 'Mapped to 12 Societal Innovation Themes & SDGs' },
    { title: 'Vector Semantic Similarity & Deduplication', desc: 'Compared against 300+ existing Jharkhand field reports' },
    { title: 'Explainable Priority Score Synthesized', desc: 'Multi-factor population, recurrence & urgency weighting' },
    { title: 'Multidisciplinary Engineering Skills Extracted', desc: 'Identified core technical competencies needed' },
    { title: 'HEI & Faculty Recommendation Matrix', desc: 'Matched across 20 state & national universities' },
  ];

  return (
    <div className="rounded-2xl border border-purple-200 bg-gradient-to-b from-purple-50/50 to-white p-5 shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-purple-100">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-200">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              CivicForge AI Intelligence Engine
              <span className="text-[10px] uppercase font-semibold tracking-wider bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                {analysis?.is_demo_mode ? 'Deterministic Local AI' : 'Live ML API'}
              </span>
            </h4>
            <p className="text-xs text-slate-500">Autonomous 6-Stage Societal Challenge Assessment Pipeline</p>
          </div>
        </div>
        {analysis?.confidence_score && (
          <div className="text-right">
            <span className="text-xs text-slate-500 block">AI Confidence</span>
            <span className="text-base font-extrabold text-purple-700">
              {analysis.confidence_score}%
              <span className="text-[10px] text-slate-400 font-normal ml-1">(System Metric)</span>
            </span>
          </div>
        )}
      </div>

      {/* Visible 6-Step Processing Pipeline */}
      <div className="py-4 border-b border-purple-100">
        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2.5 block">
          Verification Pipeline Stages
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {pipelineSteps.map((step, idx) => {
            const isDone = activeStep > idx;
            const isCurrent = activeStep === idx;

            return (
              <div
                key={idx}
                className={`flex items-start gap-2 p-2 rounded-lg border text-xs transition-all ${
                  isDone
                    ? 'bg-purple-50/80 border-purple-200 text-purple-900 font-medium'
                    : isCurrent
                    ? 'bg-purple-100/90 border-purple-400 text-purple-950 font-semibold ring-1 ring-purple-300 animate-pulse'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <div className="mt-0.5">
                  {isDone ? (
                    <CheckCircle2 className="h-4 w-4 text-purple-600 flex-shrink-0" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-current flex items-center justify-center text-[9px] font-bold">
                      {idx + 1}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="truncate">{step.title}</div>
                  <div className="text-[10px] opacity-75 truncate">{step.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Structured Output Breakdown */}
      {analysis && (
        <div className="pt-4 space-y-3.5">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Structured Executive Problem Statement
            </span>
            <p className="text-sm font-medium text-slate-800 bg-white p-3 rounded-xl border border-slate-200/80 leading-relaxed shadow-xs">
              "{analysis.problem_statement}"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Domain & SDG */}
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs space-y-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-purple-500" />
                Domain Taxonomy & SDGs
              </span>
              <div className="flex flex-wrap gap-1.5">
                <span className="bg-brand-blue/10 text-brand-blue border border-brand-blue/20 text-xs px-2.5 py-0.5 rounded-md font-semibold">
                  {analysis.primary_domain}
                </span>
                <span className="bg-teal-50 text-teal-700 border border-teal-200 text-xs px-2 py-0.5 rounded-md">
                  Sub: {analysis.sub_domain}
                </span>
                {analysis.secondary_domain && (
                  <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-md">
                    Secondary: {analysis.secondary_domain}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1 pt-1">
                {(analysis.sdg_goals || []).map((sdg, i) => (
                  <span key={i} className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded">
                    {sdg}
                  </span>
                ))}
              </div>
            </div>

            {/* Required Engineering Skills */}
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs space-y-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Wrench className="h-3.5 w-3.5 text-purple-500" />
                Required Multidisciplinary Skills
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(analysis.required_skills || []).map((skill, i) => (
                  <span key={i} className="bg-purple-50 text-purple-800 border border-purple-200 text-xs px-2 py-0.5 rounded-md font-medium">
                    {skill}
                  </span>
                ))}
              </div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 pt-1">
                <Cpu className="h-3.5 w-3.5 text-brand-blue" />
                Suggested Technologies
              </span>
              <div className="flex flex-wrap gap-1">
                {(analysis.suggested_technologies || []).map((tech, i) => (
                  <span key={i} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Explainable Priority Breakdown */}
          {priority && (
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
                  Explainable Priority Score Breakdown ({priority.total}/100)
                </span>
                <span className="text-xs font-bold text-slate-700">{priority.total} Total Points</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                <div className="bg-slate-50 p-1.5 rounded border">
                  <span className="text-[10px] text-slate-500 block">Population</span>
                  <span className="font-bold text-slate-800">+{priority.population_score}</span>
                </div>
                <div className="bg-slate-50 p-1.5 rounded border">
                  <span className="text-[10px] text-slate-500 block">Urgency</span>
                  <span className="font-bold text-slate-800">+{priority.urgency_score}</span>
                </div>
                <div className="bg-slate-50 p-1.5 rounded border">
                  <span className="text-[10px] text-slate-500 block">Recurrence</span>
                  <span className="font-bold text-slate-800">+{priority.recurrence_score}</span>
                </div>
                <div className="bg-slate-50 p-1.5 rounded border">
                  <span className="text-[10px] text-slate-500 block">Evidence</span>
                  <span className="font-bold text-slate-800">+{priority.evidence_score}</span>
                </div>
                <div className="bg-slate-50 p-1.5 rounded border col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-500 block">Geo Spread</span>
                  <span className="font-bold text-slate-800">+{priority.geo_spread_score}</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-2 italic">{priority.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
