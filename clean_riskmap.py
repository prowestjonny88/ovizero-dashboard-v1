import re

with open('src/components/RiskMap.tsx', 'r') as f:
    content = f.read()

content = re.sub(r'\s*const \[expandedSection, setExpandedSection\] = useState<string \| null>\(null\);\n', '\n', content)
content = re.sub(r'\s*ChevronDown,\s*', '\n  ', content)
content = re.sub(r'\s*ChevronUp\s*', '\n', content)

with open('src/components/RiskMap.tsx', 'w') as f:
    f.write(content)

