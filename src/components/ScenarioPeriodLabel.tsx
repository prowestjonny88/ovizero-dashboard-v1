import React from 'react';

interface ScenarioPeriodLabelProps {
  selectedDateRange: string;
  mode?: 'selected-period' | 'current-snapshot';
}

export default function ScenarioPeriodLabel({ selectedDateRange, mode = 'selected-period' }: ScenarioPeriodLabelProps) {
  if (mode === 'current-snapshot') {
    return (
      <div className="bg-zinc-50 border border-zinc-200/60 rounded-lg p-2.5 mb-4">
        <p className="text-[11px] text-zinc-700 leading-snug">
          <strong>DEMO ASSUMPTIONS:</strong> Five varied mock device profiles are shown within one illustrative pilot layout.
          <span className="text-zinc-500 ml-1">Current simulated device snapshot. Period selectors apply to trend and report views.</span>
        </p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-50 border border-zinc-200/60 rounded-lg p-2.5 mb-4">
      <p className="text-[11px] font-bold text-zinc-700 leading-snug">
        Selected-period simulated scenario: {selectedDateRange}
      </p>
    </div>
  );
}
