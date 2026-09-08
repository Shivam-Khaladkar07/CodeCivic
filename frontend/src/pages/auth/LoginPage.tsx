import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Shield,
  Building,
  GraduationCap,
  Briefcase,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const { login, quickSwitchRole, isLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const demoAccounts = [
    {
      role: 'citizen' as UserRole,
      title: 'Citizen / Farmer',
      email: 'citizen@demo.in',
      org: 'Ramesh Kumar (Kanke Rural)',
      icon: User,
      color: 'hover:border-blue-400 bg-blue-50/40',
      path: '/citizen/dashboard',
    },
    {
      role: 'government' as UserRole,
      title: 'Government Officer',
      email: 'government@demo.in',
      org: 'Dr. Ananya Roy, IAS (Planning Dept)',
      icon: Shield,
      color: 'hover:border-emerald-400 bg-emerald-50/40',
      path: '/government/dashboard',
    },
    {
      role: 'university_admin' as UserRole,
      title: 'University Dean',
      email: 'university@demo.in',
      org: 'Prof. Sudhir Sinha (BAU / BIT)',
      icon: Building,
      color: 'hover:border-purple-400 bg-purple-50/40',
      path: '/university/dashboard',
    },
    {
      role: 'faculty' as UserRole,
      title: 'Faculty Mentor',
      email: 'faculty@demo.in',
      org: 'Dr. A. K. Sharma (Power Electronics)',
      icon: GraduationCap,
      color: 'hover:border-indigo-400 bg-indigo-50/40',
      path: '/faculty/dashboard',
    },
    {
      role: 'student' as UserRole,
      title: 'Student Team Lead',
      email: 'student@demo.in',
      org: 'Pooja Hansda (Agritech Innovator)',
      icon: GraduationCap,
      color: 'hover:border-teal-400 bg-teal-50/40',
      path: '/student/dashboard',
    },
    {
      role: 'industry' as UserRole,
      title: 'Industry & CSR',
      email: 'industry@demo.in',
      org: 'Saurabh Roy (Tata Steel CSR)',
      icon: Briefcase,
      color: 'hover:border-amber-400 bg-amber-50/40',
      path: '/industry/dashboard',
    },
    {
      role: 'admin' as UserRole,
      title: 'System Admin',
      email: 'admin@demo.in',
      org: 'Platform Governance & Algorithm Weights',
      icon: Shield,
      color: 'hover:border-rose-400 bg-rose-50/40',
      path: '/admin/dashboard',
    },
  ];

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid credentials');
    }
  };

  const handle1ClickDemoLogin = async (acc: typeof demoAccounts[0]) => {
    setError(null);
    try {
      await quickSwitchRole(acc.role);
      navigate(acc.path);
    } catch (err) {
      setError('Failed to log in with demo account');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
          <Zap className="h-3.5 w-3.5 fill-current" />
          <span>Evaluation Sandbox • 1-Click Fast Access</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900">Sign in to CivicForge Portal</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Select any pre-configured demo stakeholder role to explore the full platform without typing credentials.
        </p>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-2xl text-center">
          {error}
        </div>
      )}

      {/* 1-Click Demo Personas Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
          <span>Click to Login Instantly as:</span>
          <span className="text-purple-600 font-mono">Password: Demo@12345</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {demoAccounts.map((acc, idx) => {
            const Icon = acc.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handle1ClickDemoLogin(acc)}
                className={`p-4 rounded-2xl border border-slate-200 text-left transition shadow-xs hover:shadow-soft flex items-start gap-3.5 ${acc.color}`}
              >
                <div className="h-9 w-9 rounded-xl bg-white text-slate-700 border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-xs">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-black text-slate-900">{acc.title}</div>
                  <div className="text-[11px] text-slate-500 font-mono truncate">{acc.email}</div>
                  <div className="text-[10px] text-slate-600 truncate mt-1">{acc.org}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Or Standard Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft max-w-md mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block text-center">
          Or Enter Credentials Manually
        </span>

        <form onSubmit={handleStandardLogin} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@demo.in"
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Demo@12345"
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-brand-blue hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition shadow-sm"
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};
