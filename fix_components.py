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

# CommandCenter
fix_file('src/components/CommandCenter.tsx', [
    ('zone.status', 'zone.demoPriorityBand'),
    ('zone.predictions.actionWindow', "'48 hours'"),
    ('zone.hatchingRate', "'-'")
])

# GoogleRiskMap
fix_file('src/components/GoogleRiskMap.tsx', [
    ('interventionPriorityProfile', 'riskProfile')
])

# PriorityZones
fix_file('src/components/PriorityZones.tsx', [
    ('zone.predictions.actionWindow', "'48 hours'")
])

# ZoneDetail
with open('src/components/ZoneDetail.tsx', 'r') as f:
    content = f.read()
content = content.replace('zone.status', 'zone.demoPriorityBand')
content = content.replace('selectedZoneDevice?.wingbeatMatch || \'497\'', 'zone.candidateAcousticTrigger')
content = content.replace('{zone.hatchingRate}', '-')
content = content.replace('{zone.predictions.adultEmergence}', '-')
content = content.replace('{zone.predictions.actionWindow}', '-')
with open('src/components/ZoneDetail.tsx', 'w') as f:
    f.write(content)

# EdgeAIEvidencePanel
with open('src/components/evidence/EdgeAIEvidencePanel.tsx', 'r') as f:
    content = f.read()
content = content.replace('device.syntheticEggActivity', "'-'")
content = content.replace('device.wingbeatMatch', "'-'")
with open('src/components/evidence/EdgeAIEvidencePanel.tsx', 'w') as f:
    f.write(content)

# RiskExplanationPanel
fix_file('src/components/evidence/RiskExplanationPanel.tsx', [
    ('interventionPriorityBand', 'demoPriorityBand')
])

# InterventionWorkflowPanel
fix_file('src/components/interventions/InterventionWorkflowPanel.tsx', [
    ('Effect Verified', 'Activity decreased'),
    ('No Effect', 'Little/no change')
])

# VerificationPanel
fix_file('src/components/interventions/VerificationPanel.tsx', [
    ('zone.status', 'zone.demoPriorityBand'),
    ('eggVelocity:', 'eggActivityChange:'),
    ('velocity:', 'eggActivityChange:'),
    ('ObservationSnapshot = {\n      syntheticEggActivity: zone.syntheticEggActivity,\n      eggActivityChange: zone.eggActivityChange,\n      scenarioIndex: zone.interventionPriority,\n      demoPriorityBand: zone.demoPriorityBand\n    };',
     'ObservationSnapshot = {\n      recordedAt: new Date().toISOString(),\n      dataSource: "Simulated",\n      syntheticEggActivity: zone.syntheticEggActivity,\n      eggActivityChange: zone.eggActivityChange,\n      scenarioIndex: zone.interventionPriority,\n      riskBand: zone.demoPriorityBand\n    };'),
    ('demoPriorityBand: ObservationSnapshot', 'riskBand: ObservationSnapshot')
])

# dashboard.ts
fix_file('src/utils/dashboard.ts', [
    ('zone.status', 'zone.demoPriorityBand'),
    ('risk: zone.interventionPriority', 'interventionPriority: zone.interventionPriority')
])

# interventionWorkflow.ts
fix_file('src/utils/interventionWorkflow.ts', [
    ('Effect Verified', 'Activity decreased'),
    ('No Effect', 'Little/no change')
])

# pdfReport.ts
fix_file('src/utils/pdfReport.ts', [
    ('zone.status', 'zone.demoPriorityBand'),
    ('device.interventionPriorityScore', "'-'"),
    ('device.syntheticEggActivity', "'-'")
])

# riskExplanation.ts
fix_file('src/utils/riskExplanation.ts', [
    ('zone.status', 'zone.demoPriorityBand')
])

print("done")
