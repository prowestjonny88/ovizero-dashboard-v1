import re

with open('src/components/CommandCenter.tsx', 'r') as f:
    content = f.read()

content = re.sub(r'const \[lastRefreshed, setLastRefreshed\] = useState<string>\(.*?;\n', '', content)
content = content.replace("Updated Snapshot time • 5 simulated nodes", "Scenario timestamp: 5 Aug 2026 · 08:36 MYT • 5 simulated nodes")

with open('src/components/CommandCenter.tsx', 'w') as f:
    f.write(content)

with open('src/data.ts', 'r') as f:
    content = f.read()
content = content.replace("'Snapshot time'", "'5 Aug 2026 · 08:36 MYT'")
with open('src/data.ts', 'w') as f:
    f.write(content)
print("done")
