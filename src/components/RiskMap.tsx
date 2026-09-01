import ScenarioPeriodLabel from "./ScenarioPeriodLabel";
import React, { useState, useEffect, useMemo } from 'react';
import { ZoneData, InterventionMap } from '../types';
import { DEVICES, PILOT_NODES, PROPOSED_GATEWAYS, ZONES } from '../data';
import GoogleRiskMap from './GoogleRiskMap';
import { 
  getTrendBucket, 
  getRiskDistribution, 
  getInterventionForZone,
  buildPilotNodeViewModels,
  getRiskColor,
  getRiskBorderColor
} from '../utils/dashboard';
import { 
   
  MapPin, 
   
  ArrowUpRight, 
  
  ChevronDown,
  ChevronUp
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
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
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
    viewModels.find(vm => vm.deviceId === selectedDeviceId) ?? null
  , [viewModels, selectedDeviceId]);

  const activeIntervention = selectedVM ? getInterventionForZone(selectedVM.parentZoneId, interventions) : null;

  const riskDist = getRiskDistribution(zones);
  
  const Accordion = ({ title, id, children }: { title: string, id: string, children: React.ReactNode }) => {
    const isOpen = expandedSection === id;
    return (
      <div className="border border-zinc-200/60 rounded-lg overflow-hidden bg-white mb-2 lg:mb-4 lg:border-none lg:bg-transparent">
        <button 
          onClick={() => setExpandedSection(isOpen ? null : id)}
          className="w-full flex justify-between items-center p-3 lg:hidden bg-zinc-50 font-semibold text-xs text-zinc-800"
        >
          {title}
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        <div className={`p-3 lg:p-0 ${isOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="hidden lg:flex items-center gap-1.5 mb-3 text-[9px] font-bold uppercase tracking-wider text-zinc-400">
            {title}
          </div>
          {children}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-8 lg:pb-12 flex flex-col min-h-[calc(100vh-100px)]" id="risk-map-page-container">
      
      {/* TOOLBAR */}
      <div className="bg-white border border-zinc-200/60 rounded-xl p-2 shadow-xs">
        <div className="flex flex-col gap-2">
          
          <ScenarioPeriodLabel selectedDateRange="" mode="current-snapshot" />

          {/* Mode Switch & Filters */}
          <div className="flex flex-row items-center gap-4 overflow-x-auto whitespace-nowrap scrollbar-hidden snap-x">
            <div className="flex items-center gap-1 bg-zinc-100/80 p-1 rounded-lg shrink-0">
              <button
                onClick={() => handleModeChange('risk')}
                aria-pressed={mapMode === 'risk'}
                className={`px-4 py-2 min-h-[40px] text-xs font-bold rounded-md transition-colors ${mapMode === 'risk' ? 'bg-[#052e1a] text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-900'}`}
              >
                Risk View
              </button>
              <button
                onClick={() => handleModeChange('network')}
                aria-pressed={mapMode === 'network'}
                className={`px-4 py-2 min-h-[40px] text-xs font-bold rounded-md transition-colors ${mapMode === 'network' ? 'bg-[#052e1a] text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-900'}`}
              >
                Network View
              </button>
            </div>
            
            <div className="h-6 w-px bg-zinc-200 shrink-0"></div>
            
            {mapMode === 'risk' && (
              <div className="flex items-center gap-1 shrink-0">
                {['ALL', 'Critical', 'High', 'Elevated', 'Watch'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter as 'ALL' | 'Critical' | 'High' | 'Elevated' | 'Watch')}
                    className={`px-4 py-2 min-h-[40px] text-xs font-bold rounded-lg transition-colors border ${
                      activeFilter === filter
                        ? 'bg-zinc-800 text-white border-zinc-800 shadow-sm'
                        : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Layer Toggles */}
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-hidden snap-x pt-2 border-t border-zinc-100">
            {mapMode === 'risk' && (
              <button
                onClick={() => setShowIllustrativeEggCount(!showIllustrativeEggCount)}
                aria-pressed={showIllustrativeEggCount}
                className={`px-4 py-2 min-h-[40px] rounded-full text-xs font-bold transition-colors shrink-0 border ${showIllustrativeEggCount ? 'bg-[#e8f4ed] text-[#052e1a] border-[#0b5a31]' : 'bg-zinc-50 text-zinc-500 border-zinc-200'}`}
              >
                Illustrative Egg Count
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
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full border border-[#ef4444] bg-[#ffffff]"></div> Critical device</div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full border border-[#f97316] bg-[#ffffff]"></div> High-risk device</div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full border border-[#f59e0b] bg-[#ffffff]"></div> Elevated device</div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full border border-[#22c55e] bg-[#ffffff]"></div> Watch device</div>
              
              {mapMode === 'risk' && showIllustrativeEggCount && (
                <>
                   {(() => {
                  const counts = viewModels.map(vm => vm.riskProfile.syntheticEggActivity || 0).sort((a, b) => a - b);
                  const min = counts[0];
                  const max = counts[counts.length - 1];
                  const mid = counts[Math.floor(counts.length / 2)];
                  return (
                    <> 
                       <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full border border-[#2C7F79] bg-[#3BA7A0] opacity-30"></div> {min} eggs</div>
                       <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full border border-[#2C7F79] bg-[#3BA7A0] opacity-30"></div> {mid} eggs</div>
                       <div className="flex items-center gap-1.5"><div className="w-5 h-5 rounded-full border border-[#2C7F79] bg-[#3BA7A0] opacity-30"></div> {max} eggs</div>
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
              <span className="block mb-1 text-zinc-600 font-bold">Outlined area &mdash; illustrative pilot deployment envelope:</span>
              <span className="block mb-2">The outline follows the five mock device placements and does not represent validated surveillance coverage.</span>
              One node represents one physical OviZero monitoring device.
              {mapMode === 'risk' && showIllustrativeEggCount && ' Bubble size represents illustrative weekly egg count, not spatial density.'}
              {mapMode === 'network' && ' Gateway placement and links are illustrative and not field-validated.'}
            </p>
          </div>
        </div>

        {/* RIGHT 4 COLS: Selected Location Investigation Panel */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          {!selectedVM ? (
            <div className="bg-white border border-zinc-200/60 rounded-xl p-8 shadow-xs flex flex-col items-center justify-center text-center h-full min-h-[300px]">
              <MapPin className="w-8 h-8 text-zinc-300 mb-3" />
              <h3 className="text-sm font-bold text-zinc-700">No OviZero Devices Match</h3>
              <p className="text-[10px] text-zinc-500 mt-2 max-w-[200px] mb-4">No OviZero devices match the current risk filter.</p>
              <button onClick={() => setActiveFilter('ALL')} className="px-4 py-2 bg-[#052e1a] text-white text-xs font-bold rounded-lg shadow-sm hover:bg-[#0b5a31] transition-colors cursor-pointer">
                Reset Filter
              </button>
            </div>
          ) : (
          <div className="flex flex-col">
            {/* Compact Summary for Mobile - shown immediately below map or as top card */}
            <div className="bg-white lg:border border-zinc-200/60 lg:rounded-xl lg:p-4 shadow-sm lg:shadow-xs mb-4">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-zinc-900 font-mono tracking-tight">{selectedVM.deviceId}</h3>
                <p className="text-sm text-zinc-500 mt-0.5">{selectedVM.parentZoneName} &middot; {selectedVM.sublocation}</p>
                
                <div className="mt-3">
                  <span 
                    className="inline-block px-2.5 py-1 text-xs font-bold rounded uppercase tracking-wider" 
                    style={{ backgroundColor: getRiskColor(selectedVM.riskProfile.demoPriorityBand), color: getRiskBorderColor(selectedVM.riskProfile.demoPriorityBand), border: `1px solid ${getRiskBorderColor(selectedVM.riskProfile.demoPriorityBand)}` }}
                  >
                    {selectedVM.riskProfile.demoPriorityBand}
                  </span>
                  <p className="text-xs font-bold text-zinc-700 mt-1">Simulated risk scenario</p>
                </div>

                <div className="mt-4">
                  <p className="text-xs text-zinc-600">
                    <span className="font-bold">Illustrative scenario index:</span> <span className="font-mono text-zinc-900">{selectedVM.riskProfile.interventionPriority} / 100</span>
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Stored mock value &mdash; not calculated or calibrated.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <button
                  onClick={() => onZoneSelect(selectedVM.parentZoneId)}
                  className="py-2.5 bg-[#e8f4ed] hover:bg-[#cad5ce] text-[#052e1a] text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Zone Analysis</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onAssignIntervention && onAssignIntervention(selectedVM.parentZoneId, selectedVM.parentZoneName)}
                  disabled={Boolean(activeIntervention)}
                  className={`py-2.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-colors ${
                    activeIntervention
                      ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                      : 'bg-[#052e1a] hover:bg-[#0b5a31] text-white shadow-xs cursor-pointer'
                  }`}
                >
                  <span>{activeIntervention ? 'Assigned' : 'Assign Zone Task'}</span>
                </button>
              </div>
            </div>

            <div className="lg:bg-white lg:border lg:border-zinc-200/60 lg:rounded-xl lg:p-4 lg:shadow-xs">
              {mapMode === 'network' ? (
                <>
                  <div className="space-y-2 p-3 rounded-lg border border-[#1b7f47]/20 bg-[#f8fcf9] mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-zinc-500">Primary gateway</span>
                      <span className="text-xs font-mono font-bold text-zinc-900">{selectedVM.gateway?.id || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-zinc-500">Illustrative signal</span>
                      <span className="text-xs font-bold text-[#1b7f47]">{selectedVM.signalQuality}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-zinc-500">Link status</span>
                      <span className="text-xs font-bold text-zinc-900">Simulated</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-zinc-500">Battery</span>
                      <span className="text-xs font-bold text-zinc-900">{selectedVM.device?.battery || 'N/A'}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-zinc-500">Last mock update</span>
                      <span className="text-xs font-bold text-zinc-900">{selectedVM.device?.lastSync ?? 'Not available'}</span>
                    </div>
                  </div>
                  <Accordion title="Risk Evidence" id="risk-evidence">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-100 bg-zinc-50/50">
                        <span className="text-xs text-zinc-500">Mock Growth</span>
                        <span className={`text-xs font-bold ${getTrendBucket(selectedVM.riskProfile.eggActivityChange) === 'Rapid' ? 'text-red-600' : 'text-[#052e1a]'}`}>
                          {selectedVM.riskProfile.eggActivityChange}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-100 bg-zinc-50/50">
                        <span className="text-xs text-zinc-500">Weekly Count</span>
                        <span className="text-xs font-bold text-zinc-800">{selectedVM.riskProfile.syntheticEggActivity}</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-100 bg-zinc-50/50 group relative cursor-help">
                        <span className="text-xs text-zinc-500">Illustrative Match Score</span>
                        <span className="text-xs font-bold text-zinc-800">Integration pending</span>
                      </div>
                    </div>
                  </Accordion>
                </>
              ) : (
                <>
                  <Accordion title="Risk Evidence" id="risk-evidence">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-100 bg-zinc-50/50">
                        <span className="text-xs text-zinc-500">Mock Growth</span>
                        <span className={`text-xs font-bold ${getTrendBucket(selectedVM.riskProfile.eggActivityChange) === 'Rapid' ? 'text-red-600' : 'text-[#052e1a]'}`}>
                          {selectedVM.riskProfile.eggActivityChange}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-100 bg-zinc-50/50">
                        <span className="text-xs text-zinc-500">Weekly Count</span>
                        <span className="text-xs font-bold text-zinc-800">{selectedVM.riskProfile.syntheticEggActivity}</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-100 bg-zinc-50/50 group relative cursor-help">
                        <span className="text-xs text-zinc-500">Illustrative Match Score</span>
                        <span className="text-xs font-bold text-zinc-800">Integration pending</span>
                      </div>
                    </div>
                  </Accordion>
                  <Accordion title="Climate Summary" id="climate-summary">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-2.5 rounded-lg border border-zinc-100 bg-zinc-50/50">
                        <span className="text-[10px] text-zinc-500 block mb-0.5">Temperature</span>
                        <span className="text-xs font-mono font-bold text-zinc-800">{selectedVM.riskProfile.temperature}°C</span>
                      </div>
                      <div className="p-2.5 rounded-lg border border-zinc-100 bg-zinc-50/50">
                        <span className="text-[10px] text-zinc-500 block mb-0.5">Humidity</span>
                        <span className="text-xs font-mono font-bold text-zinc-800">{selectedVM.riskProfile.humidity}%</span>
                      </div>
                      <div className="p-2.5 rounded-lg border border-zinc-100 bg-zinc-50/50 col-span-2">
                        <span className="text-[10px] text-zinc-500 block mb-0.5">Rainfall</span>
                        <span className="text-xs font-mono font-bold text-zinc-800">{selectedVM.riskProfile.rainfall}</span>
                      </div>
                    </div>
                  </Accordion>
                </>
              )}
              <div className="p-3 bg-zinc-50 border border-zinc-200/50 rounded-lg mt-2 lg:mt-4">
                <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 block">
                  Recommended Action (applies to zone)
                </span>
                <p className="text-xs font-bold text-zinc-800 mt-0.5">{selectedVM.riskProfile.actionRequired}</p>
                <p className="text-[10px] text-zinc-500 mt-1">This task applies to the pilot zone, not only the selected device.</p>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>

      {/* Bottom Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
        <div className="bg-white p-3 lg:p-4 rounded-xl border border-zinc-200/60 shadow-xs">
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Pilot deployment</span>
          <span className="text-sm font-bold text-[#052e1a] font-mono mt-1 block">5 simulated device records</span>
        </div>
        <div className="bg-white p-3 lg:p-4 rounded-xl border border-zinc-200/60 shadow-xs">
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Risk distribution</span>
          <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] font-mono font-bold text-zinc-700">
            <span>{riskDist.critical} Critical</span>
            <span className="text-zinc-300">&middot;</span>
            <span>{riskDist.high} High</span>
            <span className="text-zinc-300">&middot;</span>
            <span>{riskDist.elevated} Elevated</span>
            <span className="text-zinc-300">&middot;</span>
            <span>{riskDist.watch} Watch</span>
          </div>
        </div>
        <div className="bg-white p-3 lg:p-4 rounded-xl border border-zinc-200/60 shadow-xs">
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">{mapMode === 'risk' ? 'Risk View' : 'Network View'}</span>
          <span className="text-sm font-bold text-[#052e1a] font-mono mt-1 block">
            {mapMode === 'risk' ? 'Current simulated device snapshot' : '1 proposed gateway · 5 direct links'}
          </span>
        </div>
      </div>

    </div>
  );
}
