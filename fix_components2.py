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
    ('zone.status', 'zone.demoPriorityBand'),
    ("'Effect Verified'", "'Activity decreased'")
])

# CommandCenter.tsx
fix_file('src/components/CommandCenter.tsx', [
    ('zone.status', 'zone.demoPriorityBand'),
    ('zone.predictions.actionWindow', "'-'"),
    ('zone.hatchingRate', "'-'")
])

# GoogleRiskMap.tsx
fix_file('src/components/GoogleRiskMap.tsx', [
    ('node.riskProfile.status', 'node.riskProfile.demoPriorityBand')
])

# ZoneDetail.tsx
fix_file('src/components/ZoneDetail.tsx', [
    ('zone.status', 'zone.demoPriorityBand')
])

# EdgeAIEvidencePanel.tsx
fix_file('src/components/evidence/EdgeAIEvidencePanel.tsx', [
    ('estimatedEggCount: \'-\'', 'estimatedEggCount: 0'),
    ("'{zone.candidateAcousticTrigger}'", 'zoneData.candidateAcousticTrigger')
])

# RiskExplanationPanel.tsx
fix_file('src/components/evidence/RiskExplanationPanel.tsx', [
    ('demoPriorityBand', 'riskBand')
])

# VerificationPanel.tsx
fix_file('src/components/interventions/VerificationPanel.tsx', [
    ('zone.status', 'zone.demoPriorityBand'),
    ('observation.demoPriorityBand', 'observation.riskBand'),
    ('velocity', 'eggActivityChange'),
    ('demoPriorityBand:', 'riskBand:'),
    ('eggCount', 'syntheticEggActivity')
])

# dashboard.ts
fix_file('src/utils/dashboard.ts', [
    ('zone.status', 'zone.demoPriorityBand'),
    ('z.status', 'z.demoPriorityBand'),
    ('risk: ', 'interventionPriority: '),
    ('riskProfile: zone,', 'riskProfile: zone,\n      interventionPriority: zone.interventionPriority,')
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
