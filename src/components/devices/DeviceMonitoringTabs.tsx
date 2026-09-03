import React, { useState } from 'react';
import { DeviceData } from '../../types';
import { getDeviceMonitoring } from '../../data/deviceMonitoring';
import { PILOT_NODES } from '../../data';
import { ChevronDown, ChevronRight, Zap, Radio, Camera, Wrench, ShieldAlert } from 'lucide-react';

interface DeviceMonitoringTabsProps {
  device: DeviceData;
}

export default function DeviceMonitoringTabs({ device }: DeviceMonitoringTabsProps) {
  const [expandedSection, setExpandedSection] = useState<'none' | 'technical' | 'limits'>('none');
  const record = getDeviceMonitoring(device);
  const pilotNode = PILOT_NODES.find(n => n.deviceId === device.id);
  const locationName = pilotNode ? pilotNode.sublocation : device.location;

  // Derive attention reason for the selected node
  const getAttentionReasons = () => {
    const reasons = [];
    if (device.battery <= 25) reasons.push('Low battery');
    if (device.solarStatus === 'Low Solar') reasons.push('Low solar input');
    if (device.loraSignal === 'Weak') reasons.push('Weak connectivity');
    if (device.diagnostics.electrodeContact === 'Attention Required') reasons.push('Electrode contact attention');
    
    if (reasons.length === 0 && device.maintenanceState === 'Maintenance Required') {
        reasons.push('Maintenance required');
    }
    return reasons;
  };

  const attentionReasons = getAttentionReasons();
  const needsAttention = attentionReasons.length > 0;
  
  const formatPercent = (value: number | null): string => value === null ? 'Not measured' : `${value}%`;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-5 border-b border-zinc-100">
        <h2 className="text-xl font-bold text-zinc-950 tracking-tight">{device.id}</h2>
        <p className="text-sm text-zinc-500 font-medium">{locationName}</p>
        
        {needsAttention && (
          <div className="mt-3 inline-flex items-center gap-1.5 bg-red-50 text-red-700 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-widest border border-red-200">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>NEEDS ATTENTION</span>
          </div>
        )}
      </div>

      {/* Simple health summary */}
      <div className="p-5 space-y-6">
        {/* Power */}
        <div>
          <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest mb-1 flex items-center gap-1.5"><Zap className="w-3 h-3"/> Power</div>
          <div className="text-sm font-bold text-zinc-900">{device.battery}% &middot; {device.solarStatus}</div>
          <div className="text-xs text-zinc-500">Node input</div>
        </div>

        {/* Connectivity */}
        <div>
          <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest mb-1 flex items-center gap-1.5"><Radio className="w-3 h-3"/> Connectivity</div>
          <div className="text-sm font-bold text-zinc-900">{device.loraSignal}</div>
          <div className="text-xs text-zinc-500">LoRaWAN link</div>
        </div>

        {/* Imaging / Condensation */}
        <div>
          <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest mb-1 flex items-center gap-1.5"><Camera className="w-3 h-3"/> Imaging / condensation</div>
          <div className="text-sm font-bold text-zinc-900">{record.imaging.condensation === 'Detected' ? 'Condensation detected' : (record.imaging.condensation === 'Possible' ? 'Possible condensation' : 'Clear')}</div>
          <div className="text-xs text-zinc-500">Device-health state</div>
        </div>

        {/* Maintenance */}
        <div>
          <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest mb-1 flex items-center gap-1.5"><Wrench className="w-3 h-3"/> Maintenance</div>
          <div className="text-sm font-bold text-zinc-900">{device.maintenanceState === 'Maintenance Required' ? 'Maintenance required' : 'Normal'}</div>
          <div className="text-xs text-zinc-500">{device.maintenanceState === 'Maintenance Required' ? 'Maintenance due' : 'No maintenance flag'}</div>
        </div>

        {/* Attention reason */}
        {needsAttention && (
          <div>
            <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest mb-1">Attention reason</div>
            <div className="text-sm font-bold text-red-700">{attentionReasons.join(' + ')}</div>
          </div>
        )}
        
        {/* Snapshot */}
        <div>
          <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest mb-1">Snapshot</div>
          <div className="text-sm font-bold text-zinc-900">{device.lastSync}</div>
        </div>
      </div>

      {/* Accordions */}
      <div className="border-t border-zinc-100">
        <button 
          onClick={() => setExpandedSection(expandedSection === 'technical' ? 'none' : 'technical')}
          className="w-full flex items-center justify-between p-4 bg-zinc-50 hover:bg-zinc-100 transition-colors text-left"
        >
          <span className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Technical details</span>
          {expandedSection === 'technical' ? <ChevronDown className="w-4 h-4 text-zinc-500"/> : <ChevronRight className="w-4 h-4 text-zinc-500"/>}
        </button>
        
        {expandedSection === 'technical' && (
          <div className="p-4 bg-white space-y-4 border-b border-zinc-100 text-sm">
             <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-500">Proposed Gateway</div>
                <div className="font-mono font-bold text-zinc-900">{record.connectivity.gatewayId}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-500">Update age</div>
                <div className="font-mono text-zinc-900">{record.connectivity.offlineDurationMinutes} mins</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-500">Packet Delivery Rate</div>
                <div className="font-mono text-zinc-900">{formatPercent(record.connectivity.packetDeliveryPct)}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-500">Retry rate</div>
                <div className="font-mono text-zinc-900">{formatPercent(record.connectivity.retryRatePct)}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-500">Queued packets</div>
                <div className="font-mono text-zinc-900">{record.connectivity.queuedPackets}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-500">Water Level</div>
                <div className="font-bold text-zinc-900">{record.maintenance.waterLevel}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-500">Substrate Condition</div>
                <div className="font-bold text-zinc-900">{record.maintenance.substrateCondition}</div>
              </div>
            </div>
          </div>
        )}

        <button 
          onClick={() => setExpandedSection(expandedSection === 'limits' ? 'none' : 'limits')}
          className="w-full flex items-center justify-between p-4 bg-zinc-50 hover:bg-zinc-100 transition-colors text-left border-t border-zinc-100"
        >
          <span className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Validation limits</span>
          {expandedSection === 'limits' ? <ChevronDown className="w-4 h-4 text-zinc-500"/> : <ChevronRight className="w-4 h-4 text-zinc-500"/>}
        </button>

        {expandedSection === 'limits' && (
          <div className="p-4 bg-white space-y-4 text-sm">
             <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <div className="text-[10px] uppercase font-bold text-zinc-500">Power Autonomy</div>
                <div className="text-zinc-900">Pending</div>
              </div>
              <div className="col-span-2">
                <div className="text-[10px] uppercase font-bold text-zinc-500">Containment concept</div>
                <div className="text-zinc-900">Pending</div>
              </div>
              <div className="col-span-2">
                <div className="text-[10px] uppercase font-bold text-zinc-500">Adult escape prevention</div>
                <div className="text-zinc-900">Pending</div>
              </div>
              <div className="col-span-2">
                <div className="text-[10px] uppercase font-bold text-zinc-500">Experimental egg control</div>
                <div className="text-zinc-900">Phase 2 / planned lab validation</div>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
