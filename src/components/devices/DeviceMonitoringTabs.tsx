import React, { useState } from 'react';
import { DeviceData, DeviceMonitoringRecord } from '../../types';
import { getDeviceMonitoring } from '../../data/deviceMonitoring';
import { Cpu, Wifi, Battery, Camera, Wrench, ShieldAlert } from 'lucide-react';
import EdgeAIEvidencePanel from '../evidence/EdgeAIEvidencePanel';

interface DeviceMonitoringTabsProps {
  device: DeviceData;
}

export default function DeviceMonitoringTabs({ device }: DeviceMonitoringTabsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'connectivity' | 'power' | 'imaging' | 'maintenance' | 'safety'>('overview');
  
  const record = getDeviceMonitoring(device);

  const formatPercent = (value: number | null): string => value === null ? 'Not measured' : `${value}%`;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Cpu },
    { id: 'connectivity', label: 'Connectivity', icon: Wifi },
    { id: 'power', label: 'Power', icon: Battery },
    { id: 'imaging', label: 'Imaging', icon: Camera },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'safety', label: 'Safety', icon: ShieldAlert },
  ] as const;

  if (!record) return <div className="p-4 text-sm text-zinc-500">Device monitoring data not available.</div>;

  return (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm flex flex-col">
      <div className="flex overflow-x-auto border-b border-zinc-200 hide-scrollbar bg-zinc-50">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                isActive 
                  ? 'border-b-2 border-emerald-600 text-emerald-800 bg-white' 
                  : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-emerald-600' : ''} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="p-5 flex-1 min-h-[300px]">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-200 pb-2">Device Overview</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-500">Device ID</div>
                <div className="text-sm font-mono font-bold text-zinc-900">{record.deviceId}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-500">Data Source</div>
                <div className="text-sm font-bold text-blue-700">{record.dataSource}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-500">Gateway</div>
                <div className="text-sm font-mono text-zinc-900">{record.connectivity.gatewayId}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-500">Battery</div>
                <div className="text-sm font-mono text-zinc-900">{record.power.batteryPct}%</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-500">Signal Quality</div>
                <div className="text-sm font-bold text-zinc-900">{record.connectivity.signalQuality}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-500">Maintenance</div>
                <div className="text-sm font-bold text-zinc-900">{record.maintenance.ticketStatus}</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'connectivity' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-200 pb-2">LoRaWAN Connectivity</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-500">Gateway ID</div>
                <div className="text-sm font-mono font-bold text-zinc-900">{record.connectivity.gatewayId}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-500">Signal Quality</div>
                <div className="text-sm font-bold text-zinc-900">{record.connectivity.signalQuality}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-500">Last Packet</div>
                <div className="text-sm font-mono text-zinc-900">{new Date(record.connectivity.lastPacketAt).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-500">Offline Duration</div>
                <div className="text-sm font-mono text-zinc-900">{record.connectivity.offlineDurationMinutes} mins</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-500">Packet Delivery Rate</div>
                <div className="text-sm font-mono text-zinc-900">{formatPercent(record.connectivity.packetDeliveryPct)}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-500">Retry rate</div>
                <div className="text-sm font-mono text-zinc-900">{formatPercent(record.connectivity.retryRatePct)}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-500">Queued packets</div>
                <div className="text-sm font-mono text-zinc-900">{record.connectivity.queuedPackets}</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'power' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-200 pb-2 flex justify-between items-center">
              <span>Power Subsystem</span>
              <span className="text-[10px] bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded font-medium">{record.power.validationStatus}</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-500">Battery Level</div>
                <div className={`text-sm font-mono font-bold ${record.power.batteryPct < 30 ? 'text-red-600' : 'text-zinc-900'}`}>{record.power.batteryPct}%</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-500">Solar Input</div>
                <div className="text-sm font-bold text-zinc-900">{record.power.solarInputStatus}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-500">Solar Input Power</div>
                <div className="text-sm font-mono text-zinc-900">{record.power.solarInputWatts ? `${record.power.solarInputWatts}W` : 'Not measured'}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-500">Daily Energy Estimate</div>
                <div className="text-sm font-mono text-zinc-900">{record.power.estimatedDailyEnergyWh ? `${record.power.estimatedDailyEnergyWh}Wh` : 'Not validated'}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-500">Autonomy Estimate</div>
                <div className="text-sm font-mono text-zinc-900">{record.power.estimatedAutonomyHours ? `${record.power.estimatedAutonomyHours}h` : 'Not validated'}</div>
              </div>
            </div>
            <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded italic">Power autonomy has not been validated because no physical prototype has been built.</p>
          </div>
        )}

        {activeTab === 'imaging' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-200 pb-2">Imaging Subsystem</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-500">Focus Quality (Simulated)</div>
                <div className="text-sm font-bold text-zinc-900">{record.imaging.focusQuality}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-500">Condensation (Simulated)</div>
                <div className={`text-sm font-bold ${record.imaging.condensation === 'Detected' ? 'text-red-600' : 'text-zinc-900'}`}>{record.imaging.condensation}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-500">Lens Status (Simulated)</div>
                <div className="text-sm font-bold text-zinc-900">{record.imaging.lensStatus}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-500">Last Valid Image (Simulated)</div>
                <div className="text-sm font-mono text-zinc-900">{new Date(record.imaging.lastValidImageAt).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-500">Usable-image rate</div>
                <div className="text-sm font-mono text-zinc-900">{formatPercent(record.imaging.usableImageRatePct)}</div>
              </div>
            </div>
            <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded italic">Imaging values are simulated device-health states, not results from physical camera testing.</p>
            <div className="mt-4 pt-4 border-t border-zinc-200">
              <EdgeAIEvidencePanel device={device} />
            </div>
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-200 pb-2 flex justify-between items-center">
              <span>Maintenance Status</span>
              {record.maintenance.ticketStatus === 'Open' && <span className="text-[10px] bg-red-100 text-red-800 border border-red-200 px-2 py-0.5 rounded font-bold uppercase">Simulated Maintenance Scenario</span>}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-500">Water Level</div>
                <div className="text-sm font-bold text-zinc-900">{record.maintenance.waterLevel}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-500">Substrate Condition</div>
                <div className={`text-sm font-bold ${record.maintenance.substrateCondition.includes('Replace') ? 'text-red-600' : 'text-zinc-900'}`}>{record.maintenance.substrateCondition}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-500">Infusion Age</div>
                <div className="text-sm font-mono text-zinc-900">{record.maintenance.infusionAgeDays ?? 'Unknown'} days</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-500">Ticket Status</div>
                <div className="text-sm font-bold text-zinc-900">{record.maintenance.ticketStatus}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-500">Last Cleaning</div>
                <div className="text-sm font-mono text-zinc-900">{record.maintenance.lastCleaningAt ? new Date(record.maintenance.lastCleaningAt).toLocaleDateString() : 'Unknown'}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-500">Next Service</div>
                <div className="text-sm font-mono text-zinc-900">{record.maintenance.nextServiceAt ? new Date(record.maintenance.nextServiceAt).toLocaleDateString() : 'Unknown'}</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'safety' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-200 pb-2">Biological Safety</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-500">Escape Barrier</div>
                <div className="text-sm font-bold text-zinc-900">{record.biologicalSafety.escapeBarrier}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-500">Adult Escape Prevention</div>
                <div className="text-sm font-bold text-zinc-900 bg-amber-50 text-amber-800 px-2 py-0.5 rounded inline-block mt-0.5">{record.biologicalSafety.adultEscapePrevention}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-500">Experimental Egg Control</div>
                <div className="text-sm font-bold text-zinc-900 bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded inline-block mt-0.5">{record.biologicalSafety.experimentalEggControl}</div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
