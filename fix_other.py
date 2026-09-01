import re

with open('src/utils/interventionWorkflow.ts', 'r') as f:
    content = f.read()
content = content.replace("Effect Verified", "Activity decreased")
content = content.replace("No Effect", "Little/no change")
with open('src/utils/interventionWorkflow.ts', 'w') as f:
    f.write(content)

with open('src/utils/pdfReport.ts', 'r') as f:
    content = f.read()
content = content.replace("interventionPriorityDistribution", "riskDistribution")
content = content.replace("zone.status", "zone.demoPriorityBand")
content = content.replace("device.interventionPriorityScore", "device.riskScore") # wait, device doesn't have interventionPriority? Ah, wait, in types.ts it was replaced to interventionPriority? No, I only replaced ZoneData in update_types.py. Ah, wait, global_replace.py replaced .riskScore to .interventionPriority. Let's fix that.
# Let's check DeviceData in types.ts again. In types.ts DeviceData does NOT have riskScore.
# Let's verify what it has. I removed riskScore, eggCount, aedesConfidence from DeviceData in types.ts.
# so in pdfReport.ts we should remove them or replace them with NA.
content = re.sub(r"device\.interventionPriorityScore(?:\s*\|\|\s*'N/A')?", "'-'", content)
content = re.sub(r"device\.syntheticEggActivity(?:\s*\|\|\s*'N/A')?", "'-'", content)
content = re.sub(r"device\.aedesConfidence(?:\s*\|\|\s*'N/A')?", "'-'", content)
with open('src/utils/pdfReport.ts', 'w') as f:
    f.write(content)

with open('src/utils/riskExplanation.ts', 'r') as f:
    content = f.read()
content = content.replace("zone.status", "zone.demoPriorityBand")
with open('src/utils/riskExplanation.ts', 'w') as f:
    f.write(content)

