import re
with open('src/components/Header.tsx', 'r') as f:
    content = f.read()
content = content.replace("onDateRangeChange", "")
content = content.replace("onClick={() => (range.value)}", "")
with open('src/components/Header.tsx', 'w') as f:
    f.write(content)

with open('src/components/CommandCenter.tsx', 'r') as f:
    content = f.read()
content = content.replace("onDateRangeChange?: (range: string) => void;", "")
content = content.replace("onDateRangeChange,", "")
content = content.replace("onClick={() => onDateRangeChange && onDateRangeChange(range.value)}", "")
with open('src/components/CommandCenter.tsx', 'w') as f:
    f.write(content)
print("done")
