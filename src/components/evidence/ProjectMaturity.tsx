import React from 'react';
import { MaturityStatus } from '../../types';
import { Layers, MonitorSmartphone, Cpu, Binary, Volume2, Radio, MapPin, FlaskConical } from 'lucide-react';


const MATURITY_ITEMS = [
  { area: 'Concept', status: 'Developed', icon: Layers },
  { area: 'Dashboard', status: 'Mock-up available', icon: MonitorSmartphone },
  { area: 'Physical hardware', status: 'Not built', icon: Cpu },
  { area: 'MEMS microphone', status: 'Not built', icon: Volume2 },
  { area: 'Acoustic trigger classifier', status: 'Not trained', icon: Volume2 },
  { area: 'Wingbeat trigger threshold', status: 'Not calibrated', icon: Binary },
  { area: 'Microphone -> camera wake integration', status: 'Not built', icon: Binary },
  { area: 'Egg-count TinyML model', status: 'Not trained', icon: Binary },
  { area: 'End-to-end trigger workflow', status: 'Not tested', icon: FlaskConical },
  { area: 'LoRaWAN integration', status: 'Not started', icon: Radio },
  { area: 'Field validation', status: 'Not started', icon: MapPin },
  { area: 'Experimental egg-control', status: 'Not validated', icon: FlaskConical },
];


export default function ProjectMaturity() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
      {MATURITY_ITEMS.map((item, idx) => {
        const Icon = item.icon;
        const isDeveloped = item.status === 'Developed' || item.status === 'Mock-up available';
        const isNotStarted = item.status === 'Not built' || item.status === 'Not trained' || item.status.includes('Not started') || item.status === 'Not validated';
        
        const bgColor = isDeveloped ? 'bg-emerald-50 border-emerald-200' : isNotStarted ? 'bg-zinc-50 border-zinc-200' : 'bg-blue-50 border-blue-200';
        const iconColor = isDeveloped ? 'text-emerald-600' : isNotStarted ? 'text-zinc-400' : 'text-blue-600';
        const textColor = isDeveloped ? 'text-emerald-800' : isNotStarted ? 'text-zinc-600' : 'text-blue-800';

        return (
          <div key={idx} className={`p-3 rounded-xl border flex items-center gap-3 ${bgColor}`}>
            <div className={`shrink-0 ${iconColor}`}>
              <Icon size={20} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{item.area}</div>
              <div className={`text-sm font-bold ${textColor}`}>{item.status}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
