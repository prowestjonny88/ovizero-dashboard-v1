import re

with open('src/components/CommandCenter.tsx', 'r') as f:
    content = f.read()

content = re.sub(r'const \[lastRefreshed, setLastRefreshed\] = useState<string>\(.*?;\n\n\s*useEffect\(\(\) => \{\n\s*const timer = setInterval\(\(\) => \{\n\s*setLastRefreshed\(.*?\);\n\s*\}, 60000\);\n\s*return \(\) => clearInterval\(timer\);\n\s*\}, \[\]\);', '', content, flags=re.DOTALL)
content = content.replace("setLastRefreshed('Just now');", "")
content = content.replace("useState<string>('Just now')", "useState<string>('Snapshot time')")
content = content.replace("{lastRefreshed}", "Snapshot time")

with open('src/components/CommandCenter.tsx', 'w') as f:
    f.write(content)
