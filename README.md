# CivicForge: Jharkhand Societal Innovation Exchange
### Smart India Hackathon 2026 — Problem Statement Solution

> **Tagline:** *“From Community Problems to Deployable Solutions.”*  
> **Value Proposition:** *“Transforming grassroots problems into verified, intelligently matched, industry-supported innovation projects and tracking them all the way to measurable societal impact.”*

---

## 1. Problem Statement & Context

### The Challenge
Citizens across Jharkhand encounter severe infrastructural deficiencies across 12 societal domains:
- **Agriculture** (irrigation pump failures, soil degradation, pest outbreaks)
- **Water Resources** (fluoride & arsenic contamination, dried springs, pipeline leakage)
- **Healthcare** (cold-chain vaccine spoilage, delayed diagnostics, maternal care)
- **Energy** (voltage brownouts, transformer burnouts, feeder outages)
- **Sanitation** (clogged drains, municipal waste accumulation, failing bio-toilets)
- **Environment** (coal dust pollution, mine void runoff, fly ash dumping)
- **Education** (connectivity gaps, lack of vernacular STEM labs)
- **Accessibility** (public buildings without ramps, lack of assistive aids)
- **Urban Infrastructure** (road potholes, faulty streetlighting, flood waterlogging)
- **Rural Livelihoods** (lac scraping injuries, silk cocoon spoilage, middlemen exploitation)
- **Public Administration** (service delivery bottlenecks)

### The Core Flaw of Existing Grievance Portals
Traditional complaint portals log grievances into bureaucratic queues without addressing the root engineering deficiency. Identical problems recur year after year across adjacent hamlets with no connection to academic R&D or CSR capital.

### The CivicForge Solution
CivicForge creates a unified societal innovation bridge:
```
CITIZEN
  ↓ (Reports in Vernacular / Voice)
AI INTELLIGENCE (6-Step Visible Pipeline)
  ↓ (Deduplication, Domain Tagging, Explainable Priority 0-100)
SYSTEMIC PROBLEM CLUSTERING (18 Reports → 4 Villages → 1 Cluster)
  ↓
GOVERNMENT / PANCHAYAT VALIDATION (Ground Inspection)
  ↓
UNIVERSITY MATCHING ENGINE (Multi-Criteria 35% Domain, 25% Faculty, 15% Lab, 10% Geo)
  ↓
MULTIDISCIPLINARY STUDENT TEAM (Agronomy + Electrical + CS)
  ↓
INDUSTRY & CSR SPONSORSHIP (Tata Steel CSR / BCCL Grants)
  ↓
INNOVATION READINESS LEVEL (IRL-1 to IRL-8 Stage Gates)
  ↓
COMMUNITY PILOT & DEPLOYMENT (Field Installed)
  ↓
MEASURABLE OUTCOMES & REUSE (Audited Impact & Transferred to Adjacent Districts)
```

---

## 2. Key Innovation Features

1. **Autonomous 6-Stage AI Verification Pipeline**:
   - Natural Language & Vernacular Comprehension
   - Domain Taxonomy Classification (12 Themes mapped to UN SDGs)
   - Cosine Vector Semantic Duplicate Detection
   - Explainable Multi-Factor Priority Score (0–100)
   - Multidisciplinary Engineering Competency Extraction
   - University & Faculty Recommendation Matrix
2. **Dual-Mode AI Architecture (Zero External Dependency)**:
   - **Mode A**: Live LLM Integration (OpenAI / Gemini / Claude via API Key)
   - **Mode B**: Deterministic Local Intelligent Engine (100% operational offline with zero network latency or API failures during live hackathon judging).
3. **Systemic Problem Clustering**:
   - Groups individual complaints across villages into high-severity systemic clusters (e.g. 18 pump tripping reports across Kanke and Ratu merged into the *Ranchi Rural Irrigation Voltage Failure Cluster*).
4. **NASA-Adapted Innovation Readiness Level (IRL 1–8)**:
   - Tracks project maturity from Problem Ground Validated (IRL-1) to Lab Tested (IRL-4), Community Pilot (IRL-5), and Scaled Impact (IRL-8).
