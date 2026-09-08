import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from '../database/db.js';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth.js';
import { AIService } from '../services/aiService.js';
import { MatchingService } from '../services/matchingService.js';
import { ClusteringService } from '../services/clusteringService.js';
import {
  Challenge,
  ChallengeValidation,
  User,
  Project,
  ProjectMilestone,
  ProjectTask,
  ProjectComment,
  IndustryCollaboration,
  SystemSettings,
  IRLStage,
} from '../models/types.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'jsix_super_secret_jwt_token_key_2026_sih';

// ==========================================
// 1. AUTHENTICATION & PROFILE
// ==========================================

router.post('/auth/register', async (req: Request, res: Response) => {
  try {
    const { email, password, full_name, phone, role, district, organization_name, designation } = req.body;
    if (!email || !password || !full_name) {
      return res.status(400).json({ error: 'Email, password, and full name are required' });
    }

    const existing = db.findOne('users', (u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser: User = {
      id: `USER-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      email: email.toLowerCase(),
      password_hash,
      full_name,
      phone,
      role: role || 'citizen',
      district: district || 'Ranchi',
      organization_name,
      designation,
      created_at: new Date().toISOString(),
    };

    db.insert('users', newUser);
    db.logAudit(newUser.id, newUser.full_name, newUser.role, 'REGISTER', 'USER', newUser.id, 'Registered new account');

    const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    const { password_hash: _, ...safeUser } = newUser;
    return res.status(201).json({ token, user: safeUser });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Registration failed' });
  }
});

router.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = db.findOne('users', (u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    db.logAudit(user.id, user.full_name, user.role, 'LOGIN', 'USER', user.id, 'User logged in successfully');
    const { password_hash: _, ...safeUser } = user;
    return res.json({ token, user: safeUser });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Login failed' });
  }
});

router.get('/auth/me', authenticateToken, (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  const { password_hash, ...safeUser } = req.user;
  return res.json({ user: safeUser });
});

// Demo account quick switch endpoint for seamless presentation
router.get('/auth/demo-accounts', (req: Request, res: Response) => {
  const demoUsers = [
    { role: 'citizen', email: 'citizen@demo.in', name: 'Ramesh Kumar Mahto', org: 'Citizen / Farmer (Kanke)' },
    { role: 'government', email: 'government@demo.in', name: 'Dr. Ananya Roy, IAS', org: 'Jharkhand State Planning & Innovation' },
    { role: 'university_admin', email: 'university@demo.in', name: 'Prof. Sudhir K. Sinha', org: 'Birsa Agricultural University (BAU)' },
    { role: 'faculty', email: 'faculty@demo.in', name: 'Dr. A. K. Sharma', org: 'BIT Mesra / BAU Lead Mentor' },
    { role: 'student', email: 'student@demo.in', name: 'Pooja Hansda', org: 'Student Innovation Team Lead' },
    { role: 'industry', email: 'industry@demo.in', name: 'Saurabh Roy', org: 'Tata Steel CSR Foundation' },
    { role: 'admin', email: 'admin@demo.in', name: 'System Administrator', org: 'J-SIX Governance & Audit' },
  ];
  return res.json(demoUsers);
});

// ==========================================
// 2. CHALLENGES & AI PIPELINE
// ==========================================

router.get('/challenges', (req: Request, res: Response) => {
  try {
    const { district, domain, urgency, status, cluster_id, search, limit = 50, page = 1 } = req.query;
    let list: Challenge[] = db.getTable('challenges');

    if (district) list = list.filter((c) => c.district.toLowerCase() === String(district).toLowerCase());
    if (domain) list = list.filter((c) => c.primary_domain.toLowerCase() === String(domain).toLowerCase());
    if (urgency) list = list.filter((c) => c.urgency.toLowerCase() === String(urgency).toLowerCase());
    if (status) list = list.filter((c) => c.status === String(status));
    if (cluster_id) list = list.filter((c) => c.cluster_id === String(cluster_id));
    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.district.toLowerCase().includes(q) ||
          c.primary_domain.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q)
      );
    }

    const total = list.length;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const start = (pageNum - 1) * limitNum;
    const paginated = list.slice(start, start + limitNum);

    return res.json({
      total,
      page: pageNum,
      limit: limitNum,
      challenges: paginated,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.post('/challenges', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const {
      title,
      description,
      district,
      block,
      village_locality,
      latitude,
      longitude,
      affected_population,
      urgency = 'high',
      media = [],
    } = req.body;

    if (!title || !description || !district) {
      return res.status(400).json({ error: 'Title, description, and district are required' });
    }

    // 1. Run 6-Step AI Processing Pipeline
    const settings = db.getTable('system_settings');
    const aiAnalysis = await AIService.analyzeChallenge(
      `${title} ${description}`,
      district,
      Number(affected_population) || 1000,
      urgency,
      settings
    );

    // 2. Calculate Explainable Priority Score
    const priorityBreakdown = AIService.calculatePriority(
      Number(affected_population) || 1000,
      urgency,
      1,
      media.length > 0,
      1,
      false,
      settings
    );

    const distCode = district.substring(0, 3).toUpperCase();
    const challengeCount = db.getTable('challenges').length + 1;
    const challengeId = `JH-${distCode}-${1000 + challengeCount}`;

    aiAnalysis.challenge_id = challengeId;

    const newChallenge: Challenge = {
      id: challengeId,
      citizen_id: user.id,
      citizen_name: user.full_name,
      citizen_phone: user.phone || '+91 94311 00000',
      title,
      description,
      primary_domain: aiAnalysis.primary_domain,
      secondary_domain: aiAnalysis.secondary_domain,
      sub_domain: aiAnalysis.sub_domain,
      district,
      block: block || `${district} Sadar`,
      village_locality: village_locality || 'Community Center',
      latitude: Number(latitude) || 23.3441,
      longitude: Number(longitude) || 85.3096,
      affected_population: Number(affected_population) || 1000,
      urgency,
      status: 'AI_SCREENED',
      priority_score: priorityBreakdown.total,
      priority_breakdown: priorityBreakdown,
      ai_analysis: aiAnalysis,
      media: media.map((m: any, idx: number) => ({
        id: `MED-${Date.now()}-${idx}`,
        challenge_id: challengeId,
        type: m.type || 'image',
        url: m.url || 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80',
        caption: m.caption || 'Ground photographic evidence',
      })),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // 3. Check for Semantic Duplicates & Suggest Cluster
    const allChallenges = db.getTable('challenges');
    const duplicates = AIService.findSimilarChallenges(newChallenge, allChallenges, 0.8);
    if (duplicates.length > 0 && duplicates[0].challenge.cluster_id) {
      newChallenge.cluster_id = duplicates[0].challenge.cluster_id;
    }

    db.insert('challenges', newChallenge);
    db.insert('ai_analysis', aiAnalysis);

    db.logAudit(
      user.id,
      user.full_name,
      user.role,
      'SUBMIT_CHALLENGE',
      'CHALLENGE',
      newChallenge.id,
      `Submitted challenge in ${district} (${newChallenge.primary_domain})`
    );

    // Notify government officers
    db.addNotification({
      user_id: 'USER-GOV-1',
      role_target: 'government',
      title: 'New Challenge Submitted & AI Screened',
      message: `Challenge #${newChallenge.id} from ${newChallenge.district} (${newChallenge.primary_domain}) requires validation.`,
      link: `/government/challenges`,
      type: 'info',
    });

    return res.status(201).json({
      challenge: newChallenge,
      ai_analysis: aiAnalysis,
      priority_breakdown: priorityBreakdown,
      duplicates,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.get('/challenges/:id', (req: Request, res: Response) => {
  const challenge = db.findOne('challenges', (c) => c.id === req.params.id);
  if (!challenge) {
    return res.status(404).json({ error: 'Challenge not found' });
  }
  return res.json(challenge);
});

router.put('/challenges/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  const challenge = db.findOne('challenges', (c) => c.id === req.params.id);
  if (!challenge) return res.status(404).json({ error: 'Challenge not found' });

  const updated = db.update('challenges', challenge.id, req.body);
  db.logAudit(req.user!.id, req.user!.full_name, req.user!.role, 'UPDATE_CHALLENGE', 'CHALLENGE', challenge.id, 'Updated details');
  return res.json(updated);
});

// Semantic duplicate detection endpoint
router.get('/challenges/:id/similar', (req: Request, res: Response) => {
  const challenge = db.findOne('challenges', (c) => c.id === req.params.id);
  if (!challenge) return res.status(404).json({ error: 'Challenge not found' });

  const allChallenges = db.getTable('challenges');
  const similar = AIService.findSimilarChallenges(challenge, allChallenges, 0.7);
  return res.json({
    challenge_id: challenge.id,
    similar_count: similar.length,
    candidates: similar,
  });
});

// University matching endpoint for a challenge
router.get('/challenges/:id/matches', (req: Request, res: Response) => {
  const challenge = db.findOne('challenges', (c) => c.id === req.params.id);
  if (!challenge) return res.status(404).json({ error: 'Challenge not found' });

  const universities = db.getTable('universities');
  const faculty = db.getTable('faculty');
  const settings = db.getTable('system_settings');

  const matches = MatchingService.rankUniversitiesForChallenge(challenge, universities, faculty, settings);
  const industries = MatchingService.recommendIndustriesForChallenge(challenge, db.getTable('industries'));

  return res.json({
    challenge_id: challenge.id,
    matches,
    recommended_industries: industries,
  });
});

// Government/Panchayat Validation Endpoint
router.post('/challenges/:id/validate', authenticateToken, requireRole(['government', 'panchayat_ulb', 'admin']), (req: AuthRequest, res: Response) => {
  const challenge = db.findOne('challenges', (c) => c.id === req.params.id);
  if (!challenge) return res.status(404).json({ error: 'Challenge not found' });

  const { decision, notes, department_assigned, is_sensitive = false } = req.body;
  if (!decision || !['VALIDATED', 'REJECTED', 'NEEDS_INFORMATION'].includes(decision)) {
    return res.status(400).json({ error: 'Valid decision (VALIDATED, REJECTED, NEEDS_INFORMATION) required' });
  }

  const validation: ChallengeValidation = {
    id: `VAL-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
    challenge_id: challenge.id,
    validator_id: req.user!.id,
    validator_name: req.user!.full_name,
    role: req.user!.role,
    decision,
    department_assigned,
    notes: notes || 'Verified with ground panchayat records',
    is_sensitive,
    created_at: new Date().toISOString(),
  };

  db.insert('challenge_validations', validation);

  const newStatus = decision === 'VALIDATED' ? 'VALIDATED' : decision === 'REJECTED' ? 'REJECTED' : 'NEEDS_INFORMATION';
  const updated = db.update('challenges', challenge.id, {
    status: newStatus,
    priority_score: Math.min(100, challenge.priority_score + (decision === 'VALIDATED' ? 5 : 0)),
  });

  db.logAudit(
    req.user!.id,
    req.user!.full_name,
    req.user!.role,
    'VALIDATE_CHALLENGE',
    'CHALLENGE',
    challenge.id,
    `Marked ${decision} by ${req.user!.full_name} (${notes})`
  );

  // Notify citizen
  db.addNotification({
    user_id: challenge.citizen_id,
    role_target: 'citizen',
    title: `Challenge Status: ${decision}`,
    message: `Your challenge #${challenge.id} has been marked as ${decision} by the administration.`,
    link: `/citizen/challenges/${challenge.id}`,
    type: decision === 'VALIDATED' ? 'success' : 'warning',
  });

  return res.json({ message: 'Validation recorded successfully', challenge: updated, validation });
});

// ==========================================
// 3. SYSTEMIC CHALLENGE CLUSTERS
// ==========================================

router.get('/clusters', (req: Request, res: Response) => {
  const clusters = db.getTable('challenge_clusters');
  return res.json(clusters);
});

router.get('/clusters/:id', (req: Request, res: Response) => {
  const cluster = db.findOne('challenge_clusters', (c) => c.id === req.params.id);
  if (!cluster) return res.status(404).json({ error: 'Cluster not found' });

  const challenges = db.find('challenges', (c) => c.cluster_id === cluster.id);
  const projects = db.find('projects', (p) => p.cluster_id === cluster.id);

  return res.json({
    cluster,
    related_challenges: challenges,
    associated_projects: projects,
  });
});

// ==========================================
// 4. UNIVERSITIES & FACULTY
// ==========================================

router.get('/universities', (req: Request, res: Response) => {
  const { district } = req.query;
  let list = db.getTable('universities');
  if (district) list = list.filter((u) => u.district.toLowerCase() === String(district).toLowerCase());
  return res.json(list);
});

router.get('/universities/:id', (req: Request, res: Response) => {
  const university = db.findOne('universities', (u) => u.id === req.params.id);
  if (!university) return res.status(404).json({ error: 'University not found' });

  const uniFaculty = db.find('faculty', (f) => f.university_id === university.id);
  const uniProjects = db.find('projects', (p) => p.university_id === university.id);

  return res.json({
    university,
    faculty: uniFaculty,
    projects: uniProjects,
  });
});

router.get('/faculty', (req: Request, res: Response) => {
  const { university_id, department } = req.query;
  let list = db.getTable('faculty');
  if (university_id) list = list.filter((f) => f.university_id === university_id);
  if (department) list = list.filter((f) => f.department.toLowerCase().includes(String(department).toLowerCase()));
  return res.json(list);
});

// University accepts challenge and spawns project
router.post('/universities/:id/accept', authenticateToken, requireRole(['university_admin', 'faculty', 'admin']), (req: AuthRequest, res: Response) => {
  const university = db.findOne('universities', (u) => u.id === req.params.id);
  if (!university) return res.status(404).json({ error: 'University not found' });

  const { challenge_id, lead_faculty_id, project_title, budget = 250000 } = req.body;
  const challenge = db.findOne('challenges', (c) => c.id === challenge_id);
  if (!challenge) return res.status(404).json({ error: 'Challenge not found' });

  const facultyMember = db.findOne('faculty', (f) => f.id === lead_faculty_id) || db.getTable('faculty')[0];

  const projectId = `PROJ-JH-${Date.now().toString().slice(-4)}`;
  const newProject: Project = {
    id: projectId,
    challenge_id: challenge.id,
    cluster_id: challenge.cluster_id,
    title: project_title || `Innovative Engineering Solution for ${challenge.title}`,
    description: `University-led multidisciplinary R&D project addressing ${challenge.primary_domain} challenge #${challenge.id} in ${challenge.district}.`,
    university_id: university.id,
    university_name: university.name,
    lead_faculty_id: facultyMember.id,
    lead_faculty_name: facultyMember.name,
    status: 'PROPOSAL',
    irl_level: 'IRL-1',
    irl_progress_pct: 15,
    budget_allocated: Number(budget),
    start_date: new Date().toISOString().split('T')[0],
    target_completion_date: new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0],
    reusable_in_districts: ['Dumka', 'Hazaribagh'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  db.insert('projects', newProject);

  // Update challenge status
  db.update('challenges', challenge.id, { status: 'IN_PROJECT' });

  // Add initial milestone
  const m1: ProjectMilestone = {
    id: `MILE-${Date.now()}-1`,
    project_id: newProject.id,
    title: 'IRL-1: Ground Validation & Technical Feasibility Report',
    description: 'Field visit to affected site, stakeholder consultation, and baseline data profiling.',
    target_irl: 'IRL-1',
    due_date: new Date(Date.now() + 21 * 86400000).toISOString().split('T')[0],
    status: 'PENDING',
  };
  db.insert('project_milestones', m1);

  // Add lead faculty to team
  db.insert('project_team_members', {
    id: `TM-${Date.now()}-1`,
    project_id: newProject.id,
    user_id: facultyMember.user_id,
    name: facultyMember.name,
    email: facultyMember.email,
    role: 'faculty_mentor',
    department: facultyMember.department,
    skills: facultyMember.research_expertise,
  });

  db.logAudit(
    req.user!.id,
    req.user!.full_name,
    req.user!.role,
    'ACCEPT_CHALLENGE',
    'PROJECT',
    newProject.id,
    `${university.name} accepted challenge #${challenge.id}`
  );

  // Notify stakeholders
  db.addNotification({
    user_id: challenge.citizen_id,
    role_target: 'citizen',
    title: 'University Team Assigned to Your Challenge!',
    message: `${university.name} has officially accepted challenge #${challenge.id} and begun solution development.`,
    link: `/citizen/challenges/${challenge.id}`,
    type: 'success',
  });

  return res.status(201).json({ message: 'Challenge accepted and project initialized', project: newProject });
});

// ==========================================
// 5. PROJECTS & WORKSPACE
// ==========================================

router.get('/projects', (req: Request, res: Response) => {
  const { status, irl_level, university_id, search } = req.query;
  let list = db.getTable('projects');

  if (status) list = list.filter((p) => p.status === status);
  if (irl_level) list = list.filter((p) => p.irl_level === irl_level);
  if (university_id) list = list.filter((p) => p.university_id === university_id);
  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.university_name.toLowerCase().includes(q) ||
        p.lead_faculty_name.toLowerCase().includes(q)
    );
  }

  return res.json(list);
});

router.get('/projects/:id', (req: Request, res: Response) => {
  const project = db.findOne('projects', (p) => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });

  const challenge = db.findOne('challenges', (c) => c.id === project.challenge_id);
  const team = db.find('project_team_members', (tm) => tm.project_id === project.id);
  const milestones = db.find('project_milestones', (m) => m.project_id === project.id);
  const tasks = db.find('project_tasks', (t) => t.project_id === project.id);
  const comments = db.find('project_comments', (cm) => cm.project_id === project.id);
  const collaborations = db.find('industry_collaborations', (ic) => ic.project_id === project.id);
  const impact = db.find('impact_records', (ir) => ir.project_id === project.id);

  return res.json({
    project,
    challenge,
    team,
    milestones,
    tasks,
    comments,
    collaborations,
    impact,
  });
});

// Advance IRL and update milestone status
router.put('/projects/:id/milestones/:mId', authenticateToken, requireRole(['faculty', 'university_admin', 'admin']), (req: AuthRequest, res: Response) => {
  const project = db.findOne('projects', (p) => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });

  const milestone = db.findOne('project_milestones', (m) => m.id === req.params.mId);
  if (!milestone) return res.status(404).json({ error: 'Milestone not found' });

  const { status, mentor_feedback, submission_evidence } = req.body;
  const updatedMilestone = db.update('project_milestones', milestone.id, {
    status,
    mentor_feedback: mentor_feedback || milestone.mentor_feedback,
    submission_evidence: submission_evidence || milestone.submission_evidence,
    approved_by: req.user!.full_name,
    approved_at: new Date().toISOString(),
  });

  // If milestone approved, calculate new IRL level
  if (status === 'APPROVED') {
    const irlIndex = Number(milestone.target_irl.replace('IRL-', ''));
    const nextIrlIndex = Math.min(8, Math.max(Number(project.irl_level.replace('IRL-', '')), irlIndex));
    const nextIrl = `IRL-${nextIrlIndex}` as IRLStage;
    
    let nextStatus = project.status;
    if (nextIrlIndex >= 7) nextStatus = 'DEPLOYMENT';
    else if (nextIrlIndex >= 5) nextStatus = 'PILOT';
    else if (nextIrlIndex >= 4) nextStatus = 'LAB_TESTING';
    else if (nextIrlIndex >= 3) nextStatus = 'PROTOTYPE';

    db.update('projects', project.id, {
      irl_level: nextIrl,
      irl_progress_pct: Math.min(100, Math.round((nextIrlIndex / 8) * 100)),
      status: nextStatus,
    });
  }

  db.logAudit(
    req.user!.id,
    req.user!.full_name,
    req.user!.role,
    'UPDATE_MILESTONE',
    'PROJECT',
    project.id,
    `Milestone "${milestone.title}" set to ${status}`
  );

  return res.json({ message: 'Milestone updated', milestone: updatedMilestone });
});

router.post('/projects/:id/milestones', authenticateToken, requireRole(['faculty', 'university_admin', 'student', 'admin']), (req: AuthRequest, res: Response) => {
  const { title, description, target_irl, due_date } = req.body;
  const m: ProjectMilestone = {
    id: `MILE-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
    project_id: req.params.id,
    title,
    description,
    target_irl: target_irl || 'IRL-2',
    due_date: due_date || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    status: 'PENDING',
  };
  db.insert('project_milestones', m);
  return res.status(201).json(m);
});

router.post('/projects/:id/tasks', authenticateToken, (req: AuthRequest, res: Response) => {
  const { title, assigned_to_id, assigned_to_name, priority = 'medium', due_date } = req.body;
  const task: ProjectTask = {
    id: `TASK-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
    project_id: req.params.id,
    title,
    assigned_to_id: assigned_to_id || req.user!.id,
    assigned_to_name: assigned_to_name || req.user!.full_name,
    status: 'TODO',
    priority,
    due_date: due_date || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
  };
  db.insert('project_tasks', task);
  return res.status(201).json(task);
});

router.put('/projects/:id/tasks/:tId', authenticateToken, (req: AuthRequest, res: Response) => {
  const updated = db.update('project_tasks', req.params.tId, req.body);
  if (!updated) return res.status(404).json({ error: 'Task not found' });
  return res.json(updated);
});

router.post('/projects/:id/comments', authenticateToken, (req: AuthRequest, res: Response) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message content is required' });

  const comment: ProjectComment = {
    id: `COMM-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
    project_id: req.params.id,
    user_id: req.user!.id,
    user_name: req.user!.full_name,
    user_role: req.user!.role,
    message,
    created_at: new Date().toISOString(),
  };

  db.insert('project_comments', comment);
  return res.status(201).json(comment);
});

// ==========================================
// 6. INDUSTRY & CSR COLLABORATIONS
// ==========================================

router.get('/industries', (req: Request, res: Response) => {
  const list = db.getTable('industries');
  return res.json(list);
});

router.post('/industries/:id/interests', authenticateToken, requireRole(['industry', 'csr_org', 'admin']), (req: AuthRequest, res: Response) => {
  const industry = db.findOne('industries', (i) => i.id === req.params.id) || db.getTable('industries')[0];
  const { project_id, collaboration_type, amount_inr, description } = req.body;

  const project = db.findOne('projects', (p) => p.id === project_id);
  if (!project) return res.status(404).json({ error: 'Project not found' });

  const collab: IndustryCollaboration = {
    id: `IC-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
    project_id: project.id,
    project_title: project.title,
    industry_id: industry.id,
    industry_name: industry.name,
    collaboration_type: collaboration_type || 'Offer Funding',
    amount_inr: Number(amount_inr) || 200000,
    description: description || 'Industry commitment to sponsor prototype development and testing.',
    status: 'ACTIVE',
    created_at: new Date().toISOString(),
  };

  db.insert('industry_collaborations', collab);
  db.logAudit(
    req.user!.id,
    req.user!.full_name,
    req.user!.role,
    'INDUSTRY_COLLABORATION',
    'PROJECT',
    project.id,
    `${industry.name} offered ${collab.collaboration_type} of ₹${collab.amount_inr?.toLocaleString()}`
  );

  // Notify lead faculty and student
  db.addNotification({
    user_id: project.lead_faculty_id,
    role_target: 'faculty',
    title: 'Industry Partner Committed Funding & Support!',
    message: `${industry.name} offered ${collab.collaboration_type} (₹${collab.amount_inr?.toLocaleString()}) for "${project.title}".`,
    link: `/projects/${project.id}`,
    type: 'success',
  });

  return res.status(201).json({ message: 'Collaboration recorded successfully', collaboration: collab });
});

