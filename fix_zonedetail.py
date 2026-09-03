import re

with open('src/components/ZoneDetail.tsx', 'r') as f:
    content = f.read()

content = content.replace("Illustrative Intervention Priority", "Intervention Priority")
content = content.replace("Synthetic egg activity", "Egg activity")
content = content.replace("demo eggs", "eggs")
content = content.replace("7-day synthetic change", "7-day change")
content = re.sub(r'\s*<span className="text-\[9px\] text-zinc-400 mt-0\.5">External demo input</span>', '', content)

with open('src/components/ZoneDetail.tsx', 'w') as f:
    f.write(content)

