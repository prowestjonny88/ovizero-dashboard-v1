import re

with open('src/components/evidence/EdgeAIEvidencePanel.tsx', 'r') as f:
    content = f.read()

content = content.replace("Illustrative TinyML output — model not trained or validated", "TinyML output")
content = content.replace("Simulated wingbeat event", "Wingbeat event")
content = content.replace("Illustrative frequency", "Frequency")

with open('src/components/evidence/EdgeAIEvidencePanel.tsx', 'w') as f:
    f.write(content)

