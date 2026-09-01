import re

with open('src/components/PriorityZones.tsx', 'r') as f:
    content = f.read()

# Replace Header and subtitle
content = content.replace("Intervention Priority Matrix", "FIELD ACTIONS")
content = content.replace("Sort zones by synthetic index or operational action window.", "Human-reviewed inspection, assignment and follow-up workflow.")

# Add Process Strip
process_strip = """      <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 lg:gap-4 overflow-x-auto whitespace-nowrap scrollbar-hidden w-full text-xs font-bold text-zinc-500 uppercase tracking-widest">
          <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-[#e8f4ed] text-[#052e1a] flex items-center justify-center font-mono text-[10px]">1</div>REVIEW</div>
          <div className="w-8 h-px bg-zinc-200 hidden sm:block"></div>
          <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-[#e8f4ed] text-[#052e1a] flex items-center justify-center font-mono text-[10px]">2</div>ASSIGN</div>
          <div className="w-8 h-px bg-zinc-200 hidden sm:block"></div>
          <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-[#e8f4ed] text-[#052e1a] flex items-center justify-center font-mono text-[10px]">3</div>RECORD ACTION</div>
          <div className="w-8 h-px bg-zinc-200 hidden sm:block"></div>
          <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-[#e8f4ed] text-[#052e1a] flex items-center justify-center font-mono text-[10px]">4</div>RECORD FOLLOW-UP</div>
        </div>
      </div>
"""
content = re.sub(r'\{/\* Priority Matrix List \*/\}', process_strip + '\n      {/* Priority Matrix List */}', content)

# Modify Empty State
content = content.replace("No Priority Zones", "No Priority Locations")
content = content.replace("No priority zones are available.", "No priority locations are available.")

# Rewrite the card mapping
card_regex = r'return \(\s*<div\s*key=\{zone.id\}(.*?)</div>\s*\);\s*\}\)'
# We will use a script replacement for the map body

