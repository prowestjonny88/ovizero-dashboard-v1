import re

new_metrics = """
  { id: 'ac-prec', category: 'Acoustic-trigger stage', name: 'Wingbeat-trigger precision', definition: 'Precision of the wingbeat trigger', currentValue: null, target: 'Not measured', status: 'Not Started', evidenceType: 'Design Target', plannedPhase: 'Pilot' },
  { id: 'ac-rec', category: 'Acoustic-trigger stage', name: 'Wingbeat-trigger recall', definition: 'Recall of the wingbeat trigger', currentValue: null, target: 'Not measured', status: 'Not Started', evidenceType: 'Design Target', plannedPhase: 'Pilot' },
  { id: 'ac-fa', category: 'Acoustic-trigger stage', name: 'False-trigger rate', definition: 'Rate of false triggers', currentValue: null, target: 'Not measured', status: 'Not Started', evidenceType: 'Design Target', plannedPhase: 'Pilot' },
  { id: 'ac-miss', category: 'Acoustic-trigger stage', name: 'Missed-trigger rate', definition: 'Rate of missed triggers', currentValue: null, target: 'Not measured', status: 'Not Started', evidenceType: 'Design Target', plannedPhase: 'Pilot' },
  { id: 'ac-amb', category: 'Acoustic-trigger stage', name: 'Ambient-noise rejection', definition: 'Ability to reject ambient noise', currentValue: null, target: 'Not measured', status: 'Not Started', evidenceType: 'Design Target', plannedPhase: 'Pilot' },
  { id: 'ac-lat', category: 'Acoustic-trigger stage', name: 'Trigger-to-camera-wake latency', definition: 'Latency from trigger to camera wake', currentValue: null, target: 'Not measured', status: 'Not Started', evidenceType: 'Design Target', plannedPhase: 'Pilot' },
  { id: 'ac-wake', category: 'Acoustic-trigger stage', name: 'Camera-wake success rate', definition: 'Success rate of waking camera', currentValue: null, target: 'Not measured', status: 'Not Started', evidenceType: 'Design Target', plannedPhase: 'Pilot' },
  { id: 'ac-pwr', category: 'Acoustic-trigger stage', name: 'Power consumption of acoustic monitoring', definition: 'Power used by the acoustic module', currentValue: null, target: 'Not measured', status: 'Not Started', evidenceType: 'Design Target', plannedPhase: 'Pilot' },
  { id: 'ac-sav', category: 'Acoustic-trigger stage', name: 'Power saving versus continuous camera operation', definition: 'Power saved compared to always-on camera', currentValue: null, target: 'Not measured', status: 'Not Started', evidenceType: 'Design Target', plannedPhase: 'Pilot' },
"""

with open('src/data/evidence.ts', 'r') as f:
    content = f.read()

# insert right before `// TinyML & Edge Processing`
content = content.replace('  // TinyML & Edge Processing', new_metrics + '\n  // TinyML & Edge Processing')

with open('src/data/evidence.ts', 'w') as f:
    f.write(content)
