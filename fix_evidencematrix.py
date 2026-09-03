import re

with open('src/components/evidence/EvidenceStatusMatrix.tsx', 'r') as f:
    content = f.read()

content = content.replace("UI simulation only", "UI only")
content = content.replace("{row.status}", '{row.status === "Simulated Output" ? "Output" : row.status === "Provisional Team Target" ? "Team Target" : row.status}')

with open('src/components/evidence/EvidenceStatusMatrix.tsx', 'w') as f:
    f.write(content)

