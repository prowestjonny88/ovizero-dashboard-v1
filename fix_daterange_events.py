import re
with open('src/App.tsx', 'r') as f:
    content = f.read()
content = re.sub(r'onDateRangeChange=\{\(range\) => setSelectedDateRange\(range\)\}', '', content)
with open('src/App.tsx', 'w') as f:
    f.write(content)

with open('src/components/Header.tsx', 'r') as f:
    content = f.read()
content = re.sub(r'onDateRangeChange:\s*\(range:\s*string\)\s*=>\s*void;', '', content)
content = re.sub(r'onDateRangeChange,', '', content)
with open('src/components/Header.tsx', 'w') as f:
    f.write(content)
print("done")
