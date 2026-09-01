import ScenarioPeriodLabel from "./ScenarioPeriodLabel";
import React from 'react';
import { ZoneData, InterventionMap, InterventionStatus } from '../types';
import { getTopPriorityZones, getInterventionForZone, getPilotDisplayLocationForMetricZone } from '../utils/dashboard';
import { PILOT_NODES } from '../data';
import InterventionStatusBadge from './interventions/InterventionStatusBadge';
import { 
  CheckCircle, 
  TrendingUp, 
  Clock, 
  Activity, 
  Compass, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface PriorityZonesProps {
  zones: ZoneData[];
  interventions: InterventionMap;
  onZoneSelect: (zoneId: string) => void;
  
}

export default function PriorityZones({ 
  zones, 
  interventions, 
  onZoneSelect,
}: PriorityZonesProps) {
  
  // Rank mock profiles by illustrative scenario index descending
  const sortedZones = getTopPriorityZones(zones, zones.length);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Page Header Info */}
      <section className="bg-white p-6 rounded-xl border border-zinc-200/50 shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Intervention Planning</span>
          <h1 className="text-xl font-extrabold text-zinc-950 tracking-tight mt-1">Intervention Priority Matrix</h1>
          <p className="text-xs text-zinc-500 font-medium mt-1 mb-2">
            Priority ordering uses simulated scenario values and provisional interface bands.
          </p>
          <ScenarioPeriodLabel  mode="selected-period" />
        </div>
        <div className="flex items-center gap-2 bg-zinc-50 px-3.5 py-2 rounded-lg border border-zinc-150 text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider">
          <Compass className="w-4 h-4 text-zinc-400" />
          <span>Ranked by illustrative scenario index</span>
        </div>
      </section>

      {/* Priority Matrix List */}
      <div className="space-y-4">
        {sortedZones.length === 0 ? (
          <div className="bg-white rounded-xl border border-zinc-200/50 p-12 text-center shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex flex-col items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-zinc-300 mb-3" />
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-1">No Priority Zones</h3>
            <p className="text-xs text-zinc-500 max-w-[250px] font-medium">
              No priority zones are available.
            </p>
          </div>
        ) : (
          sortedZones.map((zone, index) => {
            const priorityRank = index + 1;
            const isCritical = zone.demoPriorityBand === 'Critical' || zone.demoPriorityBand === 'High';
            const intervention = getInterventionForZone(zone.id, interventions);
            const loc = getPilotDisplayLocationForMetricZone(zone.id, PILOT_NODES, zones);
            const displayName = loc ? `${loc.parentZone} · ${loc.sublocation}` : zone.name;

          return (
            <div 
              key={zone.id}
              onClick={() => onZoneSelect(zone.id)}
              className={`bg-white rounded-xl border transition-all duration-300 cursor-pointer hover:border-zinc-950 hover:shadow-md relative overflow-hidden group shadow-[0_1px_2px_rgba(0,0,0,0.01)] ${
                isCritical ? 'border-zinc-950' : 'border-zinc-200/55'
              }`}
            >
              {/* Left Rank Accent Strip */}
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                isCritical ? 'bg-zinc-950' : 'bg-zinc-300'
              }`}></div>

              {/* Priority Rank Visual Label */}
              <div className="absolute top-4 right-4 flex items-center gap-3">
                <InterventionStatusBadge status={intervention?.status} />
                <span className="font-mono text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider bg-zinc-50 px-2 py-1 rounded border border-zinc-150">
                  PR-{priorityRank}
                </span>
              </div>

              <div className="p-6 pl-8">
                
                {/* Title & Metadata row */}
                <div className="mb-4 max-w-[70%]">
                  <h3 className="text-sm font-extrabold text-zinc-950 tracking-tight group-hover:underline">
                    {displayName}
                  </h3>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 items-center mt-1 text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                    <span className="text-zinc-500">Illustrative candidate signal &mdash; not classified</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-200"></span>
                    <span>Match score: not calibrated</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-200"></span>
                    <span>Temp: {zone.temperature}°C</span>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-t border-b border-zinc-100 my-4 text-xs font-medium text-zinc-500">
                  
                  <div>
                    <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Illustrative scenario index</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold text-zinc-950 font-geist">{zone.interventionPriority}</span>
                      <span className="text-[10px] font-mono text-zinc-400 font-bold">/100</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Mock Growth</span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="text-xl font-bold text-zinc-950 font-mono">{zone.eggActivityChange}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Illustrative action window</span>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span className="font-bold text-zinc-950 font-mono text-sm">{'48 hours'}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Risk band</span>
                    <span className={`inline-block font-extrabold uppercase tracking-widest text-[8px] mt-1.5 ${
                      zone.demoPriorityBand === 'Critical' 
                        ? 'text-zinc-950 font-black' 
                        : 'text-zinc-500'
                    }`}>
                      {zone.demoPriorityBand}
                    </span>
                  </div>

                </div>

                {/* Action details & instructions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs">
                  <div className="flex-1">
                    <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest block mb-0.5">Recommended Action</span>
                    <p className="text-zinc-600 font-medium leading-relaxed max-w-2xl">
                      {zone.actionRequired}. Inspect drainage, remove stagnant containers, document findings, and schedule follow-up verification.
                    </p>
                  </div>
                  
                  <div className="shrink-0 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-950 group-hover:translate-x-1 transition-transform self-end md:self-auto">
                    <span>Open Zone Analysis</span>
                    <ChevronRight className="w-4 h-4 text-zinc-950" />
                  </div>
                </div>

                {/* Simulated intervention status sub-panel */}
                {intervention && (
                  <div className="mt-4 pt-3.5 border-t border-zinc-100/80 bg-zinc-50/50 -mx-6 -mb-6 px-6 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-[10px] font-medium text-zinc-500">
                                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                      <div>
                        <span className="text-zinc-400 uppercase text-[8px] tracking-wider block">Assigned Team</span>
                        <span className="font-bold text-zinc-800">{intervention.assignedTeam || 'Pending'}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 uppercase text-[8px] tracking-wider block">Created</span>
                        <span className="font-bold text-zinc-800">{new Date(intervention.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                    {['Action Completed', 'Awaiting Verification', 'Activity decreased', 'Little/no change', 'Escalated'].includes(intervention.status) ? (
                      <div className="flex items-center gap-1.5 text-zinc-600 font-semibold bg-white border border-zinc-200 px-2.5 py-1 rounded-lg">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#052e1a] shrink-0" />
                        <span>Workflow status: {intervention.status}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-zinc-950 font-bold uppercase tracking-wider animate-pulse">
                        <Activity className="w-3.5 h-3.5" />
                        <span>Active: {intervention.status}</span>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          );
        })
        )}
      </div>

    </div>
  );
}
