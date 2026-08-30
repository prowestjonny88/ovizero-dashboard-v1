import React, { useState, useEffect } from 'react';
import { ZoneData, InterventionRecord, VerificationOutcome, InterventionVerification } from '../../types';
import { FileSearch, TrendingDown, EyeOff, Info, CheckCircle } from 'lucide-react';
import { getRiskColor, getRiskBorderColor } from '../../utils/dashboard';

interface VerificationPanelProps {
  zone: ZoneData;
  intervention: InterventionRecord | null;
  verification: InterventionVerification | null;
  onSave: (verification: InterventionVerification) => void;
}

export default function VerificationPanel({ zone, intervention: record, verification, onSave }: VerificationPanelProps) {
  // Form State
  const [followUpDate, setFollowUpDate] = useState(verification?.followUpDate || new Date().toISOString().split('T')[0]);
  const [inspector, setInspector] = useState(verification?.inspector || 'Verification Officer');
  const [afterEggCount, setAfterEggCount] = useState<string>(verification?.after?.eggCount?.toString() || '');
  const [afterEggVelocity, setAfterEggVelocity] = useState<string>(verification?.after?.eggVelocity || '');
  const [afterScenarioIndex, setAfterScenarioIndex] = useState<string>(verification?.after?.scenarioIndex?.toString() || '');
  const [afterRiskBand, setAfterRiskBand] = useState<ZoneData['status'] | ''>(verification?.after?.riskBand || '');
  const [inspectionResult, setInspectionResult] = useState(verification?.inspectionResult || '');
  const [evidenceFilename, setEvidenceFilename] = useState(verification?.evidencePhotoName || '');
  const [officerNote, setOfficerNote] = useState(verification?.outcomeNote || '');

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (verification) {
      setFollowUpDate(verification.followUpDate);
      setInspector(verification.inspector || 'Verification Officer');
      setAfterEggCount(verification.after?.eggCount?.toString() || '');
      setAfterEggVelocity(verification.after?.eggVelocity || '');
      setAfterScenarioIndex(verification.after?.scenarioIndex?.toString() || '');
      setAfterRiskBand(verification.after?.riskBand || '');
      setInspectionResult(verification.inspectionResult || '');
      setEvidenceFilename(verification.evidencePhotoName || '');
      setOfficerNote(verification.outcomeNote || '');
    }
  }, [verification]);

  const canVerify = record && ['Awaiting Verification', 'Effect Verified', 'No Effect', 'Escalated'].includes(record.status);
  
  const isFinalOutcome = record && ['Effect Verified', 'No Effect', 'Escalated'].includes(record.status);
  
  const isReadOnly = (isFinalOutcome && !isEditing);

  const before = {
    eggCount: zone.eggCount,
    velocity: zone.eggVelocity,
    scenarioIndex: zone.risk,
    riskBand: zone.status
  };

  const handleOutcome = (outcome: VerificationOutcome) => {
    if (!followUpDate || !afterEggCount || !inspectionResult || !inspector || !officerNote) {
      alert('Follow-up date, inspector, after egg count, inspection result, and reviewer confirmation note are required to record verification.');
      return;
    }
    
    let pctChange = 0;
    const afterCount = parseInt(afterEggCount, 10);
    if (!isNaN(afterCount) && before.eggCount > 0) {
      pctChange = Math.round(((afterCount - before.eggCount) / before.eggCount) * 100);
    }
    
    onSave({
      interventionId: record!.id,
      followUpDate,
      inspector,
      before: {
        recordedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
        dataSource: 'Simulated',
        eggCount: before.eggCount,
        eggVelocity: before.velocity,
        scenarioIndex: before.scenarioIndex,
        riskBand: before.riskBand
      },
      after: {
        recordedAt: new Date().toISOString(),
        dataSource: 'Manual Entry',
        eggCount: parseInt(afterEggCount, 10),
        eggVelocity: afterEggVelocity || null,
        scenarioIndex: afterScenarioIndex ? parseInt(afterScenarioIndex, 10) : null,
        riskBand: (afterRiskBand as ZoneData['status']) || null
      },
      inspectionCompletedAt: new Date().toISOString(),
      percentageEggChange: pctChange,
      evidencePhotoName: evidenceFilename,
      inspectionResult,
      officerFeedback: inspectionResult,
      outcomeNote: officerNote,
      outcome
    });
    setIsEditing(false);
  };

  const calculateChange = () => {
    if (!afterEggCount || isNaN(parseInt(afterEggCount, 10))) return null;
    const afterCount = parseInt(afterEggCount, 10);
    const beforeCount = before.eggCount;
    if (beforeCount === 0) return null;
    
    const pctChange = Math.round(((afterCount - beforeCount) / beforeCount) * 100);
    return pctChange > 0 ? `+${pctChange}%` : `${pctChange}%`;
  };

  const observedChange = calculateChange();

  return (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm mt-6">
      <div className="p-4 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
            <FileSearch size={16} className="text-zinc-500" />
            POST-INTERVENTION VERIFICATION
          </h3>
          <p className="text-xs text-zinc-500 mt-1">Independent follow-up observation</p>
        </div>
        {!canVerify ? (
          <span className="text-[10px] font-bold uppercase text-zinc-400 bg-zinc-100 px-2 py-1 rounded">Action Not Complete</span>
        ) : (
          record?.status === 'Awaiting Verification' ? (
            <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded">Pending Verification</span>
          ) : record?.status === 'Effect Verified' ? (
            <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded">Effect Verified</span>
          ) : record?.status === 'No Effect' ? (
            <span className="text-[10px] font-bold uppercase text-rose-700 bg-rose-50 border border-rose-200 px-2 py-1 rounded">No Effect</span>
          ) : record?.status === 'Escalated' ? (
            <span className="text-[10px] font-bold uppercase text-red-700 bg-red-100 border border-red-300 px-2 py-1 rounded">Escalated</span>
          ) : null
        )}
      </div>
      
      <div className="p-4">
        {!canVerify ? (
          <div className="flex flex-col items-center justify-center py-6 text-zinc-400">
            <EyeOff size={32} className="mb-2 opacity-50" />
            <p className="text-sm font-medium">Verification unlocks after action is completed</p>
          </div>
        ) : (
          <div className="space-y-4">
            
            {isFinalOutcome && !isEditing && (
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                      <CheckCircle size={16} className={record?.status === 'Effect Verified' ? 'text-emerald-600' : 'text-zinc-500'} /> 
                      {record?.status === 'Effect Verified' ? 'Follow-up outcome recorded: Effect Verified.' : record?.status === 'No Effect' ? 'Follow-up outcome recorded: No Effect. Further action may be required.' : 'Follow-up outcome recorded: Escalated for additional review.'}
                    </h4>
                  </div>
                  <button onClick={() => setIsEditing(true)} className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider">
                    Edit simulated record
                  </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase">Inspector</p>
                    <p className="text-sm text-zinc-900 font-medium">{inspector}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase">Date</p>
                    <p className="text-sm text-zinc-900 font-medium">{followUpDate}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase">Egg Count</p>
                    <p className="text-sm text-zinc-900 font-medium">{afterEggCount}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase">Simulated Evidence</p>
                    <p className="text-sm text-zinc-900 font-medium truncate">{evidenceFilename || 'None'}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase">Inspection Result</p>
                    <p className="text-xs text-zinc-700 bg-white p-2 rounded border border-zinc-200">{inspectionResult}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase">Reviewer Note</p>
                    <p className="text-xs text-zinc-700 bg-white p-2 rounded border border-zinc-200">{officerNote}</p>
                  </div>
                </div>
              </div>
            )}
            
            {(!isFinalOutcome || isEditing) && (
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4">
              <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-wider mb-3">Simulate Follow-Up Data</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">Follow-up Date *</label>
                  <input type="date" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)} className="w-full text-sm border border-zinc-200 rounded p-2" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">Inspector *</label>
                  <input type="text" value={inspector} onChange={e => setInspector(e.target.value)} className="w-full text-sm border border-zinc-200 rounded p-2" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">After Egg Count *</label>
                  <input type="number" value={afterEggCount} onChange={e => setAfterEggCount(e.target.value)} className="w-full text-sm border border-zinc-200 rounded p-2" placeholder="e.g. 42" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">Simulated Evidence Filename</label>
                  <input type="text" value={evidenceFilename} onChange={e => setEvidenceFilename(e.target.value)} className="w-full text-sm border border-zinc-200 rounded p-2" placeholder="Optional" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">After Mock Growth</label>
                  <input type="text" value={afterEggVelocity} onChange={e => setAfterEggVelocity(e.target.value)} className="w-full text-sm border border-zinc-200 rounded p-2" placeholder="e.g. -45%" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">After Scenario Index</label>
                  <input type="number" value={afterScenarioIndex} onChange={e => setAfterScenarioIndex(e.target.value)} className="w-full text-sm border border-zinc-200 rounded p-2" placeholder="e.g. 58" />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">After Risk Band</label>
                  <select value={afterRiskBand} onChange={e => setAfterRiskBand(e.target.value as ZoneData['status'] | '')} className="w-full text-sm border border-zinc-200 rounded p-2">
                    <option value="">-- Select --</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Elevated">Elevated</option>
                    <option value="Watch">Watch</option>
                    <option value="Stable">Stable</option>
                  </select>
                </div>
                <div className="col-span-2 md:col-span-4 mt-2">
                  <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">Inspection Result *</label>
                  <textarea value={inspectionResult} onChange={e => setInspectionResult(e.target.value)} className="w-full text-sm border border-zinc-200 rounded p-2 h-16" placeholder="Detailed findings..." />
                </div>
                <div className="col-span-2 md:col-span-4 mt-2">
                  <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">Reviewer Confirmation Note *</label>
                  <textarea value={officerNote} onChange={e => setOfficerNote(e.target.value)} className="w-full text-sm border border-zinc-200 rounded p-2 h-16" placeholder="Officer notes..." />
                </div>
              </div>
            </div>
            )}

            {(!isFinalOutcome || isEditing) && (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-zinc-500 bg-zinc-50 uppercase tracking-wider border-y border-zinc-200">
                      <tr>
                        <th className="px-3 py-2 font-medium">Metric</th>
                        <th className="px-3 py-2 font-medium text-right">Before Alert</th>
                        <th className="px-3 py-2 font-medium text-right">Follow-up</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      <tr>
                        <td className="px-3 py-2 font-medium text-zinc-700">Egg count</td>
                        <td className="px-3 py-2 font-mono text-zinc-900 text-right">{before.eggCount}</td>
                        <td className="px-3 py-2 font-mono text-zinc-900 text-right">
                          {afterEggCount ? <span className="text-emerald-700">{afterEggCount}</span> : <span className="text-zinc-400 italic">Not available</span>}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-medium text-zinc-700">Mock growth</td>
                        <td className="px-3 py-2 font-mono text-zinc-900 text-right">{before.velocity}</td>
                        <td className="px-3 py-2 font-mono text-zinc-900 text-right">
                          {afterEggVelocity ? <span className="text-emerald-700">{afterEggVelocity}</span> : <span className="text-zinc-400 italic">Not available</span>}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-medium text-zinc-700">Scenario index</td>
                        <td className="px-3 py-2 font-mono text-zinc-900 text-right">{before.scenarioIndex}</td>
                        <td className="px-3 py-2 font-mono text-zinc-900 text-right">
                          {afterScenarioIndex ? <span className="text-emerald-700">{afterScenarioIndex}</span> : <span className="text-zinc-400 italic">Not available</span>}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-medium text-zinc-700">Risk band</td>
                        <td className="px-3 py-2 text-right">
                          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: getRiskColor(before.riskBand), color: getRiskBorderColor(before.riskBand) }}>
                            {before.riskBand}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-right">
                          {afterRiskBand ? (
                            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: getRiskColor(afterRiskBand), color: getRiskBorderColor(afterRiskBand) }}>
                              {afterRiskBand}
                            </span>
                          ) : (
                            <span className="text-zinc-400 italic text-xs">Not assessed</span>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                {observedChange && (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 flex items-start gap-3 mt-4">
                    <TrendingDown className="text-blue-600 shrink-0 mt-0.5" size={18} />
                    <div>
                      <p className="text-sm font-bold text-blue-900 mb-1">Observed mock rolling growth indicator: {observedChange}</p>
                      <p className="text-xs text-blue-800">
                        Verification results are recorded separately and do not automatically recalibrate the risk model. 
                        Other environmental factors may affect the result.
                      </p>
                    </div>
                  </div>
                )}

                <div className="border-t border-zinc-200 pt-4 mt-4 flex gap-2">
                  {isEditing && (
                    <button onClick={() => setIsEditing(false)} className="px-3 py-2 bg-zinc-200 text-zinc-700 rounded text-xs font-bold hover:bg-zinc-300">
                      Cancel
                    </button>
                  )}
                  {isFinalOutcome && isEditing ? (
                    <button onClick={() => handleOutcome(record!.status as VerificationOutcome)} className="px-3 py-2 bg-emerald-600 text-white rounded text-xs font-bold hover:bg-emerald-700">
                      Save Observations
                    </button>
                  ) : (
                    <>
                      <button onClick={() => handleOutcome('Effect Verified')} className="px-3 py-2 bg-emerald-600 text-white rounded text-xs font-bold hover:bg-emerald-700">
                        Effect Verified
                      </button>
                      <button onClick={() => handleOutcome('No Effect')} className="px-3 py-2 bg-amber-600 text-white rounded text-xs font-bold hover:bg-amber-700">
                        No Effect
                      </button>
                      <button onClick={() => handleOutcome('Escalated')} className="px-3 py-2 bg-red-600 text-white rounded text-xs font-bold hover:bg-red-700">
                        Escalate Issue
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
            
          </div>
        )}
      </div>
    </div>
  );
}
