import re
import os

# 1. Priority Map Filter Consistency & False "Assigned" Label
with open("src/components/RiskMap.tsx", "r") as f:
    risk_map = f.read()

old_selected_vm = """  const selectedVM = useMemo(() => 
    viewModels.find(vm => vm.deviceId === selectedDeviceId) ?? null
  , [viewModels, selectedDeviceId]);"""
new_selected_vm = """  const selectedVM = useMemo(() => 
    filteredNodes.find(vm => vm.deviceId === selectedDeviceId) ?? filteredNodes[0] ?? null
  , [filteredNodes, selectedDeviceId]);"""
risk_map = risk_map.replace(old_selected_vm, new_selected_vm)

old_assigned_btn = """<span>{activeIntervention ? 'ASSIGNED' : 'REVIEW & ASSIGN'}</span>"""
new_assigned_btn = """<span>{activeIntervention ? 'ACTION OPEN' : 'REVIEW & ASSIGN'}</span>"""
risk_map = risk_map.replace(old_assigned_btn, new_assigned_btn)

with open("src/components/RiskMap.tsx", "w") as f:
    f.write(risk_map)

# 3. Centralise Field-Action Display Status
with open("src/utils/interventionWorkflow.ts", "r") as f:
    workflow = f.read()

new_display_func = """
export const getInterventionDisplayStatus = (status: InterventionStatus): string => {
  if (status === 'Action Completed') return 'Action Logged';
  if (status === 'Awaiting Verification') return 'Awaiting follow-up';
  return status;
};
"""
if "getInterventionDisplayStatus" not in workflow:
    workflow = workflow + new_display_func

with open("src/utils/interventionWorkflow.ts", "w") as f:
    f.write(workflow)

# 4. Use Display Status Everywhere Judge-Facing
with open("src/components/interventions/InterventionStatusBadge.tsx", "r") as f:
    badge = f.read()

badge = badge.replace("import { getStatusColor } from '../../utils/interventionWorkflow';", "import { getStatusColor, getInterventionDisplayStatus } from '../../utils/interventionWorkflow';")
badge = badge.replace("{status === 'Action Completed' ? 'Action Logged' : status}", "{getInterventionDisplayStatus(status)}")
badge = badge.replace("No Active Alert", "Not started")

with open("src/components/interventions/InterventionStatusBadge.tsx", "w") as f:
    f.write(badge)

with open("src/components/interventions/InterventionWorkflowPanel.tsx", "r") as f:
    panel = f.read()
    
panel = panel.replace("import { getTimelineLabel }", "import { getInterventionDisplayStatus, getStatusColor as getSharedStatusColor } from '../../utils/interventionWorkflow';\nimport { getTimelineLabel }")
# Use getSharedStatusColor instead of local
old_local_status_color = """const getStatusColor = (status: InterventionStatus) => {
  switch (status) {
    case 'New Alert': return 'text-red-700 bg-red-50 border-red-200';
    case 'Reviewed': return 'text-amber-700 bg-amber-50 border-amber-200';
    case 'Assigned': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    case 'On Site': return 'text-blue-700 bg-blue-50 border-blue-200';
    case 'Action Completed': return 'text-indigo-700 bg-indigo-50 border-indigo-200';
    case 'Awaiting Verification': return 'text-purple-700 bg-purple-50 border-purple-200';
    case 'Activity decreased': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    case 'Little/no change': return 'text-amber-700 bg-amber-50 border-amber-200';
    case 'Activity increased': return 'text-orange-700 bg-orange-50 border-orange-200';
    case 'Not comparable': return 'text-zinc-700 bg-zinc-50 border-zinc-200';
    case 'Inconclusive': return 'text-zinc-700 bg-zinc-50 border-zinc-200';
    case 'Escalated': return 'text-red-700 bg-red-50 border-red-200';
    default: return 'text-zinc-700 bg-zinc-50 border-zinc-200';
  }
};"""
panel = panel.replace(old_local_status_color, "")
panel = panel.replace("getStatusColor(", "getSharedStatusColor(")
panel = panel.replace("{record.status}", "{getInterventionDisplayStatus(record.status)}")

# Fix Grid cols 2 -> 1 sm:2
panel = panel.replace("grid grid-cols-2 gap-3", "grid grid-cols-1 sm:grid-cols-2 gap-3")

with open("src/components/interventions/InterventionWorkflowPanel.tsx", "w") as f:
    f.write(panel)
    
with open("src/components/PriorityZones.tsx", "r") as f:
    zones = f.read()

if "import { getInterventionDisplayStatus }" not in zones:
    zones = zones.replace("import { useState, useMemo } from 'react';", "import { useState, useMemo } from 'react';\nimport { getInterventionDisplayStatus } from '../utils/interventionWorkflow';")
zones = zones.replace("Status: {intervention.status}", "Status: {getInterventionDisplayStatus(intervention.status)}")

with open("src/components/PriorityZones.tsx", "w") as f:
    f.write(zones)

with open("src/utils/pdfReport.ts", "r") as f:
    pdf = f.read()
    
