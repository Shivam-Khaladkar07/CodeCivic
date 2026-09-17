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
  X,
  Upload,
  Trash2,
  HeartHandshake,
  ShieldCheck,
  BarChart3,
  IndianRupee,
} from 'lucide-react';
import { projectsApi } from '../../services/api';
import {
  Project,
  Challenge,
  ProjectMilestone,
  ProjectTask,
  ProjectTeamMember,
  ProjectComment,
  IndustryCollaboration,
  ImpactRecord,
  UserRole,
  IRLStage,
  ProjectStatus,
  UrgencyLevel,
  ChallengeStatus,
} from '../../types';
import { IRLProgress } from '../../components/common/IRLProgress';
import { useAuth } from '../../context/AuthContext';

const FALLBACK_PROJECT_DATA: {
  project: Project;
  challenge: Challenge;
  team: ProjectTeamMember[];
  milestones: ProjectMilestone[];
  tasks: ProjectTask[];
  comments: ProjectComment[];
  collaborations: IndustryCollaboration[];
  impact: ImpactRecord[];
} = {
  project: {
    id: 'PROJ-JH-AGRI-01',
    challenge_id: 'JH-RNC-1001',
    cluster_id: 'CLUS-RNC-AGR-01',
    title: 'Smart Solar-Grid Hybrid VFD Controller & IoT Irrigation Protector',
    description: 'An intelligent power-conditioning variable frequency drive (VFD) and IoT surge limiter designed for rural agricultural feeders in Jharkhand. Automatically blends solar PV with erratic 140V-260V grid power, preventing motor tripping and starter coil burnouts while providing mobile GSM telemetry to farmers.',
    university_id: 'UNI-BAU',
    university_name: 'Birsa Agricultural University (BAU) & BIT Mesra',
    lead_faculty_id: 'FAC-100',
    lead_faculty_name: 'Dr. A. K. Sharma (BIT Mesra / BAU Lead)',
    status: 'PILOT',
    irl_level: 'IRL-5',
    irl_progress_pct: 65,
    budget_allocated: 420000,
    start_date: '2024-02-10T00:00:00Z',
    target_completion_date: '2024-07-31T00:00:00Z',
    repository_url: 'https://github.com/jharkhand-innovation/smart-vfd-irrigation',
    cad_firmware_url: 'https://cad.jsix.gov.in/models/smart-vfd-v3.step',
    demo_video_url: 'https://youtube.com/watch?v=demo_irrigation_vfd',
    reusable_in_districts: ['Dumka', 'Hazaribagh', 'Deoghar', 'Palamu'],
    created_at: '2024-02-10T10:00:00Z',
    updated_at: '2024-03-01T14:30:00Z',
  },
  challenge: {
    id: 'JH-RNC-1001',
    citizen_id: 'USER-CITIZEN-1',
    citizen_name: 'Budheshwar Mahto',
    title: 'Irrigation pump frequently stops because of voltage fluctuations',
    description: 'Agricultural water pump motors in Kanke block continuously trip and overheat due to voltage drop between 140V-260V during peak evening pumping hours, causing crop dehydration.',
    district: 'Ranchi',
    block: 'Kanke',
    village_locality: 'Arsande',
    latitude: 23.435,
    longitude: 85.321,
    primary_domain: 'Agriculture',
    urgency: 'high',
    priority_score: 88,
    affected_population: 1800,
    status: 'IN_PROJECT',
    created_at: '2024-01-12T10:00:00Z',
    updated_at: '2024-02-10T10:00:00Z',
  },
  team: [
    {
      id: 'TM-01',
      project_id: 'PROJ-JH-AGRI-01',
      user_id: 'USER-STUDENT-1',
      name: 'Pooja Hansda',
      email: 'pooja.hansda@student.bau.in',
      role: 'student_lead',
      department: 'Agricultural Engineering',
      skills: ['Irrigation Hydraulics', 'Agro-Meteorology', 'Field Validation'],
    },
    {
      id: 'TM-02',
      project_id: 'PROJ-JH-AGRI-01',
      user_id: 'USER-FACULTY-1',
      name: 'Dr. A. K. Sharma',
      email: 'draksharma@bitm.edu.in',
      role: 'faculty_mentor',
      department: 'Electrical & Electronics Engineering',
      skills: ['Smart Microgrids', 'VFD Drives', 'Solar Inverters'],
    },
    {
      id: 'TM-03',
      project_id: 'PROJ-JH-AGRI-01',
      user_id: 'USER-STUDENT-2',
      name: 'Rahul Murmu',
      email: 'rahul.murmu@student.bitm.in',
      role: 'student_member',
      department: 'Embedded Systems',
      skills: ['IoT Telemetry', 'GSM Modem', 'Firmware C++'],
    },
  ],
  milestones: [
    {
      id: 'MS-01',
      project_id: 'PROJ-JH-AGRI-01',
      target_irl: 'IRL-1',
      title: 'Ground Problem Validation & Feeder Voltage Profile',
      description: 'Field telemetry logging of 3-phase line voltages at Kanke agricultural feeder.',
      due_date: '2024-02-20T00:00:00Z',
      status: 'APPROVED',
      mentor_feedback: 'Field voltage drop verified at 142V lowest during evening surge.',
    },
    {
      id: 'MS-02',
      project_id: 'PROJ-JH-AGRI-01',
      target_irl: 'IRL-2',
      title: 'Lab Bench Simulation of Hybrid VFD Logic',
      description: 'MATLAB/Simulink modeling of solar MPPT + erratic AC grid voltage booster.',
      due_date: '2024-03-01T00:00:00Z',
      status: 'APPROVED',
      mentor_feedback: 'Simulation confirmed smooth torque delivery without motor stalls.',
    },
    {
      id: 'MS-03',
      project_id: 'PROJ-JH-AGRI-01',
      target_irl: 'IRL-3',
      title: 'Proof-of-Concept Prototype on 5HP Submersible Motor',
      description: 'Assembled PCB prototype with dual-power relay and surge arrestor.',
      due_date: '2024-03-15T00:00:00Z',
      status: 'APPROVED',
      mentor_feedback: 'Continuous 48-hour pump run without thermal overload.',
    },
    {
      id: 'MS-04',
      project_id: 'PROJ-JH-AGRI-01',
      target_irl: 'IRL-4',
      title: 'Lab Environmental & Surge Testing',
      description: 'Testing under high humidity and simulated line surges up to 450V.',
      due_date: '2024-03-30T00:00:00Z',
      status: 'APPROVED',
      mentor_feedback: 'IP65 casing and MOV surge suppression validated.',
    },
    {
      id: 'MS-05',
      project_id: 'PROJ-JH-AGRI-01',
      target_irl: 'IRL-5',
      title: 'Field Pilot Deployment in Kanke & Boreya Fields',
      description: 'Pilot test with 12 farmer groups operating solar-grid hybrid pumps.',
      due_date: '2024-04-10T00:00:00Z',
      status: 'SUBMITTED',
      mentor_feedback: 'Currently under field monitoring by District Agricultural Officer.',
    },
    {
      id: 'MS-06',
      project_id: 'PROJ-JH-AGRI-01',
      target_irl: 'IRL-6',
      title: 'Multi-District Field Validation Across Varying Water Tables',
      description: 'Replication in Dumka and Palamu drought-prone agricultural blocks.',
      due_date: '2024-04-30T00:00:00Z',
      status: 'PENDING',
    },
  ],
  tasks: [
    {
      id: 'TSK-01',
      project_id: 'PROJ-JH-AGRI-01',
      title: 'Deploy GSM telemetry module firmware v2.1 to pilot controllers',
      assigned_to_id: 'USER-STUDENT-2',
      assigned_to_name: 'Rahul Murmu',
      status: 'DONE',
      priority: 'high',
      due_date: '2024-03-15T00:00:00Z',
    },
    {
      id: 'TSK-02',
      project_id: 'PROJ-JH-AGRI-01',
      title: 'Calibrate water discharge flow sensors for Kanke tubewell',
      assigned_to_id: 'USER-STUDENT-1',
      assigned_to_name: 'Pooja Hansda',
      status: 'IN_PROGRESS',
      priority: 'medium',
      due_date: '2024-03-18T00:00:00Z',
    },
    {
      id: 'TSK-03',
      project_id: 'PROJ-JH-AGRI-01',
      title: 'Submit mid-term pilot report to Directorate of Agriculture, Jharkhand',
      assigned_to_id: 'USER-FACULTY-1',
      assigned_to_name: 'Dr. A. K. Sharma',
      status: 'TODO',
      priority: 'high',
      due_date: '2024-03-20T00:00:00Z',
    },
  ],
  comments: [
    {
      id: 'CM-01',
      project_id: 'PROJ-JH-AGRI-01',
      user_id: 'USER-FACULTY-1',
      user_name: 'Dr. A. K. Sharma',
      user_role: 'faculty',
      message: 'The solar blending algorithm kept pump RPM stable even during the 152V brownout yesterday.',
      created_at: '2024-03-12T14:20:00Z',
    },
    {
      id: 'CM-02',
      project_id: 'PROJ-JH-AGRI-01',
      user_id: 'USER-STUDENT-1',
      user_name: 'Pooja Hansda',
      user_role: 'student',
      message: 'Farmers in Arsande report 30% reduction in diesel generator usage for supplemental pumping.',
      created_at: '2024-03-14T09:15:00Z',
    },
  ],
  collaborations: [
    {
      id: 'COL-01',
      project_id: 'PROJ-JH-AGRI-01',
      project_title: 'Smart Solar-Grid Hybrid VFD Controller & IoT Irrigation Protector',
      industry_id: 'IND-TATA',
      industry_name: 'Tata Steel Rural Development Society (TSRDS)',
      collaboration_type: 'Funding & Field Pilot Mentorship',
      status: 'ACTIVE',
      amount_inr: 250000,
      description: 'Sponsorship of 15 IoT hybrid VFD pilot units across Ranchi and East Singhbhum.',
      created_at: '2024-02-25T00:00:00Z',
    },
  ],
  impact: [
    {
      id: 'IMP-01',
      project_id: 'PROJ-JH-AGRI-01',
      metric_name: 'Farmers Directly Benefited',
      predicted_value: 2500,
      verified_value: 4200,
      unit: 'farmers',
      verified_by: 'Kanke Block Agricultural Officer & Panchayat Pradhan',
      verification_date: '2024-03-15',
      notes: 'Verified coverage across Arsande, Sukurhutu, Pithoriya and Boreya hamlets.',
    },
  ],
};

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
    impact: ImpactRecord[];
  } | null>(FALLBACK_PROJECT_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'tasks' | 'team' | 'industry' | 'impact' | 'discussion'>('overview');
  
  // Discussion
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Team Member Modal State
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberRole, setMemberRole] = useState<'student_lead' | 'student_member' | 'faculty_mentor' | 'industry_advisor'>('student_member');
  const [memberDepartment, setMemberDepartment] = useState('Agricultural Engineering');
  const [memberSkills, setMemberSkills] = useState('IoT Telemetry, Sensor Probes');
  const [isSubmittingTeam, setIsSubmittingTeam] = useState(false);

  // Milestone Evidence Submission Modal State
  const [isSubmitEvidenceModalOpen, setIsSubmitEvidenceModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<ProjectMilestone | null>(null);
  const [evidenceUrl, setEvidenceUrl] = useState('https://docs.jsix.gov.in/evidence/lab-test-log-ranchi.pdf');
  const [evidenceNotes, setEvidenceNotes] = useState('');
  const [isSubmittingEvidence, setIsSubmittingEvidence] = useState(false);

  // Industry Sponsorship Modal State
  const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false);
  const [sponsorCollabType, setSponsorCollabType] = useState('Offer Funding');
  const [sponsorAmount, setSponsorAmount] = useState('250000');
  const [sponsorDescription, setSponsorDescription] = useState('Committed CSR grant for localized manufacturing and pilot deployment.');
  const [isSubmittingSponsor, setIsSubmittingSponsor] = useState(false);

  // Impact Record Modal State
  const [isAddImpactModalOpen, setIsAddImpactModalOpen] = useState(false);
  const [impactMetricName, setImpactMetricName] = useState('Farmers Directly Benefited');
  const [impactPredictedVal, setImpactPredictedVal] = useState('2500');
  const [impactVerifiedVal, setImpactVerifiedVal] = useState('4200');
  const [impactUnit, setImpactUnit] = useState('farmers');
  const [impactVerifiedBy, setImpactVerifiedBy] = useState('Kanke Block Agricultural Officer & Panchayat Pradhan');
  const [impactNotes, setImpactNotes] = useState('Verified coverage across Arsande, Sukurhutu, Pithoriya and Boreya hamlets.');
  const [isSubmittingImpact, setIsSubmittingImpact] = useState(false);

  const loadWorkspace = async () => {
    if (!id) return;
    try {
      const res = await projectsApi.getById(id);
      if (res.data && res.data.project) {
        setProjectData(res.data);
      } else {
        setIsOffline(true);
        setProjectData({
          ...FALLBACK_PROJECT_DATA,
          project: { ...FALLBACK_PROJECT_DATA.project, id: id || 'PROJ-JH-AGRI-01' },
        });
      }
    } catch (err) {
      console.warn('Backend unavailable, using offline project workspace data:', err);
      setIsOffline(true);
      setProjectData({
        ...FALLBACK_PROJECT_DATA,
        project: { ...FALLBACK_PROJECT_DATA.project, id: id || 'PROJ-JH-AGRI-01' },
      });
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

  const handleSubmitMilestoneEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectData || !selectedMilestone) return;
    setIsSubmittingEvidence(true);
    try {
      await projectsApi.submitMilestoneEvidence(projectData.project.id, selectedMilestone.id, {
        submission_evidence: evidenceUrl,
        notes: evidenceNotes || 'Submitted prototype specification and field test logs for mentor evaluation.',
      });
      alert('Evidence submitted for faculty mentor review!');
      setIsSubmitEvidenceModalOpen(false);
      setSelectedMilestone(null);
      setEvidenceNotes('');
      loadWorkspace();
    } catch (err) {
      console.error('Failed to submit milestone evidence:', err);
      alert('Error submitting evidence.');
    } finally {
      setIsSubmittingEvidence(false);
    }
  };

  const handleAddTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectData || !memberName.trim()) return;
    setIsSubmittingTeam(true);
    try {
      await projectsApi.addTeamMember(projectData.project.id, {
        name: memberName,
        email: memberEmail,
        role: memberRole,
        department: memberDepartment,
        skills: memberSkills.split(',').map((s) => s.trim()).filter(Boolean),
      });
      alert(`Team member ${memberName} successfully added to the multidisciplinary team!`);
      setIsAddTeamModalOpen(false);
      setMemberName('');
      setMemberEmail('');
      loadWorkspace();
    } catch (err) {
      console.error('Failed to add team member:', err);
      alert('Error adding team member. Ensure you have mentor/faculty or admin role.');
    } finally {
      setIsSubmittingTeam(false);
    }
  };

  const handleRemoveTeamMember = async (memberId: string) => {
    if (!projectData) return;
    if (!window.confirm('Remove this member from the innovation team?')) return;
    try {
      await projectsApi.removeTeamMember(projectData.project.id, memberId);
      loadWorkspace();
    } catch (err) {
      console.error('Failed to remove member:', err);
      alert('Error removing member.');
    }
  };

  const handlePledgeSponsorship = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectData) return;
    setIsSubmittingSponsor(true);
    try {
      await projectsApi.addCollaboration(projectData.project.id, {
        collaboration_type: sponsorCollabType,
        amount_inr: Number(sponsorAmount) || 0,
        description: sponsorDescription,
      });
      alert(`CSR sponsorship of ₹${Number(sponsorAmount).toLocaleString()} successfully recorded!`);
      setIsSponsorModalOpen(false);
      loadWorkspace();
    } catch (err) {
      console.error('Failed to record sponsorship:', err);
      alert('Error recording sponsorship.');
    } finally {
      setIsSubmittingSponsor(false);
    }
  };

  const handleAddImpactRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectData || !impactMetricName.trim()) return;
    setIsSubmittingImpact(true);
    try {
      await projectsApi.addImpactRecord(projectData.project.id, {
        metric_name: impactMetricName,
        predicted_value: Number(impactPredictedVal) || 0,
        verified_value: Number(impactVerifiedVal) || 0,
        unit: impactUnit,
        verified_by: impactVerifiedBy,
        notes: impactNotes,
      });
      alert(`Verified ground impact record for "${impactMetricName}" logged successfully!`);
      setIsAddImpactModalOpen(false);
      loadWorkspace();
    } catch (err) {
      console.error('Failed to add impact record:', err);
      alert('Error recording impact audit.');
    } finally {
      setIsSubmittingImpact(false);
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

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center text-xs text-slate-400">
        Loading Project Collaboration Workspace...
      </div>
    );
  }

  const project = projectData?.project || FALLBACK_PROJECT_DATA.project;
  const challenge = projectData?.challenge || FALLBACK_PROJECT_DATA.challenge;
  const team = Array.isArray(projectData?.team) ? projectData.team : FALLBACK_PROJECT_DATA.team;
  const milestones = Array.isArray(projectData?.milestones) ? projectData.milestones : FALLBACK_PROJECT_DATA.milestones;
  const tasks = Array.isArray(projectData?.tasks) ? projectData.tasks : FALLBACK_PROJECT_DATA.tasks;
  const comments = Array.isArray(projectData?.comments) ? projectData.comments : FALLBACK_PROJECT_DATA.comments;
  const collaborations = Array.isArray(projectData?.collaborations) ? projectData.collaborations : FALLBACK_PROJECT_DATA.collaborations;
  const impact = Array.isArray(projectData?.impact) ? projectData.impact : FALLBACK_PROJECT_DATA.impact;

  const isMentorOrAdmin = user?.role === 'faculty' || user?.role === 'university_admin' || user?.role === 'admin';
  const isStudentOrLead = user?.role === 'student' || user?.role === 'faculty' || user?.role === 'admin';
  const isGovOrMentor = user?.role === 'government' || user?.role === 'faculty' || user?.role === 'admin';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {isOffline && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-900">CivicForge Offline Presentation Mode</p>
              <p className="text-[11px] text-amber-700">
                Live backend is pending deployment. Displaying validated golden demo workspace and milestone data for {project.id}.
              </p>
            </div>
          </div>
          <span className="text-[10px] bg-amber-200/60 text-amber-900 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0">
            Showcase Mode
          </span>
        </div>
      )}

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
          { id: 'impact' as const, label: `Impact Measurement (${impact.length})` },
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Innovation Milestones & IRL Verification</h3>
              <p className="text-xs text-slate-500">Milestone progression gates advance the project from Lab Prototype to Community Pilot</p>
            </div>
          </div>

          <div className="space-y-4">
            {milestones.map((m) => (
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
                        : m.status === 'SUBMITTED'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {m.status === 'SUBMITTED' ? 'PENDING MENTOR REVIEW' : m.status}
                  </span>
                </div>

                <p className="text-slate-600 leading-relaxed">{m.description}</p>

                {m.submission_evidence && (
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <FileCode className="h-3.5 w-3.5 text-brand-blue flex-shrink-0" />
                      <span className="font-semibold text-slate-500">Submitted Evidence:</span>
                      <a href={m.submission_evidence} target="_blank" rel="noreferrer" className="text-brand-blue hover:underline font-mono truncate">
                        {m.submission_evidence}
                      </a>
                    </div>
                  </div>
                )}

                {m.mentor_feedback && (
                  <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 text-purple-900">
                    <strong className="font-bold">Faculty Review:</strong> {m.mentor_feedback}
                  </div>
                )}

                {/* Actions: Student Submits Evidence / Mentor Approves */}
                <div className="pt-2 flex flex-wrap items-center justify-end gap-2">
                  {isStudentOrLead && m.status === 'PENDING' && (
                    <button
                      onClick={() => {
                        setSelectedMilestone(m);
                        setIsSubmitEvidenceModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>Submit Lab/Test Evidence</span>
                    </button>
                  )}

                  {isMentorOrAdmin && m.status !== 'APPROVED' && (
                    <button
                      onClick={() => handleAdvanceMilestone(m.id)}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-xs"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Approve Evidence & Advance IRL</span>
                    </button>
                  )}
                </div>
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Multidisciplinary Team Roster</h3>
              <p className="text-xs text-slate-500">Combining Faculty Mentors, Student Leads, and Industry Advisors</p>
            </div>

            {isMentorOrAdmin && (
              <button
                onClick={() => setIsAddTeamModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-blue hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs self-start"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add Team Member</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {team.map((member) => (
              <div key={member.id} className="p-4 rounded-2xl border border-slate-200 flex items-start justify-between gap-3 hover:border-slate-300 transition">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-sm flex-shrink-0">
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

                {isMentorOrAdmin && member.role !== 'faculty_mentor' && (
                  <button
                    onClick={() => handleRemoveTeamMember(member.id)}
                    title="Remove from team"
                    className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Industry CSR */}
      {activeTab === 'industry' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Industry & CSR Sponsorship</h3>
              <p className="text-xs text-slate-500">Corporate partnerships backing prototype fabrication and pilot testing</p>
            </div>

            <button
              onClick={() => setIsSponsorModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold transition shadow-xs self-start"
            >
              <HeartHandshake className="h-4 w-4" />
              <span>Pledge CSR Sponsorship / Grant</span>
            </button>
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

      {/* TAB 6: Impact Measurement & Auditing */}
      {activeTab === 'impact' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Societal Impact Measurement & Ground Audit</h3>
              <p className="text-xs text-slate-500">Independent audits comparing predicted academic targets vs verified ground outcomes</p>
            </div>

            {isGovOrMentor && (
              <button
                onClick={() => setIsAddImpactModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs self-start"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>+ Record Verified Impact Audit</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {impact.map((rec) => {
              const pctAchieved = rec.predicted_value > 0 ? Math.round((rec.verified_value / rec.predicted_value) * 100) : 100;
              return (
                <div key={rec.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{rec.metric_name}</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {pctAchieved}% of Target
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs py-1">
                    <div className="p-2.5 bg-white rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Predicted Target</span>
                      <span className="text-base font-black text-slate-700">
                        {rec.predicted_value.toLocaleString()} {rec.unit}
                      </span>
                    </div>

                    <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
                      <span className="text-[10px] text-emerald-700 uppercase font-bold block">Verified Ground Outcome</span>
                      <span className="text-base font-black text-emerald-800">
                        {rec.verified_value.toLocaleString()} {rec.unit}
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-600 border-t border-slate-200 pt-2 space-y-0.5">
                    <div>
                      <strong className="text-slate-700 font-semibold">Audited By:</strong> {rec.verified_by} ({rec.verification_date})
                    </div>
                    {rec.notes && <div className="text-slate-500 italic">"{rec.notes}"</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 7: Threaded Discussion */}
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

      {/* MODAL: ADD TEAM MEMBER */}
      {isAddTeamModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">Add Team Member</h3>
              <button onClick={() => setIsAddTeamModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddTeamMember} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="e.g. Pooja Hansda / Dr. Amit Sen"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  placeholder="e.g. pooja.hansda@student.bau.in"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Role *</label>
                  <select
                    value={memberRole}
                    onChange={(e: any) => setMemberRole(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
                  >
                    <option value="student_lead">Student Lead</option>
                    <option value="student_member">Student Member</option>
                    <option value="faculty_mentor">Faculty Mentor</option>
                    <option value="industry_advisor">Industry Advisor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Department</label>
                  <input
                    type="text"
                    value={memberDepartment}
                    onChange={(e) => setMemberDepartment(e.target.value)}
                    placeholder="e.g. Agricultural Engg"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Technical Skills (comma-separated)</label>
                <input
                  type="text"
                  value={memberSkills}
                  onChange={(e) => setMemberSkills(e.target.value)}
                  placeholder="e.g. Embedded C, Power Electronics, GSM Telemetry"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddTeamModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingTeam}
                  className="px-5 py-2 bg-brand-blue hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs disabled:opacity-50"
                >
                  {isSubmittingTeam ? 'Adding...' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SUBMIT MILESTONE EVIDENCE */}
      {isSubmitEvidenceModalOpen && selectedMilestone && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-brand-blue uppercase tracking-wider block">{selectedMilestone.target_irl} Milestone</span>
                <h3 className="text-base font-extrabold text-slate-900">{selectedMilestone.title}</h3>
              </div>
              <button onClick={() => setIsSubmitEvidenceModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitMilestoneEvidence} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Evidence URL / Lab Test Document *</label>
                <input
                  type="url"
                  required
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                  placeholder="https://docs.jsix.gov.in/test-reports/lab-voltage-stress-test-passed.pdf"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Student Engineering & Testing Notes</label>
                <textarea
                  rows={3}
                  value={evidenceNotes}
                  onChange={(e) => setEvidenceNotes(e.target.value)}
                  placeholder="Describe dynamometer tests conducted, brownout test intervals, voltage stability measurements..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSubmitEvidenceModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEvidence}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-xs disabled:opacity-50"
                >
                  {isSubmittingEvidence ? 'Submitting...' : 'Submit to Mentor for Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PLEDGE CSR SPONSORSHIP */}
      {isSponsorModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Industry Partnership</span>
                <h3 className="text-base font-extrabold text-slate-900">Pledge CSR Sponsorship or Grant</h3>
              </div>
              <button onClick={() => setIsSponsorModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handlePledgeSponsorship} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Collaboration Type *</label>
                <select
                  value={sponsorCollabType}
                  onChange={(e) => setSponsorCollabType(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
                >
                  <option value="Offer Funding">Offer Prototype Funding & Grant</option>
                  <option value="Offer Technology">Offer Hardware / Testing Equipment</option>
                  <option value="Offer Testing">Industrial Rig / Testing Facility</option>
                  <option value="Offer Pilot">Community Pilot Deployment Site</option>
                  <option value="Join Consortium">Consortium Partner</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Committed Funding Amount (INR ₹)</label>
                <input
                  type="number"
                  value={sponsorAmount}
                  onChange={(e) => setSponsorAmount(e.target.value)}
                  placeholder="350000"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Commitment Description & Support Details</label>
                <textarea
                  rows={3}
                  value={sponsorDescription}
                  onChange={(e) => setSponsorDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSponsorModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingSponsor}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs disabled:opacity-50"
                >
                  {isSubmittingSponsor ? 'Recording...' : 'Confirm CSR Commitment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RECORD IMPACT AUDIT */}
      {isAddImpactModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-brand-blue uppercase tracking-wider block">Official Outcome Audit</span>
                <h3 className="text-base font-extrabold text-slate-900">Record Verified Ground Impact</h3>
              </div>
              <button onClick={() => setIsAddImpactModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddImpactRecord} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Impact Metric Name *</label>
                <select
                  value={impactMetricName}
                  onChange={(e) => setImpactMetricName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
                >
                  <option value="Farmers Directly Benefited">Farmers Directly Benefited</option>
                  <option value="Villages & Hamlets Covered">Villages & Hamlets Covered</option>
                  <option value="Annual Crop Loss Prevented">Annual Crop Loss Prevented</option>
                  <option value="Diesel Expenditure Saved by Farmers">Diesel Expenditure Saved by Farmers</option>
                  <option value="Carbon Offset (Clean Solar Blending)">Carbon Offset (Clean Solar Blending)</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Predicted</label>
                  <input
                    type="number"
                    value={impactPredictedVal}
                    onChange={(e) => setImpactPredictedVal(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Verified *</label>
                  <input
                    type="number"
                    required
                    value={impactVerifiedVal}
                    onChange={(e) => setImpactVerifiedVal(e.target.value)}
                    className="w-full p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl outline-none font-bold text-emerald-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Unit</label>
                  <input
                    type="text"
                    value={impactUnit}
                    onChange={(e) => setImpactUnit(e.target.value)}
                    placeholder="farmers / villages / INR"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Auditing / Verification Authority *</label>
                <input
                  type="text"
                  required
                  value={impactVerifiedBy}
                  onChange={(e) => setImpactVerifiedBy(e.target.value)}
                  placeholder="e.g. Kanke Block Agricultural Officer & Panchayat Pradhan"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Field Audit Notes</label>
                <textarea
                  rows={2}
                  value={impactNotes}
                  onChange={(e) => setImpactNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddImpactModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingImpact}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs disabled:opacity-50"
                >
                  {isSubmittingImpact ? 'Recording...' : 'Audit & Save Impact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectWorkspace;
