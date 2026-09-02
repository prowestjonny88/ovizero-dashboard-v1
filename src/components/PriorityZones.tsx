import React from 'react';
import { getInterventionDisplayStatus } from '../utils/interventionWorkflow';
import { ZoneData, InterventionMap } from '../types';
import { getTopPriorityZones, getInterventionForZone, getPilotDisplayLocationForMetricZone } from '../utils/dashboard';
import { PILOT_NODES } from '../data';
import { 
  Compass,
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
          <h1 className="text-xl font-extrabold text-zinc-950 tracking-tight mt-1">FIELD ACTIONS</h1>
          <p className="text-xs text-zinc-500 font-medium mt-1 mb-2">
            Review, assign, record action, and follow up.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-zinc-50 px-3.5 py-2 rounded-lg border border-zinc-150 text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider">
          <Compass className="w-4 h-4 text-zinc-400" />
          <span>Highest demo priority first</span>
        </div>
      </section>

            <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 lg:gap-4 overflow-x-auto whitespace-nowrap scrollbar-hidden w-full text-xs font-bold text-zinc-500 uppercase tracking-widest">
          <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-[#e8f4ed] text-[#052e1a] flex items-center justify-center font-mono text-[10px]">1</div>REVIEW</div>
          <div className="w-8 h-px bg-zinc-200 hidden sm:block"></div>
          <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-[#e8f4ed] text-[#052e1a] flex items-center justify-center font-mono text-[10px]">2</div>ASSIGN</div>
          <div className="w-8 h-px bg-zinc-200 hidden sm:block"></div>
          <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-[#e8f4ed] text-[#052e1a] flex items-center justify-center font-mono text-[10px]">3</div>RECORD ACTION</div>
          <div className="w-8 h-px bg-zinc-200 hidden sm:block"></div>
          <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-[#e8f4ed] text-[#052e1a] flex items-center justify-center font-mono text-[10px]">4</div>RECORD FOLLOW-UP</div>
        </div>
      </div>

      {/* Priority Matrix List */}
      <div className="space-y-4">
        {sortedZones.length === 0 ? (
          <div className="bg-white rounded-xl border border-zinc-200/50 p-12 text-center shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex flex-col items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-zinc-300 mb-3" />
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-1">No Priority Locations</h3>
            <p className="text-xs text-zinc-500 max-w-[250px] font-medium">
              No priority locations are available.
            </p>
          </div>
        ) : (
          sortedZones.map((zone, index) => {
            const priorityRank = index + 1;
            const isCritical = zone.demoPriorityBand === 'Critical' || zone.demoPriorityBand === 'High';
            const intervention = getInterventionForZone(zone.id, interventions);
            const loc = getPilotDisplayLocationForMetricZone(zone.id, PILOT_NODES, zones);
            const displayName = (loc && loc.parentZone !== loc.sublocation) ? `${loc.parentZone} · ${loc.sublocation}` : (loc?.parentZone || zone.name);
            
            // Map internal intervention status to the 4 stages for display
            let currentStage = 'Needs review';
            if (intervention) {
              if (intervention.status === 'New Alert') currentStage = 'Needs review';
              else if (intervention.status === 'Reviewed') currentStage = 'Ready to assign';
              else if (intervention.status === 'Assigned' || intervention.status === 'On Site') currentStage = 'Field action in progress';
              else if (intervention.status === 'Action Completed' || intervention.status === 'Awaiting Verification') currentStage = 'Follow-up required';
              else currentStage = 'Follow-up recorded';
            }

            let nextStepText = "Review location and add a note.";
            if (intervention) {
              if (intervention.status === 'New Alert') nextStepText = "Review location and add a note.";
              else if (intervention.status === 'Reviewed') nextStepText = "Assign team and action.";
              else if (intervention.status === 'Assigned' || intervention.status === 'On Site') nextStepText = "Record field findings and action.";
              else if (intervention.status === 'Action Completed' || intervention.status === 'Awaiting Verification') nextStepText = "Record follow-up observation.";
              else if (intervention.status === 'Escalated') nextStepText = "Review again before further action.";
              else nextStepText = "Follow-up recorded.";
            }

            return (
              <div 
                key={zone.id}
                className="bg-white rounded-xl border border-zinc-200 shadow-sm flex flex-col md:flex-row overflow-hidden relative"
              >
                {/* Left accent */}
                <div className={`w-1.5 shrink-0 ${isCritical ? 'bg-zinc-950' : 'bg-zinc-300'}`}></div>
                
                <div className="flex flex-col md:flex-row flex-1 p-4 sm:p-5 gap-4">
                  {/* Column 1: Location & Context */}
                  <div className="flex-1 min-w-[200px]">
                    <h3 className="text-sm font-extrabold text-zinc-950 tracking-tight mb-1">{displayName}</h3>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      <span className="font-mono text-zinc-900">{zone.interventionPriority}/100</span>
                      <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                      <span>{zone.demoPriorityBand} demo priority</span>
                    </div>
                  </div>
                  
                  {/* Column 2: Stage & Owner */}
                  <div className="flex-1 min-w-[150px]">
                    <div className="mb-3">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block mb-0.5">Current Stage</span>
                      <span className="text-xs font-bold text-[#052e1a] bg-[#e8f4ed] px-2 py-0.5 rounded-sm inline-block">{currentStage}</span>
                      {intervention && <span className="text-[9px] text-zinc-500 block mt-1">Status: {getInterventionDisplayStatus(intervention.status)}</span>}
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block mb-0.5">Assigned Team</span>
                      <span className="text-xs font-medium text-zinc-800">{intervention?.assignedTeam || 'Pending'}</span>
                    </div>
                  </div>
                  
                  {/* Column 3: Next Step */}
                  <div className="flex-1 min-w-[200px]">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block mb-0.5">Next step</span>
                    <p className="text-xs font-medium text-zinc-600 leading-relaxed">
                      {nextStepText}
                    </p>
                  </div>
                  
                  {/* Column 4: CTA */}
                  <div className="shrink-0 flex items-center justify-start md:justify-end md:pl-4 mt-2 md:mt-0">
                    <button
                      onClick={() => onZoneSelect(zone.id)}
                      className={`px-4 py-2.5 text-xs font-bold rounded-lg transition-colors cursor-pointer w-full md:w-auto ${
                        intervention 
                          ? 'bg-white text-zinc-800 border border-zinc-200 hover:bg-zinc-50 shadow-xs' 
                          : 'bg-[#052e1a] text-white hover:bg-[#0b5a31] shadow-xs'
                      }`}
                    >
                      {intervention ? 'OPEN ACTION' : 'REVIEW & ASSIGN'}
                    </button>
                  </div>
                </div>
              </div>
            );
        })
        )}
      </div>

    </div>
  );
}
