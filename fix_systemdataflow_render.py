import re

with open('src/components/evidence/SystemDataFlow.tsx', 'r') as f:
    content = f.read()

content = content.replace('{node.status}', '{node.status === "Implemented in Mock UI" ? "Implemented in UI" : node.status === "Simulated" ? "Local Data" : node.status}')

with open('src/components/evidence/SystemDataFlow.tsx', 'w') as f:
    f.write(content)

