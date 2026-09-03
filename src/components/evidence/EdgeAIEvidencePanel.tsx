import React from 'react';
import { DeviceData, EdgeAIEvidenceRecord } from '../../types';
import IllustrativeSubstrateFrame from './IllustrativeSubstrateFrame';
import { DEMO_SNAPSHOT_AT } from '../../utils/dashboard';
import { Info, AlertCircle, Camera, CheckCircle } from 'lucide-react';

interface EdgeAIEvidencePanelProps {
  device: DeviceData;
}

export default function EdgeAIEvidencePanel({ device }: EdgeAIEvidencePanelProps) {
  // Stable mock timestamp
  const baseDate = new Date(DEMO_SNAPSHOT_AT);
  const capturedDate = new Date(baseDate.getTime() - (device.lastSeenMinutes * 60000)).toISOString();

  const record: EdgeAIEvidenceRecord = {
    deviceId: device.id,
    frameId: `SIM-${device.id.replace('-', '')}-001`,
    capturedAt: capturedDate,
    dataSource: 'Simulated',
    imageQuality: 'Acceptable',
    estimatedEggCount: '0' as any,
    manualReferenceCount: null,
    matchScore: null,
    matchScoreStatus: 'Not Calibrated',
    modelStatus: 'Not Trained',
    inferenceTimeMs: null,
    firmwareStatus: 'Concept Only',
    validationStatus: 'Not Started'
  };

  return (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
      <div className="p-4 border-b border-zinc-200 bg-zinc-50">
        <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
          <Camera size={16} className="text-zinc-500" />
          EDGE-AI EVIDENCE
        </h3>
        <p className="text-xs text-amber-700 mt-1 font-medium">TinyML output</p>
      </div>
      
      <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-zinc-200">
        <div className="p-4 md:w-2/5 flex flex-col items-center justify-center bg-zinc-50/50">
          <IllustrativeSubstrateFrame />
          <div className="mt-4 flex items-start gap-2 text-xs text-zinc-500 bg-blue-50/50 p-2.5 rounded-lg border border-blue-100">
            <Info size={14} className="shrink-0 text-blue-500 mt-0.5" />
            <p>Displayed boxes are a visual example and do not represent an actual model inference.</p>
          </div>
        </div>
        
        <div className="p-4 md:w-3/5">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-zinc-100">
              <tr>
                <td className="py-2 text-zinc-500 font-medium">Device</td>
                <td className="py-2 text-zinc-900 font-mono font-bold text-right">{record.deviceId}</td>
              </tr>
              <tr>
                <td className="py-2 text-zinc-500 font-medium">Frame ID</td>
                <td className="py-2 text-zinc-900 font-mono text-right">{record.frameId}</td>
              </tr>
              <tr>
                <td className="py-2 text-zinc-500 font-medium">Captured time</td>
                <td className="py-2 text-zinc-900 font-mono text-right">{new Date(record.capturedAt).toLocaleString()}</td>
              </tr>
              <tr>
                <td className="py-2 text-zinc-500 font-medium">Inference time</td>
                <td className="py-2 text-zinc-400 text-right italic">Not measured</td>
              </tr>
              <tr>
                <td className="py-2 text-zinc-500 font-medium">Firmware status</td>
                <td className="py-2 text-zinc-900 text-right">
                  <span className="inline-block px-2 py-0.5 bg-zinc-100 text-zinc-600 border border-zinc-200 rounded text-xs font-bold uppercase tracking-wide">
                    {record.firmwareStatus}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-2 text-zinc-500 font-medium">Data source</td>
                <td className="py-2 text-right">
                  <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-xs font-bold uppercase tracking-wide">
                    {record.dataSource}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-2 text-zinc-500 font-medium">Image quality</td>
                <td className="py-2 text-zinc-900 text-right">{record.imageQuality}</td>
              </tr>
              <tr>
                <td className="py-2 text-zinc-500 font-medium">Estimated egg count</td>
                <td className="py-2 text-zinc-900 font-bold font-mono text-right text-emerald-700">{record.estimatedEggCount}</td>
              </tr>
              <tr>
                <td className="py-2 text-zinc-500 font-medium">Manual reference count</td>
                <td className="py-2 text-zinc-400 text-right italic">Not available</td>
              </tr>
              <tr>
                <td className="py-2 text-zinc-500 font-medium">Match/confidence</td>
                <td className="py-2 text-zinc-400 text-right italic">{record.matchScoreStatus}</td>
              </tr>
              <tr>
                <td className="py-2 text-zinc-500 font-medium">Model status</td>
                <td className="py-2 text-zinc-900 text-right">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-zinc-100 text-zinc-600 border border-zinc-200 rounded text-xs font-bold uppercase tracking-wide">
                    <AlertCircle size={12} /> {record.modelStatus}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-2 text-zinc-500 font-medium">Validation status</td>
                <td className="py-2 text-zinc-900 text-right">
                  <span className="inline-block px-2 py-0.5 bg-zinc-100 text-zinc-600 border border-zinc-200 rounded text-xs font-bold uppercase tracking-wide">
                    {record.validationStatus}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

                    {/* Proposed Capture Trigger */}
          <div className="mt-4 pt-4 border-t border-zinc-200">
            <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-wider mb-2">PROPOSED CAPTURE TRIGGER</h4>
            <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-200 text-xs text-zinc-700 space-y-2">
              <div className="flex justify-between border-b border-zinc-100 pb-2">
                <span className="font-medium text-zinc-500">Trigger source</span>
                <span className="font-mono text-zinc-800">Wingbeat event</span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 pb-2">
                <span className="font-medium text-zinc-500">Frequency</span>
                <span className="font-mono text-zinc-800">'-'</span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 pb-2">
                <span className="font-medium text-zinc-500">Classifier status</span>
                <span className="font-mono text-zinc-800">Not trained</span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 pb-2">
                <span className="font-medium text-zinc-500">Trigger threshold</span>
                <span className="font-mono text-zinc-800">Not calibrated</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-zinc-500">Hardware trigger</span>
                <span className="font-mono text-zinc-800">Not implemented</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
