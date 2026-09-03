import re

with open('src/components/evidence/IllustrativeSubstrateFrame.tsx', 'r') as f:
    content = f.read()

content = content.replace("Synthetic substrate illustration.<br/>Does not represent an actual model inference.", "Substrate illustration.")

with open('src/components/evidence/IllustrativeSubstrateFrame.tsx', 'w') as f:
    f.write(content)

