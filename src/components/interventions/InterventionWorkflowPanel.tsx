import React, { useState } from 'react';
import { ZoneData, InterventionRecord, InterventionStatus, InterventionTransitionPayload, InterventionActionType } from '../../types';
import { AlertCircle, CheckCircle, Info, Activity, Clock, ShieldAlert } from 'lucide-react';

interface InterventionWorkflowPanelProps {
  zone: ZoneData;
  record: InterventionRecord | null;
  onCreate: () => void;
  onTransition: (status: InterventionStatus, payload: InterventionTransitionPayload) => void;
}

const getStatusColor = (status: InterventionStatus) => {
  switch (status) {
    case 'New Alert': return 'text-red-700 bg-red-50 border-red-200';
    case 'Reviewed': return 'text-amber-700 bg-amber-50 border-amber-200';
    case 'Assigned': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    case 'On Site': return 'text-blue-700 bg-blue-50 border-blue-200';
    case 'Action Completed': return 'text-indigo-700 bg-indigo-50 border-indigo-200';
    case 'Awaiting Verification': return 'text-purple-700 bg-purple-50 border-purple-200';
    case 'Activity decreased': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    case 'Little/no change': return 'text-rose-700 bg-rose-50 border-rose-200';
    case 'Escalated': return 'text-red-700 bg-red-100 border-red-300';
    default: return 'text-zinc-700 bg-zinc-50 border-zinc-200';
  }
};

const getTimelineLabel = (status: string) => {
    switch (status) {
      case 'New Alert': return 'Workflow started';
      case 'Reviewed': return 'Review completed';
      case 'Assigned': return 'Assigned';
      case 'On Site': return 'Field action recorded'; // Since we simplified On Site and Action Completed
      case 'Action Completed': return 'Field action recorded';
      case 'Awaiting Verification': return 'Follow-up pending';
      default: return 'Follow-up recorded';
    }
  };