// ==========================================
// 7. EXECUTIVE & ROLE DASHBOARDS
// ==========================================

// Government Executive Decision Intelligence Dashboard
router.get('/dashboard/government', (req: Request, res: Response) => {
  const challenges = db.getTable('challenges');
  const clusters = db.getTable('challenge_clusters');
  const projects = db.getTable('projects');
  const universities = db.getTable('universities');
  const industries = db.getTable('industries');
  const impactRecords = db.getTable('impact_records');

  // KPI calculations
  const totalChallenges = challenges.length;
  const validatedChallenges = challenges.filter((c) => c.status === 'VALIDATED' || c.status === 'IN_PROJECT' || c.status === 'SOLVED').length;
  const unvalidatedCount = challenges.filter((c) => c.status === 'SUBMITTED' || c.status === 'AI_SCREENED' || c.status === 'VALIDATION_PENDING').length;
  const activeProjects = projects.filter((p) => p.status !== 'COMPLETED').length;
  const prototypesCount = projects.filter((p) => p.irl_level === 'IRL-3' || p.irl_level === 'IRL-4').length;
  const pilotsCount = projects.filter((p) => p.irl_level === 'IRL-5' || p.irl_level === 'IRL-6').length;
  const deploymentsCount = projects.filter((p) => p.irl_level === 'IRL-7' || p.irl_level === 'IRL-8').length;

  // Domain breakdown
  const domainCounts: Record<string, number> = {};
  challenges.forEach((c) => {
    domainCounts[c.primary_domain] = (domainCounts[c.primary_domain] || 0) + 1;
  });

  // District breakdown
  const districtCounts: Record<string, number> = {};
  challenges.forEach((c) => {
    districtCounts[c.district] = (districtCounts[c.district] || 0) + 1;
  });

  // IRL distribution
  const irlDistribution: Record<string, number> = {};
  projects.forEach((p) => {
    irlDistribution[p.irl_level] = (irlDistribution[p.irl_level] || 0) + 1;
  });

  // "What Requires Attention?" Decision Intelligence
  const highPriorityUnvalidated = challenges
    .filter((c) => (c.status === 'SUBMITTED' || c.status === 'AI_SCREENED') && c.priority_score >= 80)
    .slice(0, 5);

  const criticalClusters = clusters.filter((cl) => cl.severity === 'critical' || cl.severity === 'severe').slice(0, 4);

  // Total impact aggregation
  const totalPeopleBenefited = impactRecords
    .filter((r) => r.metric_name.toLowerCase().includes('farmer') || r.metric_name.toLowerCase().includes('people'))
    .reduce((sum, r) => sum + r.verified_value, 0);

  return res.json({
    kpis: {
      total_challenges: totalChallenges,
      validated_challenges: validatedChallenges,
      unvalidated_pending: unvalidatedCount,
      challenge_clusters: clusters.length,
      active_projects: activeProjects,
      participating_heis: universities.length,
      industry_partners: industries.length,
      prototypes_built: prototypesCount,
      pilots_deployed: pilotsCount,
      scaled_deployments: deploymentsCount,
      communities_benefited: totalPeopleBenefited || 18500,
    },
    attention_required: {
      high_priority_unvalidated: highPriorityUnvalidated,
      critical_clusters: criticalClusters,
    },
    charts: {
      domain_distribution: Object.entries(domainCounts).map(([name, value]) => ({ name, value })),
      district_distribution: Object.entries(districtCounts).map(([name, value]) => ({ name, value })).slice(0, 10),
      irl_distribution: Object.entries(irlDistribution).map(([name, value]) => ({ name, value })),
    },
  });
});

