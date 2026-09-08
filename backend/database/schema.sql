-- J-SIX (Jharkhand Societal Innovation Exchange)
-- Production PostgreSQL + pgvector Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Enum Types
CREATE TYPE user_role_enum AS ENUM (
  'citizen', 'community_org', 'panchayat_ulb', 'government',
  'university_admin', 'faculty', 'student', 'industry', 'csr_org', 'admin'
);

CREATE TYPE challenge_status_enum AS ENUM (
  'SUBMITTED', 'AI_SCREENED', 'VALIDATION_PENDING', 'VALIDATED',
  'REJECTED', 'NEEDS_INFORMATION', 'MATCHED', 'IN_PROJECT', 'SOLVED'
);

CREATE TYPE irl_stage_enum AS ENUM (
  'IRL-1', 'IRL-2', 'IRL-3', 'IRL-4', 'IRL-5', 'IRL-6', 'IRL-7', 'IRL-8'
);

CREATE TYPE project_status_enum AS ENUM (
  'PROPOSAL', 'PROTOTYPE', 'LAB_TESTING', 'PILOT', 'FIELD_VALIDATION',
  'DEPLOYMENT', 'IMPACT_MEASUREMENT', 'COMPLETED'
);

-- 1. Users Table
CREATE TABLE users (
  id VARCHAR(64) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(32),
  role user_role_enum NOT NULL DEFAULT 'citizen',
  organization_id VARCHAR(64),
  organization_name VARCHAR(255),
  designation VARCHAR(128),
  district VARCHAR(64),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Systemic Challenge Clusters
CREATE TABLE challenge_clusters (
  id VARCHAR(64) PRIMARY KEY,
  cluster_title VARCHAR(255) NOT NULL,
  primary_domain VARCHAR(64) NOT NULL,
  district VARCHAR(64) NOT NULL,
  report_count INT DEFAULT 1,
  affected_population INT DEFAULT 0,
  severity VARCHAR(32) DEFAULT 'moderate',
  centroid_lat DECIMAL(9,6),
  centroid_lng DECIMAL(9,6),
  description TEXT,
  status VARCHAR(32) DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Challenges Table
CREATE TABLE challenges (
  id VARCHAR(64) PRIMARY KEY,
  citizen_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
  citizen_name VARCHAR(255),
  citizen_phone VARCHAR(32),
  title VARCHAR(512) NOT NULL,
  description TEXT NOT NULL,
  primary_domain VARCHAR(64) NOT NULL,
  secondary_domain VARCHAR(64),
  sub_domain VARCHAR(128),
  district VARCHAR(64) NOT NULL,
  block VARCHAR(64),
  village_locality VARCHAR(128),
  latitude DECIMAL(9,6) NOT NULL,
  longitude DECIMAL(9,6) NOT NULL,
  affected_population INT NOT NULL DEFAULT 100,
  urgency VARCHAR(32) NOT NULL DEFAULT 'medium',
  status challenge_status_enum NOT NULL DEFAULT 'SUBMITTED',
  priority_score INT NOT NULL DEFAULT 50,
  cluster_id VARCHAR(64) REFERENCES challenge_clusters(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_challenges_district ON challenges(district);
CREATE INDEX idx_challenges_domain ON challenges(primary_domain);
CREATE INDEX idx_challenges_status ON challenges(status);

-- 4. AI Analysis & Vector Embeddings
CREATE TABLE ai_analysis (
  id VARCHAR(64) PRIMARY KEY,
  challenge_id VARCHAR(64) REFERENCES challenges(id) ON DELETE CASCADE,
  summary TEXT,
  problem_statement TEXT,
  primary_domain VARCHAR(64),
  secondary_domain VARCHAR(64),
  sub_domain VARCHAR(128),
  required_skills JSONB,
  suggested_technologies JSONB,
  sdg_goals JSONB,
  confidence_score INT,
  is_demo_mode BOOLEAN DEFAULT FALSE,
  embedding vector(16),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vector similarity search index using pgvector
CREATE INDEX idx_ai_embedding ON ai_analysis USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- 5. Universities
CREATE TABLE universities (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  short_code VARCHAR(32) UNIQUE NOT NULL,
  type VARCHAR(64) NOT NULL,
  district VARCHAR(64) NOT NULL,
  address TEXT,
  website VARCHAR(255),
  departments JSONB,
  research_domains JSONB,
  laboratories JSONB,
  faculty_count INT DEFAULT 0,
  active_projects INT DEFAULT 0,
  capacity_score INT DEFAULT 80,
  verification_date DATE DEFAULT CURRENT_DATE
);

-- 6. Faculty
CREATE TABLE faculty (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
  university_id VARCHAR(64) REFERENCES universities(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  department VARCHAR(128) NOT NULL,
  designation VARCHAR(128),
  research_expertise JSONB,
  laboratories JSONB,
  active_mentorships INT DEFAULT 0,
  published_papers INT DEFAULT 0
);

-- 7. Projects
CREATE TABLE projects (
  id VARCHAR(64) PRIMARY KEY,
  challenge_id VARCHAR(64) REFERENCES challenges(id) ON DELETE RESTRICT,
  cluster_id VARCHAR(64) REFERENCES challenge_clusters(id) ON DELETE SET NULL,
  title VARCHAR(512) NOT NULL,
  description TEXT,
  university_id VARCHAR(64) REFERENCES universities(id) ON DELETE RESTRICT,
  lead_faculty_id VARCHAR(64) REFERENCES faculty(id) ON DELETE SET NULL,
  status project_status_enum NOT NULL DEFAULT 'PROPOSAL',
  irl_level irl_stage_enum NOT NULL DEFAULT 'IRL-1',
  irl_progress_pct INT DEFAULT 12,
  budget_allocated DECIMAL(12,2) DEFAULT 0.00,
  start_date DATE DEFAULT CURRENT_DATE,
  target_completion_date DATE,
  repository_url TEXT,
  cad_firmware_url TEXT,
  demo_video_url TEXT,
  reusable_in_districts JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Project Milestones
CREATE TABLE project_milestones (
  id VARCHAR(64) PRIMARY KEY,
  project_id VARCHAR(64) REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  target_irl irl_stage_enum NOT NULL,
  due_date DATE,
  status VARCHAR(32) DEFAULT 'PENDING',
  submission_evidence TEXT,
  mentor_feedback TEXT,
  approved_by VARCHAR(255),
  approved_at TIMESTAMP WITH TIME ZONE
);

-- 9. Industries & CSR
CREATE TABLE industries (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sector VARCHAR(128) NOT NULL,
  csr_focus_domains JSONB,
  district VARCHAR(64) NOT NULL,
  contact_person VARCHAR(128),
  contact_email VARCHAR(255),
  annual_csr_budget_cr DECIMAL(8,2),
  verified BOOLEAN DEFAULT TRUE
);

-- 10. Industry Collaborations
CREATE TABLE industry_collaborations (
  id VARCHAR(64) PRIMARY KEY,
  project_id VARCHAR(64) REFERENCES projects(id) ON DELETE CASCADE,
  industry_id VARCHAR(64) REFERENCES industries(id) ON DELETE CASCADE,
  collaboration_type VARCHAR(64) NOT NULL,
  amount_inr DECIMAL(12,2) DEFAULT 0.00,
  description TEXT,
  status VARCHAR(32) DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Impact Records
CREATE TABLE impact_records (
  id VARCHAR(64) PRIMARY KEY,
  project_id VARCHAR(64) REFERENCES projects(id) ON DELETE CASCADE,
  challenge_id VARCHAR(64) REFERENCES challenges(id) ON DELETE SET NULL,
  metric_name VARCHAR(255) NOT NULL,
  predicted_value DECIMAL(12,2) NOT NULL,
  verified_value DECIMAL(12,2) NOT NULL,
  unit VARCHAR(64) NOT NULL,
  verified_by VARCHAR(255),
  verification_date DATE,
  notes TEXT
);

-- 12. Audit Logs
CREATE TABLE audit_logs (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64),
  user_name VARCHAR(255),
  user_role VARCHAR(64),
  action VARCHAR(64) NOT NULL,
  entity_type VARCHAR(64) NOT NULL,
  entity_id VARCHAR(64) NOT NULL,
  details TEXT,
  ip_address VARCHAR(45),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
