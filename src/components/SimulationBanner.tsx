import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function SimulationBanner() {
  return (
    <div className="bg-amber-100/80 border-b border-amber-200 text-amber-900 px-4 py-2 flex items-center justify-center gap-2 text-xs text-center relative z-50">
      <AlertTriangle size={14} className="shrink-0 text-amber-700" />
      <p>
        <strong className="font-bold">SIMULATED DEMO DATA:</strong> This dashboard demonstrates the proposed OviZero workflow. No physical prototype, live sensor network, trained OviZero model, or field-validated prediction system has been deployed.
      </p>
    </div>
  );
}
