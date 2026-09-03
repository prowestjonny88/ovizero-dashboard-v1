import ScenarioPeriodLabel from "./ScenarioPeriodLabel";
import React from 'react';
import { ZoneData, DeviceData, InterventionMap, ExportFormat, ReportLogEntry } from '../types';
import { getTopPriorityZones, getRiskDistribution, getDeviceHealthSummary, buildReportLogs, getPilotDisplayLocationForMetricZone } from '../utils/dashboard';
import { PILOT_NODES } from '../data';
import ExportMenu from './ExportMenu';
import { ChevronRight, Sparkles } from 'lucide-react';


interface ReportsProps {
  zones: ZoneData[];
  devices: DeviceData[];
  
  onExport: (format: ExportFormat) => Promise<void> | void;
  exportingFormat: ExportFormat | null;
  onZoneSelect: (zoneId: string) => void;
  interventions: InterventionMap;
}

export default function Reports({ 
  zones, 
  devices, 
   
  onExport,
  exportingFormat,
  onZoneSelect,
  interventions
}: ReportsProps) {
  
  const getRangeLabel = () => {
    return '7-Day';
    return '90-Day';
  };

  const rankedZones = getTopPriorityZones(zones, 5);
  const reportLogs = buildReportLogs( zones, interventions);
  const topZone = rankedZones[0];
  const deviceHealth = getDeviceHealthSummary(devices);
  const activeNodesCount = deviceHealth.total;
  const riskDist = getRiskDistribution(zones);
  const highPriorityCount = riskDist.critical + riskDist.high;
  
  const maintenanceCount = deviceHealth.maintenance;

  
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Page Header */}
      <section className="bg-white p-6 rounded-xl border border-zinc-200/50 shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Statistical Audit & Analytics</span>
          <h1 className="text-xl font-extrabold text-zinc-950 tracking-tight mt-1">
            {getRangeLabel()} Risk Scenario Report
          </h1>
          <p className="text-xs text-zinc-500 font-medium mt-1 mb-2">
            Selected-period scenario activity.
          </p>
          <ScenarioPeriodLabel  mode="selected-period" />
        </div>
        <ExportMenu onExport={onExport} exportingFormat={exportingFormat} />
      </section>

      {/* Summary KPI Cards Row */}
      <section className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Top Risk Zone */}
        <div className="bg-white p-5 rounded-xl border border-zinc-200/50 flex flex-col justify-between shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
          <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest block mb-2">Top Risk Zone</span>
          <div>
            <span className="text-sm font-extrabold text-zinc-950 block truncate leading-tight">
              {topZone ? (() => {
                const loc = getPilotDisplayLocationForMetricZone(topZone.id, PILOT_NODES, zones);
                return loc ? `${loc.parentZone} · ${loc.sublocation}` : topZone.name;
              })() : 'None'}
            </span>
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider font-mono mt-1 block">Scenario index: {topZone?.interventionPriority}</span>
          </div>
        </div>

        {/* Device records */}
        <div className="bg-white p-5 rounded-xl border border-zinc-200/50 flex flex-col justify-between shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
          <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest block mb-2">Device records</span>
          <div>
            <span className="text-2xl font-bold text-zinc-950 font-geist leading-tight">{activeNodesCount}</span>
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider font-mono mt-1 block">records</span>
          </div>
        </div>

        {/* High-Priority sublocations */}
        <div className="bg-white p-5 rounded-xl border border-zinc-200/50 flex flex-col justify-between shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
          <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest block mb-2">High-Priority sublocations</span>
          <div>
            <span className="text-2xl font-bold text-zinc-950 font-geist leading-tight">{highPriorityCount}</span>
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider font-mono mt-1 block">Needs Inspection</span>
          </div>
        </div>

        {/* Open maintenance scenarios */}
        <div className="bg-white p-5 rounded-xl border border-zinc-200/50 flex flex-col justify-between shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
          <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest block mb-2">Open maintenance scenarios</span>
          <div>
            <span className="text-2xl font-bold text-zinc-950 font-geist leading-tight">{maintenanceCount}</span>
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider font-mono mt-1 block">Requires attention</span>
          </div>
        </div>

        {/* Risk Scenario Report */}
        <div className={`p-5 rounded-xl border flex flex-col justify-between shadow-[0_1px_2px_rgba(0,0,0,0.01)] ${
          highPriorityCount > 0 ? 'bg-zinc-50 border-zinc-300' : 'bg-white border-zinc-200/50'
        }`}>
          <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest block mb-2">Risk Scenario Report</span>
          <div>
            <span className="text-2xl font-bold text-zinc-950 font-geist leading-tight">{highPriorityCount}</span>
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider font-mono mt-1 block">
              High Risks
            </span>
          </div>
        </div>

      </section>

      {/* Main Grid: Priority Zones & Device Health Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Top 5 Priority Zones list (7 Columns) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-zinc-200/50 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
          <div className="p-5 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-900">Ranked Priority Zones Summary</h3>
            <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 font-mono">Geospatial Layer</span>
          </div>
          
          <div className="divide-y divide-zinc-100">
            {rankedZones.map((zone, idx) => {
              const loc = getPilotDisplayLocationForMetricZone(zone.id, PILOT_NODES, zones);
              const displayName = loc ? `${loc.parentZone} · ${loc.sublocation}` : zone.name;
              return (
              <div 
                key={zone.id} 
                onClick={() => onZoneSelect(zone.id)}
                className="p-4 flex items-center justify-between hover:bg-zinc-50/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] font-bold text-zinc-400 bg-zinc-50 px-1.5 py-0.5 rounded border border-zinc-200/40">
                    PR-{idx + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-xs text-zinc-900 group-hover:underline">{displayName}</h4>
                    <p className="text-[9px] text-zinc-400 uppercase font-bold tracking-wider mt-0.5">Candidate signal &mdash; not classified</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest block">Scenario index</span>
                    <span className="font-bold font-mono text-xs text-zinc-900">{zone.interventionPriority}/100</span>
                  </div>
                  <div className="text-right hidden sm:block">
                    <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest block">Growth</span>
                    <span className="font-mono text-xs text-zinc-900">{zone.eggActivityChange}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                </div>
              </div>
            );
            })}
          </div>
        </div>

        {/* Device Health Summary & Warning Status (5 Columns) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-zinc-200/50 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
          <div className="p-5 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-900">Device Diagnostics Summary</h3>
            <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 font-mono">Connectivity state</span>
          </div>

          <div className="p-5 space-y-4">
            {devices.map(device => {
              const isWarning = device.maintenanceState === 'Maintenance Required';
              return (
                <div 
                  key={device.id} 
                  className={`p-3.5 rounded-lg border transition-all ${
                    isWarning 
                      ? 'bg-zinc-50/50 border-zinc-300' 
                      : 'bg-white border-zinc-150'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-xs text-zinc-900 font-mono">{device.id}</h4>
                      <p className="text-[9px] font-medium text-zinc-400 mt-0.5 uppercase tracking-wider">{device.location}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-widest ${
                      isWarning 
                        ? 'bg-zinc-950 text-white' 
                        : 'bg-zinc-100 text-zinc-600 border border-zinc-200/50'
                    }`}>
                      {device.maintenanceState}
                    </span>
                  </div>

                  {/* Device micro grid parameters */}
                  <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-zinc-100 text-[10px] font-medium text-zinc-500 font-mono">
                    <div>
                      <span className="text-[8px] text-zinc-400 uppercase tracking-widest block mb-0.5">Battery</span>
                      <span className="font-bold text-zinc-900">{device.battery}%</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-zinc-400 uppercase tracking-widest block mb-0.5">Solar</span>
                      <span className="font-bold text-zinc-900">{device.solarStatus}</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-zinc-400 uppercase tracking-widest block mb-0.5">LoRa WAN</span>
                      <span className="font-bold text-zinc-900">{device.loraSignal}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </section>

      {/* AI Diagnostic Logs Area */}
      <section className="bg-white rounded-xl border border-zinc-200/50 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
        <div className="p-5 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-zinc-400" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-900">Diagnostic & Intervention Activity</h3>
          </div>
          <span className="text-[8px] font-bold uppercase tracking-wider text-zinc-400 font-mono">Audited Records</span>
        </div>

        <div className="p-5 divide-y divide-zinc-100">
          {reportLogs.map((log) => (
            <div key={log.id} className="py-3.5 first:pt-0 last:pb-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div className="flex items-start gap-3">
                <span className="text-[9px] font-bold text-zinc-400 uppercase font-mono mt-0.5 shrink-0 w-24">
                  {log.displayTime}
                </span>
                
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-1.5 py-0.5 rounded bg-zinc-100 text-[8px] font-bold text-zinc-600 uppercase tracking-wider font-mono">
                      {log.tag}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                    <span className={`text-[8px] font-bold uppercase tracking-widest ${
                      log.level === 'WARNING' || log.level === 'ERROR' ? 'text-zinc-950 font-black' : 'text-zinc-400'
                    }`}>
                      {log.level}
                    </span>
                  </div>
                  <p className="text-zinc-600 font-medium text-xs leading-relaxed">
                    {log.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
