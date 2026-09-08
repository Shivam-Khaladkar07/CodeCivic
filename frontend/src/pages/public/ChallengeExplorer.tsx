import React, { useEffect, useState } from 'react';
import { Search, Filter, Compass, MapPin, Layers } from 'lucide-react';
import { challengesApi } from '../../services/api';
import { Challenge } from '../../types';
import { ChallengeCard } from '../../components/common/ChallengeCard';
import { useSearchParams } from 'react-router-dom';

const DISTRICTS = [
  'ALL', 'Ranchi', 'Dhanbad', 'East Singhbhum', 'Bokaro', 'Deoghar', 'Hazaribagh',
  'Dumka', 'Giridih', 'Ramgarh', 'Palamu', 'West Singhbhum', 'Khunti',
  'Gumla', 'Simdega', 'Latehar', 'Lohardaga', 'Chatra', 'Koderma',
  'Jamtara', 'Godda', 'Pakur', 'Sahibganj', 'Seraikela Kharsawan', 'Garhwa'
];

const DOMAINS = [
  'ALL', 'Agriculture', 'Water Resources', 'Healthcare', 'Energy', 'Environment',
  'Sanitation', 'Education', 'Accessibility', 'Rural Livelihoods', 'Urban Infrastructure'
];

export const ChallengeExplorer: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState(searchParams.get('district') || 'ALL');
  const [selectedDomain, setSelectedDomain] = useState(searchParams.get('domain') || 'ALL');
  const [selectedUrgency, setSelectedUrgency] = useState('ALL');
  const [page, setPage] = useState(1);

  const fetchChallenges = async () => {
    setIsLoading(true);
    try {
      const params: Record<string, any> = {
        page,
        limit: 24,
      };
      if (selectedDistrict !== 'ALL') params.district = selectedDistrict;
      if (selectedDomain !== 'ALL') params.domain = selectedDomain;
      if (selectedUrgency !== 'ALL') params.urgency = selectedUrgency.toLowerCase();
      if (search.trim()) params.search = search.trim();

      const res = await challengesApi.getAll(params);
      setChallenges(res.data.challenges);
      setTotal(res.data.total);
    } catch (err) {
      console.error('Failed to load challenges:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, [selectedDistrict, selectedDomain, selectedUrgency, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchChallenges();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">
            Innovation Discovery
          </span>
          <h1 className="text-3xl font-black text-slate-900">Explore Societal Challenges</h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse and search 300+ grassroots challenges across all 24 districts in Jharkhand
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl self-start">
          <span className="font-bold text-slate-900">{total}</span> Challenges Available
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search problems, keywords (e.g. pump, arsenic, school, electricity)..."
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue transition"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-brand-blue hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition"
          >
            Search
          </button>
        </form>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">District</label>
            <select
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setPage(1);
              }}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-700 outline-none"
            >
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d === 'ALL' ? 'All Districts' : d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Domain</label>
            <select
              value={selectedDomain}
              onChange={(e) => {
                setSelectedDomain(e.target.value);
                setPage(1);
              }}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-700 outline-none"
            >
              {DOMAINS.map((d) => (
                <option key={d} value={d}>
                  {d === 'ALL' ? 'All Domains' : d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Urgency</label>
            <select
              value={selectedUrgency}
              onChange={(e) => {
                setSelectedUrgency(e.target.value);
                setPage(1);
              }}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-700 outline-none"
            >
              <option value="ALL">All Urgencies</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Challenge Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-slate-400">Loading innovation radar...</div>
      ) : challenges.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 shadow-soft">
          <Compass className="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-700">No challenges matched your filter criteria</h3>
          <p className="text-xs text-slate-400 mt-1">Try resetting the district or domain filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {challenges.map((c) => (
            <ChallengeCard key={c.id} challenge={c} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > 24 && (
        <div className="flex items-center justify-between pt-6 border-t border-slate-200">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 border border-slate-200 rounded-xl bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-30 transition"
          >
            Previous
          </button>
          <span className="text-xs text-slate-500">
            Page {page} of {Math.ceil(total / 24)}
          </span>
          <button
            disabled={page >= Math.ceil(total / 24)}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 border border-slate-200 rounded-xl bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-30 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