// University Dashboard
router.get('/dashboard/university', authenticateToken, (req: AuthRequest, res: Response) => {
  const user = req.user!;
  const uniId = user.organization_id || 'UNI-BAU';
  const university = db.findOne('universities', (u) => u.id === uniId) || db.getTable('universities')[0];
  const allProjects = db.getTable('projects');
  const uniProjects = allProjects.filter((p) => p.university_id === university.id);
  const faculty = db.find('faculty', (f) => f.university_id === university.id);

  // Suggested matches for this university
  const challenges = db.getTable('challenges').filter((c) => c.status === 'VALIDATED');
  const settings = db.getTable('system_settings');
  const recommendations = challenges
    .map((ch) => {
      const match = MatchingService.matchUniversity(ch, university, faculty, settings);
      return { challenge: ch, ...match };
    })
    .filter((m) => m.score >= 75)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  return res.json({
    university,
    kpis: {
      active_projects: uniProjects.length,
      faculty_mentors: faculty.length,
      prototypes_in_lab: uniProjects.filter((p) => p.irl_level === 'IRL-3' || p.irl_level === 'IRL-4').length,
      field_pilots: uniProjects.filter((p) => p.irl_level === 'IRL-5' || p.irl_level === 'IRL-6').length,
    },
    projects: uniProjects,
    recommendations,
  });
});

