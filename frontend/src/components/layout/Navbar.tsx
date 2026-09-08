import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  PlusCircle,
  Layers,
  BarChart3,
  UserCheck,
  LogOut,
  Play,
  Shield,
  Building,
  GraduationCap,
  Briefcase,
  User,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface NavbarProps {
  onOpenGoldenDemo?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenGoldenDemo }) => {
  const { user, logout, quickSwitchRole } = useAuth();
  const navigate = useNavigate();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const roleLabels: Record<UserRole, { label: string; icon: any; path: string }> = {
    citizen: { label: 'Citizen', icon: User, path: '/citizen/dashboard' },
    government: { label: 'Government', icon: Shield, path: '/government/dashboard' },
    panchayat_ulb: { label: 'Panchayat/ULB', icon: Shield, path: '/government/dashboard' },
    community_org: { label: 'Community Org', icon: User, path: '/citizen/dashboard' },
    university_admin: { label: 'University', icon: Building, path: '/university/dashboard' },
    faculty: { label: 'Faculty Mentor', icon: GraduationCap, path: '/faculty/dashboard' },
    student: { label: 'Student Lead', icon: GraduationCap, path: '/student/dashboard' },
    industry: { label: 'Industry & CSR', icon: Briefcase, path: '/industry/dashboard' },
    csr_org: { label: 'CSR Org', icon: Briefcase, path: '/industry/dashboard' },
    admin: { label: 'System Admin', icon: Shield, path: '/admin/dashboard' },
  };

  const currentRoleInfo = user ? roleLabels[user.role] : null;

  return (
    <header className="sticky top-0 z-50 bg-navy-900 text-white border-b border-navy-700 shadow-md">
      {/* Top micro-bar for Government Tech Credentials */}
      <div className="bg-navy-950 px-4 py-1 text-[11px] text-slate-400 flex items-center justify-between border-b border-navy-800">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400"></span>
          <span>Government of Jharkhand • State Societal Innovation Framework (SIH 2026)</span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-purple-300 font-mono">AI Dual-Mode: Deterministic Fallback Active</span>
        </div>

        {/* Demo Fast-Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenGoldenDemo}
            className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold transition"
          >
            <Play className="h-3 w-3 fill-current" />
            <span>SIH Golden Demo Flow</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-teal flex items-center justify-center font-black text-lg text-white shadow-md shadow-blue-500/20">
            CF
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-white">CivicForge</span>
              <span className="text-[10px] bg-brand-blue/30 text-brand-blue border border-brand-blue/50 px-1.5 py-0.2 rounded font-bold">
                JHARKHAND
              </span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-wide font-medium hidden sm:block">
              Societal Innovation Exchange
            </p>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link to="/challenges" className="hover:text-white transition flex items-center gap-1.5">
            <Compass className="h-4 w-4 text-brand-blue" />
            Explore Challenges
          </Link>
          <Link to="/government/clusters" className="hover:text-white transition flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-purple-400" />
            Systemic Clusters
          </Link>
          <Link to="/government/analytics" className="hover:text-white transition flex items-center gap-1.5">
            <BarChart3 className="h-4 w-4 text-emerald-400" />
            Impact & Reuse
          </Link>
          <Link to="/about" className="hover:text-white transition">
            Framework
          </Link>
        </nav>

        {/* Right CTA & Profile */}
        <div className="flex items-center gap-3">
          {/* Submit Challenge CTA */}
          <Link
            to="/citizen/challenges/new"
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-brand-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl shadow-md shadow-blue-500/20 transition transform hover:-translate-y-0.5"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Report Challenge</span>
          </Link>

          {/* User Account / 1-Click Role Switcher */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 bg-navy-800 hover:bg-navy-700 border border-navy-700 px-3 py-1.5 rounded-xl text-xs transition"
              >
                <div className="h-6 w-6 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold">
                  {user.full_name[0]}
                </div>
                <div className="text-left hidden lg:block">
                  <div className="font-bold text-white leading-tight truncate max-w-[110px]">
                    {user.full_name}
                  </div>
                  <div className="text-[10px] text-purple-300 capitalize">
                    {currentRoleInfo?.label || user.role}
                  </div>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {/* Role Switcher Menu */}
              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-elevated py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <div className="text-xs font-bold text-slate-900">{user.full_name}</div>
                    <div className="text-[11px] text-slate-500">{user.email}</div>
                    <div className="text-[10px] text-brand-blue font-semibold mt-1">
                      Role: {currentRoleInfo?.label}
                    </div>
                  </div>

                  {/* Dashboard link for current user */}
                  <div className="px-2 py-1.5 border-b border-slate-100">
                    <Link
                      to={currentRoleInfo?.path || '/citizen/dashboard'}
                      onClick={() => setRoleDropdownOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-900 transition"
                    >
                      <UserCheck className="h-4 w-4 text-brand-blue" />
                      Go to {currentRoleInfo?.label} Portal
                    </Link>
                  </div>

                  {/* 1-Click Role Switcher */}
                  <div className="px-3 pt-2 pb-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Quick Role Switcher (SIH Evaluation)
                    </span>
                    <div className="space-y-0.5">
                      {[
                        { r: 'citizen' as const, label: 'Citizen (Farmer)', desc: 'Report & Track' },
                        { r: 'government' as const, label: 'Government Officer', desc: 'Validation & Radar' },
                        { r: 'university_admin' as const, label: 'University Dean', desc: 'Matching & Teams' },
                        { r: 'faculty' as const, label: 'Faculty Mentor', desc: 'IRL Approvals' },
                        { r: 'student' as const, label: 'Student Lead', desc: 'Tasks & Prototypes' },
                        { r: 'industry' as const, label: 'Industry / CSR', desc: 'Funding & Pilots' },
                        { r: 'admin' as const, label: 'System Admin', desc: 'Weights & Settings' },
                      ].map((item) => (
                        <button
                          key={item.r}
                          onClick={async () => {
                            await quickSwitchRole(item.r);
                            setRoleDropdownOpen(false);
                            navigate(roleLabels[item.r].path);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition ${
                            user.role === item.r
                              ? 'bg-blue-50 text-brand-blue font-bold'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span>{item.label}</span>
                          <span className="text-[10px] text-slate-400">{item.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="px-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        logout();
                        setRoleDropdownOpen(false);
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="text-xs sm:text-sm font-semibold bg-navy-800 hover:bg-navy-700 px-3.5 py-2 rounded-xl border border-navy-700 transition"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
