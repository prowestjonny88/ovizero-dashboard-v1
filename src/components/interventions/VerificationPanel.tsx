import React, { useState } from 'react';
import { InterventionVerification, InterventionRecord, VerificationOutcome, ZoneData } from '../../types';
import { CheckCircle } from 'lucide-react';
import { DEMO_SNAPSHOT_AT } from '../../utils/dashboard';

interface VerificationPanelProps {
  zone: ZoneData;
  intervention: InterventionRecord | null;
  verification: InterventionVerification | null;
  onSave: (verification: InterventionVerification) => void;
}

export default function VerificationPanel({ zone, intervention, verification, onSave }: VerificationPanelProps) {
  const [followUpDate, setFollowUpDate] = useState(verification?.followUpDate || intervention?.followUpDate || new Date(new Date(DEMO_SNAPSHOT_AT).getTime() + 7 * 86400000).toISOString().split('T')[0]);
  const [inspector, setInspector] = useState(verification?.inspector || '');
  const [afterEggCount, setAfterEggCount] = useState(verification?.after?.syntheticEggActivity?.toString() || '');
  const [inspectionResult, setInspectionResult] = useState(verification?.inspectionResult || '');
  const [officerNote, setOfficerNote] = useState(verification?.officerFeedback || '');
  const [evidenceFilename, setEvidenceFilename] = useState(verification?.evidencePhotoName || '');
  
  const [isEditing, setIsEditing] = useState(false);

  const canVerify = intervention?.status === 'Awaiting Verification' || 
    intervention?.status === 'Activity decreased' || 
    intervention?.status === 'Little/no change' ||
    intervention?.status === 'Activity increased' ||
    intervention?.status === 'Not comparable' ||
    intervention?.status === 'Inconclusive' ||
    intervention?.status === 'Escalated';

  const isFinalOutcome = intervention && [
    'Activity decreased', 'Little/no change', 'Activity increased', 
    'Not comparable', 'Inconclusive', 'Escalated'
  ].includes(intervention.status);

  const handleOutcome = (outcome: VerificationOutcome) => {
    if (!followUpDate || !inspector || !inspectionResult || !officerNote) {
      alert("Complete date, inspector, findings, and notes.");
      return;
    }
    
    if (!intervention) return;
    
    onSave({
      interventionId: intervention.id,
      followUpDate,
      inspector,
      inspectionResult,
      officerFeedback: officerNote,
      evidencePhotoName: evidenceFilename,
      outcome,
      before: {
        recordedAt: DEMO_SNAPSHOT_AT,
        dataSource: 'Simulated',
        syntheticEggActivity: zone.syntheticEggActivity,
        eggActivityChange: zone.eggActivityChange,
        scenarioIndex: zone.interventionPriority,
        riskBand: zone.demoPriorityBand
      },
      after: {
        recordedAt: followUpDate ? new Date(followUpDate).toISOString() : new Date(DEMO_SNAPSHOT_AT).toISOString(),
        dataSource: 'Manual Entry',
        syntheticEggActivity: afterEggCount ? parseInt(afterEggCount, 10) : null,
        eggActivityChange: null,
        scenarioIndex: null,
        riskBand: null
      }
    });
    
    setIsEditing(false);
  };

  if (!canVerify) return null;

  return (
    <div className="bg-white border border-zinc-200/60 rounded-xl overflow-hidden shadow-xs mb-6">
      <div className="bg-zinc-50 border-b border-zinc-200 p-4">
        <h3 className="text-sm font-extrabold text-zinc-900 tracking-tight">FOLLOW-UP OBSERVATION</h3>
        <p className="text-xs text-zinc-500 mt-0.5">Record what was observed after the field action.</p>
      </div>
      
      <div className="p-4 sm:p-5">
        {isFinalOutcome && !isEditing ? (
          <div className="space-y-4">
            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
              <p className="text-sm font-bold text-zinc-900 flex items-center gap-2 mb-4">
                <CheckCircle size={16} className="text-emerald-600" /> Follow-up observation recorded
              </p>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                <div>
                  <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-0.5">Outcome</span>
                  <span className="text-xs font-bold text-zinc-800">{intervention.status}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-0.5">Date</span>
                  <span className="text-xs font-medium text-zinc-800">{verification?.followUpDate}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-0.5">Inspector</span>
                  <span className="text-xs font-medium text-zinc-800">{verification?.inspector || '-'}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-0.5">Notes</span>
                  <span className="text-xs font-medium text-zinc-800">{verification?.officerFeedback || '-'}</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={() => setIsEditing(true)} className="px-3 py-1.5 bg-white border border-zinc-200 text-zinc-700 rounded text-xs font-bold hover:bg-zinc-50 transition-colors">
                  Edit Details
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">Follow-up Date *</label>
                  <input type="date" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)} className="w-full text-sm border border-zinc-200 rounded p-2" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">Inspector *</label>
                  <input type="text" value={inspector} onChange={e => setInspector(e.target.value)} className="w-full text-sm border border-zinc-200 rounded p-2" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">Follow-up egg activity</label>
                  <input type="number" value={afterEggCount} onChange={e => setAfterEggCount(e.target.value)} className="w-full text-sm border border-zinc-200 rounded p-2" placeholder="Optional demo value" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">Evidence file (demo)</label>
                  <input type="text" value={evidenceFilename} onChange={e => setEvidenceFilename(e.target.value)} className="w-full text-sm border border-zinc-200 rounded p-2" placeholder="Optional filename" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">Field findings *</label>
                  <textarea value={inspectionResult} onChange={e => setInspectionResult(e.target.value)} className="w-full text-sm border border-zinc-200 rounded p-2 h-16" placeholder="What was found?" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">Notes *</label>
                  <textarea value={officerNote} onChange={e => setOfficerNote(e.target.value)} className="w-full text-sm border border-zinc-200 rounded p-2 h-16" placeholder="Additional notes" />
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-200 pt-4 mt-4 flex flex-wrap gap-2">
              {isEditing && (
                <button onClick={() => setIsEditing(false)} className="px-3 py-2 bg-zinc-200 text-zinc-700 rounded text-xs font-bold hover:bg-zinc-300">
                  Cancel
                </button>
              )}
              {isFinalOutcome && isEditing ? (
                <button onClick={() => handleOutcome(intervention!.status as VerificationOutcome)} className="px-3 py-2 bg-emerald-600 text-white rounded text-xs font-bold hover:bg-emerald-700">
                  SAVE FOLLOW-UP
                </button>
              ) : (
                <>
                  <button onClick={() => handleOutcome('Activity decreased')} className="px-3 py-2 bg-[#052e1a] text-white rounded text-xs font-bold hover:bg-[#0a4226]">
                    Activity decreased
                  </button>
                  <button onClick={() => handleOutcome('Little/no change')} className="px-3 py-2 bg-[#052e1a] text-white rounded text-xs font-bold hover:bg-[#0a4226]">
                    Little/no change
                  </button>
                  <button onClick={() => handleOutcome('Activity increased')} className="px-3 py-2 bg-[#052e1a] text-white rounded text-xs font-bold hover:bg-[#0a4226]">
                    Activity increased
                  </button>
                  <button onClick={() => handleOutcome('Not comparable')} className="px-3 py-2 bg-[#052e1a] text-white rounded text-xs font-bold hover:bg-[#0a4226]">
                    Not comparable
                  </button>
                  <button onClick={() => handleOutcome('Inconclusive')} className="px-3 py-2 bg-[#052e1a] text-white rounded text-xs font-bold hover:bg-[#0a4226]">
                    Inconclusive
                  </button>
                  <button onClick={() => handleOutcome('Escalated')} className="px-3 py-2 bg-[#052e1a] text-white rounded text-xs font-bold hover:bg-[#0a4226]">
                    Escalated
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
