import React, { useEffect, useState } from 'react';
import { Search, Filter, Compass, MapPin, Layers, Sparkles } from 'lucide-react';
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

const FALLBACK_CHALLENGES: Challenge[] = [
  {
    id: 'JH-RNC-1001',
    citizen_id: 'USER-CITIZEN-1',
    citizen_name: 'Budheshwar Mahto',
    title: 'Irrigation pump frequently stops because of voltage fluctuations',
    description: 'Agricultural water pump motors in Kanke block continuously trip and overheat due to voltage drop between 140V-260V during peak evening pumping hours, causing crop dehydration.',
    district: 'Ranchi',
    block: 'Kanke',
    village_locality: 'Arsande',
    latitude: 23.435,
    longitude: 85.321,
    primary_domain: 'Agriculture',
    urgency: 'high',
    priority_score: 88,
    affected_population: 1800,
    status: 'IN_PROJECT',
    created_at: '2024-01-12T10:00:00Z',
    updated_at: '2024-02-10T10:00:00Z',
  },
  {
    id: 'JH-DHN-1002',
    citizen_id: 'USER-CITIZEN-2',
    citizen_name: 'Sunita Devi',
    title: 'High particulate coal dust pollution around mining corridor primary school',
    description: 'Ambient PM10 and PM2.5 levels exceed safe thresholds by 400% during open-cast transport hours, causing chronic respiratory distress in 450 school children.',
    district: 'Dhanbad',
    block: 'Jharia',
    village_locality: 'Lodna',
    latitude: 23.742,
    longitude: 86.417,
    primary_domain: 'Environment',
    urgency: 'critical',
    priority_score: 94,
    affected_population: 3200,
    status: 'VALIDATED',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z',
  },
  {
    id: 'JH-ES-1003',
    citizen_id: 'USER-CITIZEN-3',
    citizen_name: 'Mangal Soren',
    title: 'Fluoride and heavy metal contamination in tribal hamlets drinking tubewells',
    description: 'Groundwater testing reveals fluoride concentrations exceeding 3.5 mg/L causing skeletal fluorosis and dental staining among 2,100 villagers in Potka.',
    district: 'East Singhbhum',
    block: 'Potka',
    village_locality: 'Haldipokhar',
    latitude: 22.617,
    longitude: 86.223,
    primary_domain: 'Water Resources',
    urgency: 'critical',
    priority_score: 96,
    affected_population: 2100,
    status: 'VALIDATED',
    created_at: '2024-01-18T10:00:00Z',
    updated_at: '2024-01-22T10:00:00Z',
  },
  {
    id: 'JH-BOK-1004',
    citizen_id: 'USER-CITIZEN-4',
    citizen_name: 'Rajesh Kumar',
    title: 'Frequent transformer burnouts disabling community water filtration kiosks',
    description: 'Unstabilized distribution grid surges cause repetitive step-down transformer burnouts, leaving 3,500 residents without potable RO water for weeks.',
    district: 'Bokaro',
    block: 'Chas',
    village_locality: 'Sector 4',
    latitude: 23.669,
    longitude: 86.151,
    primary_domain: 'Energy',
    urgency: 'high',
    priority_score: 84,
    affected_population: 3500,
    status: 'IN_PROJECT',
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-02-01T10:00:00Z',
  },
  {
    id: 'JH-DUM-1005',
    citizen_id: 'USER-CITIZEN-5',
    citizen_name: 'Basanti Murmu',
    title: 'Manual lac scraping causing hand injuries and low yield for tribal SHG women',
    description: 'Traditional knife scraping of sticklac from Ber/Kusum host trees leads to high wastage (22%) and frequent lacerations among 850 tribal women artisans.',
    district: 'Dumka',
    block: 'Ranishwar',
    village_locality: 'Durgapur',
    latitude: 24.268,
    longitude: 87.249,
    primary_domain: 'Rural Livelihoods',
    urgency: 'medium',
    priority_score: 79,
    affected_population: 850,
    status: 'VALIDATED',
    created_at: '2024-01-22T10:00:00Z',
    updated_at: '2024-01-25T10:00:00Z',
  },
  {
    id: 'JH-HAZ-1006',
    citizen_id: 'USER-CITIZEN-6',
    citizen_name: 'Dr. Anita Roy',
    title: 'Lack of cold-chain telemetry leading to vaccine spoilage at remote PHCs',
    description: 'Intermittent power outages at sub-divisional health centers result in unnoticed refrigerator temperature spikes, risking diphtheria and measles vaccine efficacy.',
    district: 'Hazaribagh',
    block: 'Barhi',
    village_locality: 'Konra',
    latitude: 24.298,
    longitude: 85.421,
    primary_domain: 'Healthcare',
    urgency: 'critical',
    priority_score: 92,
    affected_population: 4800,
    status: 'VALIDATED',
    created_at: '2024-01-25T10:00:00Z',
    updated_at: '2024-01-28T10:00:00Z',
  },
];

export const ChallengeExplorer: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [challenges, setChallenges] = useState<Challenge[]>(FALLBACK_CHALLENGES);
  const [total, setTotal] = useState(FALLBACK_CHALLENGES.length);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

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
      if (res.data && Array.isArray(res.data.challenges) && res.data.challenges.length > 0) {
        setChallenges(res.data.challenges);
        setTotal(res.data.total || res.data.challenges.length);
      } else {
        setIsOffline(true);
        setChallenges(FALLBACK_CHALLENGES);
        setTotal(FALLBACK_CHALLENGES.length);
      }
    } catch (err) {
      console.warn('Backend unavailable, using offline fallback challenges:', err);
      setIsOffline(true);
      setChallenges(FALLBACK_CHALLENGES);
      setTotal(FALLBACK_CHALLENGES.length);
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

  const safeChallenges = Array.isArray(challenges) ? challenges : FALLBACK_CHALLENGES;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {isOffline && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-900">CivicForge Offline Presentation Mode</p>
              <p className="text-[11px] text-amber-700">
                Backend is pending deployment. Displaying curated ground challenges across Jharkhand districts.
              </p>
            </div>
          </div>
          <span className="text-[10px] bg-amber-200/60 text-amber-900 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0">
            Showcase Mode
          </span>
        </div>
      )}

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
      ) : safeChallenges.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 shadow-soft">
          <Compass className="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-700">No challenges matched your filter criteria</h3>
          <p className="text-xs text-slate-400 mt-1">Try resetting the district or domain filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {safeChallenges.map((c) => (
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
