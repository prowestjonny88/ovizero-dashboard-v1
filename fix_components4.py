import re
import os

def fix_file(filepath, replacements):
    if not os.path.exists(filepath):
        return
    with open(filepath, 'r') as f:
        content = f.read()
    for old, new in replacements:
        content = content.replace(old, new)
    with open(filepath, 'w') as f:
        f.write(content)

# App.tsx
fix_file('src/App.tsx', [
    ("{ 'Activity decreased': 'Activity decreased', 'Little/no change': 'Little/no change', 'Escalated': 'Escalated' }",
     "{ 'Activity decreased': 'Activity decreased', 'Little/no change': 'Little/no change', 'Activity increased': 'Activity increased', 'Not comparable': 'Not comparable', 'Inconclusive': 'Inconclusive', 'Escalated': 'Escalated' }")
])

# CommandCenter.tsx
with open('src/components/CommandCenter.tsx', 'r') as f:
    content = f.read()
content = re.sub(r'zone\.hatchingRate\s*===\s*[\'"]Critical[\'"]\s*\?\s*[\'"]text-rose-600[\'"]\s*:\s*zone\.hatchingRate\s*===\s*[\'"]High[\'"]\s*\?\s*[\'"]text-amber-600[\'"]\s*:\s*[\'"]text-emerald-600[\'"]', "''", content)
content = content.replace('zone.hatchingRate', "'-'")
with open('src/components/CommandCenter.tsx', 'w') as f:
    f.write(content)

# EdgeAIEvidencePanel.tsx
fix_file('src/components/evidence/EdgeAIEvidencePanel.tsx', [
    ("device.aedesConfidence > 90 || '-'", 'true')
])

# VerificationPanel.tsx
fix_file('src/components/interventions/VerificationPanel.tsx', [
    ('zone.status', 'zone.demoPriorityBand'),
    ('observation.demoPriorityBand', 'observation.riskBand'),
    ('zoneData.status', 'zoneData.demoPriorityBand')
])

# interventionWorkflow.ts
fix_file('src/utils/interventionWorkflow.ts', [
    ("'Activity decreased': undefined[]", "'Activity decreased': [],\n  'Little/no change': [],\n  'Activity increased': [],\n  'Not comparable': [],\n  'Inconclusive': []")
])

# pdfReport.ts
fix_file('src/utils/pdfReport.ts', [
    ('zone.status', 'zone.demoPriorityBand')
])

# riskExplanation.ts
fix_file('src/utils/riskExplanation.ts', [
    ('zone.status', 'zone.demoPriorityBand')
])

print("done")
