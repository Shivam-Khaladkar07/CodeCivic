import React, { useEffect, useState } from 'react';
import { DistrictMap } from '../../components/map/DistrictMap';
import { challengesApi } from '../../services/api';
import { Challenge } from '../../types';
import { MapPin, Users, Shield, Layers, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const GeospatialRadar: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Ranchi');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const res = await challengesApi.getAll({ limit: 300 });
        setChallenges(res.data.challenges);
      } catch (err) {
        console.error('Failed to load challenges for radar:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChallenges();
  }, []);

  const districtChallenges = challenges.filter(
    (c) => c.district.toLowerCase() === selectedDistrict.toLowerCase()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">
            Geospatial Decision System
          </span>
          <h1 className="text-3xl font-black text-slate-900">
            Jharkhand District Innovation Radar
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time geospatial plotting of 300+ ground incidents, priority hot spots, and active pilots.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-blue-50 text-brand-blue border border-blue-200 px-3 py-1.5 rounded-xl font-bold self-start">
          <MapPin className="h-4 w-4" />
          <span>Showing {selectedDistrict} Sector</span>
        </div>
      </div>

      {/* Map Component */}
      <div className="space-y-4">
        <DistrictMap
          challenges={challenges}
          height="540px"
          selectedDistrict={selectedDistrict}
          onSelectDistrict={(d) => setSelectedDistrict(d === 'ALL' ? 'Ranchi' : d)}
        />
      </div>

      {/* District Highlights Drawer */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              District Deep Dive: {selectedDistrict}
            </h3>
            <p className="text-xs text-slate-500">
              {districtChallenges.length} active challenges reported in this administrative zone
            </p>
          </div>
          <Link
            to={`/challenges?district=${selectedDistrict}`}
            className="text-xs font-bold text-brand-blue flex items-center gap-1"
          >
            View All in {selectedDistrict} <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {districtChallenges.slice(0, 6).map((c) => (
            <Link
              key={c.id}
              to={`/challenge/${c.id}`}
              className="p-3 bg-slate-50 hover:bg-blue-50/50 rounded-2xl border border-slate-200/80 transition block space-y-1"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-mono font-bold text-slate-500">{c.id}</span>
                <span className="font-semibold text-brand-blue">{c.primary_domain}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{c.title}</h4>
              <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1">
                <span>{c.village_locality}</span>
                <span className="font-semibold text-slate-700">~{c.affected_population} pop</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
