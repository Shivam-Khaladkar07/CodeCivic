import axios from 'axios';
import { safeStorage } from '../utils/storage';
import {
  User,
  Challenge,
  ChallengeCluster,
  University,
  Project,
  Industry,
  Notification,
} from '../types';

export class ApiUnavailableError extends Error {
  constructor(message = 'CivicForge backend is currently unavailable or returning an invalid response.') {
    super(message);
    this.name = 'ApiUnavailableError';
  }
}

// Resolve API base URL: prioritize VITE_API_URL from environment, fallback to '/api' for Vite dev proxy
const resolveApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) {
    return '/api';
  }
  const trimmed = envUrl.trim().replace(/\/+$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

const api = axios.create({
  baseURL: resolveApiBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to attach auth token using safeStorage
api.interceptors.request.use((config) => {
  const token = safeStorage.getItem('jsix_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercept responses: strictly reject HTML SPA fallback responses, timeouts, and connection drops
api.interceptors.response.use(
  (response) => {
    const contentType = response.headers ? (response.headers['content-type'] || response.headers['Content-Type'] || '') : '';
    const isHtmlContent = typeof contentType === 'string' && contentType.toLowerCase().includes('text/html');
    const isHtmlBody =
      typeof response.data === 'string' &&
      (response.data.includes('<!DOCTYPE html>') ||
        response.data.includes('<html') ||
        response.data.includes('<div id="root">') ||
        response.data.includes('<head>'));

    if (isHtmlContent || isHtmlBody) {
      return Promise.reject(
        new ApiUnavailableError('Received HTML SPA fallback instead of JSON API response from server.')
      );
    }
    return response;
  },
  (error) => {
    if (!error.response || error.code === 'ECONNABORTED' || (error.message && error.message.includes('Network Error'))) {
      return Promise.reject(
        new ApiUnavailableError(error.message || 'CivicForge backend API is currently unreachable.')
      );
    }
    return Promise.reject(error);
  }
);

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
  create: (data: { cluster_title: string; primary_domain: string; district: string; challenge_ids?: string[]; description?: string; severity?: string }) =>
    api.post<{ message: string; cluster: ChallengeCluster }>('/clusters', data),
  addChallenge: (clusterId: string, challengeId: string) =>
    api.post<{ message: string; cluster: ChallengeCluster }>(`/clusters/${clusterId}/challenges`, { challenge_id: challengeId }),
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
  submitMilestoneEvidence: (projectId: string, milestoneId: string, data: { submission_evidence: string; notes?: string }) =>
    api.put(`/projects/${projectId}/milestones/${milestoneId}/submit`, data),
  createMilestone: (projectId: string, data: any) => api.post(`/projects/${projectId}/milestones`, data),
  createTask: (projectId: string, data: any) => api.post(`/projects/${projectId}/tasks`, data),
  updateTask: (projectId: string, taskId: string, data: any) => api.put(`/projects/${projectId}/tasks/${taskId}`, data),
  addComment: (projectId: string, message: string) => api.post(`/projects/${projectId}/comments`, { message }),
  addTeamMember: (projectId: string, data: { name: string; email?: string; role: string; department?: string; skills?: string[] }) =>
    api.post<{ message: string; member: any }>(`/projects/${projectId}/team`, data),
  removeTeamMember: (projectId: string, memberId: string) =>
    api.delete<{ message: string }>(`/projects/${projectId}/team/${memberId}`),
  addCollaboration: (projectId: string, data: { industry_id?: string; collaboration_type: string; amount_inr?: number; description?: string }) =>
    api.post<{ message: string; collaboration: any }>(`/projects/${projectId}/collaborations`, data),
  addImpactRecord: (projectId: string, data: { metric_name: string; predicted_value?: number; verified_value: number; unit?: string; verified_by?: string; notes?: string }) =>
    api.post<{ message: string; impact_record: any }>(`/projects/${projectId}/impact`, data),
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
