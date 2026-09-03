import re

with open('src/utils/riskExplanation.ts', 'r') as f:
    content = f.read()

content = content.replace("calculationType: 'Stored Scenario'", "calculationType: 'Stored Mock Scenario'")

with open('src/utils/riskExplanation.ts', 'w') as f:
    f.write(content)

with open('src/components/evidence/RiskExplanationPanel.tsx', 'r') as f:
    content = f.read()

content = content.replace("{explanation.calculationType}", '{explanation.calculationType === "Stored Mock Scenario" ? "Stored Scenario" : explanation.calculationType}')

with open('src/components/evidence/RiskExplanationPanel.tsx', 'w') as f:
    f.write(content)

