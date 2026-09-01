import ScenarioPeriodLabel from "./ScenarioPeriodLabel";
import React from 'react';
import { getInterventionForZone, getDeviceForMetricZone, getPilotDisplayLocationForMetricZone } from '../utils/dashboard';
import { DEVICES, PILOT_NODES, ZONES } from '../data';
import EdgeAIEvidencePanel from './evidence/EdgeAIEvidencePanel';
import RiskExplanationPanel from './evidence/RiskExplanationPanel';
import InterventionWorkflowPanel from './interventions/InterventionWorkflowPanel';
import VerificationPanel from './interventions/VerificationPanel';
import InterventionStatusBadge from './interventions/InterventionStatusBadge';
import { getRiskBand } from '../utils/riskExplanation';
import { ZoneData, InterventionMap } from '../types';
import { 
  ArrowLeft, 
  AlertTriangle, 
  MapPin, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  Cpu,
  Info,
  ChevronRight,
  ShieldAlert
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
  
  // Custom SVG coordinates generator for specific zone trend
  const trendMax = 150;
  const selectedZoneDevice = zone ? getDeviceForMetricZone(zone.id, PILOT_NODES, DEVICES) : null;
  const loc = zone ? getPilotDisplayLocationForMetricZone(zone.id, PILOT_NODES, zones) : null;
  const displayName = loc ? `${loc.parentZone} · ${loc.sublocation}` : zone?.name;

  const getDisplayLocation = (zId: string, fallback: string) => {
    const l = getPilotDisplayLocationForMetricZone(zId, PILOT_NODES, zones);
    return l ? `Illustrative scenario · ${l.sublocation}` : fallback;
  };
  const getSvgCoordinates = (points: number[]) => {
    return points.map((val, i) => {
      const x = (i / (points.length - 1)) * 100;
      const y = 100 - (val / trendMax) * 80; // scale down
      return `${x},${y}`;
    }).join(' ');
  };

  
  const valuesArray = zone?.trendData || [0,0,0,0,0,0,0];
  let xLabels: string[];
  
  if (true) {
    xLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    xLabels = ["1st", "5th", "10th", "15th", "20th", "25th", "30th"];
  } else {
    xLabels = ["Week 1", "Week 3", "Week 5", "Week 7", "Week 9", "Week 11", "Week 13"];
  }

  const first = valuesArray[0];
  const last = valuesArray[valuesArray.length - 1];
  const changePct = first > 0 ? Math.round(((last - first) / first) * 100) : null;
  
  const isCritical = zone?.demoPriorityBand === 'Critical' || zone?.demoPriorityBand === 'High';

  const activeIntervention = zone ? getInterventionForZone(zone.id, interventions) : null;

  if (!zone) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center max-w-7xl mx-auto">
        <AlertTriangle className="w-10 h-10 text-zinc-300 mb-4" />
        <h2 className="text-xl font-extrabold text-zinc-950 tracking-tight mb-2">Zone Not Found</h2>
        <p className="text-sm text-zinc-500 mb-6 font-medium max-w-sm">
          The requested priority zone could not be located. It may have been resolved or re-categorized.
        </p>
        <button 
          onClick={onBackToCommandCenter}
          className="bg-zinc-950 text-white px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-zinc-800 cursor-pointer shadow-sm"
        >
          Return to Priority Zones
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
              Back to Priority Zones
            </button>
            <span className="px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200/40 text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
              Diagnostic Report
            </span>
          </div>
          
          <div className="flex items-center gap-3.5">
            <h2 className="text-xl font-bold tracking-tight text-black">{displayName}</h2>
            
            {/* Direct selector dropdown to easily swap target zones */}
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
          <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider mt-1.5">
            Varied mock profile used for interface demonstration.
          </p>
        </div>

        {/* Status indicator */}
        <div className="text-right flex flex-col items-end gap-1.5">
          <ScenarioPeriodLabel  mode="selected-period" />
          <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mb-1.5">
            Intervention Status
          </p>
          <InterventionStatusBadge status={activeIntervention?.status} />
        </div>
      </section>

      {/* 2. Bento Grid layout of deep diagnostics */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left deep content blocks (8 columns) */}
        <div className="lg:col-span-12 space-y-6">
          
          {/* Top Row: Composite Risk & Mini Map */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Illustrative scenario index details */}
            <div className="bg-white rounded-xl border border-zinc-200/55 p-6 flex flex-col justify-between h-[250px] shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
              <div className="flex justify-between items-start">
                <h3 className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                  Risk band
                </h3>
                <ShieldAlert className="w-4 h-4 text-zinc-950" />
              </div>
              
              <div className="my-auto">
                <p className="text-xl font-bold text-zinc-950 uppercase tracking-wider mb-2">
                  {zone.demoPriorityBand}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-bold text-zinc-600 font-mono">
                    {zone.interventionPriority} / 100
                  </span>
                </div>
                <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wider">
                  Simulated risk scenario
                </p>
                <p className="text-[9px] text-zinc-400 mt-0.5">
                  Stored mock value — not calculated or calibrated.
                </p>
              </div>

              {/* Grayscale Step Thermometer bar */}
              <div className="w-full">
                <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden flex">
                  <div className="h-full bg-zinc-200" style={{ width: '30%' }}></div>
                  <div className="h-full bg-zinc-400" style={{ width: '40%' }}></div>
                  <div className="h-full bg-zinc-950" style={{ width: '30%' }}></div>
                </div>
                <div className="flex justify-between mt-2 text-[9px] font-bold text-zinc-400 mt-1 uppercase tracking-wider">
                  <span>Baseline</span>
                  <span>Threshold</span>
                  <span className="text-zinc-900 font-extrabold">Current ({zone.interventionPriority})</span>
                </div>
              </div>
            </div>

            {/* Mini Map Focused representation */}
            <div className="bg-white rounded-xl border border-zinc-200/55 p-2 h-[250px] overflow-hidden relative group shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
              <div className="absolute top-4 left-4 z-10 bg-white border border-zinc-200/50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
                <Cpu className="w-3.5 h-3.5 text-zinc-950" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-900">
                  5 simulated device records
                </span>
              </div>

              {/* Stylized mini map layout focused */}
              <div className="w-full h-full bg-zinc-50 rounded-lg relative overflow-hidden flex items-center justify-center p-4 border border-zinc-100">
                <svg className="w-full h-full opacity-15 absolute pointer-events-none" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="35" fill="none" stroke="black" strokeWidth="0.5" strokeDasharray="3,3" />
                  <circle cx="50" cy="50" r="20" fill="none" stroke="black" strokeWidth="0.5" strokeDasharray="3,3" />
                  <line x1="50" y1="0" x2="50" y2="100" stroke="black" strokeWidth="0.3" />
                  <line x1="0" y1="50" x2="100" y2="50" stroke="black" strokeWidth="0.3" />
                </svg>

                {/* Central Focus Marker */}
                <div className="relative z-10 text-center flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-zinc-950 text-white flex items-center justify-center border border-zinc-800 shadow-[0_2px_8px_rgba(0,0,0,0.1)] mb-2">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-950">
                    {displayName}
                  </span>
                  <span className="text-[8px] text-zinc-400 font-bold tracking-widest mt-0.5">
                    Zone Core Focus
                  </span>
                </div>

                {/* Neighboring OviZero nodes */}
                {PILOT_NODES.filter(n => n.deviceId !== selectedZoneDevice?.id).map((n, idx) => {
                   const positions = [
                     "top-1/4 left-1/4",
                     "bottom-1/4 right-1/4",
                     "top-1/4 right-1/4",
                     "bottom-1/4 left-1/4"
                   ];
                   const pos = positions[idx];
                   return (
                     <div key={n.deviceId} className={`absolute ${pos} w-6 h-6 rounded-lg bg-white border border-zinc-200/50 flex items-center justify-center text-[8px] font-mono font-bold shadow-sm text-zinc-500`}>
                       {n.deviceId.split('-')[1]}
                     </div>
                   );
                })}
              </div>
            </div>

          </div>

          {/* Mid Row: Line trend & Acoustic Confirmation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Ovitrap Egg count trend */}
            <div 
              className="bg-white rounded-xl border border-zinc-200/55 p-5 flex flex-col shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
              aria-label={`Illustrative egg-count trend ${changePct !== null && changePct > 0 ? 'rising' : 'falling'} from ${first} to ${last} over the 7-day period.`}
            >
              {/* Header row */}
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                  EGG ACTIVITY TREND
                </h3>
                <span className="text-[8px] font-bold font-mono text-zinc-400 bg-zinc-50 border border-zinc-100 px-1.5 py-0.5 rounded tracking-wider uppercase">
                  7D &middot; SIMULATED
                </span>
              </div>

              {/* KPI block */}
              <div className="mb-4">
                <div className="text-3xl font-extrabold text-[#052e1a] tracking-tight font-mono">
                  {changePct !== null ? `${changePct > 0 ? '+' : ''}${changePct}%` : 'N/A'}
                </div>
                <div className="text-[10px] text-zinc-500 font-medium mt-0.5">
                  {changePct !== null && changePct > 0 ? 'Increase' : 'Change'} over selected period
                </div>
              </div>

              {/* Comparison row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-zinc-50/50 rounded-lg p-2.5 mb-4 border border-zinc-100/50 text-[10px] font-mono gap-2 sm:gap-0">
                <div className="flex justify-between sm:block text-zinc-500 order-1">
                  <span className="mr-2">Start</span>
                  <strong className="text-zinc-700">{first}</strong>
                </div>
                <div className="flex justify-between sm:block text-[#052e1a] font-bold bg-[#e8f4ed] px-2 py-0.5 rounded order-3 sm:order-2 mt-2 sm:mt-0">
                  <span className="sm:hidden mr-2 text-[#1b7f47]">Change</span>
                  {changePct !== null ? `${last - first > 0 ? '+' : ''}${last - first} eggs` : '-'}
                </div>
                <div className="flex justify-between sm:block text-zinc-500 order-2 sm:order-3">
                  <span className="mr-2">Current</span>
                  <strong className="text-zinc-950 text-xs">{last}</strong>
                </div>
                
                <div className="hidden sm:flex items-center ml-2 order-4">
                  {changePct !== null && changePct > 0 && (
                     <div className="text-[#1b7f47] font-bold bg-[#e8f4ed] px-2 py-0.5 rounded">
                       &uarr; Rising
                     </div>
                  )}
                  {changePct !== null && changePct < 0 && (
                     <div className="text-[#b42318] font-bold bg-[#fff1f0] px-2 py-0.5 rounded">
                       &darr; Falling
                     </div>
                  )}
                  {changePct !== null && changePct === 0 && (
                     <div className="text-zinc-600 font-bold bg-zinc-200/50 px-2 py-0.5 rounded">
                       Stable
                     </div>
                  )}
                </div>
              </div>

              {/* Curve Drawing */}
              <div className="h-28 w-full relative flex items-end">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="detail-chart-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0b5a31" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#0b5a31" stopOpacity="0.00" />
                    </linearGradient>
                  </defs>

                  {/* Grid baseline */}
                  <line x1="0" x2="100" y1="20" y2="20" stroke="#f4f4f5" strokeWidth="1" />
                  <line x1="0" x2="100" y1="80" y2="80" stroke="#f4f4f5" strokeWidth="1" />
                  
                  {/* Stock Area Fill */}
                  <polygon
                    fill="url(#detail-chart-grad)"
                    points={`0,100 ${getSvgCoordinates(valuesArray)} 100,100`}
                  />

                  <polyline
                    fill="none"
                    stroke="#064323"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={getSvgCoordinates(valuesArray)}
                  />

                  {/* Start point */}
                  <circle
                    cx="0"
                    cy={100 - (first / trendMax) * 80}
                    r="2.5"
                    fill="#ffffff"
                    stroke="#064323"
                    strokeWidth="1.5"
                  />

                  {/* Current point */}
                  <circle
                    cx="100"
                    cy={100 - (last / trendMax) * 80}
                    r="4"
                    fill="#064323"
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="group"
                  >
                     <title>Illustrative egg count&#10;Date: {xLabels[xLabels.length - 1]}&#10;Value: {last}&#10;Simulated data</title>
                  </circle>
                </svg>
                
                {/* Labels at start and end */}
                <div className="absolute left-0 -bottom-5 text-[8px] font-mono text-zinc-400">
                  {xLabels[0]}
                </div>
                <div className="absolute right-0 -bottom-5 text-[8px] font-mono font-bold text-[#052e1a]">
                  {xLabels[xLabels.length - 1]}
                </div>
              </div>

              <div className="mt-8 text-[9px] text-zinc-400 italic font-medium">
                Illustrative count trend &middot; not field-observed
              </div>
            </div>

                        {/* Proposed Wingbeat Trigger */}
            <div className="bg-white rounded-xl border border-zinc-200/55 p-6 flex flex-col justify-between shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
              <div>
                <h3 className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-6">
                  PROPOSED WINGBEAT TRIGGER
                </h3>
                
                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between items-center border-b border-zinc-100 pb-2.5">
                    <span className="font-medium text-zinc-500">Role</span>
                    <strong className="font-bold text-zinc-950 text-right text-[10px]">
                      Wake the camera when the simulated trigger condition is met.
                    </strong>
                  </div>

                  <div className="flex justify-between items-center border-b border-zinc-100 pb-2.5">
                    <span className="font-medium text-zinc-500">Illustrative signal</span>
                    <strong className="font-bold text-zinc-950 font-mono text-[11px]">
                      {zone.candidateAcousticTrigger} Hz
                    </strong>
                  </div>
                  
                  <div className="flex justify-between items-center border-b border-zinc-100 pb-2.5">
                    <span className="font-medium text-zinc-500">Classifier</span>
                    <strong className="font-bold text-zinc-950 font-mono text-[11px]">
                      Not trained
                    </strong>
                  </div>

                  <div className="flex justify-between items-center border-b border-zinc-100 pb-2.5">
                    <span className="font-medium text-zinc-500">Trigger threshold</span>
                    <strong className="font-bold text-zinc-950 font-mono text-[11px]">
                      Not calibrated
                    </strong>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-zinc-500">Included in illustrative scenario index</span>
                    <span className="px-1.5 py-0.5 rounded bg-zinc-100 text-[9px] font-bold text-zinc-600 uppercase tracking-wider font-mono">
                      No
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] font-medium text-zinc-500 mt-4 bg-zinc-50 p-3 rounded-lg border border-zinc-100 leading-relaxed italic">
                The acoustic signal is used only to demonstrate the proposed camera-wake logic. It is not used as a weighted input in the current scenario index.
              </div>
            </div>
          </div>


          {/* Bottom Row: Climate & Risk Horizon Prediction panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Climate panel */}
            <div className="bg-white rounded-xl border border-zinc-200/55 p-6 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
              <h3 className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-6">
                Environmental Telemetry
              </h3>
              
              <div className="grid grid-cols-2 gap-6 text-xs">
                <div className="border-b border-zinc-100 pb-3">
                  <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                    Temperature
                  </span>
                  <span className="text-sm font-bold text-zinc-950 font-geist">{zone.temperature}°C</span>
                </div>
                <div className="border-b border-zinc-100 pb-3">
                  <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                    Humidity
                  </span>
                  <span className="text-sm font-bold text-zinc-950 font-geist">{zone.humidity}%</span>
                </div>
                <div>
                  <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                    Rainfall (48h)
                  </span>
                  <span className="text-sm font-bold text-zinc-950 font-geist">{zone.rainfall}</span>
                </div>
                <div>
                  <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                    Estimated Hatching Acceleration
                  </span>
                  <span className="text-sm font-bold text-zinc-950 uppercase tracking-wide">
                    -
                  </span>
                </div>
              </div>
            </div>

            {/* Predictive Horizon panel */}
            <div className="bg-white rounded-xl border border-zinc-200/55 p-6 flex flex-col justify-between shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
              <div>
                <h3 className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-6">
                  Illustrative Scenario Outlook
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-100 text-center">
                    <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                      Next 3 Days
                    </span>
                    <span className="text-xs font-bold text-zinc-950 font-mono">{'-'}</span>
                  </div>
                  <div className="bg-zinc-100 p-3 rounded-lg border border-zinc-200/30 text-center">
                    <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                      Next 7 Days
                    </span>
                    <span className="text-xs font-bold text-zinc-950 font-mono">{'-'}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2.5 pt-4 border-t border-zinc-100 mt-4 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-zinc-500">Illustrative biological timing assumption:</span>
                  <strong className="text-zinc-950 font-bold">-</strong>
                </div>
                <div className="flex justify-between items-center border-t border-zinc-100 pt-2.5">
                  <span className="font-bold text-zinc-950">Intervention window target:</span>
                  <strong className="text-zinc-950 font-bold flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-zinc-950" /> -
                  </strong>
                </div>
                
                <p className="text-[10px] text-zinc-400 mt-2 italic border-t border-zinc-100 pt-2">
                  Not validated against field outcomes.
                </p>
              </div>
            </div>
          </div>
        </div>


      </section>

      <section className="space-y-6 mt-10">
        <h2 className="text-xl font-bold text-zinc-900 border-b border-zinc-200 pb-2">Evidence & Explainability</h2>
        <RiskExplanationPanel zone={zone} />
        {selectedZoneDevice && <EdgeAIEvidencePanel device={selectedZoneDevice} />}
        
        <h2 className="text-xl font-bold text-zinc-900 border-b border-zinc-200 pb-2 mt-12">Operational Response</h2>
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
