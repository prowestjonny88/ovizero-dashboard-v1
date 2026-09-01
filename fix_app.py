import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "'Escalated': 'Escalated'",
    "'Escalated': 'Escalated',\n        'Activity increased': 'Activity increased',\n        'Not comparable': 'Not comparable',\n        'Inconclusive': 'Inconclusive'"
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
