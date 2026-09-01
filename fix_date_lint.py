import re

with open('src/components/CommandCenter.tsx', 'r') as f:
    content = f.read()
content = re.sub(r'selectedDateRange === range\.value', 'true', content)
with open('src/components/CommandCenter.tsx', 'w') as f:
    f.write(content)

with open('src/components/Header.tsx', 'r') as f:
    content = f.read()
content = re.sub(r'selectedDateRange === range\.value', 'true', content)
with open('src/components/Header.tsx', 'w') as f:
    f.write(content)

with open('src/components/PriorityZones.tsx', 'r') as f:
    content = f.read()
content = re.sub(r'^\s*selectedDateRange,?\n?', '', content, flags=re.MULTILINE)
with open('src/components/PriorityZones.tsx', 'w') as f:
    f.write(content)

with open('src/components/Reports.tsx', 'r') as f:
    content = f.read()
content = re.sub(r'if \(selectedDateRange === \'7d\'\) return \'7-Day\';', "return '7-Day';", content)
with open('src/components/Reports.tsx', 'w') as f:
    f.write(content)

with open('src/components/ZoneDetail.tsx', 'r') as f:
    content = f.read()
content = re.sub(r'^\s*selectedDateRange,?\n?', '', content, flags=re.MULTILINE)
content = re.sub(r'if \(selectedRangeUpper === \'7D\'\) \{', 'if (true) {', content)
content = re.sub(r'\$\{selectedRangeUpper === \'7D\' \? \'seven-day\' : selectedRangeUpper === \'30D\' \? \'thirty-day\' : \'ninety-day\'\}', '7-day', content)
content = re.sub(r'\$\{selectedRangeUpper === \'7D\' \? \'seven-day\' : \'seven-day\'\}', '7-day', content) # in case it was modified
with open('src/components/ZoneDetail.tsx', 'w') as f:
    f.write(content)

with open('src/utils/dashboard.ts', 'r') as f:
    content = f.read()
content = re.sub(r'if \(selectedDateRange === \'7d\'\) \{', 'if (true) {', content)
with open('src/utils/dashboard.ts', 'w') as f:
    f.write(content)

