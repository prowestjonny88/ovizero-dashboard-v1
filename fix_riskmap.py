import re

with open('src/components/RiskMap.tsx', 'r') as f:
    content = f.read()

content = content.replace("Outline: five node placements; not validated coverage.", "One marker = one node.")
content = content.replace("Topology &middot; not field validated", "Topology")
content = content.replace("No validated factor weights &middot; human dengue case data are not connected.", "Human dengue case data are not connected.")

with open('src/components/RiskMap.tsx', 'w') as f:
    f.write(content)
