import re
# Header
with open('src/components/Header.tsx', 'r') as f:
    c = f.read()
c = re.sub(r'<div className="flex bg-zinc-100 p-0\.5 rounded-lg border border-zinc-200">\s*\{\[\s*\{ label: \'7D\', value: \'7d\' \},\s*\{ label: \'30D\', value: \'30d\' \},\s*\{ label: \'90D\', value: \'90d\' \},\s*\].map\(\(range\) => \(\s*<button[\s\S]*?</button>\s*\)\)\}\s*</div>', '', c)
with open('src/components/Header.tsx', 'w') as f:
    f.write(c)

# CommandCenter
with open('src/components/CommandCenter.tsx', 'r') as f:
    c = f.read()
c = re.sub(r'<div className="flex bg-zinc-100/50 p-0\.5 rounded-md border border-zinc-200/50">\s*\{\[\s*\{ label: \'7D\', value: \'7d\' \},\s*\{ label: \'30D\', value: \'30d\' \},\s*\{ label: \'90D\', value: \'90d\' \}\s*\].map\(\(range\) => \(\s*<button[\s\S]*?</button>\s*\)\)\}\s*</div>', '', c)
# eggChartData
c = re.sub(r'const eggChartData = \(\) => \{[\s\S]*?return peakZone.trendData.map[\s\S]*?\];\n\s*\};\n\s*\}\)\(\);', 'const eggChartData = peakZone.trendData.map((val, i) => ({ day: `Day ${i + 1}`, count: val }));', c)
c = re.sub(r"const eggChartData = \(\) => \{\s*switch \(selectedDateRange\) \{[\s\S]*?return peakZone.trendData.map[\s\S]*?\}\)\(\);", 'const eggChartData = peakZone.trendData.map((val, i) => ({ day: `Day ${i + 1}`, count: val }));', c)
with open('src/components/CommandCenter.tsx', 'w') as f:
    f.write(c)

# dashboard.ts
with open('src/utils/dashboard.ts', 'r') as f:
    c = f.read()
c = re.sub(r'export const buildReportLogs[\s\S]*?return logs\.sort\(\(a, b\) => new Date\(b\.timestamp\)\.getTime\(\) - new Date\(a\.timestamp\)\.getTime\(\)\);\n\}', """export const buildReportLogs = (zones: ZoneData[], interventions: Record<string, InterventionRecord>): SystemLog[] => {
  const logs: SystemLog[] = [];
  logs.push({ id: 'log-7d-1', timestamp: getDemoPastISO(0, 4), displayTime: '', tag: 'UI MOCK', message: 'Mock OZ-041 profile loaded with an illustrative egg-count value of 127.', level: 'INFO' });
  logs.push({ id: 'log-7d-2', timestamp: getDemoPastISO(2, 6), displayTime: '', tag: 'UI MOCK', message: 'OZ-077 simulated maintenance scenario flags low battery and weak signal.', level: 'WARNING' });
  logs.push({ id: 'log-7d-3', timestamp: getDemoPastISO(3, 8), displayTime: '', tag: 'UI MOCK', message: 'Proposed LoRaWAN packet schema displayed for demonstration.', level: 'INFO' });
  logs.push({ id: 'log-7d-4', timestamp: getDemoPastISO(4, 1), displayTime: '', tag: 'UI MOCK', message: 'Illustrative acoustic candidate value displayed; classifier not trained.', level: 'INFO' });
  logs.push({ id: 'log-7d-5', timestamp: getDemoPastISO(5, 2), displayTime: '', tag: 'UI MOCK', message: 'Simulated intervention record created in the current session.', level: 'INFO' });
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}""", c)
with open('src/utils/dashboard.ts', 'w') as f:
    f.write(c)
