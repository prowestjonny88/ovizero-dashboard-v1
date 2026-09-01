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

fix_file('src/App.tsx', [
    ("const [selectedDateRange, setSelectedDateRange] = useState<string>('7d');", ""),
    ("selectedDateRange,", ""),
    ("selectedDateRange={selectedDateRange}", ""),
    ("`ovizero-risk-report-${selectedDateRange}-${dateStr}.pdf`", "`ovizero-risk-report-${dateStr}.pdf`"),
    ("`ovizero-simulated-scenario-${selectedDateRange}-${dateStr}.json`", "`ovizero-simulated-scenario-${dateStr}.json`")
])

fix_file('src/components/Header.tsx', [
    ("selectedDateRange: string;", ""),
    ("selectedDateRange,", "")
], [
    (r'<div className="flex bg-zinc-100 p-0\.5 rounded-lg border border-zinc-200">\s*\{\[\s*\{ label: \'7D\', value: \'7d\' \},\s*\{ label: \'30D\', value: \'30d\' \},\s*\{ label: \'90D\', value: \'90d\' \},\s*\].map\(\(range\) => \(.*?\}\s*</div>', '')
])

fix_file('src/components/CommandCenter.tsx', [
    ("selectedDateRange: string;", ""),
    ("selectedDateRange,", ""),
    ("selectedDateRange={selectedDateRange}", ""),
    ("{selectedDateRange.toUpperCase()}", "7D")
], [
    (r'<div className="flex bg-zinc-100/50 p-0\.5 rounded-md border border-zinc-200/50">\s*\{\[\s*\{ label: \'7D\', value: \'7d\' \},\s*\{ label: \'30D\', value: \'30d\' \},\s*\{ label: \'90D\', value: \'90d\' \}\s*\].map\(\(range\) => \(.*?</div>', ''),
    (r'const eggChartData =[\s\S]*?\];\n\s*\};\n\s*\}\)\(\);', 'const eggChartData = peakZone.trendData.map((val, i) => ({ day: `Day ${i + 1}`, count: val }));')
])

fix_file('src/components/DeviceFleet.tsx', [
    ('selectedDateRange=""', '')
])

fix_file('src/components/Reports.tsx', [
    ("selectedDateRange: string;", ""),
    ("selectedDateRange,", ""),
    ("selectedDateRange={selectedDateRange}", ""),
    ("buildReportLogs(selectedDateRange, zones, interventions)", "buildReportLogs(zones, interventions)")
], [
    (r'const getDisplayRange = \(\) => \{\s*if \(selectedDateRange === \'7d\'\) return \'7-Day\';\s*if \(selectedDateRange === \'30d\'\) return \'30-Day\';\s*return \'90-Day\';\s*\};', "const getDisplayRange = () => '7-Day';")
])

fix_file('src/components/PriorityZones.tsx', [
    ("selectedDateRange: string;", ""),
    ("selectedDateRange,", ""),
    ("selectedDateRange={selectedDateRange}", "")
])

fix_file('src/components/ZoneDetail.tsx', [
    ("selectedDateRange: string;", ""),
    ("selectedDateRange,", ""),
    ("selectedDateRange={selectedDateRange}", "")
], [
    (r"const selectedRangeUpper = selectedDateRange\.toUpperCase\(\);", ""),
    (r"if \(selectedRangeUpper === '7D'\) \{\s*first = zone\.avg7DayTrend\[0\];\s*last = zone\.avg7DayTrend\[zone\.avg7DayTrend\.length - 1\];\s*\} else if \(selectedRangeUpper === '30D'\) \{\s*first = zone\.avg7DayTrend\[0\] \* 2;\s*last = zone\.avg7DayTrend\[zone\.avg7DayTrend\.length - 1\] \* 2;\s*\} else \{\s*first = zone\.avg7DayTrend\[0\] \* 4;\s*last = zone\.avg7DayTrend\[zone\.avg7DayTrend\.length - 1\] \* 4;\s*\}", "first = zone.avg7DayTrend[0]; last = zone.avg7DayTrend[zone.avg7DayTrend.length - 1];"),
    (r"aria-label=\{`Illustrative egg-count trend \$\{changePct !== null && changePct > 0 \? 'rising' : 'falling'\} from \$\{first\} to \$\{last\} over the selected \$\{selectedRangeUpper === '7D' \? 'seven-day' : selectedRangeUpper === '30D' \? 'thirty-day' : 'ninety-day'\} period.`\}", "aria-label={`Illustrative egg-count trend ${changePct !== null && changePct > 0 ? 'rising' : 'falling'} from ${first} to ${last} over the 7-day period.`}")
])

fix_file('src/components/RiskMap.tsx', [
    ('selectedDateRange=""', '')
])

fix_file('src/utils/pdfReport.ts', [
    ("Period: ${payload.selectedDateRange}", "Period: 7-Day"),
])

fix_file('src/utils/dashboard.ts', [
    ("selectedDateRange: string,", ""),
    ("selectedDateRange,", "")
], [
    (r'export const buildReportLogs = \(selectedDateRange: string, zones: ZoneData\[\], interventions: Record<string, InterventionRecord>\): SystemLog\[\] => \{[\s\S]*?return logs\.sort\(\(a, b\) => new Date\(b\.timestamp\)\.getTime\(\) - new Date\(a\.timestamp\)\.getTime\(\)\);\n\}', """export const buildReportLogs = (zones: ZoneData[], interventions: Record<string, InterventionRecord>): SystemLog[] => {
  const logs: SystemLog[] = [];
  logs.push({ id: 'log-7d-1', timestamp: getDemoPastISO(0, 4), displayTime: '', tag: 'UI MOCK', message: 'Mock OZ-041 profile loaded with an illustrative egg-count value of 127.', level: 'INFO' });
  logs.push({ id: 'log-7d-2', timestamp: getDemoPastISO(2, 6), displayTime: '', tag: 'UI MOCK', message: 'OZ-077 simulated maintenance scenario flags low battery and weak signal.', level: 'WARNING' });
  logs.push({ id: 'log-7d-3', timestamp: getDemoPastISO(3, 8), displayTime: '', tag: 'UI MOCK', message: 'Proposed LoRaWAN packet schema displayed for demonstration.', level: 'INFO' });
  logs.push({ id: 'log-7d-4', timestamp: getDemoPastISO(4, 1), displayTime: '', tag: 'UI MOCK', message: 'Illustrative acoustic candidate value displayed; classifier not trained.', level: 'INFO' });
  logs.push({ id: 'log-7d-5', timestamp: getDemoPastISO(5, 2), displayTime: '', tag: 'UI MOCK', message: 'Simulated intervention record created in the current session.', level: 'INFO' });
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}"""),
    (r'reportLogs: buildReportLogs\(selectedDateRange, zones, interventions\)', 'reportLogs: buildReportLogs(zones, interventions)')
])

fix_file('src/types.ts', [
    ("selectedDateRange: string;", "")
])

fix_file('src/components/ScenarioPeriodLabel.tsx', [
    ("selectedDateRange: string;", ""),
    ("selectedDateRange,", ""),
    ("selectedDateRange", "7d")
])

print("done")
