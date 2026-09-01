import re
import os

# CommandCenter
with open('src/components/CommandCenter.tsx', 'r') as f:
    content = f.read()
content = content.replace("zone.hatchingRate", "'-'")
with open('src/components/CommandCenter.tsx', 'w') as f:
    f.write(content)

# VerificationPanel
with open('src/components/interventions/VerificationPanel.tsx', 'r') as f:
    content = f.read()
content = content.replace("observation.demoPriorityBand", "observation.riskBand")
with open('src/components/interventions/VerificationPanel.tsx', 'w') as f:
    f.write(content)

# interventionWorkflow
with open('src/utils/interventionWorkflow.ts', 'r') as f:
    content = f.read()
if "Escalated: []," not in content:
    content = content.replace("Escalated: []\n};", "Escalated: [],\n  'Activity increased': [],\n  'Not comparable': [],\n  'Inconclusive': []\n};")
with open('src/utils/interventionWorkflow.ts', 'w') as f:
    f.write(content)

# pdfReport
with open('src/utils/pdfReport.ts', 'r') as f:
    content = f.read()
content = content.replace("zone.status", "zone.demoPriorityBand")
content = content.replace("device.interventionPriorityScore", "'-'")
content = content.replace("device.syntheticEggActivity", "'-'")
with open('src/utils/pdfReport.ts', 'w') as f:
    f.write(content)

# riskExplanation
with open('src/utils/riskExplanation.ts', 'r') as f:
    content = f.read()
content = content.replace("zone.status", "zone.demoPriorityBand")
with open('src/utils/riskExplanation.ts', 'w') as f:
    f.write(content)

print("done")
