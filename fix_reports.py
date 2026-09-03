import re

with open('src/components/Reports.tsx', 'r') as f:
    content = f.read()

content = content.replace("Selected-period scenario and mock activity.", "Selected-period scenario activity.")
content = content.replace("mock records", "records")
content = content.replace("Mock Growth", "Growth")
content = content.replace("Mock connectivity state", "Connectivity state")

with open('src/components/Reports.tsx', 'w') as f:
    f.write(content)

