import re

with open('src/utils/dashboard.ts', 'r') as f:
    content = f.read()

content = content.replace("Effect Verified", "Activity decreased")
content = content.replace("No Effect", "Little/no change")
content = content.replace("zone.status", "zone.demoPriorityBand")
content = content.replace("risk: zone.interventionPriority", "interventionPriority: zone.interventionPriority")
content = content.replace("interventionPriorityProfile", "riskProfile")

with open('src/utils/dashboard.ts', 'w') as f:
    f.write(content)

