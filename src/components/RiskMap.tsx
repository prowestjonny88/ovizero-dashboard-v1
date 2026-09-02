import React, { useState, useEffect, useMemo } from 'react';
import { ZoneData, InterventionMap } from '../types';
import { DEVICES, PILOT_NODES, PROPOSED_GATEWAYS, ZONES } from '../data';
import GoogleRiskMap from './GoogleRiskMap';
import { 
  getRiskDistribution, 
  getInterventionForZone,
  buildPilotNodeViewModels,
  getRiskColor,
  getRiskBorderColor
} from '../utils/dashboard';
import { 
   
  MapPin, 
   
  ArrowUpRight,
} from 'lucide-react';

interface RiskMapProps {
  onZoneSelect: (zoneId: string) => void;
  interventions: InterventionMap;
  zones?: ZoneData[];
  onAssignIntervention?: (zoneId: string, zoneName: string) => void;
}

export default function RiskMap({ 
  onZoneSelect, 
  interventions, 
  zones = ZONES,
  onAssignIntervention
}: RiskMapProps) {
  // Map layers states
  const [mapMode, setMapMode] = useState<'risk' | 'network'>('risk');
  const [showIllustrativeEggCount, setShowIllustrativeEggCount] = useState(false);
  const [showSignalQuality, setShowSignalQuality] = useState(false);

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'Critical' | 'High' | 'Elevated' | 'Watch'>('ALL');
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>('OZ-041');

  // Expandable details states for mobile
  const [showLegend, setShowLegend] = useState(false);

  const viewModels = useMemo(() => 
    buildPilotNodeViewModels(PILOT_NODES, zones, DEVICES, PROPOSED_GATEWAYS),
  [zones]);

  const handleModeChange = (mode: 'risk' | 'network') => {
    setMapMode(mode);
    if (mode === 'network') {
      setShowIllustrativeEggCount(false);
    } else {
      setShowSignalQuality(false);
    }
  };

  const filteredNodes = useMemo(() => {
    return viewModels.filter(vm => {
      if (mapMode === 'network') return true;
      if (activeFilter === 'ALL') return true;
      if (activeFilter === 'Watch') {
        return vm.riskProfile.demoPriorityBand === 'Watch' || vm.riskProfile.demoPriorityBand === 'Stable';
      }
      return vm.riskProfile.demoPriorityBand === activeFilter;
    }).sort((a, b) => b.interventionPriority - a.interventionPriority || a.deviceId.localeCompare(b.deviceId));
  }, [viewModels, activeFilter, mapMode]);

  useEffect(() => {
    if (filteredNodes.length === 0) {
      if (selectedDeviceId !== null) setSelectedDeviceId(null);
      return;
    }
    const isSelectedVisible = filteredNodes.some(n => n.deviceId === selectedDeviceId);
    if (!isSelectedVisible && selectedDeviceId !== null) {
      setSelectedDeviceId(filteredNodes[0].deviceId);
    } else if (selectedDeviceId === null && filteredNodes.length > 0) {
      setSelectedDeviceId(filteredNodes[0].deviceId);
    }
  }, [filteredNodes, selectedDeviceId]);

  const selectedVM = useMemo(() => 
    filteredNodes.find(vm => vm.deviceId === selectedDeviceId) ?? filteredNodes[0] ?? null
  , [filteredNodes, selectedDeviceId]);

  const activeIntervention = selectedVM ? getInterventionForZone(selectedVM.parentZoneId, interventions) : null;

  const riskDist = getRiskDistribution(zones);
return (
    <div className="space-y-4 max-w-7xl mx-auto pb-8 lg:pb-12 flex flex-col min-h-[calc(100vh-100px)]" id="risk-map-page-container">
      
      {/* TOOLBAR */}
      <div className="bg-white border border-zinc-200/60 rounded-xl p-2 shadow-xs">
        <div className="flex flex-col gap-2">
          
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">7-day demo &middot; 5 nodes</div>

          {/* Mode Switch & Filters */}
          <div className="flex flex-row items-center justify-between gap-4 overflow-x-auto whitespace-nowrap scrollbar-hidden snap-x w-full">
            <div className="flex items-center gap-2 shrink-0">
              {mapMode === 'risk' && (
                <div className="flex items-center gap-1 shrink-0">
                  {['ALL', 'Critical', 'High', 'Elevated', 'Watch'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter as 'ALL' | 'Critical' | 'High' | 'Elevated' | 'Watch')}
                      className={`px-4 py-1.5 min-h-[36px] text-xs font-bold rounded-lg transition-colors border`}
                      style={
                        filter === 'ALL'
                          ? {
                              backgroundColor: activeFilter === 'ALL' ? '#18181b' : '#ffffff',
                              color: activeFilter === 'ALL' ? '#ffffff' : '#52525b',
                              borderColor: activeFilter === 'ALL' ? '#18181b' : '#e4e4e7'
                            }
                          : {
                              backgroundColor: activeFilter === filter ? getRiskBorderColor(filter) : getRiskColor(filter),
                              color: activeFilter === filter ? '#ffffff' : getRiskBorderColor(filter),
                              borderColor: getRiskBorderColor(filter)
                            }
                      }
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 shrink-0 border-l border-zinc-200 pl-4 ml-auto">
               <button
                onClick={() => handleModeChange(mapMode === 'risk' ? 'network' : 'risk')}
                className={`px-3 py-1.5 min-h-[36px] text-xs font-bold rounded-md transition-colors border ${mapMode === 'network' ? 'bg-[#e8f4ed] text-[#052e1a] border-[#0b5a31]' : 'bg-zinc-50 text-zinc-500 border-zinc-200 hover:bg-zinc-100'}`}
              >
                {mapMode === 'risk' ? 'Network view' : 'Priority view'}
              </button>
            </div>
          </div>

          {/* Layer Toggles */}
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-hidden snap-x pt-2 border-t border-zinc-100">
            {mapMode === 'risk' && (
              <button
                onClick={() => setShowIllustrativeEggCount(!showIllustrativeEggCount)}
                aria-pressed={showIllustrativeEggCount}
                className={`px-4 py-2 min-h-[40px] rounded-full text-xs font-bold transition-colors shrink-0 border ${showIllustrativeEggCount ? 'bg-[#e8f4ed] text-[#052e1a] border-[#0b5a31]' : 'bg-zinc-50 text-zinc-500 border-zinc-200'}`}
              >
                Synthetic egg activity
              </button>
            )}
            {mapMode === 'network' && (
              <button
                onClick={() => setShowSignalQuality(!showSignalQuality)}
                aria-pressed={showSignalQuality}
                className={`px-4 py-2 min-h-[40px] rounded-full text-xs font-bold transition-colors shrink-0 border ${showSignalQuality ? 'bg-[#e8f4ed] text-[#052e1a] border-[#0b5a31]' : 'bg-zinc-50 text-zinc-500 border-zinc-200'}`}
              >
                Show Signal Quality
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 flex-1">
        
        {/* LEFT 8 COLS: Dominant Map Display */}
        <div className="lg:col-span-8 flex flex-col space-y-2 relative">
          <div className="bg-white border border-zinc-200/60 rounded-xl p-2 shadow-xs flex-1 flex flex-col relative h-[52svh] min-h-[360px] max-h-[520px] md:h-[56svh] lg:h-auto lg:min-h-[560px] lg:max-h-none">
            <GoogleRiskMap
              viewModels={viewModels}
              filteredNodes={filteredNodes}
              gateways={PROPOSED_GATEWAYS}
              selectedDeviceId={selectedDeviceId}
              onDeviceSelect={setSelectedDeviceId}
              getRiskColor={getRiskColor}
              getRiskBorderColor={getRiskBorderColor}
              mapMode={mapMode}
              showIllustrativeEggCount={showIllustrativeEggCount}
              showSignalQuality={showSignalQuality}
              variant="full"
            />
          </div>
          
          <button 
            className="lg:hidden w-full p-2 bg-white border border-zinc-200/60 rounded-lg text-xs font-bold text-zinc-600 shadow-xs"
            onClick={() => setShowLegend(!showLegend)}
            aria-expanded={showLegend}
            aria-controls="risk-map-legend"
          >
            {showLegend ? 'Hide Legend' : 'Show Legend'}
          </button>

          {/* Map Legend */}
          <div id="risk-map-legend" className={`bg-white border border-zinc-200/60 rounded-xl p-3 shadow-xs ${showLegend ? 'block' : 'hidden lg:block'}`}>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-medium text-zinc-600">
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full border" style={{ backgroundColor: getRiskColor('Critical'), borderColor: getRiskBorderColor('Critical') }}></div> Critical priority</div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full border" style={{ backgroundColor: getRiskColor('High'), borderColor: getRiskBorderColor('High') }}></div> High priority</div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full border" style={{ backgroundColor: getRiskColor('Elevated'), borderColor: getRiskBorderColor('Elevated') }}></div> Elevated priority</div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full border" style={{ backgroundColor: getRiskColor('Watch'), borderColor: getRiskBorderColor('Watch') }}></div> Watch location</div>
              
              {mapMode === 'risk' && showIllustrativeEggCount && (
                <>
                   {(() => {
                  const counts = viewModels.map(vm => vm.riskProfile.syntheticEggActivity || 0).sort((a, b) => a - b);
                  const min = counts[0];
                  const max = counts[counts.length - 1];
                  const mid = counts[Math.floor(counts.length / 2)];
                  return (
                    <> 
                       <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full border border-[#2C7F79] bg-[#3BA7A0] opacity-30"></div> {min} synthetic eggs</div>
                       <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full border border-[#2C7F79] bg-[#3BA7A0] opacity-30"></div> {mid} synthetic eggs</div>
                       <div className="flex items-center gap-1.5"><div className="w-5 h-5 rounded-full border border-[#2C7F79] bg-[#3BA7A0] opacity-30"></div> {max} synthetic eggs</div>
                    </>
                  );
                })()}
                </>
              )}
              {mapMode === 'network' && (
                <>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 border border-[#1b7f47] rounded-full flex items-center justify-center bg-[#e8f4ed]"><div className="w-0.5 h-1.5 bg-[#1b7f47] rounded-sm"></div></div> 
                    Proposed gateway
                  </div>
                  <div className="flex items-center gap-1.5"><div className="w-4 h-0 border-t-2 border-dashed border-[#1b7f47] opacity-60"></div> Simulated LoRaWAN link</div>
                  {showSignalQuality && (
                     <>
                       <div className="flex items-center gap-1.5"><div className="px-1.5 py-0.5 rounded shadow-sm border border-[#1b7f47]/20 bg-[#ffffff] text-[#1b7f47] font-bold text-[9px]">Strong</div></div>
                       <div className="flex items-center gap-1.5"><div className="px-1.5 py-0.5 rounded shadow-sm border border-[#1b7f47]/20 bg-[#ffffff] text-[#1b7f47] font-bold text-[9px]">Medium</div></div>
                       <div className="flex items-center gap-1.5"><div className="px-1.5 py-0.5 rounded shadow-sm border border-[#1b7f47]/20 bg-[#ffffff] text-[#1b7f47] font-bold text-[9px]">Weak</div></div>
                     </>
                  )}
                </>
              )}
            </div>
            
            <p className="text-[10px] text-zinc-400 mt-2 font-mono">
              <span className="block mb-1 text-zinc-600 font-bold">Outline: five demo node placements; not validated coverage.</span>
              <span className="block mb-1">One marker = one simulated node.</span>
              
              {mapMode === 'risk' && showIllustrativeEggCount &&  <span className="block">Egg bubbles show demo egg activity, not spatial density.</span>}
              {mapMode === 'network' &&  <span className="block">Gateway and links are illustrative.</span>}
            </p>
          </div>
        </div>

        {/* RIGHT 4 COLS: Selected Location Investigation Panel */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
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
                      <span className="text-xs font-bold text-zinc-900">Illustrative link shown</span>
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
                    PRIORITY VIEW
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
                  Node {selectedVM.deviceId}{selectedVM.sublocation && selectedVM.sublocation !== selectedVM.parentZoneName ? ` · ${selectedVM.sublocation}` : ''}
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
                        <span className="text-base md:text-lg font-bold font-mono text-zinc-900 block mt-0.5 whitespace-nowrap">{selectedVM.riskProfile.temperature}&deg;C &middot; {selectedVM.riskProfile.humidity}% RH</span>
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
                        <span className="text-[10px] text-zinc-500 block mt-0.5">External demo input</span>
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
                    NEXT STEP
                  </span>
                  <p className="text-sm font-medium text-zinc-800 mb-4">{selectedVM.riskProfile.actionRequired || "Inspect nearby breeding sources."}</p>
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
                      <span>{activeIntervention ? 'ACTION OPEN' : 'REVIEW & ASSIGN'}</span>
                    </button>
                    <button
                      onClick={() => onZoneSelect(selectedVM.parentZoneId)}
                      className="py-3 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-800 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>OPEN FIELD ACTION</span>
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
      {/* Bottom Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
        <div className="bg-white p-3 lg:p-4 rounded-xl border border-zinc-200/60 shadow-xs">
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Demo nodes</span>
          <span className="text-sm font-bold text-[#052e1a] font-mono mt-1 block">5 simulated device records</span>
        </div>
        <div className="bg-white p-3 lg:p-4 rounded-xl border border-zinc-200/60 shadow-xs">
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Priority distribution</span>
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { label: 'Critical', count: riskDist.critical },
              { label: 'High', count: riskDist.high },
              { label: 'Elevated', count: riskDist.elevated },
              { label: 'Watch', count: riskDist.watch }
            ].map(item => (
              <div key={item.label} className="flex items-center gap-1.5 px-2 py-0.5 rounded border" style={{ backgroundColor: getRiskColor(item.label), borderColor: getRiskBorderColor(item.label), color: getRiskBorderColor(item.label) }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getRiskBorderColor(item.label) }}></div>
                <span className="text-[10px] font-bold font-mono tracking-wider">{item.count} {item.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-3 lg:p-4 rounded-xl border border-zinc-200/60 shadow-xs">
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">{mapMode === 'risk' ? 'Priority View' : 'Proposed LoRaWAN topology'}</span>
          <span className="text-sm font-bold text-[#052e1a] font-mono mt-1 block">
            {mapMode === 'risk' ? 'Current simulated device snapshot' : '1 proposed gateway · 5 direct links'}
          </span>
        </div>
      </div>

    </div>
  );
}
