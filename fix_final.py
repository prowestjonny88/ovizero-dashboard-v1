import re

# 1. ZoneDetail.tsx
with open('src/components/ZoneDetail.tsx', 'r') as f:
    content = f.read()

content = re.sub(r'let xLabels: string\[\];\s*if \(true\) \{\s*xLabels = \["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"\];\s*xLabels = \["1st", "5th", "10th", "15th", "20th", "25th", "30th"\];\s*\} else \{\s*xLabels = \["Week 1", "Week 3", "Week 5", "Week 7", "Week 9", "Week 11", "Week 13"\];\s*\}', 'const xLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];', content)
with open('src/components/ZoneDetail.tsx', 'w') as f:
    f.write(content)

# 2. dashboard.ts
with open('src/utils/dashboard.ts', 'r') as f:
    content = f.read()
content = re.sub(r'staticLogs = \[\s*\];\s*\} else \{\s*staticLogs = \[\s*\];\s*\}', '}', content)
with open('src/utils/dashboard.ts', 'w') as f:
    f.write(content)

# 3. data.ts
with open('src/data.ts', 'r') as f:
    content = f.read()

content = content.replace("trigger: 'Simulated temperature and humidity provide contextual information alongside synthetic egg activity.'", "trigger: 'Egg activity + local microclimate context'")
content = content.replace("'Sustained high humidity following localized rainfall creates a proposed site-risk assumption for rapid larval development.'", "'Simulated temperature and humidity provide contextual information alongside synthetic egg activity.'")

with open('src/data.ts', 'w') as f:
    f.write(content)

# Update OVIZERO_DASHBOARD_SOURCE_OF_TRUTH.md based on prompt text? Wait, the prompt provided the full text of the source of truth document. I should update it, but I don't need to rewrite the entire thing if I didn't get instructions to change its content, the prompt literally said "also update the latest source of truth". The text provided in the prompt IS the latest source of truth. I will just dump the text from the prompt into the file.
