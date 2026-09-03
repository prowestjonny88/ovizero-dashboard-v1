import React from 'react';

export default function RiskBandThresholds() {
  const bands = [
    { label: 'Critical', range: '88–100', color: 'bg-red-100 text-red-800 border-red-200' },
    { label: 'High', range: '78–87', color: 'bg-orange-100 text-orange-800 border-orange-200' },
    { label: 'Elevated', range: '65–77', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { label: 'Watch', range: '50–64', color: 'bg-green-100 text-green-800 border-green-200' },
    { label: 'Stable', range: '0–49', color: 'bg-green-50 text-green-700 border-green-100' },
  ];

  return (
    <div className="bg-zinc-50 rounded-lg p-3 border border-zinc-200">
      <p className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 mb-2">Priority bands</p>
      <div className="flex flex-wrap gap-2">
        {bands.map((b) => (
          <div key={b.label} className={`px-2 py-1 rounded text-[10px] font-bold border flex items-center gap-1.5 ${b.color}`}>
            <span>{b.label}</span>
            <span className="font-mono opacity-80">{b.range}</span>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-zinc-400 mt-2 italic"></p>
    </div>
  );
}
