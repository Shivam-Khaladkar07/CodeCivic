import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Challenge } from '../../types';
import { MapPin, Users, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PriorityBadge } from '../common/PriorityBadge';

interface DistrictMapProps {
  challenges: Challenge[];
  height?: string;
  selectedDistrict?: string;
  onSelectDistrict?: (dist: string) => void;
}

// Custom colored leaflet marker icon generator
const createMarkerIcon = (urgency: string, isGolden = false) => {
  let color = '#0284C7'; // Blue
  if (urgency === 'critical') color = '#EF4444'; // Red
  else if (urgency === 'high') color = '#F59E0B'; // Amber
  if (isGolden) color = '#7C3AED'; // Purple highlight for golden scenario

  const svg = `
    <svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 0C6.268 0 0 6.268 0 14C0 24.5 14 36 14 36C14 36 28 24.5 28 14C28 6.268 21.732 0 14 0Z" fill="${color}"/>
      <circle cx="14" cy="14" r="6" fill="white"/>
    </svg>
  `;

  return L.divIcon({
    html: svg,
    className: 'custom-leaflet-marker',
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -32],
  });
};

export const DistrictMap: React.FC<DistrictMapProps> = ({
  challenges,
  height = '500px',
  selectedDistrict,
  onSelectDistrict,
}) => {
  const [districtFilter, setDistrictFilter] = useState<string>(selectedDistrict || 'ALL');

  const filtered = challenges.filter((c) => {
    if (districtFilter === 'ALL') return true;
    return c.district.toLowerCase() === districtFilter.toLowerCase();
  });

  const districts = Array.from(new Set(challenges.map((c) => c.district))).sort();

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-soft bg-white">
      {/* Map Filter Toolbar */}
      <div className="p-3 bg-white/95 backdrop-blur border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-brand-blue" />
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Jharkhand Geospatial Innovation Radar
          </span>
          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
            {filtered.length} Challenges Active
          </span>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={districtFilter}
            onChange={(e) => {
              setDistrictFilter(e.target.value);
              if (onSelectDistrict) onSelectDistrict(e.target.value);
            }}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-medium focus:ring-2 focus:ring-brand-blue outline-none"
          >
            <option value="ALL">All 24 Jharkhand Districts</option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Legend */}
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-600 pl-2 border-l border-slate-200">
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500 inline-block"></span> Critical
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500 inline-block"></span> High
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-brand-blue inline-block"></span> Standard
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-purple-600 inline-block"></span> Golden Pilot
            </span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div style={{ height, width: '100%' }}>
        <MapContainer
          center={[23.6102, 85.2799]} // Center of Jharkhand State
          zoom={7}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filtered.slice(0, 150).map((c) => {
            const isGolden = c.id === 'JH-RNC-1001';
            return (
              <Marker
                key={c.id}
                position={[c.latitude, c.longitude]}
                icon={createMarkerIcon(c.urgency, isGolden)}
              >
                <Popup className="custom-leaflet-popup">
                  <div className="p-1 min-w-[240px]">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-mono font-bold text-slate-500">{c.id}</span>
                      <PriorityBadge score={c.priority_score} size="sm" showLabel={false} />
                    </div>
                    <div className="text-[10px] font-bold text-brand-blue uppercase tracking-wider mb-0.5">
                      {c.primary_domain}
                    </div>
                    <h5 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2 mb-1">
                      {c.title}
                    </h5>
                    <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100 mb-2">
                      <span>{c.district}</span>
                      <span className="flex items-center gap-0.5 text-slate-700 font-semibold">
                        <Users className="h-3 w-3 text-slate-400" />
                        ~{c.affected_population} pop
                      </span>
                    </div>
                    <Link
                      to={`/challenge/${c.id}`}
                      className="w-full flex items-center justify-center gap-1 text-[11px] bg-brand-blue text-white py-1 px-2 rounded-md font-semibold hover:bg-blue-700 transition"
                    >
                      Inspect Challenge <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};
