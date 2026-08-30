import ScenarioPeriodLabel from "./ScenarioPeriodLabel";
import React, { useState } from 'react';
import { ZoneData, InterventionMap } from '../types';
import { DEVICES, PILOT_NODES, PROPOSED_GATEWAYS } from '../data';
import GoogleRiskMap from './GoogleRiskMap';
import InterventionStatusBadge from './interventions/InterventionStatusBadge';
import {
  getTopPriorityZones,
  getRiskDistribution,
  getDeviceHealthSummary,
  getInterventionSummary, getInterventionForZone,
  ZONE_NODE_MAP,
  buildPilotNodeViewModels,
  getPilotDisplayLocationForMetricZone
} from '../utils/dashboard';
import { 
  TrendingUp, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Thermometer, 
  CloudRain, 
  MapPin, 
  ArrowUpRight, 
  RefreshCw, 
  Radio, 
  ShieldAlert, 
  Clock, 
  Cpu, 
  ChevronRight,
  Droplets,
  Layers
} from 'lucide-react';

interface CommandCenterProps {
  zones: ZoneData[];
  onZoneSelect: (zoneId: string) => void;
  selectedDateRange: string;
  onDateRangeChange?: (range: string) => void;
  interventions: InterventionMap;
  onOpenRiskMap?: () => void;
  onNavigateToPriorityZones?: () => void;
}

