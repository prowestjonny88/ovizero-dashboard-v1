import re

with open('src/components/PriorityZones.tsx', 'r') as f:
    content = f.read()

# Replace Header and subtitle
content = content.replace("Intervention Priority Matrix", "FIELD ACTIONS")
content = content.replace("Sort zones by synthetic index or operational action window.", "Human-reviewed inspection, assignment and follow-up workflow.")

# Add Process Strip
process_strip = """      <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
"""
content = re.sub(r'\{/\* Priority Matrix List \*/\}', process_strip + '\n      {/* Priority Matrix List */}', content)

# Modify Empty State
content = content.replace("No Priority Zones", "No Priority Locations")
content = content.replace("No priority zones are available.", "No priority locations are available.")


# Find the map body and replace the whole card.
start_marker = "const displayName = loc ? `${loc.parentZone} · ${loc.sublocation}` : zone.name;"
end_marker = "        })\n        )}\n      </div>"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

new_card = """const displayName = loc ? `${loc.parentZone} · ${loc.sublocation}` : zone.name;
            
            // Map internal intervention status to the 4 stages for display
            let currentStage = 'Needs review';
            if (intervention) {
              if (intervention.status === 'New Alert') currentStage = 'Needs review';
              else if (intervention.status === 'Reviewed' || intervention.status === 'Assigned' || intervention.status === 'On Site') currentStage = 'Assigned / Field work';
              else if (intervention.status === 'Action Completed' || intervention.status === 'Awaiting Verification') currentStage = 'Record follow-up';
              else currentStage = 'Follow-up recorded';
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
                      {intervention && <span className="text-[9px] text-zinc-500 block mt-1">Status: {intervention.status}</span>}
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
                      {zone.actionRequired ? zone.actionRequired.charAt(0).toLowerCase() + zone.actionRequired.slice(1) : "review nearby breeding sources and assign a field assessment."}
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
"""

content = content[:start_idx] + new_card + content[end_idx:]

with open('src/components/PriorityZones.tsx', 'w') as f:
    f.write(content)

