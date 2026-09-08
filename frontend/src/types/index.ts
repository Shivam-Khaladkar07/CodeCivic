export type UserRole = 
  | 'citizen' 
  | 'community_org'
  | 'panchayat_ulb'
  | 'government' 
  | 'university_admin' 
  | 'faculty' 
  | 'student' 
  | 'industry' 
  | 'csr_org'
  | 'admin';

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  organization_id?: string;
  organization_name?: string;
  designation?: string;
  district?: string;
  avatar?: string;
  created_at: string;
}

export type ChallengeStatus = 
  | 'SUBMITTED'
  | 'AI_SCREENED'
  | 'VALIDATION_PENDING'
  | 'VALIDATED'
  | 'REJECTED'
  | 'NEEDS_INFORMATION'
  | 'MATCHED'
  | 'IN_PROJECT'
  | 'SOLVED';

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

export interface ChallengeMedia {
  id: string;
  challenge_id: string;
  type: 'image' | 'video' | 'document' | 'audio';
  url: string;
  caption?: string;
}

export interface PriorityBreakdown {
  total: number;
  population_score: number;
  urgency_score: number;
  recurrence_score: number;
  evidence_score: number;
  geo_spread_score: number;
  validation_bonus: number;
  explanation: string;
}

export interface AIAnalysis {
  id: string;
  challenge_id: string;
  summary: string;
  problem_statement: string;
  primary_domain: string;
  secondary_domain: string;
  sub_domain: string;
  required_skills: string[];
  suggested_technologies: string[];
  sdg_goals: string[];
  confidence_score: number;
  is_demo_mode: boolean;
  pipeline_steps: {
    language_understood: boolean;
    domain_identified: boolean;
    duplicates_checked: boolean;
    priority_calculated: boolean;
    skills_extracted: boolean;
    institutions_matched: boolean;
  };
  embedding?: number[];
  created_at: string;
}

export interface Challenge {
  id: string;
  citizen_id: string;
  citizen_name?: string;
  citizen_phone?: string;
  title: string;
  description: string;
  primary_domain: string;
  secondary_domain?: string;
  sub_domain?: string;
  district: string;
  block: string;
  village_locality: string;
  latitude: number;
  longitude: number;
  affected_population: number;
  urgency: UrgencyLevel;
  status: ChallengeStatus;
  priority_score: number;
  cluster_id?: string;
  media?: ChallengeMedia[];
  ai_analysis?: AIAnalysis;
  priority_breakdown?: PriorityBreakdown;
  created_at: string;
  updated_at: string;
}

export interface ChallengeCluster {
  id: string;
  cluster_title: string;
  primary_domain: string;
  district: string;
  report_count: number;
  affected_population: number;
  severity: 'moderate' | 'high' | 'severe' | 'critical';
  centroid_lat: number;
  centroid_lng: number;
  related_challenge_ids: string[];
  description: string;
  status: 'ACTIVE' | 'ASSIGNED' | 'IN_DEVELOPMENT' | 'RESOLVED';
  associated_project_ids: string[];
  created_at: string;
}

export interface UniversityMatchExplanation {
  match_score: number;
  domain_score: number;
  faculty_score: number;
  lab_score: number;
  geography_score: number;
  previous_work_score: number;
  availability_score: number;
  reason: string;
}

export interface UniversityMatch {
  id: string;
  challenge_id: string;
  university_id: string;
  university_name: string;
  university_district: string;
  match_score: number;
  breakdown: UniversityMatchExplanation;
  status: 'RECOMMENDED' | 'ACCEPTED' | 'DECLINED';
  created_at: string;
}

export interface University {
  id: string;
  name: string;
  short_code: string;
  type: 'Central' | 'State' | 'National Importance' | 'Private';
  district: string;
  address: string;
  website: string;
  departments: string[];
  research_domains: string[];
  laboratories: string[];
  faculty_count: number;
  active_projects: number;
  capacity_score: number;
  verification_date: string;
}

export interface Faculty {
  id: string;
  user_id: string;
  university_id: string;
  university_name: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  research_expertise: string[];
  laboratories: string[];
  active_mentorships: number;
  published_papers: number;
}

export type IRLStage = 
  | 'IRL-1'
  | 'IRL-2'
  | 'IRL-3'
  | 'IRL-4'
  | 'IRL-5'
  | 'IRL-6'
  | 'IRL-7'
  | 'IRL-8';

export type ProjectStatus = 
  | 'PROPOSAL'
  | 'PROTOTYPE'
  | 'LAB_TESTING'
  | 'PILOT'
  | 'FIELD_VALIDATION'
  | 'DEPLOYMENT'
  | 'IMPACT_MEASUREMENT'
  | 'COMPLETED';

export interface Project {
  id: string;
  challenge_id: string;
  cluster_id?: string;
  title: string;
  description: string;
  university_id: string;
  university_name: string;
  lead_faculty_id: string;
  lead_faculty_name: string;
  status: ProjectStatus;
  irl_level: IRLStage;
  irl_progress_pct: number;
  budget_allocated: number;
  start_date: string;
  target_completion_date: string;
  repository_url?: string;
  cad_firmware_url?: string;
  demo_video_url?: string;
  reusable_in_districts?: string[];
  created_at: string;
  updated_at: string;
}

export interface ProjectTeamMember {
  id: string;
  project_id: string;
  user_id: string;
  name: string;
  email: string;
  role: 'faculty_mentor' | 'student_lead' | 'student_member' | 'industry_advisor';
  department: string;
  skills: string[];
}

export interface ProjectMilestone {
  id: string;
  project_id: string;
  title: string;
  description: string;
  target_irl: IRLStage;
  due_date: string;
  status: 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REVISION_REQUESTED';
  submission_evidence?: string;
  mentor_feedback?: string;
  approved_by?: string;
  approved_at?: string;
}

export interface ProjectTask {
  id: string;
  project_id: string;
  title: string;
  assigned_to_id: string;
  assigned_to_name: string;
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  priority: 'low' | 'medium' | 'high';
  due_date: string;
}

export interface ProjectComment {
  id: string;
  project_id: string;
  user_id: string;
  user_name: string;
  user_role: UserRole;
  message: string;
  created_at: string;
}

export interface Industry {
  id: string;
  name: string;
  sector: string;
  csr_focus_domains: string[];
  district: string;
  contact_person: string;
  contact_email: string;
  annual_csr_budget_cr: number;
  verified: boolean;
}

export interface IndustryCollaboration {
  id: string;
  project_id: string;
  project_title: string;
  industry_id: string;
  industry_name: string;
  collaboration_type: string;
  amount_inr?: number;
  description: string;
  status: string;
  created_at: string;
}

export interface ImpactRecord {
  id: string;
  project_id: string;
  challenge_id?: string;
  metric_name: string;
  predicted_value: number;
  verified_value: number;
  unit: string;
  verified_by: string;
  verification_date: string;
  notes: string;
}

export interface Notification {
  id: string;
  user_id: string;
  role_target?: UserRole;
  title: string;
  message: string;
  link: string;
  is_read: boolean;
  type: 'info' | 'success' | 'warning' | 'alert';
  created_at: string;
}