export default function CommandCenter({ 
  zones, 
  onZoneSelect, 
  selectedDateRange,
  onDateRangeChange,
  interventions,
  onOpenRiskMap,
  onNavigateToPriorityZones
}: CommandCenterProps) {
  const [lastRefreshed, setLastRefreshed] = useState<string>('Just now');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastRefreshed('Just now');
      setIsRefreshing(false);
    }, 600);
  };

  // Derived counts from zones dataset
  const topPriorityZones = getTopPriorityZones(zones, 3);
  
  const getDisplayLocation = (zoneId: string, fallback: string) => {
    const loc = getPilotDisplayLocationForMetricZone(zoneId, PILOT_NODES, zones);
    return loc ? `PPR Seri Anggerik · ${loc.sublocation}` : fallback;
  };

  const getSublocation = (zoneId: string, fallback: string) => {
    const loc = getPilotDisplayLocationForMetricZone(zoneId, PILOT_NODES, zones);
    return loc ? loc.sublocation : fallback.split(' ')[0];
  };

  const riskDist = getRiskDistribution(zones);
  const viewModels = buildPilotNodeViewModels(PILOT_NODES, zones, DEVICES, PROPOSED_GATEWAYS);
  const criticalZones = zones.filter(z => z.status === 'Critical' || z.status === 'High');
  const elevatedZones = zones.filter(z => z.status === 'Elevated');
  const watchZones = zones.filter(z => z.status === 'Watch' || z.status === 'Stable');
  
  const peakZone = topPriorityZones[0] || zones[0];
  const actionRequiredCount = riskDist.critical + riskDist.high + riskDist.elevated;

  // Derived counts from DEVICES dataset
  const deviceHealth = getDeviceHealthSummary(DEVICES);
  const onlineNodes = deviceHealth.total;
  const totalNodes = deviceHealth.total;
  const strongSignalCount = deviceHealth.strongSignal;
  const mediumSignalCount = deviceHealth.mediumSignal;
  const weakSignalCount = deviceHealth.weakSignal;
  const lowBatteryCount = deviceHealth.lowBattery;
  const lowBatteryDevice = DEVICES.find(d => d.battery < 30);

  // Interventions pending/assigned/completed count
  const interventionSummary = getInterventionSummary(interventions);
  const assignedInterventionsCount = interventionSummary.active;
  const awaitingVerificationCount = interventionSummary.awaitingVerification;
  const verifiedCount = interventionSummary.verified;
  const needsAttentionCount = interventionSummary.noEffect + interventionSummary.escalated;

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

  // Node ID mapping helper
  const getNodeForZone = (id: string) => {
    return ZONE_NODE_MAP[id]?.nodeId || PILOT_NODES.find(n => n.metricZoneId === id)?.deviceId || 'Unknown';
  };

  const rangeEndLabel =
    selectedDateRange === '7d'
      ? 'Day 7'
      : selectedDateRange === '30d'
      ? 'Day 30'
      : 'Day 90';

  const startValue = peakZone.trendData[0];
  const currentValue = peakZone.trendData[peakZone.trendData.length - 1];
  const absoluteChange = currentValue - startValue;
  const selectedPeriodChangePct = startValue > 0 ? Math.round((absoluteChange / startValue) * 100) : null;


  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12" id="command-center-container">
      
      {/* 1. Page Header Intro */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-extrabold tracking-tight text-[#052e1a] uppercase font-mono">
              COMMAND CENTER
            </h1>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Executive overview of risk, alerts, network health, and response status across five simulated pilot sublocations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end gap-1">
            <ScenarioPeriodLabel selectedDateRange={selectedDateRange} mode="selected-period" />
            <div className="text-right hidden sm:block">
              <span className="text-[9px] font-bold text-zinc-400 block uppercase tracking-wider">Demo Data Status</span>
              <span className="text-[10px] font-mono font-semibold text-zinc-700">Updated {lastRefreshed} • 5 simulated nodes</span>
            </div>
          </div>
          <button 
            onClick={handleRefresh}
            className="p-2 bg-white border border-zinc-200 rounded-lg shadow-xs hover:bg-zinc-50 text-zinc-700 active:scale-95 transition-all cursor-pointer"
            title="Refresh demo feed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#1b7f47]' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Executive KPI Cards Row (6 compact cards) */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        {/* Card 1: Illustrative scenario index */}
        <div className="bg-white p-4 rounded-xl border border-zinc-200/60 flex flex-col justify-between shadow-xs">
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
            Illustrative scenario index
          </span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-3xl font-extrabold text-[#052e1a] font-mono tracking-tight">{peakZone.risk}</span>
            <span className="text-[10px] text-zinc-400 font-mono">/ 100</span>
          </div>
          <div className="mt-3 flex flex-col gap-1">
            <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${peakZone.risk}%`, backgroundColor: getRiskBorderColor(peakZone.status) }} />
            </div>
            <div className="flex justify-between items-center text-[8px] font-bold text-zinc-400 uppercase tracking-wider mt-0.5">
              <span>Peak: {getSublocation(peakZone.id, peakZone.name)}</span>
              <span className="font-extrabold" style={{ color: getRiskBorderColor(peakZone.status) }}>{peakZone.status}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Mock growth */}
        <div className="bg-white p-4 rounded-xl border border-zinc-200/60 flex flex-col justify-between shadow-xs">
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
            Mock rolling growth indicator
          </span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-3xl font-extrabold text-[#052e1a] font-mono tracking-tight">{peakZone.eggVelocity}</span>
          </div>
          <p className="text-[9px] text-zinc-500 mt-3 font-medium">
            {selectedDateRange.toUpperCase()} rolling growth rate
          </p>
        </div>

        {/* Card 3: Illustrative Warning Scenario (Standard Light Card) */}
        <div className="bg-white p-4 rounded-xl border border-zinc-200/60 flex flex-col justify-between shadow-xs">
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
            Illustrative action window
          </span>
          <div className="mt-2">
            <span className="text-3xl font-extrabold font-mono tracking-tight text-zinc-900">{peakZone.predictions.actionWindow}</span>
          </div>
          <p className="text-[9px] text-zinc-500 mt-3 font-medium">
            Based on the highest-priority mock profile
          </p>
        </div>

        {/* Card 4: Simulated Nodes */}
        <div className="bg-white p-4 rounded-xl border border-zinc-200/60 flex flex-col justify-between shadow-xs">
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
            Simulated device records
          </span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-3xl font-extrabold text-[#052e1a] font-mono tracking-tight">5</span>
            <span className="text-[10px] text-zinc-400 font-mono">/ 5</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[9px] text-zinc-500 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>All simulated records available</span>
          </div>
        </div>

        {/* Card 5: Climate Trigger */}
        <div className="bg-white p-4 rounded-xl border border-zinc-200/60 flex flex-col justify-between shadow-xs">
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
            Climate Trigger
          </span>
          <div className="mt-2 space-y-0.5">
            <div className="text-xs font-bold text-zinc-800 flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-zinc-500" />
              <span>{peakZone.temperature}°C</span>
              <span className="text-zinc-300">•</span>
              <Droplets className="w-3 h-3 text-zinc-500" />
              <span>{peakZone.humidity}% RH</span>
            </div>
          </div>
          <p className="text-[9px] text-[#052e1a] font-bold mt-2 uppercase tracking-wider">
            Hatching Risk: {peakZone.hatchingRate}
          </p>
        </div>

        {/* Card 6: Priority sublocations (Dark-Green Emphasis Card) */}
        <div className="bg-[#052e1a] text-white p-4 rounded-xl border border-[#052e1a] flex flex-col justify-between shadow-xs">
          <span className="text-[9px] font-bold text-[#b8d8c2] uppercase tracking-wider">
            Priority sublocations
          </span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-3xl font-extrabold font-mono tracking-tight text-white">{actionRequiredCount}</span>
            <span className="text-[10px] text-[#b8d8c2] font-mono">/ 5</span>
          </div>
          <p className="text-[8px] text-[#e8f4ed]/80 mt-2 font-mono uppercase tracking-wider">
            Mock profiles requiring review
          </p>
        </div>

      </section>

      {/* 3. Main Dashboard Panels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT 8 COLS: Urgent Alerts Table & Current Situation */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Panel 1: Top 3 Urgent Priority Zones */}
          <div className="bg-white border border-zinc-200/60 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-4">
              <div>
                <h3 className="font-bold text-sm text-[#052e1a] uppercase tracking-wider font-mono">
                  Top Priority Zones & Urgent Alerts
                </h3>
                <p className="text-[10px] text-zinc-400 mt-0.5">Top three pilot sublocations ranked by simulated scenario index and egg-count trend.</p>
              </div>
              <span className="text-[9px] font-bold font-mono text-[#052e1a] bg-[#e8f4ed] px-2 py-1 rounded border border-[#cad5ce]">
                Top 3 of {zones.length} sublocations
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-100 text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                    <th className="pb-2.5 font-semibold">Rank</th>
                    <th className="pb-2.5 font-semibold">Zone / Node</th>
                    <th className="pb-2.5 font-semibold">Illustrative scenario index</th>
                    <th className="pb-2.5 font-semibold">Mock Growth</th>
                    <th className="pb-2.5 font-semibold">Status</th>
                    <th className="pb-2.5 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50 text-xs">
                  {topPriorityZones.map((zone, idx) => {
                    const nodeName = getNodeForZone(zone.id);

                    return (
                      <tr key={zone.id} className="hover:bg-zinc-50/80 transition-colors">
                        <td className="py-3 font-mono text-[10px] text-zinc-400 font-bold">
                          #{idx + 1}
                        </td>
                        <td className="py-3 font-semibold text-zinc-900">
                          <div>
                            <span className="text-xs font-bold text-zinc-800">{getDisplayLocation(zone.id, zone.name)}</span>
                            <span className="ml-2 font-mono text-[9px] text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded">
                              {nodeName}
                            </span>
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-zinc-800">{zone.risk}</span>
                            <div className="w-12 h-1 bg-zinc-100 rounded-full overflow-hidden hidden sm:block">
                              <div className="h-full rounded-full" style={{ width: `${zone.risk}%`, backgroundColor: getRiskBorderColor(zone.status) }} />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 font-mono text-xs font-bold text-zinc-800">
                          {zone.eggVelocity}
                        </td>
                        <td className="py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold font-mono uppercase tracking-wider`}
                            style={{ backgroundColor: getRiskColor(zone.status), color: getRiskBorderColor(zone.status) }}>
                            {zone.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => onZoneSelect(zone.id)}
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-[#052e1a] hover:text-[#0b5a31] bg-[#e8f4ed] hover:bg-[#cad5ce] px-2.5 py-1 rounded transition-all cursor-pointer"
                          >
                            <span>Open Analysis</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-100 flex justify-end">
              <button
                onClick={onNavigateToPriorityZones || (() => onZoneSelect(zones[0].id))}
                className="text-[10px] font-bold text-[#052e1a] hover:underline inline-flex items-center gap-1 font-mono uppercase tracking-wider cursor-pointer"
              >
                <span>View All Priority Zones ({zones.length} total)</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Panel 2: Current Situation & Network Health Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Current Situation Breakdown */}
            <div className="bg-white border border-zinc-200/60 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
                <Activity className="w-4 h-4 text-[#052e1a]" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-800">
                  Current Situation Breakdown
                </h3>
              </div>

              <div className="divide-y divide-zinc-100 text-xs">
                <div className="py-2 flex justify-between items-center">
                  <span className="text-zinc-500">Critical & High pilot sublocations</span>
                  <span className="font-mono font-bold text-[#052e1a]">{criticalZones.length}</span>
                </div>
                <div className="py-2 flex justify-between items-center">
                  <span className="text-zinc-500">Elevated pilot sublocations</span>
                  <span className="font-mono font-bold text-zinc-700">{elevatedZones.length}</span>
                </div>
                <div className="py-2 flex justify-between items-center">
                  <span className="text-zinc-500">Watch / lower-risk sublocations</span>
                  <span className="font-mono font-bold text-zinc-700">{watchZones.length}</span>
                </div>
                <div className="py-2 flex justify-between items-center">
                  <span className="text-zinc-500">Active Interventions</span>
                  <span className="font-mono font-bold text-[#052e1a]">{assignedInterventionsCount} active</span>
                </div>
                <div className="py-2 flex justify-between items-center">
                  <span className="text-zinc-500">Awaiting Verification</span>
                  <span className="font-mono font-bold text-amber-600">{awaitingVerificationCount} pending</span>
                </div>
                <div className="py-2 flex justify-between items-center">
                  <span className="text-zinc-500">Effect Verified</span>
                  <span className="font-mono font-bold text-[#1b7f47]">{verifiedCount} verified</span>
                </div>
                <div className="py-2 flex justify-between items-center">
                  <span className="text-zinc-500">Needs Attention</span>
                  <span className="font-mono font-bold text-red-600">{needsAttentionCount} alerts</span>
                </div>
                <div className="py-2 flex justify-between items-center">
                  <span className="text-zinc-500">Devices Needing Attention</span>
                  <span className="font-mono font-bold text-zinc-800">{lowBatteryCount} {lowBatteryCount > 0 && lowBatteryDevice ? `(${lowBatteryDevice.id} low battery)` : ''}</span>
                </div>
              </div>
            </div>

            {/* Network Health Overview */}
            <div className="bg-white border border-zinc-200/60 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
                <Radio className="w-4 h-4 text-[#052e1a]" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-800">
                  Network Health (Simulated)
                </h3>
              </div>

              <div className="divide-y divide-zinc-100 text-xs">
                <div className="py-2 flex justify-between items-center">
                  <span className="text-zinc-500">Mock records available</span>
                  <span className="font-mono font-bold text-zinc-800 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    {onlineNodes} / {totalNodes} Simulated
                  </span>
                </div>
                <div className="py-2 flex justify-between items-center">
                  <span className="text-zinc-500">Gateway Status</span>
                  <span className="font-mono font-bold text-zinc-800">1 proposed gateway</span>
                </div>
                <div className="py-2 flex justify-between items-center">
                  <span className="text-zinc-500">Simulated Battery Warnings</span>
                  <span className="font-mono font-bold text-zinc-800">{lowBatteryCount} Warning {lowBatteryCount > 0 && lowBatteryDevice ? `(${lowBatteryDevice.id} @ ${lowBatteryDevice.battery}%)` : ''}</span>
                </div>
                <div className="py-2 flex justify-between items-center">
                  <span className="text-zinc-500">Simulated LoRaWAN Connectivity</span>
                  <span className="font-mono font-bold text-zinc-800">{strongSignalCount} Strong, {mediumSignalCount} Med, {weakSignalCount} Weak</span>
                </div>
                <div className="py-2 flex justify-between items-center">
                  <span className="text-zinc-500">Demo Data Status</span>
                  <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                    All simulated records available
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Panel 3: Key Trends */}
          <div className="bg-white border border-[#E4E9E6] rounded-[16px] p-5 lg:p-6 shadow-[0_2px_4px_rgba(0,0,0,0.02)] ml-12 lg:ml-0 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-100 pb-4 mb-5 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-green-50 rounded-lg shrink-0">
                  <TrendingUp className="w-5 h-5 text-[#052e1a]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-zinc-900">
                    Key Vector Trends
                  </h3>
                  <p className="text-[13px] text-[#647067] mt-0.5">Changes across the selected monitoring period</p>
                </div>
              </div>
              <div className="flex items-center bg-zinc-50 p-0.5 rounded-lg border border-zinc-200/50 shrink-0 self-start sm:self-auto">
                {[
                  { label: '7D', value: '7d' },
                  { label: '30D', value: '30d' },
                  { label: '90D', value: '90d' }
                ].map((range) => (
                  <button
                    key={range.value}
                    onClick={() => onDateRangeChange && onDateRangeChange(range.value)}
                    className={`px-3 py-1.5 text-[11px] font-bold rounded-md transition-all uppercase tracking-wider ${
                      selectedDateRange === range.value
                        ? 'bg-white text-zinc-900 border border-zinc-200/50 shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-900'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              
              {/* Card 1: Egg Activity Trend */}
              <div className="bg-white p-5 lg:p-6 rounded-[14px] border border-[#E4E9E6] flex flex-col shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                    EGG ACTIVITY TREND
                  </span>
                  <span className="text-[8px] font-bold font-mono text-zinc-400 bg-zinc-50 border border-zinc-100 px-1.5 py-0.5 rounded tracking-wider uppercase">
                    {selectedDateRange.toUpperCase()} &middot; SIMULATED
                  </span>
                </div>

                <div className="mb-4">
                  <div className="text-3xl font-extrabold text-[#052e1a] tracking-tight font-mono">
                    {selectedPeriodChangePct !== null ? `${selectedPeriodChangePct > 0 ? '+' : ''}${selectedPeriodChangePct}%` : 'N/A'}
                  </div>
                  <div className="text-[10px] text-zinc-500 font-medium mt-0.5">
                    {selectedPeriodChangePct !== null && selectedPeriodChangePct > 0 ? 'Increase' : 'Change'} over selected period
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-zinc-50/50 rounded-lg p-2.5 mb-4 border border-zinc-100/50 text-[10px] font-mono gap-2 sm:gap-0">
                  <div className="flex justify-between sm:block text-zinc-500">
                    <span className="mr-2">Start</span>
                    <strong className="text-zinc-700">{startValue}</strong>
                  </div>
                  <div className="flex justify-between sm:block text-[#052e1a] font-bold bg-[#e8f4ed] px-2 py-0.5 rounded">
                    <span className="sm:hidden mr-2 text-[#1b7f47]">Change</span>
                    {selectedPeriodChangePct !== null ? `${absoluteChange > 0 ? '+' : ''}${absoluteChange} eggs` : '-'}
                  </div>
                  <div className="flex justify-between sm:block text-zinc-500">
                    <span className="mr-2">Current</span>
                    <strong className="text-zinc-950 text-xs">{currentValue}</strong>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-end">
                  <div className="w-full relative h-[75px] mb-2">
                    <AreaSparkline data={peakZone.trendData} color="#052e1a" gradientId="eggVelocityGrad" />
                  </div>
                  <div className="text-[9px] text-zinc-400 italic font-medium pt-2 border-t border-zinc-100">
                    Illustrative count trend &middot; not field-observed
                  </div>
                </div>
              </div>

              {/* Card 2: Climate Trigger */}
              <div className="bg-white p-5 lg:p-6 rounded-[14px] border border-[#E4E9E6] flex flex-col min-h-[300px] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-medium text-[#647067] uppercase tracking-wider block">
                      Climate Trigger
                    </span>
                    <span className="text-3xl font-bold text-zinc-900 block mt-1 leading-tight">{peakZone.humidity}% RH</span>
                    <span className="text-xs text-[#647067] block mt-2">Favourable conditions for mosquito development</span>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-[11px] font-semibold rounded border border-amber-200">
                    Elevated
                  </span>
                </div>
                
                <div className="flex-1 flex flex-col justify-end mt-4">
                  <div className="w-full mb-5">
                    <div className="w-full h-2.5 bg-amber-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${peakZone.humidity}%` }}></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-xs text-[#647067] block mb-1">Temperature</span>
                      <span className="text-sm font-semibold text-zinc-900">{peakZone.temperature}°C</span>
                    </div>
                    <div>
                      <span className="text-xs text-[#647067] block mb-1">Humidity</span>
                      <span className="text-sm font-semibold text-zinc-900">{peakZone.humidity}%</span>
                    </div>
                    <div>
                      <span className="text-xs text-[#647067] block mb-1">Rainfall</span>
                      <span className="text-sm font-semibold text-zinc-900">{peakZone.rainfall}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Priority Sublocations */}
              <div className="bg-white p-5 lg:p-6 rounded-[14px] border border-[#E4E9E6] flex flex-col lg:col-span-2 min-h-[170px] shadow-[0_1px_3px_rgba(0,0,0,0.02)] justify-center">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-5 gap-3">
                  <div>
                    <span className="text-xs font-medium text-[#647067] uppercase tracking-wider block">
                      Priority Sublocations
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-3xl font-bold text-zinc-900 leading-none">{getRiskDistribution(zones).critical + getRiskDistribution(zones).high}</span>
                      <span className="text-xs text-[#647067]">priority sublocations requiring review</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                      <span className="text-xs text-[#647067]">Critical <span className="font-semibold text-zinc-900 ml-1">{getRiskDistribution(zones).critical}</span></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                      <span className="text-xs text-[#647067]">High <span className="font-semibold text-zinc-900 ml-1">{getRiskDistribution(zones).high}</span></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      <span className="text-xs text-[#647067]">Elevated <span className="font-semibold text-zinc-900 ml-1">{getRiskDistribution(zones).elevated}</span></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                      <span className="text-xs text-[#647067]">Watch <span className="font-semibold text-zinc-900 ml-1">{getRiskDistribution(zones).watch}</span></span>
                    </div>
                  </div>
                </div>
                
                <div className="w-full">
                  <RiskDistributionBar distribution={getRiskDistribution(zones)} />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT 4 COLS: Small Risk Map Overview & Latest Alerts */}
{/* RIGHT 4 COLS: Small Risk Map Overview & Latest Alerts */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Small Risk Map Preview */}
          <div className="bg-white border border-zinc-200/60 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#052e1a]" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-800">
                  Spatial Risk Overview
                </h3>
              </div>
            </div>

            {/* Compact Map Canvas */}
            <div className="h-56 rounded-lg overflow-hidden border border-zinc-200/50 relative">
              <GoogleRiskMap
            viewModels={viewModels}
            filteredNodes={viewModels}
            gateways={PROPOSED_GATEWAYS}
            selectedDeviceId={null}
            onDeviceSelect={() => {}}
            getRiskColor={getRiskColor}
            getRiskBorderColor={getRiskBorderColor}
            mapMode="risk"
                variant="compact"
                onOpenRiskMap={onOpenRiskMap}
              />
              <div className="absolute bottom-2 left-2 right-2 text-center pointer-events-none">
                <span className="bg-white/90 backdrop-blur px-2 py-0.5 rounded text-[9px] font-bold font-mono text-zinc-500 uppercase tracking-wider shadow-sm border border-zinc-200/50">Simulated pilot map</span>
              </div>
            </div>

            <button
              onClick={onOpenRiskMap}
              className="w-full py-2.5 bg-[#052e1a] hover:bg-[#0b5a31] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Open Full Interactive Risk Map</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* Intervention Status Panel */}
          <div className="bg-white border border-zinc-200/60 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-800">
                Intervention Dispatch Status
              </h3>
              <span className="text-[9px] font-mono text-zinc-500 font-bold">
                {assignedInterventionsCount} Active • {awaitingVerificationCount} Verifying • {verifiedCount} Verified
              </span>
            </div>

            <div className="space-y-3">
              {topPriorityZones.map((z) => {
                const item = getInterventionForZone(z.id, interventions);
                return (
                  <div key={z.id} className="p-3 bg-zinc-50/70 border border-zinc-200/40 rounded-lg flex justify-between items-center">
                    <div>
                      <span className="text-xs font-bold text-zinc-800 block">{getDisplayLocation(z.id, z.name)}</span>
                      <span className="text-[9px] text-zinc-400 font-mono block mt-0.5">
                        {item ? item.assignedTeam || 'Pending Team' : 'Awaiting dispatch'}
                      </span>
                    </div>
                    <InterventionStatusBadge status={item?.status} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Latest Simulated Alerts */}
          <div className="bg-white border border-zinc-200/60 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
              <Clock className="w-4 h-4 text-[#052e1a]" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-800">
                Recent Mock Signals
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#e8f4ed] border border-[#cad5ce]/50 rounded-lg space-y-1">
                <div className="flex justify-between items-center text-[9px] font-bold text-[#052e1a] uppercase tracking-wider">
                  <span>High Vector Activity (Simulated)</span>
                  <span>10m ago</span>
                </div>
                <p className="text-[10px] text-[#42534a]">{getDisplayLocation(peakZone.id, peakZone.name)} ({getNodeForZone(peakZone.id)}) mock rolling growth indicator is {peakZone.eggVelocity}.<br/><span className="text-[9px] text-[#647067] italic mt-1 block">This stored mock indicator is separate from the start-to-current percentage calculated from the displayed trend series.</span></p>
              </div>

              <div className="p-3 bg-zinc-50 border border-zinc-200/50 rounded-lg space-y-1">
                <div className="flex justify-between items-center text-[9px] font-bold text-zinc-600 uppercase tracking-wider">
                  <span>Climate Micro-Shift (Simulated)</span>
                  <span>25m ago</span>
                </div>
                <p className="text-[10px] text-zinc-500">{getDisplayLocation(peakZone.id, peakZone.name)} sustained {peakZone.humidity}% relative humidity post-rainfall.</p>
              </div>

              <div className="p-3 bg-zinc-50 border border-zinc-200/50 rounded-lg space-y-1">
                <div className="flex justify-between items-center text-[9px] font-bold text-zinc-600 uppercase tracking-wider">
                  <span>Gateway GW-01 Ping (Proposed)</span>
                  <span>1h ago</span>
                </div>
                <p className="text-[10px] text-zinc-500">Illustrative gateway heartbeat state — no live network connected.</p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Footer Disclaimer */}
      <div className="pt-6 border-t border-zinc-200/50 text-center">
        <p className="text-[10px] font-mono text-zinc-400">
          All data is simulated for demonstration purposes only.
        </p>
      </div>

    </div>
  );
}


// Helper Components for Key Vector Trends
function AreaSparkline({ data, color, gradientId }: { data: number[], color: string, gradientId: string }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const padding = 6;
  const height = 75;
  const width = 200; // SVG coordinate system width
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - padding - ((d - min) / range) * (height - 2 * padding);
    return `${x},${y}`;
  });

  // Generate a smooth curve
  let pathD = `M ${points[0].split(',')[0]} ${points[0].split(',')[1]} `;
  for (let i = 0; i < data.length - 1; i++) {
    const p0 = points[i].split(',').map(Number);
    const p1 = points[i+1].split(',').map(Number);
    const cp1x = p0[0] + (p1[0] - p0[0]) / 2;
    const cp1y = p0[1];
    const cp2x = p0[0] + (p1[0] - p0[0]) / 2;
    const cp2y = p1[1];
    pathD += `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1[0]} ${p1[1]} `;
  }

  const fillD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

  return (
    <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="60%" stopColor={color} stopOpacity="0.05" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      
      {/* 2 faint guide lines */}
      <line x1="0" y1={padding} x2={width} y2={padding} stroke="#f4f4f5" strokeWidth="1" />
      <line x1="0" y1={height - padding} x2={width} y2={height - padding} stroke="#f4f4f5" strokeWidth="1" />
      
      <path d={fillD} fill={`url(#${gradientId})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Latest point emphasized ONLY */}
      <circle cx={points[points.length-1].split(',')[0]} cy={points[points.length-1].split(',')[1]} r="4.5" fill={color} stroke="#ffffff" strokeWidth="2" />
    </svg>
  );
}

function RiskDistributionBar({ distribution }: { distribution: { critical: number, high: number, elevated: number, watch: number } }) {
  const total = distribution.critical + distribution.high + distribution.elevated + distribution.watch;
  
  const getWidth = (val: number) => `${Math.max((val / total) * 100, 2)}%`;
  
  return (
    <div className="flex h-3 w-full rounded-full overflow-hidden gap-0.5 bg-zinc-100">
      {distribution.critical > 0 && <div className="bg-red-500 h-full" style={{ width: getWidth(distribution.critical) }}></div>}
      {distribution.high > 0 && <div className="bg-orange-500 h-full" style={{ width: getWidth(distribution.high) }}></div>}
      {distribution.elevated > 0 && <div className="bg-amber-500 h-full" style={{ width: getWidth(distribution.elevated) }}></div>}
      {distribution.watch > 0 && <div className="bg-green-500 h-full" style={{ width: getWidth(distribution.watch) }}></div>}
    </div>
  );
}
