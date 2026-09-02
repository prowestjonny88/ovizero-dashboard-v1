import React from 'react';
import { ZoneData } from '../types';
import { DEVICES, PROPOSED_GATEWAYS } from '../data';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

interface CommandCenterProps {
  zones: ZoneData[];
  onZoneSelect: (zoneId: string) => void;
  onOpenRiskMap?: () => void;
  onNavigateToPriorityZones?: () => void;
}

export default function CommandCenter({ 
  zones, 
  onZoneSelect,
  onOpenRiskMap,
  onNavigateToPriorityZones
}: CommandCenterProps) {

  // Sort zones
  const topPriorityZones = [...zones].sort((a, b) => b.interventionPriority - a.interventionPriority);
  const peakZone = topPriorityZones[0] || zones[0];

  const actionRequiredCount = zones.filter(z => z.demoPriorityBand === 'Critical' || z.demoPriorityBand === 'High' || z.demoPriorityBand === 'Elevated').length;
  const needsAttentionCount = DEVICES.filter(d => d.maintenanceState === 'Maintenance Required' || d.battery < 30).length;
  const totalNodesCount = DEVICES.length;
  const totalGatewaysCount = PROPOSED_GATEWAYS.length;

  const getRiskColor = (status: string) => {
    switch (status) {
      case 'Critical': return '#fee2e2'; // red-100
      case 'High': return '#ffedd5'; // orange-100
      case 'Elevated': return '#fef3c7'; // amber-100
      case 'Watch': return '#dcfce7'; // green-100
      default: return '#f3f4f6';
    }
  };

  const getRiskBorderColor = (status: string) => {
    switch (status) {
      case 'Critical': return '#ef4444'; // red-500
      case 'High': return '#f97316'; // orange-500
      case 'Elevated': return '#f59e0b'; // amber-500
      case 'Watch': return '#22c55e'; // green-500
      default: return '#9ca3af';
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12" id="command-center-container">
      {/* 1. Page Header Intro */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200/60 pb-5">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-[#052e1a] uppercase font-mono mb-1">
            OVERVIEW
          </h1>
          <h2 className="text-sm font-semibold text-zinc-800">
            Simulated mosquito-surveillance workflow
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Mosquito signals and local conditions for field review.
          </p>
        </div>

      </div>

      {/* 2. Dominant Priority Hero */}
      <section className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden flex flex-col md:flex-row">
        {/* Left Column: Decision / Priority */}
        <div className="w-full md:w-3/5 p-8 md:p-10 flex flex-col justify-center space-y-6">
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2 block">
              Highest-Priority Location
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#052e1a] tracking-tight">
                {peakZone.name}
              </h2>
              <span 
                className="px-2.5 py-1 rounded-md text-[10px] font-bold font-mono uppercase tracking-wider border"
                style={{ 
                  backgroundColor: getRiskColor(peakZone.demoPriorityBand), 
                  color: getRiskBorderColor(peakZone.demoPriorityBand),
                  borderColor: getRiskBorderColor(peakZone.demoPriorityBand)
                }}
              >
                {peakZone.demoPriorityBand}
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold text-[#052e1a] font-mono tracking-tighter">
                {peakZone.interventionPriority}
              </span>
              <span className="text-lg text-zinc-400 font-mono">/ 100</span>
            </div>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">
              Illustrative Intervention Priority
            </p>
            <p className="text-[10px] text-zinc-400 font-mono mt-1">
              Stored demo output · not field validated
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenRiskMap}
              className="bg-[#052e1a] hover:bg-[#0b5a31] text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>VIEW ON PRIORITY MAP</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onZoneSelect(peakZone.id)}
              className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-5 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-zinc-200"
            >
              <span>REVIEW &amp; ASSIGN</span>
            </button>
          </div>
        </div>
        
        {/* Right Column: Why this location is prioritised */}
        <div className="w-full md:w-2/5 bg-zinc-50/50 p-8 md:p-10 border-t md:border-t-0 md:border-l border-zinc-200/60 flex flex-col justify-center">
          <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-6">
            Why this location is prioritised
          </h3>
          
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                Egg Activity
              </span>
              <div className="text-xl font-bold font-mono text-zinc-900">
                {peakZone.eggActivityChange}
              </div>
              <p className="text-[10px] text-zinc-400 font-medium mt-0.5">
                7-day synthetic change
              </p>
            </div>
            
            <div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                Local Conditions
              </span>
              <div className="text-xl font-bold font-mono text-zinc-900">
                {peakZone.temperature}°C · {peakZone.humidity}% RH
              </div>
              <p className="text-[10px] text-zinc-400 font-medium mt-0.5">
                Simulated node context
              </p>
            </div>
            
            <div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                Rainfall Context
              </span>
              <div className="text-xl font-bold font-mono text-zinc-900">
                {peakZone.rainfall}
              </div>
              <p className="text-[10px] text-zinc-400 font-medium mt-0.5">
                External demo input
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Compact Operational Summary */}
      <section className="bg-white rounded-xl border border-zinc-200/80 p-4 shadow-sm flex flex-wrap gap-x-8 gap-y-3 justify-center text-xs font-medium text-zinc-600">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-500"></span>
          <span><strong className="text-zinc-900">{actionRequiredCount}</strong> locations need review</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          <span><strong className="text-zinc-900">{needsAttentionCount}</strong> device needs attention</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          <span><strong className="text-zinc-900">{totalNodesCount}</strong> simulated nodes</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
          <span><strong className="text-zinc-900">{totalGatewaysCount}</strong> proposed gateway</span>
        </div>
      </section>

      {/* 5. Top Priority Locations */}
      <section className="bg-white rounded-xl border border-zinc-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
          <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-800">
            Top Priority Locations
          </h3>
        </div>
        <div className="divide-y divide-zinc-100">
          {topPriorityZones.slice(0, 3).map((zone, idx) => (
            <div 
              key={zone.id} 
              onClick={() => onZoneSelect(zone.id)}
              className="flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono font-bold text-zinc-400 w-4">
                  0{idx + 1}
                </span>
                <span className="text-sm font-semibold text-zinc-900 group-hover:text-[#052e1a] transition-colors">
                  {zone.name}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-mono font-bold text-[#052e1a]">
                  {zone.interventionPriority}
                </span>
                <span 
                  className="px-2 py-0.5 rounded text-[9px] font-bold font-mono uppercase tracking-wider border w-20 text-center"
                  style={{ 
                    backgroundColor: getRiskColor(zone.demoPriorityBand), 
                    color: getRiskBorderColor(zone.demoPriorityBand),
                    borderColor: getRiskBorderColor(zone.demoPriorityBand)
                  }}
                >
                  {zone.demoPriorityBand}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Simple System Story */}
      <section className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider py-8">
        <span>Signal</span>
        <ArrowRight className="w-3 h-3 text-zinc-300" />
        <span>Explain</span>
        <ArrowRight className="w-3 h-3 text-zinc-300" />
        <span className="text-zinc-600">Prioritise</span>
        <ArrowRight className="w-3 h-3 text-zinc-300" />
        <span>Assign</span>
        <ArrowRight className="w-3 h-3 text-zinc-300" />
        <span>Follow Up</span>
      </section>
      
    </div>
  );
}