5. **Explainable Academic & Industry Matching**:
   - Full radar score breakdown: 35% Domain Alignment, 25% Faculty Publications, 15% Lab Infrastructure, 10% Geographic Proximity, 10% Track Record, 5% Capacity.
6. **Cross-District Knowledge Reuse**:
   - Proven solutions (such as the Smart Solar-Grid VFD Controller) are tagged for instant replication in other affected districts (e.g. Dumka, Deoghar, Palamu).
7. **Interactive Geospatial Radar**:
   - OpenStreetMap + Leaflet map plotting 300+ ground challenges across all 24 Jharkhand districts with severity heat coding and district summary drawers.

---

## 3. Seeded Realistic Demo Accounts (1-Click Login)

Password for all demo accounts: `Demo@12345`

| Role | Email | Name / Organization | Description |
| :--- | :--- | :--- | :--- |
| **Citizen** | `citizen@demo.in` | Ramesh Kumar Mahto (Kanke) | Report community issues with photo evidence |
| **Government** | `government@demo.in` | Dr. Ananya Roy, IAS (Planning Dept) | Validate ground truth & inspect radar |
| **University Admin** | `university@demo.in` | Prof. Sudhir K. Sinha (BAU / BIT) | Review matches & assign faculty teams |
| **Faculty Mentor** | `faculty@demo.in` | Dr. A. K. Sharma (Electrical / VFD) | Review student evidence & advance IRL |
| **Student Innovator** | `student@demo.in` | Pooja Hansda (Team Lead) | Manage tasks & upload prototype specs |
| **Industry / CSR** | `industry@demo.in` | Saurabh Roy (Tata Steel CSR) | Pledge prototype grants & pilot sites |
| **System Admin** | `admin@demo.in` | State Platform Administrator | Live slider reconfiguration of weights |

---

## 4. Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Leaflet (OpenStreetMap), Recharts, React Router v6.
- **Backend**: Node.js, Express, TypeScript, tsx, JWT, Bcrypt.js, REST API.
- **Data Layer**: Relational persistent JSON engine with atomic write-locks and vector cosine similarity. Includes a production-ready PostgreSQL + pgvector schema file (`backend/database/schema.sql`).
- **Geospatial**: Leaflet + OpenStreetMap (No proprietary billing keys required).

---

## 5. Local Development Instructions

### Prerequisites
- Node.js v18+ (tested on Node v24.18)
- npm v9+

### 1. Start the Backend API
```bash
cd backend
npm install
npm run dev
```
*Backend will start on `http://localhost:5000` and automatically seed ~300 challenges across 24 Jharkhand districts, 20 universities, 50 faculty, 30 industry profiles, and the Golden Project.*

### 2. Start the Frontend Client
```bash
cd frontend
npm install
npm run dev
```
*Frontend will launch at `http://localhost:5173`.*

---

## 6. Golden Demo Scenario ("Ranchi Irrigation Grid Brownout")

To demonstrate the full end-to-end journey to evaluators:
1. Click the **"Launch Golden Demo"** button on the top banner or navbar.
2. Step 1: Citizen Ramesh Kumar logs the Kanke irrigation pump brownout issue.
3. Step 2: AI screens the report and detects 17 duplicate incidents, forming a Systemic Cluster.
4. Step 3: Government Officer Dr. Ananya Roy validates the ground report into the innovation pipeline.
5. Step 4: Birsa Agricultural University & BIT Mesra receive a 94% match and accept the project.
6. Step 5: Tata Steel CSR pledges a ₹3,50,000 grant and industrial testing support.
7. Step 6: Project advances to IRL-5 (Community Pilot) with 4,200 farmers benefited and ₹14.2L saved.

---

## 7. Environment Variables (`.env.example`)

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=jsix_super_secret_jwt_token_key_2026_sih
DATABASE_URL=file:./data/database.json
AI_API_KEY=
AI_MODEL=gemini-1.5-flash
AI_MODE=demo
STORAGE_URL=local
```
