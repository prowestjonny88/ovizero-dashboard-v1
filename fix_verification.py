import re

with open('src/components/interventions/VerificationPanel.tsx', 'r') as f:
    content = f.read()

content = content.replace("Optional demo value", "Optional value")
content = content.replace("Evidence file (demo)", "Evidence file")

with open('src/components/interventions/VerificationPanel.tsx', 'w') as f:
    f.write(content)