export default function InterventionWorkflowPanel({ zone, record, onCreate, onTransition }: InterventionWorkflowPanelProps) {
  // Review State
  const [reviewerName, setReviewerName] = useState(record?.reviewerName || 'System Admin');
  const [reviewNote, setReviewNote] = useState(record?.reviewNote || '');
  
  // Assign State
  const [assignedTeam, setAssignedTeam] = useState(record?.assignedTeam || 'Vector Team A');
  const [actionType, setActionType] = useState<InterventionActionType>(record?.actionType || 'Inspect breeding sources');
  const [dueDate, setDueDate] = useState(record?.dueDate || new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [responseSla, setResponseSla] = useState(record?.responseSla || '48h');
  
  // Completion State
  const [findings, setFindings] = useState(record?.findings || '');
  const [actionsPerformed, setActionsPerformed] = useState(record?.actionsPerformed || '');
  const [completionNotes, setCompletionNotes] = useState(record?.completionNotes || '');
  const [followUpDate, setFollowUpDate] = useState(record?.followUpDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
  const [verificationOwner, setVerificationOwner] = useState(record?.verificationOwner || 'Public Health Officer');
  const [evidenceFilename, setEvidenceFilename] = useState(record?.evidenceFilename || '');

  if (!record) {
    return (
      <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm text-center">
        <Activity size={32} className="text-zinc-400 mx-auto mb-3" />
        <h3 className="text-sm font-bold text-zinc-900 mb-1">No field action started</h3>
        <p className="text-xs text-zinc-500 mb-4">There is no active field action for {zone.name}.</p>
        <button onClick={onCreate} className="px-4 py-2 bg-[#052e1a] text-white rounded-lg text-sm font-bold hover:bg-[#0a4226] transition-colors">
          START REVIEW
        </button>
      </div>
    );
  }

  const handleReview = () => {
    if (!reviewerName || !reviewNote) {
      alert("Reviewer name and review note are required.");
      return;
    }
    onTransition('Reviewed', { reviewerName, reviewNote });
  };

  const handleAssign = () => {
    if (!assignedTeam || !dueDate || !actionType || !responseSla) {
      alert("Team, action type, due date, and response SLA are required.");
      return;
    }
    onTransition('Assigned', { assignedTeam, actionType, dueDate, responseSla });
  };

  const handleOnSite = () => {
    onTransition('On Site', {});
  };

  const handleComplete = () => {
    if (!findings || !actionsPerformed || !completionNotes || !followUpDate || !verificationOwner) {
      alert("Findings, actions performed, completion notes, follow-up date, and verification owner are required.");
      return;
    }
    onTransition('Action Completed', { findings, actionsPerformed, completionNotes, followUpDate, verificationOwner, evidenceFilename });
  };
  
  const handleAwaitingVerification = () => {
    onTransition('Awaiting Verification', {});
  };

  return (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-zinc-200 bg-zinc-50 flex items-start justify-between">
        <div>
          <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
            <Activity size={16} className="text-zinc-500" />
            INTERVENTION WORKFLOW
          </h3>
          <p className="text-xs text-zinc-500 mt-1">Status and active requirements.</p>
        </div>
        <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider ${getStatusColor(record.status)}`}>
          {record.status}
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-zinc-200">
        
        {/* Timeline */}
        <div className="p-4 md:w-1/3 bg-zinc-50/50">
          <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-wider mb-4">Timeline</h4>
          <div className="space-y-4">
            {record.timeline.map((event, i) => (
              <div key={event.id} className="relative pl-5">
                <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-emerald-500 border-2 border-white shadow-xs z-10" />
                {i < record.timeline.length - 1 && (
                  <div className="absolute left-[3px] top-3 bottom-[-16px] w-0.5 bg-zinc-200" />
                )}
                <div className="text-xs font-bold text-zinc-900">{getTimelineLabel(event.status)}</div>
                <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                  {new Date(event.timestamp).toLocaleDateString()} · Demo user
                </div>
                {event.note && (
                  <div className="mt-1 text-[10px] text-zinc-600 bg-white border border-zinc-200 rounded p-1.5 italic">
                    "{event.note}"
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Form */}
        <div className="p-4 md:w-2/3">
          <div className="space-y-4">
            
            {record.status === 'New Alert' && (
              <div className="bg-red-50 p-4 rounded-xl border border-red-100 space-y-3">
                <h4 className="text-sm font-bold text-red-900 flex items-center gap-2">
                  <AlertCircle size={16} /> Needs Review
                </h4>
                <div>
                  <label className="block text-[10px] font-bold text-red-800 uppercase mb-1">Reviewer Name *</label>
                  <input type="text" value={reviewerName} onChange={e => setReviewerName(e.target.value)} className="w-full text-sm border border-red-200 rounded p-2" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-red-800 uppercase mb-1">Review Note *</label>
                  <textarea value={reviewNote} onChange={e => setReviewNote(e.target.value)} className="w-full text-sm border border-red-200 rounded p-2 min-h-[60px]" placeholder="Required note..." />
                </div>
                <button onClick={handleReview} className="px-3 py-1.5 bg-red-600 text-white rounded text-xs font-bold hover:bg-red-700 transition-colors">
                  Mark as Reviewed
                </button>
              </div>
            )}
            
            {record.status === 'Reviewed' && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-zinc-900 mb-2">Assign Team</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">Team *</label>
                    <select value={assignedTeam} onChange={e => setAssignedTeam(e.target.value)} className="w-full text-sm border border-zinc-200 rounded p-2">
                      <option>Vector Team A</option>
                      <option>Vector Team B</option>
                      <option>Rapid Response Unit</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">Action Type *</label>
                    <select value={actionType} onChange={e => setActionType(e.target.value as InterventionActionType)} className="w-full text-sm border border-zinc-200 rounded p-2">
                      <option value="Inspect breeding sources">Inspect breeding sources</option>
                      <option value="Drain inspection">Drain inspection</option>
                      <option value="Container removal / source reduction">Container removal / source reduction</option>
                      <option value="Request larvicide assessment">Request larvicide assessment</option>
                      <option value="Request vector-control authority assessment">Request vector-control authority assessment</option>
                      <option value="Resident communication">Resident communication</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">Due Date *</label>
                    <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full text-sm border border-zinc-200 rounded p-2" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">Provisional demo service target *</label>
                    <div className="w-full text-sm border border-zinc-200 bg-zinc-50 rounded p-2 text-zinc-600 font-mono">
                      48h
                    </div>
                  </div>
                </div>
                <button onClick={handleAssign} className="px-3 py-1.5 bg-[#052e1a] text-white rounded text-xs font-bold hover:bg-[#0a4226]">
                  Assign
                </button>
              </div>
            )}
            
            {record.status === 'Assigned' && (
              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 space-y-3">
                <h4 className="text-sm font-bold text-yellow-900">Record Field Action</h4>
                <div className="text-xs text-yellow-800 mb-2">Team is assigned. Record the outcome of the field visit here.</div>
                <button onClick={handleOnSite} className="px-3 py-1.5 bg-yellow-600 text-white rounded text-xs font-bold hover:bg-yellow-700">
                  Begin Field Action Record
                </button>
              </div>
            )}
            
            {record.status === 'On Site' && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-zinc-900 mb-2">Record Field Action</h4>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">Findings *</label>
                  <textarea value={findings} onChange={e => setFindings(e.target.value)} className="w-full text-sm border border-zinc-200 rounded p-2 min-h-[60px]" placeholder="Required: Detailed findings..." />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">Actions Performed *</label>
                  <textarea value={actionsPerformed} onChange={e => setActionsPerformed(e.target.value)} className="w-full text-sm border border-zinc-200 rounded p-2 min-h-[50px]" placeholder="Required: Actions performed..." />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">Notes *</label>
                  <textarea value={completionNotes} onChange={e => setCompletionNotes(e.target.value)} className="w-full text-sm border border-zinc-200 rounded p-2 min-h-[50px]" placeholder="Required: Additional notes..." />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">Follow-up Due Date *</label>
                    <input type="date" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)} className="w-full text-sm border border-zinc-200 rounded p-2" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">Responsible Person *</label>
                    <input type="text" value={verificationOwner} onChange={e => setVerificationOwner(e.target.value)} className="w-full text-sm border border-zinc-200 rounded p-2" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">Simulated Evidence Filename</label>
                  <input type="text" value={evidenceFilename} onChange={e => setEvidenceFilename(e.target.value)} className="w-full text-sm border border-zinc-200 rounded p-2" placeholder="Optional" />
                </div>
                <button onClick={handleComplete} className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700">
                  Mark Action Completed
                </button>
              </div>
            )}
            
            {record.status === 'Action Completed' && (
              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200 space-y-3">
                <h4 className="text-sm font-bold text-indigo-900 flex items-center gap-2">
                  <CheckCircle size={16} /> Action Logged
                </h4>
                <p className="text-xs text-indigo-800 font-medium">Findings:</p>
                <p className="text-xs text-indigo-700 bg-white/50 p-2 rounded italic">{record.findings || 'No findings recorded.'}</p>
                <button onClick={handleAwaitingVerification} className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-bold hover:bg-indigo-700 mt-2">
                  Move to Awaiting Verification
                </button>
              </div>
            )}
            
            {record.status === 'Awaiting Verification' && (
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                <p className="text-sm font-bold text-purple-900 mb-1 flex items-center gap-2"><Clock size={16} /> Action logged. Follow-up verification is pending.</p>
                <div className="p-3 bg-white border border-purple-100 rounded-lg text-xs text-zinc-600 flex items-start gap-2">
                  <Info size={14} className="text-purple-500 shrink-0 mt-0.5" />
                  <p>Completing an action does not automatically lower the illustrative scenario index or mark the issue resolved. Follow-up verification is required.</p>
                </div>
              </div>
            )}
            
            {record.status === 'Activity decreased' && (
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                <p className="text-sm font-bold text-emerald-900 flex items-center gap-2"><CheckCircle size={16} /> Follow-up outcome recorded: Activity decreased.</p>
              </div>
            )}
            
            {record.status === 'Little/no change' && (
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                <p className="text-sm font-bold text-amber-900 flex items-center gap-2"><AlertCircle size={16} /> Follow-up outcome recorded: Little/no change. Further action may be required.</p>
              </div>
            )}
            
            {record.status === 'Activity increased' && (
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                <p className="text-sm font-bold text-orange-900 flex items-center gap-2"><AlertCircle size={16} /> Follow-up outcome recorded: Activity increased. Priority escalation recommended.</p>
              </div>
            )}
            
            {record.status === 'Not comparable' && (
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                <p className="text-sm font-bold text-zinc-900 flex items-center gap-2"><Info size={16} /> Follow-up outcome recorded: Not comparable.</p>
              </div>
            )}
            
            {record.status === 'Inconclusive' && (
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                <p className="text-sm font-bold text-zinc-900 flex items-center gap-2"><Info size={16} /> Follow-up outcome recorded: Inconclusive.</p>
              </div>
            )}
            
            {record.status === 'Escalated' && (
              <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                <p className="text-sm font-bold text-red-900 flex items-center gap-2"><ShieldAlert size={16} /> Follow-up outcome recorded: Escalated for additional review.</p>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
