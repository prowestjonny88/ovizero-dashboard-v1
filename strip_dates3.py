import re
import os

with open('src/components/Header.tsx', 'r') as f:
    content = f.read()
content = re.sub(r'<div className="flex bg-zinc-100 p-0.5 rounded-lg border border-zinc-200">\s*\{\[\s*\{ label: \'7D\', value: \'7d\' \},\s*\{ label: \'30D\', value: \'30d\' \},\s*\{ label: \'90D\', value: \'90d\' \},\s*\].*?</div>', '', content, flags=re.DOTALL)
with open('src/components/Header.tsx', 'w') as f:
    f.write(content)

with open('src/components/CommandCenter.tsx', 'r') as f:
    content = f.read()
content = re.sub(r'<div className="flex bg-zinc-100/50 p-0\.5 rounded-md border border-zinc-200/50">\s*\{\[\s*\{ label: \'7D\', value: \'7d\' \},\s*\{ label: \'30D\', value: \'30d\' \},\s*\{ label: \'90D\', value: \'90d\' \}\s*\].map\(\(range\) => \(.*?</div>', '', content, flags=re.DOTALL)
# Also the switch case block
content = re.sub(r'const eggChartData =[\s\S]*?\];\n\s*\};\n\s*\}\)\(\);', 'const eggChartData = peakZone.trendData.map((val, i) => ({ day: `Day ${i + 1}`, count: val }));', content, flags=re.DOTALL)

with open('src/components/CommandCenter.tsx', 'w') as f:
    f.write(content)

with open('src/components/ZoneDetail.tsx', 'r') as f:
    content = f.read()
content = re.sub(r'if \(selectedRangeUpper === \'7D\'\) \{\s*first = zone\.avg7DayTrend\[0\];\s*last = zone\.avg7DayTrend\[zone\.avg7DayTrend\.length - 1\];\s*\} else if \(selectedRangeUpper === \'30D\'\) \{\s*first = zone\.avg7DayTrend\[0\] \* 2;\s*last = zone\.avg7DayTrend\[zone\.avg7DayTrend\.length - 1\] \* 2;\s*\} else \{\s*first = zone\.avg7DayTrend\[0\] \* 4;\s*last = zone\.avg7DayTrend\[zone\.avg7DayTrend\.length - 1\] \* 4;\s*\}', 'first = zone.avg7DayTrend[0];\n    last = zone.avg7DayTrend[zone.avg7DayTrend.length - 1];', content, flags=re.DOTALL)
with open('src/components/ZoneDetail.tsx', 'w') as f:
    f.write(content)

