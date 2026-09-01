import re

# ZoneDetail.tsx - remove predictions
with open('src/components/ZoneDetail.tsx', 'r') as f:
    content = f.read()
# Replace the whole block if possible, or just the usages
content = re.sub(r'zone\.predictions\.next3Days', "'-'", content)
content = re.sub(r'zone\.predictions\.next7Days', "'-'", content)
with open('src/components/ZoneDetail.tsx', 'w') as f:
    f.write(content)

# RiskMap.tsx - interventionPriorityProfile -> riskProfile, aedesConfidence removal
with open('src/components/RiskMap.tsx', 'r') as f:
    content = f.read()
content = content.replace('interventionPriorityProfile', 'riskProfile')
content = re.sub(r'<span className="text-xs font-bold text-zinc-800">\{selectedVM\.riskProfile\.aedesConfidence\}% <span className="text-\[10px\] text-zinc-400">— not calibrated</span></span>', '<span className="text-xs font-bold text-zinc-800">Integration pending</span>', content)
with open('src/components/RiskMap.tsx', 'w') as f:
    f.write(content)

# CommandCenter.tsx - eggVelocityGrad
with open('src/components/CommandCenter.tsx', 'r') as f:
    content = f.read()
content = content.replace('eggVelocityGrad', 'eggActivityGrad')
with open('src/components/CommandCenter.tsx', 'w') as f:
    f.write(content)

# dashboard.ts - legacy IDs
with open('src/utils/dashboard.ts', 'r') as f:
    content = f.read()
content = content.replace("'ppr-seri-anggerik'", "'north-residential-block'")
content = content.replace("'block-c-taman-muda'", "'drain-corridor'")
content = content.replace("'market-zone-4'", "'community-courtyard'")
content = content.replace("'flat-sri-murni'", "'playground-area'")
content = content.replace("'school-zone-2'", "'community-hall'")
with open('src/utils/dashboard.ts', 'w') as f:
    f.write(content)

