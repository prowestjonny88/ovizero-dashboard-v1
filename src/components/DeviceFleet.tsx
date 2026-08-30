import ScenarioPeriodLabel from "./ScenarioPeriodLabel";
import React, { useState, useEffect } from 'react';
import { DeviceData } from '../types';
import { PILOT_NODES } from '../data';
import { getDeviceHealthSummary } from '../utils/dashboard';
import DeviceMonitoringTabs from './devices/DeviceMonitoringTabs';
import { 
  Search, 
  Battery, 
  Wifi, 
  RefreshCw, 
  Cpu, 
  CheckCircle, 
  Sun, 
  Radio, 
  Terminal, 
  Check, 
  Droplets,
  Camera,
  Sparkles
} from 'lucide-react';

interface DeviceFleetProps {
  devices: DeviceData[];
  onDiagnosticRun: (deviceId: string) => void;
  diagnosticResult: { [key: string]: string };
}

export default function DeviceFleet({ 
  devices, 
  onDiagnosticRun, 
  diagnosticResult
}: DeviceFleetProps) {
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(devices[0]?.id ?? null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'NORMAL' | 'MAINTENANCE'>('ALL');
  const [diagnosticRunningId, setDiagnosticRunningId] = useState<string | null>(null);

  // Filter devices based on search query and status filter
  const filteredDevices = React.useMemo(() => devices.filter((device) => {
    const matchesSearch = 
      device.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === 'ALL') return matchesSearch;
    if (statusFilter === 'NORMAL') return matchesSearch && device.maintenanceState === 'Normal';
    if (statusFilter === 'MAINTENANCE') return matchesSearch && device.maintenanceState === 'Maintenance Required';
    return matchesSearch;
  }), [devices, searchQuery, statusFilter]);

  // Handle selected device ID updating safely when filters change
  useEffect(() => {
    if (filteredDevices.length === 0) {
      if (selectedDeviceId !== null) setSelectedDeviceId(null);
      return;
    }
    const isStillVisible = filteredDevices.some(d => d.id === selectedDeviceId);
    if (!isStillVisible) {
      setSelectedDeviceId(filteredDevices[0].id);
    }
  }, [filteredDevices, selectedDeviceId]);

  const activeDevice = filteredDevices.find(d => d.id === selectedDeviceId) ?? null;
  const deviceHealth = getDeviceHealthSummary(devices);

  const diagnosticTimerRef = React.useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (diagnosticTimerRef.current) {
        window.clearTimeout(diagnosticTimerRef.current);
      }
    };
  }, []);

  const handleRunDiagnostic = async (deviceId: string) => {
    if (diagnosticRunningId) return;
    setDiagnosticRunningId(deviceId);
    
    diagnosticTimerRef.current = window.setTimeout(() => {
      onDiagnosticRun(deviceId);
      setDiagnosticRunningId(null);
    }, 800);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      <div className="flex justify-end">
        <ScenarioPeriodLabel selectedDateRange="" mode="current-snapshot" />
      </div>

      {/* 1. Overview Bento Metrics */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Retry Rate */}
        <div className="bg-white border border-zinc-200/50 rounded-xl p-5 flex flex-col justify-between shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[9px] font-bold uppercase tracking-widest">Retry rate</span>
            <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <div className="text-sm font-bold text-zinc-400 font-geist tracking-tight mt-1 mb-2">Not measured</div>
          <span className="text-[8px] text-zinc-400 font-bold uppercase mt-auto tracking-wider">
            Packet retransmissions
          </span>
        </div>

        {/* Low Battery */}
        <div className="bg-white border border-zinc-200/50 rounded-xl p-5 flex flex-col justify-between shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[9px] font-bold uppercase tracking-widest">Low Battery</span>
            <Battery className="w-3.5 h-3.5 text-zinc-950" />
          </div>
          <div className="text-3xl font-bold text-zinc-950 font-geist tracking-tight">{deviceHealth.lowBattery}</div>
          <span className="text-[8px] text-zinc-400 font-bold uppercase mt-3 tracking-wider">
            Under 25% Threshold
          </span>
        </div>

        {/* Weak Signal */}
        <div className="bg-white border border-zinc-200/50 rounded-xl p-5 flex flex-col justify-between shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[9px] font-bold uppercase tracking-widest">Weak Signal</span>
            <Wifi className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <div className="text-3xl font-bold text-zinc-950 font-geist tracking-tight">{devices.filter(d => d.loraSignal === 'Weak').length}</div>
          <span className="text-[8px] text-zinc-400 font-bold uppercase mt-3 tracking-wider">
            1 simulated weak-signal record
          </span>
        </div>

        {/* Open Maintenance */}
        <div className="bg-white border border-zinc-200/50 rounded-xl p-5 flex flex-col justify-between shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[9px] font-bold uppercase tracking-widest truncate" title="Maintenance Tickets">Open Maintenance</span>
            <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <div className="text-3xl font-bold text-zinc-950 font-geist tracking-tight">{devices.filter(d => d.maintenanceState === 'Maintenance Required').length}</div>
          <span className="text-[8px] text-zinc-400 font-bold uppercase mt-3 tracking-wider">
            1 simulated maintenance scenario
          </span>
        </div>

        {/* Good Image Quality */}
        <div className="bg-white border border-zinc-200/50 rounded-xl p-5 flex flex-col justify-between shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[9px] font-bold uppercase tracking-widest truncate" title="Image Quality">Usable-image rate</span>
            <Camera className="w-3.5 h-3.5 text-zinc-950" />
          </div>
          <div className="text-sm font-bold text-zinc-400 font-geist tracking-tight mt-1 mb-2">Not measured</div>
          <span className="text-[8px] text-zinc-400 font-bold uppercase mt-auto tracking-wider">
            No physical image-quality rate measured
          </span>
        </div>
      </section>

      {/* 2. Main content split (Table Left, side panel Right) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Device Table Roster (8 columns span) */}
        <div className="lg:col-span-8 bg-white border border-zinc-200/50 rounded-xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
          {/* Table Toolbar */}
          <div className="px-6 py-4 border-b border-zinc-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-zinc-50/50">
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-900">Node Roster</h3>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-3.5 h-3.5" />
                <input
                  type="text"
                  placeholder="Search nodes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-1.5 text-[11px] bg-white rounded-lg border border-zinc-200/50 focus:outline-none focus:border-zinc-950 w-full sm:w-48 text-zinc-900 font-bold uppercase tracking-wider"
                />
              </div>

              {/* Status Filter buttons */}
              <div className="flex items-center border border-zinc-200/50 rounded-lg overflow-hidden bg-white">
                <button
                  onClick={() => setStatusFilter('ALL')}
                  className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider border-r border-zinc-200/40 last:border-0 ${
                    statusFilter === 'ALL' ? 'bg-zinc-950 text-white' : 'text-zinc-500 hover:bg-zinc-50'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter('NORMAL')}
                  className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider border-r border-zinc-200/40 last:border-0 ${
                    statusFilter === 'NORMAL' ? 'bg-zinc-950 text-white' : 'text-zinc-500 hover:bg-zinc-50'
                  }`}
                >
                  Ok
                </button>
                <button
                  onClick={() => setStatusFilter('MAINTENANCE')}
                  className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider last:border-0 ${
                    statusFilter === 'MAINTENANCE' ? 'bg-zinc-950 text-white' : 'text-zinc-500 hover:bg-zinc-50'
                  }`}
                >
                  Maint
                </button>
              </div>
            </div>
          </div>

          {/* Roster Table Layout */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/20">
                  <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-zinc-400 whitespace-nowrap">Node ID</th>
                  <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-zinc-400 whitespace-nowrap">Location</th>
                  <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-zinc-400 whitespace-nowrap">Illustrative scenario index</th>
                  <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-zinc-400 whitespace-nowrap">Egg Count</th>
                  <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-zinc-400 whitespace-nowrap">Match score</th>
                  <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-zinc-400 whitespace-nowrap">Battery</th>
                  <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-zinc-400 whitespace-nowrap">Solar</th>
                  <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-zinc-400 whitespace-nowrap">LoRa</th>
                  <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-zinc-400 whitespace-nowrap text-right">Maintenance State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-mono text-xs">
                {filteredDevices.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center text-zinc-400 font-medium font-sans">
                      No matching devices found in roster
                    </td>
                  </tr>
                ) : (
                  filteredDevices.map((device) => {
                    const isSelected = activeDevice.id === device.id;
                    const isMaint = device.maintenanceState === 'Maintenance Required';
                    
                    return (
                      <tr
                        key={device.id}
                        onClick={() => setSelectedDeviceId(device.id)}
                        className={`hover:bg-zinc-50/50 transition-colors cursor-pointer border-l-2 ${
                          isSelected ? 'bg-zinc-50/70 border-zinc-950 font-semibold' : 'border-transparent'
                        }`}
                      >
                        {/* Node ID */}
                        <td className="px-4 py-4 whitespace-nowrap font-bold text-zinc-950">
                          {device.id}
                        </td>
                        {/* Location name */}
                        
                        <td className="px-4 py-4 whitespace-nowrap font-sans font-medium text-zinc-900">
                          {(() => {
                            const pilotNode = PILOT_NODES.find(n => n.deviceId === device.id);
                            return pilotNode ? (
                              <div className="flex flex-col">
                                <span>PPR Seri Anggerik</span>
                                <span className="text-[10px] text-zinc-500 font-normal">{pilotNode.sublocation}</span>
                              </div>
                            ) : device.location;
                          })()}
                        </td>
                        {/* Illustrative scenario index horizontal indicator */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-8 bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full bg-zinc-950" 
                                style={{ width: `${device.riskScore}%` }}
                              ></div>
                            </div>
                            <span className="font-bold text-zinc-950 font-mono">{device.riskScore}</span>
                          </div>
                        </td>
                        {/* Egg Count */}
                        <td className="px-4 py-4 whitespace-nowrap font-bold text-zinc-950 font-mono">
                          {device.eggCount} eggs
                        </td>
                        {/* Mock Match Score */}
                        <td className="px-4 py-4 whitespace-nowrap font-bold text-zinc-950 font-mono">
                          Not calibrated
                        </td>
                        {/* Battery Level */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Battery className="w-3.5 h-3.5 text-zinc-950" />
                            <span className="text-zinc-950 font-bold font-mono">
                              {device.battery}%
                            </span>
                          </div>
                        </td>
                        {/* Solar Status */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold font-sans uppercase tracking-wider ${
                            device.solarStatus === 'Charging'
                              ? 'bg-zinc-100 text-zinc-900 border border-zinc-200'
                              : device.solarStatus === 'Stable'
                                ? 'bg-zinc-50 text-zinc-500 border border-zinc-100'
                                : 'bg-zinc-900 text-white'
                          }`}>
                            {device.solarStatus}
                          </span>
                        </td>
                        {/* LoRa Signal quality */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="font-sans text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                            {device.loraSignal}
                          </span>
                        </td>
                        {/* Status label */}
                        <td className="px-4 py-4 whitespace-nowrap text-right">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-sans uppercase tracking-widest ${
                            isMaint 
                              ? 'bg-zinc-950 text-white border border-zinc-950' 
                              : 'bg-zinc-100 text-zinc-600 border border-zinc-200/50'
                          }`}>
                            {isMaint ? 'Maint Req' : 'Normal'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Detail Panel (4 columns span) */}
        <div className="lg:col-span-4 bg-white border border-zinc-200/50 rounded-xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex flex-col sticky top-24">
          {!activeDevice ? (
            <div className="p-8 flex flex-col items-center justify-center text-center h-[520px]">
              <Cpu className="w-8 h-8 text-zinc-300 mb-3" />
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-2">No Device Selected</h4>
              <p className="text-[10px] text-zinc-500 max-w-[200px]">
                No devices match the current filters. Clear filters to see device details.
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col max-h-[80vh] overflow-y-auto">
              <DeviceMonitoringTabs device={activeDevice} />
              
              <div className="p-4 border-t border-zinc-100 bg-zinc-50 mt-auto">
                {diagnosticResult && diagnosticResult[activeDevice.id] ? (
                  <div className="w-full bg-emerald-50 text-emerald-800 border border-emerald-200 p-3 rounded-lg text-xs flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                    <div>
                      <p className="font-bold">Simulated diagnostic completed.</p>
                      <p className="text-emerald-700/80 mt-0.5">No live device is connected.</p>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleRunDiagnostic(activeDevice.id)}
                    disabled={diagnosticRunningId === activeDevice.id}
                    className="w-full bg-zinc-950 text-white font-bold text-[10px] uppercase tracking-widest py-3 px-4 rounded-lg hover:bg-zinc-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    {diagnosticRunningId === activeDevice.id ? (
                      <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Running simulated check...</>
                    ) : (
                      <><Terminal className="w-3.5 h-3.5" /> Run Simulated Diagnostic</>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
