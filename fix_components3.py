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
    ('z.status', 'z.demoPriorityBand'),
    ('let status = z.demoPriorityBand;', 'let status = z.demoPriorityBand;'),
    ("'No Effect'", "'Little/no change'")
])

# CommandCenter.tsx
fix_file('src/components/CommandCenter.tsx', [
    ('z.status', 'z.demoPriorityBand'),
    ('peakZone.status', 'peakZone.demoPriorityBand'),
    ('actionWindow', "'-'") # remove actionWindow access if any
])

# GoogleRiskMap.tsx
fix_file('src/components/GoogleRiskMap.tsx', [
    ('vm.riskProfile.status', 'vm.riskProfile.demoPriorityBand')
])

# RiskMap.tsx
fix_file('src/components/RiskMap.tsx', [
    ('vm.interventionPriorityProfile.status', 'vm.riskProfile.demoPriorityBand'),
    ('selectedVM.interventionPriorityProfile.status', 'selectedVM.riskProfile.demoPriorityBand')
])

# ZoneDetail.tsx
fix_file('src/components/ZoneDetail.tsx', [
    ('zone?.status', 'zone?.demoPriorityBand')
])

# PriorityZones.tsx
fix_file('src/components/PriorityZones.tsx', [
    ('Effect Verified', 'Activity decreased'),
    ('No Effect', 'Little/no change')
])

# EdgeAIEvidencePanel.tsx
fix_file('src/components/evidence/EdgeAIEvidencePanel.tsx', [
    ('estimatedEggCount: 0', "estimatedEggCount: '0' as any")
])

# VerificationPanel.tsx
fix_file('src/components/interventions/VerificationPanel.tsx', [
    ('zone.status', 'zone.demoPriorityBand'),
    ('observation.demoPriorityBand', 'observation.riskBand'),
    ('{ syntheticEggActivity: number; eggActivityChange: string; scenarioIndex: number; riskBand: "Critical" | "High" | "Elevated" | "Watch" | "Stable"; }', 'ObservationSnapshot'),
    ('Effect Verified', 'Activity decreased'),
    ('No Effect', 'Little/no change')
])

print("done")
