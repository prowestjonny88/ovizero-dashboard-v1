import re

with open('src/components/interventions/VerificationPanel.tsx', 'r') as f:
    content = f.read()

content = content.replace("Effect Verified", "Activity decreased")
content = content.replace("No Effect", "Little/no change")
content = content.replace("velocity:", "eggActivityChange:")
content = content.replace("eggCount:", "syntheticEggActivity:")
content = content.replace("riskBand:", "demoPriorityBand:")
content = content.replace("zone.status", "zone.demoPriorityBand")
content = content.replace("interventionPriorityBand", "demoPriorityBand")
content = content.replace("syntheticEggActivity: number", "syntheticEggActivity: number | null")
content = content.replace("eggActivityChange: string", "eggActivityChange: string | null")

with open('src/components/interventions/VerificationPanel.tsx', 'w') as f:
    f.write(content)

