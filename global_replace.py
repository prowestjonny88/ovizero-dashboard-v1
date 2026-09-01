import os
import re

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    original = content
    # For ZoneData
    content = content.replace('.eggVelocity', '.eggActivityChange')
    content = content.replace('.risk', '.interventionPriority')
    content = content.replace('risk: number', 'interventionPriority: number')
    content = content.replace('zone.status', 'zone.demoPriorityBand')
    content = content.replace('.riskScore', '.interventionPriority')
    
    # Not just simple replace for eggCount because eggCount is in ObservationSnapshot etc.
    content = content.replace('.eggCount', '.syntheticEggActivity')
    
    # We should be careful about replacing "status" globally.
    # We only replace zone.status to zone.demoPriorityBand (already done above)
    content = content.replace('activeZone.status', 'activeZone.demoPriorityBand')
    content = content.replace('zoneData.status', 'zoneData.demoPriorityBand')
    
    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith(('.ts', '.tsx')):
            filepath = os.path.join(root, file)
            # skip types.ts and data.ts as we already fixed them manually (mostly)
            if file not in ['types.ts', 'data.ts']:
                process_file(filepath)

print("done")
