import React from 'react';

const MATRIX = [
  { claim: 'Camera-based egg counting is a proposed technical approach', evidence: 'Requires physical sensor dataset for training', status: 'Design Target', next: 'Labelled OviZero image dataset' },
  { claim: 'Dashboard can display a proposed five-node packet workflow', evidence: 'UI simulation only', status: 'Simulated Output', next: 'LoRaWAN bench test' },
  { claim: 'Scenario index predicts dengue risk', evidence: 'No OviZero field result', status: 'Provisional Team Target', next: 'Prospective pilot' },
  { claim: 'Experimental egg control prevents emergence', evidence: 'No result', status: 'Not Started', next: 'Controlled lab test' },
  { claim: 'Maintenance alerts reduce visits', evidence: 'Design hypothesis', status: 'Design Target', next: 'Pilot maintenance records' },
];

export default function EvidenceStatusMatrix() {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-zinc-50 text-xs text-zinc-500 uppercase tracking-wider border-b border-zinc-200">
            <tr>
              <th className="px-4 py-3 font-medium">Claim</th>
              <th className="px-4 py-3 font-medium">Current evidence</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Next proof</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {MATRIX.map((row, i) => (
              <tr key={i}>
                <td className="px-4 py-3 font-bold text-zinc-900">{row.claim}</td>
                <td className="px-4 py-3 text-zinc-600 italic">{row.evidence}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                    row.status === 'Not Started' ? 'bg-zinc-50 border-zinc-200 text-zinc-600' :
                    row.status === 'Simulated Output' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                    row.status === 'Design Target' ? 'bg-purple-50 border-purple-200 text-purple-700' :
                    row.status === 'Provisional Team Target' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                    'bg-emerald-50 border-emerald-200 text-emerald-700'
                  }`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-800 text-xs">{row.next}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
