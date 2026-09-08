import axios from 'axios';
import {
  User,
  Challenge,
  ChallengeCluster,
  University,
  Project,
  Industry,
  Notification,
} from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to attach auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jsix_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: (email: string, password: string) => api.post<{ token: string; user: User }>('/auth/login', { email, password }),
  register: (data: Partial<User> & { password: string }) => api.post<{ token: string; user: User }>('/auth/register', data),
  getMe: () => api.get<{ user: User }>('/auth/me'),
  getDemoAccounts: () => api.get<Array<{ role: string; email: string; name: string; org: string }>>('/auth/demo-accounts'),
};

export const challengesApi = {
  getAll: (params?: Record<string, any>) => api.get<{ total: number; page: number; limit: number; challenges: Challenge[] }>('/challenges', { params }),
  getById: (id: string) => api.get<Challenge>(`/challenges/${id}`),
  create: (data: any) => api.post<{ challenge: Challenge; ai_analysis: any; priority_breakdown: any; duplicates: any[] }>('/challenges', data),
  update: (id: string, data: any) => api.put<Challenge>(`/challenges/${id}`, data),
  validate: (id: string, data: { decision: string; notes?: string; department_assigned?: string }) =>
    api.post<{ message: string; challenge: Challenge; validation: any }>(`/challenges/${id}/validate`, data),
  getSimilar: (id: string) => api.get<{ challenge_id: string; similar_count: number; candidates: any[] }>(`/challenges/${id}/similar`),
  getMatches: (id: string) => api.get<{ challenge_id: string; matches: any[]; recommended_industries: any[] }>(`/challenges/${id}/matches`),
};

export const clustersApi = {
  getAll: () => api.get<ChallengeCluster[]>('/clusters'),
  getById: (id: string) => api.get<{ cluster: ChallengeCluster; related_challenges: Challenge[]; associated_projects: Project[] }>(`/clusters/${id}`),
};

export const universitiesApi = {
  getAll: (district?: string) => api.get<University[]>('/universities', { params: { district } }),
  getById: (id: string) => api.get<{ university: University; faculty: any[]; projects: Project[] }>(`/universities/${id}`),
  acceptChallenge: (uniId: string, data: { challenge_id: string; lead_faculty_id?: string; project_title?: string; budget?: number }) =>
    api.post<{ message: string; project: Project }>(`/universities/${uniId}/accept`, data),
};

export const projectsApi = {
  getAll: (params?: Record<string, any>) => api.get<Project[]>('/projects', { params }),
  getById: (id: string) => api.get<{
    project: Project;
    challenge: Challenge;
    team: any[];
    milestones: any[];
    tasks: any[];
    comments: any[];
    collaborations: any[];
    impact: any[];
  }>(`/projects/${id}`),
  updateMilestone: (projectId: string, milestoneId: string, data: { status: string; mentor_feedback?: string; submission_evidence?: string }) =>
    api.put(`/projects/${projectId}/milestones/${milestoneId}`, data),
  createMilestone: (projectId: string, data: any) => api.post(`/projects/${projectId}/milestones`, data),
  createTask: (projectId: string, data: any) => api.post(`/projects/${projectId}/tasks`, data),
  updateTask: (projectId: string, taskId: string, data: any) => api.put(`/projects/${projectId}/tasks/${taskId}`, data),
  addComment: (projectId: string, message: string) => api.post(`/projects/${projectId}/comments`, { message }),
};

export const industriesApi = {
  getAll: () => api.get<Industry[]>('/industries'),
  expressInterest: (industryId: string, data: { project_id: string; collaboration_type: string; amount_inr?: number; description?: string }) =>
    api.post(`/industries/${industryId}/interests`, data),
};

export const dashboardsApi = {
  getGovernment: () => api.get<{
    kpis: any;
    attention_required: { high_priority_unvalidated: Challenge[]; critical_clusters: ChallengeCluster[] };
    charts: { domain_distribution: any[]; district_distribution: any[]; irl_distribution: any[] };
  }>('/dashboard/government'),
  getUniversity: () => api.get<{
    university: University;
    kpis: any;
    projects: Project[];
    recommendations: any[];
  }>('/dashboard/university'),
  getImpact: () => api.get<{
    outputs: any;
    impact_records: any[];
    reuse_cases: any[];
  }>('/analytics/impact'),
};

export const adminApi = {
  getSettings: () => api.get<any>('/admin/settings'),
  updateSettings: (data: any) => api.put('/admin/settings', data),
  getAudit: () => api.get<any[]>('/admin/audit'),
};

export const notificationsApi = {
  getAll: () => api.get<Notification[]>('/notifications'),
  markRead: (id: string) => api.put(`/notifications/${id}/read`),
};

export default api;
