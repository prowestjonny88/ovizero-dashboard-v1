import re

with open('src/components/interventions/InterventionWorkflowPanel.tsx', 'r') as f:
    content = f.read()

timeline_formatter = """const getTimelineLabel = (status: string) => {
    switch (status) {
      case 'New Alert': return 'Workflow started';
      case 'Reviewed': return 'Review completed';
      case 'Assigned': return 'Assigned';
      case 'On Site': return 'Field action recorded'; // Since we simplified On Site and Action Completed
      case 'Action Completed': return 'Field action recorded';
      case 'Awaiting Verification': return 'Follow-up pending';
      default: return 'Follow-up recorded';
    }
  };"""

# inject at the top of the component or just outside
content = content.replace("export default function InterventionWorkflowPanel", timeline_formatter + "\n\nexport default function InterventionWorkflowPanel")
content = content.replace("<div className=\"text-xs font-bold text-zinc-900\">{event.status}</div>", "<div className=\"text-xs font-bold text-zinc-900\">{getTimelineLabel(event.status)}</div>")

# Also "Do not make them look like live field telemetry."
# We should probably change the timestamp format to something less live? Or just keep it as is. "interaction records as demo workflow events"
content = content.replace("{new Date(event.timestamp).toLocaleTimeString()} · {event.actor}", "{new Date(event.timestamp).toLocaleDateString()} · Demo user")

with open('src/components/interventions/InterventionWorkflowPanel.tsx', 'w') as f:
    f.write(content)

