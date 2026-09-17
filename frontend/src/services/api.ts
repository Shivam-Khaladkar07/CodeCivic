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

import { readToken } from '../utils/storage';

/**
 * Error raised whenever the backend cannot be reached or did not answer with
 * real API data. Callers can branch on `isApiUnavailable(err)` to render an
 * offline/demo state instead of treating the failure as fatal.
 */
export class ApiUnavailableError extends Error {
  readonly isApiUnavailable = true;
  readonly reason: 'not-configured' | 'html-fallback' | 'network' | 'server';

  constructor(message: string, reason: ApiUnavailableError['reason']) {
    super(message);
    this.name = 'ApiUnavailableError';
    this.reason = reason;
  }
}

export const isApiUnavailable = (err: unknown): boolean =>
  Boolean(err && typeof err === 'object' && (err as { isApiUnavailable?: boolean }).isApiUnavailable);

// Resolve API base URL: prioritize VITE_API_URL from environment, fallback to '/api' for Vite dev proxy
const resolveApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) {
    return '/api';
  }
  const trimmed = String(envUrl).trim().replace(/\/+$/, '');
  if (!trimmed) {
    return '/api';
  }
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

/** True when VITE_API_URL points at an explicit backend origin. */
export const isApiConfigured = Boolean(String(import.meta.env.VITE_API_URL || '').trim());

export const API_BASE_URL = resolveApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  // Never hang forever when the backend host is unreachable or blackholes the request.
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to attach auth token
api.interceptors.request.use((config) => {
  const token = readToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const looksLikeHtml = (value: unknown): boolean =>
  typeof value === 'string' && /^\s*(?:<!doctype html|<html)/i.test(value);

/**
 * Guard against a "successful" response that is not actually API data.
 *
 * On static hosting the SPA fallback rewrite answers every unmatched path —
 * including `/api/*` — with `index.html` at HTTP 200. Axios treats that as a
 * success, so callers would assign an HTML string (or `undefined` after
 * reading a field off it) into state and crash on the next render. Treating a
 * non-JSON body as a failure keeps those responses in the `catch` branch.
 */
api.interceptors.response.use(
  (response) => {
    const contentType = String(
      (response.headers as Record<string, unknown> | undefined)?.['content-type'] ?? ''
    ).toLowerCase();

    if (contentType.includes('text/html') || looksLikeHtml(response.data)) {
      throw new ApiUnavailableError(
        'Backend API is not reachable: received an HTML document instead of JSON. ' +
          'Set VITE_API_URL to the deployed backend origin.',
        'html-fallback'
      );
    }

    return response;
  },
  (error) => {
    if (isApiUnavailable(error)) {
      return Promise.reject(error);
    }

    // No response at all: DNS failure, connection refused, CORS block, timeout.
    if (!(error as { response?: unknown })?.response) {
      return Promise.reject(
        new ApiUnavailableError(
          (error as Error)?.message || 'Backend API is not reachable.',
          'network'
        )
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
