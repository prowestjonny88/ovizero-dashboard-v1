import React from 'react';
import { MaturityStatus } from '../../types';
import { CheckCircle, Clock, FileText, AlertTriangle, Cpu, Radio, Server, Activity, Monitor } from 'lucide-react';

interface SystemDataFlowProps {
  compact?: boolean;
}


const FLOW_STEPS = [
  {
    icon: FileText,
    title: '1. Oviposition chamber',
    purpose: 'Attract gravid female Aedes mosquitoes to a standardised egg-laying site.',
    status: 'Planned' as MaturityStatus,
    data: 'Planned hardware',
    validation: 'Lure effectiveness, containment, servicing interval',
  },
  {
    icon: Activity,
    title: '2. MEMS microphone',
    purpose: 'Listen for the proposed Aedes wingbeat trigger range.',
    status: 'Planned' as MaturityStatus,
    data: 'Current state: No physical microphone is connected.',
    validation: 'Ambient-noise rejection, false triggers, missed triggers, classifier performance.',
  },
  {
    icon: AlertTriangle,
    title: '3. Wingbeat trigger',
    purpose: 'Decide whether to wake the camera.',
    status: 'Simulated' as MaturityStatus,
    data: 'Current state: Trigger logic shown.',
    validation: 'Threshold calibration and camera-wake reliability.',
  },
  {
    icon: Monitor,
    title: '4. Camera capture',
    purpose: 'Wake after the proposed wingbeat trigger and capture the egg-laying substrate.',
    status: 'Planned' as MaturityStatus,
    data: 'Current state: No physical camera-trigger integration has been built.',
    validation: '',
  },
  {
    icon: Cpu,
    title: '5. ESP32-S3 / TinyML egg counting',
    purpose: 'Run lightweight image preprocessing and TinyML egg-count estimation.',
    status: 'Not Started' as MaturityStatus,
    data: 'Not built, Model not trained',
    validation: '',
  },
  {
    icon: Activity,
    title: '6. Temperature + humidity merge',
    purpose: 'Combine the egg count with temperature and humidity.',
    status: 'Simulated' as MaturityStatus,
    data: 'SHT30 or final selected equivalent',
    validation: '',
  },
  {
    icon: Activity,
    title: '7. Compact result',
    purpose: 'Compile sensor readings and AI estimates.',
    status: 'Simulated' as MaturityStatus,
    data: 'Egg-count estimate, Image-quality state, Temp, Humidity, Battery, Flags, Timestamp',
    validation: '',
  },
  {
    icon: Radio,
    title: '8. LoRaWAN packet',
    purpose: 'Transmit compact payload over low-power wide-area network.',
    status: 'Simulated' as MaturityStatus,
    data: 'Packet transmission.',
    validation: '',
  },
  {
    icon: Radio,
    title: '9. GW-01 proposed gateway',
    purpose: 'Receive LoRaWAN packets and forward to backend.',
    status: 'Planned' as MaturityStatus,
    data: 'Gateway: GW-01. Proposed placement.',
    validation: 'Coverage not field-tested',
  },
  {
    icon: Server,
    title: '10. Backend',
    purpose: 'Ingest data, store, and serve API.',
    status: 'Not Started' as MaturityStatus,
    data: 'Current representation: Local data in React.',
    validation: '',
  },
  {
    icon: Activity,
    title: '11. Risk logic',
    purpose: 'Calculate intervention priority based on environmental risk factors.',
    status: 'Simulated' as MaturityStatus,
    data: 'Current representation: Stored scenario values and qualitative reason codes.',
    validation: '',
  },
  {
    icon: Monitor,
    title: '12. Dashboard output',
    purpose: 'Display alerts, risk bands, and decision support.',
    status: 'Implemented in Mock UI' as MaturityStatus,
    data: 'Outputs: Risk band, Priority list, Reason codes, Actions, Alerts.',
    validation: 'Working mock interface',
  },
];


const getStatusColor = (status: MaturityStatus) => {
  switch (status) {
    case 'Implemented in Mock UI': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    case 'Simulated': return 'text-blue-700 bg-blue-50 border-blue-200';
    case 'Planned': return 'text-zinc-700 bg-zinc-50 border-zinc-200';
    case 'Not Started': return 'text-zinc-500 bg-zinc-100 border-zinc-200';
    case 'Requires Validation': return 'text-amber-700 bg-amber-50 border-amber-200';
    default: return 'text-zinc-700 bg-zinc-50 border-zinc-200';
  }
};

export default function SystemDataFlow({ compact }: SystemDataFlowProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        {FLOW_STEPS.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={index} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${getStatusColor(step.status)}`}>
                  <Icon size={18} />
                </div>
                {index < FLOW_STEPS.length - 1 && (
                  <div className="w-0.5 h-full bg-zinc-200 my-1" />
                )}
              </div>
              <div className="flex-1 pb-4">
                <div className="bg-white rounded-xl border border-zinc-200 p-4 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                    <h4 className="font-bold text-zinc-900">{step.title}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getStatusColor(step.status)}`}>
                      {step.status}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-600 mb-3">{step.purpose}</p>
                  
                  <div className="bg-zinc-50 rounded-lg p-3 text-sm">
                    <div className="font-mono text-xs text-zinc-700 whitespace-pre-wrap">
                      {step.data}
                    </div>
                  </div>
                  {step.validation && (
                    <div className="mt-2 text-xs text-amber-700 flex items-start gap-1.5">
                      <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                      <span>{step.validation}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!compact && (
        <div className="bg-zinc-900 rounded-xl p-4 mt-6">
          <h4 className="text-zinc-100 font-bold text-sm mb-3 border-b border-zinc-800 pb-2">Example Payload (OZ-041)</h4>
          <pre className="text-xs text-emerald-400 font-mono overflow-x-auto whitespace-pre">
{`{
  "node_id": "OZ-041",
  "timestamp": "2026-08-05T08:32:00+08:00",
  "data_source": "local",
  "image_quality": "acceptable",
  "egg_count_estimate": 127,
  "egg_count_change_7d": 0.48,
  "temperature_c": 32.1,
  "humidity_pct": 84,
  "battery_pct": 86,
  "gateway_id": "GW-01",
  "packet_status": "standard",
  "validation_status": "pending"
}`}
          </pre>
        </div>
      )}
    </div>
  );
}
