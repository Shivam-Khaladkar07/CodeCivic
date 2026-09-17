import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Award, CheckCircle2, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { projectsApi } from '../../services/api';
import { Project } from '../../types';
import { IRLProgress } from '../../components/common/IRLProgress';
import { useAuth } from '../../context/AuthContext';

const FALLBACK_FACULTY_PROJECTS: Project[] = [
  {
    id: 'PROJ-JH-AGRI-01',
    challenge_id: 'JH-RNC-1001',
    cluster_id: 'CLUS-RNC-AGR-01',
    title: 'Smart Solar-Grid Hybrid VFD Controller & IoT Irrigation Protector',
    description: 'An intelligent power-conditioning variable frequency drive (VFD) and IoT surge limiter designed for rural agricultural feeders in Jharkhand. Blends solar PV with erratic grid power to protect 5HP motors.',
    university_id: 'UNI-BAU',
    university_name: 'Birsa Agricultural University (BAU) & BIT Mesra',
    lead_faculty_id: 'FAC-100',
    lead_faculty_name: 'Dr. A. K. Sharma',
    status: 'PILOT',
    irl_level: 'IRL-5',
    irl_progress_pct: 65,
    budget_allocated: 420000,
    start_date: '2024-02-10T00:00:00Z',
    target_completion_date: '2024-07-31T00:00:00Z',
    reusable_in_districts: ['Dumka', 'Hazaribagh', 'Deoghar', 'Palamu'],
    created_at: '2024-02-10T10:00:00Z',
    updated_at: '2024-03-01T14:30:00Z',
  },
  {
    id: 'PROJ-JH-WATER-02',
    challenge_id: 'JH-ES-1003',
    cluster_id: 'CLUS-ES-WAT-01',
    title: 'Low-Cost Alumina Arsenic & Fluoride Community Filter',
    description: 'Activated alumina adsorption filtration column designed for tribal drinking water tubewells in East Singhbhum.',
    university_id: 'UNI-BITM',
    university_name: 'BIT Mesra',
    lead_faculty_id: 'FAC-100',
    lead_faculty_name: 'Dr. A. K. Sharma',
    status: 'FIELD_VALIDATION',
    irl_level: 'IRL-6',
    irl_progress_pct: 75,
    budget_allocated: 350000,
    start_date: '2024-01-15T00:00:00Z',
    target_completion_date: '2024-08-30T00:00:00Z',
    reusable_in_districts: ['Ranchi', 'Khunti'],
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-02-28T14:30:00Z',
  },
];

export const FacultyDashboard: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>(FALLBACK_FACULTY_PROJECTS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await projectsApi.getAll({ limit: 10 });
        if (Array.isArray(res.data)) {
          setProjects(res.data);
        } else if (res.data && Array.isArray((res.data as any).projects)) {
          setProjects((res.data as any).projects);
        } else {
          setProjects(FALLBACK_FACULTY_PROJECTS);
        }
      } catch (err) {
        console.warn('Backend offline, using fallback faculty projects:', err);
        setProjects(FALLBACK_FACULTY_PROJECTS);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const safeProjects = Array.isArray(projects) ? projects : FALLBACK_FACULTY_PROJECTS;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-navy-900 text-white rounded-3xl p-6 sm:p-8 shadow-elevated flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="h-4 w-4" />
            Faculty Mentor & Research Supervisor Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Welcome, {user?.full_name || 'Dr. A. K. Sharma'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Supervise multidisciplinary student innovation teams, evaluate milestone evidence, and certify Innovation
            Readiness Level (IRL) progression.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to="/projects/PROJ-JH-AGRI-01"
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-1.5"
          >
            <Sparkles className="h-4 w-4" />
            <span>Open Golden Lead Project</span>
          </Link>
        </div>
      </div>

      {/* Projects under Supervision */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-lg font-black text-slate-900">Assigned Student Innovation Projects</h3>
            <p className="text-xs text-slate-500">Review technical feasibility, prototype test logs, and pilot readiness</p>
          </div>
        </div>

        <div className="space-y-4">
          {safeProjects.slice(0, 5).map((p) => (
            <div
              key={p.id}
              className="p-5 rounded-2xl border border-slate-200 hover:border-purple-400 transition space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                    {p.id}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-1">{p.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{p.description}</p>
                </div>

                <Link
                  to={`/projects/${p.id}`}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center gap-1 self-start sm:self-auto flex-shrink-0"
                >
                  <span>Review Workspace</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <IRLProgress currentStage={p.irl_level} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
