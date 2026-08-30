import re

new_ac = """      {
        input: 'Wingbeat trigger',
        currentCondition: 'Simulated capture trigger',
        contribution: 'None',
        included: false,
        note: 'Used to demonstrate the proposed camera-wake sequence only; not included in the scenario index.'
      },"""

with open('src/utils/riskExplanation.ts', 'r') as f:
    content = f.read()

content = re.sub(r'\{\s*input:\s*\'Acoustic candidate\',[^\}]+},\n', new_ac + '\n', content)

with open('src/utils/riskExplanation.ts', 'w') as f:
    f.write(content)
