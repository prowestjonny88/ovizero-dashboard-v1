import re
import os

def fix_file(filepath, replacements, regex_replacements=None):
    if not os.path.exists(filepath):
        return
    with open(filepath, 'r') as f:
        content = f.read()
    for old, new in replacements:
        content = content.replace(old, new)
    if regex_replacements:
        for pattern, new in regex_replacements:
            content = re.sub(pattern, new, content, flags=re.DOTALL)
    with open(filepath, 'w') as f:
        f.write(content)

# 1, 2, 3: App.tsx
with open('src/App.tsx', 'r') as f:
    content = f.read()

# Remove getDynamicZones entirely
content = re.sub(r'  // Generate dynamic zones data depending on selectedDateRange.*?  };\n\n  const dynamicZones = getDynamicZones\(\);\n', '  const dynamicZones = ZONES;\n', content, flags=re.DOTALL)
content = content.replace("useState<string>('ppr-seri-anggerik')", "useState<string>('north-residential-block')")

# Remove selectedDateRange logic from exporting if any, or just keep it but since we use ZONES directly, it's fine.
with open('src/App.tsx', 'w') as f:
    f.write(content)

print("done App.tsx")
