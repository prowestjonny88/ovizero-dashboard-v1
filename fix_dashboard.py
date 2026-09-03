import re

with open('src/utils/dashboard.ts', 'r') as f:
    content = f.read()

content = content.replace("OZ-041 demo profile loaded.", "OZ-041 profile loaded.")
content = content.replace("Demo acoustic candidate shown.", "Acoustic candidate shown.")
content = content.replace("Demo intervention record created.", "Intervention record created.")
content = content.replace("Illustrative residential-community scenario", "Residential-community scenario")
content = content.replace("tag: 'DEMO'", "tag: 'SYS'")

with open('src/utils/dashboard.ts', 'w') as f:
    f.write(content)

