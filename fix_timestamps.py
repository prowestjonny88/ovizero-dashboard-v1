import re

# data.ts
with open('src/data.ts', 'r') as f:
    content = f.read()

content = re.sub(r"lastSync: '\d+ min ago',", "lastSync: 'Snapshot time',", content)
with open('src/data.ts', 'w') as f:
    f.write(content)

# CommandCenter.tsx
with open('src/components/CommandCenter.tsx', 'r') as f:
    content = f.read()
content = re.sub(r"const \[lastRefreshed, setLastRefreshed\] = useState<string>\('Just now'\);\n\n\s*useEffect\(\(\) => \{\n\s*const timer = setInterval\(\(\) => \{\n\s*setLastRefreshed\('Just now'\);\n\s*\}, 60000\);\n\s*return \(\) => clearInterval\(timer\);\n\s*\}, \[\]\);\n", "", content)
content = content.replace("useState<string>('Just now')", "useState<string>('Snapshot time')")
content = content.replace("{lastRefreshed}", "Snapshot time")

with open('src/components/CommandCenter.tsx', 'w') as f:
    f.write(content)

