import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
  Award,
  Zap,
  Cpu,
  Layers,
  BarChart2,
  CheckCircle2,
  Play,
  MapPin,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { challengesApi, clustersApi, universitiesApi } from '../../services/api';
import { Challenge, ChallengeCluster, University } from '../../types';
import { ChallengeCard } from '../../components/common/ChallengeCard';
import { DistrictMap } from '../../components/map/DistrictMap';

interface LandingPageProps {
  onOpenGoldenDemo?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenGoldenDemo }) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [clusters, setClusters] = useState<ChallengeCluster[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [chRes, clRes, uniRes] = await Promise.all([
          challengesApi.getAll({ limit: 6 }),
          clustersApi.getAll(),
          universitiesApi.getAll(),
        ]);
        setChallenges(chRes.data.challenges);
        setClusters(clRes.data);
        setUniversities(uniRes.data);
      } catch (err) {
        console.error('Failed to load landing page data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const flowSteps = [
    { label: 'Citizen', desc: 'Reports real ground issues' },
    { label: 'AI Intelligence', desc: 'Deduplicates, scores & maps' },
    { label: 'Validation', desc: 'Panchayat & Govt verifies' },
    { label: 'University Match', desc: 'Faculty & labs assigned' },
    { label: 'Student Team', desc: 'Multidisciplinary R&D' },
    { label: 'Industry CSR', desc: 'Funding & equipment grant' },
    { label: 'Pilot & IRL', desc: 'Field testing at site' },
    { label: 'Impact', desc: 'Measurable societal outcome' },
  ];

  const domains = [
    { name: 'Agriculture', count: 42, icon: '🌾', desc: 'Solar irrigation, crop health & soil telemetry' },
    { name: 'Water Resources', count: 38, icon: '💧', desc: 'Fluoride/arsenic filtration & pipeline monitoring' },
    { name: 'Healthcare', count: 34, icon: '🏥', desc: 'Cold chain vaccine monitors & tele-diagnostics' },
    { name: 'Energy', count: 29, icon: '⚡', desc: 'Microgrid protection & transformer auto-disconnect' },
    { name: 'Environment', count: 26, icon: '🌲', desc: 'Coal dust scrubbers & native phytoremediation' },
    { name: 'Sanitation', count: 24, icon: '♻️', desc: 'Autonomous drain bots & bio-digester optimization' },
    { name: 'Education', count: 25, icon: '📚', desc: 'Vernacular voice AI & offline STEM labs' },
    { name: 'Accessibility', count: 21, icon: '♿', desc: 'Haptic smart canes & all-terrain mobility' },
    { name: 'Rural Livelihoods', count: 27, icon: '🪵', desc: 'Mechanized lac scraping & Tussar silk drying' },
    { name: 'Urban Infra', count: 22, icon: '🚦', desc: 'Edge AI pothole mapping & smart LED lighting' },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-navy-900 text-white pt-16 pb-20 sm:pt-24 sm:pb-28">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-brand-blue/15 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-800 border border-navy-700 text-xs font-semibold text-slate-300">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
            <span>CivicForge • State Societal Innovation Framework (SIH 2026)</span>
            <span className="text-purple-400 font-bold">•</span>
            <span className="text-amber-300">Prototype Environment</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight">
            Turn Community Challenges Into{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-purple-400">
              Real-World Innovation.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            An AI-powered ecosystem connecting citizens, government, universities, students, startups, and industry to
            convert grassroots problems into verified, multidisciplinary engineering projects tracked to measurable
            impact.
          </p>

          {/* Core Tagline Banner */}
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest pt-1">
            "From Community Problems to Deployable Solutions"
          </div>

          {/* CTA Group */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/citizen/challenges/new"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-500/25 transition transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>Report a Challenge</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/challenges"
              className="px-6 py-3.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-200 border border-navy-700 font-semibold text-sm sm:text-base transition flex items-center gap-2"
            >
              <span>Explore Innovation Radar</span>
            </Link>

            <button
              onClick={onOpenGoldenDemo}
              className="px-5 py-3.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-700/80 text-purple-200 font-semibold text-sm transition flex items-center gap-2"
            >
              <Play className="h-4 w-4 fill-current text-amber-400" />
              <span>Launch Golden Demo</span>
            </button>
          </div>

          {/* Animated Challenge-to-Impact Flow Diagram */}
          <div className="pt-12">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              End-to-End Innovation Exchange Architecture
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 max-w-5xl mx-auto">
              {flowSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-navy-800/80 backdrop-blur border border-navy-700 p-2.5 rounded-xl text-center relative group hover:border-brand-blue transition"
                >
                  <div className="text-[10px] font-mono text-brand-blue font-bold">0{idx + 1}</div>
                  <div className="text-xs font-bold text-white mt-0.5">{step.label}</div>
                  <div className="text-[10px] text-slate-400 leading-tight mt-1">{step.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. REAL-TIME STATS BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 bg-white p-6 rounded-3xl border border-slate-200 shadow-elevated">
          <div className="text-center border-b md:border-b-0 md:border-r border-slate-100 pb-3 md:pb-0">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">300+</span>
            <span className="text-xs text-slate-500 font-medium block">Community Challenges</span>
            <span className="text-[10px] text-slate-400">Across 24 Districts</span>
          </div>

          <div className="text-center border-b md:border-b-0 md:border-r border-slate-100 pb-3 md:pb-0">
            <span className="text-2xl sm:text-3xl font-black text-brand-blue">20</span>
            <span className="text-xs text-slate-500 font-medium block">Universities & HEIs</span>
            <span className="text-[10px] text-slate-400">BIT, BAU, IIT, NIT, AIIMS</span>
          </div>

          <div className="text-center border-b md:border-b-0 md:border-r border-slate-100 pb-3 md:pb-0">
            <span className="text-2xl sm:text-3xl font-black text-purple-600">50</span>
            <span className="text-xs text-slate-500 font-medium block">Active R&D Projects</span>
            <span className="text-[10px] text-slate-400">Across IRL 1 to 8</span>
          </div>

          <div className="text-center border-b md:border-b-0 md:border-r border-slate-100 pb-3 md:pb-0">
            <span className="text-2xl sm:text-3xl font-black text-amber-600">15</span>
            <span className="text-xs text-slate-500 font-medium block">Industry & CSR Partners</span>
            <span className="text-[10px] text-slate-400">Tata Steel, BCCL, SAIL</span>
          </div>

          <div className="text-center col-span-2 md:col-span-1">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600">14.2L+</span>
            <span className="text-xs text-slate-500 font-medium block">Verified Citizen Impact</span>
            <span className="text-[10px] text-slate-400">Predicted & Ground Verified</span>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (THE DIFFERENTIATOR) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">
            Transformational Methodology
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Not A Complaint Portal. An Innovation Engine.
          </h2>
          <p className="text-sm text-slate-600">
            Standard complaint systems log grievances into bureaucratic queues. CivicForge converts grassroot challenges
            into structured academic research challenges backed by industry CSR grants.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">1. AI Semantic Intelligence</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              When a citizen submits a problem in plain language or vernacular, our 6-step AI pipeline extracts required
              engineering competencies, calculates explainable priority (0-100), and groups duplicate incidents into
              systemic problem clusters.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center font-bold">
              <Building2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">2. Explainable University Matching</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Algorithms rank universities across 6 weighted dimensions (domain alignment, faculty publications, lab
              equipment, proximity, track record, and capacity). Authorized deans accept projects and assemble student
              teams.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">3. IRL Lifecycle to Verified Impact</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tracks projects from IRL-1 (Problem Validated) to IRL-5 (Community Pilot) and IRL-8 (Scaled Impact).
              Separates predicted impact from verified ground metrics and facilitates solution reuse in adjacent
              districts.
            </p>
          </div>
        </div>
      </section>

      {/* 4. THE 12 SOCIETAL DOMAINS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">Categorization</span>
            <h2 className="text-2xl font-extrabold text-slate-900">12 Societal Innovation Themes</h2>
          </div>
          <Link to="/challenges" className="text-xs font-semibold text-brand-blue flex items-center gap-1">
            View all 300+ challenges <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {domains.map((dom, i) => (
            <Link
              key={i}
              to={`/challenges?domain=${dom.name}`}
              className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-soft hover:shadow-elevated hover:border-brand-blue/50 transition group"
            >
              <div className="text-2xl mb-2">{dom.icon}</div>
              <div className="text-sm font-bold text-slate-900 group-hover:text-brand-blue transition">
                {dom.name}
              </div>
              <div className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">{dom.desc}</div>
              <div className="text-[10px] font-semibold text-brand-blue mt-2 pt-2 border-t border-slate-100">
                {dom.count} Challenges Active
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. GEOSPATIAL RADAR (INTERACTIVE JHARKHAND MAP) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">Geospatial Intelligence</span>
            <h2 className="text-2xl font-extrabold text-slate-900">Live Jharkhand Innovation Radar</h2>
            <p className="text-xs text-slate-500">
              Interactive map plotting 300 ground challenges, color-coded by urgency and severity across 24 districts.
            </p>
          </div>
          <Link
            to="/government/map"
            className="text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition"
          >
            Full Screen Radar
          </Link>
        </div>

        <DistrictMap challenges={challenges} height="480px" />
      </section>

      {/* 6. FEATURED CHALLENGES & GOLDEN SCENARIO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">Ground Reports</span>
            <h2 className="text-2xl font-extrabold text-slate-900">Featured Innovation Challenges</h2>
          </div>
          <Link to="/challenges" className="text-xs font-semibold text-brand-blue flex items-center gap-1">
            Browse All <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {challenges.slice(0, 6).map((c) => (
            <ChallengeCard key={c.id} challenge={c} />
          ))}
        </div>
      </section>

      {/* 7. ACADEMIC & INDUSTRY PARTNERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">Ecosystem Coalition</span>
          <h2 className="text-2xl font-extrabold text-slate-900">Participating Institutions & Industry</h2>
          <p className="text-xs text-slate-500">
            Top state and central universities matched with leading industrial CSR organizations in Jharkhand.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {universities.slice(0, 6).map((u) => (
            <div key={u.id} className="bg-white p-3.5 rounded-2xl border border-slate-200 text-center shadow-xs">
              <div className="h-10 w-10 mx-auto rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center font-bold text-xs mb-2">
                {u.short_code}
              </div>
              <div className="text-xs font-bold text-slate-900 truncate">{u.name}</div>
              <div className="text-[10px] text-slate-400">{u.district}</div>
              <div className="text-[9px] text-emerald-600 font-semibold mt-1">{u.active_projects} Projects Active</div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-navy-950 text-slate-400 border-t border-navy-800 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-brand-blue flex items-center justify-center font-black text-white text-sm">
                  CF
                </div>
                <span className="text-base font-black text-white">CivicForge</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-400">
                CivicForge: Jharkhand Societal Innovation Exchange — an end-to-end civic-to-impact platform built for Smart India
                Hackathon 2026.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Role Portals</h4>
              <ul className="space-y-1.5 text-xs">
                <li><Link to="/citizen/dashboard" className="hover:text-white">Citizen Portal</Link></li>
                <li><Link to="/government/dashboard" className="hover:text-white">Government Decision Radar</Link></li>
                <li><Link to="/university/dashboard" className="hover:text-white">University Marketplace</Link></li>
                <li><Link to="/faculty/dashboard" className="hover:text-white">Faculty Mentor Workspace</Link></li>
                <li><Link to="/student/dashboard" className="hover:text-white">Student Innovation Hub</Link></li>
                <li><Link to="/industry/dashboard" className="hover:text-white">Industry CSR Portal</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Features</h4>
              <ul className="space-y-1.5 text-xs">
                <li><Link to="/challenges" className="hover:text-white">Challenge Explorer</Link></li>
                <li><Link to="/government/clusters" className="hover:text-white">Systemic Problem Clusters</Link></li>
                <li><Link to="/government/analytics" className="hover:text-white">Verified Impact Intelligence</Link></li>
                <li><Link to="/government/map" className="hover:text-white">Geospatial Radar</Link></li>
                <li><Link to="/about" className="hover:text-white">IRL 1-8 Framework</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Disclaimer & Demo</h4>
              <p className="text-[11px] leading-relaxed text-slate-400">
                This platform is configured with 300 realistic synthetic challenge records and dual-mode local AI
                processing for Smart India Hackathon 2026 evaluation.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-navy-800 text-center text-xs text-slate-500">
            © 2026 CivicForge Jharkhand. Built for Smart India Hackathon 2026.
          </div>
        </div>
      </footer>
    </div>
  );
};
