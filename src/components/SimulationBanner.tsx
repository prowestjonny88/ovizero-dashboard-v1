import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function SimulationBanner() {
  return (
    <div className="bg-amber-100/80 border-b border-amber-200 text-amber-900 px-4 py-2 flex items-center justify-center gap-2 text-xs text-center relative z-50">
      <AlertTriangle size={14} className="shrink-0 text-amber-700" />
      <p>
        SIMULATED SCENARIO · NO LIVE DEVICES — This interface uses synthetic values and does not represent a live deployed network or field-validated epidemiological model.
      </p>
    </div>
  );
}
