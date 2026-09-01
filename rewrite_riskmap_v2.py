import re

with open('src/components/RiskMap.tsx', 'r') as f:
    content = f.read()

# Replace the No Match State
content = content.replace("No OviZero Devices Match", "No locations match")
content = content.replace("No OviZero devices match the current risk filter.", "No locations match the current priority filter.")

# Replace Map Legend Credibility
content = content.replace("One node represents one physical OviZero monitoring device.", "One map marker represents one simulated OviZero node record.")
content = content.replace("illustrative pilot deployment envelope", "illustrative scenario envelope")
content = content.replace("The outline follows the five mock device placements and does not represent validated surveillance coverage.", "The outline follows the five simulated node placements and does not represent validated surveillance coverage.")

# Remove unused imports and components
content = re.sub(r'import\s+ScenarioPeriodLabel\s+from\s+"[^"]+";?\n?', '', content)
content = re.sub(r'import\s+ScenarioPeriodLabel\s+from\s+\'[^\']+\';?\n?', '', content)
content = re.sub(r',\s*getTrendBucket', '', content)
content = re.sub(r'getTrendBucket,\s*', '', content)

# Also remove the Accordion component definition as it's unused now.
content = re.sub(r'\s*const Accordion = \(\{ title, id, children \}:.*?</button>\s*<div className=\{`p-3 lg:p-0 \$\{isOpen \? \'block\' : \'hidden lg:block\'\}`\}>\s*<div className="hidden lg:flex items-center gap-1\.5 mb-3 text-\[9px\] font-bold uppercase tracking-wider text-zinc-400">\s*\{title\}\s*</div>\s*\{children\}\s*</div>\s*</div>\s*\);\s*};\s*', '\n', content, flags=re.DOTALL)

# Let's replace the whole selectedVM section.
# We'll use a regex to capture everything from {!selectedVM ? ( ... to the end of the panel.
import sys

# It's easier to find the exact start and end of the right col.
start_marker = '<div className="lg:col-span-4 flex flex-col space-y-4">'
# End of right col is just before {/* Bottom Summary Strip */}
end_marker = '{/* Bottom Summary Strip */}'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print("Could not find markers")
    sys.exit(1)

