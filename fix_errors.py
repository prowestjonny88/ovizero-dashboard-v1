import re
import os

# PriorityZones import
with open("src/components/PriorityZones.tsx", "r") as f:
    pz = f.read()
if "getInterventionDisplayStatus" not in pz or "import { getInterventionDisplayStatus" not in pz:
    pz = pz.replace("import React from 'react';", "import React from 'react';\nimport { getInterventionDisplayStatus } from '../utils/interventionWorkflow';")
with open("src/components/PriorityZones.tsx", "w") as f:
    f.write(pz)

# InterventionWorkflowPanel imports
with open("src/components/interventions/InterventionWorkflowPanel.tsx", "r") as f:
    iwp = f.read()

# I tried to replace `const getStatusColor`, let's see if it's there
# It is! Let's remove it and add imports.
iwp = iwp.replace("import { DEMO_SNAPSHOT_AT } from '../../utils/dashboard';", "import { DEMO_SNAPSHOT_AT } from '../../utils/dashboard';\nimport { getInterventionDisplayStatus, getStatusColor as getSharedStatusColor } from '../../utils/interventionWorkflow';")

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

if old_local_status_color in iwp:
    iwp = iwp.replace(old_local_status_color, "")

iwp = iwp.replace("getStatusColor(", "getSharedStatusColor(")
if "getInterventionDisplayStatus(record.status)" not in iwp:
    iwp = iwp.replace("{record.status}", "{getInterventionDisplayStatus(record.status)}")

with open("src/components/interventions/InterventionWorkflowPanel.tsx", "w") as f:
    f.write(iwp)
    
# dashboard export types
with open("src/types.ts", "r") as f:
    types_content = f.read()
types_content = types_content.replace("zones: ZoneData[];", "zones: Partial<ZoneData>[];")
with open("src/types.ts", "w") as f:
    f.write(types_content)

