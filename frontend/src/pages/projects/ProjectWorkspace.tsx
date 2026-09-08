import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Layers,
  Users,
  CheckCircle2,
  Clock,
  Send,
  MessageSquare,
  Shield,
  Award,
  Sparkles,
  ExternalLink,
  PlusCircle,
  FileCode,
  Check,
  Building2,
  TrendingUp,
  Cpu,
} from 'lucide-react';
import { projectsApi, industriesApi } from '../../services/api';
import { Project, Challenge, ProjectMilestone, ProjectTask, ProjectTeamMember, ProjectComment, IndustryCollaboration } from '../../types';
import { IRLProgress } from '../../components/common/IRLProgress';
import { useAuth } from '../../context/AuthContext';

export const ProjectWorkspace: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [projectData, setProjectData] = useState<{
    project: Project;
    challenge: Challenge;
    team: ProjectTeamMember[];
    milestones: ProjectMilestone[];
    tasks: ProjectTask[];
    comments: ProjectComment[];
    collaborations: IndustryCollaboration[];
    impact: any[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'tasks' | 'team' | 'industry' | 'discussion'>('overview');
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const loadWorkspace = async () => {
    if (!id) return;
    try {
      const res = await projectsApi.getById(id);
      setProjectData(res.data);
    } catch (err) {
      console.error('Failed to load project workspace:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWorkspace();
  }, [id]);

  const handleAdvanceMilestone = async (milestoneId: string) => {
    if (!projectData) return;
    try {
      await projectsApi.updateMilestone(projectData.project.id, milestoneId, {
        status: 'APPROVED',
        mentor_feedback: 'Verified and approved by Lead Faculty Mentor.',
      });
      alert('Milestone approved! Project advanced to next Innovation Readiness Level.');
      loadWorkspace();
    } catch (err) {
      console.error('Failed to approve milestone:', err);
      alert('Error updating milestone.');
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !projectData) return;
    setIsSubmittingComment(true);
    try {
      await projectsApi.addComment(projectData.project.id, newComment);
      setNewComment('');
      loadWorkspace();
    } catch (err) {
      console.error('Failed to post comment:', err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !projectData) return;
    try {
      await projectsApi.createTask(projectData.project.id, {
        title: newTaskTitle,
        assigned_to_name: user?.full_name || 'Team Member',
      });
      setNewTaskTitle('');
      loadWorkspace();
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const handleToggleTaskStatus = async (taskId: string, currentStatus: string) => {
    if (!projectData) return;
    const nextStatus = currentStatus === 'DONE' ? 'IN_PROGRESS' : 'DONE';
    try {
      await projectsApi.updateTask(projectData.project.id, taskId, { status: nextStatus });
      loadWorkspace();
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  if (isLoading || !projectData) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center text-xs text-slate-400">
        Loading Project Collaboration Workspace...
      </div>
    );
  }

  const { project, challenge, team, milestones, tasks, comments, collaborations } = projectData;
  const isMentorOrAdmin = user?.role === 'faculty' || user?.role === 'university_admin' || user?.role === 'admin';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Workspace Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
              {project.id}
            </span>
            <span className="text-xs font-bold text-brand-blue bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
              {project.university_name}
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              Status: {project.status}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Budget Allocated:</span>
            <span className="font-black text-slate-900">₹{project.budget_allocated.toLocaleString()} INR</span>
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
            {project.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
            {project.description}
          </p>
        </div>

        {/* Linked Challenge Ribbon */}
        {challenge && (
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-500">Linked Citizen Problem:</span>
              <span className="font-mono text-slate-700 font-bold">{challenge.id}</span>
              <span className="text-slate-800 line-clamp-1">{challenge.title}</span>
            </div>
            <Link
              to={`/challenge/${challenge.id}`}
              className="text-brand-blue font-bold hover:underline flex items-center gap-0.5 flex-shrink-0"
            >
              View Problem Radar <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        )}

        {/* IRL Progress Bar */}
        <div className="pt-2">
          <IRLProgress currentStage={project.irl_level} />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto text-xs font-bold">
        {[
          { id: 'overview' as const, label: 'Overview & CAD/Repo' },
          { id: 'milestones' as const, label: `Milestones (${milestones.length})` },
          { id: 'tasks' as const, label: `Tasks (${tasks.length})` },
          { id: 'team' as const, label: `Multidisciplinary Team (${team.length})` },
          { id: 'industry' as const, label: `Industry CSR Backing (${collaborations.length})` },
          { id: 'discussion' as const, label: `Threaded Discussion (${comments.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 px-3.5 transition whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-b-2 border-brand-blue text-brand-blue'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in">
          <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-soft space-y-4">
            <h3 className="text-base font-bold text-slate-900">Technical Specifications & Assets</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Firmware / Code Repository</span>
                <a
                  href={project.repository_url || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-brand-blue hover:underline flex items-center gap-1 mt-1 truncate"
                >
                  <FileCode className="h-4 w-4 flex-shrink-0" />
                  <span>github.com/jharkhand-innovation/smart-vfd</span>
                </a>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Hardware CAD & PCB Files</span>
                <a
                  href={project.cad_firmware_url || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-purple-700 hover:underline flex items-center gap-1 mt-1 truncate"
                >
                  <Cpu className="h-4 w-4 flex-shrink-0" />
                  <span>cad.jsix.gov.in/models/smart-vfd-v3.step</span>
                </a>
              </div>
            </div>

            <div className="space-y-2 pt-2 text-xs">
              <span className="font-bold text-slate-800 block">Multidisciplinary Engineering Summary:</span>
              <p className="text-slate-600 leading-relaxed">
                Project brings together Electrical Engineering (VFD buck-boost power converter), Agronomy (crop water
                budgeting & soil telemetry), and Computer Science (GSM SIM800L cloud alerting engine). Passed 72-hour
                continuous dynamometer test under brownout conditions (130V-270V).
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft space-y-4">
            <h3 className="text-base font-bold text-slate-900">Project Timeline</h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Start Date</span>
                <span className="font-bold text-slate-800">{project.start_date}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Target Pilot Completion</span>
                <span className="font-bold text-slate-800">{project.target_completion_date}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Lead Faculty Mentor</span>
                <span className="font-bold text-brand-blue">{project.lead_faculty_name}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Milestones */}
      {activeTab === 'milestones' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Innovation Milestones & IRL Verification</h3>
              <p className="text-xs text-slate-500">Each milestone advancement unlocks the next Innovation Readiness Level</p>
            </div>
          </div>

          <div className="space-y-4">
            {milestones.map((m, idx) => (
              <div
                key={m.id}
                className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition space-y-3 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white bg-slate-900 px-2 py-0.5 rounded text-[11px]">
                      {m.target_irl}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{m.title}</h4>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full font-bold text-[10px] self-start sm:self-auto ${
                      m.status === 'APPROVED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {m.status}
                  </span>
                </div>

                <p className="text-slate-600 leading-relaxed">{m.description}</p>

                {m.mentor_feedback && (
                  <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 text-purple-900">
                    <strong className="font-bold">Lead Mentor Review:</strong> {m.mentor_feedback}
                  </div>
                )}

                {/* Mentor Action Bar */}
                {isMentorOrAdmin && m.status !== 'APPROVED' && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => handleAdvanceMilestone(m.id)}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-xs"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Verify Evidence & Advance IRL</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Tasks */}
      {activeTab === 'tasks' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Student & Team Task Tracker</h3>
              <p className="text-xs text-slate-500">Action items assigned across team members</p>
            </div>
          </div>

          {/* Add Task Form */}
          <form onSubmit={handleCreateTask} className="flex gap-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Assign a new engineering or testing task..."
              className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-brand-blue hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Task</span>
            </button>
          </form>

          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleTaskStatus(task.id, task.status)}
                    className={`h-5 w-5 rounded-md border flex items-center justify-center transition ${
                      task.status === 'DONE'
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 hover:border-brand-blue'
                    }`}
                  >
                    {task.status === 'DONE' && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  </button>
                  <div>
                    <span className={`font-semibold ${task.status === 'DONE' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {task.title}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">Assigned to: {task.assigned_to_name}</div>
                  </div>
                </div>

                <span
                  className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                    task.priority === 'high' ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {task.priority} Priority
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Team */}
      {activeTab === 'team' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6 animate-in fade-in">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Multidisciplinary Team Roster</h3>
            <p className="text-xs text-slate-500">Combining Faculty Mentors, Student Leads, and Industry Advisors</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {team.map((member) => (
              <div key={member.id} className="p-4 rounded-2xl border border-slate-200 flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-sm">
                  {member.name[0]}
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-bold text-slate-900">{member.name}</div>
                  <div className="text-xs text-brand-blue font-semibold capitalize">
                    {member.role.replace('_', ' ')}
                  </div>
                  <div className="text-[11px] text-slate-500">{member.department}</div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {member.skills.map((sk, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Industry CSR */}
      {activeTab === 'industry' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6 animate-in fade-in">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Industry & CSR Sponsorship</h3>
            <p className="text-xs text-slate-500">Corporate partnerships backing prototype fabrication and pilot testing</p>
          </div>

          <div className="space-y-4">
            {collaborations.map((collab) => (
              <div key={collab.id} className="p-5 rounded-2xl border border-blue-100 bg-blue-50/40 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-brand-blue uppercase tracking-wider block">
                      {collab.collaboration_type}
                    </span>
                    <h4 className="text-base font-black text-slate-900">{collab.industry_name}</h4>
                  </div>
                  {collab.amount_inr && (
                    <div className="text-right">
                      <span className="text-xs text-slate-500 block">Committed Grant</span>
                      <span className="text-lg font-black text-emerald-600">
                        ₹{collab.amount_inr.toLocaleString()} INR
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-600">{collab.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: Threaded Discussion */}
      {activeTab === 'discussion' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6 animate-in fade-in">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Stakeholder Collaborative Discussion</h3>
            <p className="text-xs text-slate-500">Threaded communication between mentors, students, and industry partners</p>
          </div>

          <div className="space-y-3">
            {comments.map((cm) => (
              <div key={cm.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{cm.user_name}</span>
                  <span className="text-[10px] text-slate-400 capitalize">{cm.user_role}</span>
                </div>
                <p className="text-slate-700 leading-relaxed">{cm.message}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handlePostComment} className="flex gap-2 pt-2 border-t border-slate-100">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Post milestone update, testing notes, or feedback..."
              className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue"
            />
            <button
              disabled={isSubmittingComment}
              type="submit"
              className="px-5 py-2.5 bg-brand-blue hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Post</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
