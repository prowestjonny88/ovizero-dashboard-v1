import re

with open('src/utils/interventionWorkflow.ts', 'r') as f:
    content = f.read()

content = content.replace("  'Escalated': [],\n};", "  'Escalated': [],\n  'Activity increased': [],\n  'Not comparable': [],\n  'Inconclusive': [],\n};")

with open('src/utils/interventionWorkflow.ts', 'w') as f:
    f.write(content)