pdf = pdf.replace("import { ZoneData, InterventionRecord, DeviceData, DeviceMonitoringRecord } from '../types';", "import { ZoneData, InterventionRecord, DeviceData, DeviceMonitoringRecord } from '../types';\nimport { getInterventionDisplayStatus } from './interventionWorkflow';")
old_display_status = """    let displayStatus: string = inv.status;
    if (displayStatus === 'Awaiting Verification') displayStatus = 'Awaiting follow-up';
    if (displayStatus === 'Action Completed') displayStatus = 'Action Completed';"""
new_display_status = "    let displayStatus: string = getInterventionDisplayStatus(inv.status);"
pdf = pdf.replace(old_display_status, new_display_status)
# 5. PDF follow up count fix
pdf = pdf.replace("Follow-up recorded: ${iv.verified}", "Follow-up recorded: ${followUpRecordedCount}")

with open("src/utils/pdfReport.ts", "w") as f:
    f.write(pdf)

# 6 & 7. Mobile Device View-Node Scroll & Mobile flow
with open("src/components/DeviceFleet.tsx", "r") as f:
    fleet = f.read()

old_ref_section = """<section ref={detailRef} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">"""
new_ref_section = """<section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">"""
fleet = fleet.replace(old_ref_section, new_ref_section)

old_panel = """<div className="lg:col-span-4 bg-white border border-zinc-200/50 rounded-xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex flex-col sticky top-24">"""
new_panel = """<div ref={detailRef} className="lg:col-span-4 bg-white border border-zinc-200/50 rounded-xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex flex-col lg:sticky lg:top-24 scroll-mt-28">"""
fleet = fleet.replace(old_panel, new_panel)

fleet = fleet.replace("max-h-[80vh] overflow-y-auto", "lg:max-h-[80vh] lg:overflow-y-auto")

with open("src/components/DeviceFleet.tsx", "w") as f:
    f.write(fleet)

# 8 & 9. Header Fixes
with open("src/components/Header.tsx", "r") as f:
    header = f.read()

old_7d = """            {dateRanges.map((range) => (
            <button
              key={range.value}
              
              className={`px-3 py-1.5 text-[11px] font-bold rounded-md transition-all uppercase tracking-wider ${
                true
                  ? 'bg-white text-black border border-zinc-200/30'
                  : 'text-zinc-400 hover:text-black'
              }`}
            >
              {range.label}
            </button>
            ))}"""
new_7d = """            <span className="px-3 py-1.5 text-[11px] font-bold rounded-md uppercase tracking-wider bg-white text-black border border-zinc-200/30 shadow-xs">7D</span>"""
header = header.replace(old_7d, new_7d)

old_illustrative = """<span className="text-[11px] font-bold uppercase tracking-wider text-zinc-700">Illustrative residential-community scenario</span>"""
new_illustrative = """<span className="text-[11px] font-bold uppercase tracking-wider text-zinc-700 hidden sm:inline">Illustrative residential-community scenario</span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-700 sm:hidden">Demo scenario</span>"""
header = header.replace(old_illustrative, new_illustrative)

with open("src/components/Header.tsx", "w") as f:
    f.write(header)

# 11. Curate JSON Export
with open("src/utils/dashboard.ts", "r") as f:
    dashboard = f.read()

old_zones_export = "zones,"
new_zones_export = """zones: zones.map(z => ({
      id: z.id,
      name: z.name,
      interventionPriority: z.interventionPriority,
      demoPriorityBand: z.demoPriorityBand,
      eggActivityChange: z.eggActivityChange,
      syntheticEggActivity: z.syntheticEggActivity,
      temperature: z.temperature,
      humidity: z.humidity,
      rainfall: z.rainfall,
      actionRequired: z.actionRequired,
      provenance: z.provenance
    })),"""
dashboard = dashboard.replace("    zones,\n", f"    {new_zones_export}\n")

with open("src/utils/dashboard.ts", "w") as f:
    f.write(dashboard)

# 12. README rewrite
with open("README.md", "w") as f:
    f.write("""# OviZero Dashboard

Simulated mosquito-surveillance workflow for the proposed OviZero system.

- 5 simulated monitoring nodes
- 1 proposed LoRaWAN gateway
- 1 illustrative residential-community scenario
- synthetic/demo values
- not a live deployed network
- not a field-validated epidemiological model

Judge-facing screens:
- Overview
- Priority Map
- Field Actions
- Devices

Features:
- PDF summary
- JSON demo-data export

Project evidence and maturity should be interpreted according to: OVIZERO_DASHBOARD_SOURCE_OF_TRUTH.md
""")

# 13. Remove Stale Build ID
with open("src/App.tsx", "r") as f:
    app_tsx = f.read()
    
app_tsx = re.sub(r"export const BUILD_ID.*?\n", "", app_tsx)
app_tsx = re.sub(r"console\.info.*?BUILD_ID.*?\n", "", app_tsx)

with open("src/App.tsx", "w") as f:
    f.write(app_tsx)

with open("package.json", "r") as f:
    pkg = f.read()

pkg = pkg.replace('"OviZero Prototype (Build: mentor-handoff-final-v29)"', '"OviZero simulated mosquito-surveillance dashboard"')
with open("package.json", "w") as f:
    f.write(pkg)
    
# 14. Bun lockfile
if os.path.exists("bun.lock"):
    os.remove("bun.lock")
