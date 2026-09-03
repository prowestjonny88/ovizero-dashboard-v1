import React, { useState, useEffect, useRef } from 'react';
import { DeviceData } from '../types';
import { PILOT_NODES } from '../data';
import { getDeviceMonitoring } from '../data/deviceMonitoring';
import DeviceMonitoringTabs from './devices/DeviceMonitoringTabs';
import { 
  Search, 
  Battery, 
  Wifi, 
  RefreshCw, 
  Cpu, 
  CheckCircle, 
  Terminal, 
  Camera,
  ShieldAlert
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
  
  const detailRef = useRef<HTMLDivElement>(null);

  const handleViewNode = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    requestAnimationFrame(() => {
      detailRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  };
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

  const attentionDevices = devices.filter(d => d.maintenanceState === 'Maintenance Required');
  const attentionCount = attentionDevices.length;
  
  const getAttentionReasons = (device: DeviceData) => {
    const reasons = [];
    if (device.battery <= 25) reasons.push('low battery');
    if (device.solarStatus === 'Low Solar') reasons.push('low solar');
    if (device.loraSignal === 'Weak') reasons.push('weak link');
    if (device.diagnostics.electrodeContact === 'Attention Required') reasons.push('electrode attention');
    
    if (reasons.length === 0 && device.maintenanceState === 'Maintenance Required') {
        reasons.push('maintenance required');
    }
    return reasons;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-zinc-950 tracking-tight">DEVICES</h1>
          <p className="text-[11px] font-medium text-zinc-500 mt-1">Node health and maintenance</p>
        </div>
      </section>

      {/* ATTENTION NEEDED */}
      {attentionCount > 0 && (
        <section className="bg-red-50/50 border border-red-100 rounded-xl p-6">
          <div className="flex items-center gap-2 text-red-700 font-bold mb-4">
            <ShieldAlert className="w-5 h-5" />
            <h2 className="text-sm tracking-widest uppercase">Attention Needed</h2>
          </div>
          <div className="text-xs text-red-600 font-medium mb-6">
            {attentionCount} node{attentionCount !== 1 ? 's' : ''} need{attentionCount === 1 ? 's' : ''} attention
          </div>

          <div className={`grid ${attentionCount === 1 ? 'grid-cols-1 max-w-xl' : 'grid-cols-1 md:grid-cols-2'} gap-4`}>
            {attentionDevices.map(device => {
              const reasons = getAttentionReasons(device);
              const pilotNode = PILOT_NODES.find(n => n.deviceId === device.id);
              const locationName = pilotNode ? pilotNode.sublocation : device.location;

              return (
                <div key={device.id} className="bg-white border border-red-200 rounded-lg p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="font-bold text-lg text-zinc-950">{device.id}</div>
                      <div className="text-sm text-zinc-600">{locationName}</div>
                    </div>
                    <div className="bg-red-100 text-red-800 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                      Maintenance required
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Attention reasons</div>
                    <ul className="text-sm text-zinc-700 space-y-1 list-disc list-inside">
                      {device.battery <= 25 && <li>Battery {device.battery}%</li>}
                      {device.solarStatus === 'Low Solar' && <li>Low solar input</li>}
                      {device.loraSignal === 'Weak' && <li>Weak LoRaWAN signal</li>}
                      {device.diagnostics.electrodeContact === 'Attention Required' && <li>Electrode contact requires attention</li>}
                    </ul>
                  </div>

                  <button 
                    onClick={() => handleViewNode(device.id)}
                    className="w-full sm:w-auto px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-colors"
                  >
                    View Node
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Fleet Summary */}
      <section className="bg-white border border-zinc-200/50 rounded-xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
        <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Fleet Summary</h2>
        <div className="flex flex-wrap gap-x-8 gap-y-4">
          <div>
            <div className="text-2xl font-extrabold text-zinc-950">{devices.length}</div>
            <div className="text-xs font-medium text-zinc-500">monitoring nodes</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-zinc-950">{devices.length - attentionCount}</div>
            <div className="text-xs font-medium text-zinc-500">normal</div>
          </div>
          {attentionCount > 0 && (
            <div>
              <div className="text-2xl font-extrabold text-red-600">{attentionCount}</div>
              <div className="text-xs font-medium text-red-600">needs attention</div>
            </div>
          )}
          {devices.filter(d => d.loraSignal === 'Weak').length > 0 && (
            <div>
              <div className="text-2xl font-extrabold text-amber-600">{devices.filter(d => d.loraSignal === 'Weak').length}</div>
              <div className="text-xs font-medium text-amber-600">weak link</div>
            </div>
          )}
        </div>
      </section>

      {/* Roster & Detail Panel */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Device Table Roster (8 columns span) */}
        <div className="lg:col-span-8 bg-white border border-zinc-200/50 rounded-xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex flex-col">
          {/* Table Toolbar */}
          <div className="px-6 py-4 border-b border-zinc-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-zinc-50/50">
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-900">Node Roster</h3>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
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

          {/* Roster Table Layout (hidden on mobile in favor of stacked cards, or just compact table) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/20">
                  <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-zinc-400 whitespace-nowrap">Node</th>
                  <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-zinc-400 whitespace-nowrap">Location</th>
                  <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-zinc-400 whitespace-nowrap">Battery / Power</th>
                  <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-zinc-400 whitespace-nowrap">Connectivity</th>
                  <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-zinc-400 whitespace-nowrap">Maintenance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs">
                {filteredDevices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-zinc-400 font-medium">
                      No matching devices found in roster
                    </td>
                  </tr>
                ) : (
                  filteredDevices.map((device) => {
                    const isSelected = activeDevice?.id === device.id;
                    const isMaint = device.maintenanceState === 'Maintenance Required';
                    const pilotNode = PILOT_NODES.find(n => n.deviceId === device.id);
                    const locationName = pilotNode ? pilotNode.sublocation : device.location;
                    const reasons = getAttentionReasons(device);
                    
                    const record = getDeviceMonitoring(device);
                    const condensationDisplay = record.imaging.condensation === 'Possible' 
                      ? 'Possible condensation' 
                      : record.imaging.condensation === 'Detected' 
                        ? 'Condensation detected' 
                        : 'Clear';
                    
                    return (
                      <tr
                        key={device.id}
                        onClick={() => setSelectedDeviceId(device.id)}
                        className={`hover:bg-zinc-50/50 transition-colors cursor-pointer border-l-2 ${
                          isSelected ? 'bg-zinc-50/70 border-zinc-950 font-semibold' : 'border-transparent'
                        }`}
                      >
                        <td className="px-4 py-4 whitespace-nowrap font-bold text-zinc-950 font-mono">
                          {device.id}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap font-medium text-zinc-900">
                          {locationName}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-zinc-700">
                          {device.battery}% &middot; {device.solarStatus}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-zinc-700">
                          {device.loraSignal}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
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

          {/* Mobile Stacked Cards for Roster */}
          <div className="md:hidden flex flex-col divide-y divide-zinc-100">
             {filteredDevices.length === 0 ? (
                <div className="px-4 py-12 text-center text-zinc-400 font-medium">
                  No matching devices found
                </div>
              ) : (
                filteredDevices.map(device => {
                  const pilotNode = PILOT_NODES.find(n => n.deviceId === device.id);
                  const locationName = pilotNode ? pilotNode.sublocation : device.location;
                  const isMaint = device.maintenanceState === 'Maintenance Required';
                  const reasons = getAttentionReasons(device);

                  return (
                    <div key={device.id} className="p-4 bg-white" onClick={() => setSelectedDeviceId(device.id)}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                           <div className="font-bold text-zinc-950 font-mono text-sm">{device.id}</div>
                           <div className="text-xs text-zinc-600 font-medium">{locationName}</div>
                        </div>
                         <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest ${
                            isMaint 
                              ? 'bg-zinc-950 text-white border border-zinc-950' 
                              : 'bg-zinc-100 text-zinc-600 border border-zinc-200/50'
                          }`}>
                            {isMaint ? 'Maint Req' : 'Normal'}
                        </span>
                      </div>
                      
                      {reasons.length > 0 && (
                        <div className="text-xs text-red-600 mt-2 font-medium">
                          {reasons.join(' · ')}
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-zinc-600">
                        <div>{device.battery}% battery</div>
                        <div>{device.loraSignal} link</div>
                      </div>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewNode(device.id);
                        }}
                        className="mt-4 w-full py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded transition-colors"
                      >
                        View Node
                      </button>
                    </div>
                  );
                })
              )}
          </div>
        </div>

        {/* Right Detail Panel (4 columns span) */}
        <div ref={detailRef} className="lg:col-span-4 bg-white border border-zinc-200/50 rounded-xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex flex-col lg:sticky lg:top-24 scroll-mt-28">
          {!activeDevice ? (
            <div className="p-8 flex flex-col items-center justify-center text-center h-[520px]">
              <Cpu className="w-8 h-8 text-zinc-300 mb-3" />
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-2">No Device Selected</h4>
              <p className="text-[10px] text-zinc-500 max-w-[200px]">
                No devices match the current filters. Clear filters to see device details.
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col lg:max-h-[80vh] lg:overflow-y-auto">
              <DeviceMonitoringTabs device={activeDevice} />
              
              <div className="p-4 border-t border-zinc-100 bg-zinc-50 mt-auto">
                {diagnosticResult && diagnosticResult[activeDevice.id] ? (
                  <div className="w-full bg-emerald-50 text-emerald-800 border border-emerald-200 p-3 rounded-lg text-xs flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                    <div>
                      <p className="font-bold">Stored check completed.</p>
                      
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleRunDiagnostic(activeDevice.id)}
                    disabled={diagnosticRunningId === activeDevice.id}
                    className="w-full bg-zinc-100 text-zinc-700 font-bold text-[10px] uppercase tracking-widest py-3 px-4 rounded-lg hover:bg-zinc-200 disabled:opacity-50 transition-all flex items-center justify-center gap-2 border border-zinc-300/50"
                  >
                    {diagnosticRunningId === activeDevice.id ? (
                      <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Running...</>
                    ) : (
                      <><Terminal className="w-3.5 h-3.5" /> Run Device Check</>
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
