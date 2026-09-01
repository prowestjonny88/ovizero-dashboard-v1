import re

with open('src/components/CommandCenter.tsx', 'r') as f:
    content = f.read()

content = re.sub(r'const rangeEndLabel =[\s\S]*?: \'Day 90\';', "const rangeEndLabel = 'Day 7';", content)
with open('src/components/CommandCenter.tsx', 'w') as f:
    f.write(content)
