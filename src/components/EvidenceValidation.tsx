import React, { useState } from 'react';
import { DEVICES, PILOT_NODES } from '../data';
import ProjectMaturity from './evidence/ProjectMaturity';
import SystemDataFlow from './evidence/SystemDataFlow';
import EdgeAIEvidencePanel from './evidence/EdgeAIEvidencePanel';
import ValidationMetricsTable from './evidence/ValidationMetricsTable';
import EvidenceStatusMatrix from './evidence/EvidenceStatusMatrix';
import { FlaskConical, CheckCircle } from 'lucide-react';

export default function EvidenceValidation() {
  const [selectedDeviceId, setSelectedDeviceId] = useState('OZ-041');
  const selectedDevice = DEVICES.find(d => d.id === selectedDeviceId) || DEVICES[0];

  return (
    <div className="flex flex-col h-full bg-zinc-50/50 overflow-y-auto">
      <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight flex items-center gap-3">
              <FlaskConical className="text-emerald-600" size={32} />
              Evidence & Validation
            </h1>
            <p className="text-zinc-500 mt-2 max-w-2xl">
              This dashboard is a concept-stage workflow demo. No physical prototype, trained OviZero model, 
              live LoRaWAN network, or field-validated prediction system exists yet.
            </p>
          </div>
          
          <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm min-w-[300px]">
            <h3 className="text-sm font-bold text-zinc-900 mb-2 flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-600" />
              Claim Boundaries
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-bold text-zinc-600 mb-1">What the demo demonstrates:</p>
                <ul className="text-xs text-zinc-600 list-disc list-inside space-y-0.5">
                  <li>Proposed workflow & UI interactions</li>
                  <li>Data structure & schema</li>
                  <li>Planned decision support</li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-bold text-amber-700 mb-1">What the demo does not prove:</p>
                <ul className="text-xs text-amber-700 list-disc list-inside space-y-0.5">
                  <li>Hardware performance</li>
                  <li>Egg-counting accuracy</li>
                  <li>LoRaWAN reliability</li>
                  <li>Dengue forecast lead time</li>
                  <li>Intervention effectiveness</li>
                  <li>Experimental egg-control safety and egg mortality are not proven</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Section A - Project Maturity */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-zinc-900">Project Maturity</h2>
            <p className="text-sm text-zinc-500 mt-1">Current state of the OviZero system components</p>
          </div>
          <ProjectMaturity />
        </section>

        {/* Section B - Data Flow */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-zinc-900">System Data Flow</h2>
            <p className="text-sm text-zinc-500 mt-1">
              How the proposed physical trap would turn biological observations into dashboard alerts
            </p>
          </div>
          <SystemDataFlow />
        </section>

        {/* Section C - Edge AI Evidence */}
        <section>
          <div className="mb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-zinc-900">Edge-AI Evidence</h2>
              <p className="text-sm text-zinc-500 mt-1">
                Illustrative example of edge egg-counting results without a trained model
              </p>
            </div>
            
            <select 
              value={selectedDeviceId}
              onChange={(e) => setSelectedDeviceId(e.target.value)}
              className="bg-white border border-zinc-200 text-sm font-bold text-zinc-900 rounded-lg px-3 py-2 outline-none"
            >
                            {DEVICES.map(d => {
                const pilotNode = PILOT_NODES.find(n => n.deviceId === d.id);
                const locationLabel = pilotNode ? pilotNode.sublocation : d.location;
                return <option key={d.id} value={d.id}>{d.id} — {locationLabel}</option>;
              })}
            </select>
          </div>
          <EdgeAIEvidencePanel device={selectedDevice} />
        </section>

        {/* Section E - Evidence Status Matrix */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-zinc-900">Evidence Status Matrix</h2>
            <p className="text-sm text-zinc-500 mt-1">Summary of claims, current evidence, and required proofs</p>
          </div>
          <EvidenceStatusMatrix />
        </section>

        {/* Section D - Planned Validation Metrics */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-zinc-900">Validation Plan</h2>
            <p className="text-sm text-zinc-500 mt-1">Metrics to be measured during prototype testing and pilot phases</p>
          </div>
          <ValidationMetricsTable />
        </section>

      </div>
    </div>
  );
}
