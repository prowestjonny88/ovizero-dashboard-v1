import os

with open('src/components/CommandCenter.tsx', 'r') as f:
    content = f.read()
content = content.replace("Effect Verified", "Activity decreased")
with open('src/components/CommandCenter.tsx', 'w') as f:
    f.write(content)

with open('src/utils/pdfReport.ts', 'r') as f:
    content = f.read()
content = content.replace("Effect Verified", "Activity decreased")
with open('src/utils/pdfReport.ts', 'w') as f:
    f.write(content)

