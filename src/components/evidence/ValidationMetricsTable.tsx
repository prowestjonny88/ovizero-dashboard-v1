import React from 'react';
import { VALIDATION_METRICS } from '../../data/evidence';


export default function ValidationMetricsTable() {
  const disclaimer = <div className="text-xs text-zinc-500 mb-4 bg-zinc-50 p-3 rounded-lg border border-zinc-200">Targets are preliminary planning values and may change after mentor and laboratory review.</div>;

  const categories = Array.from(new Set(VALIDATION_METRICS.map(m => m.category)));

  return (
    <div className="space-y-8">
      {disclaimer}
      {categories.map(category => {
        const metrics = VALIDATION_METRICS.filter(m => m.category === category);
        return (
          <div key={category}>
            <h3 className="text-lg font-bold text-zinc-900 mb-4">{category}</h3>
            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-zinc-50 text-xs text-zinc-500 uppercase tracking-wider border-b border-zinc-200">
                    <tr>
                      <th className="px-4 py-3 font-medium">Metric</th>
                      <th className="px-4 py-3 font-medium">Target</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Evidence Type</th>
                      <th className="px-4 py-3 font-medium">Planned Phase</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {metrics.map(m => (
                      <tr key={m.id}>
                        <td className="px-4 py-3">
                          <div className="font-bold text-zinc-900">{m.name}</div>
                          <div className="text-[10px] text-zinc-500 mt-0.5">{m.definition}</div>
                        </td>
                        <td className="px-4 py-3 font-mono text-zinc-700">{m.target}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            m.status === 'Not Started' ? 'bg-zinc-100 text-zinc-600' :
                            m.status === 'Planned' ? 'bg-blue-100 text-blue-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {m.status}
                          </span>
                        </td>
                        
                        <td className="px-4 py-3">
                          <div className="text-xs text-zinc-700">{m.evidenceType}</div>
                          {m.sourceLabel && (
                            <div className="mt-1">
                              {m.sourceUrl ? (
                                <a href={m.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-600 hover:underline flex items-center gap-1">
                                  {m.sourceLabel}
                                </a>
                              ) : (
                                <span className="text-[10px] text-zinc-500">{m.sourceLabel}</span>
                              )}
                            </div>
                          )}
                          {m.rationale && (
                            <div className="text-[10px] text-zinc-500 mt-1 italic">
                              {m.rationale}
                            </div>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          <span className="inline-block px-2 py-0.5 border border-zinc-200 rounded text-xs text-zinc-600 bg-white">
                            {m.plannedPhase}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