new_right_col = """<div className="lg:col-span-4 flex flex-col space-y-4">
          {!selectedVM ? (
            <div className="bg-white border border-zinc-200/60 rounded-xl p-8 shadow-xs flex flex-col items-center justify-center text-center h-full min-h-[300px]">
              <MapPin className="w-8 h-8 text-zinc-300 mb-3" />
              <h3 className="text-sm font-bold text-zinc-700">No locations match</h3>
              <p className="text-[10px] text-zinc-500 mt-2 max-w-[200px] mb-4">No locations match the current priority filter.</p>
              <button onClick={() => setActiveFilter('ALL')} className="px-4 py-2 bg-[#052e1a] text-white text-xs font-bold rounded-lg shadow-sm hover:bg-[#0b5a31] transition-colors cursor-pointer">
                Reset Filter
              </button>
            </div>
          ) : (
          <div className="flex flex-col">
            {mapMode === 'network' ? (
              <div className="bg-white lg:border border-zinc-200/60 lg:rounded-xl lg:p-4 shadow-sm lg:shadow-xs mb-4">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2 block">
                  Selected Node
                </span>
                <h3 className="text-2xl font-extrabold text-[#052e1a] tracking-tight">{selectedVM.parentZoneName}</h3>
                <p className="text-xs text-zinc-500 mt-0.5 font-mono">Node {selectedVM.deviceId}</p>
                
                <div className="mt-6 pt-4 border-t border-zinc-200/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-3">
                    PROPOSED LORAWAN TOPOLOGY
                  </span>
                  <div className="space-y-2 p-3 rounded-lg border border-[#1b7f47]/20 bg-[#f8fcf9] mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-zinc-500">Proposed gateway</span>
                      <span className="text-xs font-mono font-bold text-zinc-900">{selectedVM.gateway?.id || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-zinc-500">Simulated link</span>
                      <span className="text-xs font-bold text-zinc-900">Connected / displayed</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-zinc-500">Simulated signal quality</span>
                      <span className="text-xs font-bold text-[#1b7f47]">{selectedVM.signalQuality}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-zinc-500">Simulated battery</span>
                      <span className="text-xs font-bold text-zinc-900">{selectedVM.device?.battery || 'N/A'}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-zinc-500">Scenario timestamp</span>
                      <span className="text-xs font-bold text-zinc-900">5 Aug 2026 &middot; 08:36 MYT</span>
                    </div>
                  </div>
                  <p className="text-[9px] text-zinc-400 mt-3 text-center">Illustrative topology &middot; not field validated</p>
                </div>
                
                <div className="mt-4">
                   <button
                    onClick={() => handleModeChange('risk')}
                    className="w-full py-3 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-800 text-xs font-bold rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                  >
                    EXIT NETWORK TOPOLOGY
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white lg:border border-zinc-200/60 lg:rounded-xl lg:p-4 shadow-sm lg:shadow-xs mb-4">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2 block">
                  Selected Location
                </span>
                <h3 className="text-2xl font-extrabold text-[#052e1a] tracking-tight">{selectedVM.parentZoneName}</h3>
                <p className="text-xs text-zinc-500 mt-0.5 font-mono">
                  Node {selectedVM.deviceId}{selectedVM.sublocation && selectedVM.sublocation !== selectedVM.parentZoneName ? ` \u00B7 ${selectedVM.sublocation}` : ''}
                </p>
                
                <div className="mt-4 flex items-center gap-2">
                  <span 
                    className="inline-block px-2.5 py-1 text-[10px] font-bold font-mono rounded uppercase tracking-wider border" 
                    style={{ backgroundColor: getRiskColor(selectedVM.riskProfile.demoPriorityBand), color: getRiskBorderColor(selectedVM.riskProfile.demoPriorityBand), borderColor: getRiskBorderColor(selectedVM.riskProfile.demoPriorityBand) }}
                  >
                    {selectedVM.riskProfile.demoPriorityBand}
                  </span>
                  <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-wider">{selectedVM.riskProfile.demoPriorityBand} DEMO PRIORITY</p>
                </div>

                <div className="mt-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-extrabold text-[#052e1a] font-mono tracking-tighter">
                      {selectedVM.riskProfile.interventionPriority}
                    </span>
                    <span className="text-lg text-zinc-400 font-mono">/ 100</span>
                  </div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">
                    Illustrative Intervention Priority
                  </p>
                  <p className="text-[10px] text-zinc-400 font-mono mt-1">
                    Stored demo output &middot; not field validated
                  </p>
                </div>
                
                <div className="bg-[#f8faf9] border border-[#e8f4ed] p-4 rounded-xl mt-4">
                  <p className="text-sm text-[#052e1a] font-medium leading-relaxed">
                    Synthetic egg activity ({selectedVM.riskProfile.eggActivityChange}) and simulated local conditions place this location in the {selectedVM.riskProfile.demoPriorityBand} demo-priority band &rarr; {selectedVM.riskProfile.actionRequired ? selectedVM.riskProfile.actionRequired[0].lower() + selectedVM.riskProfile.actionRequired[1:] : "review nearby breeding sources and assign a field assessment."}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-200/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-3">
                    WHY THIS LOCATION IS PRIORITISED
                  </span>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between p-3 rounded-lg border border-zinc-100 bg-zinc-50/50">
                      <div>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">A. EGG ACTIVITY</span>
                        <span className="text-lg font-bold font-mono text-zinc-900 block mt-0.5">{selectedVM.riskProfile.eggActivityChange}</span>
                        <span className="text-[10px] text-zinc-500 block mt-0.5">7-day synthetic change</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-[#052e1a] uppercase tracking-wider block">High influence</span>
                        <span className="text-[10px] text-zinc-500 block mt-0.5">Synthetic observation</span>
                      </div>
                    </div>
                    
                    <div className="flex items-start justify-between p-3 rounded-lg border border-zinc-100 bg-zinc-50/50">
                      <div>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">B. LOCAL MICROCLIMATE</span>
                        <span className="text-lg font-bold font-mono text-zinc-900 block mt-0.5">{selectedVM.riskProfile.temperature}&deg;C &middot; {selectedVM.riskProfile.humidity}% RH</span>
                        <span className="text-[10px] text-zinc-500 block mt-0.5">Temperature and humidity context</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-[#052e1a] uppercase tracking-wider block">High influence</span>
                        <span className="text-[10px] text-zinc-500 block mt-0.5">Simulated node context</span>
                      </div>
                    </div>
                    
                    <div className="flex items-start justify-between p-3 rounded-lg border border-zinc-100 bg-zinc-50/50">
                      <div>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">C. RAINFALL CONTEXT</span>
                        <span className="text-lg font-bold font-mono text-zinc-900 block mt-0.5">{selectedVM.riskProfile.rainfall}</span>
                        <span className="text-[10px] text-zinc-500 block mt-0.5">External rainfall context</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-wider block">Moderate influence</span>
                        <span className="text-[10px] text-zinc-500 block mt-0.5">External demo input</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[9px] text-zinc-400 mt-3 text-center">Illustrative factors only &middot; no validated weights &middot; human dengue case data are not connected.</p>
                </div>

                <div className="mt-4 pt-4 border-t border-zinc-200/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-3">
                    RECOMMENDED NEXT STEP
                  </span>
                  <p className="text-sm font-medium text-zinc-800 mb-4">{selectedVM.riskProfile.actionRequired || "Review nearby breeding sources and assign a field assessment."}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      onClick={() => onAssignIntervention && onAssignIntervention(selectedVM.parentZoneId, selectedVM.parentZoneName)}
                      disabled={Boolean(activeIntervention)}
                      className={`py-3 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-colors ${
                        activeIntervention
                          ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200'
                          : 'bg-[#052e1a] hover:bg-[#0b5a31] text-white shadow-xs cursor-pointer'
                      }`}
                    >
                      <span>{activeIntervention ? 'ASSIGNED' : 'REVIEW & ASSIGN'}</span>
                    </button>
                    <button
                      onClick={() => onZoneSelect(selectedVM.parentZoneId)}
                      className="py-3 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-800 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>OPEN FULL ANALYSIS</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          )}
        </div>
      </div>
      """

content = content[:start_idx] + new_right_col + content[end_idx:]

with open('src/components/RiskMap.tsx', 'w') as f:
    f.write(content)

