import re

with open('src/components/ScenarioPeriodLabel.tsx', 'r') as f:
    content = f.read()

content = content.replace("{7d}", "7-Day")
content = content.replace("Period selectors apply to trend and report views.", "Trend and report views are fixed to a 7-day period.")

with open('src/components/ScenarioPeriodLabel.tsx', 'w') as f:
    f.write(content)
