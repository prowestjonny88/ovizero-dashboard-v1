import re
import os

with open('src/types.ts', 'r') as f:
    content = f.read()

# 7. Remove predictions
content = re.sub(r'\s*predictions:\s*\{\s*next3Days:\s*string;\s*next7Days:\s*string;\s*\};\n', '\n', content)
content = re.sub(r'\s*aedesConfidence:\s*number;\n', '\n', content)

with open('src/types.ts', 'w') as f:
    f.write(content)

with open('src/data.ts', 'r') as f:
    content = f.read()

content = content.replace("PPR Seri Anggerik", "Illustrative residential-community scenario")
content = re.sub(r'\s*predictions:\s*\{\s*next3Days:.*?next7Days:.*?\},', '', content, flags=re.DOTALL)

# 9. Fix incorrect leftover narratives
# Community courtyard must not describe a market.
content = content.replace("Market stalls and waste collection area", "Central community courtyard")
content = content.replace("Market stall density provides resting sites", "Courtyard structure provides resting sites")
content = content.replace("Discarded containers from market activity", "Discarded containers in courtyard")

# Community hall must not describe a school courtyard.
content = content.replace("School playground and cafeteria", "Main community hall")
content = content.replace("Cafeteria waste", "Event waste")
content = content.replace("School hours expose children", "Community gatherings expose residents")

# 8. Replace biological predictive wording / acoustic Hz
content = content.replace("Optimal Incubation Climate", "Climate Threshold Reached")
content = content.replace("Humidity spike + egg count rise", "Correlated activity rise")
content = re.sub(r"\'\d{3} Hz\'", "'Candidate acoustic trigger — simulated'", content)
# Wait, let's see how candidate acoustic trigger was formatted in data.ts.

with open('src/data.ts', 'w') as f:
    f.write(content)

print("done types and data")
