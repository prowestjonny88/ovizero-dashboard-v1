import React from 'react';

interface ScenarioPeriodLabelProps {
  
  mode?: 'selected-period' | 'current-snapshot';
}

export default function ScenarioPeriodLabel({  mode = 'selected-period' }: ScenarioPeriodLabelProps) {
  if (mode === 'current-snapshot') {
    return (
      <div className="bg-zinc-50 border border-zinc-200/60 rounded-lg p-2.5 mb-4">
        <p className="text-[11px] text-zinc-700 leading-snug">
          <strong>5 nodes &middot; 7-day view</strong>
        </p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-50 border border-zinc-200/60 rounded-lg p-2.5 mb-4">
      <p className="text-[11px] font-bold text-zinc-700 leading-snug">
        Selected-period scenario: 7-Day
      </p>
    </div>
  );
}
