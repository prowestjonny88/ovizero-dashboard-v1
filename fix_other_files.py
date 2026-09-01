import re

# 1. SimulationBanner.tsx
with open('src/components/SimulationBanner.tsx', 'r') as f:
    content = f.read()
content = re.sub(r'<strong className="font-bold">SIMULATED DEMO DATA:</strong>.*?<\/p>', 'SIMULATED SCENARIO · NO LIVE DEVICES &mdash; This interface uses synthetic values and does not represent a live deployed network or field-validated epidemiological model.</p>', content)
with open('src/components/SimulationBanner.tsx', 'w') as f:
    f.write(content)

# 2. Sidebar.tsx
with open('src/components/Sidebar.tsx', 'r') as f:
    content = f.read()
content = content.replace("Risk Intelligence Engine", "Mosquito Surveillance")
with open('src/components/Sidebar.tsx', 'w') as f:
    f.write(content)

# 3. Clean up unused imports in CommandCenter.tsx
with open('src/components/CommandCenter.tsx', 'r') as f:
    content = f.read()
# unused props in CommandCenter: interventions isn't used
# but it is part of the Props interface, so let's leave it in the interface but not destructure or use it? Wait, it's defined in the interface and destructured, but never used in the component body.
# TypeScript lint might complain. Let's see if we should remove it.
# The user said: "5. Remove unused CommandCenter props/imports if they are genuinely unused."
content = re.sub(r'\s*interventions:\s*InterventionMap;\n', '\n', content)
content = content.replace("import { ZoneData, InterventionMap } from '../types';", "import { ZoneData } from '../types';")
content = re.sub(r'\s*interventions,\n', '\n', content)

with open('src/components/CommandCenter.tsx', 'w') as f:
    f.write(content)