// Impact Analytics
router.get('/analytics/impact', (req: Request, res: Response) => {
  const records = db.getTable('impact_records');
  const projects = db.getTable('projects');

  const outputs = {
    challenges_received: db.getTable('challenges').length,
    projects_initiated: projects.length,
    prototypes_built: projects.filter((p) => Number(p.irl_level.replace('IRL-', '')) >= 3).length,
    community_pilots: projects.filter((p) => Number(p.irl_level.replace('IRL-', '')) >= 5).length,
    full_deployments: projects.filter((p) => Number(p.irl_level.replace('IRL-', '')) >= 7).length,
  };

  return res.json({
    outputs,
    impact_records: records,
    reuse_cases: [
      {
        solution_title: 'Smart Solar-Grid Hybrid VFD Controller',
        origin_district: 'Ranchi',
        reusable_in: ['Dumka', 'Hazaribagh', 'Deoghar', 'Palamu'],
        readiness: 'IRL-5 Community Pilot',
        benefit: 'Prevents 100% pump tripping and saves ₹3.4L/village annually in diesel replacement costs.',
      },
      {
        solution_title: 'Low-Cost Alumina Arsenic & Fluoride Filter',
        origin_district: 'Dhanbad',
        reusable_in: ['Palamu', 'Garhwa', 'Chatra'],
        readiness: 'IRL-6 Field Validated',
        benefit: 'Reduces heavy metal fluoride from 3.2 mg/L down to <0.8 mg/L without power grid requirement.',
      },
    ],
  });
});

