import React from 'react';
import { ZoneData } from '../../types';
import { generateRiskExplanation } from '../../utils/riskExplanation';
import RiskBandThresholds from './RiskBandThresholds';
import { ShieldAlert, Info, AlertTriangle, FileBarChart } from 'lucide-react';
import { getRiskColor, getRiskBorderColor } from '../../utils/dashboard';

interface RiskExplanationPanelProps {
  zone: ZoneData;
}

export default function RiskExplanationPanel({ zone }: RiskExplanationPanelProps) {
  const explanation = generateRiskExplanation(zone);

  return (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-zinc-200 bg-zinc-50 flex items-start justify-between">
        <div>
          <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
            <ShieldAlert size={16} className="text-zinc-500" />
            WHY THIS RISK BAND?
          </h3>
          <p className="text-xs text-zinc-500 mt-1">Stored illustrative scenario index explanation</p>
        </div>
        <div 
          className="px-3 py-1.5 rounded-lg font-bold border shadow-xs"
          style={{ 
            backgroundColor: getRiskColor(explanation.riskBand), 
            color: getRiskBorderColor(explanation.riskBand),
            borderColor: getRiskBorderColor(explanation.riskBand) 
          }}
        >
          {explanation.riskBand}
        </div>
      </div>

      <div className="p-4 space-y-5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-zinc-500 font-medium mb-1">Scenario Index</div>
            <div className="font-mono text-xl font-bold text-zinc-900">{explanation.scenarioIndex} / 100</div>
            <div className="text-[10px] text-zinc-400">Stored mock value</div>
          </div>
          <div>
            <div className="text-xs text-zinc-500 font-medium mb-1">Calculation Type</div>
            <div className="text-sm font-bold text-zinc-800">{explanation.calculationType}</div>
            <div className="text-[10px] text-zinc-500">Model: {explanation.modelVersion}</div>
          </div>
          <div>
            <div className="text-xs text-zinc-500 font-medium mb-1">Data Completeness</div>
            <div className="text-sm font-bold text-amber-700 flex items-center gap-1">
              <AlertTriangle size={14} /> {explanation.dataCompleteness}
            </div>
            <div className="text-[10px] text-zinc-500">Review: {explanation.humanReviewStatus}</div>
          </div>
          <div>
            <div className="text-xs text-zinc-500 font-medium mb-1">Uncertainty</div>
            <div className="text-sm font-bold text-zinc-800">{explanation.uncertainty}</div>
            <div className="text-[10px] text-zinc-500">Updated: {new Date(explanation.lastCalculatedAt).toLocaleString()}</div>
          </div>
        </div>
        <RiskBandThresholds />

        <div>
          <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-wider mb-1 flex items-center gap-2">
            <FileBarChart size={14} /> Illustrative Contributions
          </h4>
          <p className="text-xs text-zinc-500 mb-3 italic">
            Provisional demo interpretation rules — not validated model weights.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-zinc-500 bg-zinc-50 uppercase tracking-wider border-y border-zinc-200">
                <tr>
                  <th className="px-3 py-2 font-medium">Input</th>
                  <th className="px-3 py-2 font-medium">Current condition</th>
                  <th className="px-3 py-2 font-medium">Illustrative contribution</th>
                  <th className="px-3 py-2 font-medium text-center">Included?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {explanation.contributions.map((c, i) => (
                  <tr key={i} className={c.included ? '' : 'bg-zinc-50/50 opacity-75'}>
                    <td className="px-3 py-2.5 font-medium text-zinc-900">
                      {c.input}
                      {c.note && <div className="text-[10px] text-zinc-400 font-normal mt-0.5">{c.note}</div>}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-zinc-700">{c.currentCondition}</td>
                    <td className="px-3 py-2.5">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        c.contribution === 'High' ? 'bg-red-100 text-red-800' :
                        c.contribution === 'Moderate' ? 'bg-amber-100 text-amber-800' :
                        c.contribution === 'Low' ? 'bg-blue-100 text-blue-800' :
                        'bg-zinc-100 text-zinc-600'
                      }`}>
                        {c.contribution}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        c.included ? 'bg-zinc-800 text-white' : 'bg-zinc-200 text-zinc-500'
                      }`}>
                        {c.included ? 'Yes' : 'No'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
          <div className="flex items-start gap-2">
            <Info size={16} className="text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold text-amber-900 mb-1">Missing Inputs & Limitations</p>
              <ul className="list-disc list-inside text-xs text-amber-800 space-y-1">
                {explanation.missingInputs.map((input, idx) => (
                  <li key={idx}>{input}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
