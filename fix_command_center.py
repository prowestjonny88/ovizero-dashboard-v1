import re

with open('src/components/CommandCenter.tsx', 'r') as f:
    content = f.read()

# Replace the unused props and imports
content = content.replace("import { DEVICES } from '../data';", "import { DEVICES, PROPOSED_GATEWAYS } from '../data';")

# Fix the counts
content = content.replace("const needsAttentionCount = 1; // Device needs attention mock", "const needsAttentionCount = DEVICES.filter(d => d.maintenanceState === 'Maintenance Required' || d.battery < 30).length;\n  const totalNodesCount = DEVICES.length;\n  const totalGatewaysCount = PROPOSED_GATEWAYS.length;")

content = content.replace("<span><strong className=\"text-zinc-900\">5</strong> simulated nodes</span>", "<span><strong className=\"text-zinc-900\">{totalNodesCount}</strong> simulated nodes</span>")
content = content.replace("<span><strong className=\"text-zinc-900\">1</strong> proposed gateway</span>", "<span><strong className=\"text-zinc-900\">{totalGatewaysCount}</strong> proposed gateway</span>")

# Remove the banner at the top of the page
banner_code = """        <div className="text-left md:text-right">
          <span className="inline-block text-[10px] font-mono font-semibold text-zinc-700 bg-zinc-100 px-2 py-1 rounded border border-zinc-200 uppercase tracking-wider">
            SIMULATED SCENARIO · NO LIVE DEVICES
          </span>
        </div>"""
content = content.replace(banner_code, "")

with open('src/components/CommandCenter.tsx', 'w') as f:
    f.write(content)
