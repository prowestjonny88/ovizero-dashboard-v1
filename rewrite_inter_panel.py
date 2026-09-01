import re

with open('src/components/interventions/InterventionWorkflowPanel.tsx', 'r') as f:
    content = f.read()

# Replace ActionType options
old_options = """<option value="Targeted Fogging Assessment">Targeted Fogging Assessment</option>"""
content = content.replace(old_options, """<option value="Inspect breeding sources">Inspect breeding sources</option>
                      <option value="Drain inspection">Drain inspection</option>
                      <option value="Container removal / source reduction">Container removal / source reduction</option>
                      <option value="Request larvicide assessment">Request larvicide assessment</option>
                      <option value="Request vector-control authority assessment">Request vector-control authority assessment</option>
                      <option value="Resident communication">Resident communication</option>""")

content = content.replace("""<option value="Source Reduction">Source Reduction</option>
                      <option value="Drain Inspection">Drain Inspection</option>
                      <option value="Container Removal">Container Removal</option>
                      <option value="Larvicide Assessment">Larvicide Assessment</option>
                      <option value="Resident Notification">Resident Notification</option>""", "")

# Simplify On-Site -> Action Completed transition. 
# Remove GPS Match from Assigned state.
old_assigned_state = r"\{record.status === 'Assigned' && \(\s*<div className=\"bg-yellow-50 p-4 rounded-xl border border-yellow-200 space-y-3\">\s*<h4 className=\"text-sm font-bold text-yellow-900\">Mark On-Site Arrival</h4>\s*<div className=\"grid grid-cols-2 gap-3\">\s*<div>\s*<label className=\"block text-\[10px\] font-bold text-yellow-800 uppercase mb-1\">Arrival Time \*\</label>[\s\S]*?<button onClick=\{handleOnSite\} className=\"px-3 py-1.5 bg-yellow-600 text-white rounded text-xs font-bold hover:bg-yellow-700\">\s*Mark On Site\s*</button>\s*</div>\s*\)"

new_assigned_state = """{record.status === 'Assigned' && (
              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 space-y-3">
                <h4 className="text-sm font-bold text-yellow-900">Record Field Action</h4>
                <div className="text-xs text-yellow-800 mb-2">Team is assigned. Record the outcome of the field visit here.</div>
                <button onClick={handleOnSite} className="px-3 py-1.5 bg-yellow-600 text-white rounded text-xs font-bold hover:bg-yellow-700">
                  Begin Field Action Record
                </button>
              </div>
            )}"""
content = re.sub(old_assigned_state, new_assigned_state, content)

# Modify the Complete Action section
# We need: findings, action performed, notes, follow-up date, responsible person, optional demo evidence filename
old_complete_action = r"\{record.status === 'On Site' && \([\s\S]*?<button onClick=\{handleComplete\} className=\"px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700\">\s*Mark Action Completed\s*</button>\s*</div>\s*\)"

new_complete_action = """{record.status === 'On Site' && (
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
            )}"""
content = re.sub(old_complete_action, new_complete_action, content)

# Review CTA
content = content.replace("Mark Reviewed", "Complete Review")

with open('src/components/interventions/InterventionWorkflowPanel.tsx', 'w') as f:
    f.write(content)

