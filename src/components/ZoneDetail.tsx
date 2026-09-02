import React from 'react';
import { getInterventionForZone, getPilotDisplayLocationForMetricZone } from '../utils/dashboard';
import { PILOT_NODES, ZONES } from '../data';
import InterventionWorkflowPanel from './interventions/InterventionWorkflowPanel';
import VerificationPanel from './interventions/VerificationPanel';
import InterventionStatusBadge from './interventions/InterventionStatusBadge';
import { ZoneData, InterventionMap } from '../types';
import { 
  ArrowLeft, 
  AlertTriangle, 
  TrendingUp,
} from 'lucide-react';
import { InterventionStatus, InterventionTransitionPayload, VerificationOutcome, InterventionVerificationMap, InterventionVerification } from '../types';

interface ZoneDetailProps {
  zone: ZoneData | null;
  zones: ZoneData[];
  onBackToCommandCenter: () => void;
  onZoneChange: (zoneId: string) => void;
  onCreateIntervention: (zoneId: string) => void;
  onInterventionTransition: (zoneId: string, status: InterventionStatus, payload: InterventionTransitionPayload) => void;
  onRecordVerification: (
    zoneId: string,
    verification: InterventionVerification
  ) => void;
  interventions: InterventionMap;
  verifications: InterventionVerificationMap;
  
}

export default function ZoneDetail({ 
  zone, 
  zones, 
  onBackToCommandCenter, 
  onZoneChange,
  onCreateIntervention,
  onInterventionTransition,
  onRecordVerification,
  interventions,
  verifications,
}: ZoneDetailProps) {
  
  const loc = zone ? getPilotDisplayLocationForMetricZone(zone.id, PILOT_NODES, zones) : null;
  const displayName = loc 
    ? (loc.parentZone === loc.sublocation ? loc.parentZone : `${loc.parentZone} · ${loc.sublocation}`) 
    : zone?.name;

  const getDisplayLocation = (zId: string, fallback: string) => {
    const l = getPilotDisplayLocationForMetricZone(zId, PILOT_NODES, zones);
    return l ? l.sublocation : fallback;
  };

  const activeIntervention = zone ? getInterventionForZone(zone.id, interventions) : null;

  if (!zone) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center max-w-7xl mx-auto">
        <AlertTriangle className="w-10 h-10 text-zinc-300 mb-4" />
        <h2 className="text-xl font-extrabold text-zinc-950 tracking-tight mb-2">Location not found</h2>
        <p className="text-sm text-zinc-500 mb-6 font-medium max-w-sm">
          This location is unavailable.
        </p>
        <button 
          onClick={onBackToCommandCenter}
          className="bg-zinc-950 text-white px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-zinc-800 cursor-pointer shadow-sm"
        >
          Return to Field Actions
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* 1. Header Navigation & Dropdown selector */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-200/50 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <button 
              onClick={onBackToCommandCenter}
              className="text-zinc-500 hover:text-black flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest transition-colors active:scale-98"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Field Actions
            </button>
          </div>
          
          <div className="flex items-center gap-3.5">
            <h2 className="text-xl font-bold tracking-tight text-black">{displayName}</h2>
            
            <select
              value={zone.id}
              onChange={(e) => onZoneChange(e.target.value)}
              className="text-[9px] font-bold uppercase tracking-wider bg-zinc-50 border border-zinc-200/50 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-zinc-950 text-zinc-900 cursor-pointer"
            >
              {zones.map(z => (
                <option key={z.id} value={z.id}>{getDisplayLocation(z.id, z.name)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Status indicator */}
        <div className="text-right flex flex-col items-end gap-1.5">
          <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mb-1.5">
            Field action status
          </p>
          <InterventionStatusBadge status={activeIntervention?.status} />
        </div>
      </section>

      {/* Context Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm">
          <h3 className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Illustrative Intervention Priority</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-zinc-950">{zone.interventionPriority}</span>
            <span className="text-xs font-bold text-zinc-500">/ 100</span>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 mt-1 block">{zone.demoPriorityBand} Band</span>
        </div>
        
        <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm">
          <h3 className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Synthetic egg activity</h3>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-zinc-950">{zone.syntheticEggActivity}</span>
            <span className="text-sm font-bold text-zinc-500">demo eggs</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-xs font-bold text-zinc-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{zone.eggActivityChange} &middot; 7-day synthetic change</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm">
          <h3 className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Local Conditions</h3>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-zinc-600">
              <span className="font-bold">Temperature</span>
              <span>{zone.temperature}°C</span>
            </div>
            <div className="flex justify-between text-xs text-zinc-600">
              <span className="font-bold">Humidity</span>
              <span>{zone.humidity}%</span>
            </div>
            <div className="flex justify-between text-xs text-zinc-600">
              <div className="flex flex-col">
                <span className="font-bold">Rainfall</span>
                <span className="text-[9px] text-zinc-400 mt-0.5">External demo input</span>
              </div>
              <span>{zone.rainfall}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6 mt-10">
        <InterventionWorkflowPanel 
          zone={zone}
          record={activeIntervention}
          onCreate={() => onCreateIntervention(zone.id)}
          onTransition={(status, payload) => onInterventionTransition(zone.id, status, payload)}
        />
        <VerificationPanel
          zone={zone}
          intervention={activeIntervention}
          verification={verifications[zone.id] ?? null}
          onSave={(verification) => onRecordVerification(zone.id, verification)}
        />
      </section>
 
    </div>
  );
}
