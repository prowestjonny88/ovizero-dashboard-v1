import re

with open('src/components/ScenarioPeriodLabel.tsx', 'r') as f:
    content = f.read()

content = content.replace("""        <p className="text-[11px] text-zinc-700 leading-snug">
          <strong>DEMO ASSUMPTIONS:</strong> Five varied mock device profiles are shown within one illustrative pilot layout.
          <span className="text-zinc-500 ml-1">Current simulated device snapshot. Trend and report views are fixed to a 7-day period.</span>
        </p>""", """        <p className="text-[11px] text-zinc-700 leading-snug">
          <strong>5 nodes &middot; 7-day view</strong>
        </p>""")

content = content.replace("Selected-period simulated scenario: 7-Day", "Selected-period scenario: 7-Day")

with open('src/components/ScenarioPeriodLabel.tsx', 'w') as f:
    f.write(content)