// ==========================================
// 8. SYSTEM CONFIGURATION & AUDIT (ADMIN)
// ==========================================

router.get('/admin/settings', authenticateToken, requireRole(['admin']), (req: AuthRequest, res: Response) => {
  return res.json(db.getTable('system_settings'));
});

router.put('/admin/settings', authenticateToken, requireRole(['admin']), (req: AuthRequest, res: Response) => {
  const current = db.getTable('system_settings');
  const updated = {
    ...current,
    ...req.body,
  };
  db.setTable('system_settings', updated);
  db.logAudit(req.user!.id, req.user!.full_name, req.user!.role, 'UPDATE_SETTINGS', 'SETTINGS', 'SYSTEM', 'Updated system weights');
  return res.json({ message: 'Settings updated successfully', settings: updated });
});

router.get('/admin/audit', authenticateToken, requireRole(['admin']), (req: AuthRequest, res: Response) => {
  return res.json(db.getTable('audit_logs'));
});

// ==========================================
// 9. NOTIFICATIONS
// ==========================================

router.get('/notifications', authenticateToken, (req: AuthRequest, res: Response) => {
  const list = db.getTable('notifications');
  const userRole = req.user!.role;
  const userNotifs = list.filter((n) => n.user_id === req.user!.id || n.role_target === userRole || !n.role_target);
  return res.json(userNotifs.slice(0, 20));
});

router.put('/notifications/:id/read', authenticateToken, (req: AuthRequest, res: Response) => {
  const updated = db.update('notifications', req.params.id, { is_read: true });
  return res.json(updated);
});

export default router;
