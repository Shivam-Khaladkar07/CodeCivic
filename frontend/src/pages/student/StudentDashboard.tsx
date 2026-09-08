import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, CheckCircle2, Clock, Upload, ArrowRight, Sparkles, FileCode, Check } from 'lucide-react';
import { projectsApi } from '../../services/api';
import { Project } from '../../types';
import { IRLProgress } from '../../components/common/IRLProgress';
import { useAuth } from '../../context/AuthContext';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeadProject = async () => {
      try {
        const res = await projectsApi.getById('PROJ-JH-AGRI-01');
        setProject(res.data.project);
      } catch (err) {
        console.error('Failed to load student project:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeadProject();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-950 via-navy-900 to-navy-800 text-white rounded-3xl p-6 sm:p-8 shadow-elevated flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-brand-blue text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="h-4 w-4" />
            Student Innovator Workspace
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Welcome, {user?.full_name || 'Pooja Hansda'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Team Lead • Agricultural & Power Electronics Multidisciplinary Team (BAU & BIT Mesra Hub)
          </p>
        </div>

        <Link
          to="/projects/PROJ-JH-AGRI-01"
          className="px-5 py-3 rounded-2xl bg-brand-blue hover:bg-blue-600 text-white text-xs font-bold transition flex items-center gap-2 self-start md:self-auto shadow-md shadow-blue-500/25"
        >
          <span>Open Active Team Workspace</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Active Project Card */}
      {project && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-bold text-brand-blue uppercase tracking-wider block">
                Primary Assigned Challenge
              </span>
              <h3 className="text-lg font-black text-slate-900">{project.title}</h3>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
              Stage: {project.irl_level}
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">{project.description}</p>

          <IRLProgress currentStage={project.irl_level} />

          {/* Rapid Action Buttons for Students */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
            <Link
              to="/projects/PROJ-JH-AGRI-01"
              className="p-3 bg-slate-50 hover:bg-blue-50/50 rounded-xl border border-slate-200 flex items-center gap-2 font-semibold text-slate-700 transition"
            >
              <Upload className="h-4 w-4 text-brand-blue" />
              <span>Submit Milestone Evidence</span>
            </Link>

            <Link
              to="/projects/PROJ-JH-AGRI-01"
              className="p-3 bg-slate-50 hover:bg-purple-50/50 rounded-xl border border-slate-200 flex items-center gap-2 font-semibold text-slate-700 transition"
            >
              <FileCode className="h-4 w-4 text-purple-600" />
              <span>Update Firmware & CAD Link</span>
            </Link>

            <Link
              to="/projects/PROJ-JH-AGRI-01"
              className="p-3 bg-slate-50 hover:bg-emerald-50/50 rounded-xl border border-slate-200 flex items-center gap-2 font-semibold text-slate-700 transition"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Request Faculty IRL Review</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
