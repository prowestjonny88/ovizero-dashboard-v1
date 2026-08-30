import re

new_items = """
const MATURITY_ITEMS = [
  { area: 'Concept', status: 'Developed', icon: Layers },
  { area: 'Dashboard', status: 'Mock-up available', icon: MonitorSmartphone },
  { area: 'Physical hardware', status: 'Not built', icon: Cpu },
  { area: 'MEMS microphone', status: 'Not built', icon: Volume2 },
  { area: 'Acoustic trigger classifier', status: 'Not trained', icon: Volume2 },
  { area: 'Wingbeat trigger threshold', status: 'Not calibrated', icon: Binary },
  { area: 'Microphone -> camera wake integration', status: 'Not built', icon: Binary },
  { area: 'Egg-count TinyML model', status: 'Not trained', icon: Binary },
  { area: 'End-to-end trigger workflow', status: 'Not tested', icon: FlaskConical },
  { area: 'LoRaWAN integration', status: 'Not started', icon: Radio },
  { area: 'Field validation', status: 'Not started', icon: MapPin },
  { area: 'Experimental egg-control', status: 'Not validated', icon: FlaskConical },
];
"""

with open('src/components/evidence/ProjectMaturity.tsx', 'r') as f:
    content = f.read()

content = re.sub(r'const MATURITY_ITEMS = \[.*?\];', new_items, content, flags=re.DOTALL)

with open('src/components/evidence/ProjectMaturity.tsx', 'w') as f:
    f.write(content)
