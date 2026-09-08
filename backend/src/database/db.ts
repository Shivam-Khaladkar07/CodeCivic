import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  User,
  Challenge,
  ChallengeCluster,
  ChallengeValidation,
  AIAnalysis,
  University,
  Faculty,
  UniversityMatch,
  Project,
  ProjectTeamMember,
  ProjectMilestone,
  ProjectTask,
  Industry,
  IndustryCollaboration,
  ProjectComment,
  ImpactRecord,
  Notification,
  SystemSettings,
  AuditLog,
} from '../models/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

export interface DatabaseSchema {
  users: User[];
  challenges: Challenge[];
  challenge_clusters: ChallengeCluster[];
  challenge_validations: ChallengeValidation[];
  ai_analysis: AIAnalysis[];
  universities: University[];
  faculty: Faculty[];
  university_matches: UniversityMatch[];
  projects: Project[];
  project_team_members: ProjectTeamMember[];
  project_milestones: ProjectMilestone[];
  project_tasks: ProjectTask[];
  industries: Industry[];
  industry_collaborations: IndustryCollaboration[];
  project_comments: ProjectComment[];
  impact_records: ImpactRecord[];
  notifications: Notification[];
  system_settings: SystemSettings;
  audit_logs: AuditLog[];
}

export const defaultSettings: SystemSettings = {
  priority_weights: {
    population: 25,
    urgency: 25,
    recurrence: 20,
    evidence: 15,
    geo_spread: 15,
  },
  matching_weights: {
    domain_expertise: 35,
    faculty_expertise: 25,
    lab_infrastructure: 15,
    geography: 10,
    previous_work: 10,
    availability: 5,
  },
  ai_mode: 'demo',
  ai_model: 'gemini-1.5-flash',
};

class Database {
  private data: DatabaseSchema = {
    users: [],
    challenges: [],
    challenge_clusters: [],
    challenge_validations: [],
    ai_analysis: [],
    universities: [],
    faculty: [],
    university_matches: [],
    projects: [],
    project_team_members: [],
    project_milestones: [],
    project_tasks: [],
    industries: [],
    industry_collaborations: [],
    project_comments: [],
    impact_records: [],
    notifications: [],
    system_settings: defaultSettings,
    audit_logs: [],
  };

  private isLoaded = false;

  constructor() {
    this.ensureDataDir();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  public init(initialData?: Partial<DatabaseSchema>) {
    this.ensureDataDir();
    if (initialData) {
      this.data = {
        ...this.data,
        ...initialData,
      };
      this.save();
      this.isLoaded = true;
      console.log(`[Database] Populated database with provided data (${this.data.challenges.length} challenges)`);
      return;
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.challenges && parsed.challenges.length > 0) {
          this.data = {
            ...this.data,
            ...parsed,
            system_settings: {
              ...defaultSettings,
              ...(parsed.system_settings || {}),
            },
          };
          this.isLoaded = true;
          console.log(`[Database] Loaded existing database from ${DB_FILE} (${this.data.challenges.length} challenges)`);
          return;
        }
      } catch (err) {
        console.error('[Database] Failed to read existing DB, initializing afresh:', err);
      }
    }
  }

  public save() {
    try {
      this.ensureDataDir();
      const tempPath = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error('[Database] Failed to save DB file:', err);
    }
  }

  // Generic accessors
  public getTable<K extends keyof DatabaseSchema>(tableName: K): DatabaseSchema[K] {
    return this.data[tableName];
  }

  public setTable<K extends keyof DatabaseSchema>(tableName: K, val: DatabaseSchema[K]) {
    this.data[tableName] = val;
    this.save();
  }

  // Entity helpers
  public find<K extends keyof DatabaseSchema>(
    table: K,
    predicate: (item: any) => boolean
  ): any[] {
    return (this.data[table] as any[]).filter(predicate);
  }

  public findOne<K extends keyof DatabaseSchema>(
    table: K,
    predicate: (item: any) => boolean
  ): any | undefined {
    return (this.data[table] as any[]).find(predicate);
  }

  public insert<K extends keyof DatabaseSchema>(table: K, item: any): any {
    (this.data[table] as any[]).unshift(item);
    this.save();
    return item;
  }

  public update<K extends keyof DatabaseSchema>(
    table: K,
    id: string,
    updates: any
  ): any | undefined {
    const list = this.data[table] as any[];
    const idx = list.findIndex((x) => x.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates, updated_at: new Date().toISOString() };
      this.save();
      return list[idx];
    }
    return undefined;
  }

  public delete<K extends keyof DatabaseSchema>(table: K, id: string): boolean {
    const list = this.data[table] as any[];
    const idx = list.findIndex((x) => x.id === id);
    if (idx !== -1) {
      list.splice(idx, 1);
      this.save();
      return true;
    }
    return false;
  }

  public logAudit(
    userId: string,
    userName: string,
    userRole: string,
    action: string,
    entityType: string,
    entityId: string,
    details: string,
    ip = '127.0.0.1'
  ) {
    const log: AuditLog = {
      id: `AUDIT-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      user_id: userId,
      user_name: userName,
      user_role: userRole,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details,
      ip_address: ip,
      timestamp: new Date().toISOString(),
    };
    this.data.audit_logs.unshift(log);
    if (this.data.audit_logs.length > 500) {
      this.data.audit_logs.pop();
    }
    this.save();
  }

  public addNotification(notif: Omit<Notification, 'id' | 'created_at' | 'is_read'>) {
    const item: Notification = {
      ...notif,
      id: `NOTIF-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    this.data.notifications.unshift(item);
    this.save();
    return item;
  }
}

export const db = new Database();
