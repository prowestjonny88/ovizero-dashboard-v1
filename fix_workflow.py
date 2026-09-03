import re

with open('src/components/interventions/InterventionWorkflowPanel.tsx', 'r') as f:
    content = f.read()

content = content.replace("Provisional demo service target", "Service target")
content = content.replace("Provisional service target", "Service target")
content = content.replace("Evidence file (demo)", "Evidence file")
content = content.replace("illustrative intervention priority", "intervention priority")

with open('src/components/interventions/InterventionWorkflowPanel.tsx', 'w') as f:
    f.write(content)
